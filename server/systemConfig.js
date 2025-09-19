/**
 * 🏗️ AIOS System Configuration
 * 
 * This file defines the system architecture and component relationships
 */

module.exports = {
  // System Architecture
  architecture: {
    layers: {
      user: {
        name: 'User Layer (Demos/Apps)',
        components: [
          'Realtime Chat Demo',
          'OS Comparison Demo', 
          'AIOS Features Demo'
        ],
        description: 'User-facing applications and demos'
      },
      core: {
        name: 'Core Layer (Shared Services)',
        components: [
          'Auth & User Management',
          'Realtime Presence + Notifications',
          'Error Logging & Event Bus',
          'AI Orchestrator (Cursor LLM entrypoint)'
        ],
        description: 'Core shared services and business logic'
      },
      integration: {
        name: 'Integration Layer',
        components: [
          'Telegram Bot (console channel)',
          'Debugger Agent (monitor + fix)',
          'Learning Loop (save lessons in Data Agent)'
        ],
        description: 'External integrations and monitoring systems'
      },
      data: {
        name: 'Data Layer',
        components: [
          'Firestore (users, sessions, logs, bugs, fixes)',
          'Data Agent (retrieval + training)'
        ],
        description: 'Data storage and management'
      }
    }
  },

  // Error Flow Configuration
  errorFlow: {
    steps: [
      'User uses Demo',
      'Error occurs',
      'Core sends to Error Bus',
      'Error Bus distributes to multiple channels',
      'Telegram Channel - Live Log',
      'Debugger Agent - Attempt Fix',
      'Debugger learns - Save to Data Agent',
      'Cursor Autopilot applies fix',
      'Notification back to Telegram'
    ],
    channels: {
      telegram: {
        purpose: 'Live error logging and notifications',
        format: 'Structured error summaries',
        rateLimit: 'Batched every minute'
      },
      debugger: {
        purpose: 'Automatic error analysis and fixing',
        capabilities: [
          'Pattern recognition',
          'Fix generation',
          'Code modification',
          'Learning from results'
        ]
      },
      learning: {
        purpose: 'Knowledge storage and retrieval',
        storage: 'Firestore collections',
        retrieval: 'Similarity-based matching'
      }
    }
  },

  // Component Dependencies
  dependencies: {
    'User Layer': ['Core Layer'],
    'Core Layer': ['Data Layer', 'Integration Layer'],
    'Integration Layer': ['Data Layer'],
    'Data Layer': []
  },

  // Data Flow Patterns
  dataFlow: {
    userInteraction: {
      pattern: 'User → Demo App → Core Services → Data Layer',
      description: 'Standard user interaction flow'
    },
    errorResolution: {
      pattern: 'Error → Event Bus → Multiple Channels → Resolution',
      description: 'Error detection and resolution flow'
    },
    aiIntegration: {
      pattern: 'Cursor LLM ← AI Orchestrator ← Core Services',
      description: 'AI-powered debugging and enhancement'
    }
  },

  // Implementation Status
  implementation: {
    core: {
      status: 'completed',
      components: ['Auth', 'Realtime', 'Error Bus', 'AI Orchestrator']
    },
    integration: {
      status: 'active',
      components: ['Quantum Autopilot', 'Telegram Bot', 'Debugger Agent']
    },
    data: {
      status: 'ready',
      components: ['Firestore Rules', 'Data Agent', 'Learning System']
    },
    user: {
      status: 'development',
      components: ['Chat Demo', 'OS Comparison', 'Features Demo']
    }
  },

  // Configuration for Each Layer
  layerConfig: {
    user: {
      demos: {
        chat: {
          features: ['Real-time messaging', 'Presence indicators', 'File sharing'],
          technologies: ['Socket.io', 'React', 'Material-UI']
        },
        comparison: {
          features: ['OS feature comparison', 'Rating system', 'Reviews'],
          technologies: ['React', 'Firestore', 'Charts']
        },
        features: {
          features: ['AIOS capabilities', 'Interactive demos', 'Tutorials'],
          technologies: ['React', 'Animation libraries', 'AI integration']
        }
      }
    },
    core: {
      services: {
        auth: {
          providers: ['Google', 'Anonymous', 'Custom'],
          roles: ['guest', 'user', 'admin', 'superadmin'],
          permissions: 'Role-based access control'
        },
        realtime: {
          features: ['Presence', 'Notifications', 'Live updates'],
          technology: 'Socket.io with Firebase'
        },
        errorBus: {
          features: ['Error capture', 'Pattern recognition', 'Distribution'],
          technology: 'Event-driven architecture'
        },
        aiOrchestrator: {
          features: ['Cursor LLM integration', 'Code analysis', 'Fix generation'],
          technology: 'Cursor API + Custom agents'
        }
      }
    },
    integration: {
      telegram: {
        features: ['Live error logging', 'Command interface', 'Status reports'],
        commands: ['/status', '/stats', '/recommendations']
      },
      debugger: {
        features: ['Error analysis', 'Fix generation', 'Code modification'],
        capabilities: ['Pattern matching', 'LLM integration', 'Learning']
      },
      learning: {
        features: ['Knowledge storage', 'Pattern recognition', 'Improvement'],
        storage: 'Firestore collections with vector embeddings'
      }
    },
    data: {
      firestore: {
        collections: [
          'users', 'sessions', 'error_logs', 'fix_patterns',
          'system_monitoring', 'quantum_autopilot', 'guest_data'
        ],
        rules: 'Role-based with public read for guest data'
      },
      dataAgent: {
        features: ['Retrieval', 'Training', 'Pattern matching'],
        technology: 'Vector database with similarity search'
      }
    }
  },

  // Benefits and Goals
  benefits: [
    'Modular Design - Each layer has specific responsibilities',
    'Real-time Monitoring - Live error tracking via Telegram',
    'Self-Healing - Automatic error detection and fixing',
    'Learning System - Continuous improvement through data',
    'Scalable - Easy to add new demos and features',
    'AI-Powered - Cursor LLM integration for intelligent debugging'
  ],

  // Next Steps
  nextSteps: [
    'Complete User Layer demos',
    'Enhance AI Orchestrator integration',
    'Implement advanced learning algorithms',
    'Add more monitoring and analytics',
    'Create deployment automation',
    'Add comprehensive testing suite'
  ]
};
