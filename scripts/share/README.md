### share 

This collection of scripts runs a single input party with `n`
compute parties to create `n` output files of shares for that
data. It will output those shares as `out_<i>.csv` to whichever
directoy is specified in the `outputPath` field of the input JSON
config file. 

### config file

An example config file is located in this directory at `config.json`. 

### usage

Run server:
```shell script
node runServer.js <path to config file>
```

Run client:
```shell script
node runClient.js <path to config file> <path to input file>
```

Run `n` compute parties:
```shell script
node runCompute.js <path to config file>
```

You'll have to manually kill all processes after the output files have
been created, I haven't yet figured out how to have them wait to exit until
the protocol has finished.