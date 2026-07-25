const express = require('express');
const router = express.Router();
const AIChat = require('../models/AIChat');
const Baby = require('../models/Baby');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

const verifyBabyOwnership = async (babyId, userId) => {
  const baby = await Baby.findOne({ _id: babyId, userId });
  return Boolean(baby);
};

const mockAIResponse = (question) => {
  const lowerQuestion = question.toLowerCase();

  if (lowerQuestion.includes('fever')) {
    return 'A fever in babies (0-24 months) can be normal. Monitor for other symptoms like rash, cough, or lethargy. If baby is under 3 months and has a rectal temp >38°C, or is very fussy/inconsolable, call your pediatrician immediately. Otherwise, use infant paracetamol (dose by weight) and recheck temperature. IMPORTANT: Always consult your pediatrician for accurate diagnosis and treatment.';
  }
  if (lowerQuestion.includes('sleep') || lowerQuestion.includes('nap')) {
    return 'Newborns sleep 16-17 hours daily in short bursts. By 3-6 months, establish a routine: bedtime around 7-8 PM, naps 2-3 times daily. Create a calm environment, consistent schedule, and safe sleep surface (crib/bassinet). Avoid co-sleeping with pillows/blankets. Some babies cry before sleep—this is normal. IMPORTANT: Consult your pediatrician about any sleep concerns.';
  }
  if (lowerQuestion.includes('feed') || lowerQuestion.includes('breast') || lowerQuestion.includes('bottle')) {
    return 'Newborns eat every 2-3 hours. Breastfed babies: 8-12 times daily. Formula: follow package instructions (typically 30-60ml per feeding, increase as baby grows). Signs of good feeding: wet diapers, weight gain, contentment. If you have concerns about latch, milk supply, or baby not eating enough, contact your pediatrician or lactation consultant.';
  }
  if (lowerQuestion.includes('poop') || lowerQuestion.includes('diaper') || lowerQuestion.includes('constipation') || lowerQuestion.includes('diarrhea')) {
    return 'Newborns have 1-8+ wet diapers daily (increases by day 4-5). Poop varies: breastfed babies have mustard-like stools, formula-fed have tan/brown. Constipation is rare in breastfed babies. If baby has fewer wet diapers than expected, strains excessively, or has very hard poop, consult your pediatrician. Hydration and diet affect digestion.';
  }
  if (lowerQuestion.includes('cry') || lowerQuestion.includes('colic')) {
    return 'Crying is normal communication. Colic involves crying >3 hours/day, >3 days/week, lasting >3 weeks. Causes include gas, feeding issues, or overstimulation. Try: burping, gentle rocking, white noise, skin-to-skin contact, or adjusting feeding. If colic is severe or you suspect other issues, consult your pediatrician. Remember: crying itself doesn\'t harm baby.';
  }

  return 'That\'s a great question about baby care. While I can provide general information, baby health and development are unique to each child. IMPORTANT: Always consult your pediatrician for specific advice about your baby\'s health, feeding, sleep, or development. They know your baby\'s medical history and can give personalized guidance.';
};

router.post('/ask', async (req, res) => {
  try {
    const { babyId, question } = req.body;
    if (!babyId || !question) {
      return res.status(400).json({ ok: false, error: 'babyId and question are required' });
    }

    const isOwner = await verifyBabyOwnership(babyId, req.user.id);
    if (!isOwner) return res.status(403).json({ ok: false, error: 'Not authorized for this baby' });

    const response = mockAIResponse(question);

    const chat = await AIChat.create({
      userId: req.user.id,
      babyId,
      question,
      response,
    });

    res.json({ ok: true, answer: chat });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
});

router.get('/history', async (req, res) => {
  try {
    const { babyId } = req.query;
    if (!babyId) return res.status(400).json({ ok: false, error: 'babyId is required' });

    const isOwner = await verifyBabyOwnership(babyId, req.user.id);
    if (!isOwner) return res.status(403).json({ ok: false, error: 'Not authorized for this baby' });

    const history = await AIChat.find({ userId: req.user.id, babyId }).sort({ createdAt: -1 });
    res.json({ ok: true, history });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
});

module.exports = router;
