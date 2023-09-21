import { memo } from 'react';

export default memo(function Transaction(props) {
  const { user, amount, place } = props;
  console.log('Rendering transaction...');
  return (
    <div className='text-bg-dark' style={{ width: '50%' }}>
      {user} gaf €{amount} uit bij {place}
    </div>
  );
});
