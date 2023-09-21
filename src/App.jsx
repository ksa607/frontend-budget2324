import Transaction from './components/transactions/Transaction';
import TRANSACTION_DATA from './api/mock_data';

function App() {
  return (
    <div className='App'>
      {TRANSACTION_DATA.map((trans) => (
        <Transaction {...trans} />
      ))}
    </div>
  );
}

export default App;
