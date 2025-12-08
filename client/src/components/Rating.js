import React, { useState } from 'react';
import axios from 'axios';
import { FaRegStar, FaStar } from 'react-icons/fa';

const Rating = ({ bathroomId, initial = 0, onRate }) => {
  const [rating, setRating] = useState(initial);
  const [submitted, setSubmitted] = useState(false);

  const handleClick = async (value) => {
    setRating(value);
    if (onRate) onRate(value);

    try {
      const response = await axios.post('/api/ratings', {
        bathroomId,
        rating: value,
      });
      console.log('Rating submitted:', response.data);
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <p style={{ fontWeight: 'bold' }}>Give your Own Rating</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '10px' }}>
        {[1, 2, 3, 4, 5].map((value) => (
          <span
            key={value}
            onClick={() => handleClick(value)}
            style={{ cursor: 'pointer', fontSize: '2rem', transition: '0.2s' }}
          >
            {value <= rating ? <FaStar color="#FFD700" /> : <FaRegStar color="#ccc" />}
          </span>
        ))}
      </div>
      {submitted && <p style={{ color: 'green' }}>Thanks for your rating!</p>}
    </div>
  );
};

export default Rating;
