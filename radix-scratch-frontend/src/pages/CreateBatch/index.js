import { useContext } from "react";
import { appState } from "../../appState";
import { createBatchManifest } from "../../manifests/createBatch";
import styles from './style.module.css';
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { Input } from "../../components/Input/Input";
import { Button } from "../../components/Button/Button";

const createBatch = async ({
    componentAddress,
    accountAddress,
    xrdResource,
    setState,
    rdt
}) => {
    const manifest = createBatchManifest(
        componentAddress,
        accountAddress,
        xrdResource);
    console.log("Instantiate Manifest: ", manifest);

    // Send manifest to wallet for signing
    const result = await rdt.walletApi.sendTransaction({
        transactionManifest: manifest,
        version: 1,
    });
    if (result.isErr()) throw result.error;
    console.log("Create Batch Result: ", result.value);

    // Fetch the transaction status from the Gateway API
    const transactionStatus = await rdt.gatewayApi.transaction.getStatus(
        result.value.transactionIntentHash
    );
    console.log("Create Batch transaction status:", transactionStatus);

    // Fetch the details of changes committed to ledger from Gateway API
    const committedDetails = await rdt.gatewayApi.transaction.getCommittedDetails(
        result.value.transactionIntentHash
    );
    console.log("Create Batch committed details:", committedDetails);



    // setState((prev) => ({
    //     ...prev,
    //     componentAddress,
    //     ownerBadgeAddress,
    //     adminResourceAddress,
    // }))
}

export const CreateBatch = ({ }) => {
    const [{
        rdt,
        account,
        componentAddress,
        ownerBadgeAddress,
        xrdResource,
        adminResourceAddress }, setState] = useContext(appState);
    console.log({
        xrdResource,
        componentAddress,
        accountAddress: account && account.address,
    })
    return <div>
        <PageTitle label="Create Scratch Cards Batch" />

        <div className="flex">
            <Input placeholder="package address" />
            <Button onClick={() => createBatch({
                setState,
                rdt,
                xrdResource,
                componentAddress,
                accountAddress: account && account.address,
            })} id="createBatchButton">Create Batch</Button>
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
