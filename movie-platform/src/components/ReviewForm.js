// src/components/ReviewForm.js
import React, { useState } from 'react';
import axios from 'axios';

const ReviewForm = ({ movieId, onNewReview = () => {} }) => {
  const [rating, setRating]   = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!movieId || !rating) {
      setError('Απαραίτητο rating & ταινία');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res   = await axios.post(
        'http://localhost:5000/api/reviews/add',
        { movieId, rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('✅ ReviewForm submit success:', res.data);
      onNewReview(res.data);
      setComment('');
    } catch (err) {
      // Αναλυτικό logging για debugging
      console.error('❌ ReviewForm error object:', err);
      const status = err.response?.status;
      const body   = err.response?.data;
      console.log('🛑 Response status:', status);
      console.log('🛑 Response body:', body);

      // Εμφάνιση ακριβούς μηνύματος λάθους
      setError(
        body?.error    || 
        body?.message  || 
        `Error ${status}: ${err.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
      <label>Βαθμολογία:</label>
      <select value={rating} onChange={(e) => setRating(+e.target.value)}>
        {[1, 2, 3, 4, 5].map((n) => (
          <option key={n} value={n}>
            {n}★
          </option>
        ))}
      </select>

      <label>Κριτική:</label>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={2}
        placeholder="Σχόλιά σου..."
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Υποβολή...' : 'Υποβολή Κριτικής'}
      </button>

      {error && <p className="error">{error}</p>}
    </form>
  );
};

export default ReviewForm;
