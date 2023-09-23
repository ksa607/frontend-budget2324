import { useState, useMemo, useCallback, useContext, useEffect } from 'react';
import Transaction from './Transaction';
import TransactionForm from './TransactionForm';
import { ThemeContext } from '../../contexts/Theme.context';
import * as transactionsApi from '../../api/transactions';
import AsyncData from '../AsyncData';

function TransactionTable({ transactions }) {
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
            <Transaction key={transaction.id} {...transaction} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function TransactionList() {
  const [transactions, setTransactions] = useState([]);
  const [text, setText] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await transactionsApi.getAll();
        setTransactions(data);
      } catch (error) {
        console.error(error);
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    fetchTransactions();
  }, []);

  const filteredTransactions = useMemo(
    () =>
      transactions.filter((t) => {
        return t.place.name.toLowerCase().includes(search.toLowerCase());
      }),
    [search, transactions]
  );

  const createTransaction = useCallback(
    (user, place, amount, date) => {
      const newTransactions = [
        {
          user,
          place,
          amount,
          date: new Date(date),
        },
        ...transactions,
      ]; // newest first
      setTransactions(newTransactions);
    },
    [transactions]
  );

  return (
    <>
      <h1>Transactions</h1>
      <TransactionForm onSaveTransaction={createTransaction} />
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
        <AsyncData loading={loading} error={error}>
          {!error ? <TransactionTable transactions={filteredTransactions} /> : null}
        </AsyncData>
      </div>
    </>
  );
}
