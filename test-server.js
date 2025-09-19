const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    message: 'AIOS Server is running'
  });
});

app.get('/api/config', (req, res) => {
  res.json({
    environment: process.env.NODE_ENV || 'development',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/apps', (req, res) => {
  res.json({
    apps: [
      { id: '1', name: 'AIOS Core', status: 'running' },
      { id: '2', name: 'Learning Loop', status: 'active' },
      { id: '3', name: 'System Monitor', status: 'operational' }
    ],
    timestamp: new Date().toISOString()
  });
});

app.get('/api/errors', (req, res) => {
  res.json({
    errors: [],
    totalErrors: 0,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/quantum/status', (req, res) => {
  res.json({
    status: 'operational',
    quantumLevel: 85,
    timestamp: new Date().toISOString()
  });
});

// Serve static files
app.use(express.static('client/build'));

// Catch all handler - send React app for any non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 AIOS Test Server running on port ${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api/`);
});
