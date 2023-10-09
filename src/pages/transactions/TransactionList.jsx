import { useState, useMemo } from 'react';
import useSWR from 'swr';
import { Link } from 'react-router-dom';
import useSWRMutation from 'swr/mutation';
import { getAll, deleteById } from '../../api';
import AsyncData from '../../components/AsyncData';
import TransactionsTable from '../../components/transactions/TransactionTable';
import { useThemeColors } from '../../contexts/Theme.context';

export default function TransactionList() {
  const { theme } = useThemeColors();
  const [text, setText] = useState('');
  const [search, setSearch] = useState('');

  const { data: transactions = [], isLoading, error } = useSWR('transactions', getAll);
  const { trigger: deleteTransaction, error: deleteError } = useSWRMutation('transactions', deleteById);

  const filteredTransactions = useMemo(
    () =>
      transactions.filter((t) => {
        return t.place.name.toLowerCase().includes(search.toLowerCase());
      }),
    [search, transactions]
  );

  return (
    <>
      <h1 className={`text-bg-${theme}`}>Transactions</h1>

      <div className="clearfix">
        <Link to="/transactions/add" className="btn btn-primary float-end">
          Add transaction
        </Link>
      </div>

      <div className='input-group mb-3 w-50'>
        <input
          type='search'
          id='search'
          className='form-control rounded'
          placeholder='Search'
          value={text}
          onChange={(e) => setText(e.target.value)}
          data-cy="transactions_search_input"
        />
        <button
          type='button'
          className='btn btn-outline-primary'
          onClick={() => setSearch(text)}
          data-cy="transactions_search_btn"
        >
          Search
        </button>
      </div>

      <div className="mt-4">
        <AsyncData loading={isLoading} error={error || deleteError}>
          <TransactionsTable transactions={filteredTransactions} onDelete={deleteTransaction} />
        </AsyncData>
      </div>
    </>
  );
}
