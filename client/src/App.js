import React from 'react';
import Rating from './components/Rating';

function App() {
  const handleRating = (score) => {
    console.log('User selected rating:', score);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Bathroom Rating Test 💩</h1>
      <Rating onRate={handleRating} />
    </div>
  );
}

export default App;
