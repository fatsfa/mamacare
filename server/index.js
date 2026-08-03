const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// 1. CORS - Must be first
const allowedOrigins = [
  'https://mamacare-fsli.onrender.com', // your frontend
  'http://localhost:3000', 
  'http://localhost:5173'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 2. Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Health check route - to test if server is up
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'MamaCare API is running' });
});

// 4. Import and use routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Add other routes here
// const userRoutes = require('./routes/user');
// app.use('/api/user', userRoutes);

// 5. 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// 6. Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ MongoDB connected successfully');
  } catch (err) {
    console.error('✗ MongoDB connection error:', err.message);
    process.exit(1);
  }
};

// 7. Start Server
app.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`);
});

connectDB();