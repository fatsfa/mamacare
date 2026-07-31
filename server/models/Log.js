const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
  babyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Baby', required: true },
  type: {
    type: String,
    required: true,
    enum: ['feeding', 'diaper', 'sleep'],
  },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  durationMinutes: { type: Number, min: 1 },
  amount: { type: Number }, // ml or minutes depending on type
  pottyDone: { type: Boolean, default: false }, // diaper only
  notes: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Log', LogSchema);