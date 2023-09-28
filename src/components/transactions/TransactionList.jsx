import { useState, useMemo, useCallback, useContext } from 'react';
import Transaction from './Transaction';
import TransactionForm from './TransactionForm';
import { ThemeContext } from '../../contexts/Theme.context';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { getAll, deleteById } from '../../api';
import AsyncData from '../AsyncData';

function TransactionTable({
  transactions,
  onEdit,
  onDelete
}) {
  const { theme } = useContext(ThemeContext);
  if (transactions.length === 0) {
    return (
      <div className='alert alert-info'>There are no transactions yet.</div>
    );
  }

  return (
    <div>
      <table className={`table table-hover table-responsive table-${theme}`}>
        <thead>
          <tr>
            <th>Date</th>
            <th>User</th>
            <th>Place</th>
            <th>Amount</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <Transaction
              {...transaction}
              key={transaction.id}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function TransactionList() {
  const [text, setText] = useState('');
  const [search, setSearch] = useState('');
  const [currentTransaction, setCurrentTransaction] = useState({});

  const { data: transactions = [], isLoading, error } = useSWR('transactions', getAll);
  const { trigger: deleteTransaction, error: deleteError } = useSWRMutation('transactions', deleteById);

  const filteredTransactions = useMemo(
    () =>
      transactions.filter((t) => {
        return t.place.name.toLowerCase().includes(search.toLowerCase());
      }),
    [search, transactions]
  );

  const setTransactionToUpdate = useCallback((id) => {
    setCurrentTransaction(id === null ? {} : transactions.find((t) => t.id === id));
  }, [transactions]);

  return (
    <>
      <h1>Transactions</h1>
      <TransactionForm
        setTransactionToUpdate={setTransactionToUpdate}
        currentTransaction={currentTransaction}
      />

      <div className='input-group mb-3 w-50'>
        <input
          type='search'
          id='search'
          className='form-control rounded'
          placeholder='Search'
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          type='button'
          className='btn btn-outline-primary'
          onClick={() => setSearch(text)}
        >
          Search
        </button>
      </div>
      <div className='mt-4'>
        <AsyncData loading={isLoading} error={error || deleteError}>
          {!error ? (
            <TransactionTable
              transactions={filteredTransactions}
              onDelete={deleteTransaction}
              onEdit={setTransactionToUpdate}
            />
          ) : null}
        </AsyncData>
      </div>
    </>
  );
}
