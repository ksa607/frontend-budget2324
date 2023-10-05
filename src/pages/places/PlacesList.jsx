import useSWR from 'swr';
import { useCallback } from 'react';
import useSWRMutation from 'swr/mutation';
import PlacesCards from '../../components/places/PlacesCards';
import { getAll, save, deleteById } from '../../api';
import AsyncData from '../../components/AsyncData';

export default function PlacesList() {
  const { data: places, error, isLoading } = useSWR('places', getAll);
  const { trigger: savePlace, error: saveError } = useSWRMutation('places', save);
  const { trigger: deletePlace, error: deleteError } = useSWRMutation('places', deleteById);

  const handleRatePlace = useCallback(async (id, rating) => {
    const place = places.find((p) => p.id === id);
    await savePlace({ ...place, rating });
  }, [savePlace, places]);

  return (
    <>
      <h1>Places</h1>

      <AsyncData loading={isLoading} error={error || saveError || deleteError}>
        <PlacesCards places={places} onRate={handleRatePlace} onDelete={deletePlace} />
      </AsyncData>
    </>
  );
}
