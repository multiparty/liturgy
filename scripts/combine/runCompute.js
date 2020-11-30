const exec = require('child_process').exec;
const myShellScript =
  exec(
    'node ../../lib/combine/party.js ' +
    `${process.argv[2]} ${process.argv[3]} ${process.argv[4]}`
  );
myShellScript.stdout.on('data', (data)=>{
    console.log(data);
});
myShellScript.stderr.on('data', (data)=>{
    console.error(data);
});
