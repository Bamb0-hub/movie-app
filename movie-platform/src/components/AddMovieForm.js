// src/components/AddMovieForm.js
import React, { useState } from 'react';
import axios from 'axios';

/**
 * Προσθέτει μια νέα ταινία/σειρά και ενημερώνει το γονικό component
 * @param {{ onMovieAdded: (movie: object) => void }} props
 */
const AddMovieForm = ({ onMovieAdded }) => {
  const [title, setTitle]       = useState('');
  const [genre, setGenre]       = useState('');
  const [type, setType]         = useState('movie');
  const [releaseYear, setYear]  = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Έλεγχος υποχρεωτικών πεδίων
    if (!title || !genre || !releaseYear || !type || !imageUrl) {
      setError('Συμπλήρωσε όλα τα πεδία, συμπεριλαμβανόμενου URL εικόνας.');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:5000/api/movies/add',
        { title, genre, type, releaseYear, imageUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Ενημερώνουμε τον parent component για άμεση εμφάνιση
      onMovieAdded && onMovieAdded(res.data);

      setSuccess(`Η ταινία "${res.data.title}" προστέθηκε!`);
      // Καθαρισμός πεδίων
      setTitle('');
      setGenre('');
      setType('movie');
      setYear('');
      setImageUrl('');
    } catch (err) {
      console.error('AddMovieForm error:', err.response?.data || err.message);
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
      <label>Τίτλος</label>
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />

      <label>Είδος</label>
      <input
        type="text"
        value={genre}
        onChange={e => setGenre(e.target.value)}
        required
      />

      <label>Τύπος</label>
      <select
        value={type}
        onChange={e => setType(e.target.value)}
      >
        <option value="movie">Ταινία</option>
        <option value="series">Σειρά</option>
      </select>

      <label>Έτος</label>
      <input
        type="number"
        value={releaseYear}
        onChange={e => setYear(e.target.value)}
        required
      />

      <label>URL Εικόνας Κάλυψης</label>
      <input
        type="url"
        value={imageUrl}
        onChange={e => setImageUrl(e.target.value)}
        placeholder="https://example.com/cover.jpg"
        required
      />

      <button
        type="submit"
        disabled={loading}
        style={{
          padding: '0.6rem',
          backgroundColor: '#007BFF',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        {loading ? 'Προσθηκη...' : 'Προσθηκη Ταινιας'}
      </button>

      {error && <p className="error" style={{ color: 'red' }}>{error}</p>}
      {success && <p className="success" style={{ color: 'green' }}>{success}</p>}
    </form>
  );
};

export default AddMovieForm;
