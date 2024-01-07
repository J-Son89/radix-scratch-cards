import { useEffect, useState } from "react";
import styles from "./ScratchCard.module.css";
import cx from "classnames";
import { appState } from "../../appState";
import { SCRATCH_TYPE, ScratchCard } from 'scratchcard-js';

export const RadixScratchCard = ({ cardId, index }) => {
  const [percent, setPercent] = useState("0%")
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
        callback: function () {
          // alert('Now the window will reload !')
        },
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
    <div>

      <div className={styles.sc__wrapper}>
        <div id={`#js--sc--container${index}`} className={styles.sc__container}>
          <p>WINNER</p>
          {/* <img src={'./scratchcard-background.png'} className={styles.sc__img} /> */}
        </div>

      </div>
      <div className={styles.sc__infos}>
        {percent}
      </div>
    </div>
  );
};
