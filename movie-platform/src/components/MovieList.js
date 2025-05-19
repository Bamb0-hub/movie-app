// src/components/MovieList.js
import React, { useEffect, useState } from 'react';
import AddToListForm from './AddToListForm';
import ReviewForm    from './ReviewForm';
import ReviewList    from './ReviewList';
import axios         from 'axios';

const MovieList = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    // Φόρτωση ταινιών/σειρών από backend
    axios.get('http://localhost:5000/api/movies')
      .then((res) => {
        setMovies(res.data);
      })
      .catch((err) => {
        console.error('❌ Failed to fetch movies:', err);
      });
  }, []);

  return (
    <div className="movie-list">

      {movies.length === 0 ? (
        <p>Δεν υπάρχουν καταχωρήσεις.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {movies.map((movie) => (
            <li
              key={movie._id}
              className="card"
              style={{ marginBottom: '1.5rem', padding: '1rem' }}
            >
              {/* Βασικά Στοιχεία Ταινίας */}
              <div style={{ marginBottom: '0.5rem' }}>
                <strong>{movie.title}</strong>{' '}
                ({movie.releaseYear}) – {movie.genre} [{movie.type}]
              </div>

              {/* Φόρμα Προσθήκης σε Λίστα */}
              <AddToListForm movieId={movie._id} />

              {/* Φόρμα Αξιολόγησης & Κριτικής */}
              <ReviewForm movieId={movie._id} />

              {/* Εμφάνιση Κριτικών */}
              <ReviewList movieId={movie._id} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MovieList;
