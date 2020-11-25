(function (exports, node) {

  var jiffInstance;
  exports.connect = function (hostname, computationId, options, config) {

    var opt = Object.assign({}, options);
    opt.crypto_provider = true;
    opt.warn = false;

    var jiffClient = require(`${config.jiffPath}/lib/jiff-client`);
    opt.autoConnect = false;
    jiffInstance = new jiffClient(hostname, computationId, opt);
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

  exports.compute = function (input, config) {

    var fs = require('fs');
    var inputData = [];
    var unparsedData = fs.readFileSync(input, 'UTF-8').trim();
    var rows = unparsedData.split('\n');

    for (let i = 0; i < rows.length; i++) {
      let arr = rows[i].split(',').map(Number);
      let shares = [];
      for (let j = 0; j < arr.length; j++) {
        shares.push(
          new jiffInstance.SecretShare(
            arr[j],
            config.protocol.computeParties,
            config.protocol.computeParties.length,
            config.protocol.zp
          )
        )
      }
      inputData.push(shares);
    }

    var computation = Promise.all([inputData]).then( function (d) {
      return open(d[0]);
    })

    return computation.then(function (opened) {
      return opened;
    })

  };
}((typeof exports === 'undefined' ? this.mpc = {} : exports), typeof exports !== 'undefined'));
