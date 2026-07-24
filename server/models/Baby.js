const mongoose = require('mongoose');

const BabySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  dob: { type: Date, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'], default: 'other' },
  photoUrl: { type: String },
  bloodType: { type: String },
  birthWeight: { type: Number }, // grams or kg as documented
  createdAt: { type: Date, default: Date.now },
});

// Virtual: age in months/weeks/days (readable)
BabySchema.virtual('ageReadable').get(function () {
  if (!this.dob) return '';
  const ms = Date.now() - this.dob.getTime();
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  const months = Math.floor(days / 30);
  const weeks = Math.floor((days % 30) / 7);
  if (months > 0) {
    return `${months} month${months > 1 ? 's' : ''}${weeks > 0 ? ` ${weeks} week${weeks > 1 ? 's' : ''}` : ''}`;
  }
  const remWeeks = Math.floor(days / 7);
  return `${remWeeks} week${remWeeks > 1 ? 's' : ''}${days % 7 > 0 ? ` ${days % 7} day${(days % 7) > 1 ? 's' : ''}` : ''}`;
});

BabySchema.set('toJSON', { virtuals: true });
BabySchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Baby', BabySchema);
