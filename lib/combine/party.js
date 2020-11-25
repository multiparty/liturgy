console.log('Command line arguments: <input> [<party count> [<computation_id> [<party id>]]]]');

var mpc = require('./mpc');
var fs = require('fs')
var config = require(process.argv[2]);
var input = process.argv[3];
var partyId = parseInt(process.argv[4], 10);

var computationId = process.argv[5];
if (computationId == null) {
  computationId = "test";
}

// JIFF options
var options = { party_count: config.protocol.computeParties.length, party_id: partyId };

if (config.bigNumber.use === true) {
  if (config.protocol.zp === null) {
    console.log("Zp value missing from config.protocol.")
    return;
  }
  var bigNumber = require('bignumber.js');
  config.protocol.zp = new bigNumber(Number(config.protocol.zp));
  options.Zp = new bigNumber(Number(config.protocol.zp));
} else if (config.protocol.zp !== null) {
  config.protocol.zp = Number(config.protocol.zp);
}

if (config.fixedPoint.use === true) {
  options.decimal_digits = parseInt(config.fixedPoint.decimalDigits);
  options.integer_digits = parseInt(config.fixedPoint.integerDigits);
}

var format_2d = function (array_2d){
  var output = '';

  for (var i=0; i < array_2d.length; i++){
    for (var j=0; j < array_2d[i].length; j++) {
      output += array_2d[i][j].toString() + ',';
    }
    //remove the last comma and replace it with a new line
    output = output.slice(0, -1) + '\n';
  }
  //remove trailing new line
  return output.slice(0, -1);
}

options.onConnect = function (jiffInstance) {
  var promise = mpc.compute(input, config);
  promise.then(function (v) {

    if (jiffInstance.id === config.protocol.computeParties[0]) {
      var output = `reconstructed.csv`;
      fs.writeFile(output, format_2d(v), function(err) {
        if (err) {
          console.log(err);
        }
      });
    }
    jiffInstance.disconnect(false, true);
  });
};

// Connect
mpc.connect('http://localhost:8080', computationId, options, config);
