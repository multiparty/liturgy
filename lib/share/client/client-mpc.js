(function (exports, node) {
  var jiffInstance;
  exports.connect = function (hostname, computationId, options, config) {

    var opt = Object.assign({}, options);
    opt['crypto_provider'] = config.protocol.preprocessing === false;
    opt['initialization'] = { role: 'input' };
    opt['party_count'] = config.protocol.partyCount;
    opt['autoConnect'] = false;

    var jiffClient = require(`${config.jiffPath}/lib/jiff-client.js`);
    jiffInstance = new jiffClient(hostname, computationId, opt);
    jiffInstance.connect();
    return jiffInstance;
  };
  exports.compute = function (input, config) {

    var fs = require('fs');
    var inputData = [];
    var unparsedData = fs.readFileSync(input, 'UTF-8').trim();
    var rows = unparsedData.split('\n');

    for (let i = 1; i < rows.length; i++) {
      let arr = rows[i].split(',').map(Number);
      inputData.push(arr);
    }
    jiffInstance.share_ND_array(inputData, null, null, config.protocol.computeParties, config.protocol.inputParties);
  };
}((typeof exports === 'undefined' ? this.mpc = {} : exports), typeof exports !== 'undefined'));