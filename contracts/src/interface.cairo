use starknet::ContractAddress;

#[starknet::interface]
pub trait ISpqr<TState> {
    fn shield_amount(ref: self, amount: u256, commit_hash: felt252, fact: felt252);
    fn unshield_amount(ref: self, commit_hash: felt252, fact: felt252);
    fn transfer(ref: self, note_hash_1, note_hash_2, note_hash_3, note_hash_4);
}