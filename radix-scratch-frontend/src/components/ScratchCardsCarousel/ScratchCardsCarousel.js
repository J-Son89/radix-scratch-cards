import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';

const handleDragStart = (e) => e.preventDefault();

export const ScratchCardsCarousel = ({items}) => {
    console.log(items)
  return (
    <AliceCarousel controlsStrategy={"alternate"} autoWidth mouseTracking items={items} />
  );
}
