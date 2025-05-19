// backend/routes/reviewRoutes.js
const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');
const Review  = require('../models/Review');

// Middleware JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token      = authHeader && authHeader.split(' ')[1];
  if (!token) {
    console.log('⚠️ No token provided');
    return res.status(401).json({ error: 'Token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error('❌ Token verification failed:', err.message);
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}

// 1) Προσθήκη review (rating + comment)
router.post('/add', authenticateToken, async (req, res) => {
  console.log('➡️ Add Review Request Body:', req.body);
  console.log('➡️ Authenticated User:', req.user);

  const { movieId, rating, comment } = req.body;
  if (!movieId || !rating) {
    console.log('⚠️ Missing movieId or rating');
    return res.status(400).json({ error: 'movieId and rating required' });
  }

  try {
    // Check for existing review by this user for that movie
    let review = await Review.findOne({ movieId, userId: req.user.id });
    if (review) {
      review.rating  = rating;
      review.comment = comment;
      console.log('🔄 Updating existing review');
      await review.save();
    } else {
      console.log('➕ Creating new review');
      review = new Review({
        movieId,
        userId: req.user.id,
        rating,
        comment
      });
      await review.save();
    }
    console.log('✅ Review saved:', review);
    res.status(201).json(review);
  } catch (err) {
    console.error('❌ Failed to add review:', err);
    res.status(500).json({ error: 'Failed to add review' });
  }
});

// 2) Ανάκτηση όλων των reviews για μια ταινία
router.get('/movie/:movieId', async (req, res) => {
  try {
    const reviews = await Review
      .find({ movieId: req.params.movieId })
      .populate('userId', 'username');
    res.json(reviews);
  } catch (err) {
    console.error('❌ Fetch reviews failed:', err);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// 3) Ανάκτηση reviews ενός χρήστη (προστατευμένο)
router.get('/user/:userId', authenticateToken, async (req, res) => {
  if (req.user.id !== req.params.userId) {
    console.log('⚠️ Forbidden: userId mismatch');
    return res.status(403).json({ error: 'Forbidden' });
  }
  try {
    const reviews = await Review
      .find({ userId: req.user.id })
      .populate('movieId', 'title');
    res.json(reviews);
  } catch (err) {
    console.error('❌ Fetch user reviews failed:', err);
    res.status(500).json({ error: 'Failed to fetch user reviews' });
  }
});

module.exports = router;
