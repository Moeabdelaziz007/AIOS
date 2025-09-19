/**
 * ⚙️ Core Layer Configuration
 * 
 * This file defines the core shared services and business logic
 */

module.exports = {
  // Core Services
  services: {
    auth: {
      name: 'Auth & User Management',
      description: 'Authentication and user role management',
      providers: ['Google', 'Anonymous', 'Custom'],
      roles: ['guest', 'user', 'admin', 'superadmin'],
      permissions: 'Role-based access control',
      features: [
        'Multi-provider authentication',
        'Role-based permissions',
        'Session management',
        'User profile management',
        'Security policies'
      ],
      technologies: [
        'Firebase Auth',
        'JWT tokens',
        'OAuth 2.0',
        'RBAC system'
      ],
      status: 'completed'
    },

    realtime: {
      name: 'Realtime Presence + Notifications',
      description: 'Live user status and real-time notifications',
      features: [
        'User presence indicators',
        'Live notifications',
        'Real-time updates',
        'Status broadcasting',
        'Connection management'
      ],
      technologies: [
        'Socket.io',
        'Firebase Realtime Database',
        'WebRTC',
        'Server-Sent Events'
      ],
      status: 'completed'
    },

    errorBus: {
      name: 'Error Logging & Event Bus',
      description: 'Centralized error handling and event distribution',
      features: [
        'Error capture and logging',
        'Pattern recognition',
        'Event distribution',
        'Error categorization',
        'Performance monitoring'
      ],
      technologies: [
        'Event-driven architecture',
        'Error tracking',
        'Pattern matching',
        'Queue system'
      ],
      status: 'completed'
    },

    aiOrchestrator: {
      name: 'AI Orchestrator (Cursor LLM entrypoint)',
      description: 'AI-powered code analysis and enhancement',
      features: [
        'Cursor LLM integration',
        'Code analysis',
        'Fix generation',
        'Intelligent debugging',
        'Learning from patterns'
      ],
      technologies: [
        'Cursor API',
        'LLM integration',
        'Code analysis',
        'Machine learning'
      ],
      status: 'development'
    }
  },

  // Service Dependencies
  dependencies: {
    auth: ['firebase', 'jwt'],
    realtime: ['socket.io', 'firebase'],
    errorBus: ['event-emitter', 'queue'],
    aiOrchestrator: ['cursor-api', 'llm']
  },

  // Configuration for Each Service
  config: {
    auth: {
      firebase: {
        apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
        authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID
      },
      jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: '24h'
      },
      oauth: {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }
      }
    },

    realtime: {
      socketio: {
        port: process.env.PORT || 5000,
        cors: {
          origin: process.env.CLIENT_URL || 'http://localhost:3000',
          credentials: true
        }
      },
      firebase: {
        databaseURL: process.env.FIREBASE_DATABASE_URL
      }
    },

    errorBus: {
      queue: {
        maxSize: 1000,
        processingInterval: 60000,
        retryAttempts: 3
      },
      patterns: {
        firebase: /firebase.*error/i,
        network: /network.*error/i,
        syntax: /syntax.*error/i
      }
    },

    aiOrchestrator: {
      cursor: {
        apiKey: process.env.CURSOR_API_KEY,
        model: 'gpt-4',
        maxTokens: 4000
      },
      llm: {
        provider: 'openai',
        model: 'gpt-4',
        temperature: 0.7
      }
    }
  },

  // Service Health Monitoring
  health: {
    auth: {
      metrics: ['login_success_rate', 'session_duration', 'error_rate'],
      thresholds: {
        login_success_rate: 0.95,
        error_rate: 0.05
      }
    },
    realtime: {
      metrics: ['connection_count', 'message_throughput', 'latency'],
      thresholds: {
        latency: 1000,
        connection_count: 1000
      }
    },
    errorBus: {
      metrics: ['error_count', 'processing_time', 'queue_size'],
      thresholds: {
        processing_time: 5000,
        queue_size: 100
      }
    },
    aiOrchestrator: {
      metrics: ['response_time', 'success_rate', 'token_usage'],
      thresholds: {
        response_time: 10000,
        success_rate: 0.9
      }
    }
  },

  // Service Integration Points
  integration: {
    userLayer: {
      auth: 'User authentication for demos',
      realtime: 'Live updates in demos',
      errorBus: 'Error handling in demos'
    },
    integrationLayer: {
      errorBus: 'Error distribution to external systems',
      aiOrchestrator: 'AI-powered debugging and enhancement'
    },
    dataLayer: {
      auth: 'User data storage',
      realtime: 'Presence data storage',
      errorBus: 'Error log storage',
      aiOrchestrator: 'Learning data storage'
    }
  },

  // Performance Optimization
  optimization: {
    caching: {
      auth: 'User session caching',
      realtime: 'Connection state caching',
      errorBus: 'Error pattern caching',
      aiOrchestrator: 'Response caching'
    },
    scaling: {
      horizontal: 'Multiple service instances',
      vertical: 'Resource optimization',
      loadBalancing: 'Traffic distribution'
    }
  },

  // Security Considerations
  security: {
    auth: [
      'JWT token validation',
      'Rate limiting',
      'Input sanitization',
      'SQL injection prevention'
    ],
    realtime: [
      'Connection validation',
      'Message encryption',
      'DDoS protection',
      'Rate limiting'
    ],
    errorBus: [
      'Error sanitization',
      'Sensitive data filtering',
      'Access control',
      'Audit logging'
    ],
    aiOrchestrator: [
      'API key protection',
      'Input validation',
      'Output sanitization',
      'Rate limiting'
    ]
  }
};
