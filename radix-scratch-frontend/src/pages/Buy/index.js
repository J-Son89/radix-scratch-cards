import { useContext, useEffect, useState } from "react";
import { appState } from "../../appState";
import { purchaseManifest } from "../../manifests/purchase";
import { scratchManifest } from "../../manifests/scratch";
import { claimManifest } from "../../manifests/claim";
import { get, set, isArray } from 'lodash';
import styles from './style.module.css';
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { Button } from "../../components/Button/Button";
import { RadixScratchCard } from "../../components/ScratchCard/ScratchCard";
import { ScratchCardsCarousel } from "../../components/ScratchCardsCarousel/ScratchCardsCarousel";
import { Swiper, SwiperSlide } from 'swiper/react';

import {
    get_internal_vault_address,
    get_users_cards_ids,
    get_users_cards_data
} from '../../api';

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

export const claimPrize = async ({
    accountAddress,
    nftAddress,
    componentAddress,
    cardId,
    rdt,
    xrdAddress,
    setState
}) => {

    const manifest = claimManifest({
        accountAddress,
        nftAddress,
        componentAddress,
        cardId,
        xrdAddress
    })
    console.log("Claim Manifest: ", manifest);

    // Send manifest to wallet for signing
    const result = await rdt.walletApi.sendTransaction({
        transactionManifest: manifest,
        version: 1,
    })
    if (result.isErr()) throw result.error;
    console.log("Claim Result: ", result.value);

    // Fetch the transaction status from the Gateway API
    const transactionStatus = await rdt.gatewayApi.transaction.getStatus(
        result.value.transactionIntentHash
    );
    console.log("Claim transaction status:", transactionStatus);

    // Fetch the details of changes committed to ledger from Gateway API
    const committedDetails = await rdt.gatewayApi.transaction.getCommittedDetails(
        result.value.transactionIntentHash
    );
    console.log("Claim transaction status:", committedDetails);


    setState(prev => {
        const updatedCardDetails = get(prev, ['usersCards'])
        const isClaimedData = get(prev, ['usersCards', cardId, 'is_claimed'])
        set(updatedCardDetails, ['usersCards', cardId, 'is_claimed'], {
            value: true,
            ...isClaimedData
        })
        return ({
            ...prev,
            usersCards: updatedCardDetails

        })
    })
}

export const scratchACard = async ({
    accountAddress,
    nftAddress,
    componentAddress,
    cardId,
    rdt,
    setState
}) => {

    const manifest = scratchManifest(
        accountAddress,
        nftAddress,
        componentAddress,
        cardId)
    console.log("Scratch Manifest: ", manifest);

    // Send manifest to wallet for signing
    const result = await rdt.walletApi.sendTransaction({
        transactionManifest: manifest,
        version: 1,
    });
    if (result.isErr()) throw result.error;
    console.log("Scratch Result: ", result.value);

    // Fetch the transaction status from the Gateway API
    const transactionStatus = await rdt.gatewayApi.transaction.getStatus(
        result.value.transactionIntentHash
    );
    console.log("Scratch transaction status:", transactionStatus);

    // Fetch the details of changes committed to ledger from Gateway API
    const committedDetails = await rdt.gatewayApi.transaction.getCommittedDetails(
        result.value.transactionIntentHash
    );
    setState(prev => {
        const updatedCardDetails = get(prev, ['usersCards'])
        const isScratchedData = get(prev, ['usersCards', cardId, 'is_scratched'])
        set(updatedCardDetails, ['usersCards', cardId, 'is_scratched'], {
            value: true,
            ...isScratchedData
        })
        return ({
            ...prev,
            usersCards: updatedCardDetails

        })
    })
    console.log("Scratch committed details:", committedDetails);
}

const handleDragStart = (e) => e.preventDefault();

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
        usersCards,
        adminResourceAddress },
        setState] = useContext(appState);

    const [modalIsOpen, setIsOpen] = useState(false);

    function openModal() {
        setIsOpen(true);
    }

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        // subtitle.style.color = '#f00';
    }

    function closeModal() {
        setIsOpen(false);
    }


    const radixScratchCards = (isArray(usersCardsIds) &&
        (Object.entries(usersCards)).map(([cardId, cardData], index) =>
            <SwiperSlide>
                <RadixScratchCard

                    // onScratch={() => scratchACard({
                    //     accountAddress: get(account, ['address']),
                    //     nftAddress,
                    //     componentAddress,
                    //     cardId,
                    //     rdt,
                    //     setState
                    // })}
                    // onClaim={() => {
                    //     claimPrize({
                    //         accountAddress: get(account, ['address']),
                    //         nftAddress,
                    //         componentAddress,
                    //         cardId,
                    //         rdt,
                    //         xrdAddress: xrdResource,
                    //         setState
                    //     })
                    // }}
                    handleDragStart={handleDragStart}
                    isScratched={get(cardData, ['is_scratched', 'value'])}
                    isClaimed={get(cardData, ['is_claimed', 'value'])}
                    prize={get(cardData, ["prize", "variant_name"])}
                    cardId={cardId}
                    index={index}
                    key={index + cardId} />
            </SwiperSlide>
        )) || []


    useEffect(() => {
        const getCards = async (address, nftResourceAddress) => {
            const internal_vault_address = await get_internal_vault_address(address, nftResourceAddress)
            console.log('internal_vault_address', internal_vault_address)

            const usersCardsIds = await get_users_cards_ids(address, nftResourceAddress, internal_vault_address)

            const usersCardsData = await get_users_cards_data(nftResourceAddress, usersCardsIds)
            console.log(usersCardsData)
            setState(prev => {
                return {
                    ...prev,
                    usersCards: usersCardsData,
                    usersCardsIds
                }
            })
        }
        getCards(get(account, ['address']), nftAddress)

    }, [componentAddress])


    return <div>
        <PageTitle label="Create Scratch Cards Batch" />

        <div className={styles.container}>
            <Button onClick={() => buyScratchCard({
                setState,
                rdt,
                xrdResource,
                nftAddress,
                componentAddress,
                accountAddress: account && account.address,
            })} id="purchaseButton">Buy ScratchCard</Button>
        </div>
        <div className={styles.container}>
            <h4 className={styles.myCardsTitle}>My Cards </h4>
            <ScratchCardsCarousel openModal={openModal} closeModal={closeModal} items={radixScratchCards} />
        </div>
    </div >
}
