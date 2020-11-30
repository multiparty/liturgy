const exec = require('child_process').exec;
const myShellScript =
  exec(
    'node ../../lib/combine/server.js ' +
    process.argv[2]
  );
myShellScript.stdout.on('data', (data)=>{
    console.log(data);
    // do whatever you want here with data
});
myShellScript.stderr.on('data', (data)=>{
    console.error(data);
});