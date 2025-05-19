const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');

// Create a new movie
router.post('/add', async (req, res) => {
  try {
    const newMovie = new Movie(req.body);
    await newMovie.save();
    res.status(201).json({ message: '🎬 Movie added successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add movie' });
  }
});

// Get all movies
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
});

router.post('/add', async (req, res) => {
  const { title, genre, year, type } = req.body;

  try {
    // 🔍 Έλεγχος αν υπάρχει ήδη ταινία με ίδιο τίτλο
    const existingMovie = await Movie.findOne({ title: title.trim() });

    if (existingMovie) {
      return res.status(400).json({ error: 'Η ταινία υπάρχει ήδη στη βάση.' });
    }

    const movie = new Movie({ title, genre, year, type });
    await movie.save();
    res.json(movie);
  } catch (err) {
    res.status(500).json({ error: 'Σφάλμα κατά την προσθήκη της ταινίας.' });
  }
});


module.exports = router;
