/**
 * 💾 Data Layer Configuration
 * 
 * This file defines data storage and management systems
 */

module.exports = {
  // Data Components
  components: {
    firestore: {
      name: 'Firestore Database',
      description: 'Cloud-based NoSQL database for storing users, sessions, logs, bugs, and fixes',
      collections: [
        'users',
        'sessions', 
        'error_logs',
        'fix_patterns',
        'system_monitoring',
        'quantum_autopilot',
        'guest_data',
        'public_data'
      ],
      rules: 'Role-based with public read for guest data',
      technologies: [
        'Firebase Firestore',
        'NoSQL',
        'Real-time updates',
        'Offline support'
      ],
      status: 'ready',
      configuration: {
        projectId: process.env.FIREBASE_PROJECT_ID,
        apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
        authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
        storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.REACT_APP_FIREBASE_APP_ID
      }
    },

    dataAgent: {
      name: 'Data Agent',
      description: 'Intelligent data retrieval and training system',
      features: [
        'Retrieval operations',
        'Training operations',
        'Pattern matching',
        'Similarity search',
        'Performance optimization'
      ],
      technologies: [
        'Vector database',
        'Similarity search',
        'Machine learning',
        'Pattern recognition',
        'Firestore integration'
      ],
      status: 'ready',
      configuration: {
        vectorDB: {
          provider: 'firestore',
          embeddingModel: 'text-embedding-ada-002',
          similarityThreshold: 0.8,
          maxResults: 100
        },
        training: {
          batchSize: 32,
          learningRate: 0.001,
          epochs: 100,
          validationSplit: 0.2
        }
      }
    }
  },

  // Collection Schemas
  schemas: {
    users: {
      fields: {
        uid: 'string',
        email: 'string',
        displayName: 'string',
        role: 'string',
        createdAt: 'timestamp',
        lastLogin: 'timestamp',
        preferences: 'object',
        status: 'string'
      },
      indexes: [
        'email',
        'role',
        'status',
        'createdAt'
      ]
    },

    sessions: {
      fields: {
        sessionId: 'string',
        userId: 'string',
        startTime: 'timestamp',
        endTime: 'timestamp',
        duration: 'number',
        activities: 'array',
        status: 'string'
      },
      indexes: [
        'userId',
        'startTime',
        'status'
      ]
    },

    error_logs: {
      fields: {
        errorId: 'string',
        type: 'string',
        message: 'string',
        stack: 'string',
        file: 'string',
        line: 'string',
        timestamp: 'timestamp',
        severity: 'string',
        context: 'object',
        resolved: 'boolean'
      },
      indexes: [
        'type',
        'severity',
        'timestamp',
        'resolved'
      ]
    },

    fix_patterns: {
      fields: {
        patternId: 'string',
        errorType: 'string',
        pattern: 'string',
        fix: 'object',
        successRate: 'number',
        totalAttempts: 'number',
        successfulAttempts: 'number',
        lastUsed: 'timestamp',
        createdAt: 'timestamp'
      },
      indexes: [
        'errorType',
        'successRate',
        'lastUsed'
      ]
    },

    system_monitoring: {
      fields: {
        monitorId: 'string',
        timestamp: 'timestamp',
        cpu: 'number',
        memory: 'number',
        uptime: 'number',
        errors: 'number',
        warnings: 'number',
        performance: 'object'
      },
      indexes: [
        'timestamp',
        'cpu',
        'memory'
      ]
    },

    quantum_autopilot: {
      fields: {
        autopilotId: 'string',
        timestamp: 'timestamp',
        status: 'string',
        errorsProcessed: 'number',
        fixesApplied: 'number',
        successRate: 'number',
        performance: 'object'
      },
      indexes: [
        'timestamp',
        'status',
        'successRate'
      ]
    },

    guest_data: {
      fields: {
        guestId: 'string',
        timestamp: 'timestamp',
        type: 'string',
        data: 'object',
        access: 'string'
      },
      indexes: [
        'type',
        'timestamp',
        'access'
      ]
    },

    public_data: {
      fields: {
        dataId: 'string',
        timestamp: 'timestamp',
        type: 'string',
        content: 'object',
        visibility: 'string'
      },
      indexes: [
        'type',
        'timestamp',
        'visibility'
      ]
    }
  },

  // Data Operations
  operations: {
    retrieval: {
      methods: [
        'getDocument',
        'getCollection',
        'query',
        'search',
        'similaritySearch'
      ],
      performance: {
        maxQueryTime: 5000,
        maxResults: 1000,
        cacheTimeout: 300000
      }
    },

    storage: {
      methods: [
        'setDocument',
        'updateDocument',
        'deleteDocument',
        'batchWrite',
        'transaction'
      ],
      performance: {
        maxWriteTime: 10000,
        batchSize: 500,
        retryAttempts: 3
      }
    },

    training: {
      methods: [
        'trainModel',
        'validateModel',
        'testModel',
        'updateModel',
        'evaluateModel'
      ],
      performance: {
        maxTrainingTime: 3600000,
        batchSize: 32,
        validationSplit: 0.2
      }
    }
  },

  // Data Security
  security: {
    access: {
      public: ['public_data'],
      authenticated: ['users', 'sessions', 'error_logs'],
      admin: ['system_monitoring', 'quantum_autopilot'],
      guest: ['guest_data']
    },
    encryption: {
      atRest: 'AES-256',
      inTransit: 'TLS 1.3',
      keys: 'Firebase managed'
    },
    validation: {
      input: 'Schema validation',
      output: 'Sanitization',
      access: 'Role-based'
    }
  },

  // Performance Optimization
  optimization: {
    indexing: {
      automatic: 'Firestore automatic indexing',
      custom: 'Custom composite indexes',
      optimization: 'Query optimization'
    },
    caching: {
      client: 'Client-side caching',
      server: 'Server-side caching',
      cdn: 'CDN caching'
    },
    compression: {
      data: 'Data compression',
      transport: 'Transport compression',
      storage: 'Storage optimization'
    }
  },

  // Backup and Recovery
  backup: {
    frequency: 'Daily',
    retention: '30 days',
    locations: ['Multi-region'],
    testing: 'Monthly'
  },

  // Monitoring and Analytics
  monitoring: {
    metrics: [
      'read_operations',
      'write_operations',
      'query_performance',
      'storage_usage',
      'error_rate'
    ],
    alerts: [
      'High error rate',
      'Slow queries',
      'Storage limit',
      'Connection issues'
    ],
    dashboards: [
      'Real-time metrics',
      'Performance trends',
      'Usage analytics',
      'Error tracking'
    ]
  },

  // Integration Points
  integration: {
    core: {
      auth: 'User data storage',
      realtime: 'Presence data storage',
      errorBus: 'Error log storage',
      aiOrchestrator: 'Learning data storage'
    },
    integration: {
      telegram: 'Error log retrieval',
      debugger: 'Fix pattern storage',
      learning: 'Knowledge base management'
    },
    user: {
      demos: 'User data and preferences',
      analytics: 'Usage tracking'
    }
  }
};
