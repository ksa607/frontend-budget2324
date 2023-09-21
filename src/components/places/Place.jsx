import StarRating from './StarRating';

const Place = ({ id, name, rating }) => {
  return (
    <div className='card bg-light border-dark mb-4'>
      <div className='card-body'>
        <h5 className='card-title'>{name}</h5>
        <StarRating selectedStars={rating} />
      </div>
    </div>
  );
};

export default Place;
