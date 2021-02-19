(function (exports, node) {

  var jiffInstance;
  exports.connect = function (hostname, computationId, options, config) {

    var opt = Object.assign({}, options);
    opt.crypto_provider = true;
    opt.warn = false;

    var jiffClient = require(`${config.jiffPath}/lib/jiff-client.js`);
    opt.autoConnect = false;
    jiffInstance = new jiffClient(hostname, computationId, opt);

    if (config.bigNumber.use === true) {
      let jiffBigNumber = require(`${config.jiffPath}/lib/ext/jiff-client-bignumber`);
      jiffInstance.apply_extension(jiffBigNumber, opt);
    }

    if (config.fixedPoint.use === true) {
      let jiffFixedPoint = require(`${config.jiffPath}/lib/ext/jiff-client-fixedpoint`);
      jiffInstance.apply_extension(jiffFixedPoint, opt);
    }

    if (config.negativeNumber.use === true) {
      let jiffNegativeNumber = require(`${config.jiffPath}/lib/ext/jiff-client-negativenumber`);
      jiffInstance.apply_extension(jiffNegativeNumber, opt);
    }

    jiffInstance.connect();
    return jiffInstance;
  };

  const open = function (inRel) {

    var results = jiffInstance.open_ND_array(inRel);
    return Promise.all([results]).then(function (arr) {
      var openedRes = arr[0];
      var ret = [];

      for (var i = 0; i < openedRes.length; i++) {
        ret.push(openedRes[i]);
      }

      return ret;
    });
  };

  function truncate(num, accuracy) {
    var numStr = num.toString();
    var numParts = numStr.split('.');
    var truncdNum;
    if (numParts.length > 1) {
      truncdNum = numParts[0] + '.' + numParts[1].substring(0, accuracy);
    } else {
      truncdNum = numParts[0]
    }
    return truncdNum;
  }

  exports.compute = function (input, config) {

    var fs = require('fs');
    var inputData = [];
    var unparsedData = fs.readFileSync(input, 'UTF-8').trim();
    var rows = unparsedData.split('\n');

    // skip header
    for (let i = 1; i < rows.length; i++) {
      let arr;
      if (config.bigNumber.use === true) {
        arr = rows[i].split(',').map(jiffInstance.helpers.BigNumber);
      } else {
        arr = rows[i].split(',').map(Number);
      }
      let shares = [];
      for (let j = 0; j < arr.length; j++) {
        shares.push(
          new jiffInstance.SecretShare(
            arr[j],
            config.protocol.computeParties,
            jiffInstance.party_count,
            jiffInstance.Zp
          )
        )
      }
      inputData.push(shares);
    }

    var computation = Promise.all([inputData]).then( function (d) {
      return open(d[0]).then(function(res) {
        if (config.fixedPoint.use) {
          let ret = [];
          var precision = jiffInstance.decimal_digits;
          var shift = jiffInstance.helpers.magnitude(precision);
          for (let i = 0; i < res.length; i++) {
            let arr = [];
            for (let j = 0; j < res[i].length; j++) {
              let v = truncate(res[i][j].div(shift), precision);
              arr.push(v)
            }
            ret.push(arr);
          }
          return ret;
        } else {
          return res;
        }
      });
    })

    return computation.then(function (opened) {
      return opened;
    })

  };
}((typeof exports === 'undefined' ? this.mpc = {} : exports), typeof exports !== 'undefined'));
