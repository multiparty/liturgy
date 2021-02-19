let fs = require('fs');


let formatOutput = function (array2d, header) {
    // format 2D array output to CSV file

    let output = "";
    if (header !== null) {
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


let shareData = function (filePath, jiffInstance, useBigNumber, inputParty, allParties) {
    /*
    submits shares to the computation. this function is only called for input parties.
     */

    let inputData = fs.readFileSync(filePath.trim(), "UTF-8").trim();
    let rows = inputData.split("\n");

    let parsedData = [];
    // loop assumes header exists
    for (let i = 1; i < rows.length; i++) {

        let arr;
        if (useBigNumber) {
            arr = rows[i].split(",").map(jiffInstance.helpers.BigNumber);
            // keepRows data is tracked in last column
            arr.push(jiffInstance.helpers.BigNumber(1));
        } else {
            arr = rows[i].split(",").map(Number);
            // keepRows data is tracked in last column
            arr.push(1);
        }
        parsedData.push(arr);
    }

    return jiffInstance.share_ND_array(parsedData, null, null, allParties, [inputParty]);
}


let receiveShares = function (jiffInstance, inputParty, allParties) {
    // receive shares from an input party
    return jiffInstance.share_ND_array(null, null, null, allParties, [inputParty]);
}


module.exports = {
    formatOutput: formatOutput,
    shareData: shareData,
    receiveShares: receiveShares
}