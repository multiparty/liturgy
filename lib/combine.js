let helpers = require("./helpers");
let configure = require("./configure");


let compute = async function (jiffInstance, cfg, startIdx, chunkSize) {
    // combine this party's shares with other parties', return reconstructed data

    let inputData = helpers.castToShares(jiffInstance, cfg, startIdx, chunkSize);
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
    let numRows = helpers.getNumRows(cfg);
    let chunkSize = cfg.protocol.chunkSize;
    let numChunks = Math.floor(numRows / chunkSize);
    numChunks = (numChunks < 1) ? 1 : numChunks;

    options.onConnect = async function (jiffInstance) {

        let append;
        for (let i = 0; i < numChunks; i++) {

            if (i === 0) {
                append = false;
            } else {
                append = true;
            }

            let outputData = await compute(jiffInstance, cfg, (i * chunkSize), chunkSize);
            if (jiffInstance.id === cfg.protocol.allParties[0]) {
                await helpers.writeOutput(
                    jiffInstance,
                    outputData[0],
                    null,
                    cfg,
                    append
                )
            }
        }

        jiffInstance.disconnect(false, true);
    }

    let jiffInstance = configure.configureJiffInstance(cfg, options);
    jiffInstance.connect();
}


module.exports = {
    compute: compute,
    launchClient: launchClient
}