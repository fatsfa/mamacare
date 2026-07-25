const mongoose = require('mongoose');

const BookmarkSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  articleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Article', required: true },
  createdAt: { type: Date, default: Date.now },
});

BookmarkSchema.index({ userId: 1, articleId: 1 }, { unique: true });

module.exports = mongoose.model('Bookmark', BookmarkSchema);
