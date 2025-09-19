/**
 * 🔗 Integration Layer Configuration
 * 
 * This file defines external integrations and monitoring systems
 */

module.exports = {
  // Integration Components
  components: {
    telegram: {
      name: 'Telegram Bot (console channel)',
      description: 'Live error logging and notifications via Telegram',
      features: [
        'Live error logging',
        'Command interface',
        'Status reports',
        'Real-time notifications',
        'Error summaries'
      ],
      commands: [
        '/status - Get system status',
        '/stats - View detailed statistics',
        '/recommendations - Get improvement recommendations',
        '/restart - Restart services',
        '/config - View configuration'
      ],
      technologies: [
        'node-telegram-bot-api',
        'Telegram Bot API',
        'Markdown formatting',
        'Rate limiting'
      ],
      status: 'active',
      configuration: {
        botToken: process.env.TELEGRAM_BOT_TOKEN,
        channelId: process.env.TELEGRAM_CHANNEL_ID,
        chatId: process.env.DEBUGGER_CHAT_ID,
        rateLimit: {
          maxMessagesPerMinute: 20,
          maxMessagesPerHour: 100,
          retryDelay: 5000
        }
      }
    },

    debugger: {
      name: 'Debugger Agent (monitor + fix)',
      description: 'Automatic error analysis and fixing',
      features: [
        'Pattern recognition',
        'Fix generation',
        'Code modification',
        'Learning from results',
        'Workspace integration'
      ],
      capabilities: [
        'Error analysis',
        'Root cause identification',
        'Fix suggestion',
        'Code patching',
        'Performance optimization'
      ],
      technologies: [
        'Cursor API',
        'LLM integration',
        'Code analysis',
        'Pattern matching',
        'Machine learning'
      ],
      status: 'active',
      configuration: {
        cursorApiKey: process.env.CURSOR_API_KEY,
        llmProvider: 'openai',
        model: 'gpt-4',
        maxTokens: 4000,
        temperature: 0.7
      }
    },

    learning: {
      name: 'Learning Loop (save lessons in Data Agent)',
      description: 'Knowledge storage and retrieval system',
      features: [
        'Knowledge storage',
        'Pattern recognition',
        'Similarity matching',
        'Continuous improvement',
        'Performance tracking'
      ],
      storage: 'Firestore collections',
      retrieval: 'Similarity-based matching',
      technologies: [
        'Firestore',
        'Vector embeddings',
        'Similarity search',
        'Machine learning',
        'Pattern recognition'
      ],
      status: 'active',
      configuration: {
        firestore: {
          projectId: process.env.FIREBASE_PROJECT_ID,
          collections: [
            'error_logs',
            'fix_patterns',
            'learning_history',
            'performance_metrics'
          ]
        },
        vectorDB: {
          provider: 'firestore',
          embeddingModel: 'text-embedding-ada-002',
          similarityThreshold: 0.8
        }
      }
    }
  },

  // Integration Flow
  flow: {
    errorDetection: {
      step: 1,
      description: 'Error occurs in system',
      triggers: ['uncaughtException', 'unhandledRejection', 'console.error']
    },
    errorDistribution: {
      step: 2,
      description: 'Error distributed to multiple channels',
      channels: ['telegram', 'debugger', 'learning']
    },
    telegramLogging: {
      step: 3,
      description: 'Live error logging to Telegram',
      format: 'Structured error summaries',
      rateLimit: 'Batched every minute'
    },
    debuggerAnalysis: {
      step: 4,
      description: 'Debugger Agent analyzes error',
      actions: ['Pattern matching', 'Root cause analysis', 'Fix generation']
    },
    learningStorage: {
      step: 5,
      description: 'Error pattern stored for learning',
      storage: 'Firestore collections',
      retrieval: 'Similarity-based matching'
    },
    fixApplication: {
      step: 6,
      description: 'Cursor Autopilot applies fix',
      integration: 'Cursor API',
      notification: 'Success/failure feedback'
    },
    notification: {
      step: 7,
      description: 'Notification sent back to Telegram',
      format: 'Fix result and status update'
    }
  },

  // Configuration for Each Component
  config: {
    telegram: {
      bot: {
        polling: true,
        pollingTimeout: 10,
        pollingInterval: 1000
      },
      messages: {
        maxLength: 4000,
        parseMode: 'Markdown',
        disableWebPagePreview: true
      },
      errorHandling: {
        retryAttempts: 3,
        retryDelay: 5000,
        fallbackChannel: 'console'
      }
    },

    debugger: {
      workspace: {
        scanInterval: 300000,
        includePatterns: ['*.js', '*.jsx', '*.ts', '*.tsx'],
        excludePatterns: ['node_modules/**', '.git/**', 'dist/**']
      },
      analysis: {
        maxRetries: 3,
        timeout: 30000,
        confidenceThreshold: 0.7
      },
      learning: {
        minSuccessRate: 0.7,
        maxHistorySize: 1000,
        similarityThreshold: 0.8
      }
    },

    learning: {
      knowledgeBase: {
        maxRecords: 10000,
        cleanupInterval: 86400000,
        compressionEnabled: true
      },
      patterns: {
        maxPatterns: 1000,
        minOccurrences: 2,
        similarityThreshold: 0.8
      },
      performance: {
        collectionInterval: 60000,
        retentionPeriod: 604800000
      }
    }
  },

  // Health Monitoring
  health: {
    telegram: {
      metrics: ['message_success_rate', 'response_time', 'error_rate'],
      thresholds: {
        message_success_rate: 0.95,
        response_time: 5000,
        error_rate: 0.05
      }
    },
    debugger: {
      metrics: ['fix_success_rate', 'analysis_time', 'learning_rate'],
      thresholds: {
        fix_success_rate: 0.8,
        analysis_time: 30000,
        learning_rate: 0.1
      }
    },
    learning: {
      metrics: ['storage_success_rate', 'retrieval_time', 'accuracy'],
      thresholds: {
        storage_success_rate: 0.99,
        retrieval_time: 1000,
        accuracy: 0.8
      }
    }
  },

  // Integration Points
  integration: {
    core: {
      errorBus: 'Error distribution from core services',
      aiOrchestrator: 'AI-powered analysis and enhancement'
    },
    data: {
      firestore: 'Data storage and retrieval',
      dataAgent: 'Knowledge management and training'
    },
    external: {
      telegram: 'External communication channel',
      cursor: 'Code analysis and modification'
    }
  },

  // Security and Privacy
  security: {
    telegram: [
      'Bot token protection',
      'Message encryption',
      'Rate limiting',
      'Access control'
    ],
    debugger: [
      'API key protection',
      'Code sanitization',
      'Input validation',
      'Output filtering'
    ],
    learning: [
      'Data encryption',
      'Access control',
      'Audit logging',
      'Privacy protection'
    ]
  },

  // Performance Optimization
  optimization: {
    telegram: {
      batching: 'Message batching for rate limiting',
      caching: 'Response caching',
      compression: 'Message compression'
    },
    debugger: {
      parallel: 'Parallel analysis processing',
      caching: 'Pattern and fix caching',
      optimization: 'Algorithm optimization'
    },
    learning: {
      indexing: 'Vector database indexing',
      compression: 'Data compression',
      optimization: 'Query optimization'
    }
  }
};
