/**
 * Mock Firestore Data Storage for Development
 * Provides local storage when Firebase credentials are not available
 */

class MockFirestoreDataStorage {
  constructor() {
    this.name = 'Mock Firestore Data Storage';
    this.version = '1.0.0';
    this.isInitialized = false;
    this.localStorage = new Map();

    // Collection names
    this.collections = {
      CURSOR_CLI_DATA: 'cursor_cli_data',
      LEARNING_LOOP_DATA: 'learning_loop_data',
      DEBUGGER_DATA: 'debugger_data',
      FILE_CHANGES: 'file_changes',
      CODE_PATTERNS: 'code_patterns',
      DEBUGGING_SESSIONS: 'debugging_sessions',
      PERFORMANCE_METRICS: 'performance_metrics',
      WORKSPACE_ANALYSIS: 'workspace_analysis',
      SYSTEM_EVENTS: 'system_events',
      USER_ACTIONS: 'user_actions',
      ERROR_PATTERNS: 'error_patterns',
      OPTIMIZATION_RULES: 'optimization_rules',
    };

    console.log(`🗄️ ${this.name} v${this.version} initialized`);
  }

  /**
   * Initialize mock storage
   */
  async initialize() {
    try {
      console.log('🚀 Initializing Mock Firestore Data Storage...');
      this.isInitialized = true;
      console.log('✅ Mock Firestore Data Storage initialized successfully');
    } catch (error) {
      console.error(
        '❌ Failed to initialize Mock Firestore Data Storage:',
        error
      );
      this.isInitialized = false;
    }
  }

  /**
   * Store Cursor CLI data
   */
  async storeCursorCLIData(data) {
    try {
      if (!this.isInitialized) {
        throw new Error('Mock Firestore not initialized');
      }

      const docData = {
        ...data,
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        version: this.version,
      };

      const docId = `cursor_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      this.localStorage.set(docId, docData);

      console.log(`📊 Stored Cursor CLI data: ${docId}`);
      return docId;
    } catch (error) {
      console.error('❌ Failed to store Cursor CLI data:', error);
      throw error;
    }
  }

  /**
   * Store Learning Loop data
   */
  async storeLearningLoopData(data) {
    try {
      if (!this.isInitialized) {
        throw new Error('Mock Firestore not initialized');
      }

      const docData = {
        ...data,
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        version: this.version,
      };

      const docId = `learning_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      this.localStorage.set(docId, docData);

      console.log(`🧠 Stored Learning Loop data: ${docId}`);
      return docId;
    } catch (error) {
      console.error('❌ Failed to store Learning Loop data:', error);
      throw error;
    }
  }

  /**
   * Store Debugger data
   */
  async storeDebuggerData(data) {
    try {
      if (!this.isInitialized) {
        throw new Error('Mock Firestore not initialized');
      }

      const docData = {
        ...data,
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        version: this.version,
      };

      const docId = `debugger_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      this.localStorage.set(docId, docData);

      console.log(`🤖 Stored Debugger data: ${docId}`);
      return docId;
    } catch (error) {
      console.error('❌ Failed to store Debugger data:', error);
      throw error;
    }
  }

  /**
   * Store file changes
   */
  async storeFileChanges(fileChanges) {
    try {
      if (!this.isInitialized) {
        throw new Error('Mock Firestore not initialized');
      }

      let storedCount = 0;
      fileChanges.forEach(change => {
        const docId = `file_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`;
        const docData = {
          ...change,
          timestamp: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          version: this.version,
        };
        this.localStorage.set(docId, docData);
        storedCount++;
      });

      console.log(`📝 Stored ${storedCount} file changes`);
      return storedCount;
    } catch (error) {
      console.error('❌ Failed to store file changes:', error);
      throw error;
    }
  }

  /**
   * Store code patterns
   */
  async storeCodePatterns(codePatterns) {
    try {
      if (!this.isInitialized) {
        throw new Error('Mock Firestore not initialized');
      }

      let storedCount = 0;
      codePatterns.forEach(pattern => {
        const docId = `pattern_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`;
        const docData = {
          ...pattern,
          timestamp: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          version: this.version,
        };
        this.localStorage.set(docId, docData);
        storedCount++;
      });

      console.log(`🔍 Stored ${storedCount} code patterns`);
      return storedCount;
    } catch (error) {
      console.error('❌ Failed to store code patterns:', error);
      throw error;
    }
  }

  /**
   * Store debugging sessions
   */
  async storeDebuggingSessions(debuggingSessions) {
    try {
      if (!this.isInitialized) {
        throw new Error('Mock Firestore not initialized');
      }

      let storedCount = 0;
      debuggingSessions.forEach(session => {
        const docId = `session_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`;
        const docData = {
          ...session,
          timestamp: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          version: this.version,
        };
        this.localStorage.set(docId, docData);
        storedCount++;
      });

      console.log(`🔧 Stored ${storedCount} debugging sessions`);
      return storedCount;
    } catch (error) {
      console.error('❌ Failed to store debugging sessions:', error);
      throw error;
    }
  }

  /**
   * Store performance metrics
   */
  async storePerformanceMetrics(performanceMetrics) {
    try {
      if (!this.isInitialized) {
        throw new Error('Mock Firestore not initialized');
      }

      let storedCount = 0;
      performanceMetrics.forEach(metrics => {
        const docId = `perf_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`;
        const docData = {
          ...metrics,
          timestamp: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          version: this.version,
        };
        this.localStorage.set(docId, docData);
        storedCount++;
      });

      console.log(`📊 Stored ${storedCount} performance metrics`);
      return storedCount;
    } catch (error) {
      console.error('❌ Failed to store performance metrics:', error);
      throw error;
    }
  }

  /**
   * Store workspace analysis
   */
  async storeWorkspaceAnalysis(workspaceData) {
    try {
      if (!this.isInitialized) {
        throw new Error('Mock Firestore not initialized');
      }

      const docData = {
        ...workspaceData,
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        version: this.version,
      };

      const docId = `workspace_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      this.localStorage.set(docId, docData);

      console.log(`📁 Stored workspace analysis: ${docId}`);
      return docId;
    } catch (error) {
      console.error('❌ Failed to store workspace analysis:', error);
      throw error;
    }
  }

  /**
   * Store system events
   */
  async storeSystemEvent(event) {
    try {
      if (!this.isInitialized) {
        throw new Error('Mock Firestore not initialized');
      }

      const docData = {
        ...event,
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        version: this.version,
      };

      const docId = `event_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      this.localStorage.set(docId, docData);

      console.log(`⚡ Stored system event: ${docId}`);
      return docId;
    } catch (error) {
      console.error('❌ Failed to store system event:', error);
      throw error;
    }
  }

  /**
   * Store user actions
   */
  async storeUserAction(action) {
    try {
      if (!this.isInitialized) {
        throw new Error('Mock Firestore not initialized');
      }

      const docData = {
        ...action,
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        version: this.version,
      };

      const docId = `user_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      this.localStorage.set(docId, docData);

      console.log(`👤 Stored user action: ${docId}`);
      return docId;
    } catch (error) {
      console.error('❌ Failed to store user action:', error);
      throw error;
    }
  }

  /**
   * Store error patterns
   */
  async storeErrorPatterns(errorPatterns) {
    try {
      if (!this.isInitialized) {
        throw new Error('Mock Firestore not initialized');
      }

      let storedCount = 0;
      errorPatterns.forEach(pattern => {
        const docId = `error_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`;
        const docData = {
          ...pattern,
          timestamp: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          version: this.version,
        };
        this.localStorage.set(docId, docData);
        storedCount++;
      });

      console.log(`❌ Stored ${storedCount} error patterns`);
      return storedCount;
    } catch (error) {
      console.error('❌ Failed to store error patterns:', error);
      throw error;
    }
  }

  /**
   * Store optimization rules
   */
  async storeOptimizationRules(rules) {
    try {
      if (!this.isInitialized) {
        throw new Error('Mock Firestore not initialized');
      }

      let storedCount = 0;
      rules.forEach(rule => {
        const docId = `rule_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`;
        const docData = {
          ...rule,
          timestamp: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          version: this.version,
        };
        this.localStorage.set(docId, docData);
        storedCount++;
      });

      console.log(`⚡ Stored ${storedCount} optimization rules`);
      return storedCount;
    } catch (error) {
      console.error('❌ Failed to store optimization rules:', error);
      throw error;
    }
  }

  /**
   * Get data from collection
   */
  async getData(
    collectionName,
    limit = 100,
    orderBy = 'timestamp',
    orderDirection = 'desc'
  ) {
    try {
      if (!this.isInitialized) {
        throw new Error('Mock Firestore not initialized');
      }

      const data = Array.from(this.localStorage.values())
        .filter(item => item.collection === collectionName || !item.collection)
        .sort((a, b) => {
          if (orderDirection === 'desc') {
            return new Date(b[orderBy]) - new Date(a[orderBy]);
          } else {
            return new Date(a[orderBy]) - new Date(b[orderBy]);
          }
        })
        .slice(0, limit);

      console.log(
        `📖 Retrieved ${data.length} documents from ${collectionName}`
      );
      return data;
    } catch (error) {
      console.error(`❌ Failed to get data from ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Get aggregated data
   */
  async getAggregatedData(collectionName, field, operation = 'count') {
    try {
      if (!this.isInitialized) {
        throw new Error('Mock Firestore not initialized');
      }

      const data = Array.from(this.localStorage.values()).filter(
        item => item.collection === collectionName || !item.collection
      );

      let result = 0;
      data.forEach(item => {
        if (operation === 'count') {
          result++;
        } else if (operation === 'sum' && item[field]) {
          result += item[field];
        } else if (operation === 'avg' && item[field]) {
          result += item[field];
        }
      });

      if (operation === 'avg') {
        result = result / data.length;
      }

      console.log(
        `📊 Aggregated ${operation} for ${field} in ${collectionName}: ${result}`
      );
      return result;
    } catch (error) {
      console.error(
        `❌ Failed to get aggregated data from ${collectionName}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Get storage statistics
   */
  async getStorageStatistics() {
    try {
      if (!this.isInitialized) {
        throw new Error('Mock Firestore not initialized');
      }

      const stats = {};
      const totalCount = this.localStorage.size;

      for (const [key, collectionName] of Object.entries(this.collections)) {
        const count = Array.from(this.localStorage.values()).filter(
          item => item.collection === collectionName || !item.collection
        ).length;

        stats[key] = {
          collection: collectionName,
          count: count,
        };
      }

      stats['TOTAL'] = {
        collection: 'all_collections',
        count: totalCount,
      };

      console.log('📊 Storage statistics retrieved');
      return stats;
    } catch (error) {
      console.error('❌ Failed to get storage statistics:', error);
      throw error;
    }
  }

  /**
   * Get status
   */
  getStatus() {
    return {
      name: this.name,
      version: this.version,
      isInitialized: this.isInitialized,
      collections: Object.keys(this.collections).length,
      uptime: this.isInitialized ? process.uptime() : null,
      localStorageSize: this.localStorage.size,
    };
  }

  /**
   * Cleanup
   */
  async cleanup() {
    try {
      console.log('🧹 Cleaning up Mock Firestore Data Storage...');
      this.localStorage.clear();
      this.isInitialized = false;
      console.log('✅ Mock Firestore Data Storage cleanup completed');
    } catch (error) {
      console.error('❌ Failed to cleanup Mock Firestore Data Storage:', error);
    }
  }
}

module.exports = MockFirestoreDataStorage;
