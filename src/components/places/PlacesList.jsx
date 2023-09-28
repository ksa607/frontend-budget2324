import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { getAll, save, deleteById } from '../../api';
import Place from './Place';
import AsyncData from '../AsyncData';
import { useCallback } from 'react';

const PlacesList = () => {
  const {
    data: places = [],
    error,
    isLoading,
  } = useSWR('places', getAll);

  const {
    trigger: savePlace,
    error: saveError,
  } = useSWRMutation('places', save);

  const {
    trigger: deletePlace,
    error: deleteError,
  } = useSWRMutation('places', deleteById);

  const handleRatePlace = useCallback(async (id, rating) => {
    const place = places.find((p) => p.id === id);
    await savePlace({ ...place, rating });
  }, [savePlace, places]);

  const handleDeletePlace = useCallback(async (id) => {
    await deletePlace(id);
  }, [deletePlace]);

  return (
    <div className='grid mt-3'>
      <div className='row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xxl-4 g-3'>
        <AsyncData error={error || saveError || deleteError} loading={isLoading}>
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
        </AsyncData>
      </div>
    </div>
  );
};

export default PlacesList;
