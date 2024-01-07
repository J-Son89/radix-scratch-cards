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
    #[mutable]
    is_scratched: bool,
    #[mutable]
    is_claimed: bool,
}

#[derive(ScryptoSbor)]
pub struct Batch {
    scratch_cards: Vec<Vault>,
}

#[blueprint]
mod batchgenerator {
    struct BatchGenerator {
        current_batch: Vault,
        // batch_vault: Vault,
        batch_address: ResourceAddress,
        // token_admin: Vault,
        scratch_card_resource_manager: ResourceManager,
        /// The price of each scratch card
        scratch_card_price: Decimal,
        /// A vault that collects all XRD payments
        collected_xrd: Vault,
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
                    ))
                    .mint_roles(
                        mint_roles!(
                        minter => rule!(require(global_caller(component_address)));
                        minter_updater => rule!(deny_all);
                    ))
                    .burn_roles(
                        burn_roles!(
                        burner => rule!(require(global_caller(component_address)));
                        burner_updater => rule!(deny_all);
                    ))
                    .non_fungible_data_update_roles(
                        non_fungible_data_update_roles!(
                        non_fungible_data_updater => rule!(require(global_caller(component_address)));
                        non_fungible_data_updater_updater => rule!(deny_all);
                    ))
                    .create_with_no_initial_supply();

            (Self {
                scratch_card_resource_manager,
                batch_address: scratch_card_resource_manager.address(),
                current_batch: Vault::new(scratch_card_resource_manager.address()),
                scratch_card_price: (50).into(),
                collected_xrd: Vault::new(XRD),
            })
                .instantiate()
                .prepare_to_globalize(OwnerRole::None)
                .with_address(address_reservation)
                .globalize()
        }

        pub fn make_batch(&mut self) {
            // TODO return owner badge for batch sales
            let mut initial_supply = [0; 10];
            for (index, _element) in initial_supply.iter_mut().enumerate() {
                let new_card = self.scratch_card_resource_manager.mint_non_fungible(
                    &IntegerNonFungibleLocalId::new(index as u64).into(),
                    Self::create_scratchcard(index)
                );
                self.current_batch.put(new_card);
            }
        }

        pub fn get_batches(&self) -> Vault {
            self.batch_address
        }

        pub fn purchase(&mut self, mut payment: Bucket) -> (Bucket, Bucket) {
            assert!(
                self.current_batch.amount() > dec!("0"),
                "must be at least one scratchcard availble to buy"
            );

            self.collected_xrd.put(payment.take(self.scratch_card_price));

            let nft_bucket = self.current_batch.take(1);
            (nft_bucket, payment)
        }

        fn create_scratchcard(index: usize) -> ScratchCard {
            let random_seed = index; // TODO: obtain from oracle
            ScratchCard {
                prize: Self::random_rarity(random_seed as u64),
                is_scratched: false,
                is_claimed: false,
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

        pub fn scratch(
            &mut self,
            nft_bucket: Bucket,
            local_id: Option<NonFungibleLocalId>
        ) -> Bucket {
            assert!(nft_bucket.amount() == dec!("1"), "We can only scratch one card each time");

            let nft_local_id: NonFungibleLocalId = match local_id {
                Some(n) => n,
                None => nft_bucket.as_non_fungible().non_fungible_local_id(),
            };
            let resource_manager: ResourceManager = self.scratch_card_resource_manager;

            let non_fungible_data: ScratchCard = nft_bucket.as_non_fungible().non_fungible().data();
            assert!(non_fungible_data.is_scratched == false, "Card already scratched");

            resource_manager.update_non_fungible_data(&nft_local_id, "is_scratched", true);

            nft_bucket
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
            assert!(non_fungible_data.is_scratched == true, "Card must be scratched first");
            assert!(non_fungible_data.is_claimed == false, "Prize already claimed");

            let resource_manager: ResourceManager = self.scratch_card_resource_manager;

            resource_manager.update_non_fungible_data(&nft_local_id, "is_claimed", true);

            let prize_amount = Self::prize_amount_from_rarity(&non_fungible_data.prize);

            payment_bucket.put(self.collected_xrd.take(prize_amount));

            (nft_bucket, payment_bucket)
        }
    }
}
