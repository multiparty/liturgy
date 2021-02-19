let helpers = require("./helpers");
let configure = require("./configure");


let compute = function (jiffInstance, cfg) {
    // generate or receive shares and return this party's shares

    let shares;
    if (jiffInstance.id === cfg.protocol.inputParty) {
        shares = helpers.shareData(jiffInstance, cfg);
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

let launchClient = function (cfg) {
    // configure and run client process, write output to file

    let options = configure.configureOptions(cfg);
    options.onConnect = function (jiffInstance) {
        let outputData = compute(jiffInstance, cfg);
        outputData.then( function (payload) {
            helpers.writeOutput(
                jiffInstance,
                payload,
                `out_${jiffInstance.id}`,
                cfg
            );
            jiffInstance.disconnect(false, true);
        })
    }

    let jiffInstance = configure.configureJiffInstance(cfg, options);
    jiffInstance.connect();
}

module.exports = {
    compute: compute,
    launchClient: launchClient
}