import subprocess
import os
import argparse
import json
import time


if __name__ == "__main__":

    parser = argparse.ArgumentParser()
    parser.add_argument("--cfg", action="store")
    parser.add_argument("--input", action="store")

    current_dir = f"{os.path.dirname(os.path.realpath(__file__))}"
    base_dir = "/".join(current_dir.split("/")[:-2])
    lib_dir = f"{base_dir}/lib/"

    args = parser.parse_args()

    cfg = json.loads(open(args.cfg, "r").read())
    compute_parties = cfg["protocol"]["computeParties"]
    input_parties = cfg["protocol"]["inputParties"]

    server_process = \
        subprocess.Popen(["node", f"{lib_dir}/share/server/server.js", args.cfg], stdout=subprocess.PIPE)

    time.sleep(10)

    for ip in input_parties:
        subprocess.Popen(["node", f"{lib_dir}/share/client/client-party.js", args.cfg, args.input])

    for cp in compute_parties:
        subprocess.Popen(["node", f"{lib_dir}/share/compute/compute-party.js", args.cfg])
