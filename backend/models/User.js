const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  credits: { type: Number, default: 5 },
  hasRecharged: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
