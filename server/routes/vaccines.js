const express = require('express');
const router = express.Router();
const VaccineDone = require('../models/VaccineDone');
const Baby = require('../models/Baby');
const authMiddleware = require('../middleware/auth');
const schedule = require('../data/vaccines.json');

router.use(authMiddleware);

const verifyBabyOwnership = async (babyId, userId) => {
  const baby = await Baby.findOne({ _id: babyId, userId });
  return Boolean(baby);
};

router.get('/', async (req, res) => {
  try {
    const { babyId } = req.query;
    if (!babyId) return res.status(400).json({ ok: false, error: 'babyId is required' });

    const isOwner = await verifyBabyOwnership(babyId, req.user.id);
    if (!isOwner) return res.status(403).json({ ok: false, error: 'Not authorized for this baby' });

    const done = await VaccineDone.find({ babyId }).sort({ dateDone: -1 });
    res.json({ ok: true, schedule, done });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
});

router.post('/mark-done', async (req, res) => {
  try {
    const body = req.body || {};
    const { babyId } = body;
    if (!babyId) return res.status(400).json({ ok: false, error: 'babyId is required' });

    const isOwner = await verifyBabyOwnership(babyId, req.user.id);
    if (!isOwner) return res.status(403).json({ ok: false, error: 'Not authorized for this baby' });

    const done = await VaccineDone.create(body);
    res.json({ ok: true, done });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
});

module.exports = router;