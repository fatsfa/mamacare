const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());

const allowedOrigins = [
  process.env.CLIENT_URL, // e.g. https://your-frontend.onrender.com
  'http://localhost:5173',
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // allow server-to-server / curl (no origin) + allowed list
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

// health check
app.get('/api/health', (req, res) => res.json({ ok: true }));

// IMPORTANT: mount with /api prefix
app.use('/api/auth', require('./routes/auth'));
app.use('/api/babies', require('./routes/babies'));
app.use('/api/logs', require('./routes/logs'));
app.use('/api/articles', require('./routes/articles'));
app.use('/api/vaccines', require('./routes/vaccines'));
app.use('/api/ai', require('./routes/ai'));

module.exports = app;
