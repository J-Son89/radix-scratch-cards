export const createBatchManifest = (
  componentAddress,
  accountAddress,
) => `
CALL_METHOD
Address("${componentAddress}") 
"make_batch"
;
CALL_METHOD
Address("${accountAddress}")
"deposit_batch" 
Expression("ENTIRE_WORKTOP")
;`;
