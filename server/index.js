const mongoose = require('mongoose');
require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✓ MongoDB connected successfully');

  app.listen(PORT, () => {
    console.log(`✓ Server running on port ${PORT}`);
  });
};

startServer().catch((err) => {
  console.error('✗ MongoDB connection error:', err.message);
  process.exit(1);
});