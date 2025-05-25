// src/components/ReviewForm.js
import React, { useState } from 'react';
import api from '../api/axios';

const ReviewForm = ({ movieId, onNewReview = () => {} }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!movieId || !rating) {
      setError('Απαραίτητο rating & ταινία');
      return;
    }
    if (comment.trim() === '') {
      setError('Παρακαλώ γράψε την κριτική σου.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await api.post(
        '/reviews/add',
        { movieId, rating, comment: comment.trim() }
      );

      const newReview = res.data;
      onNewReview(newReview);

      // Εκπομπή global event για ανανέωση της λίστας
      window.dispatchEvent(new Event('reviewCreated'));

      setComment('');
    } catch (err) {
      console.error('ReviewForm error:', err);
      const body = err.response?.data;
      const status = err.response?.status;
      setError(
        body?.error || body?.message || `Σφάλμα ${status}: ${err.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
      <label>Βαθμολογία:</label>
      <select
        value={rating}
        onChange={(e) => setRating(+e.target.value)}
        disabled={loading}
      >
        {[1, 2, 3, 4, 5].map((n) => (
          <option key={n} value={n}>{n}★</option>
        ))}
      </select>

      <label>Κριτική:</label>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={2}
        placeholder="Σχόλιά σου..."
        disabled={loading}
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Υποβολή...' : 'Υποβολη Κριτικης'}
      </button>

      {error && (
        <p style={{ color: 'red', marginTop: '0.5rem' }}>{error}</p>
      )}
    </form>
  );
};

export default ReviewForm;
