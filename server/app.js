const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();

app.use(cors());
app.use(express.json());

const clientDistPath = path.resolve(__dirname, '..', 'client', 'dist');
const clientIndexPath = path.join(clientDistPath, 'index.html');
const hasBuiltClient = fs.existsSync(clientDistPath) && fs.existsSync(clientIndexPath);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running', timestamp: new Date().toISOString() });
});

// Root
app.get('/', (req, res) => {
  if (hasBuiltClient) {
    return res.sendFile(clientIndexPath);
  }

  return res.json({ message: 'Welcome to MamaCare API', version: '1.0.0' });
});

// Routes
app.use('/api/test',     require('./routes/test'));
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/logs',     require('./routes/logs'));
app.use('/api/vaccines', require('./routes/vaccines'));
app.use('/api/articles', require('./routes/articles'));
app.use('/api/babies',   require('./routes/babies'));
app.use('/api/ai',       require('./routes/ai'));

if (hasBuiltClient) {
  app.use(express.static(clientDistPath, { index: false }));

  app.get(/.*/, (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.includes('.')) {
      return next();
    }

    return res.sendFile(clientIndexPath);
  });
}

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.path, method: req.method });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

module.exports = app;
