import { useMemo } from 'react';
import { RadixScratchCard } from "../ScratchCard/ScratchCard";
import { get } from 'lodash';
import { useState } from 'react';
import cx from 'classnames'
import styles from "./ScratchCardsCarousel.module.css";
import Carousel from 'react-spring-3d-carousel';
import { config } from "react-spring";

const getTouches = (evt) => {
  return (
    evt.touches || evt.originalEvent.touches // browser API
  );
};

export const ScratchCardsCarousel = ({ items, activeIndex, setActiveIndex, onClick }) => {
  // const [cardId, cardData] = useMemo(() => get(items, [activeIndex], []), [items,activeIndex])
  const [carouselState, setCarouselState] = useState(
    {
      goToSlide: 0,
      offsetRadius: 3,
      showNavigation: true,
      enableSwipe: true,
      config: config.gentle
    }
  )

  const handleTouchStart = (evt) => {
    if (!carouselState.enableSwipe) {
      return;
    }

    const firstTouch = getTouches(evt)[0];
    setCarouselState(prevState => ({
      ...prevState,
      xDown: firstTouch.clientX,
      yDown: firstTouch.clientY
    }));
  };

  const handleTouchMove = (evt) => {
    if (!carouselState.enableSwipe || (!carouselState.xDown && !carouselState.yDown)) {
      return;
    }

    let xUp = evt.touches[0].clientX;
    let yUp = evt.touches[0].clientY;

    let xDiff = carouselState.xDown - xUp;
    let yDiff = carouselState.yDown - yUp;
    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      if (xDiff > 0) {
        /* left swipe */
        setCarouselState(prev => ({
          ...prev,
          goToSlide: carouselState.goToSlide + 1,
          xDown: null,
          yDown: null
        }));
      } else {
        /* right swipe */
        setCarouselState(prev => ({
          ...prev,
          goToSlide: carouselState.goToSlide - 1,
          xDown: null,
          yDown: null
        }));
      }
    }
  };


  const slides = items.map(([cardId, cardData], index) =>
  ({
    key: "Scratchard" + cardId,
    content:
      <RadixScratchCard
        onClickPreview={() =>{
          console.log('jdhasdhsahd')
            setCarouselState(prev => ({
          ...prev,
          goToSlide: index
        }))}}
        isClaimed={get(cardData, ['is_claimed', 'value'])}
        prize={get(cardData, ["prize", "variant_name"])}
        cardId={cardId}
        index={activeIndex}
      />
  }))

  return <div className={styles.container}
    onTouchStart={handleTouchStart}
    onTouchMove={handleTouchMove}
  >
    <Carousel
      slides={slides}
      goToSlide={carouselState.goToSlide}
      offsetRadius={carouselState.offsetRadius}
      showNavigation={carouselState.showNavigation}
      animationConfig={carouselState.config}
    />
  </div>


}
