const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role:     { type: String, enum: ['user','admin'], default: 'user' },
points:   { type: Number, default: 0 }
}, { timestamps: true });

// Μέθοδος για υπολογισμό level βάσει πόντων
userSchema.methods.getLevel = function() {
  const p = this.points;
  if (p >= 300) return 'Platinum';
  if (p >= 200) return 'Gold';
  if (p >= 100) return 'Silver';
  return 'Bronze';
};

module.exports = mongoose.model('User', userSchema);
