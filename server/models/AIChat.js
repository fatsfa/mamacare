const mongoose = require('mongoose');

const AIChatSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  babyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Baby', required: false },
  question: { type: String, required: true },
  response: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('AIChat', AIChatSchema);
