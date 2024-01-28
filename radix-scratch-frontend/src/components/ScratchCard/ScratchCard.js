import { useEffect, useRef, useState } from "react";
import styles from "./ScratchCard.module.css";
import cx from "classnames";
import { appState } from "../../appState";
import { SCRATCH_TYPE, ScratchCard } from 'scratchcard-js';

import ReactScratchCard from 'react-scratchcard-v2';

const getPrizeImage = (prize, isClaimed, inPresentationMode) => {
  if (!isClaimed && !inPresentationMode) {
    return styles.unClaimed
  }

  if (prize === "OneHundredX") {
    return styles.hugeprize
  }
  if (prize === "TenX") {
    return styles.smallprize
  }
  if (prize === "FreeCard") {
    return styles.freecard
  }
  return styles.loser
}

const getScratchCardImage = (isClaimed, prize) => {
  if (!isClaimed) {
    return './scratchcard3.png'
  }

  if (prize === "OneHundredX") {
    return './hugeprize.png'
  }
  if (prize === "TenX") {
    return './smallprize.png'
  }
  if (prize === "FreeCard") {
    return './freecard.png'
  }
  return styles.loser
}


export const RadixScratchCard = ({
  cardId,
  index,
  onScratch = () => { },
  claim = () => { },
  isClaimed,
  prize,
  handleDragStart,
  inPresentationMode,
  onClickPreview
}) => {

  const ref = useRef(null);
  const brushSize = 30;

  const previewScreen = <div className={styles.previewContainer} onClick={onClickPreview} >
    <div className={styles.prizeImgContainer}>
      <img
        className={cx(styles.prizeImg,
          getPrizeImage(prize, isClaimed, inPresentationMode))}
      >
      </img>
      <span className={styles.cardId}>{cardId}</span>
    </div>
  </div>

  return (
    <>
      <div className={styles.outerContainer} />
      {inPresentationMode ?
        <ReactScratchCard
          style={{
            position: "relative",
            borderRadius: "20px",
          }}
          width={350}
          height={350}
          image={getScratchCardImage(isClaimed, prize)}
          finishPercent={80}
          onComplete={() => {

            claim()
          }}
          customBrush={{
            image: './brush.png',
            width: brushSize,
            height: brushSize
          }}>
          <span className={styles.cardId}>{cardId}</span>
          {inPresentationMode &&
            <div className={styles.prizeImgContainer}>
              <img
                className={cx(styles.prizeImg, getPrizeImage(prize, isClaimed, inPresentationMode))}
              >
              </img>
            </div>}
        </ReactScratchCard> :
        previewScreen
      }

    </>
  );
};
