var express = require('express');
var app = express();
var http = require('http').Server(app);

var config = require(process.argv[2]);
var jiffServer = require(`${config.jiffPath}/lib/jiff-server`);
var jiffServerInstance = new jiffServer(http, { logs: true });

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