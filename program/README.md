# SPQR program

This is a Cairo PoC of a simple UTXO-based private payments program. It allows to generate ZK* proofs of spending and creating new outputs with specific amounts and spending conditions. It is mostly inspired by the Zcash Sapling design, but the functionality is greatly reduced plus there are some extra trust assumptions introduced to speed up the development. It should also be noted that STARK proofs (Keccak hash) + Poseidon hash are the only crypto primitives used, which makes the scheme resistant to quantum algorithms. 

## Installation

### Scarb

Scarb is a Cairo package and compiler toolchain manager.

The quickest installation option is:

```sh
curl --proto '=https' --tlsv1.2 -sSf https://docs.swmansion.com/scarb/install.sh | sh
```

See more options in the [docs](https://docs.swmansion.com/scarb/download.html)

### Foundry

Starknet Foundry is a toolchain for developing smart contracts for Starknet.

Make sure you have [Rust](https://www.rust-lang.org/tools/install) installed!

```sh
curl -L https://raw.githubusercontent.com/foundry-rs/starknet-foundry/master/scripts/install.sh | sh
```

And then run:

```sh
snfoundryup
```

### Cairo runner

Cairo runner is an interpreter that produces all the necessary artifacts for the proving.

```sh
cargo install --git https://github.com/lambdaclass/cairo-vm cairo1-run
```

### Stone prover

STARK One is the most battle tested prover out there, used in production for more than 3 years by Starknet and multiple StarkEx validiums (appchains).

See https://stone-packaging.pages.dev/install/binaries

### Integrity serializer

Integrity is a set of Cairo contracts and a toolchain for recursive proving on Starknet.

```sh
cargo install --git https://github.com/m-kus/integrity-calldata-generator --rev e6206805dfe481cbd8f1fbf2629957ae505a8828 swiftness
```

## Running

### Generate arguments

Depending on the entrypoint:
```
make shield-args
make transfer-args
make unshield-args
```

### Produce execution trace

```
make artifacts
```

### Generate proof

```
make prove
```

### Split proof into chunks

```
make calldata
```

### Register proof on Sepolia

```
make register-fact
```

### Check the proof

Go to https://sepolia.voyager.online/contract/0x16409cfef9b6c3e6002133b61c59d09484594b37b8e4daef7dcba5495a0ef1a#readContract

Paste the fact hash and query the result.