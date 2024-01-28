import { useContext, useState } from "react";
import { appState } from "../../appState";
import { registerSellerManifest } from "../../manifests/registerSeller";
import styles from './style.module.css';
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { Input } from "../../components/Input/Input";
import { Button } from "../../components/Button/Button";

const registerSeller = async ({
    componentAddress,
    accountAddress,
    xrdResource,
    sellerName,
    rdt
}) => {
    const manifest = registerSellerManifest({
        componentAddress,
        accountAddress,
        xrdResource,
        sellerName,
    });
    console.log("Register Seller Manifest: ", manifest);

    // Send manifest to wallet for signing
    const result = await rdt.walletApi.sendTransaction({
        transactionManifest: manifest,
        version: 1,
    });
    if (result.isErr()) throw result.error;
    console.log("Register Seller Result: ", result.value);

    // Fetch the transaction status from the Gateway API
    const transactionStatus = await rdt.gatewayApi.transaction.getStatus(
        result.value.transactionIntentHash
    );
    console.log("Register Seller transaction status:", transactionStatus);

    // Fetch the details of changes committed to ledger from Gateway API
    const committedDetails = await rdt.gatewayApi.transaction.getCommittedDetails(
        result.value.transactionIntentHash
    );
    console.log("Register Seller committed details:", committedDetails);
}

export const SellerPage = ({ }) => {
    const [{
        rdt,
        account,
        componentAddress,
        xrdResource,
    }] = useContext(appState);
    const [name, setName] = useState("")
    return <div>
        <PageTitle label="Register Your Address To Sell" />

        <div className="flex">
            <Input onChange={(e)=>setName(e.target.value) } value={name} placeholder="seller name" />
            <Button onClick={() => registerSeller({
                rdt,
                componentAddress,
                sellerName: name,
                xrdResource,
                componentAddress,
                accountAddress: account && account.address,
            })} id="registerSeller">Register Your Address</Button>
        </div>
    </div >
}
