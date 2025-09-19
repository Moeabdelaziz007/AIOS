/**
 * Firestore Data Storage System
 * Stores Cursor CLI, Learning Loop, and Debugger data
 */

const admin = require('firebase-admin');
const { FieldValue } = require('firebase-admin/firestore');
const { firebaseConfig } = require('./firebaseConfig');

class FirestoreDataStorage {
  constructor() {
    this.name = 'Firestore Data Storage';
    this.version = '1.0.0';
    this.isInitialized = false;
    this.db = null;
    this.mockMode = false;
    this.lastError = null;

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
      OPTIMIZATION_RULES: 'optimization_rules'
    };

    console.log(`🗄️ ${this.name} v${this.version} initialized`);
  }

  /**
   * Initialize Firestore connection with enhanced error handling
   */
  async initialize() {
    try {
      // Prevent multiple initializations
      if (this.isInitialized) {
        console.log('⚠️ Firestore already initialized, skipping...');
        return;
      }

      console.log('🚀 Initializing Enhanced Firestore Data Storage...');

      // Initialize Firebase Admin if not already done
      if (!admin.apps.length) {
        // Enhanced Firebase configuration with multiple fallback options
        const config = {
          projectId: process.env.FIREBASE_PROJECT_ID || firebaseConfig.projectId,
          // Try to use service account credentials if available
          ...(process.env.FIREBASE_ADMIN_PRIVATE_KEY &&
            process.env.FIREBASE_ADMIN_CLIENT_EMAIL && {
              credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID || firebaseConfig.projectId,
                privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
                clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL
              })
            })
        };

        // Try multiple initialization strategies
        try {
          // Strategy 1: Service account credentials
          if (config.credential) {
            admin.initializeApp(config);
            console.log('✅ Initialized with service account credentials');
          } else {
            // Strategy 2: Default credentials (for local development)
            admin.initializeApp(config);
            console.log('✅ Initialized with default credentials');
          }
        } catch (initError) {
          console.warn('⚠️ Primary initialization failed, trying fallback...');

          // Strategy 3: Minimal configuration for testing
          try {
            admin.initializeApp({
              projectId: config.projectId
            });
            console.log('✅ Initialized with minimal configuration');
          } catch (fallbackError) {
            console.error('❌ All initialization strategies failed:', fallbackError.message);
            throw fallbackError;
          }
        }
      }

      this.db = admin.firestore();

      // Configure Firestore settings for better performance
      this.db.settings({
        ignoreUndefinedProperties: true,
        // Enable offline persistence for better reliability
        cacheSizeBytes: admin.firestore.CACHE_SIZE_UNLIMITED
      });

      this.isInitialized = true;

      // Test connection with retry logic
      await this.testConnectionWithRetry();

      console.log('✅ Enhanced Firestore Data Storage initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Firestore Data Storage:', error.message);
      console.warn('⚠️ Enabling mock mode for development...');
      this.isInitialized = false;
      this.mockMode = true;
      return false;
    }
  }

  /**
   * Test Firestore connection with retry logic
   */
  async testConnectionWithRetry(maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        if (!this.db) {
          throw new Error('Firestore not initialized');
        }

        // Test with a simple read operation
        const testDoc = await this.db.collection('test').doc('connection').get();
        console.log('✅ Firestore connection test successful');
        return true;
      } catch (error) {
        console.warn(`⚠️ Firestore connection test attempt ${attempt}/${maxRetries} failed:`, error.message);

        if (attempt === maxRetries) {
          console.error('❌ All Firestore connection tests failed');
          console.warn('⚠️ Enabling mock mode for development');
          this.isInitialized = false;
          this.mockMode = true;
          return false;
        }

        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
    return false;
  }

  /**
   * Test Firestore connection (legacy method for compatibility)
   */
  async testConnection() {
    return await this.testConnectionWithRetry();
  }

  /**
   * Store Cursor CLI data
   */
  async storeCursorCLIData(data) {
    try {
      if (!this.isInitialized && !this.mockMode) {
        throw new Error('Firestore not initialized');
      }

      if (this.mockMode) {
        console.log('📊 Mock: Stored Cursor CLI data');
        return 'mock_' + Date.now();
      }

      const docData = {
        ...data,
        timestamp: FieldValue.serverTimestamp(),
        createdAt: new Date().toISOString(),
        version: this.version
      };

      const docRef = await this.db.collection(this.collections.CURSOR_CLI_DATA).add(docData);

      console.log(`📊 Stored Cursor CLI data: ${docRef.id}`);
      return docRef.id;
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
        throw new Error('Firestore not initialized');
      }

      const docData = {
        ...data,
        timestamp: FieldValue.serverTimestamp(),
        createdAt: new Date().toISOString(),
        version: this.version
      };

      const docRef = await this.db.collection(this.collections.LEARNING_LOOP_DATA).add(docData);

      console.log(`🧠 Stored Learning Loop data: ${docRef.id}`);
      return docRef.id;
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
        throw new Error('Firestore not initialized');
      }

      const docData = {
        ...data,
        timestamp: FieldValue.serverTimestamp(),
        createdAt: new Date().toISOString(),
        version: this.version
      };

      const docRef = await this.db.collection(this.collections.DEBUGGER_DATA).add(docData);

      console.log(`🤖 Stored Debugger data: ${docRef.id}`);
      return docRef.id;
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
        throw new Error('Firestore not initialized');
      }

      const batch = this.db.batch();
      const collection = this.db.collection(this.collections.FILE_CHANGES);

      fileChanges.forEach(change => {
        const docRef = collection.doc();
        const docData = {
          ...change,
          timestamp: FieldValue.serverTimestamp(),
          createdAt: new Date().toISOString(),
          version: this.version
        };
        batch.set(docRef, docData);
      });

      await batch.commit();

      console.log(`📝 Stored ${fileChanges.length} file changes`);
      return fileChanges.length;
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
        throw new Error('Firestore not initialized');
      }

      const batch = this.db.batch();
      const collection = this.db.collection(this.collections.CODE_PATTERNS);

      codePatterns.forEach(pattern => {
        const docRef = collection.doc();
        const docData = {
          ...pattern,
          timestamp: FieldValue.serverTimestamp(),
          createdAt: new Date().toISOString(),
          version: this.version
        };
        batch.set(docRef, docData);
      });

      await batch.commit();

      console.log(`🔍 Stored ${codePatterns.length} code patterns`);
      return codePatterns.length;
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
        throw new Error('Firestore not initialized');
      }

      const batch = this.db.batch();
      const collection = this.db.collection(this.collections.DEBUGGING_SESSIONS);

      debuggingSessions.forEach(session => {
        const docRef = collection.doc();
        const docData = {
          ...session,
          timestamp: FieldValue.serverTimestamp(),
          createdAt: new Date().toISOString(),
          version: this.version
        };
        batch.set(docRef, docData);
      });

      await batch.commit();

      console.log(`🔧 Stored ${debuggingSessions.length} debugging sessions`);
      return debuggingSessions.length;
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
        throw new Error('Firestore not initialized');
      }

      const batch = this.db.batch();
      const collection = this.db.collection(this.collections.PERFORMANCE_METRICS);

      performanceMetrics.forEach(metrics => {
        const docRef = collection.doc();
        const docData = {
          ...metrics,
          timestamp: FieldValue.serverTimestamp(),
          createdAt: new Date().toISOString(),
          version: this.version
        };
        batch.set(docRef, docData);
      });

      await batch.commit();

      console.log(`📊 Stored ${performanceMetrics.length} performance metrics`);
      return performanceMetrics.length;
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
        throw new Error('Firestore not initialized');
      }

      const docData = {
        ...workspaceData,
        timestamp: FieldValue.serverTimestamp(),
        createdAt: new Date().toISOString(),
        version: this.version
      };

      const docRef = await this.db.collection(this.collections.WORKSPACE_ANALYSIS).add(docData);

      console.log(`📁 Stored workspace analysis: ${docRef.id}`);
      return docRef.id;
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
        throw new Error('Firestore not initialized');
      }

      const docData = {
        ...event,
        timestamp: FieldValue.serverTimestamp(),
        createdAt: new Date().toISOString(),
        version: this.version
      };

      const docRef = await this.db.collection(this.collections.SYSTEM_EVENTS).add(docData);

      console.log(`⚡ Stored system event: ${docRef.id}`);
      return docRef.id;
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
        throw new Error('Firestore not initialized');
      }

      const docData = {
        ...action,
        timestamp: FieldValue.serverTimestamp(),
        createdAt: new Date().toISOString(),
        version: this.version
      };

      const docRef = await this.db.collection(this.collections.USER_ACTIONS).add(docData);

      console.log(`👤 Stored user action: ${docRef.id}`);
      return docRef.id;
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
        throw new Error('Firestore not initialized');
      }

      const batch = this.db.batch();
      const collection = this.db.collection(this.collections.ERROR_PATTERNS);

      errorPatterns.forEach(pattern => {
        const docRef = collection.doc();
        const docData = {
          ...pattern,
          timestamp: FieldValue.serverTimestamp(),
          createdAt: new Date().toISOString(),
          version: this.version
        };
        batch.set(docRef, docData);
      });

      await batch.commit();

      console.log(`❌ Stored ${errorPatterns.length} error patterns`);
      return errorPatterns.length;
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
        throw new Error('Firestore not initialized');
      }

      const batch = this.db.batch();
      const collection = this.db.collection(this.collections.OPTIMIZATION_RULES);

      rules.forEach(rule => {
        const docRef = collection.doc();
        const docData = {
          ...rule,
          timestamp: FieldValue.serverTimestamp(),
          createdAt: new Date().toISOString(),
          version: this.version
        };
        batch.set(docRef, docData);
      });

      await batch.commit();

      console.log(`⚡ Stored ${rules.length} optimization rules`);
      return rules.length;
    } catch (error) {
      console.error('❌ Failed to store optimization rules:', error);
      throw error;
    }
  }

  /**
   * Get data from collection
   */
  async getData(collectionName, limit = 100, orderBy = 'timestamp', orderDirection = 'desc') {
    try {
      if (!this.isInitialized) {
        throw new Error('Firestore not initialized');
      }

      const snapshot = await this.db.collection(collectionName).orderBy(orderBy, orderDirection).limit(limit).get();

      const data = [];
      snapshot.forEach(doc => {
        data.push({
          id: doc.id,
          ...doc.data()
        });
      });

      console.log(`📖 Retrieved ${data.length} documents from ${collectionName}`);
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
        throw new Error('Firestore not initialized');
      }

      const snapshot = await this.db.collection(collectionName).get();

      let result = 0;
      snapshot.forEach(doc => {
        const data = doc.data();
        if (operation === 'count') {
          result++;
        } else if (operation === 'sum' && data[field]) {
          result += data[field];
        } else if (operation === 'avg' && data[field]) {
          result += data[field];
        }
      });

      if (operation === 'avg') {
        result = result / snapshot.size;
      }

      console.log(`📊 Aggregated ${operation} for ${field} in ${collectionName}: ${result}`);
      return result;
    } catch (error) {
      console.error(`❌ Failed to get aggregated data from ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Get data by date range
   */
  async getDataByDateRange(collectionName, startDate, endDate, limit = 100) {
    try {
      if (!this.isInitialized) {
        throw new Error('Firestore not initialized');
      }

      const snapshot = await this.db
        .collection(collectionName)
        .where('timestamp', '>=', startDate)
        .where('timestamp', '<=', endDate)
        .orderBy('timestamp', 'desc')
        .limit(limit)
        .get();

      const data = [];
      snapshot.forEach(doc => {
        data.push({
          id: doc.id,
          ...doc.data()
        });
      });

      console.log(`📅 Retrieved ${data.length} documents from ${collectionName} between ${startDate} and ${endDate}`);
      return data;
    } catch (error) {
      console.error(`❌ Failed to get data by date range from ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Delete old data
   */
  async deleteOldData(collectionName, daysOld = 30) {
    try {
      if (!this.isInitialized) {
        throw new Error('Firestore not initialized');
      }

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const snapshot = await this.db.collection(collectionName).where('timestamp', '<', cutoffDate).get();

      const batch = this.db.batch();
      snapshot.forEach(doc => {
        batch.delete(doc.ref);
      });

      await batch.commit();

      console.log(`🗑️ Deleted ${snapshot.size} old documents from ${collectionName}`);
      return snapshot.size;
    } catch (error) {
      console.error(`❌ Failed to delete old data from ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Get storage statistics
   */
  async getStorageStatistics() {
    try {
      if (!this.isInitialized) {
        throw new Error('Firestore not initialized');
      }

      const stats = {};

      for (const [key, collectionName] of Object.entries(this.collections)) {
        const count = await this.getAggregatedData(collectionName, 'id', 'count');
        stats[key] = {
          collection: collectionName,
          count: count
        };
      }

      console.log('📊 Storage statistics retrieved');
      return stats;
    } catch (error) {
      console.error('❌ Failed to get storage statistics:', error);
      throw error;
    }
  }

  /**
   * Create indexes for better performance
   */
  async createIndexes() {
    try {
      if (!this.isInitialized) {
        throw new Error('Firestore not initialized');
      }

      console.log('🔍 Creating Firestore indexes...');

      // Note: In production, you would create these indexes in the Firebase Console
      // or using the Firebase CLI. This is just for documentation.

      const indexes = [
        {
          collection: this.collections.FILE_CHANGES,
          fields: ['timestamp', 'event', 'fileType']
        },
        {
          collection: this.collections.CODE_PATTERNS,
          fields: ['timestamp', 'filePath']
        },
        {
          collection: this.collections.DEBUGGING_SESSIONS,
          fields: ['timestamp', 'debuggerAgentStatus']
        },
        {
          collection: this.collections.PERFORMANCE_METRICS,
          fields: ['timestamp', 'memoryUsage.heapUsed']
        },
        {
          collection: this.collections.SYSTEM_EVENTS,
          fields: ['timestamp', 'eventType']
        },
        {
          collection: this.collections.ERROR_PATTERNS,
          fields: ['timestamp', 'severity']
        }
      ];

      console.log('📋 Index configuration created for:');
      indexes.forEach(index => {
        console.log(`   - ${index.collection}: ${index.fields.join(', ')}`);
      });

      console.log('✅ Index configuration completed');
    } catch (error) {
      console.error('❌ Failed to create indexes:', error);
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
      uptime: this.isInitialized ? process.uptime() : null
    };
  }

  /**
   * Store user interaction data
   */
  async storeUserInteraction(userId, interactionData) {
    try {
      if (!this.isInitialized) {
        console.log('⚠️ Firestore not initialized, using mock storage');
        return { success: true, id: 'mock_' + Date.now() };
      }

      const interaction = {
        userId: userId,
        timestamp: new Date(),
        type: interactionData.type || 'general',
        input: interactionData.input || interactionData.data,
        output: interactionData.output || interactionData.response,
        context: interactionData.context || {},
        metadata: {
          userAgent: interactionData.userAgent,
          sessionId: interactionData.sessionId,
          ipAddress: interactionData.ipAddress,
          agentType: interactionData.agentType,
          mcpSessionId: interactionData.mcpSessionId
        }
      };

      const docRef = await this.db.collection('user_interactions').add(interaction);
      console.log(`📝 User interaction stored: ${docRef.id}`);

      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('❌ Error storing user interaction:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Cleanup
   */
  async cleanup() {
    try {
      console.log('🧹 Cleaning up Firestore Data Storage...');

      // Close any open connections
      if (this.db) {
        // Firestore doesn't need explicit cleanup
        this.db = null;
      }

      this.isInitialized = false;
      console.log('✅ Firestore Data Storage cleanup completed');
    } catch (error) {
      console.error('❌ Failed to cleanup Firestore Data Storage:', error);
    }
  }
}

module.exports = FirestoreDataStorage;
