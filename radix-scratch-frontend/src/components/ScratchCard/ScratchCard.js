import { useEffect, useRef, useState } from "react";
import styles from "./ScratchCard.module.css";
import cx from "classnames";
import { appState } from "../../appState";
import { SCRATCH_TYPE, ScratchCard } from 'scratchcard-js';

import ReactScratchCard from 'react-scratchcard-v2';


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
  const brushSize = inPresentationMode? 30:0;

  return (
<div className={styles.outerContainer} >

      
      <ReactScratchCard
       
        width={200}
        height={200}
        image={'./scratchcard.png'}
        finishPercent={80}
        onComplete={claim}
        customBrush={{
          image: './brush.png',
          width: brushSize,
          height: brushSize
        }}
      >
        <div style={{
          display: 'flex',
    
          alignItems: 'center',
          justifyContent: 'center'
        }}
        >
            {inPresentationMode && <p className={styles.prize}>{prize}</p>}
        </div>
      </ReactScratchCard>

    </div>
    //   <div className={styles.outerContainer} handleDragStart={handleDragStart}>
    //     {inPresentationMode && isClaimed && <div className={styles.claimed} ><p>Claimed</p></div>}
    //     <div className={styles.sc__wrapper} >
    //       <p className={styles.cardId}>{cardId}</p>

    //       <div id={`#js--sc--container${index}`} className={styles.sc__container}>
    //        {inPresentationMode && <p className={styles.prize}>{prize}</p>}
    //         {!inPresentationMode && <img 
    //         draggable="false"
    //         src={'./scratchcard.png'} className={styles.sc__img} /> }
    //       </div>

    //     </div>
    //   </div>

    // </>
  );
};
