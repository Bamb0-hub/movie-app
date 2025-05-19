// routes/authRoutes.js
const express = require('express');
const router  = express.Router();
const User    = require('../models/User');
const bcrypt  = require('bcrypt');
const jwt     = require('jsonwebtoken');       

// =======================
// Register Route
// =======================
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Όλα τα πεδία είναι υποχρεωτικά' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });

  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('➡️ Login attempt for:', email, ' / password:', password ? '***' : '[empty]');

  if (!email || !password) {
    console.log('❌ Missing email or password');
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // 1) Έλεγξε αν βρίσκει χρήστη
    const user = await User.findOne({ email });
    console.log('🔍 User lookup result:', user);

    if (!user) {
      console.log('❌ User not found');
      return res.status(401).json({ error: 'Ο χρήστης δεν βρέθηκε.' });
    }

    // 2) Έλεγξε password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('🔑 Password match:', isMatch);

    if (!isMatch) {
      console.log('❌ Incorrect password');
      return res.status(401).json({ error: 'Λάθος κωδικός.' });
    }

    // 3) Βεβαιώσου ότι διαβάζεις το secret σωστά
    console.log('🔐 JWT_SECRET is:', process.env.JWT_SECRET);

    // 4) Δημιουργία token
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,      // χωρίς fallback εδώ
      { expiresIn: '1h' }
    );
    console.log('✅ Token generated:', token);

    return res.status(200).json({
      message: 'Επιτυχής σύνδεση!',
      token,
      user: { id: user._id, email: user.email }
    });

  } catch (err) {
    console.error('❌ Login error caught:', err);
    return res.status(500).json({ error: 'Σφάλμα διακομιστή.' });
  }
});

module.exports = router;