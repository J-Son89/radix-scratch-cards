export const scratchManifest = (
  accountAddress,
  nftAddress,
  componentAddress,
  cardId
) => `
CALL_METHOD
  Address("${accountAddress}") 
  "withdraw_non_fungibles"
    Address("${nftAddress}") 
     Array<NonFungibleLocalId>(
        NonFungibleLocalId("${cardId}")
    );

TAKE_FROM_WORKTOP 
    Address("${nftAddress}")
    Decimal("1") 
    Bucket("bucket_a");

CALL_METHOD
    Address("${componentAddress}")
    "scratch"
    Bucket("bucket_a")
    None;

CALL_METHOD
     Address("${accountAddress}") 
    "deposit_batch" 
    Expression("ENTIRE_WORKTOP");
`





