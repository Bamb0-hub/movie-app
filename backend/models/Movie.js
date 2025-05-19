const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  genre: String,
  releaseYear: Number,
  type: { type: String, enum: ['movie', 'series'], default: 'movie' }
});

module.exports = mongoose.model('Movie', movieSchema);
