# share demo

This guide will focus only on using the scripts included here. For more details about \
the specific functions invoked, refer to the top-level README file in this library. The \
output of this demo is 3 files that contain shares of the file `in.csv` contained in this \
directory.

## run demo

Begin by populating the missing fields of `cfg.json` (`protocol.filePath`, `jiffPath`, \
and `outputPath`).

Then, open one terminal window, `cd` to this directory, and run:

```shell
node server.js <path_to_cfg.json>
```

Open another terminal window, `cd` to this directory, and run:

```shell
node compute.js <path_to_cfg.json>
```

The output files `out_1.csv`, `out_2.csv`, and `out_3.csv` will be written to this directory.