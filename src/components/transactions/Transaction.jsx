import { memo, useCallback } from 'react';
import { IoTrashOutline, IoPencilOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';

// kan ook met react-intl (https://formatjs.io/docs/getting-started/installation/)
const dateFormat = new Intl.DateTimeFormat('nl-BE', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

const amountFormat = new Intl.NumberFormat('nl-BE', {
  currency: 'EUR',
  style: 'currency',
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

export default memo(function Transaction({ id, user, date, amount, place, onDelete }) {
  const handleDelete = useCallback(() => {
    onDelete(id);
  }, [id, onDelete]);

  return (
    <tr data-cy="transaction">
      <td data-cy="transaction_date">
        {dateFormat.format(new Date(date))}
      </td>
      <td data-cy="transaction_user">{user.name}</td>
      <td data-cy="transaction_place">{place.name}</td>
      <td data-cy="transaction_amount">
        {amountFormat.format(amount)}
      </td>
      <td>
        <Link data-cy="transaction_edit_btn" to={`/transactions/edit/${id}`} className="btn btn-light">
            <IoPencilOutline />
          </Link>
        <button data-cy="transaction_remove_btn" className='btn btn-danger' onClick={handleDelete}>
          <IoTrashOutline />
        </button>
      </td>
    </tr>
  );
});
