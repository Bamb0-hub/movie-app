require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const listRoutes = require('./routes/lists');
const movieRoutes = require('./routes/movies');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/lists', listRoutes);
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/reviews', reviewRoutes);


// Test route
app.get('/', (req, res) => {
  res.send('Backend is working!');
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB connected');
  app.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
});
