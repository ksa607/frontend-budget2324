import { IoStarSharp } from 'react-icons/io5';

const Star = ({ selected = false }) => (
  <IoStarSharp color={selected ? 'yellow' : 'grey'} />
);

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
