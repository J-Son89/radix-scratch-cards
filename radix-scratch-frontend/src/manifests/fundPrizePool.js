export const fundPrizePoolManifest = ({
    accountAddress,
    xrdAddress,
    investmentAmount,
    componentAddress }
) => `
CALL_METHOD
    Address("${accountAddress}")
    "withdraw"
    Address("${xrdAddress}")
    Decimal("${investmentAmount}");

TAKE_FROM_WORKTOP 
    Address("${xrdAddress}")
    Decimal("${investmentAmount}") 
    Bucket("bucket_a");

CALL_METHOD
    Address("${componentAddress}")
    "fund_prize_pool"
    Bucket("bucket_a"); 

CALL_METHOD
    Address("${accountAddress}")
    "deposit_batch" 
    Expression("ENTIRE_WORKTOP");
`
