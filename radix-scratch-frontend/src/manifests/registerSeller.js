export const registerSellerManifest = ({
  componentAddress,
  accountAddress,
  xrdResource,
  sellerName,
}) => `
CALL_METHOD
    Address("${accountAddress}")  
    "withdraw"
    Address("${xrdResource}") 
    Decimal("0");

TAKE_FROM_WORKTOP 
    Address("${xrdResource}")
    Decimal("0") 
    Bucket("bucket_a");

CALL_METHOD
    Address("${componentAddress}")
    "register_seller"
    Bucket("bucket_a")
    "${sellerName}"; 

CALL_METHOD
    Address("${accountAddress}")
    "deposit_batch" 
    Expression("ENTIRE_WORKTOP");
`
