#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype,
    symbol_short, Address, Env, Symbol,
};

// Storage key type for the fuel ledger
#[contracttype]
pub enum DataKey {
    Fuel(Address),
}

#[contract]
pub struct GasStationContract;

#[contractimpl]
impl GasStationContract {
    /// Deposit fuel (XLM-equivalent units) for a user
    /// Increments the stored balance and emits a refuel event
    pub fn deposit(env: Env, user: Address, amount: i128) {
        // Require the user address to sign this transaction
        user.require_auth();

        // Read current fuel level (default 0 if not found)
        let key = DataKey::Fuel(user.clone());
        let current: i128 = env.storage().instance().get(&key).unwrap_or(0);
        let new_total = current + amount;

        // Persist the new total
        env.storage().instance().set(&key, &new_total);

        // Emit the refuel event: (topic: ("refuel", user), data: amount)
        env.events().publish(
            (Symbol::new(&env, "refuel"), user),
            amount,
        );
    }

    /// Read the stored fuel balance for a user
    pub fn get_fuel(env: Env, user: Address) -> i128 {
        let key = DataKey::Fuel(user);
        env.storage().instance().get(&key).unwrap_or(0)
    }
}

mod test {
    #[allow(unused_imports)]
    use super::*;
    #[allow(unused_imports)]
    use soroban_sdk::testutils::Address as _;

    #[test]
    fn test_deposit_and_get_fuel() {
        let env = Env::default();
        env.mock_all_auths();
        let contract_id = env.register_contract(None, GasStationContract);
        let client = GasStationContractClient::new(&env, &contract_id);

        let user = Address::generate(&env);

        // Initially zero
        assert_eq!(client.get_fuel(&user), 0);

        // Deposit 100
        client.deposit(&user, &100);
        assert_eq!(client.get_fuel(&user), 100);

        // Deposit 50 more
        client.deposit(&user, &50);
        assert_eq!(client.get_fuel(&user), 150);
    }
}
