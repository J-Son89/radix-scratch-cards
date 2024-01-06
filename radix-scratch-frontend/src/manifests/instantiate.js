export const instantiateManifest = (
    packageAddress,
    accountAddress,
  ) => `
  CALL_FUNCTION
  Address("${packageAddress}")
  "BatchGenerator"
  "instantiate_scratchcard"
;
CALL_METHOD
  Address("${accountAddress}")
  "deposit_batch"
  Expression("ENTIRE_WORKTOP")
;`;
