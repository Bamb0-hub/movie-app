// backend/routes/reviewRoutes.js

const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');
const Review  = require('../models/Review');

// Middleware JWT έλεγχος
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
    req.user = user;  // { id, username, role }
    next();
  });
}

// 1) Προσθήκη ή overwrite κριτικής (rating + comment)
router.post('/add', authenticateToken, async (req, res) => {
  try {
    const { movieId, rating, comment } = req.body;
    if (!movieId || rating == null) {
      return res.status(400).json({ error: 'movieId and rating required' });
    }

    // Βρες αν υπάρχει ήδη κριτική από αυτόν τον χρήστη για το συγκεκριμένο movie
    let review = await Review.findOne({
      movieId,
      userId: req.user.id
    });

    if (review) {
      // Υπάρχει → overwrite
      review.rating  = rating;
      review.comment = comment;
      review.updatedAt = Date.now();
      await review.save();
      return res.status(200).json(review);
    }

    // Δεν υπάρχει → δημιουργία νέας
    review = new Review({
      movieId,
      userId: req.user.id,
      rating,
      comment
    });
    await review.save();
    return res.status(201).json(review);

  } catch (err) {
    console.error('❌ Failed to add/update review:', err);
    return res.status(500).json({ error: 'Failed to add/update review' });
  }
});

// 2) Ανάκτηση όλων των reviews για μια ταινία
router.get('/movie/:movieId', async (req, res) => {
  try {
    const reviews = await Review
      .find({ movieId: req.params.movieId })
      .populate('userId', 'username');
    return res.json(reviews);
  } catch (err) {
    console.error('❌ Fetch reviews failed:', err);
    return res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// 3) Ανάκτηση όλων των reviews ενός χρήστη
router.get('/user/:userId', authenticateToken, async (req, res) => {
  if (req.user.id !== req.params.userId) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  try {
    const reviews = await Review
      .find({ userId: req.user.id })
      .populate('movieId', 'title');
    return res.json(reviews);
  } catch (err) {
    console.error('❌ Fetch user reviews failed:', err);
    return res.status(500).json({ error: 'Failed to fetch user reviews' });
  }
});

// 4) Ενημέρωση κριτικής (PUT) – προαιρετικό
router.put('/:reviewId', authenticateToken, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const review = await Review.findById(req.params.reviewId);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    if (review.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    review.rating  = rating ?? review.rating;
    review.comment = comment ?? review.comment;
    review.updatedAt = Date.now();
    await review.save();
    return res.json(review);

  } catch (err) {
    console.error('❌ Update review failed:', err);
    return res.status(500).json({ error: 'Failed to update review' });
  }
});

// 5) Διαγραφή κριτικής (DELETE)
router.delete('/:reviewId', authenticateToken, async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    if (review.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await review.deleteOne();
    return res.json({ message: 'Review deleted successfully' });

  } catch (err) {
    console.error('❌ Delete review failed:', err);
    return res.status(500).json({ error: 'Failed to delete review' });
  }
});

module.exports = router;
