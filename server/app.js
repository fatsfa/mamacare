const express = require('express');
const cors = require('cors');

const app = express();

const configuredOrigins = [process.env.CLIENT_URL, process.env.CORS_ORIGINS]
  .filter(Boolean)
  .reduce((origins, value) => {
    value
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean)
      .forEach((origin) => origins.push(origin));
    return origins;
  }, []);

const allowedOrigins = Array.from(
  new Set([
    ...configuredOrigins,
    'http://localhost:3000',
    'http://localhost:5173',
  ])
);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const healthPayload = { status: 'OK', message: 'MamaCare API is running' };
app.get('/health', (req, res) => res.status(200).json(healthPayload));
app.get('/api/health', (req, res) => res.status(200).json(healthPayload));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/babies', require('./routes/babies'));
app.use('/api/logs', require('./routes/logs'));
app.use('/api/articles', require('./routes/articles'));
app.use('/api/vaccines', require('./routes/vaccines'));
app.use('/api/ai', require('./routes/ai'));

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

module.exports = app;
