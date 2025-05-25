// backend/middleware/auth.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware: Έλεγχος JWT Token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  console.log('🔑 Authorization header =', authHeader);
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
    console.log('✅ JWT payload =', payload);
    req.user = payload;
    next();
  });
}



// Middleware: Έλεγχος αν είναι Admin
function isAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'User not authenticated' });
  }
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin privileges required' });
  }
  next();
}

module.exports = {
  authenticateToken,
  isAdmin
};
