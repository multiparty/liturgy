let share = require("../../lib/share");

let cfg = require(process.argv[2]);
for (let i = 0; i < cfg.protocol.allParties.length; i++) {
    cfg.protocol.PID = i + 1;
    share.launchClient(cfg);
}
