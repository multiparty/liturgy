let bigNumber = require("bignumber.js");


let configureOptions = function (cfg) {

    let options = {
        party_id: cfg.protocol.PID,
        party_count: cfg.protocol.allParties.length,
        autoConnect: false,
        crypto_provider: !cfg.protocol.preprocessing
    };

    if (cfg.bigNumber.use === true) {
        options.Zp = new bigNumber(cfg.protocol.zp);
    }

    if (cfg.fixedPoint.use === true) {
        options.decimal_digits = parseInt(cfg.fixedPoint.decimalDigits);
        options.integer_digits = parseInt(cfg.fixedPoint.integerDigits);
    }

    return options;
}

let configureJiffInstance = function (cfg, options) {

    if (options === null) {
        options = configureOptions(cfg);
    }

    let serverIp = "localhost";
    if (cfg.protocol.serverIp !== null) {
        serverIp = cfg.protocol.serverIp;
    }
    let serverPort = "8080";
    if (cfg.protocol.serverPort !== null) {
        serverPort = cfg.protocol.serverPort;
    }

    let computationId = "workflow";
    if (cfg.protocol.computationId !== null) {
        computationId = cfg.protocol.computationId;
    }

    let jiffClient = require(`${cfg.jiffPath}/lib/jiff-client`);
    let jiffInstance = new jiffClient(
        `http://${serverIp}:${serverPort}`,
        computationId,
        options
    );

    if (cfg.bigNumber.use === true) {
        let jiffBigNumber = require(`${cfg.jiffPath}/lib/ext/jiff-client-bignumber`);
        jiffInstance.apply_extension(jiffBigNumber, options);
    }

    if (cfg.fixedPoint.use === true) {
        let jiffFixedPoint = require(`${cfg.jiffPath}/lib/ext/jiff-client-fixedpoint`);
        jiffInstance.apply_extension(jiffFixedPoint, options);
    }

    if (cfg.negativeNumber.use === true) {
        let jiffNegativeNumber = require(`${cfg.jiffPath}/lib/ext/jiff-client-negativenumber`);
        jiffInstance.apply_extension(jiffNegativeNumber, options);
    }

    return jiffInstance;
}

module.exports = {
    configureOptions: configureOptions,
    configureJiffInstance: configureJiffInstance
}