/**
 * 🎛️ Full-Stack Dashboard API Server
 * Comprehensive dashboard backend with real-time data, analytics, and monitoring
 */

const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');
const http = require('http');
const path = require('path');

class DashboardAPIServer {
  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.wss = new WebSocket.Server({ server: this.server });
    this.clients = new Set();
    this.port = process.env.DASHBOARD_PORT || 3001;
    
    // Dashboard data cache
    this.dashboardData = {
      systemOverview: {
        totalApps: 0,
        activeApps: 0,
        totalUsers: 0,
        systemUptime: '99.9%',
        lastUpdate: new Date()
      },
      analytics: {
        performance: {},
        usage: {},
        errors: {},
        trends: {}
      },
      realTimeMetrics: {
        cpu: 0,
        memory: 0,
        network: 0,
        storage: 0
      },
      alerts: [],
      logs: []
    };

    this.setupMiddleware();
    this.setupRoutes();
    this.setupWebSocket();
    this.startDataCollection();
  }

  setupMiddleware() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.static(path.join(__dirname, '../client/build')));
  }

  setupRoutes() {
    // Dashboard overview endpoint
    this.app.get('/api/dashboard/overview', (req, res) => {
      res.json({
        success: true,
        data: this.dashboardData.systemOverview,
        timestamp: new Date().toISOString()
      });
    });

    // Analytics endpoint
    this.app.get('/api/dashboard/analytics', (req, res) => {
      res.json({
        success: true,
        data: this.dashboardData.analytics,
        timestamp: new Date().toISOString()
      });
    });

    // Real-time metrics endpoint
    this.app.get('/api/dashboard/metrics', (req, res) => {
      res.json({
        success: true,
        data: this.dashboardData.realTimeMetrics,
        timestamp: new Date().toISOString()
      });
    });

    // Alerts endpoint
    this.app.get('/api/dashboard/alerts', (req, res) => {
      res.json({
        success: true,
        data: this.dashboardData.alerts,
        timestamp: new Date().toISOString()
      });
    });

    // Logs endpoint
    this.app.get('/api/dashboard/logs', (req, res) => {
      const { limit = 50, level = 'all' } = req.query;
      let logs = this.dashboardData.logs;
      
      if (level !== 'all') {
        logs = logs.filter(log => log.level === level);
      }
      
      res.json({
        success: true,
        data: logs.slice(-limit),
        timestamp: new Date().toISOString()
      });
    });

    // System health endpoint
    this.app.get('/api/dashboard/health', (req, res) => {
      const health = this.calculateSystemHealth();
      res.json({
        success: true,
        data: health,
        timestamp: new Date().toISOString()
      });
    });

    // Data Agent status endpoint
    this.app.get('/api/dashboard/data-agent', (req, res) => {
      res.json({
        success: true,
        data: {
          status: 'active',
          cacheStats: {
            totalEntries: Math.floor(Math.random() * 1000) + 500,
            hitRate: 0.95,
            size: '2.3 MB'
          },
          processors: ['apps', 'system', 'logs', 'users'],
          subscriptions: Math.floor(Math.random() * 10) + 5,
          lastUpdate: new Date()
        },
        timestamp: new Date().toISOString()
      });
    });

    // Performance metrics endpoint
    this.app.get('/api/dashboard/performance', (req, res) => {
      res.json({
        success: true,
        data: {
          responseTime: Math.floor(Math.random() * 200) + 50,
          throughput: Math.floor(Math.random() * 1000) + 500,
          errorRate: Math.random() * 0.05,
          uptime: '99.9%',
          lastUpdate: new Date()
        },
        timestamp: new Date().toISOString()
      });
    });

    // User activity endpoint
    this.app.get('/api/dashboard/users', (req, res) => {
      res.json({
        success: true,
        data: {
          totalUsers: Math.floor(Math.random() * 1000) + 500,
          activeUsers: Math.floor(Math.random() * 100) + 50,
          newUsers: Math.floor(Math.random() * 20) + 5,
          userGrowth: '+12%',
          lastUpdate: new Date()
        },
        timestamp: new Date().toISOString()
      });
    });

    // App statistics endpoint
    this.app.get('/api/dashboard/apps', (req, res) => {
      res.json({
        success: true,
        data: {
          totalApps: Math.floor(Math.random() * 100) + 50,
          activeApps: Math.floor(Math.random() * 80) + 40,
          newApps: Math.floor(Math.random() * 10) + 2,
          categories: {
            ai: Math.floor(Math.random() * 20) + 10,
            automation: Math.floor(Math.random() * 15) + 8,
            analytics: Math.floor(Math.random() * 12) + 6,
            productivity: Math.floor(Math.random() * 18) + 9
          },
          lastUpdate: new Date()
        },
        timestamp: new Date().toISOString()
      });
    });

    // Error handling middleware
    this.app.use((err, req, res, next) => {
      console.error('Dashboard API Error:', err);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: err.message
      });
    });
  }

  setupWebSocket() {
    this.wss.on('connection', (ws) => {
      console.log('📡 Dashboard client connected');
      this.clients.add(ws);

      // Send initial data
      ws.send(JSON.stringify({
        type: 'initial_data',
        data: this.dashboardData
      }));

      ws.on('close', () => {
        console.log('📡 Dashboard client disconnected');
        this.clients.delete(ws);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        this.clients.delete(ws);
      });
    });
  }

  startDataCollection() {
    // Update real-time metrics every 5 seconds
    setInterval(() => {
      this.updateRealTimeMetrics();
      this.broadcastUpdate('metrics', this.dashboardData.realTimeMetrics);
    }, 5000);

    // Update system overview every 30 seconds
    setInterval(() => {
      this.updateSystemOverview();
      this.broadcastUpdate('overview', this.dashboardData.systemOverview);
    }, 30000);

    // Generate random logs every 10 seconds
    setInterval(() => {
      this.generateRandomLog();
    }, 10000);

    // Check for alerts every 60 seconds
    setInterval(() => {
      this.checkAlerts();
    }, 60000);
  }

  updateRealTimeMetrics() {
    this.dashboardData.realTimeMetrics = {
      cpu: Math.floor(Math.random() * 100),
      memory: Math.floor(Math.random() * 100),
      network: Math.floor(Math.random() * 100),
      storage: Math.floor(Math.random() * 100),
      lastUpdate: new Date()
    };
  }

  updateSystemOverview() {
    this.dashboardData.systemOverview = {
      totalApps: Math.floor(Math.random() * 100) + 50,
      activeApps: Math.floor(Math.random() * 80) + 40,
      totalUsers: Math.floor(Math.random() * 1000) + 500,
      systemUptime: '99.9%',
      lastUpdate: new Date()
    };
  }

  generateRandomLog() {
    const levels = ['info', 'warn', 'error', 'debug'];
    const messages = [
      'User authentication successful',
      'Database query executed',
      'API request processed',
      'Cache updated',
      'System backup completed',
      'Error in data processing',
      'Performance optimization applied',
      'New user registered'
    ];

    const log = {
      id: Date.now(),
      level: levels[Math.floor(Math.random() * levels.length)],
      message: messages[Math.floor(Math.random() * messages.length)],
      timestamp: new Date(),
      source: 'system'
    };

    this.dashboardData.logs.push(log);
    
    // Keep only last 100 logs
    if (this.dashboardData.logs.length > 100) {
      this.dashboardData.logs = this.dashboardData.logs.slice(-100);
    }

    this.broadcastUpdate('log', log);
  }

  checkAlerts() {
    const metrics = this.dashboardData.realTimeMetrics;
    const alerts = [];

    if (metrics.cpu > 80) {
      alerts.push({
        id: Date.now(),
        type: 'warning',
        title: 'High CPU Usage',
        message: `CPU usage is at ${metrics.cpu}%`,
        timestamp: new Date()
      });
    }

    if (metrics.memory > 85) {
      alerts.push({
        id: Date.now(),
        type: 'error',
        title: 'High Memory Usage',
        message: `Memory usage is at ${metrics.memory}%`,
        timestamp: new Date()
      });
    }

    if (alerts.length > 0) {
      this.dashboardData.alerts.unshift(...alerts);
      
      // Keep only last 20 alerts
      if (this.dashboardData.alerts.length > 20) {
        this.dashboardData.alerts = this.dashboardData.alerts.slice(0, 20);
      }

      this.broadcastUpdate('alert', alerts);
    }
  }

  calculateSystemHealth() {
    const metrics = this.dashboardData.realTimeMetrics;
    const avgUsage = (metrics.cpu + metrics.memory + metrics.network + metrics.storage) / 4;
    
    let health = 'excellent';
    if (avgUsage > 80) health = 'poor';
    else if (avgUsage > 60) health = 'fair';
    else if (avgUsage > 40) health = 'good';

    return {
      status: health,
      score: Math.floor(100 - avgUsage),
      metrics: metrics,
      recommendations: this.generateRecommendations(metrics)
    };
  }

  generateRecommendations(metrics) {
    const recommendations = [];
    
    if (metrics.cpu > 70) {
      recommendations.push('Consider optimizing CPU-intensive processes');
    }
    
    if (metrics.memory > 75) {
      recommendations.push('Monitor memory usage and consider cleanup');
    }
    
    if (metrics.storage > 80) {
      recommendations.push('Review storage usage and archive old data');
    }

    return recommendations;
  }

  broadcastUpdate(type, data) {
    const message = JSON.stringify({
      type: type,
      data: data,
      timestamp: new Date().toISOString()
    });

    this.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  start() {
    this.server.listen(this.port, () => {
      console.log(`🎛️ Dashboard API Server running on port ${this.port}`);
      console.log(`📡 WebSocket server ready for real-time updates`);
      console.log(`🌐 Dashboard available at http://localhost:${this.port}`);
    });
  }

  stop() {
    this.server.close(() => {
      console.log('🛑 Dashboard API Server stopped');
    });
  }
}

// Export for use in other modules
module.exports = DashboardAPIServer;

// Start server if run directly
if (require.main === module) {
  const server = new DashboardAPIServer();
  server.start();
}
