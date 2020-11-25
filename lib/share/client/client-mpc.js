(function (exports, node) {
  var jiffInstance;
  exports.connect = function (hostname, computationId, options, config) {

    var opt = Object.assign({}, options);
    opt['crypto_provider'] = config.protocol.preprocessing === false;
    opt['initialization'] = { role: 'input' };
    opt['party_count'] = config.protocol.partyCount;
    opt['autoConnect'] = false;

    if (config.bigNumber.use === true) {
      if (config.protocol.zp === null) {
        console.log("Zp value missing from config.protocol.")
        return;
      }
      var bigNumber = require('bignumber.js');
      options.Zp = new bigNumber(Number(config.protocol.zp));
    }

    if (config.fixedPoint.use === true) {
      options.decimal_digits = parseInt(config.fixedPoint.decimalDigits);
      options.integer_digits = parseInt(config.fixedPoint.integerDigits);
    }

    var jiffClient = require(`${config.jiffPath}/lib/jiff-client.js`);
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
  exports.compute = function (input, config) {

    var fs = require('fs');
    var inputData = [];
    var unparsedData = fs.readFileSync(input, 'UTF-8').trim();
    var rows = unparsedData.split('\n');

    for (let i = 1; i < rows.length; i++) {
      let arr;
      if (config.bigNumber.use === true) {
        arr = rows[i].split(',').map(jiffInstance.helpers.BigNumber);
        console.log(arr);
      } else {
        arr = rows[i].split(',').map(Number);
      }
      inputData.push(arr);
    }
    jiffInstance.share_ND_array(inputData, null, null, config.protocol.computeParties, config.protocol.inputParties);
  };
}((typeof exports === 'undefined' ? this.mpc = {} : exports), typeof exports !== 'undefined'));