export const purchaseManifest = (
    accountAddress,
    xrdAddress,
    componentAddress,
  ) => `
CALL_METHOD
    Address("${accountAddress}") 
    "withdraw"
    Address("${xrdAddress}") 
    Decimal("50")
    ;
TAKE_FROM_WORKTOP 
    Address("${xrdAddress}") 
    Decimal("50.0") 
    Bucket("bucket_a")
    ;
CALL_METHOD
    Address("${componentAddress}")  
    "purchase"
    Bucket("bucket_a")
    ;
CALL_METHOD
    Address("${accountAddress}")
    "deposit_batch" 
    Expression("ENTIRE_WORKTOP")
    ;
`
