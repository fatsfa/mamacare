const express = require('express');
const router = express.Router();
const Baby = require('../models/Baby');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.post('/', async (req, res) => {
  try {
    const baby = await Baby.create({ ...req.body, userId: req.user.id });
    res.json({ ok: true, baby });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const filter = { userId: req.user.id };
    const babies = await Baby.find(filter).sort({ createdAt: -1 });
    res.json({ ok: true, babies });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const baby = await Baby.findOne({ _id: req.params.id, userId: req.user.id });
    if (!baby) return res.status(404).json({ ok: false, error: 'Baby not found' });
    res.json({ ok: true, baby });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const baby = await Baby.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!baby) return res.status(404).json({ ok: false, error: 'Baby not found' });
    res.json({ ok: true, baby });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const baby = await Baby.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!baby) return res.status(404).json({ ok: false, error: 'Baby not found' });
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
});

module.exports = router;
