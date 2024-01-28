import { useContext } from "react";
import { appState } from "../../appState";
import { instantiateManifest } from "../../manifests/instantiate";
import styles from './style.module.css';
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { Input } from "../../components/Input/Input";
import { Button } from "../../components/Button/Button";
import { fundPrizePoolManifest } from "../../manifests/fundPrizePool";

// ************ Instantiate component and fetch component and resource addresses ************
const instantiateComponent = async function ({
    packageAddress,
    accountAddress,
    setState,
    rdt
}) {

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
    const componentAddress = committedDetails.transaction.affected_global_entities[1];
    const ownerBadgeAddress = committedDetails.transaction.affected_global_entities[3];
    const adminResourceAddress =
        committedDetails.transaction.affected_global_entities[4];

    setState((prev) => ({
        ...prev,
        componentAddress,
        ownerBadgeAddress,
        adminResourceAddress,
    }))
};

const fundPrizePool = async function ({
    componentAddress,
    accountAddress,
    investmentAmount,
    xrdAddress,
    rdt
}) {
    console.log(accountAddress)

    const manifest = fundPrizePoolManifest({
        accountAddress,
        xrdAddress,
        investmentAmount,
        componentAddress
    })
    console.log("Funding Prize Pool: ", manifest);

    // Send manifest to wallet for signing
    const result = await rdt.walletApi.sendTransaction({
        transactionManifest: manifest,
        version: 1,
    });
    if (result.isErr()) throw result.error;
    console.log("Funding Result: ", result.value);

    // Fetch the transaction status from the Gateway API
    const transactionStatus = await rdt.gatewayApi.transaction.getStatus(
        result.value.transactionIntentHash
    );
    console.log("Funding transaction status:", transactionStatus);

    // Fetch the details of changes committed to ledger from Gateway API
    const committedDetails = await rdt.gatewayApi.transaction.getCommittedDetails(
        result.value.transactionIntentHash
    );
    console.log("Funding committed details:", committedDetails);
};

export const AdminPage = () => {
    const [{

        rdt,
        account,
        componentAddress,
        ownerBadgeAddress,
        packageAddress,
        xrdResource,
        adminResourceAddress }, setState] = useContext(appState);
    return <div>
        <PageTitle label="Admin Page" />

        <div className="flex">
            <Button onClick={() => instantiateComponent({
                setState,
                rdt,
                accountAddress: account && account.address,
                packageAddress
            })} id="instantiateComponent">Instantiate Component</Button>

            <Button onClick={() => fundPrizePool({
                componentAddress,
                investmentAmount: "1000",
                xrdAddress:xrdResource,
                rdt,
                accountAddress: account && account.address,
            })} id="fundPrizePool">Fund Prize Pool</Button>
        </div>
        <div className={styles.detailContainer}>
            <p>Component address:</p>
            <pre id="componentAddress">{componentAddress || "None"}</pre>
        </div>
        <div className={styles.detailContainer}>
            <p>Owner Badge address:</p>
            <pre id="ownerBadgeAddress">{ownerBadgeAddress || "None"}</pre>
        </div>
        <div className={styles.detailContainer}>
            <p>Admin resource address:</p>
            <pre id="adminResourceAddress">{adminResourceAddress || "None"}</pre>
        </div>


    </div >
}
