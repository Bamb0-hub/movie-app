// backend/routes/lists.js
const express = require('express');
const router  = express.Router();
const List    = require('../models/List');
const User    = require('../models/User');
const jwt     = require('jsonwebtoken');

// Middleware για έλεγχο JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  console.log('🔥 Authorization header:', authHeader);      // <-- logging

  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    console.warn('No token provided');
    return res.status(401).json({ error: 'Token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      console.error('❌ JWT verify error:', err);
      return res.status(403).json({ error: 'Invalid token' });
    }
    console.log('✅ JWT payload:', payload);               // <-- logging
    req.user = payload;
    next();
  });
}


// 1. Δημιουργία νέας λίστας (μόνο authenticated users)
router.post('/', authenticateToken, async (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Name is required' });
  }

  try {
    const list = new List({
      name: name.trim(),
      userId: req.user.id,
      movies: []
    });
    const saved = await list.save();
    // +5 πόντοι για δημιουργία λίστας
    await User.findByIdAndUpdate(req.user.id, { $inc: { points: 5 } });
    return res.status(201).json(saved);
  } catch (err) {
    console.error('Create list error:', err);
    return res.status(500).json({ error: 'Failed to create list' });
  }
});

// 2. Προβολή λιστών του τρέχοντος χρήστη
router.get('/my', authenticateToken, async (req, res) => {
  try {
    const lists = await List
      .find({ userId: req.user.id })
      .populate('movies');
    return res.json(lists);
  } catch (err) {
    console.error('Get user lists error:', err);
    return res.status(500).json({ error: 'Failed to fetch user lists' });
  }
});

// 3. Προσθήκη ταινίας σε λίστα (μόνο admin χρήστες)
router.post('/:listId/add-movie', authenticateToken, async (req, res) => {
  const { movieId } = req.body;
  try {
    const list = await List.findById(req.params.listId);
    if (!list) return res.status(404).json({ error: 'List not found' });
    
    // Έλεγχος: μόνο ο ΙΔΙΟΚΤΗΤΗΣ μπορεί να προσθέσει ταινίες στη δική του λίστα
    if (list.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Προσθήκη ταινίας αν δεν υπάρχει ήδη
    if (!list.movies.includes(movieId)) {
      list.movies.push(movieId);
      await list.save();
    }
    return res.json(list);
  } catch (err) {
    console.error('Add movie error:', err);
    return res.status(500).json({ error: 'Failed to add movie to list' });
  }
});

module.exports = router;
