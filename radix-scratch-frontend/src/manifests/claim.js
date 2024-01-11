export const claimManifest = ({
    accountAddress,
    nftAddress,
    componentAddress,
    cardId,
    xrdAddress }
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
 Bucket("bucket_nft");

CALL_METHOD
 Address("${accountAddress}") 
 "withdraw"
 Address("${xrdAddress}") 
 Decimal("0");

TAKE_FROM_WORKTOP 
 Address("${xrdAddress}") 
 Decimal("0.0") 
 Bucket("bucket_xrd");


CALL_METHOD
 Address("${componentAddress}") 
 "claim_prize"
 Bucket("bucket_nft")
 Bucket("bucket_xrd")
 None;

CALL_METHOD
 Address("${accountAddress}") 
 "deposit_batch" 
 Expression("ENTIRE_WORKTOP");
  `


