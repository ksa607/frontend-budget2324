import { memo, useCallback } from 'react';
import { useThemeColors } from '../../contexts/Theme.context';
import StarRating from './StarRating';

const Place = ({ id, name, rating, onRate, onDelete }) => {
  const { theme, oppositeTheme } = useThemeColors();
  const handleRate = (newRating) => {
    onRate(id, newRating);
  };

  const handleDelete = useCallback(() => {
    onDelete(id);
  }, [id, onDelete]);

  return (
    <div className={`card bg-${theme} border-${oppositeTheme} mb-4`}>
      <div className='card-body'>
        <h5 className={`card-title text-${oppositeTheme}`}>{name}</h5>
        <StarRating selectedStars={rating} onRate={handleRate} />
        <button className='btn btn-primary' onClick={handleDelete}>
          Verwijder
        </button>
      </div>
    </div>
  );
};

export default memo(Place);
