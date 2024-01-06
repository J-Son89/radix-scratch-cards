import { useContext } from "react";
import { appState } from "../../appState";
import { instantiateManifest } from "../../manifests/instantiate";

// ************ Instantiate component and fetch component and resource addresses ************
const instantiateComponent = async function ({
    packageAddress,
    accountAddress,
    setState,
    rdt
}) {
    console.log(accountAddress)

    const manifest = instantiateManifest(
        packageAddress,
        accountAddress
    );
    console.log("Instantiate Manifest: ", manifest);

    // Send manifest to wallet for signing
    const result = await rdt.walletApi.sendTransaction({
        transactionManifest: manifest,
        version: 1,
    });
    if (result.isErr()) throw result.error;
    console.log("Instantiate Result: ", result.value);

    // Fetch the transaction status from the Gateway API
    const transactionStatus = await rdt.gatewayApi.transaction.getStatus(
        result.value.transactionIntentHash
    );
    console.log("Instantiate transaction status:", transactionStatus);

    // Fetch the details of changes committed to ledger from Gateway API
    const committedDetails = await rdt.gatewayApi.transaction.getCommittedDetails(
        result.value.transactionIntentHash
    );
    console.log("Instantiate committed details:", committedDetails);

    // Set addresses from details committed to the ledger in the transaction
    const componentAddress = committedDetails.transaction.affected_global_entities[2];
    const ownerBadgeAddress = committedDetails.transaction.affected_global_entities[3];
    const adminResourceAddress =
        committedDetails.transaction.affected_global_entities[4];

    setState((prev) => ({
        ...prev,
        componentAddress,
        ownerBadgeAddress,
        adminResourceAddress,
    }))
    // Show the addresses on the page
    // showAddresses();
    // Update the gumball amount and earnings displayed on the page
    // fetchAndShowGumballMachineState();
};

export const InstantiatePage = () => {
  const {setState,rdt, account, componentAddress,ownerBadgeAddress, adminResourceAddress} = useContext(appState);
    <div>
        <h2>Instantiate Gumball Machine</h2>
        <div class="flex">
            <input type="text" placeholder="package address" id="packageAddress" />
            <button onClick={() => instantiateComponent({
                setState,
                rdt,
                accountAddress: account && account.address,
                packageAddress: "package_tdx_2_1pk0r36pwvch7s0s5f89mmg2dvruhgveg8xmc2xy32ztu5p0jn7xtp6"
            })} id="instantiateComponent">Instantiate Component</button>
        </div>
        <div class="flex">
            <p>Component address:</p>
            <pre id="componentAddress">{componentAddress || "None"}</pre>
        </div>
        <div class="flex">
            <p>Owner Badge address:</p>
            <pre id="ownerBadgeAddress">{ownerBadgeAddress || "None"}</pre>
        </div>
        <div class="flex">
            <p>Admin resource address:</p>
            <pre id="adminResourceAddress">{adminResourceAddress || "None"}</pre>
        </div>
    </div >
}
