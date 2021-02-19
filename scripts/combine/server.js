let server = require("../../lib/server");

let cfg = require(process.argv[2]);
server.launchServer(cfg);