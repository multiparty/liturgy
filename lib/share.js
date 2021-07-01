let helpers = require("./helpers");
let configure = require("./configure");


let compute = async function (jiffInstance, cfg, startIdx, chunkSize) {
    // generate or receive shares and return this party's shares

    let shares;
    if (jiffInstance.id === cfg.protocol.inputParty) {
        shares = helpers.shareData(jiffInstance, cfg, startIdx, chunkSize);
    } else {
        shares = helpers.receiveShares(
            jiffInstance,
            cfg
        );
    }

    let computation = Promise.all([shares])
        .then( function (arr) {

        let allShares = arr[0][cfg.protocol.inputParty];
        let payload = [];
        return new Promise( function (resolve) {

            let count = allShares.length * allShares[0].length;
            for (let i = 0; i < allShares.length; i++) {
                payload[i] = [];
                for (let j = 0; j < allShares[i].length; j++) {
                    allShares[i][j].wThen( function (i, j) {
                        payload[i][j] = allShares[i][j].value;
                        count--;

                        if (count === 0) {
                            resolve(payload);
                        }
                    }.bind(null, i, j));
                }
            }
        });
    });
    return computation.then( function (payload) {
        return payload;
    })
}

let launchClient = async function (cfg) {
    // configure and run client process, write output to file

    let options = configure.configureOptions(cfg);
    let numRows = helpers.getNumRows(cfg);
    let chunkSize = cfg.protocol.chunkSize;
    let numChunks = Math.floor(numRows / chunkSize);
    numChunks = (numChunks < 1) ? 1 : numChunks;

    options.onConnect = async function (jiffInstance) {

        let append;
        for (let i = 0; i < numChunks; i++) {

            let step = jiffInstance.start_barrier();

            if (i === 0) {
                append = false;
            } else {
                append = true;
            }

            let outputData = await compute(jiffInstance, cfg, (i * chunkSize), chunkSize);
            await helpers.writeOutput(
                jiffInstance,
                outputData,
                `out_${jiffInstance.id}`,
                cfg,
                append
            );

            await jiffInstance.end_barrier(step);
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