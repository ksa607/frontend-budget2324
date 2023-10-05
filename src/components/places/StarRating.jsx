import { useCallback } from 'react';
import { IoStarSharp } from 'react-icons/io5';
import { useThemeColors } from '../../contexts/Theme.context';

const Star = ({ index, selected = false, onSelect = (f) => f }) => {
  const handleClick = useCallback(
    () => {
      onSelect(index + 1);
    },
    [index, onSelect]
  );

  return (
    <IoStarSharp color={selected ? 'yellow' : 'grey'} onClick={handleClick} />
  );
};

export default function StarRating({
  totalStars = 5,
  selectedStars = 0,
  onRate,
}) {
  const { oppositeTheme } = useThemeColors();
  return (
    <>
      {[...new Array(totalStars)].map((_, i) => (
        <Star
          key={i}
          index={i}
          selected={selectedStars > i}
          onSelect={onRate}
        />
      ))}
      <p className={`text-${oppositeTheme}`}>
        {selectedStars} of {totalStars} stars
      </p>
    </>
  );
}
