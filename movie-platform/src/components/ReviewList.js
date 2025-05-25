// src/components/ReviewList.js
import React, { useState, useEffect } from 'react';
import api from '../api/axios';

// Decode user from JWT token stored in localStorage
const getUserFromToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return { id: payload.id, username: payload.username, role: payload.role };
  } catch {
    return null;
  }
};

function ReviewList({ movieId }) {
  const [reviews, setReviews] = useState([]);
  const currentUser = getUserFromToken();

  // Συνάρτηση φόρτωσης κριτικών
  const fetchReviews = async () => {
    try {
      const res = await api.get(`/reviews/movie/${movieId}`);
      setReviews(res.data);
    } catch (err) {
      console.error('Load reviews error:', err);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchReviews();
    window.addEventListener('reviewCreated', fetchReviews);
    window.addEventListener('reviewUpdated', fetchReviews);
    window.addEventListener('reviewDeleted', fetchReviews);
    return () => {
      window.removeEventListener('reviewCreated', fetchReviews);
      window.removeEventListener('reviewUpdated', fetchReviews);
      window.removeEventListener('reviewDeleted', fetchReviews);
    };
  }, [movieId]);

  const handleDelete = async (reviewId) => {
    try {
      await api.delete(`/reviews/${reviewId}`);
      window.dispatchEvent(new CustomEvent('reviewDeleted', { detail: { reviewId } }));
    } catch (err) {
      console.error('Delete review error:', err);
    }
  };

  return (
    <div className="review-list">
      {reviews.map(r => (
        <div key={r._id} style={{ marginBottom: '1rem', padding: '0.5rem', border: '1px solid #ddd' }}>
          {/* Απεικόνιση αστέρων για βαθμολογία */}
          <div style={{ color: '#f5b50a', fontSize: '1.2rem' }}>
            {Array.from({ length: r.rating }).map((_, i) => (
              <span key={i}>★</span>
            ))}
            {Array.from({ length: 5 - r.rating }).map((_, i) => (
              <span key={i + r.rating} style={{ color: '#ccc' }}>★</span>
            ))}
          </div>
          <strong style={{ display: 'block', fontSize: '1rem', marginBottom: '0.25rem' }}>
            {r.user?.username || 'Unknown User'}
          </strong>
          <small style={{ marginLeft: '0.5rem', color: '#555' }}>
            {new Date(r.createdAt).toLocaleString()}
          </small>
          <p style={{ margin: '0.5rem 0' }}>{r.comment || r.text}</p>
          {currentUser?.id === (r.user && r.user._id ? r.user._id : r.user) && (
            <div>
              <button onClick={() => {/* handle edit */}} style={{ marginRight: '0.5rem' }}>
                Edit
              </button>
              <button onClick={() => handleDelete(r._id)}>
                Delete
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default ReviewList;
