const express = require('express');
const router = express.Router();
const Log = require('../models/Log');

router.post('/', async (req, res) => {
  try {
    const log = await Log.create(req.body);
    res.json({ ok: true, log });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { babyId, date } = req.query;
    if (!babyId) return res.status(400).json({ ok: false, error: 'babyId is required' });

    const query = { babyId };
    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      query.startTime = { $gte: start, $lt: end };
    }

    const logs = await Log.find(query).sort({ startTime: -1 });
    res.json({ ok: true, logs });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const log = await Log.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!log) return res.status(404).json({ ok: false, error: 'Log not found' });
    res.json({ ok: true, log });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const log = await Log.findByIdAndDelete(req.params.id);
    if (!log) return res.status(404).json({ ok: false, error: 'Log not found' });
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
});

module.exports = router;