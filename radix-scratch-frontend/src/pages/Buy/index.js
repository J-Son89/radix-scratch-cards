import { useContext, useEffect } from "react";
import { appState } from "../../appState";
import { purchaseManifest } from "../../manifests/purchase";
// import { getScratchCardsToBuyManifest } from "../../manifests/getScratchCardsToBuy";
import { get } from 'lodash';

import styles from './style.module.css';
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { Input } from "../../components/Input/Input";
import { Button } from "../../components/Button/Button";

const get_internal_vault_address = async (address, resource_address) => {
    if (!address || !resource_address) {
        return ""
    }
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            address,
            resource_address
        })
    };
    const response = await fetch("https://stokenet.radixdlt.com/state/entity/page/non-fungible-vaults/", requestOptions)
    const jsonResponse = await response.json()
    console.log(jsonResponse, '===')
    const scratchcard_vault_address = get(jsonResponse, ['items' , '0', 'vault_address'])
    return scratchcard_vault_address
}

const get_users_cards_ids = async (address, resource_address, vault_address) => {
    if (!address || !resource_address) {
        return ""
    }
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            address,
            resource_address,
            vault_address

        })
    };
    const response = await fetch("https://stokenet.radixdlt.com/state/entity/page/non-fungible-vault/ids", requestOptions)
    const jsonResponse = await response.json()
    console.log(jsonResponse)
    const users_cards_ids = get(jsonResponse, ['items'])
    return users_cards_ids
}

const buyScratchCard = async ({
    componentAddress,
    accountAddress,
    xrdResource,
    nftAddress,
    setState,
    rdt
}) => {
    const manifest = purchaseManifest(
        accountAddress,
        xrdResource,
        componentAddress)
    console.log("Instantiate Manifest: ", manifest);

    // Send manifest to wallet for signing
    const result = await rdt.walletApi.sendTransaction({
        transactionManifest: manifest,
        version: 1,
    });
    if (result.isErr()) throw result.error;
    console.log("Purchase Result: ", result.value);

    // Fetch the transaction status from the Gateway API
    const transactionStatus = await rdt.gatewayApi.transaction.getStatus(
        result.value.transactionIntentHash
    );
    console.log("Purchase transaction status:", transactionStatus);

    // Fetch the details of changes committed to ledger from Gateway API
    const committedDetails = await rdt.gatewayApi.transaction.getCommittedDetails(
        result.value.transactionIntentHash
    );
    console.log("Purchase committed details:", committedDetails);
}

// const getScratchCardsToBuy = async ({
//     componentAddress,
//     accountAddress,
//     xrdResource,
//     setState,
//     rdt }) => {
//     const manifest = getScratchCardsToBuyManifest(
//         accountAddress,
//         xrdResource,
//         componentAddress)
//     console.log("Instantiate Manifest: ", manifest);

//     const result = await rdt.walletApi.sendTransaction({
//         transactionManifest: manifest,
//         version: 1,
//     });
//     if (result.isErr()) throw result.error;
//     console.log("Instantiate Result: ", result.value);
//     return result
// }

const viewMyScratchCards = () => {

}

export const Buy = ({ }) => {
    const [{
        rdt,
        account,
        componentAddress,
        ownerBadgeAddress,
        nftAddress,
        xrdResource,
        walletData,
        usersCardsIds,
        adminResourceAddress }, setState] = useContext(appState);


    useEffect(() => {
        const getCards = async (address, nftResourceAddress) => {
            console.log('address', address)
            console.log('nftResourceAddress',nftResourceAddress)
            const internal_vault_address = await get_internal_vault_address(address, nftResourceAddress)
            console.log('internal_vault_address',internal_vault_address)

            const usersCardsIds = await get_users_cards_ids(address, nftResourceAddress, internal_vault_address)
            setState(prev =>
            ({
                ...prev,
                usersCardsIds
            }))
        }
        getCards(get(account, ['address']), nftAddress)

    }, [componentAddress])

    console.log(usersCardsIds)

    return <div>
        <PageTitle label="Create Scratch Cards Batch" />

        <div className="flex">
            <Input placeholder="package address" />
            <Button onClick={() => buyScratchCard({
                setState,
                rdt,
                xrdResource,
                nftAddress,
                componentAddress,
                accountAddress: account && account.address,
            })} id="purchaseButton">Buy ScratchCard</Button>
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
