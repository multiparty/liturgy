let fs = require('fs');
let helpers = require("./helpers");
let configure = require("./configure");


let compute = function (jiffInstance, cfg) {

    let shares;
    if (jiffInstance.id === cfg.protocol.inputParty) {
        shares = helpers.shareData(
            cfg.protocol.filePath,
            jiffInstance,
            cfg.bigNumber.use,
            cfg.protocol.inputParty,
            cfg.protocol.allParties
        );
    } else {
        shares = helpers.receiveShares(
            jiffInstance,
            cfg.protocol.inputParty,
            cfg.protocol.allParties
        );
    }

    let computation = Promise.all([shares])
        .then( function (arr) {

        let allShares = arr[0][cfg.protocol.inputParty];
        let payload = [];
        let promise = new Promise( function (resolve) {

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
        promise.then( function (payload) {

            let outputPath = `${cfg.outputPath}/out_${jiffInstance.id}.csv`;
            fs.writeFile(
                outputPath,
                helpers.formatOutput(payload, cfg.protocol.header),
                function (err) {
                    if (err) {
                        console.log(err);
                    }
                }
            );
        });
    });
}

let launchClient = function (cfg) {

    let options = configure.configureOptions(cfg);
    options.onConnect = function (jiffInstance) {
        compute(jiffInstance, cfg);
    }

    let jiffInstance = configure.configureJiffInstance(cfg, options);
    jiffInstance.connect();
}

module.exports = {
    compute: compute,
    launchClient: launchClient
}