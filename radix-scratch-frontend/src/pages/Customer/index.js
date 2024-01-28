import { useContext, useEffect, useState, useMemo } from "react";
import { appState } from "../../appState";
import { purchaseManifest } from "../../manifests/purchase";
import { claimManifest } from "../../manifests/claim";
import { get, set, isArray } from 'lodash';
import styles from './style.module.css';
import { ScratchModal } from "../../components/Modal/Modal";
import { PurchaseButton } from "../../components/PurchaseButton/PurchaseButton";
import { ScratchCardsCarousel } from "../../components/ScratchCardsCarousel/ScratchCardsCarousel";
import { RadixScratchCard } from "../../components/ScratchCard/ScratchCard";
import {
    get_internal_vault_address,
    get_users_cards_ids,
    get_users_cards_data
} from '../../api';
import Carousel from 'react-spring-3d-carousel';

const buyScratchCard = async ({
    componentAddress,
    accountAddress,
    xrdResource,
    sellerId,
    rdt
}) => {
    const manifest = purchaseManifest({
        accountAddress,
        xrdAddress: xrdResource,
        componentAddress,
        sellerId,
    })
    console.log("Purchase Manifest: ", manifest);

    // Send manifest to wallet for signing
    const result = await rdt.walletApi.sendTransaction({
        transactionManifest: manifest,
        version: 1,
    });
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
    // if (result.isErr()) throw result.error;
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

export const Customer = () => {
    const [{
        rdt,
        account,
        componentAddress,
        // ownerBadgeAddress,
        nftAddress,
        xrdResource,
        sellerId,
        usersCardsIds,
        usersCards, },
        setState] = useContext(appState);

    const [modalIsOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0)

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

    const radixScratchCards = useMemo(() => (isArray(usersCardsIds) &&
        (Object.entries(usersCards))) || [], [usersCardsIds, usersCards]);

    const userAddress = get(account, ['address']);

    useEffect(() => {
        const getCards = async (address, nftResourceAddress) => {
            const internal_vault_address = await get_internal_vault_address(address, nftResourceAddress)

            const usersCardsIds = await get_users_cards_ids(address, nftResourceAddress, internal_vault_address)

            const usersCardsData = await get_users_cards_data(nftResourceAddress, usersCardsIds)
            setState(prev => {
                return {
                    ...prev,
                    usersCards: usersCardsData,
                    usersCardsIds
                }
            })
        }
        getCards(userAddress, nftAddress)

    }, [componentAddress, userAddress, nftAddress, setState])

    const [cardId, cardData] = useMemo(() =>
        get(radixScratchCards, [activeIndex], []), [radixScratchCards, activeIndex])



    return <div className={styles.container}>
        {radixScratchCards && <ScratchCardsCarousel
            items={radixScratchCards}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            onClick={openModal}
        />}

        <PurchaseButton
            onClick={() => buyScratchCard({
                setState,
                rdt,
                xrdResource,
                nftAddress,
                componentAddress,
                sellerId,
                accountAddress: account && account.address,
            })}
            id="purchaseButton">Buy ScratchCard</PurchaseButton>


        <ScratchModal modalIsOpen={modalIsOpen}
            afterOpenModal={afterOpenModal}
            closeModal={closeModal}>
            <div style={{ flex: 1 }}>
                <RadixScratchCard
                    isClaimed={get(cardData, ['is_claimed', 'value'])}
                    prize={get(cardData, ["prize", "variant_name"])}
                    cardId={cardId}
                    index={activeIndex}
                    inPresentationMode
                    claim={() => {
                        claimPrize({
                            accountAddress: userAddress,
                            nftAddress,
                            componentAddress,
                            cardId,
                            rdt,
                            xrdAddress: xrdResource,
                            setState
                        })
                    }}
                />
            </div>
        </ScratchModal>
    </div >
}
