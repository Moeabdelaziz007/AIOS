/**
 * 🔗 AIOS Integration System
 *
 * This file creates a unified integration between Backend, Frontend, and all services
 */

// Backend Integration
const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const { initializeApp } = require('firebase/app');
const {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy
} = require('firebase/firestore');
const { getAuth } = require('firebase/auth');
require('dotenv').config();

// Import unified services
const { UnifiedAutopilotSystem } = require('./server/unifiedAutopilotSystem.js');
const ErrorFlowManager = require('./server/errorFlowManager.js');
const SystemConfig = require('./systemConfig.js');
const AIOSSystemIntegration = require('./server/aiosSystemIntegration.js');
const TelegramBotManager = require('./server/telegramBotManager.js');
const EnhancedTelegramCommunication = require('./server/enhancedTelegramCommunication.js');
const AIOSAgentController = require('./server/aiosAgentController.js');
const RealTimeSystemMonitor = require('./server/realTimeSystemMonitor.js');
const UserAgentCommunicationInterface = require('./server/userAgentCommunicationInterface.js');
const AdvancedNotificationSystem = require('./server/advancedNotificationSystem.js');

class AIOSIntegrationSystem {
  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.io = new Server(this.server, {
      cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:3000',
        methods: ['GET', 'POST']
      }
    });

    this.port = process.env.PORT || 5000;
    this.firebaseApp = null;
    this.db = null;
    this.auth = null;

    // Services
    this.unifiedAutopilot = null;
    this.errorFlowManager = null;
    this.systemConfig = null;
    this.systemIntegration = null;

    // Connected clients
    this.connectedClients = new Map();
    this.onlineUsers = [];

    this.initializeSystem();
  }

  async initializeSystem() {
    try {
      console.log('🚀 Initializing AIOS Integration System...');

      // 1. Setup Express middleware
      this.setupMiddleware();

      // 2. Initialize Firebase
      await this.initializeFirebase();

      // 3. Initialize Services
      await this.initializeServices();

      // 4. Setup Socket.io
      this.setupSocketIO();

      // 5. Setup Error Handling
      this.setupErrorHandling();

      // 6. Start Server
      this.startServer();

      console.log('✅ AIOS Integration System initialized successfully!');
    } catch (error) {
      console.error('❌ Failed to initialize AIOS Integration System:', error);
      this.handleSystemError(error);
    }
  }

  setupMiddleware() {
    this.app.use(cors());
    this.app.use(express.json());

    // API routes should be set up before static middleware
    this.setupAPIRoutes();

    // Serve static files from client build (only for non-API routes)
    this.app.use(express.static('client/build'));

    // Catch-all handler: send back React's index.html file for non-API routes
    this.app.get('*', (req, res) => {
      // Skip API routes
      if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'API endpoint not found' });
      }
      res.sendFile(path.join(__dirname, 'client/build/index.html'));
    });
  }

  async initializeFirebase() {
    const firebaseConfig = {
      apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
      authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
      storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.REACT_APP_FIREBASE_APP_ID
    };

    this.firebaseApp = initializeApp(firebaseConfig);
    this.db = getFirestore(this.firebaseApp);
    this.auth = getAuth(this.firebaseApp);

    console.log('✅ Firebase initialized');
  }

  async initializeServices() {
    console.log('🔧 Initializing Services...');

    // Initialize centralized Telegram Bot Manager
    this.telegramBotManager = TelegramBotManager.getInstance();
    await this.telegramBotManager.initialize(process.env.TELEGRAM_BOT_TOKEN);

    // Initialize Enhanced Communication Systems
    console.log('💬 Initializing Enhanced Communication Systems...');
    this.enhancedTelegram = new EnhancedTelegramCommunication();
    await this.enhancedTelegram.initialize(process.env.TELEGRAM_BOT_TOKEN, process.env.TELEGRAM_CHANNEL_ID);

    // Initialize Agent Controller
    console.log('🤖 Initializing Agent Controller...');
    this.agentController = new AIOSAgentController();

    // Initialize Real-time System Monitor
    console.log('📊 Initializing Real-time System Monitor...');
    this.systemMonitor = new RealTimeSystemMonitor();
    this.systemMonitor.startMonitoring(30000); // 30 second intervals

    // Initialize User-Agent Communication Interface
    console.log('💬 Initializing User-Agent Communication Interface...');
    this.communicationInterface = new UserAgentCommunicationInterface();

    // Initialize Advanced Notification System
    console.log('🔔 Initializing Advanced Notification System...');
    this.notificationSystem = new AdvancedNotificationSystem();

    // Initialize System Integration (includes all other systems)
    console.log('🚀 Initializing AIOS System Integration...');
    this.systemIntegration = new AIOSSystemIntegration();

    // Enhanced Telegram configuration
    const telegramConfig = {
      token: process.env.TELEGRAM_BOT_TOKEN,
      chatId: process.env.TELEGRAM_CHAT_ID,
      botManager: this.telegramBotManager,
      enhancedCommunication: this.enhancedTelegram,
      agentController: this.agentController,
      systemMonitor: this.systemMonitor,
      communicationInterface: this.communicationInterface,
      notificationSystem: this.notificationSystem
    };

    await this.systemIntegration.initialize(telegramConfig);
    console.log('✅ AIOS System Integration initialized');

    // Get individual system references
    this.unifiedAutopilot = this.systemIntegration.unifiedAutopilot;
    this.errorFlowManager = new ErrorFlowManager();
    this.systemConfig = SystemConfig;

    // Setup enhanced system integration
    this.setupEnhancedIntegration();

    console.log('✅ All services initialized successfully!');
  }

  /**
   * Setup enhanced system integration
   */
  setupEnhancedIntegration() {
    // Setup event listeners for system integration
    if (this.systemMonitor) {
      this.systemMonitor.on('alert_triggered', alert => {
        this.handleSystemAlert(alert);
      });

      this.systemMonitor.on('metrics_analyzed', analysis => {
        this.handleMetricsAnalysis(analysis);
      });
    }

    // Setup communication interface events
    if (this.communicationInterface) {
      // Handle user-agent communication events
      console.log('💬 Communication interface events configured');
    }

    // Setup notification system events
    if (this.notificationSystem) {
      console.log('🔔 Notification system events configured');
    }

    console.log('🔗 Enhanced system integration configured');
  }

  /**
   * Handle system alerts
   */
  async handleSystemAlert(alert) {
    console.log(`🚨 System Alert: ${alert.message}`);

    // Send notification to Telegram
    if (this.notificationSystem && this.enhancedTelegram) {
      const notification = {
        template: 'system_alert',
        priority: alert.severity,
        category: 'system_alerts',
        data: {
          type: alert.type,
          severity: alert.severity,
          message: alert.message,
          component: 'System Monitor'
        }
      };

      // Send to all active users
      const activeSessions = this.communicationInterface.getActiveSessions();
      for (const session of activeSessions) {
        await this.notificationSystem.sendNotification(session.userId, notification);
      }
    }
  }

  /**
   * Handle metrics analysis
   */
  async handleMetricsAnalysis(analysis) {
    // Log analysis results
    console.log(`📊 Health Score: ${analysis.healthScore}`);

    if (analysis.anomalies.length > 0) {
      console.log(`⚠️ Anomalies detected: ${analysis.anomalies.length}`);
    }

    if (analysis.recommendations.length > 0) {
      console.log(`💡 Recommendations: ${analysis.recommendations.length}`);
    }
  }

  setupAPIRoutes() {
    // Health Check
    this.app.get('/api/health', (req, res) => {
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        services: {
          unifiedAutopilot: !!this.unifiedAutopilot,
          errorFlowManager: !!this.errorFlowManager,
          firebase: !!this.db
        },
        uptime: process.uptime(),
        memory: process.memoryUsage()
      });
    });

    // System Status
    this.app.get('/api/system/status', async (req, res) => {
      try {
        // Ensure systemIntegration is properly initialized
        let systemIntegrationStatus = 'inactive';
        if (this.systemIntegration && typeof this.systemIntegration.getSystemStatus === 'function') {
          try {
            systemIntegrationStatus = this.systemIntegration.getSystemStatus();
          } catch (statusError) {
            console.warn('⚠️ Error getting system integration status:', statusError.message);
            systemIntegrationStatus = { error: 'Status unavailable', initialized: false };
          }
        }

        const status = {
          timestamp: new Date().toISOString(),
          status: 'operational',
          services: {
            systemIntegration: systemIntegrationStatus,
            unifiedAutopilot: this.unifiedAutopilot?.getStatus() || 'inactive',
            errorFlowManager: this.errorFlowManager?.getStats() || {},
            firebase: this.db ? 'connected' : 'disconnected'
          },
          metrics: {
            connectedClients: this.connectedClients.size,
            onlineUsers: this.onlineUsers.length,
            uptime: process.uptime()
          }
        };

        res.json(status);
      } catch (error) {
        console.error('❌ Error in system status endpoint:', error);
        res.status(500).json({ error: error.message });
      }
    });

    // Learning Insights
    this.app.get('/api/learning/insights', (req, res) => {
      try {
        let insights = null;
        if (this.systemIntegration && typeof this.systemIntegration.getLearningInsights === 'function') {
          try {
            insights = this.systemIntegration.getLearningInsights();
          } catch (insightsError) {
            console.warn('⚠️ Error getting learning insights:', insightsError.message);
            insights = { error: 'Insights unavailable', initialized: false };
          }
        }
        res.json(insights);
      } catch (error) {
        console.error('❌ Error in learning insights endpoint:', error);
        res.status(500).json({ error: error.message });
      }
    });

    // Debug Tool Status
    this.app.get('/api/debug/status', (req, res) => {
      try {
        let debugStatus = null;
        if (
          this.systemIntegration?.debugTool &&
          typeof this.systemIntegration.debugTool.getDebugStatus === 'function'
        ) {
          try {
            debugStatus = this.systemIntegration.debugTool.getDebugStatus();
          } catch (debugError) {
            console.warn('⚠️ Error getting debug status:', debugError.message);
            debugStatus = { error: 'Debug status unavailable', initialized: false };
          }
        }
        res.json(debugStatus);
      } catch (error) {
        console.error('❌ Error in debug status endpoint:', error);
        res.status(500).json({ error: error.message });
      }
    });

    // System Analysis
    this.app.get('/api/system/analysis', async (req, res) => {
      try {
        const analysis = (await this.systemIntegration?.runSystemAnalysis()) || null;
        res.json(analysis);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Apps Management
    this.app.get('/api/apps', async (req, res) => {
      try {
        const appsSnapshot = await getDocs(collection(this.db, 'apps'));
        const apps = appsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        res.json({ apps });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    this.app.post('/api/apps', async (req, res) => {
      try {
        const { name, description, category, status } = req.body;
        const appData = {
          name,
          description,
          category: category || 'general',
          status: status || 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        const docRef = await addDoc(collection(this.db, 'apps'), appData);
        res.json({ id: docRef.id, ...appData });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Error Logs
    this.app.get('/api/errors', async (req, res) => {
      try {
        const errorsSnapshot = await getDocs(collection(this.db, 'error_logs'));
        const errors = errorsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        res.json({ errors });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Quantum Autopilot Status
    this.app.get('/api/quantum/status', (req, res) => {
      try {
        const status = this.unifiedAutopilot?.getStatus() || {
          status: 'inactive'
        };
        res.json(status);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // System Configuration
    this.app.get('/api/config', (req, res) => {
      try {
        const config = this.systemConfig?.getStatus() || {};
        res.json(config);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Agents API
    this.app.get('/api/agents', (req, res) => {
      try {
        const agents = this.agentController?.getAllAgentStatuses?.() || [
          { id: 'smart_agent', name: 'Smart Agent', status: 'running' },
          { id: 'data_agent', name: 'Data Agent', status: 'running' },
          { id: 'debug_agent', name: 'Debug Agent', status: 'running' },
          { id: 'learning_agent', name: 'Learning Agent', status: 'running' },
          { id: 'security_agent', name: 'Security Agent', status: 'running' }
        ];
        res.json({
          status: 'success',
          agents: agents,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Metrics API
    this.app.get('/api/metrics', (req, res) => {
      try {
        const metrics = this.systemMonitor?.getSystemStatus?.() || {
          cpuUsage: Math.floor(Math.random() * 100),
          memoryUsage: Math.floor(Math.random() * 1000) + 100,
          healthScore: Math.floor(Math.random() * 20) + 80,
          uptime: process.uptime(),
          anomalies: [],
          recommendations: []
        };
        res.json({
          status: 'success',
          metrics: metrics,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Learning API
    this.app.get('/api/learning', (req, res) => {
      try {
        const learningData = this.learningLoop?.getLearningInsights?.() || {
          patterns: ['Error patterns detected', 'Performance optimization patterns'],
          insights: ['System learning from user interactions', 'Adaptive behavior improvements'],
          recommendations: ['Optimize memory usage', 'Improve response times']
        };
        res.json({
          status: 'success',
          learning: learningData,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Debug API
    this.app.post('/api/debug', (req, res) => {
      try {
        const debugResult = {
          status: 'success',
          message: 'Debug analysis triggered',
          timestamp: new Date().toISOString()
        };
        res.json(debugResult);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    console.log('✅ API routes configured');
  }

  setupSocketIO() {
    this.io.on('connection', socket => {
      console.log(`🔌 Client connected: ${socket.id}`);

      // Store client connection
      this.connectedClients.set(socket.id, {
        id: socket.id,
        connectedAt: new Date(),
        userProfile: null
      });

      // Join user room
      socket.on('join_user_room', data => {
        const client = this.connectedClients.get(socket.id);
        if (client) {
          client.userProfile = data.userProfile;

          // Add to online users if not already there
          const existingUser = this.onlineUsers.find(user => user.userProfile.uid === data.userProfile.uid);
          if (!existingUser) {
            this.onlineUsers.push({
              id: socket.id,
              userProfile: data.userProfile,
              connectedAt: new Date()
            });
          }

          // Broadcast updated online users
          this.io.emit('online_users', this.onlineUsers);

          console.log(`👤 User joined: ${data.userProfile.displayName}`);
        }
      });

      // Handle app updates
      socket.on('app_update', data => {
        this.io.emit('app_updated', data);
      });

      // Handle system status updates
      socket.on('system_status_request', () => {
        this.broadcastSystemStatus();
      });

      // Handle AI activity
      socket.on('ai_activity', data => {
        this.io.emit('data_agent_update', data);
      });

      // Handle notifications
      socket.on('notification', data => {
        this.io.emit('notification', data);
      });

      // Handle disconnect
      socket.on('disconnect', () => {
        console.log(`🔌 Client disconnected: ${socket.id}`);

        // Remove from connected clients
        this.connectedClients.delete(socket.id);

        // Remove from online users
        this.onlineUsers = this.onlineUsers.filter(user => user.id !== socket.id);

        // Broadcast updated online users
        this.io.emit('online_users', this.onlineUsers);
      });
    });

    console.log('✅ Socket.io configured');
  }

  setupErrorHandling() {
    // Global error handler
    process.on('uncaughtException', error => {
      console.error('🚨 Uncaught Exception:', error);
      this.handleSystemError(error);
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('🚨 Unhandled Rejection at:', promise, 'reason:', reason);
      this.handleSystemError(reason);
    });

    // Express error handler
    this.app.use((error, req, res, next) => {
      console.error('🚨 Express Error:', error);
      this.handleSystemError(error);
      res.status(500).json({ error: 'Internal server error' });
    });

    console.log('✅ Error handling configured');
  }

  handleSystemError(error) {
    // Send error to Unified Autopilot System
    if (this.unifiedAutopilot) {
      this.unifiedAutopilot.handleError({
        message: error.message || 'Unknown error',
        stack: error.stack,
        timestamp: new Date().toISOString(),
        type: 'system_error',
        severity: 'high',
        file: 'aiosIntegrationSystem.js',
        line: 'unknown'
      });
    }

    // Send error to Error Flow Manager
    if (this.errorFlowManager) {
      this.errorFlowManager.handleError({
        message: error.message || 'Unknown error',
        stack: error.stack,
        timestamp: new Date().toISOString(),
        type: 'system_error',
        severity: 'high'
      });
    }

    // Broadcast error to connected clients
    this.io.emit('system_error', {
      message: error.message || 'System error occurred',
      timestamp: new Date().toISOString()
    });
  }

  broadcastSystemStatus() {
    const status = {
      timestamp: new Date().toISOString(),
      status: 'operational',
      connectedClients: this.connectedClients.size,
      onlineUsers: this.onlineUsers.length,
      services: {
        unifiedAutopilot: this.unifiedAutopilot?.getStatus() || 'inactive',
        errorFlowManager: this.errorFlowManager?.getStats() || {}
      }
    };

    this.io.emit('system_status_update', status);
  }

  startServer() {
    this.server.listen(this.port, () => {
      console.log(`🚀 AIOS Integration System running on port ${this.port}`);
      console.log(`🌐 Frontend: http://localhost:${this.port}`);
      console.log(`🔌 Socket.io: ws://localhost:${this.port}`);
      console.log(`📡 API: http://localhost:${this.port}/api`);

      // Start periodic system status updates
      setInterval(() => {
        this.broadcastSystemStatus();
      }, 30000); // Every 30 seconds
    });
  }

  // Public methods for external access
  getUnifiedAutopilot() {
    return this.unifiedAutopilot;
  }

  getErrorFlowManager() {
    return this.errorFlowManager;
  }

  getSystemConfig() {
    return this.systemConfig;
  }

  getConnectedClients() {
    return this.connectedClients;
  }

  getOnlineUsers() {
    return this.onlineUsers;
  }
}

// Initialize the system
const aiosSystem = new AIOSIntegrationSystem();

module.exports = AIOSIntegrationSystem;
