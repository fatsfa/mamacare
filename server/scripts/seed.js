const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Article = require('../models/Article');
const articles = require('../data/articles.json');
const vaccines = require('../data/vaccines.json');

dotenv.config();

const seed = async () => {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI not set in .env');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log('✓ Connected to MongoDB');

  // Seed Articles
  const existingArticles = await Article.countDocuments();
  if (existingArticles > 0) {
    console.log(`✓ Found ${existingArticles} existing articles, skipping articles seed.`);
  } else {
    await Article.insertMany(articles);
    console.log(`✓ Seeded ${articles.length} articles.`);
  }

  console.log(`✓ Vaccines data ready: ${vaccines.length} vaccines (stored as reference, not in DB)`);

  await mongoose.disconnect();
  console.log('✓ Seed complete!');
  process.exit(0);
};

seed().catch((err) => {
  console.error('✗ Seed error:', err.message);
  process.exit(1);
});
