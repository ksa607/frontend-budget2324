import Transaction from './components/transactions/Transaction';
import { TRANSACTION_DATA } from './api/mock_data';
import PlacesList from './components/places/PlacesList';

function App() {
  return (
    <div>
      {TRANSACTION_DATA.map((trans, index) => (
        <Transaction {...trans} key={index} />
      ))}
      <PlacesList />
    </div>
  );
}
export default App;
