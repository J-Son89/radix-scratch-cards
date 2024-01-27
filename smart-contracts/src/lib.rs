use scrypto::prelude::*;

#[derive(ScryptoSbor)]
pub enum Prize {
    NoPrize,
    FreeCard,
    TenX,
    OneHundredX,
}

#[derive(NonFungibleData, ScryptoSbor)]
pub struct ScratchCard {
    prize: Prize,
    // #[mutable]
    // is_scratched: bool,
    #[mutable]
    is_claimed: bool,
}


#[derive(NonFungibleData, ScryptoSbor)]
pub struct SellerNFT {
    name: String,
}

#[derive(ScryptoSbor)]
pub struct Batch {
    scratch_cards: Vec<Vault>,
}

#[blueprint]
mod batchgenerator {
    struct BatchGenerator {
        scratch_card_resource_manager: ResourceManager,
        /// The price of each scratch card
        scratch_card_price: Decimal,
        sellers_fee_price: Decimal,
        max_prize: Decimal,
        index: u64,
        collected_xrd: Vault,
        funding_bucket: Vault,
        seller_addresses: HashMap<u64, Vault>,
        seller_resource_manager: ResourceManager,
        seller_index: u64,
    }
    impl BatchGenerator {
        pub fn instantiate_scratchcard() -> Global<BatchGenerator> {
            let (address_reservation, component_address) = Runtime::allocate_component_address(
                BatchGenerator::blueprint_id()
            );

            let scratch_card_resource_manager =
                ResourceBuilder::new_integer_non_fungible::<ScratchCard>(OwnerRole::None)
                    .metadata(
                        metadata!(
                        init {
                            "name" => "Scratch Cards".to_owned(), locked;
                        }
                    )
                    )
                    .mint_roles(
                        mint_roles!(
                        minter => rule!(allow_all);
                        minter_updater => rule!(deny_all);
                    )
                    )
                    .burn_roles(
                        burn_roles!(
                        burner => rule!(require(global_caller(component_address)));
                        burner_updater => rule!(deny_all);
                    )
                    )
                    .non_fungible_data_update_roles(
                        non_fungible_data_update_roles!(
                        non_fungible_data_updater => rule!(require(global_caller(component_address)));
                        non_fungible_data_updater_updater => rule!(deny_all);
                    )
                    )
                    .create_with_no_initial_supply();

            let seller_resource_manager = ResourceBuilder::new_integer_non_fungible::<SellerNFT>(
                OwnerRole::None
            )
                .metadata(
                    metadata!(
                            init {
                                "name" => "Seller of Scratchs Cards".to_owned(), locked;
                            }
                        )
                )
                .mint_roles(
                    mint_roles!(
                            minter => rule!(allow_all);
                            minter_updater => rule!(deny_all);
                        )
                )
                .burn_roles(
                    burn_roles!(
                            burner => rule!(require(global_caller(component_address)));
                            burner_updater => rule!(deny_all);
                        )
                )
                .non_fungible_data_update_roles(
                    non_fungible_data_update_roles!(
                            non_fungible_data_updater => rule!(require(global_caller(component_address)));
                            non_fungible_data_updater_updater => rule!(deny_all);
                        )
                )
                .create_with_no_initial_supply();

            (Self {
                scratch_card_resource_manager,
                funding_bucket: Vault::new(XRD),
                scratch_card_price: (50).into(),
                sellers_fee_price: (5).into(),
                collected_xrd: Vault::new(XRD),
                max_prize: (1000).into(),
                index: 0,
                seller_addresses: HashMap::new(),
                seller_resource_manager,
                seller_index: 0,
            })
                .instantiate()
                .prepare_to_globalize(OwnerRole::None)
                .with_address(address_reservation)
                .globalize()
        }

        pub fn register_seller(&mut self, sellers_bucket: Bucket, name:String) -> Bucket {
            
            let seller_nft = self.seller_resource_manager.mint_non_fungible(
                &IntegerNonFungibleLocalId::new(self.seller_index as u64).into(),
                Self::create_seller(name)
            );
            
            self.seller_addresses.insert(
                self.seller_index,
                Vault::with_bucket(sellers_bucket)
            );
            self.seller_index +=1;

            seller_nft
        }

        pub fn fund_prize_pool(&mut self, mut funding_bucket: Bucket) -> Bucket {
            self.funding_bucket.put(funding_bucket.take(funding_bucket.amount()));
            funding_bucket
        }

        pub fn purchase(
            &mut self,
            mut payment: Bucket,
            seller_index: u64
        ) -> (Bucket, Bucket) {
            self.collected_xrd.put(payment.take(self.scratch_card_price));

            let sellers_vault = self.seller_addresses.get_mut(&seller_index);
            if let Some(vault) = sellers_vault {
                vault.put(payment.take(self.sellers_fee_price));
            } else {
                // Handle the case where sellers_vault is None
                // This is optional depending on your application logic
                println!("sellers_vault is None");
            }

            let new_card = self.scratch_card_resource_manager.mint_non_fungible(
                &IntegerNonFungibleLocalId::new(self.index as u64).into(),
                Self::create_scratchcard(self.index.try_into().unwrap())
            );
            self.index = self.index + 1;
            (new_card, payment)
        }

        fn create_scratchcard(index: usize) -> ScratchCard {
            let random_seed = index; // TODO: obtain from oracle
            ScratchCard {
                prize: Self::random_rarity(random_seed as u64),
                is_claimed: false,
            }
        }

        fn create_seller( name: String) -> SellerNFT {
            SellerNFT {
                name,
            }
        }

        fn random_rarity(seed: u64) -> Prize {
            match seed % 4 {
                0 => Prize::NoPrize,
                1 => Prize::FreeCard,
                2 => Prize::TenX,
                3 => Prize::OneHundredX,
                _ => panic!(),
            }
        }

        fn prize_amount_from_rarity(prize: &Prize) -> Decimal {
            match prize {
                Prize::NoPrize => Decimal::zero(),
                Prize::FreeCard => Decimal::one(),
                Prize::TenX => scrypto::prelude::Decimal::from(10),
                Prize::OneHundredX => scrypto::prelude::Decimal::from(100),
            }
        }

        pub fn claim_prize(
            &mut self,
            nft_bucket: Bucket,
            mut payment_bucket: Bucket,
            local_id: Option<NonFungibleLocalId>
        ) -> (Bucket, Bucket) {
            assert!(nft_bucket.amount() == dec!("1"), "We can only scratch one card each time");

            let nft_local_id: NonFungibleLocalId = match local_id {
                Some(n) => n,
                None => nft_bucket.as_non_fungible().non_fungible_local_id(),
            };

            let non_fungible_data: ScratchCard = nft_bucket.as_non_fungible().non_fungible().data();
            assert!(non_fungible_data.is_claimed == false, "Prize already claimed");

            let resource_manager: ResourceManager = self.scratch_card_resource_manager;

            resource_manager.update_non_fungible_data(&nft_local_id, "is_claimed", true);

            let prize_amount = Self::prize_amount_from_rarity(&non_fungible_data.prize);

            payment_bucket.put(self.collected_xrd.take(prize_amount));

            (nft_bucket, payment_bucket)
        }
    }
}
