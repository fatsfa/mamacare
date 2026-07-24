const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Article = require('../models/Article');
const articles = require('../data/articles.json');

dotenv.config();

const seed = async () => {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI not set in .env');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  const existing = await Article.countDocuments();
  if (existing > 0) {
    console.log(`Found ${existing} existing articles, skipping seed.`);
  } else {
    await Article.insertMany(articles);
    console.log(`Seeded ${articles.length} articles.`);
  }

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
