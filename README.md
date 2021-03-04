# liturgy
Utility for serializing secret shares from plaintext data using the [JIFF](https://github.com/multiparty/jiff) library.


## configure

All three main modules of this library (`server`, `share`, and `combine`) accept a single \
configuration file structure, which looks like the following:

```json
{
  "protocol": {
    "inputHeader": bool,                 
    "outputHeader": <bool, string>,     
    "addKeepRowsCol": <bool>,               
    "allParties": <list<int>>,
    "inputParty": <int>,
    "zp": <int>,
    "preprocessing": <bool>,
    "serverPort": <int>,
    "serverIp": <string>,
    "computationId": <string>,
    "filePath": <string>            // path to input file
  },
  "jiffPath": <string>,             // path to jiff lib
  "outputPath": <string>            // path to output file(s)
  "bigNumber": {
    "use": <bool>
  },
  "fixedPoint": {
    "use": <bool>,
    "decimalDigits": <int>,
    "integerDigits": <int>
  },
  "negativeNumber": {
    "use": <bool>
  }
}
```

* The `outputPath` value functions slightly differently for `share` vs `combine` workflows. \
  In a `share` workflow, it's important not to include the file extension, since multiple share \
  files will be written. So, you'll want something like `"outputPath": "/Users/Me/Desktop/out"`, \
  which will produce files `out_1.csv`, ... `out_n.csv` (with `n` equal to the number of compute \
  parties). For `combine` workflows, however, having a file extension is fine, since only a single \
  output file is written to disk.
  
* The `bigNumber`, `fixedPoint`, and `negativeNumber` values trigger the use of various JIFF \
  extensions of the same names. For specific documentation on what they are and how to use them \
  refer to the JIFF [API](https://multiparty.org/jiff/docs/jsdoc/) documentation.


## server

This library comes with a server module at `lib/server.js` that can construct an appropriate \
JIFF server for sharing data or combining shares, given a configuration file like the one above. \
Launching a server is very simple:

```javascript
let server = require("lib/server");

let cfg = require(process.argv[2]);
server.launchServer(cfg);
```


## share

The share module at `lib/share.js` contains a `compute` function, which handles data ingestion \
and sharing, and a `launchClient` function which wraps `compute` and then writes the output to file. \
like the server module, it is also very straightforward to use: 

```javascript
let share = require("lib/share");

let cfg = require(process.argv[2]);
share.launchClient(cfg);
```

This functionality can be composed within a single file as well (which is illustrated in the demo at \
`scripts/share/compute.js`).


## combine

Like the share module, the combine module at `lib/combine.js` contains both `compute` and a `launchClient` \
functions. The behavior of these functions just inverts the behavior of share, in that it consumes share
files and outputs a single plaintext dataset. Invoking the module is also analogous to share:

```javascript
let combine = require("lib/combine");

let cfg = require(process.argv[2]);
combine.launchClient(cfg);
```

This functionality can also be composed within a single file, though slightly differently than how it \
is done with the share module. The main difference is that multiple input files are being ingested for \
the combine workflow, so if you want to use a single config file, you need to do some manual work to \
edit the input paths for each compute party. The script at `scripts/combine/compute.js` illustrates \
how to do this.


