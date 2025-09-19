const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'AIOS Server is running',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/config', (req, res) => {
  res.json({
    projectId: 'aios-97581',
    apiUrl: `http://localhost:${PORT}/api`,
    wsUrl: `http://localhost:${PORT}`
  });
});

app.get('/api/apps', (req, res) => {
  res.json({
    apps: [
      {
        id: '1',
        name: 'AIOS Dashboard',
        description: 'Main dashboard application',
        status: 'active',
        version: '1.0.0',
        createdAt: new Date().toISOString(),
        userId: 'system'
      },
      {
        id: '2',
        name: 'Data Agent',
        description: 'AI data processing agent',
        status: 'active',
        version: '1.0.0',
        createdAt: new Date().toISOString(),
        userId: 'system'
      },
      {
        id: '3',
        name: 'Quantum Autopilot',
        description: 'Automated system management',
        status: 'active',
        version: '1.0.0',
        createdAt: new Date().toISOString(),
        userId: 'system'
      }
    ]
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
    active: true,
    uptime: process.uptime(),
    tasksProcessed: Math.floor(Math.random() * 100),
    lastActivity: new Date().toISOString(),
    performance: {
      cpu: Math.random() * 100,
      memory: Math.random() * 100,
      network: Math.random() * 100
    },
    timestamp: new Date().toISOString(),
    status: 'operational'
  });
});

app.get('/api/quantum/stats', (req, res) => {
  res.json({
    totalTasks: Math.floor(Math.random() * 1000),
    completedTasks: Math.floor(Math.random() * 800),
    failedTasks: Math.floor(Math.random() * 50),
    averageExecutionTime: Math.random() * 1000,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/quantum/recommendations', (req, res) => {
  res.json([
    {
      id: 1,
      type: 'performance',
      title: 'Optimize Memory Usage',
      description: 'Consider reducing memory allocation for better performance',
      priority: 'high',
      timestamp: new Date().toISOString()
    },
    {
      id: 2,
      type: 'security',
      title: 'Update Dependencies',
      description: 'Several dependencies have security updates available',
      priority: 'medium',
      timestamp: new Date().toISOString()
    }
  ]);
});

app.get('/api/system/status', (req, res) => {
  res.json({
    timestamp: new Date().toISOString(),
    status: 'operational',
    services: {
      systemIntegration: 'active',
      unifiedAutopilot: 'active',
      errorFlowManager: 'active',
      firebase: 'mock_mode'
    },
    metrics: {
      connectedClients: 0,
      onlineUsers: 0,
      uptime: process.uptime()
    }
  });
});

app.get('/api/system/logs', (req, res) => {
  res.json({
    logs: [
      {
        timestamp: new Date().toISOString(),
        level: 'INFO',
        message: 'AIOS System operational',
        source: 'system'
      }
    ],
    totalLogs: 1
  });
});

app.get('/api/users/online', (req, res) => {
  res.json({
    users: []
  });
});

// Socket.io connection handling
io.on('connection', socket => {
  console.log('🔌 Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id);
  });

  socket.emit('welcome', { message: 'Connected to AIOS Server' });
});

// Serve static files
app.use(express.static('client/build'));

// Catch all handler - send React app for any non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

server.listen(PORT, () => {
  console.log(`🚀 AIOS Production Server running on port ${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api/`);
  console.log(`🔌 Socket.io server ready for connections`);
});
