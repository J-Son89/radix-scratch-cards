export const purchaseManifest = ({
    accountAddress,
    xrdAddress,
    componentAddress,
    sellerId,
}
) => `
CALL_METHOD
    Address("${accountAddress}") 
    "withdraw"
    Address("${xrdAddress}") 
    Decimal("55")
    ;
TAKE_FROM_WORKTOP 
    Address("${xrdAddress}") 
    Decimal("55.0") 
    Bucket("bucket_a")
    ;
CALL_METHOD
    Address("${componentAddress}")  
    "purchase"
    Bucket("bucket_a")
    ${sellerId}u64
    ;
CALL_METHOD
    Address("${accountAddress}")
    "deposit_batch" 
    Expression("ENTIRE_WORKTOP")
    ;
`
