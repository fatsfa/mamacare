const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /api/test/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const u = await User.create({ name, email, password });
    return res.json({ ok: true, user: { id: u._id, email: u.email } });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ ok: false, error: err.message });
  }
});

module.exports = router;