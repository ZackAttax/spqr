#[starknet_contract]
pub mod Spqr {
    use spqr::ISqqr;

    #[storage]
    struct Storage {
        
    }


    #[constructor]
    fn constructor(ref self: ContractState, erc20_address: ContractAddress, fact_registry_address: ContractAddress, program_hash: felt252) -> {

    }
}