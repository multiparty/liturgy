console.log('Command line arguments: <input> [<party count> [<computation_id> [<party id>]]]]');
var mpc = require('./client-mpc');

var config = require(process.argv[2]);
var input = process.argv[3];

var partyId = process.argv[4];
if (partyId == null) {
  partyId = config.protocol.inputParties[0];
}

var computationId = process.argv[5];
if (computationId == null) {
  computationId = "test";
}

// JIFF options
var options = { party_id: partyId };

if (config.bigNumber.use === true) {
  if (config.protocol.zp === null) {
    console.log("Zp value missing from config.protocol.")
    return;
  }
  var bigNumber = require('bignumber.js');
  options.Zp = new bigNumber(Number(config.protocol.zp));
} else if (config.protocol.zp !== null) {
  config.zp = Number(config.protocol.zp);
}

if (config.fixedPoint.use === true) {
  options.decimal_digits = config.fixedPoint.decimalDigits;
  options.integer_digits = config.fixedPoint.integerDigits;
}

options.onConnect = function () {
  mpc.compute(input, config);
};

// Connect
mpc.connect('http://localhost:8080', computationId, options, config);
