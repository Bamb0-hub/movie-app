// src/components/MovieList.js
import React from 'react';
import AddToListForm from './AddToListForm';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';

const MovieList = ({ movies, onAddToListSuccess }) => {
  if (!movies.length) {
    return <p>Δεν υπάρχουν καταχωρήσεις.</p>;
  }

  return (
    <div className="movie-list" style={{ padding: '1rem' }}>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {movies.map(movie => (
          <li
            key={movie._id}
            className="card"
            style={{
              display: 'flex',
              gap: '1rem',
              marginBottom: '1.5rem',
              padding: '1rem',
              backgroundColor: '#fff',
              borderRadius: '8px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
            }}
          >
            {/* Εικόνα κάλυψης */}
            {movie.imageUrl && (
              <img
                src={movie.imageUrl}
                alt={movie.title}
                style={{
                  width: '120px',
                  height: '180px',
                  objectFit: 'cover',
                  borderRadius: '4px'
                }}
              />
            )}

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              {/* Βασικά στοιχεία */}
              <div style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>
                <strong>{movie.title}</strong>{' '}
                <span style={{ color: '#555' }}>({movie.releaseYear})</span>{' '}
                <span style={{ fontStyle: 'italic', color: '#777' }}>{movie.genre}</span>{' '}
                <span style={{
                  background: movie.type === 'movie' ? '#000' : '#eee',
                  color: movie.type === 'movie' ? '#fff' : '#000',
                  padding: '0.2em 0.5em',
                  borderRadius: '4px',
                  fontSize: '0.85em'
                }}>
                  {movie.type === 'movie' ? 'Ταινία' : 'Σειρά'}
                </span>
              </div>

              {/* Προσθήκη σε λίστα */}
              <div style={{ marginBottom: '0.75rem' }}>
                <AddToListForm
                  movieId={movie._id}
                  onAddSuccess={onAddToListSuccess}
                />
              </div>

              {/* Αξιολόγηση */}
              <div style={{ marginBottom: '0.75rem' }}>
                <ReviewForm movieId={movie._id} />
              </div>

              {/* Εμφάνιση κριτικών */}
              <ReviewList movieId={movie._id} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MovieList;
