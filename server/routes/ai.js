const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const AIChat = require('../models/AIChat');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

const SYSTEM_PROMPT = `You are MamaCare AI, a helpful and caring assistant for new mothers in the UAE with babies aged 0–24 months.
Rules:
- Answer baby care questions clearly and kindly (feeding, sleep, health, development, diapers).
- Keep answers concise — 3 to 5 sentences max.
- Always end with: "⚕️ For specific medical concerns, please consult your pediatrician."
- Never diagnose or prescribe medicine.
- If the question is unrelated to baby/mom care, politely redirect.`;

const getAIResponse = async (question) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not set in environment');

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const result = await model.generateContent(`${SYSTEM_PROMPT}\n\nMom's question: ${question}`);
  return result.response.text();
};

router.post('/ask', async (req, res) => {
  try {
    const { question } = req.body;
    if (!question || !question.trim()) {
      return res.status(400).json({ ok: false, error: 'Question is required' });
    }

    let response;
    try {
      response = await getAIResponse(question.trim());
    } catch (aiErr) {
      console.error('Gemini AI error:', aiErr.message);
      // Handle rate limit specifically
      if (aiErr.message && (aiErr.message.includes('429') || aiErr.message.includes('quota') || aiErr.message.includes('RESOURCE_EXHAUSTED'))) {
        return res.status(429).json({ ok: false, error: 'AI is busy right now. Please wait a moment and try again.' });
      }
      return res.status(500).json({ ok: false, error: 'AI service unavailable. Please try again later.' });
    }

    const chat = await AIChat.create({
      userId: req.user.id,
      question: question.trim(),
      response,
    });

    res.json({ ok: true, answer: chat });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
});

router.get('/history', async (req, res) => {
  try {
    const history = await AIChat.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(30);
    res.json({ ok: true, history });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
});

module.exports = router;
