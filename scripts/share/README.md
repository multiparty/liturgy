### share 

This collection of scripts runs a single input party with `n` \
compute parties to create `n` output files of shares for that \
data. It will output those shares as `out_<i>.csv` to whichever \
directoy is specified in the `outputPath` field of the input JSON \
config file. 

### config file

An example config file is located in this directory at `config.json`. 

### usage

Run `share.py` as follows:

```shell
(venv) python share.py --cfg <path_to_config_file> --input <path_to_input_file>
```

You'll need to manually kill the server after running this script \
as follows:

```shell
lsof -i:8080
```

This will print out the PIDs of all processes using port 8080, which \
is the port that the JIFF server uses for this script. Kill each process \
via:

```shell
kill -9 <PID>
```
