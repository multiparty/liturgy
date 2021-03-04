# share demo
This guide will focus only on using the scripts included here. For more details about
the specific functions invoked, refer to the top-level README file in this library. The
output of this demo is a single file with whatever name is given at `protocol.outputPath` \
of the input config. For this demo, that file is `reconstructed.csv`.

## run demo
Begin by populating the missing fields of cfg.json (protocol.filePath, jiffPath,
and outputPath).

Then, open one terminal window, cd to this directory, and run:

```shell
node server.js <path_to_cfg.json>
```

Open another terminal window, cd to this directory, and run:

```shell
node compute.js <path_to_cfg.json>
```

The output file `reconstructed.csv` will be written to this directory.