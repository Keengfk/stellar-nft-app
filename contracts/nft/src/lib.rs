#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, String};

#[contracttype]
#[derive(Clone)]
pub struct TokenMetadata {
    pub name: String,
    pub description: String,
    pub image_uri: String,
}

#[contracttype]
pub enum DataKey {
    Owner(u32),
    Metadata(u32),
    NextId,
}

#[contract]
pub struct NFTContract;

#[contractimpl]
impl NFTContract {

    pub fn mint(env: Env, to: Address, name: String, description: String, image_uri: String) -> u32 {
        to.require_auth();

        let next_id: u32 = env.storage().instance().get(&DataKey::NextId).unwrap_or(0);

        let metadata = TokenMetadata { name, description, image_uri };

        env.storage().persistent().set(&DataKey::Owner(next_id), &to);
        env.storage().persistent().set(&DataKey::Metadata(next_id), &metadata);
        env.storage().instance().set(&DataKey::NextId, &(next_id + 1));

        next_id
    }

    pub fn owner_of(env: Env, token_id: u32) -> Address {
        env.storage().persistent().get(&DataKey::Owner(token_id))
            .expect("token does not exist")
    }

    pub fn token_metadata(env: Env, token_id: u32) -> TokenMetadata {
        env.storage().persistent().get(&DataKey::Metadata(token_id))
            .expect("token does not exist")
    }

    pub fn transfer(env: Env, from: Address, to: Address, token_id: u32) {
        from.require_auth();

        let current_owner: Address = env.storage().persistent().get(&DataKey::Owner(token_id))
            .expect("token does not exist");

        if current_owner != from {
            panic!("not the owner of this token");
        }

        env.storage().persistent().set(&DataKey::Owner(token_id), &to);
    }

    pub fn total_supply(env: Env) -> u32 {
        env.storage().instance().get(&DataKey::NextId).unwrap_or(0)
    }
  }
