import { useMemo } from 'react';
import { RadixScratchCard } from "../ScratchCard/ScratchCard";
import { get } from 'lodash';
import { useState } from 'react';
import cx from 'classnames'
import styles from "./ScratchCardsCarousel.module.css";
import Carousel from 'react-spring-3d-carousel';
import { config } from "react-spring";




export const ScratchCardsCarousel = ({ items, activeIndex, setActiveIndex, onClick }) => {
  // const [cardId, cardData] = useMemo(() => get(items, [activeIndex], []), [items,activeIndex])
  const [carouselState, setCarouselState] = useState(
    {
      goToSlide: 0,
      offsetRadius: 1,
      showNavigation: true,
      enableSwipe: true,
      config: config.gentle
    }
  )

   
  const slides = items.map(([cardId, cardData], index) =>
  ({
    key: "Scratchard" + cardId,
    content:
      <RadixScratchCard
        onClickPreview={() =>{
          if(activeIndex === index){
            
            onClick()
          }
          else{
            setActiveIndex(index)
         }}}
        isClaimed={get(cardData, ['is_claimed', 'value'])}
        prize={get(cardData, ["prize", "variant_name"])}
        cardId={cardId}
        index={activeIndex}
      />
  }))

  return <div className={styles.container}

  >
    <Carousel
      slides={slides}
      goToSlide={activeIndex}
      offsetRadius={carouselState.offsetRadius}
      showNavigation={carouselState.showNavigation}
      animationConfig={carouselState.config}
    />
  </div>


}
