let combine = require("../../lib/combine");

let cfg = require(process.argv[2]);
let basePath = cfg.protocol.filePath;

for (let i = 0; i < cfg.protocol.allParties.length; i++) {

    let partyConfig = JSON.parse(JSON.stringify(cfg));
    partyConfig.protocol.PID = i + 1;
    partyConfig.protocol.filePath = `${basePath}_${i + 1}.csv`;
    combine.launchClient(partyConfig);
}