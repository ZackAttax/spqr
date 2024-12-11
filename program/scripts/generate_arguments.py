import argparse
from poseidon_py.poseidon_hash import poseidon_hash_many


def generate_shield_args(args):
    res = {
        "variant_id": 0,
        "shield_args": {
            "output_note": {
                "amount": str(args.amount),
                "spending_pk": args.spending_pk,
                "nonce": args.nonce,
            }
        }
    }
    print(format_cairo1_run(flatten_tuples(serialize(res))))


def generate_transfer_args(args):
    input_spending_pk = hex(poseidon_hash_many([int(args.spending_sk, 16)]))
    res = {
        "variant_id": 1,
        "transfer_args": {
            "input_note_1": {
                "amount": str(args.input_amount),
                "spending_pk": input_spending_pk,
                "nonce": args.input_nonce,
            },
            "input_note_2": {
                "amount": str(0),
                "spending_pk": input_spending_pk,
                "nonce": args.input_nonce,
            },
            "output_note_1": {
                "amount": str(args.output_amount),
                "spending_pk": args.output_spending_pk,
                "nonce": args.output_nonce,
            },
            "output_note_2": {
                "amount": str(args.input_amount - args.output_amount),
                "spending_pk": input_spending_pk,
                "nonce": args.change_output_nonce,
            },
            "spending_sk": args.spending_sk,
        }
    }
    print(format_cairo1_run(flatten_tuples(serialize(res))))


def generate_unshield_args(args):
    spending_pk = hex(poseidon_hash_many([int(args.spending_sk, 16)]))
    res = {
        "variant_id": 2,
        "unshield_args": {
            "input_note": {
                "amount": str(args.amount),
                "spending_pk": spending_pk,
                "nonce": args.nonce,
            },
            "spending_sk": args.spending_sk,
        }
    }
    print(format_cairo1_run(flatten_tuples(serialize(res))))


def serialize(obj):
    """Serializes Cairo data in JSON format to a Python object with reduced types.
    Supports the following conversions:
        integer -> int  # felt252
        dec string (0-9) -> (int, int) -> u256 = { lo: felt252, hi: felt252 }
        str -> hash  # felt252
        list -> tuple(len(list), *list)
        dict -> tuple(dict.values)
    """
    if isinstance(obj, int):
        # This covers u8, u16, u32, u64, u128, felt252
        assert obj >= 0 and obj < 2**252
        return obj
    elif isinstance(obj, str):
        if obj.isdigit():
            num = int(obj)
            assert num >= 0 and num < 2**256
            lo = num % 2**128
            hi = num // 2**128
            return (lo, hi)
        elif obj.startswith("0x"):
            src = bytes.fromhex(obj[2:].rjust(64, "0"))
            hash = int.from_bytes(src, "big")
            return hash
        else:
            raise NotImplementedError(obj)
    elif isinstance(obj, list):
        arr = list(map(serialize, obj))
        return tuple([len(arr)] + arr)
    elif isinstance(obj, dict):
        return tuple(map(serialize, obj.values()))
    elif isinstance(obj, tuple):
        return obj
    elif obj is None:
        # Option::None
        return 1
    else:
        raise NotImplementedError(obj)


def flatten_tuples(src) -> list:
    """Recursively flattens tuples.
    Example: (0, (1, 2), [(3, 4, [5, 6])]) -> [0, 1, 2, [3, 4, [5, 6]]]

    :param src: an object that can be int|list|tuple or their nested combination.
    :return: an object that can only contain integers and lists, top-level tuple converts to a list.
    """
    res = []

    def append_obj(obj, to):
        if isinstance(obj, int):
            to.append(obj)
        elif isinstance(obj, list):
            inner = []
            for item in obj:
                append_obj(item, inner)
            to.append(inner)
        elif isinstance(obj, tuple):
            for item in obj:
                append_obj(item, to)
        else:
            raise NotImplementedError(obj)

    append_obj(src, res)
    return res


def format_cairo1_run(args: list) -> str:
    """Formats arguments for usage with cairo1-run.
    Example: [0, 1, [2, 3, 4]] -> "[0 1 [2 3 4]]"

    :param args: Python object containing already processed arguments.
    :return: Returns string with removed commas.
    """

    def format_item(item):
        if isinstance(item, list):
            arr = " ".join(map(format_item, item))
            return f"[{arr}]"
        else:
            return str(item)

    return format_item(args)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate SPQR program arguments")
    subparsers = parser.add_subparsers(dest="command", help="Available commands")

    parser_a = subparsers.add_parser("shield", help="Generate arguments for shielding tokens")
    parser_a.add_argument("--amount", type=int, required=True, help="Token amount")
    parser_a.add_argument("--spending_pk", type=str, required=True, help="Public key of the spender")
    parser_a.add_argument("--nonce", type=int, required=True, help="Random nonce (private)")
    parser_a.set_defaults(func=generate_shield_args)

    parser_b = subparsers.add_parser("transfer", help="Generate arguments for transferring tokens")
    parser_b.add_argument("--input_amount", type=int, required=True, help="Amount of the spent note")
    parser_b.add_argument("--spending_sk", type=str, required=True, help="Secret key of the spender")
    parser_b.add_argument("--input_nonce", type=int, required=True, help="Random nonce (private) of the spent note")
    parser_b.add_argument("--output_amount", type=int, required=True, help="Token amount to be sent to the receiver")
    parser_b.add_argument("--output_spending_pk", type=str, required=True, help="Public key of the receiver")
    parser_b.add_argument("--output_nonce", type=int, required=True, help="Random nonce (private) for the receiver")
    parser_b.add_argument("--change_output_nonce", type=int, required=True, help="Random nonce (private) for change")
    parser_b.set_defaults(func=generate_transfer_args)

    parser_c = subparsers.add_parser("unshield", help="Generate arguments for unshielding tokens")
    parser_c.add_argument("--amount", type=int, required=True, help="Token amount")
    parser_c.add_argument("--spending_sk", type=str, required=True, help="Secret key of the spender")
    parser_c.add_argument("--nonce", type=int, required=True, help="Random nonce (private)")
    parser_c.set_defaults(func=generate_unshield_args)

    args = parser.parse_args()

    if args.command is None:
        parser.print_help()
    else:
        args.func(args)
