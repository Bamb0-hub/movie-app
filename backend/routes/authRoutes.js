const express = require('express');
const router  = express.Router();
const User    = require('../models/User');
const bcrypt  = require('bcrypt');
const jwt     = require('jsonwebtoken');
require('dotenv').config();

// Σταθερές
const ADMIN_EMAIL = process.env.ADMIN_EMAIL?.toLowerCase() || '';
// Επιτρεπόμενα domains για email εγγραφής
const ALLOWED_DOMAINS = ['gmail.com', 'hotmail.com', 'yahoo.com'];

// Register Route
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Έλεγχος υποχρεωτικών πεδίων
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Όλα τα πεδία είναι υποχρεωτικά.' });
  }
  // Έλεγχος επιτρεπόμενου domain email
  const domain = email.toLowerCase().split('@')[1] || '';
  if (!ALLOWED_DOMAINS.includes(domain)) {
    return res.status(400).json({
      error: 'Χρησιμοποίησε έγκυρο email (gmail.com, hotmail.com, yahoo.com).'
    });
  }

  try {
    // Έλεγχος υπάρχοντος χρήστη με το ίδιο email
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: 'Το email υπάρχει ήδη.' });
    }
    // Έλεγχος υπάρχοντος χρήστη με το ίδιο username
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Το όνομα χρήστη υπάρχει ήδη.' });
    }

    // Hash κωδικού
    const hashedPassword = await bcrypt.hash(password, 10);
    const isAdmin = email.toLowerCase() === ADMIN_EMAIL;

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: isAdmin ? 'admin' : 'user'
    });

    await newUser.save();
    return res.status(201).json({ message: 'User created successfully', role: newUser.role });

  } catch (err) {
    console.error('Registration error:', err);
    // Duplicate key (επιπλέον ασφαλεία)
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      let msg = 'Κάποιο πεδίο υπάρχει ήδη.';
      if (field === 'username') msg = 'Το όνομα χρήστη υπάρχει ήδη.';
      if (field === 'email') msg = 'Το email υπάρχει ήδη.';
      return res.status(400).json({ error: msg });
    }
    return res.status(500).json({ error: 'Server error' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email και κωδικός απαιτούνται.' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Ο χρήστης δεν βρέθηκε.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Λάθος κωδικός.' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
      return res.status(200).json({
      message: 'Επιτυχής σύνδεση!',
      token,
      user: {
        id: user._id,
       username: user.username,   // ← εδώ πια επιστρέφουμε το username
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Σφάλμα διακομιστή.' });
  }
});

module.exports = router;
