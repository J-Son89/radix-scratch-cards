import { useMemo } from 'react';
import 'react-alice-carousel/lib/alice-carousel.css';
import { RadixScratchCard } from "../ScratchCard/ScratchCard";
import { get } from 'lodash';
import { useState } from 'react';
import cx from 'classnames'
import styles from "./ScratchCardsCarousel.module.css";


export const ScratchCardsCarousel = ({ items, activeIndex, setActiveIndex, onClick }) => {
  const [cardId, cardData] = useMemo(() => get(items, [activeIndex], []), [activeIndex])

  const showLeftArrow = activeIndex > 0
  const showRightArrow = activeIndex < items.length - 1

  return (
    <div>
      {cardId &&
        <div style={{
          position: "absolute",
          left: "Calc(50% - 6rem)",
          display: "flex"
        }}>
          <div className={styles.btnContainer}>
            {showLeftArrow && <button
              onClick={() => setActiveIndex(activeIndex - 1)}
              className={cx(styles.right, styles.arrow)} />}
          </div>
          <div 
           onClick={onClick}
          style={{
            width: "20rem",
            height: "20rem",
           
          }}>
            <RadixScratchCard
              isScratched={get(cardData, ['is_scratched', 'value'])}
              isClaimed={get(cardData, ['is_claimed', 'value'])}
              prize={get(cardData, ["prize", "variant_name"])}
              cardId={cardId}
              index={activeIndex} 
              // onClickPreview={}
              />
          </div>
          <div className={styles.btnContainer}>
            {showRightArrow && <button
              onClick={() => setActiveIndex(activeIndex + 1)}
              className={styles.arrow} />}
          </div>
        </div>}
    </div>
  );
}
