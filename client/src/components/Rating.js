import React, { useState } from 'react';
import { FaRegStar, FaStar } from 'react-icons/fa';

const Rating = ({ onRate, initial = 0 }) => {
  const [rating, setRating] = useState(initial);

  const handleClick = (value) => {
    setRating(value);
    if (onRate) onRate(value);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      {[1, 2, 3, 4, 5].map((value) => (
        <span
          key={value}
          onClick={() => handleClick(value)}
          style={{ cursor: 'pointer', fontSize: '2rem', margin: '0 5px' }}
        >
          {value <= rating ? <FaStar color="#FFD700" /> : <FaRegStar color="#ccc" />}
        </span>
      ))}
    </div>
  );
};

export default Rating;
