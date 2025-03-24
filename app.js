import React from 'react';
import Rating from './components/Rating';

function App() {
  const handleRating = (value) => {
    console.log('User rating:', value);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Test Bathroom Rating</h1>
      <Rating onRate={handleRating} />
    </div>
  );
}

export default App;
