# Scalable Private Quantum Resistant Payments App

When was the last time you thought about the Roman Empire?

![SPQR](./docs/assets/spqr.png)

SPQR is a proof-of-concept of privacy payments on Starknet, utilizing STARKs and native account abstraction for integrity and confidentiality.

## Overview

## Components

## Flow

## Notes on privacy

1. `cairo1-run` runner copies all inputs to the output segment which leads to the privacy leak. This is a known issue, which is resolved with the new version of `cairo-executor` that is able to produce execution trace (for proving).
2. Proofs that are generated with Stone leak some bits of the trace because polynomial randomization is not implemented. Read more in https://github.com/starkware-libs/stone-prover/issues/8#issuecomment-1766480334 also https://eprint.iacr.org/2024/1037
3. Nullifiers are not used (for simplicity) and hence some information about spent notes is leaked.
4. Transaction fees are not subsidized (but it is envisioned) so submitting a proof/private transfer might leak a connection between a Starknet account and a particular note.
5. Transactions are not encrypted (but they are note stored onchain either).