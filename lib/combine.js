let fs = require("fs");
let helpers = require("./helpers");
let configure = require("./configure");


let compute = function (jiffInstance, cfg) {

    let inputData = helpers.castToShares(jiffInstance, cfg);
    let computation = Promise.all([inputData]).then( function (shares) {
        return helpers.openShares(jiffInstance, shares[0]).then( function (res) {
            return res;
        });
    });
    return computation.then( function (opened) {
        return opened;
    });
}


let launchClient = function (cfg) {

    let options = configure.configureOptions(cfg);
    options.onConnect = function (jiffInstance) {
        let outputData = compute(jiffInstance, cfg);
        outputData.then( function (payload) {
            let outputPath = `${cfg.outputPath}/reconstructed.csv`;
            fs.writeFile(
                outputPath,
                helpers.formatOutput(payload[0], cfg.protocol.header),
                function (err) {
                    if (err) {
                        console.log(err);
                    }
                }
            );
        });
    }

    let jiffInstance = configure.configureJiffInstance(cfg, options);
    jiffInstance.connect();
}


module.exports = {
    compute: compute,
    launchClient: launchClient
}