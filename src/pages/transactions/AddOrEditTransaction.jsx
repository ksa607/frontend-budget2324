import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import { getById, getAll } from '../../api';
import TransactionForm from '../../components/transactions/TransactionForm';
import AsyncData from '../../components/AsyncData';

export default function AddOrEditTransaction() {
  const { id } = useParams();

  const {
    data: transaction,
    error: transactionError,
    isLoading: transactionLoading,
  } = useSWR(id ? `transactions/${id}` : null, getById);

  const {
    data: places = [],
    error: placesError,
    isLoading: placesLoading,
  } = useSWR('places', getAll);

  return (
    <>
      <h1>
        Add transaction
      </h1>

      <AsyncData
        error={transactionError || placesError}
        loading={transactionLoading || placesLoading}
      >
        <TransactionForm
          places={places}
          transaction={transaction}
        />
      </AsyncData>
    </>
  );
}
