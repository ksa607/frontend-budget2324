import { memo, useContext } from 'react';
import StarRating from './StarRating';
import { ThemeContext } from '../../contexts/Theme.context';

const Place = ({ id, name, rating, onRate, onDelete }) => {
  const { theme, oppositeTheme } = useContext(ThemeContext);
  const handleRate = (newRating) => {
    onRate(id, newRating);
  };

  const handleDelete = () => {
    onDelete(id);
  };
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
