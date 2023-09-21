import { useState } from 'react';
import { PLACE_DATA } from '../../api/mock_data';
import Place from './Place';

const PlacesList = () => {
  const [places, setPlaces] = useState(PLACE_DATA);

  const handleRatePlace = (id, rating) => {
    const newPlaces = places.map((p) => (p.id === id ? { ...p, rating } : p));
    setPlaces(newPlaces);
  };

  const handleDeletePlace = (id) => {
    setPlaces((places) => places.filter((p) => p.id !== id));
  };

  return (
    <div className='grid mt-3'>
      <div className='row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xxl-4 g-3'>
        {places
          .sort((a, b) =>
            a.name.toUpperCase().localeCompare(b.name.toUpperCase())
          )
          .map((p) => (
            <div className='col' key={p.id}>
              <Place
                {...p}
                onRate={handleRatePlace}
                onDelete={handleDeletePlace}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default PlacesList;
