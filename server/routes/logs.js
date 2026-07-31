const express = require('express');
const router = express.Router();
const Log = require('../models/Log');
const Baby = require('../models/Baby');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

const verifyBabyOwnership = async (babyId, userId) => {
  const baby = await Baby.findOne({ _id: babyId, userId });
  return Boolean(baby);
};

const computeDurationMinutes = (startTime, endTime) => {
  if (!startTime || !endTime) return undefined;
  const start = new Date(startTime);
  const end = new Date(endTime);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return undefined;
  const minutes = Math.round((end - start) / 60000);
  if (minutes < 1) return undefined;
  return minutes;
};

router.post('/', async (req, res) => {
  try {
    const body = req.body || {};
    const { babyId } = body;
    if (!babyId) return res.status(400).json({ ok: false, error: 'babyId is required' });

    const isOwner = await verifyBabyOwnership(babyId, req.user.id);
    if (!isOwner) return res.status(403).json({ ok: false, error: 'Not authorized for this baby' });

    const durationMinutes = computeDurationMinutes(body.startTime, body.endTime);
    const payload = { ...body };
    if (durationMinutes !== undefined) payload.durationMinutes = durationMinutes;

    const log = await Log.create(payload);
    res.json({ ok: true, log });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { babyId, date } = req.query;
    if (!babyId) return res.status(400).json({ ok: false, error: 'babyId is required' });

    const isOwner = await verifyBabyOwnership(babyId, req.user.id);
    if (!isOwner) return res.status(403).json({ ok: false, error: 'Not authorized for this baby' });

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
    const log = await Log.findById(req.params.id);
    if (!log) return res.status(404).json({ ok: false, error: 'Log not found' });

    const isOwner = await verifyBabyOwnership(log.babyId, req.user.id);
    if (!isOwner) return res.status(403).json({ ok: false, error: 'Not authorized for this baby' });

    const durationMinutes = computeDurationMinutes(req.body.startTime, req.body.endTime);
    const payload = { ...req.body };
    if (durationMinutes !== undefined) payload.durationMinutes = durationMinutes;

    const updated = await Log.findByIdAndUpdate(req.params.id, payload, { new: true });
    res.json({ ok: true, log: updated });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const log = await Log.findById(req.params.id);
    if (!log) return res.status(404).json({ ok: false, error: 'Log not found' });

    const isOwner = await verifyBabyOwnership(log.babyId, req.user.id);
    if (!isOwner) return res.status(403).json({ ok: false, error: 'Not authorized for this baby' });

    await Log.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
});

module.exports = router;