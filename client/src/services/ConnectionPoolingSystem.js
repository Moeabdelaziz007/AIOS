/**
 * Connection Pooling System for AIOS
 * Efficient database connection management with pooling and optimization
 */

import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';

class ConnectionPoolingSystem {
  constructor() {
    this.connections = new Map();
    this.connectionPool = new Map();
    this.poolConfig = {
      maxConnections: 10,
      minConnections: 2,
      connectionTimeout: 30000, // 30 seconds
      idleTimeout: 300000, // 5 minutes
      retryAttempts: 3,
      retryDelay: 1000,
    };

    this.connectionStats = {
      totalConnections: 0,
      activeConnections: 0,
      idleConnections: 0,
      failedConnections: 0,
      connectionTimeouts: 0,
      averageConnectionTime: 0,
      connectionTimes: [],
    };

    this.cleanupInterval = null;
    this.startCleanupInterval();
  }

  /**
   * Initialize connection pool
   */
  async initializePool(config = {}) {
    try {
      console.log('🔄 Initializing connection pool...');

      // Merge config with defaults
      this.poolConfig = { ...this.poolConfig, ...config };

      // Initialize Firebase app
      const firebaseConfig = {
        apiKey: process.env.VITE_FIREBASE_API_KEY,
        authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.VITE_FIREBASE_APP_ID,
        measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID,
      };

      const app = initializeApp(firebaseConfig);

      // Create initial connections
      await this._createInitialConnections(app);

      console.log('✅ Connection pool initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize connection pool:', error);
      throw error;
    }
  }

  /**
   * Get a connection from the pool
   */
  async getConnection(connectionType = 'firestore') {
    const startTime = performance.now();

    try {
      // Check for available connection in pool
      if (this.connectionPool.has(connectionType)) {
        const connections = this.connectionPool.get(connectionType);
        const availableConnection = connections.find(conn => !conn.inUse);

        if (availableConnection) {
          availableConnection.inUse = true;
          availableConnection.lastUsed = Date.now();
          this.connectionStats.activeConnections++;

          const connectionTime = performance.now() - startTime;
          this._updateConnectionStats(connectionTime);

          return availableConnection.connection;
        }
      }

      // Create new connection if pool is not full
      if (
        this.connectionStats.activeConnections < this.poolConfig.maxConnections
      ) {
        const connection = await this._createConnection(connectionType);
        this._addToPool(connectionType, connection);

        const connectionTime = performance.now() - startTime;
        this._updateConnectionStats(connectionTime);

        return connection;
      }

      // Wait for available connection
      return await this._waitForConnection(connectionType);
    } catch (error) {
      this.connectionStats.failedConnections++;
      console.error(`Failed to get ${connectionType} connection:`, error);
      throw error;
    }
  }

  /**
   * Return connection to the pool
   */
  releaseConnection(connection, connectionType = 'firestore') {
    try {
      if (this.connectionPool.has(connectionType)) {
        const connections = this.connectionPool.get(connectionType);
        const connectionObj = connections.find(
          conn => conn.connection === connection
        );

        if (connectionObj) {
          connectionObj.inUse = false;
          connectionObj.lastUsed = Date.now();
          this.connectionStats.activeConnections--;
          this.connectionStats.idleConnections++;
        }
      }
    } catch (error) {
      console.error('Failed to release connection:', error);
    }
  }

  /**
   * Execute database operation with connection pooling
   */
  async executeWithPool(operation, connectionType = 'firestore') {
    let connection = null;

    try {
      connection = await this.getConnection(connectionType);
      const result = await operation(connection);
      return result;
    } catch (error) {
      console.error('Database operation failed:', error);
      throw error;
    } finally {
      if (connection) {
        this.releaseConnection(connection, connectionType);
      }
    }
  }

  /**
   * Batch execute multiple operations
   */
  async batchExecute(operations, connectionType = 'firestore') {
    const connection = await this.getConnection(connectionType);
    const results = [];

    try {
      for (const operation of operations) {
        try {
          const result = await operation(connection);
          results.push({ success: true, result });
        } catch (error) {
          results.push({ success: false, error });
        }
      }

      return results;
    } finally {
      this.releaseConnection(connection, connectionType);
    }
  }

  /**
   * Create initial connections
   */
  async _createInitialConnections(app) {
    const initialConnections = [];

    // Create minimum required connections
    for (let i = 0; i < this.poolConfig.minConnections; i++) {
      try {
        const firestore = getFirestore(app);
        const auth = getAuth(app);

        // Connect to emulator if in development
        if (process.env.NODE_ENV === 'development') {
          try {
            connectFirestoreEmulator(firestore, 'localhost', 8080);
            connectAuthEmulator(auth, 'http://localhost:9099');
          } catch (emulatorError) {
            // Emulator already connected or not available
            console.warn(
              'Firebase emulator connection warning:',
              emulatorError.message
            );
          }
        }

        initialConnections.push({
          firestore,
          auth,
          inUse: false,
          createdAt: Date.now(),
          lastUsed: Date.now(),
        });
      } catch (error) {
        console.error('Failed to create initial connection:', error);
      }
    }

    // Add to pool
    this.connectionPool.set('firestore', initialConnections);
    this.connectionStats.totalConnections = initialConnections.length;
    this.connectionStats.idleConnections = initialConnections.length;
  }

  /**
   * Create new connection
   */
  async _createConnection(connectionType) {
    const startTime = performance.now();

    try {
      let connection;

      switch (connectionType) {
        case 'firestore':
          const firebaseConfig = {
            apiKey: process.env.VITE_FIREBASE_API_KEY,
            authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
            projectId: process.env.VITE_FIREBASE_PROJECT_ID,
            storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
            appId: process.env.VITE_FIREBASE_APP_ID,
            measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID,
          };

          const app = initializeApp(firebaseConfig);
          connection = getFirestore(app);
          break;

        default:
          throw new Error(`Unsupported connection type: ${connectionType}`);
      }

      const connectionTime = performance.now() - startTime;
      this._updateConnectionStats(connectionTime);

      return {
        connection,
        inUse: true,
        createdAt: Date.now(),
        lastUsed: Date.now(),
      };
    } catch (error) {
      this.connectionStats.failedConnections++;
      throw error;
    }
  }

  /**
   * Add connection to pool
   */
  _addToPool(connectionType, connectionObj) {
    if (!this.connectionPool.has(connectionType)) {
      this.connectionPool.set(connectionType, []);
    }

    this.connectionPool.get(connectionType).push(connectionObj);
    this.connectionStats.totalConnections++;
  }

  /**
   * Wait for available connection
   */
  async _waitForConnection(
    connectionType,
    timeout = this.poolConfig.connectionTimeout
  ) {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();

      const checkConnection = () => {
        if (this.connectionPool.has(connectionType)) {
          const connections = this.connectionPool.get(connectionType);
          const availableConnection = connections.find(conn => !conn.inUse);

          if (availableConnection) {
            availableConnection.inUse = true;
            availableConnection.lastUsed = Date.now();
            this.connectionStats.activeConnections++;
            resolve(availableConnection.connection);
            return;
          }
        }

        // Check timeout
        if (Date.now() - startTime > timeout) {
          this.connectionStats.connectionTimeouts++;
          reject(new Error(`Connection timeout for ${connectionType}`));
          return;
        }

        // Retry after delay
        setTimeout(checkConnection, 100);
      };

      checkConnection();
    });
  }

  /**
   * Update connection statistics
   */
  _updateConnectionStats(connectionTime) {
    this.connectionStats.connectionTimes.push(connectionTime);
    this.connectionStats.averageConnectionTime =
      this.connectionStats.connectionTimes.reduce((a, b) => a + b, 0) /
      this.connectionStats.connectionTimes.length;
  }

  /**
   * Start cleanup interval for idle connections
   */
  startCleanupInterval() {
    this.cleanupInterval = setInterval(() => {
      this._cleanupIdleConnections();
    }, 60000); // Run every minute
  }

  /**
   * Cleanup idle connections
   */
  _cleanupIdleConnections() {
    const now = Date.now();

    this.connectionPool.forEach((connections, connectionType) => {
      const activeConnections = connections.filter(conn => {
        const isIdle =
          !conn.inUse && now - conn.lastUsed > this.poolConfig.idleTimeout;

        if (isIdle && connections.length > this.poolConfig.minConnections) {
          this.connectionStats.idleConnections--;
          this.connectionStats.totalConnections--;
          return false; // Remove from pool
        }

        return true; // Keep in pool
      });

      this.connectionPool.set(connectionType, activeConnections);
    });
  }

  /**
   * Get connection pool statistics
   */
  getPoolStats() {
    return {
      ...this.connectionStats,
      poolConfig: this.poolConfig,
      poolSizes: Object.fromEntries(
        Array.from(this.connectionPool.entries()).map(([type, connections]) => [
          type,
          {
            total: connections.length,
            active: connections.filter(c => c.inUse).length,
            idle: connections.filter(c => !c.inUse).length,
          },
        ])
      ),
    };
  }

  /**
   * Health check for connection pool
   */
  async healthCheck() {
    try {
      // Test connection
      const connection = await this.getConnection('firestore');
      this.releaseConnection(connection, 'firestore');

      return {
        status: 'healthy',
        stats: this.getPoolStats(),
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
        stats: this.getPoolStats(),
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Destroy connection pool
   */
  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }

    this.connectionPool.clear();
    this.connections.clear();
    console.log('🧹 Connection pool destroyed');
  }
}

// Create singleton instance
const connectionPoolingSystem = new ConnectionPoolingSystem();

export default connectionPoolingSystem;
