// routes/lists.js
const express = require('express');
const router  = express.Router();
const List    = require('../models/List');
const jwt     = require('jsonwebtoken');

// Middleware για έλεγχο JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token      = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;  // { id, username }
    next();
  });
}

// 1. Δημιουργία νέας λίστας (προστατευμένο)
router.post('/add', authenticateToken, async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  try {
    const list = new List({
      name,
      userId: req.user.id,
      movies: []
    });
    await list.save();
    res.status(201).json(list);
  } catch (err) {
    console.error('Create list error:', err);
    res.status(500).json({ error: 'Failed to create list' });
  }
});

// 2. Προσθήκη ταινίας σε λίστα (προστατευμένο + έλεγχος ιδιοκτησίας)
router.post('/:listId/add-movie', authenticateToken, async (req, res) => {
  const { movieId } = req.body;
  try {
    const list = await List.findById(req.params.listId);
    if (!list) {
      return res.status(404).json({ error: 'List not found' });
    }
    if (list.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    if (!list.movies.includes(movieId)) {
      list.movies.push(movieId);
      await list.save();
    }

    res.json(list);
  } catch (err) {
    console.error('Add movie error:', err);
    res.status(500).json({ error: 'Failed to add movie to list' });
  }
});

// 3. Προβολή λιστών του χρήστη (προστατευμένο + έλεγχος ιδιοκτησίας)
router.get('/user/:userId', authenticateToken, async (req, res) => {
  if (req.user.id !== req.params.userId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    const lists = await List
      .find({ userId: req.user.id })
      .populate('movies');
    res.json(lists);
  } catch (err) {
    console.error('Get user lists error:', err);
    res.status(500).json({ error: 'Failed to fetch user lists' });
  }
});

module.exports = router;
