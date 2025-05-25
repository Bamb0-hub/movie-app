// backend/models/Movie.js
const mongoose = require('mongoose');

// Σχήμα για τις ταινίες/σειρές, με πεδίο imageUrl για cover image
const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  genre: {
    type: String,
    required: true
  },
  releaseYear: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['movie', 'series'],
    default: 'movie'
  },
  imageUrl: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Movie', movieSchema);
