import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ReviewList = ({ movieId }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/reviews/movie/${movieId}`)
      .then(res => setReviews(res.data))
      .catch(err => console.error('❌ Fetch reviews:', err));
  }, [movieId]);

  if (!reviews.length) return <p>Σχολιασμός δεν υπάρχει.</p>;

  return (
    <div style={{ marginTop: '1rem' }}>
      {reviews.map(r => (
        <div key={r._id} style={{ borderBottom: '1px solid #ddd', padding: '0.5rem 0' }}>
          <strong>{r.userId.username}</strong> — {r.rating}★  
          <p>{r.comment}</p>
          <small>{new Date(r.createdAt).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
