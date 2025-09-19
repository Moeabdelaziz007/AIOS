/**
 * 🏗️ AIOS System Configuration
 * 
 * This file provides a comprehensive configuration for the entire AIOS system
 */

const userLayerConfig = require('./client/src/config/userLayerConfig');
const coreLayerConfig = require('./server/coreLayerConfig');
const integrationLayerConfig = require('./server/integrationLayerConfig');
const dataLayerConfig = require('./server/dataLayerConfig');
const systemConfig = require('./server/systemConfig');

module.exports = {
  // System Overview
  system: {
    name: 'AIOS - AI Operating System',
    version: '1.0.0',
    description: 'A self-healing, learning development environment with real-time error monitoring',
    architecture: 'Multi-layer architecture with AI integration',
    status: 'Development'
  },

  // Layer Configurations
  layers: {
    user: userLayerConfig,
    core: coreLayerConfig,
    integration: integrationLayerConfig,
    data: dataLayerConfig
  },

  // System Architecture
  architecture: systemConfig.architecture,

  // Error Flow Configuration
  errorFlow: systemConfig.errorFlow,

  // Component Dependencies
  dependencies: systemConfig.dependencies,

  // Data Flow Patterns
  dataFlow: systemConfig.dataFlow,

  // Implementation Status
  implementation: systemConfig.implementation,

  // Environment Configuration
  environment: {
    development: {
      debug: true,
      logging: 'verbose',
      hotReload: true,
      mockData: true
    },
    production: {
      debug: false,
      logging: 'error',
      hotReload: false,
      mockData: false
    }
  },

  // Feature Flags
  features: {
    quantumAutopilot: true,
    telegramIntegration: true,
    cursorDebugger: true,
    learningLoop: true,
    realtimeChat: false,
    osComparison: false,
    aiosFeatures: false
  },

  // Performance Configuration
  performance: {
    caching: {
      enabled: true,
      ttl: 300000,
      maxSize: 1000
    },
    compression: {
      enabled: true,
      level: 6
    },
    rateLimiting: {
      enabled: true,
      windowMs: 60000,
      maxRequests: 100
    }
  },

  // Security Configuration
  security: {
    encryption: {
      algorithm: 'AES-256',
      keyRotation: '30 days'
    },
    authentication: {
      providers: ['google', 'anonymous'],
      sessionTimeout: '24 hours'
    },
    authorization: {
      rbac: true,
      permissions: 'granular'
    }
  },

  // Monitoring Configuration
  monitoring: {
    metrics: {
      enabled: true,
      interval: 60000,
      retention: '7 days'
    },
    alerts: {
      enabled: true,
      channels: ['telegram', 'email'],
      thresholds: {
        errorRate: 0.1,
        responseTime: 5000,
        memoryUsage: 0.8
      }
    },
    logging: {
      level: 'info',
      format: 'json',
      destinations: ['console', 'file']
    }
  },

  // Deployment Configuration
  deployment: {
    firebase: {
      projectId: process.env.FIREBASE_PROJECT_ID,
      hosting: {
        public: 'client/build',
        rewrites: [{ source: '**', destination: '/index.html' }]
      },
      firestore: {
        rules: 'firestore.rules',
        indexes: 'firestore.indexes.json'
      }
    },
    docker: {
      enabled: false,
      images: ['node', 'nginx']
    },
    ci: {
      enabled: false,
      provider: 'github-actions'
    }
  },

  // Testing Configuration
  testing: {
    unit: {
      enabled: true,
      framework: 'jest',
      coverage: 80
    },
    integration: {
      enabled: true,
      framework: 'supertest',
      timeout: 30000
    },
    e2e: {
      enabled: false,
      framework: 'cypress'
    }
  },

  // Documentation Configuration
  documentation: {
    api: {
      enabled: true,
      format: 'openapi',
      version: '3.0.0'
    },
    user: {
      enabled: true,
      format: 'markdown',
      location: './docs'
    },
    technical: {
      enabled: true,
      format: 'markdown',
      location: './docs/technical'
    }
  },

  // Get Configuration for Specific Layer
  getLayerConfig: function(layerName) {
    return this.layers[layerName] || null;
  },

  // Get Feature Status
  getFeatureStatus: function(featureName) {
    return this.features[featureName] || false;
  },

  // Get Environment Configuration
  getEnvironmentConfig: function() {
    const env = process.env.NODE_ENV || 'development';
    return this.environment[env] || this.environment.development;
  },

  // Validate Configuration
  validate: function() {
    const errors = [];
    
    // Check required environment variables
    const requiredEnvVars = [
      'FIREBASE_PROJECT_ID',
      'REACT_APP_FIREBASE_API_KEY',
      'TELEGRAM_BOT_TOKEN'
    ];
    
    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        errors.push(`Missing required environment variable: ${envVar}`);
      }
    }
    
    // Check layer configurations
    for (const [layerName, layerConfig] of Object.entries(this.layers)) {
      if (!layerConfig) {
        errors.push(`Missing configuration for layer: ${layerName}`);
      }
    }
    
    return {
      valid: errors.length === 0,
      errors: errors
    };
  },

  // Get System Status
  getStatus: function() {
    const validation = this.validate();
    const envConfig = this.getEnvironmentConfig();
    
    return {
      system: {
        name: this.system.name,
        version: this.system.version,
        status: this.system.status
      },
      validation: validation,
      environment: envConfig,
      features: this.features,
      layers: Object.keys(this.layers).map(layer => ({
        name: layer,
        status: this.layers[layer].status || 'unknown'
      }))
    };
  }
};
