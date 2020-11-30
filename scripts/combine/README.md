### combine

This collection of scripts runs `n` compute parties to reconstruct
a secret from `n` input shares.

### config file

An example config file is located in this directory at `config.json`. 

### usage

Run server:
```shell script
node runServer.js <path to config file>
```

Run `n` compute parties:
```shell script
node runCompute.js <path to config file> <path to input file> <party id>
```

The output will be in this directory at `reconstructed.csv`