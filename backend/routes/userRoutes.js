// backend/routes/userRoutes.js
const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');

// Middleware για JWT authentication
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token      = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token required' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user; // { id, username, role }
    next();
  });
}

// GET /api/user/me
// Επιστρέφει profile: username, role, points, level
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const u = await User.findById(req.user.id);
    if (!u) return res.status(404).json({ error: 'User not found' });

    res.json({
      username: u.username,
      role:     u.role,
      points:   u.points,
      level:    u.getLevel()
    });
  } catch (err) {
    console.error('Get user profile error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
