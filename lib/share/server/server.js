var express = require('express');
var app = express();
var http = require('http').Server(app);

// body parser to handle json data
var bodyParser  = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var config = require(process.argv[2]);
var assignedCompute = {};
var assignedInput = {};
var options = {
  logs: true,
  hooks: {
    beforeInitialization: [
      function (jiff, computationId, msg, params) {
        console.log(`Called by party with role: ${msg.role}.`)
        if (params.party_id != null) {
          return params;
        }

        var search = config.protocol.computeParties;
        var check = assignedCompute;
        if (msg.role === 'input') {
          search = config.protocol.inputParties;
          check = assignedInput;
        }

        for (var p = 0; p < search.length; p++) {
          var id = search[p];
          if (check[id] === true) {
            continue;
          }

          check[id] = true;
          params.party_id = id;
          return params;
        }

        return params;
      }
    ]
  }
};

var jiffServer = require(`${config.jiffPath}/lib/jiff-server`);
var jiffServerInstance = new jiffServer(http, options);

if (config.bigNumber.use === true) {
  var jiffBigNumberServer = require(`${config.jiffPath}/lib/ext/jiff-server-bignumber`);
  jiffServerInstance.apply_extension(jiffBigNumberServer);
  app.use('/bignumber.js', express.static(`${config.jiffPath}/node_modules/bignumber.js`));
}

// Serve static files.
// Configure App
app.use('/demos', express.static(`${config.jiffPath}/demos`));
app.use('/dist', express.static(`${config.jiffPath}/dist`));
app.use('/lib/ext', express.static(`${config.jiffPath}/lib/ext`));

http.listen(8080, function () {
  console.log('listening on *:8080');
});

