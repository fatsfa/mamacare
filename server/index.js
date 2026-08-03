const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const express = require('express');

const app = express();

// 1. CORS first
app.use(cors({
  origin: ['https://mamacare-fsli.onrender.com', 'http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 2. Body parser
app.use(express.json());

// 3. Test route to check if server is alive
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// 4. MOUNT YOUR ROUTES HERE
const authRoutes = require('./routes/auth'); // change path to yours
app.use('/api/auth', authRoutes);

// 5. Catch all 404 - this also needs CORS
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// 6. DB + Server
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ MongoDB connected successfully');
  } catch (err) {
    console.error('✗ MongoDB connection error:', err.message);
    process.exit(1);
  }
};

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`);
});