#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, token};

#[contracttype]
#[derive(Clone)]
pub struct Booking {
    pub customer: Address,
    pub stylist: Address,
    pub token: Address,
    pub amount: i128,
    pub is_completed: bool,
    pub is_refunded: bool,
}

#[contract]
pub struct AuraStyleContract;

#[contractimpl]
impl AuraStyleContract {
    /// Lock funds in escrow when a booking is created.
    pub fn book_style(
        env: Env,
        customer: Address,
        stylist: Address,
        token_addr: Address,
        amount: i128,
    ) {
        customer.require_auth();
        assert!(amount > 0, "Amount must be positive");

        let client = token::Client::new(&env, &token_addr);
        client.transfer(&customer, &env.current_contract_address(), &amount);

        env.storage().instance().set(
            &customer,
            &Booking {
                customer,
                stylist,
                token: token_addr,
                amount,
                is_completed: false,
                is_refunded: false,
            },
        );
    }

    /// Customer (or AI oracle) confirms service — releases funds to stylist.
    pub fn complete_service(env: Env, customer: Address) {
        customer.require_auth();

        let mut booking: Booking = env
            .storage()
            .instance()
            .get(&customer)
            .expect("No booking found");

        assert!(!booking.is_completed, "Already completed");
        assert!(!booking.is_refunded, "Already refunded");

        let client = token::Client::new(&env, &booking.token);
        client.transfer(
            &env.current_contract_address(),
            &booking.stylist,
            &booking.amount,
        );

        booking.is_completed = true;
        env.storage().instance().set(&customer, &booking);
    }

    /// Refund customer if stylist cancels or no-shows.
    pub fn refund(env: Env, customer: Address) {
        customer.require_auth();

        let mut booking: Booking = env
            .storage()
            .instance()
            .get(&customer)
            .expect("No booking found");

        assert!(!booking.is_completed, "Service already completed");
        assert!(!booking.is_refunded, "Already refunded");

        let client = token::Client::new(&env, &booking.token);
        client.transfer(
            &env.current_contract_address(),
            &booking.customer,
            &booking.amount,
        );

        booking.is_refunded = true;
        env.storage().instance().set(&customer, &booking);
    }

    /// Read a booking by customer address.
    pub fn get_booking(env: Env, customer: Address) -> Booking {
        env.storage()
            .instance()
            .get(&customer)
            .expect("No booking found")
    }
}
