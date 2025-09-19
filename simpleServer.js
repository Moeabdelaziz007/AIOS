const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('client/dist'));

// Basic API endpoints
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      server: true,
      socket: true
    },
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

app.get('/api/agents', (req, res) => {
  res.json({
    status: 'success',
    agents: [
      { id: 'smart_agent', name: 'Smart Agent', status: 'running' },
      { id: 'data_agent', name: 'Data Agent', status: 'running' },
      { id: 'debug_agent', name: 'Debug Agent', status: 'running' }
    ],
    timestamp: new Date().toISOString()
  });
});

app.get('/api/metrics', (req, res) => {
  res.json({
    status: 'success',
    metrics: {
      cpuUsage: Math.floor(Math.random() * 100),
      memoryUsage: Math.floor(process.memoryUsage().heapUsed / 1024 / 1024),
      healthScore: 95,
      uptime: process.uptime(),
      anomalies: [],
      recommendations: []
    },
    timestamp: new Date().toISOString()
  });
});

// Socket.io connection handling
io.on('connection', socket => {
  console.log('✅ Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });

  socket.emit('welcome', { message: 'Connected to AIOS Server' });
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Simple AIOS Server running on port ${PORT}`);
  console.log(`📡 Socket.io server ready for connections`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Process terminated');
  });
});
