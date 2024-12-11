use core::hash::{HashStateTrait, HashStateExTrait, Hash};
use core::poseidon::{PoseidonTrait, HashState};
use core::serde::Serde;
use starknet::ContractAddress;

#[derive(Drop, Serde, Debug)]
enum Arguments {
    Shield: ShieldArguments,
    Transfer: TransferArguments,
    Unshield: UnshieldArguments,
}

#[derive(Drop, Serde, Debug)]
enum Result {
    Shield: ShieldResult,
    Transfer: TransferResult,
    Unshield: UnshieldResult,
}

#[derive(Drop, Serde, Debug)]
struct ShieldArguments {
    output_note: Note,
}

#[derive(Drop, Serde, Debug)]
struct TransferArguments {
    input_note_1: Note,
    input_note_2: Note,
    output_note_1: Note,
    output_note_2: Note,
    spending_sk: felt252,
}

#[derive(Drop, Serde, Debug)]
struct UnshieldArguments {
    input_note: Note,
    spending_sk: felt252,
    receiver_address: ContractAddress,
}

#[derive(Drop, Serde, Debug, Hash)]
struct Note {
    amount: u256,
    spending_pk: felt252,
    nonce: felt252,
}

#[derive(Drop, Serde, Debug)]
struct ShieldResult {
    output_note_commitment: felt252,
    amount: u256,
}

#[derive(Drop, Serde, Debug)]
struct TransferResult {
    input_note_commitment_1: felt252,
    input_note_commitment_2: felt252,
    output_note_commitment_1: felt252,
    output_note_commitment_2: felt252,
}

#[derive(Drop, Serde, Debug)]
struct UnshieldResult {
    input_note_commitment: felt252,
    amount: u256,
    receiver_address: ContractAddress,
}

fn main(mut arguments: Array<felt252>) -> Array<felt252> {
    let mut arguments = arguments.span();
    let args: Arguments = Serde::deserialize(ref arguments).expect('Failed to deserialize');
    assert(arguments.is_empty(), 'deserialization error');

    let result: Result = match args {
        Arguments::Shield(shield_args) => {
            Result::Shield(ShieldResult {
                amount: shield_args.output_note.amount,
                output_note_commitment: poseidon_hash(shield_args.output_note),
            })
        },
        Arguments::Transfer(transfer_args) => {
            let spending_pk = poseidon_hash(transfer_args.spending_sk);
            assert(spending_pk == transfer_args.input_note_1.spending_pk, 'cannot spend input1');
            assert(spending_pk == transfer_args.input_note_2.spending_pk, 'cannot spend input2');

            let input_amount = transfer_args.input_note_1.amount + transfer_args.input_note_2.amount;
            let output_amount = transfer_args.output_note_1.amount + transfer_args.output_note_2.amount;
            assert(input_amount == output_amount, 'amount mismatch');

            Result::Transfer(TransferResult {
                input_note_commitment_1: poseidon_hash(transfer_args.input_note_1),
                input_note_commitment_2: poseidon_hash(transfer_args.input_note_2),
                output_note_commitment_1: poseidon_hash(transfer_args.output_note_1),
                output_note_commitment_2: poseidon_hash(transfer_args.output_note_2),
            })
        },
        Arguments::Unshield(unshield_args) => {
            let spending_pk = poseidon_hash(unshield_args.spending_sk);
            assert(spending_pk == unshield_args.input_note.spending_pk, 'cannot spend input');

            Result::Unshield(UnshieldResult {
                amount: unshield_args.input_note.amount,
                input_note_commitment: poseidon_hash(unshield_args.input_note),
                receiver_address: unshield_args.receiver_address,
            })
        }
    };

    let mut output = Default::default();
    result.serialize(ref output);

    output
}

fn poseidon_hash<V, +Hash<V, HashState>, +Drop<V>>(value: V) -> felt252 {
    PoseidonTrait::new().update_with(value).finalize()
}
