let express = require("express");
let http = require("http");

let launchServer = function (cfg) {

    let app = express();
    let httpServer = http.Server(app);

    let jiffServer = require(`${cfg.jiffPath}/lib/jiff-server`);
    let serverInstance = new jiffServer(httpServer, { logs: true });

    if (cfg.bigNumber.use === true) {

        let jiffBigNumber = require(`${cfg.jiffPath}/lib/ext/jiff-server-bignumber`);
        serverInstance.apply_extension(jiffBigNumber);
        app.use("/bignumber.js", express.static(`${cfg.jiffPath}/node_modules/bignumber.js`));
    }

    app.use("/demos", express.static(`${cfg.jiffPath}/demos`));
    app.use("/dist", express.static(`${cfg.jiffPath}/dist`));
    app.use("/lib/ext", express.static(`${cfg.jiffPath}/lib/ext`));

    let serverPort = 8080;
    if (cfg.protocol.serverPort != null) {
        serverPort = cfg.protocol.serverPort;
    }
    httpServer.listen(serverPort, function () {
        console.log(`Listening on *:${serverPort}`);
    });
}

module.exports = {
    launchServer: launchServer
}
