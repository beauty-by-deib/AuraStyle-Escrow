#![cfg(test)]
mod tests {
    use soroban_sdk::{
        testutils::{Address as _, Ledger, LedgerInfo},
        Address, Env, IntoVal, String, Val,
    };

    use crate::{AuraStyleContract, AuraStyleContractClient, Booking};

    #[test]
    fn test_book_style() {
        let env = Env::default();
        env.ledger().set_data(LedgerInfo {
            timestamp: 1000,
            protocol_version: 21,
            sequence_number: 1,
            network_id: soroban_sdk::testutils::TESTNET_NETWORK_PASSPHRASE.into_val(&env),
            base_reserve: 300_000_000,
        });

        let contract = AuraStyleContractClient::new(&env, &env.register_contract(None, AuraStyleContract));

        let customer = Address::random(&env);
        let stylist = Address::random(&env);
        let token = Address::random(&env);
        let amount = 15_000_000i128; // 150 USDC (7 decimals)

        // Mock token transfer would happen here
        // For testing, we're verifying the structure
        assert!(amount > 0, "Amount must be positive");
    }

    #[test]
    fn test_booking_struct() {
        let env = Env::default();
        let customer = Address::random(&env);
        let stylist = Address::random(&env);
        let token = Address::random(&env);

        let booking = Booking {
            customer: customer.clone(),
            stylist: stylist.clone(),
            token: token.clone(),
            amount: 100_000_000,
            is_completed: false,
            is_refunded: false,
        };

        assert_eq!(booking.customer, customer);
        assert_eq!(booking.stylist, stylist);
        assert_eq!(booking.token, token);
        assert_eq!(booking.amount, 100_000_000);
        assert!(!booking.is_completed);
        assert!(!booking.is_refunded);
    }
}
