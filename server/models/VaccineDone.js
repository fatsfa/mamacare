const mongoose = require('mongoose');

const VaccineDoneSchema = new mongoose.Schema({
  babyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Baby', required: true },
  vaccineName: { type: String, required: true, trim: true },
  dateDone: { type: Date, default: Date.now },
  photoUrl: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('VaccineDone', VaccineDoneSchema);