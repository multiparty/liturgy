console.log('Command line arguments: [/path/to/configuration/file.json] [computation_id]');

var fs = require('fs');
var config = require(process.argv[2]);
var computationId = process.argv[3];
if (computationId == null) {
  computationId = 'test';
}

var allParties = config.protocol.computeParties.concat(config.protocol.inputParties);
var jiffClient = require(`${config.jiffPath}/lib/jiff-client.js`);
let opt = {
  crypto_provider: config.protocol.preprocessing === false,
  party_count: config.protocol.party_count,
  initialization: {role: 'compute'}
}

var jiffInstance = new jiffClient('http://localhost:8080', computationId, opt);

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

var format2d = function (array2d){
  var output = '';
  for (var i=0; i < array2d.length; i++){
    for (var j=0; j < array2d[i].length; j++) {
      output += array2d[i][j].toString() + ',';
    }
    //remove the last comma and replace it with a new line
    output = output.slice(0, -1) + '\n';
  }
  //remove trailing new line
  return output.slice(0, -1);
}

// the computation code
var compute = function () {
  jiffInstance.wait_for(allParties, function () {
    var shares =
      jiffInstance.share_ND_array(null, null, null, config.protocol.computeParties, config.protocol.inputParties);
    var computation = Promise.all([shares]).then( function (arr) {
      // assumes there's only 1 input party since we're just sharing a single dataset
      var allShares = arr[0][config.protocol.inputParties[0]];
      let content = [];
      // Make nested promise explicit.
      let promise = new Promise(function (resolve) {
        // assuming a proper matrix and not a jagged array
        let count = allShares.length * allShares[0].length;
        for (let i = 0; i < allShares.length; i++) {
          content[i] = [];
          for (let j = 0; j < allShares[i].length; j++) {
            allShares[i][j].wThen(function (i, j) {
              content[i][j] = allShares[i][j].value;
              count--;
              if (count === 0) {
                resolve(content);
              }
            }.bind(null, i, j));
          }
        }
      });
      // Handle nested promise explicitly.
      promise.then(function (content) {
        var output = `${config.outputPath}/out_${jiffInstance.id}.csv`;
        fs.writeFile(output, format2d(content), function (err) {
          if (err) {
            console.log(err);
          }
        });
      });
    });
  });
};
// wait only for the compute parties to preprocess
jiffInstance.wait_for(config.protocol.computeParties, function () {
  compute();
});