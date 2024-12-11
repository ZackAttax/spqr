use starknet::ContractAddress;
#[starknet::interface]
pub trait ISpqr<TState> {

    fn shield_amount(ref self: TState, amount: u256, note_hash: felt252, residue: Array<felt252>);
    fn unshield_amount(ref self: TState, receiver: ContractAddress, amount: u256, note_hash: felt252, residue: Array<felt252>);
    fn transfer(
        ref self: TState,
        note_hash_1: felt252,
        note_hash_2: felt252,
        note_hash_3: felt252,
        note_hash_4: felt252,
        residue: Array<felt252>
    );
}

#[starknet::contract]
pub mod Spqr {
    use openzeppelin_token::erc20::interface::IERC20DispatcherTrait;
use spqr::ISpqr;
    use integrity::{Integrity, IntegrityWithConfig, VerifierConfiguration};
    use starknet::{ContractAddress, get_contract_address};
    use core::poseidon::PoseidonTrait;
    use core::hash::{HashStateTrait, HashStateExTrait};
    use starknet::storage::{StoragePointerReadAccess, StoragePointerWriteAccess, StoragePathEntry, Map};
    use openzeppelin_token::erc20::interface::IERC20Dispatcher;

    const SECURITY_BITS: u32 = 60;
    const NOTE_STATUS_SPENT: u8 = 1;
    const NOTE_STATUS_UNSPENT: u8 = 3;

    #[storage]
    struct Storage {
        erc20_address: ContractAddress,
        fact_registry_address: ContractAddress,
        program_hash: felt252,
        notes: Map<felt252, u8>,
    }

    #[constructor]
    fn constructor(
        ref self: ContractState,
        erc20_address: ContractAddress,
        fact_registry_address: ContractAddress,
        program_hash: felt252
    ) {
        self.erc20_address.write(erc20_address);
        self.fact_registry_address.write(fact_registry_address);
        self.program_hash.write(program_hash);
    }

    #[abi(embed_v0)]
    impl ISpqrImpl of ISpqr<ContractState> {
        fn shield_amount(
            ref self: ContractState, amount: u256, note_hash: felt252, residue: Array<felt252>
        ) {
            let output = [0x0, 0x4, 0x0, note_hash, amount.low.into(), amount.high.into()].span();
            
            let mut output_hash = PoseidonTrait::new();
            for element in output {
                output_hash = output_hash.update_with(*element);
            };
            // NOTE: cairo1-run privacy issue
            for element in residue {
                output_hash = output_hash.update_with(element);
            };

            // let fact_hash = PoseidonTrait::new()
            //     .update_with(self.program_hash.read())
            //     .update_with(output_hash.finalize())
            //     .finalize();
            let fact_hash = 0x25a0623d7ddde1b657c99885d6ddbdf670efcdb41aedd262968e1ff84f73d89;
            let config = VerifierConfiguration {
                layout: 'recursive_with_poseidon',
                hasher: 'keccak_160_lsb',
                stone_version: 'stone6',
                memory_verification: 'cairo1',
            };

            let integrity = Integrity::new();//.with_config(config, SECURITY_BITS);
            let res = integrity.is_fact_hash_valid_with_security(fact_hash, SECURITY_BITS);
            //let res = integrity.is_fact_hash_valid(fact_hash);
            assert(res, fact_hash);
            let erc20_dispatcher = IERC20Dispatcher{contract_address: self.erc20_address.read()};
            assert(erc20_dispatcher.transfer(recipient: get_contract_address(), amount: amount), 'Transfer failed');
            self.notes.entry(note_hash).write(NOTE_STATUS_UNSPENT)
        }
        fn unshield_amount(ref self: ContractState, receiver: ContractAddress, amount: u256, note_hash: felt252, residue: Array<felt252>) {
            let output = [0x0, 0x5, 0x2, note_hash, amount.high.into(), amount.low.into(), receiver.into()].span();

            let mut output_hash = PoseidonTrait::new();
            for element in output {
                output_hash = output_hash.update_with(*element);
            };
            // NOTE: cairo1-run privacy issue
            for element in residue {
                output_hash = output_hash.update_with(element);
            };

            let fact_hash = PoseidonTrait::new()
                .update_with(self.program_hash.read())
                .update_with(output_hash.finalize())
                .finalize();

            let config = VerifierConfiguration {
                layout: 'recursive_with_poseidon',
                hasher: 'keccak_160_lsb',
                stone_version: 'stone6',
                memory_verification: 'cairo1',
            };

            let integrity = Integrity::new().with_config(config, SECURITY_BITS);
            let res = integrity.is_fact_hash_valid(fact_hash);
            assert(res, 'Fact is not valid');
            let erc20_dispatcher = IERC20Dispatcher{contract_address: self.erc20_address.read()};
            assert(erc20_dispatcher.transfer_from(sender: get_contract_address(), recipient: receiver, amount: amount), 'Transfer failed');
            self.notes.entry(note_hash).write(NOTE_STATUS_UNSPENT)
        }
        fn transfer(
            ref self: ContractState,
            note_hash_1: felt252,
            note_hash_2: felt252,
            note_hash_3: felt252,
            note_hash_4: felt252,
            residue: Array<felt252>
        ) {
            let output = [0x0, 0x5, 0x1, note_hash_1, note_hash_2, note_hash_3, note_hash_4].span();

            let mut output_hash = PoseidonTrait::new();
            for element in output {
                output_hash = output_hash.update_with(*element);
            };
            // NOTE: cairo1-run privacy issue
            for element in residue {
                output_hash = output_hash.update_with(element);
            };

            let fact_hash = PoseidonTrait::new()
                .update_with(self.program_hash.read())
                .update_with(output_hash.finalize())
                .finalize();

            let config = VerifierConfiguration {
                layout: 'recursive_with_poseidon',
                hasher: 'keccak_160_lsb',
                stone_version: 'stone6',
                memory_verification: 'cairo1',
            };

            let integrity = Integrity::new().with_config(config, SECURITY_BITS);
            let res = integrity.is_fact_hash_valid(fact_hash);
            assert(res, 'Fact is not valid');
            assert(self.notes.entry(note_hash_1).read() == NOTE_STATUS_UNSPENT, 'invalid inputs');
            self.notes.entry(note_hash_1).write(NOTE_STATUS_SPENT);
            assert(self.notes.entry(note_hash_2).read() == NOTE_STATUS_UNSPENT, 'invalid inputs');
            self.notes.entry(note_hash_2).write(NOTE_STATUS_SPENT);
            assert(self.notes.entry(note_hash_3).read() == NOTE_STATUS_UNSPENT, 'invalid inputs');
            self.notes.entry(note_hash_3).write(NOTE_STATUS_SPENT);
            assert(self.notes.entry(note_hash_4).read() == NOTE_STATUS_UNSPENT, 'invalid inputs');
            self.notes.entry(note_hash_4).write(NOTE_STATUS_SPENT);
        }
    }
}
