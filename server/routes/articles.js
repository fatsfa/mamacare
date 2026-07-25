const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const Bookmark = require('../models/Bookmark');
const authMiddleware = require('../middleware/auth');
const staticArticles = require('../data/articles.json');

router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      filter.$or = [
        { title: searchRegex },
        { content: searchRegex },
      ];
    }

    const articles = await Article.find(filter).sort({ createdAt: -1 });
    if (articles.length > 0) {
      return res.json({ ok: true, articles });
    }

    const fallback = (filter.category || filter.$or)
      ? staticArticles.filter((article) => {
        if (filter.category && article.category !== filter.category) return false;
        if (filter.$or) {
          const searchRegex = new RegExp(req.query.search, 'i');
          return searchRegex.test(article.title) || searchRegex.test(article.content);
        }
        return true;
      })
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

router.post('/bookmark', authMiddleware, async (req, res) => {
  try {
    const { articleId } = req.body;
    if (!articleId) return res.status(400).json({ ok: false, error: 'articleId is required' });

    const existing = await Bookmark.findOne({ userId: req.user.id, articleId });
    if (existing) {
      await Bookmark.deleteOne({ _id: existing._id });
      return res.json({ ok: true, bookmarked: false });
    }

    await Bookmark.create({ userId: req.user.id, articleId });
    res.json({ ok: true, bookmarked: true });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
});

router.get('/bookmarks/list', authMiddleware, async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ userId: req.user.id })
      .populate('articleId')
      .sort({ createdAt: -1 });
    res.json({ ok: true, bookmarks: bookmarks.map(b => b.articleId) });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
});

module.exports = router;