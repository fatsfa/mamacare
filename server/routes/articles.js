const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const staticArticles = require('../data/articles.json');

router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    const articles = await Article.find(filter).sort({ createdAt: -1 });
    if (articles.length > 0) {
      return res.json({ ok: true, articles });
    }

    const fallback = filter.category
      ? staticArticles.filter((article) => article.category === filter.category)
      : staticArticles;
    return res.json({ ok: true, articles: fallback });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ ok: false, error: 'Article not found' });
    res.json({ ok: true, article });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
});

module.exports = router;