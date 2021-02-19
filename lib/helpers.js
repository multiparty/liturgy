let fs = require('fs');


let formatOutput = function (array2d, header) {
    // format 2D array output to CSV file

    let output = "";
    if (header) {
        output += `${header}\n`;
    }

    for (let i = 0; i < array2d.length; i++) {
        for (let j = 0; j < array2d[i].length; j++) {

            let v = array2d[i][j].toString();
            if (j !== array2d[i].length - 1) {
                output += `${v},`;
            } else {
                output += `${v}\n`;
            }
        }
    }

    // remove trailing newline
    return output.slice(0, -1);
}


let addKeepRowsColumn = function (inRel, jiffInstance, bigNumber) {

    for (let i = 0; i < inRel.length; i++) {
        if (bigNumber) {
            inRel[i].push(jiffInstance.helpers.BigNumber(1));
        } else {
            inRel[i].push(1);
        }
    }

    return inRel;
}


let parseInput = function (jiffInstance, cfg) {

    console.log(cfg.protocol.filePath);
    let inputData = fs.readFileSync(cfg.protocol.filePath.trim(), "UTF-8").trim();
    let rows = inputData.split("\n");

    let parsedData = [];

    let startIdx;
    if (cfg.protocol.header) {
        startIdx = 1;
    } else {
        startIdx = 0;
    }

    for (let i = startIdx; i < rows.length; i++) {

        let arr;
        if (cfg.bigNumber.use) {
            arr = rows[i].split(",").map(jiffInstance.helpers.BigNumber);
        } else {
            arr = rows[i].split(",").map(Number);
        }
        parsedData.push(arr);
    }

    return parsedData;
}


let shareData = function (jiffInstance, cfg) {
    /*
    submits shares to the computation. this function is only called for input parties.
     */

    let parsedData = parseInput(jiffInstance, cfg);
    let withKeepRows = addKeepRowsColumn(parsedData, jiffInstance, cfg.bigNumber.use);

    return jiffInstance.share_ND_array(
        withKeepRows,
        null,
        null,
        cfg.protocol.allParties,
        [cfg.protocol.inputParty]
    );
}


let receiveShares = function (jiffInstance, cfg) {
    // receive shares from an input party

    return jiffInstance.share_ND_array(
        null,
        null,
        null,
        cfg.protocol.allParties,
        [cfg.protocol.inputParty]
    );
}


let castToShares = function (jiffInstance, cfg) {

    let parsedData = parseInput(jiffInstance, cfg);
    let numCols = parsedData[0].length;
    let outputShares = [];

    for (let i = 0; i < parsedData.length; i++) {

        let sharesArr = [];
        for (let j = 0; j < numCols; j++) {
            sharesArr.push(
                new jiffInstance.SecretShare(
                    parsedData[i][j],
                    cfg.protocol.allParties,
                    jiffInstance.party_count,
                    jiffInstance.Zp
                )
            );
        }
        outputShares.push(sharesArr);
    }

    return outputShares;
}


let openShares = function (jiffInstance, inRel) {
    // open a secret shared 2D array

    let results = jiffInstance.open_ND_array(inRel);
    return Promise.all([results]).then( function (arr) {

        let ret = [];
        for (let i = 0; i < arr[0].length; i++) {
            ret.push(arr[i]);
        }

        return ret;
    });
}


module.exports = {
    formatOutput: formatOutput,
    addKeepRowsColumn: addKeepRowsColumn,
    parseInput: parseInput,
    shareData: shareData,
    receiveShares: receiveShares,
    castToShares: castToShares,
    openShares: openShares
}