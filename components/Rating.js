import React, { useState } from 'react';
import { FaRegStar, FaStar } from 'react-icons/fa'; // Using React Icons
import './Rating.css'; // Optional for styling

const Rating = ({ onRate, initial = 0 }) => {
  const [rating, setRating] = useState(initial);

  const handleClick = (value) => {
    setRating(value);
    if (onRate) onRate(value);
  };

  return (
    <div className="rating-container">
      {[1, 2, 3, 4, 5].map((value) => (
        <span key={value} onClick={() => handleClick(value)} style={{ cursor: 'pointer', fontSize: '24px', margin: '0 4px' }}>
          {value <= rating ? <FaStar color="#FFD700" /> : <FaRegStar color="#ccc" />}
        </span>
      ))}
    </div>
  );
};

export default Rating;
