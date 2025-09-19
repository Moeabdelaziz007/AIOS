/**
 * ⚙️ Quantum Autopilot Configuration
 * 
 * Centralized configuration for the Quantum Autopilot System
 */

module.exports = {
  // System Configuration
  system: {
    name: 'Quantum Autopilot System',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    debug: process.env.NODE_ENV === 'development'
  },

  // Error Processing Configuration
  errorProcessing: {
    // Rate limiting settings
    rateLimit: {
      duplicateWindow: 30000, // 30 seconds
      maxDuplicates: 5,
      escalationThreshold: 10
    },

    // Queue processing settings
    queue: {
      processingInterval: 60000, // 1 minute
      maxQueueSize: 100,
      batchSize: 10
    },

    // Error categorization
    categories: {
      'firebase-permission': {
        pattern: /firebase.*permission|missing.*permission/i,
        severity: 'high',
        priority: 1
      },
      'network-error': {
        pattern: /network|connection|timeout/i,
        severity: 'medium',
        priority: 2
      },
      'syntax-error': {
        pattern: /syntax.*error|unexpected.*token/i,
        severity: 'high',
        priority: 1
      },
      'type-error': {
        pattern: /typeerror|cannot.*read.*properties/i,
        severity: 'medium',
        priority: 2
      },
      'reference-error': {
        pattern: /referenceerror|is not defined/i,
        severity: 'medium',
        priority: 2
      },
      'telegram-error': {
        pattern: /etelegram|too many requests/i,
        severity: 'low',
        priority: 3
      }
    }
  },

  // Telegram Configuration
  telegram: {
    // Bot settings
    bot: {
      polling: true,
      pollingTimeout: 10,
      pollingInterval: 1000
    },

    // Message formatting
    messages: {
      maxLength: 4000,
      parseMode: 'Markdown',
      disableWebPagePreview: true
    },

    // Rate limiting
    rateLimit: {
      maxMessagesPerMinute: 20,
      maxMessagesPerHour: 100,
      retryDelay: 5000
    }
  },

  // Debugger Agent Configuration
  debugger: {
    // Workspace scanning
    workspace: {
      scanInterval: 300000, // 5 minutes
      includePatterns: ['*.js', '*.jsx', '*.ts', '*.tsx'],
      excludePatterns: ['node_modules/**', '.git/**', 'dist/**']
    },

    // Fix generation
    fixes: {
      maxRetries: 3,
      timeout: 30000, // 30 seconds
      confidenceThreshold: 0.7
    },

    // Learning settings
    learning: {
      minSuccessRate: 0.7,
      maxHistorySize: 1000,
      similarityThreshold: 0.8
    }
  },

  // Data Agent Configuration
  data: {
    // Knowledge base settings
    knowledgeBase: {
      maxRecords: 10000,
      cleanupInterval: 86400000, // 24 hours
      compressionEnabled: true
    },

    // Pattern storage
    patterns: {
      maxPatterns: 1000,
      minOccurrences: 2,
      similarityThreshold: 0.8
    }
  },

  // Learner Agent Configuration
  learner: {
    // Analysis settings
    analysis: {
      effectivenessWeight: 0.7,
      timeWeight: 0.3,
      maxAnalysisHistory: 5000
    },

    // Strategy updates
    strategy: {
      updateInterval: 3600000, // 1 hour
      minDataPoints: 10,
      confidenceThreshold: 0.6
    },

    // Recommendations
    recommendations: {
      maxRecommendations: 10,
      priorityThreshold: 0.5,
      updateInterval: 1800000 // 30 minutes
    }
  },

  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: 'json',
    destinations: ['console', 'file'],
    file: {
      path: './logs/quantum-autopilot.log',
      maxSize: '10MB',
      maxFiles: 5
    }
  },

  // Performance Monitoring
  performance: {
    // Metrics collection
    metrics: {
      enabled: true,
      collectionInterval: 60000, // 1 minute
      retentionPeriod: 604800000 // 7 days
    },

    // Alerts
    alerts: {
      highErrorRate: 0.1, // 10% error rate
      slowProcessing: 5000, // 5 seconds
      memoryUsage: 0.8 // 80% memory usage
    }
  },

  // Security Configuration
  security: {
    // Error sanitization
    sanitization: {
      removeSensitiveData: true,
      maskPatterns: [
        /password/i,
        /token/i,
        /key/i,
        /secret/i
      ]
    },

    // Access control
    access: {
      allowedCommands: ['/status', '/stats', '/recommendations'],
      adminCommands: ['/restart', '/config', '/debug']
    }
  },

  // Development Configuration
  development: {
    // Test settings
    testing: {
      mockTelegram: false,
      mockFirebase: false,
      testDataPath: './test-data/'
    },

    // Debug settings
    debug: {
      verboseLogging: true,
      errorInjection: false,
      performanceProfiling: false
    }
  }
};
