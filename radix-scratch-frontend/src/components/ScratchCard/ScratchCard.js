import { useEffect, useState } from "react";
import styles from "./ScratchCard.module.css";
import cx from "classnames";
import { appState } from "../../appState";
import { SCRATCH_TYPE, ScratchCard } from 'scratchcard-js';

export const RadixScratchCard = ({
  cardId,
  index,
  onScratch = () => { },
  onClaim = () => { },
  isScratched,
  isClaimed,
  prize,
  handleDragStart }) => {
  const [percent, setPercent] = useState("0%")
  const [isScratchedOnce, setScratchedOnce] = useState(false)



  useEffect(() => {

    const container = document.getElementById(`#js--sc--container${index}`)
    console.log(container.getElementsByClassName('sc__canvas').length > 0)
    const isCanvasAlreadyThere = container.getElementsByClassName('sc__canvas').length > 0;
    if (!isCanvasAlreadyThere) {
      const sc = new ScratchCard(container, {
        scratchType: SCRATCH_TYPE.BRUSH,
        containerWidth: 300,
        containerHeight: 300,
        brushSrc: 'coin.png',
        imageForwardSrc: 'scratchcard.png',
        imageBackgroundSrc: '',
        clearZoneRadius: 0,
        callback: onClaim
      })

      const initScratching = async () => {
        sc.init().then(() => {
          sc.canvas.addEventListener('scratch.move', () => {
            let newPercent = sc.getPercent().toFixed(0);
            setPercent(newPercent + '%');
          })
        }).catch((error) => {
          alert(error.message);
        });
      }
      initScratching()
    }
  },
    [],)

  return (
    <>
      <div className={styles.outerContainer} handleDragStart={handleDragStart}>
        {isClaimed && <div className={styles.claimed} ><p>Claimed</p></div>}
        <div className={styles.sc__wrapper}>
          <p className={styles.cardId}>{cardId}</p>
          {!isScratched && (<div className={styles.signAndScratch}>
            <button className={styles.signAndScratchBtn}
              onClick={onScratch}
            >Sign & Scratch</button>
          </div>)}
          <div id={`#js--sc--container${index}`} className={styles.sc__container}>
            <p className={styles.prize}>{prize}</p>
            {/* <img src={'./scratchcard-background.png'} className={styles.sc__img} /> */}
          </div>

        </div>
      </div>

    </>
  );
};
