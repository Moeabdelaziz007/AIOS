/**
 * Real-time Data Synchronization System
 * Handles real-time data sync between local storage and Firestore
 */

const EventEmitter = require('events');

class RealTimeDataSync extends EventEmitter {
  constructor(firestoreStorage, localStorage) {
    super();
    this.name = 'Real-time Data Synchronization';
    this.version = '1.0.0';
    this.isActive = false;
    this.firestoreStorage = firestoreStorage;
    this.localStorage = localStorage;
    this.syncQueue = [];
    this.syncInterval = null;
    this.batchSize = 100;
    this.syncDelay = 5000; // 5 seconds
    this.retryAttempts = 3;
    this.retryDelay = 2000; // 2 seconds
    this.conflictResolution = 'local'; // 'local', 'remote', 'merge'

    console.log(`🔄 ${this.name} v${this.version} initialized`);
  }

  /**
   * Initialize real-time data synchronization
   */
  async initialize() {
    try {
      console.log('🔄 Initializing real-time data synchronization...');

      // Check if Firestore is available
      if (!this.firestoreStorage || !this.firestoreStorage.isInitialized) {
        console.log('⚠️ Firestore not available, running in local-only mode');
        this.isActive = true;
        return;
      }

      // Start sync process
      await this.startSyncProcess();

      // Setup event listeners
      this.setupEventListeners();

      this.isActive = true;
      console.log('✅ Real-time data synchronization initialized');
    } catch (error) {
      console.error(
        '❌ Failed to initialize real-time data synchronization:',
        error
      );
      throw error;
    }
  }

  /**
   * Start sync process
   */
  async startSyncProcess() {
    try {
      console.log('🔄 Starting sync process...');

      // Initial sync
      await this.performInitialSync();

      // Start periodic sync
      this.syncInterval = setInterval(async () => {
        await this.performPeriodicSync();
      }, this.syncDelay);

      console.log('✅ Sync process started');
    } catch (error) {
      console.error('❌ Failed to start sync process:', error);
      throw error;
    }
  }

  /**
   * Perform initial sync
   */
  async performInitialSync() {
    try {
      console.log('🔄 Performing initial sync...');

      // Sync all collections
      const collections = [
        'file_changes',
        'code_patterns',
        'debugging_sessions',
        'performance_metrics',
        'workspace_analysis',
        'learning_patterns',
        'learning_rules',
        'system_events',
        'analytics_data',
        'user_interactions',
      ];

      for (const collection of collections) {
        await this.syncCollection(collection);
      }

      console.log('✅ Initial sync completed');
    } catch (error) {
      console.error('❌ Initial sync failed:', error);
      throw error;
    }
  }

  /**
   * Perform periodic sync
   */
  async performPeriodicSync() {
    try {
      if (this.syncQueue.length === 0) {
        return; // No data to sync
      }

      console.log(
        `🔄 Performing periodic sync (${this.syncQueue.length} items)...`
      );

      // Process sync queue in batches
      const batch = this.syncQueue.splice(0, this.batchSize);

      for (const syncItem of batch) {
        await this.syncItem(syncItem);
      }

      console.log(`✅ Periodic sync completed (${batch.length} items)`);
    } catch (error) {
      console.error('❌ Periodic sync failed:', error);
      // Re-queue failed items
      this.syncQueue.unshift(...batch);
    }
  }

  /**
   * Sync collection
   */
  async syncCollection(collectionName) {
    try {
      console.log(`🔄 Syncing collection: ${collectionName}`);

      // Get local data
      const localData = this.localStorage.getData(collectionName);

      if (!localData || localData.length === 0) {
        console.log(`   No local data for ${collectionName}`);
        return;
      }

      // Get remote data
      const remoteData = await this.firestoreStorage.getData(
        collectionName,
        1000
      );

      // Merge data
      const mergedData = this.mergeData(localData, remoteData);

      // Upload merged data
      if (mergedData.length > 0) {
        await this.firestoreStorage.storeData(collectionName, mergedData);
      }

      console.log(
        `✅ Collection ${collectionName} synced (${mergedData.length} items)`
      );
    } catch (error) {
      console.error(`❌ Failed to sync collection ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Sync individual item
   */
  async syncItem(syncItem) {
    try {
      const { collection, data, operation } = syncItem;

      switch (operation) {
        case 'create':
          await this.firestoreStorage.storeData(collection, [data]);
          break;
        case 'update':
          await this.firestoreStorage.updateData(collection, data.id, data);
          break;
        case 'delete':
          await this.firestoreStorage.deleteData(collection, data.id);
          break;
        default:
          console.warn(`Unknown operation: ${operation}`);
      }
    } catch (error) {
      console.error('❌ Failed to sync item:', error);
      throw error;
    }
  }

  /**
   * Merge local and remote data
   */
  mergeData(localData, remoteData) {
    try {
      const mergedData = [...remoteData];
      const remoteIds = new Set(remoteData.map(item => item.id));

      for (const localItem of localData) {
        if (!remoteIds.has(localItem.id)) {
          mergedData.push(localItem);
        } else {
          // Handle conflicts
          const remoteItem = remoteData.find(item => item.id === localItem.id);
          const resolvedItem = this.resolveConflict(localItem, remoteItem);
          const index = mergedData.findIndex(item => item.id === localItem.id);
          mergedData[index] = resolvedItem;
        }
      }

      return mergedData;
    } catch (error) {
      console.error('❌ Failed to merge data:', error);
      return localData; // Fallback to local data
    }
  }

  /**
   * Resolve data conflicts
   */
  resolveConflict(localItem, remoteItem) {
    try {
      switch (this.conflictResolution) {
        case 'local':
          return localItem;
        case 'remote':
          return remoteItem;
        case 'merge':
          return this.mergeItems(localItem, remoteItem);
        default:
          return localItem;
      }
    } catch (error) {
      console.error('❌ Failed to resolve conflict:', error);
      return localItem; // Fallback to local
    }
  }

  /**
   * Merge individual items
   */
  mergeItems(localItem, remoteItem) {
    try {
      const mergedItem = { ...remoteItem };

      // Merge timestamps (use latest)
      if (new Date(localItem.timestamp) > new Date(remoteItem.timestamp)) {
        mergedItem.timestamp = localItem.timestamp;
      }

      // Merge data fields
      for (const [key, value] of Object.entries(localItem)) {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            mergedItem[key] = [
              ...new Set([...(mergedItem[key] || []), ...value]),
            ];
          } else if (typeof value === 'object' && value !== null) {
            mergedItem[key] = { ...mergedItem[key], ...value };
          } else {
            mergedItem[key] = value;
          }
        }
      }

      return mergedItem;
    } catch (error) {
      console.error('❌ Failed to merge items:', error);
      return localItem; // Fallback to local
    }
  }

  /**
   * Add item to sync queue
   */
  addToSyncQueue(collection, data, operation = 'create') {
    try {
      const syncItem = {
        collection,
        data,
        operation,
        timestamp: new Date().toISOString(),
        retryCount: 0,
      };

      this.syncQueue.push(syncItem);
      this.emit('syncQueued', syncItem);
    } catch (error) {
      console.error('❌ Failed to add to sync queue:', error);
    }
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    try {
      // Listen for data changes
      this.on('dataChanged', (collection, data, operation) => {
        this.addToSyncQueue(collection, data, operation);
      });

      // Listen for sync events
      this.on('syncQueued', syncItem => {
        console.log(`📝 Item queued for sync: ${syncItem.collection}`);
      });

      this.on('syncCompleted', syncItem => {
        console.log(`✅ Item synced: ${syncItem.collection}`);
      });

      this.on('syncFailed', (syncItem, error) => {
        console.error(`❌ Sync failed: ${syncItem.collection}`, error);
        this.handleSyncFailure(syncItem);
      });
    } catch (error) {
      console.error('❌ Failed to setup event listeners:', error);
    }
  }

  /**
   * Handle sync failure
   */
  async handleSyncFailure(syncItem) {
    try {
      syncItem.retryCount++;

      if (syncItem.retryCount < this.retryAttempts) {
        // Retry after delay
        setTimeout(() => {
          this.syncQueue.push(syncItem);
        }, this.retryDelay * syncItem.retryCount);
      } else {
        // Max retries reached, log error
        console.error(
          `❌ Max retries reached for sync item: ${syncItem.collection}`
        );
        this.emit('syncMaxRetriesReached', syncItem);
      }
    } catch (error) {
      console.error('❌ Failed to handle sync failure:', error);
    }
  }

  /**
   * Force sync all data
   */
  async forceSyncAll() {
    try {
      console.log('🔄 Force syncing all data...');

      // Clear sync queue
      this.syncQueue = [];

      // Perform initial sync
      await this.performInitialSync();

      console.log('✅ Force sync completed');
    } catch (error) {
      console.error('❌ Force sync failed:', error);
      throw error;
    }
  }

  /**
   * Get sync status
   */
  getSyncStatus() {
    return {
      isActive: this.isActive,
      syncQueueLength: this.syncQueue.length,
      batchSize: this.batchSize,
      syncDelay: this.syncDelay,
      retryAttempts: this.retryAttempts,
      conflictResolution: this.conflictResolution,
      firestoreAvailable:
        this.firestoreStorage && this.firestoreStorage.isInitialized,
    };
  }

  /**
   * Get sync statistics
   */
  getSyncStatistics() {
    return {
      totalItemsSynced: this.syncQueue.length,
      syncQueueSize: this.syncQueue.length,
      lastSyncTime: new Date().toISOString(),
      syncRate: this.syncQueue.length / (this.syncDelay / 1000), // items per second
      errorRate: 0, // TODO: Calculate error rate
    };
  }

  /**
   * Update sync configuration
   */
  updateSyncConfig(config) {
    try {
      if (config.batchSize) {
        this.batchSize = config.batchSize;
      }

      if (config.syncDelay) {
        this.syncDelay = config.syncDelay;

        // Restart sync interval with new delay
        if (this.syncInterval) {
          clearInterval(this.syncInterval);
          this.syncInterval = setInterval(async () => {
            await this.performPeriodicSync();
          }, this.syncDelay);
        }
      }

      if (config.retryAttempts) {
        this.retryAttempts = config.retryAttempts;
      }

      if (config.retryDelay) {
        this.retryDelay = config.retryDelay;
      }

      if (config.conflictResolution) {
        this.conflictResolution = config.conflictResolution;
      }

      console.log('✅ Sync configuration updated');
    } catch (error) {
      console.error('❌ Failed to update sync configuration:', error);
    }
  }

  /**
   * Pause synchronization
   */
  pauseSync() {
    try {
      if (this.syncInterval) {
        clearInterval(this.syncInterval);
        this.syncInterval = null;
      }

      this.isActive = false;
      console.log('⏸️ Synchronization paused');
    } catch (error) {
      console.error('❌ Failed to pause synchronization:', error);
    }
  }

  /**
   * Resume synchronization
   */
  resumeSync() {
    try {
      if (!this.syncInterval) {
        this.syncInterval = setInterval(async () => {
          await this.performPeriodicSync();
        }, this.syncDelay);
      }

      this.isActive = true;
      console.log('▶️ Synchronization resumed');
    } catch (error) {
      console.error('❌ Failed to resume synchronization:', error);
    }
  }

  /**
   * Deactivate synchronization
   */
  async deactivate() {
    try {
      console.log('🔄 Deactivating real-time data synchronization...');

      // Pause sync
      this.pauseSync();

      // Clear sync queue
      this.syncQueue = [];

      // Remove event listeners
      this.removeAllListeners();

      this.isActive = false;
      console.log('✅ Real-time data synchronization deactivated');
    } catch (error) {
      console.error('❌ Failed to deactivate synchronization:', error);
    }
  }
}

module.exports = RealTimeDataSync;
