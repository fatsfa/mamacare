const express = require('express');
const router = express.Router();
const VaccineDone = require('../models/VaccineDone');
const schedule = require('../data/vaccines.json');

router.get('/', async (req, res) => {
  try {
    const { babyId } = req.query;
    if (!babyId) return res.status(400).json({ ok: false, error: 'babyId is required' });

    const done = await VaccineDone.find({ babyId }).sort({ dateDone: -1 });
    res.json({ ok: true, schedule, done });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
});

router.post('/mark-done', async (req, res) => {
  try {
    const done = await VaccineDone.create(req.body);
    res.json({ ok: true, done });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
});

module.exports = router;