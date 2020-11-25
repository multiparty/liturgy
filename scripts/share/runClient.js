const exec = require('child_process').exec;
const myShellScript =
  exec(
    'node ../../lib/share/client/client-party.js ' +
    '/Users/ben/Desktop/dev/HRI/liturgy/scripts/share/myConfig.json ' +
    '/Users/ben/Desktop/dev/HRI/liturgy/scripts/share/in.csv'
  );
myShellScript.stdout.on('data', (data)=>{
    console.log(data);
    // do whatever you want here with data
});
myShellScript.stderr.on('data', (data)=>{
    console.error(data);
});