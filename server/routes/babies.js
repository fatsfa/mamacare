const express = require('express');
const router = express.Router();
const Baby = require('../models/Baby');

router.post('/', async (req, res) => {
  try {
    const baby = await Baby.create(req.body);
    res.json({ ok: true, baby });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.userId) filter.userId = req.query.userId;
    const babies = await Baby.find(filter).sort({ createdAt: -1 });
    res.json({ ok: true, babies });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const baby = await Baby.findById(req.params.id);
    if (!baby) return res.status(404).json({ ok: false, error: 'Baby not found' });
    res.json({ ok: true, baby });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const baby = await Baby.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!baby) return res.status(404).json({ ok: false, error: 'Baby not found' });
    res.json({ ok: true, baby });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const baby = await Baby.findByIdAndDelete(req.params.id);
    if (!baby) return res.status(404).json({ ok: false, error: 'Baby not found' });
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
});

module.exports = router;
