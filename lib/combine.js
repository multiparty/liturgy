let helpers = require("./helpers");
let configure = require("./configure");


let compute = function (jiffInstance, cfg) {
    // combine this party's shares with other parties', return reconstructed data

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
    // configure and run client process, write output to file

    let options = configure.configureOptions(cfg);
    options.onConnect = function (jiffInstance) {
        let outputData = compute(jiffInstance, cfg);
        outputData.then( function (payload) {

            // just have one party write output
            if (jiffInstance.id === cfg.protocol.allParties[0]) {
                helpers.writeOutput(
                    jiffInstance,
                    payload[0],
                    null,
                    cfg
                );
            }
            jiffInstance.disconnect(false, true);
        });
    }

    let jiffInstance = configure.configureJiffInstance(cfg, options);
    jiffInstance.connect();
}


module.exports = {
    compute: compute,
    launchClient: launchClient
}