import { useEffect, useRef, useState } from "react";
import styles from "./ScratchCard.module.css";
import cx from "classnames";
import { appState } from "../../appState";
import { SCRATCH_TYPE, ScratchCard } from 'scratchcard-js';

import ReactScratchCard from 'react-scratchcard-v2';

const getPrizeImage = (prize) => {
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
  const brushSize = inPresentationMode ? 30 : 0;
  console.log(prize, "PRIZE")
  return (
    <>

      <div className={styles.outerContainer} />
      {<ReactScratchCard
        style={{
          position: "relative",
          borderRadius: "20px",
        }}
        width={350}
        height={350}
        image={'./scratchcard3.png'}
        finishPercent={80}
        onComplete={claim}
        customBrush={{
          image: './brush.png',
          width: brushSize,
          height: brushSize
        }}>
        {inPresentationMode &&
          <div className={styles.prizeImgContainer}>
            <image
              className={cx(styles.prizeImg, getPrizeImage(prize))}
            
            >
            </image>
          </div>}
      </ReactScratchCard>}

    </>
  );
};
