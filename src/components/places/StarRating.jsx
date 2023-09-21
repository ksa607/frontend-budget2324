import { IoStarSharp } from 'react-icons/io5';

const Star = ({ selected = false }) => {
  const handleClick = (e) => {
    console.log('You clicked a star');
  };

  return (
    <IoStarSharp color={selected ? 'yellow' : 'grey'} onClick={handleClick} />
  );
};

export default function StarRating({ totalStars = 5, selectedStars = 0 }) {
  return (
    <>
      {[...new Array(totalStars)].map((_, i) => (
        <Star key={i} selected={selectedStars > i} />
      ))}
      <p>
        {selectedStars} of {totalStars} stars
      </p>
    </>
  );
}
