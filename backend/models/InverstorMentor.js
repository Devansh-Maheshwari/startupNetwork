const mongoose = require('mongoose');

const InvestorMentorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  type: { type: String, enum: ['Investor', 'Mentor'], required: true }
});

module.exports = mongoose.model('InvestorMentor', InvestorMentorSchema);
