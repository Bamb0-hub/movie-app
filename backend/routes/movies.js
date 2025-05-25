// backend/routes/movies.js
const express = require('express');
const router  = express.Router();
const Movie   = require('../models/Movie');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// =======================
// Δημιουργία νέας ταινίας (Admin only)
// =======================
router.post(
  '/add',
  authenticateToken,   // JWT έλεγχος
  isAdmin,             // Μόνο admin
  async (req, res) => {
    const { title, genre, type, releaseYear, imageUrl } = req.body;
    // Βασικός validation
    if (!title || !genre || !type || !releaseYear || !imageUrl) {
      return res.status(400).json({ error: 'Συμπλήρωσε όλα τα πεδία, συμπεριλαμβανομένου του URL εικόνας.' });
    }

    try {
      // Αποθήκευση στο Mongo
      const newMovie = new Movie({ title, genre, type, releaseYear, imageUrl });
      await newMovie.save();
      return res.status(201).json(newMovie);
    } catch (err) {
      console.error('Failed to add movie:', err);
      return res.status(500).json({ error: 'Failed to add movie' });
    }
  }
);

// =======================
// Ανάκτηση όλων των ταινιών
// =======================
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    console.error('Fetch movies error:', err);
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
});

module.exports = router;
