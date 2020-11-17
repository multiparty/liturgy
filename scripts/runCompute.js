const exec = require('child_process').exec;
const myShellScript =
  exec('node ../lib/compute/compute-party.js /Users/ben/Desktop/dev/HRI/liturgy/scripts/myConfig.json');
myShellScript.stdout.on('data', (data)=>{
    console.log(data);
    // do whatever you want here with data
});
myShellScript.stderr.on('data', (data)=>{
    console.error(data);
});