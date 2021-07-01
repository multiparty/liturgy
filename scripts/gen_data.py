import csv
import random
import argparse


range_low = 0
range_high = 100


def generate_row(columns: int):
    return [random.randint(range_low, range_high) for _ in range(columns)]


def generate_chunk(columns: int, rows: int = 100):

    return [
        generate_row(columns)
        for _ in range(rows)
    ]


def generate(
        output_path: str,
        header: list,
        rows: int
):

    with open(output_path, "w", encoding="utf-8", newline="") as file_out:

        file_out = csv.writer(file_out)
        chunks = int(rows / 100)
        remainder = rows % 100

        file_out.writerow(header)

        if chunks > 0:
            for _ in range(chunks):
                file_out.writerows(
                    generate_chunk(len(header), 100)
                )

        if remainder:
            file_out.writerows(
                generate_chunk(len(header), remainder)
            )


if __name__ == "__main__":

    parser = argparse.ArgumentParser()

    parser.add_argument("--output_path", action="store")
    parser.add_argument("--header", action="store", type=str)
    parser.add_argument("--rows", action="store", type=int)
    parser.add_argument("--range", action="store")

    args = parser.parse_args()

    if args.header is None:
        raise ValueError("No --header argument supplied, this is a required argument.")

    if args.range is not None:
        r = args.range.split(",")
        range_low = int(r[0])
        range_high = int(r[1])

    header = args.header.split(",")
    generate(args.output_path, header, args.rows)
