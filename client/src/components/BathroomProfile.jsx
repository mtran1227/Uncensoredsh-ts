import Rating from './Rating';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';


const BathroomProfile = () => {
  const { id } = useParams();
  const [bathroom, setBathroom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchBathroom = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/bathrooms/${id}`);
        setBathroom(res.data);
      } catch (error) {
        console.error('Failed to fetch bathroom:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBathroom();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`http://localhost:5000/api/bathrooms/${id}/rate`, {
        score: rating,
        userEmail: email,
      });
      setBathroom(res.data);  // update displayed bathroom
      setMessage('⭐ Rating submitted successfully!');
    } catch (error) {
      console.error('Error submitting rating:', error);
      setMessage(error.response?.data?.error || 'Something went wrong.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!bathroom) return <div>Bathroom not found.</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>{bathroom.name}</h1>
      <p><strong>Location:</strong> {bathroom.location}</p>
      <p><strong>Average Rating:</strong> {bathroom.averageRating.toFixed(2)} ⭐</p>

      {/* Rating Form */}
      <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
        <h2>Leave a Rating</h2>
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ display: 'block', marginBottom: '1rem' }}
        />
        <Rating
          bathroomId={id}
          initial={rating}
          onRate={(val) => setRating(val)}
        />
        <button type="submit" style={{ padding: '0.5rem 1rem', backgroundColor: '#007BFF', color: 'white', border: 'none' }}>
          Submit Rating
        </button>
      </form>

      {message && <p style={{ marginTop: '1rem', color: 'green' }}>{message}</p>}
    </div>
  );
};

export default BathroomProfile;
