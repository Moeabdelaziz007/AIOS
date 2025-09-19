/**
 * Firestore Data Schemas and Models
 * Defines data structures for AIOS system collections
 */

const schemas = {
  // File Changes Collection Schema
  fileChanges: {
    collection: 'file_changes',
    schema: {
      timestamp: 'string', // ISO timestamp
      event: 'string', // 'add', 'change', 'unlink', 'addDir', 'unlinkDir'
      filePath: 'string', // Full file path
      fileType: 'string', // File extension (.js, .ts, .jsx, etc.)
      size: 'number', // File size in bytes
      category: 'string', // 'CODE_PATTERNS', 'FILE_CHANGES', etc.
      metadata: {
        type: 'object',
        properties: {
          linesOfCode: 'number',
          complexity: 'number',
          dependencies: 'array',
          imports: 'array',
          exports: 'array',
        },
      },
    },
    indexes: ['timestamp', 'event', 'fileType', 'category'],
  },

  // Code Patterns Collection Schema
  codePatterns: {
    collection: 'code_patterns',
    schema: {
      timestamp: 'string', // ISO timestamp
      filePath: 'string', // Full file path
      patterns: {
        type: 'object',
        properties: {
          imports: 'array', // Import statements
          functions: 'array', // Function names
          classes: 'array', // Class names
          asyncOperations: 'array', // Async operations
          errorHandling: {
            type: 'object',
            properties: {
              tryCatchBlocks: 'number',
              catchBlocks: 'number',
              throwStatements: 'number',
            },
          },
        },
      },
      metrics: {
        type: 'object',
        properties: {
          linesOfCode: 'number',
          complexity: 'number',
          dependencies: 'array',
          cyclomaticComplexity: 'number',
          maintainabilityIndex: 'number',
        },
      },
      category: 'string', // 'CODE_PATTERNS'
    },
    indexes: ['timestamp', 'filePath', 'category'],
  },

  // Debugging Sessions Collection Schema
  debuggingSessions: {
    collection: 'debugging_sessions',
    schema: {
      timestamp: 'string', // ISO timestamp
      sessionId: 'string', // Unique session identifier
      debuggerAgentStatus: 'boolean', // Success/failure
      errorType: 'string', // Error category
      errorMessage: 'string', // Error message
      filePath: 'string', // File where error occurred
      lineNumber: 'number', // Line number
      columnNumber: 'number', // Column number
      stackTrace: 'array', // Stack trace
      resolution: {
        type: 'object',
        properties: {
          method: 'string', // Resolution method
          success: 'boolean', // Resolution success
          timeToResolve: 'number', // Time in milliseconds
          suggestions: 'array', // Suggested fixes
        },
      },
      category: 'string', // 'DEBUGGING_SESSIONS'
    },
    indexes: [
      'timestamp',
      'sessionId',
      'debuggerAgentStatus',
      'errorType',
      'category',
    ],
  },

  // Performance Metrics Collection Schema
  performanceMetrics: {
    collection: 'performance_metrics',
    schema: {
      timestamp: 'string', // ISO timestamp
      metrics: {
        type: 'object',
        properties: {
          cpu: {
            type: 'object',
            properties: {
              usage: 'number', // CPU usage percentage
              user: 'number', // User CPU time
              system: 'number', // System CPU time
            },
          },
          memory: {
            type: 'object',
            properties: {
              heapUsed: 'number', // Heap used in bytes
              heapTotal: 'number', // Total heap in bytes
              external: 'number', // External memory in bytes
              rss: 'number', // Resident set size in bytes
            },
          },
          uptime: 'number', // Process uptime in seconds
          loadAverage: 'array', // Load average array
        },
      },
      systemInfo: {
        type: 'object',
        properties: {
          platform: 'string',
          arch: 'string',
          nodeVersion: 'string',
          pid: 'number',
        },
      },
      category: 'string', // 'SYSTEM_PERFORMANCE'
    },
    indexes: ['timestamp', 'category'],
  },

  // Workspace Analysis Collection Schema
  workspaceAnalysis: {
    collection: 'workspace_analysis',
    schema: {
      timestamp: 'string', // ISO timestamp
      workspacePath: 'string', // Workspace root path
      projectStructure: {
        type: 'object',
        properties: {
          totalFiles: 'number',
          totalDirectories: 'number',
          fileTypes: 'object', // File type counts
          directoryStructure: 'array', // Directory tree
        },
      },
      dependencies: {
        type: 'object',
        properties: {
          packageJson: 'object', // Package.json content
          nodeModules: 'array', // Installed packages
          devDependencies: 'array', // Dev dependencies
          peerDependencies: 'array', // Peer dependencies
        },
      },
      gitInfo: {
        type: 'object',
        properties: {
          branch: 'string',
          commit: 'string',
          status: 'string',
          lastCommit: 'string',
        },
      },
      category: 'string', // 'WORKSPACE_ANALYSIS'
    },
    indexes: ['timestamp', 'workspacePath', 'category'],
  },

  // Learning Patterns Collection Schema
  learningPatterns: {
    collection: 'learning_patterns',
    schema: {
      timestamp: 'string', // ISO timestamp
      patternId: 'string', // Unique pattern identifier
      patternType: 'string', // Pattern type
      patternData: 'object', // Pattern-specific data
      confidence: 'number', // Pattern confidence score (0-1)
      frequency: 'number', // Pattern frequency
      category: 'string', // Pattern category
      metadata: {
        type: 'object',
        properties: {
          source: 'string', // Pattern source
          version: 'string', // Pattern version
          tags: 'array', // Pattern tags
        },
      },
    },
    indexes: [
      'timestamp',
      'patternId',
      'patternType',
      'category',
      'confidence',
    ],
  },

  // Learning Rules Collection Schema
  learningRules: {
    collection: 'learning_rules',
    schema: {
      timestamp: 'string', // ISO timestamp
      ruleId: 'string', // Unique rule identifier
      ruleName: 'string', // Rule name
      ruleType: 'string', // Rule type
      ruleDefinition: 'object', // Rule definition
      conditions: 'array', // Rule conditions
      actions: 'array', // Rule actions
      priority: 'number', // Rule priority
      isActive: 'boolean', // Rule active status
      category: 'string', // Rule category
      metadata: {
        type: 'object',
        properties: {
          createdBy: 'string', // Rule creator
          lastModified: 'string', // Last modification time
          version: 'string', // Rule version
        },
      },
    },
    indexes: [
      'timestamp',
      'ruleId',
      'ruleType',
      'category',
      'priority',
      'isActive',
    ],
  },

  // System Events Collection Schema
  systemEvents: {
    collection: 'system_events',
    schema: {
      timestamp: 'string', // ISO timestamp
      eventId: 'string', // Unique event identifier
      eventType: 'string', // Event type
      eventCategory: 'string', // Event category
      eventData: 'object', // Event-specific data
      severity: 'string', // Event severity (low, medium, high, critical)
      source: 'string', // Event source
      message: 'string', // Event message
      metadata: {
        type: 'object',
        properties: {
          userId: 'string', // User ID if applicable
          sessionId: 'string', // Session ID if applicable
          requestId: 'string', // Request ID if applicable
        },
      },
    },
    indexes: [
      'timestamp',
      'eventId',
      'eventType',
      'eventCategory',
      'severity',
      'source',
    ],
  },

  // Analytics Data Collection Schema
  analyticsData: {
    collection: 'analytics_data',
    schema: {
      timestamp: 'string', // ISO timestamp
      analyticsId: 'string', // Unique analytics identifier
      analyticsType: 'string', // Analytics type
      data: 'object', // Analytics data
      metrics: {
        type: 'object',
        properties: {
          totalDataPoints: 'number',
          processedDataPoints: 'number',
          errorRate: 'number',
          successRate: 'number',
          averageProcessingTime: 'number',
        },
      },
      category: 'string', // Analytics category
      metadata: {
        type: 'object',
        properties: {
          generatedBy: 'string', // Analytics generator
          dataSource: 'string', // Data source
          aggregationPeriod: 'string', // Aggregation period
        },
      },
    },
    indexes: ['timestamp', 'analyticsId', 'analyticsType', 'category'],
  },

  // User Interactions Collection Schema
  userInteractions: {
    collection: 'user_interactions',
    schema: {
      timestamp: 'string', // ISO timestamp
      interactionId: 'string', // Unique interaction identifier
      userId: 'string', // User identifier
      interactionType: 'string', // Interaction type
      interactionData: 'object', // Interaction-specific data
      context: {
        type: 'object',
        properties: {
          page: 'string', // Page/route
          component: 'string', // Component name
          action: 'string', // Action performed
        },
      },
      metadata: {
        type: 'object',
        properties: {
          userAgent: 'string', // User agent string
          ipAddress: 'string', // IP address
          sessionId: 'string', // Session ID
        },
      },
    },
    indexes: ['timestamp', 'interactionId', 'userId', 'interactionType'],
  },
};

// Validation functions
const validators = {
  // Validate file changes data
  validateFileChanges: data => {
    const schema = schemas.fileChanges.schema;
    const required = ['timestamp', 'event', 'filePath', 'fileType', 'size'];

    for (const field of required) {
      if (!data[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    if (typeof data.size !== 'number') {
      throw new Error('Size must be a number');
    }

    return true;
  },

  // Validate code patterns data
  validateCodePatterns: data => {
    const schema = schemas.codePatterns.schema;
    const required = ['timestamp', 'filePath', 'patterns', 'metrics'];

    for (const field of required) {
      if (!data[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    if (typeof data.patterns !== 'object') {
      throw new Error('Patterns must be an object');
    }

    if (typeof data.metrics !== 'object') {
      throw new Error('Metrics must be an object');
    }

    return true;
  },

  // Validate debugging sessions data
  validateDebuggingSessions: data => {
    const schema = schemas.debuggingSessions.schema;
    const required = [
      'timestamp',
      'sessionId',
      'debuggerAgentStatus',
      'errorType',
    ];

    for (const field of required) {
      if (!data[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    if (typeof data.debuggerAgentStatus !== 'boolean') {
      throw new Error('Debugger agent status must be a boolean');
    }

    return true;
  },

  // Validate performance metrics data
  validatePerformanceMetrics: data => {
    const schema = schemas.performanceMetrics.schema;
    const required = ['timestamp', 'metrics'];

    for (const field of required) {
      if (!data[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    if (typeof data.metrics !== 'object') {
      throw new Error('Metrics must be an object');
    }

    return true;
  },

  // Validate workspace analysis data
  validateWorkspaceAnalysis: data => {
    const schema = schemas.workspaceAnalysis.schema;
    const required = ['timestamp', 'workspacePath', 'projectStructure'];

    for (const field of required) {
      if (!data[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    if (typeof data.projectStructure !== 'object') {
      throw new Error('Project structure must be an object');
    }

    return true;
  },
};

// Data transformation functions
const transformers = {
  // Transform file changes data for storage
  transformFileChanges: data => {
    return {
      timestamp: data.timestamp || new Date().toISOString(),
      event: data.event,
      filePath: data.filePath,
      fileType: data.fileType,
      size: data.size,
      category: data.category || 'FILE_CHANGES',
      metadata: data.metadata || {},
    };
  },

  // Transform code patterns data for storage
  transformCodePatterns: data => {
    return {
      timestamp: data.timestamp || new Date().toISOString(),
      filePath: data.filePath,
      patterns: data.patterns,
      metrics: data.metrics,
      category: data.category || 'CODE_PATTERNS',
    };
  },

  // Transform debugging sessions data for storage
  transformDebuggingSessions: data => {
    return {
      timestamp: data.timestamp || new Date().toISOString(),
      sessionId: data.sessionId,
      debuggerAgentStatus: data.debuggerAgentStatus,
      errorType: data.errorType,
      errorMessage: data.errorMessage || '',
      filePath: data.filePath || '',
      lineNumber: data.lineNumber || 0,
      columnNumber: data.columnNumber || 0,
      stackTrace: data.stackTrace || [],
      resolution: data.resolution || {},
      category: data.category || 'DEBUGGING_SESSIONS',
    };
  },

  // Transform performance metrics data for storage
  transformPerformanceMetrics: data => {
    return {
      timestamp: data.timestamp || new Date().toISOString(),
      metrics: data.metrics,
      systemInfo: data.systemInfo || {},
      category: data.category || 'SYSTEM_PERFORMANCE',
    };
  },

  // Transform workspace analysis data for storage
  transformWorkspaceAnalysis: data => {
    return {
      timestamp: data.timestamp || new Date().toISOString(),
      workspacePath: data.workspacePath,
      projectStructure: data.projectStructure,
      dependencies: data.dependencies || {},
      gitInfo: data.gitInfo || {},
      category: data.category || 'WORKSPACE_ANALYSIS',
    };
  },
};

// Query builders
const queryBuilders = {
  // Build query for file changes
  buildFileChangesQuery: (filters = {}) => {
    let query = {};

    if (filters.event) {
      query.event = filters.event;
    }

    if (filters.fileType) {
      query.fileType = filters.fileType;
    }

    if (filters.category) {
      query.category = filters.category;
    }

    if (filters.startDate && filters.endDate) {
      query.timestamp = {
        $gte: filters.startDate,
        $lte: filters.endDate,
      };
    }

    return query;
  },

  // Build query for code patterns
  buildCodePatternsQuery: (filters = {}) => {
    let query = {};

    if (filters.filePath) {
      query.filePath = filters.filePath;
    }

    if (filters.category) {
      query.category = filters.category;
    }

    if (filters.startDate && filters.endDate) {
      query.timestamp = {
        $gte: filters.startDate,
        $lte: filters.endDate,
      };
    }

    return query;
  },

  // Build query for debugging sessions
  buildDebuggingSessionsQuery: (filters = {}) => {
    let query = {};

    if (filters.debuggerAgentStatus !== undefined) {
      query.debuggerAgentStatus = filters.debuggerAgentStatus;
    }

    if (filters.errorType) {
      query.errorType = filters.errorType;
    }

    if (filters.category) {
      query.category = filters.category;
    }

    if (filters.startDate && filters.endDate) {
      query.timestamp = {
        $gte: filters.startDate,
        $lte: filters.endDate,
      };
    }

    return query;
  },

  // Build query for performance metrics
  buildPerformanceMetricsQuery: (filters = {}) => {
    let query = {};

    if (filters.category) {
      query.category = filters.category;
    }

    if (filters.startDate && filters.endDate) {
      query.timestamp = {
        $gte: filters.startDate,
        $lte: filters.endDate,
      };
    }

    return query;
  },
};

module.exports = {
  schemas,
  validators,
  transformers,
  queryBuilders,
};
