import { useEffect, useState,useContext, useMemo } from "react";
import styles from "./ScratchCardInpsector.module.css";
import cx from "classnames";
import Modal from 'react-modal';
import { ScratchCard } from "scratchcard-js";

export const RadixScratchCard = ({
  cardId,
  index,
  onScratch = () => { },
  onClaim = () => { },
  isScratched,
  isClaimed,
  prize,
  handleDragStart,
  isScratchable
  
}) => {
  const [{
    rdt,
    account,
    componentAddress,
    ownerBadgeAddress,
    nftAddress,
    xrdResource,
    walletData,
    usersCardsIds,
    activeCardId,
    usersCards,
    adminResourceAddress },
    setState] = useContext(appState);

  const cardData = useMemo((usersCardsIds)=>{}, activeCardId)


  return <Modal
    isOpen={modalIsOpen}
    onAfterOpen={afterOpenModal}
    onRequestClose={closeModal}
    style={{
      overlay: {
        zIndex: 100,
        border: "2px solid #fa7d09",
      }
    }

    }
    contentLabel="123 NFT Project Structure"
  >
    <div style={{backgroundColor: "red"}}>
    <h3>HELLO</h3>
    </div>
    {/* <ScratchCard {...scratchCardProps} isScratchable /> */}

  </Modal >

}
