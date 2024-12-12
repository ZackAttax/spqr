# SPQR contracts

This is a Cairo PoC of a simple shielded transaction pool resembling Zcash.  
Notable distinction:
- We use STARK proofs and abstract their verification via registry proof (Integrity)
- We use simple note commitment map instead of incremental tree
- Nullifiers are not used so some data about spent notes is leaked
- A single transaction always has two inputs and two outputs (for simplicity)
- Transactions are stored on the client and hence are not encrypted
- No viewing keys (hence no auditing feature)
- STARK based signature scheme

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

## Deployment

```sh
make declare
```

Update the class hash in the Makefile if necessary and run:

```sh
make deploy
```

## Run step by step

### Approve STRK

Go to https://sepolia.voyager.online/contract/0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d#writeContract (STRK token contract), select "approve", enter the deployed contract address and the amount of tokens.

### Shield

Go to the contract page, e.g. https://sepolia.voyager.online/contract/0x00d02030c9964d185dbd80047f1fc95e949b68e0dacf0ba05071cbfcd36265b8#writeContract

Select "shield_amount" entrypoint.

Enter the parameters:
- `amount` (42)
- `note_hash` (0x754ac441612445c48d79fa5bb22c5e2560c4ba44965436d08acfd3d91cf5cca) — hash of the note you are spending
- `residue` (0x5, 0x0, 0x2a, 0x0, 0x545d6f7d28a8a398e543948be5a026af60c4dea482867a6eeb2525b35d1e1e1, 0x7b) — workaround for cairo1-run private input issue

### Transfer

Select "transfer" entrypoint.

Enter the parameters:
- `note_hash_1` (0x754ac441612445c48d79fa5bb22c5e2560c4ba44965436d08acfd3d91cf5cca)
- `note_hash_2` (0xe2b33228cfa7d1395a3210d97e1d57af7921646b91aea80b97caa310fa9706)
- `note_hash_3` (0x180e9e64505e61d9fd87a2f60b443971862197d2396038620b99a936eea7f79)
- `note_hash_4` (0x77ea950b7f12f27c0da054234c7d96e595ece30ea781ef984ee84bbfa3972d4)
- `residue` (0x12, 0x1, 0x2a, 0x0, 0x545d6f7d28a8a398e543948be5a026af60c4dea482867a6eeb2525b35d1e1e1, 0x7b, 0x0, 0x0, 0x545d6f7d28a8a398e543948be5a026af60c4dea482867a6eeb2525b35d1e1e1, 0x7b, 0x15, 0x0, 0x579e8877c7755365d5ec1ec7d3a94a457eff5d1f40482bbe9729c064cdead2, 0x141, 0x15, 0x0, 0x545d6f7d28a8a398e543948be5a026af60c4dea482867a6eeb2525b35d1e1e1, 0xea, 0x0)

### Unshield

Select "unshield" entrypoint.

Enter the parameters:
- `amount` (21)
- `note_hash` (0x180e9e64505e61d9fd87a2f60b443971862197d2396038620b99a936eea7f79) — spent note
- `receiver` (0x1a62446e05ee60540d94b2e731ed037a1798065f9b8e719e293180b493b91f7) — the Starknet address of the receiver of ERC20 token
- `residue` (0x7 0x2 0x15 0x0 0x579e8877c7755365d5ec1ec7d3a94a457eff5d1f40482bbe9729c064cdead2 0x141 0x1 0x1a62446e05ee60540d94b2e731ed037a1798065f9b8e719e293180b493b91f7)
