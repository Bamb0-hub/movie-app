const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

module.exports = mongoose.model('List', listSchema);
