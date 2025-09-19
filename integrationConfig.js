/**
 * 🔗 AIOS Complete Integration Configuration
 * 
 * This file provides complete configuration for the integrated AIOS system
 */

module.exports = {
  // System Configuration
  system: {
    name: 'AIOS - AI Operating System',
    version: '2.0.0',
    description: 'Complete Backend-Frontend Integration System',
    status: 'Production Ready'
  },

  // Backend Configuration
  backend: {
    port: process.env.PORT || 5000,
    host: process.env.HOST || 'localhost',
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true
    },
    static: {
      path: 'client/build',
      fallback: 'index.html'
    }
  },

  // Frontend Configuration
  frontend: {
    port: process.env.REACT_APP_PORT || 3000,
    apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    socketUrl: process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000',
    buildPath: 'client/build'
  },

  // Firebase Configuration
  firebase: {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
  },

  // Socket.io Configuration
  socketio: {
    transports: ['websocket', 'polling'],
    pingTimeout: 60000,
    pingInterval: 25000,
    upgradeTimeout: 10000,
    allowEIO3: true
  },

  // API Configuration
  api: {
    timeout: 10000,
    retries: 3,
    retryDelay: 1000,
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    endpoints: {
      health: '/health',
      system: '/system/status',
      apps: '/apps',
      errors: '/errors',
      quantum: '/quantum/status',
      config: '/config'
    }
  },

  // Services Configuration
  services: {
    quantumAutopilot: {
      enabled: true,
      telegram: {
        botToken: process.env.TELEGRAM_BOT_TOKEN,
        channelId: process.env.TELEGRAM_CHANNEL_ID,
        chatId: process.env.DEBUGGER_CHAT_ID
      },
      rateLimit: {
        maxErrorsPerMinute: 20,
        duplicateWindow: 30000
      }
    },
    
    cursorDebuggerAgent: {
      enabled: true,
      workspace: {
        scanInterval: 300000,
        includePatterns: ['*.js', '*.jsx', '*.ts', '*.tsx'],
        excludePatterns: ['node_modules/**', '.git/**', 'dist/**']
      }
    },
    
    errorFlowManager: {
      enabled: true,
      patterns: {
        firebase: /firebase.*error/i,
        network: /network.*error/i,
        syntax: /syntax.*error/i,
        type: /typeerror/i
      }
    }
  },

  // Integration Features
  features: {
    realTimeUpdates: true,
    liveNotifications: true,
    onlineUserTracking: true,
    systemMonitoring: true,
    errorTracking: true,
    aiIntegration: true,
    quantumAutopilot: true,
    cursorDebugger: true
  },

  // Performance Configuration
  performance: {
    refreshInterval: 30000,
    cacheTimeout: 300000,
    maxRetries: 3,
    retryDelay: 1000,
    batchSize: 100,
    maxConnections: 1000
  },

  // Security Configuration
  security: {
    cors: true,
    rateLimit: true,
    inputValidation: true,
    outputSanitization: true,
    authentication: true,
    authorization: true
  },

  // Monitoring Configuration
  monitoring: {
    enabled: true,
    metrics: {
      responseTime: true,
      errorRate: true,
      connectionCount: true,
      memoryUsage: true,
      cpuUsage: true
    },
    alerts: {
      errorThreshold: 0.1,
      responseTimeThreshold: 5000,
      memoryThreshold: 0.8
    }
  },

  // Development Configuration
  development: {
    hotReload: true,
    debugMode: true,
    verboseLogging: true,
    mockData: false,
    testMode: false
  },

  // Production Configuration
  production: {
    hotReload: false,
    debugMode: false,
    verboseLogging: false,
    mockData: false,
    testMode: false,
    compression: true,
    caching: true
  },

  // Environment Detection
  getEnvironment: function() {
    return process.env.NODE_ENV || 'development';
  },

  // Get Configuration for Current Environment
  getConfig: function() {
    const env = this.getEnvironment();
    const baseConfig = {
      system: this.system,
      backend: this.backend,
      frontend: this.frontend,
      firebase: this.firebase,
      socketio: this.socketio,
      api: this.api,
      services: this.services,
      features: this.features,
      performance: this.performance,
      security: this.security,
      monitoring: this.monitoring
    };

    if (env === 'production') {
      return {
        ...baseConfig,
        ...this.production,
        backend: {
          ...this.backend,
          cors: {
            ...this.backend.cors,
            origin: process.env.CLIENT_URL || 'https://aios-97581.web.app'
          }
        }
      };
    } else {
      return {
        ...baseConfig,
        ...this.development
      };
    }
  },

  // Validate Configuration
  validate: function() {
    const errors = [];
    const config = this.getConfig();

    // Check required environment variables
    const requiredEnvVars = [
      'REACT_APP_FIREBASE_API_KEY',
      'REACT_APP_FIREBASE_PROJECT_ID'
    ];

    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        errors.push(`Missing required environment variable: ${envVar}`);
      }
    }

    // Check Firebase configuration
    if (!config.firebase.apiKey || !config.firebase.projectId) {
      errors.push('Firebase configuration is incomplete');
    }

    // Check API configuration
    if (!config.api.baseURL) {
      errors.push('API base URL is not configured');
    }

    return {
      valid: errors.length === 0,
      errors: errors,
      config: config
    };
  },

  // Get System Status
  getStatus: function() {
    const validation = this.validate();
    const config = this.getConfig();

    return {
      system: {
        name: config.system.name,
        version: config.system.version,
        status: config.system.status,
        environment: this.getEnvironment()
      },
      validation: validation,
      features: config.features,
      services: Object.keys(config.services).map(service => ({
        name: service,
        enabled: config.services[service].enabled
      })),
      performance: config.performance,
      security: config.security
    };
  }
};
