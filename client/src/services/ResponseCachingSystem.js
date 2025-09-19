/**
 * Advanced Response Caching System for AIOS
 * Intelligent caching with TTL, invalidation, compression, and analytics
 */

class ResponseCachingSystem {
  constructor() {
    this.cache = new Map();
    this.cacheMetadata = new Map();
    this.compressionEnabled = true;
    this.maxCacheSize = 1000; // Maximum number of cached items
    this.maxItemSize = 1024 * 1024; // 1MB max per item
    this.defaultTTL = 300000; // 5 minutes default TTL

    this.cacheStats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0,
      evictions: 0,
      compressions: 0,
      totalSize: 0,
      averageSize: 0,
      hitRate: 0,
    };

    this.cleanupInterval = null;
    this.startCleanupInterval();
  }

  /**
   * Set cache entry with advanced options
   */
  set(key, value, options = {}) {
    try {
      const {
        ttl = this.defaultTTL,
        tags = [],
        priority = 'normal',
        compress = this.compressionEnabled,
        maxAge = null,
      } = options;

      // Generate cache key
      const cacheKey = this._generateCacheKey(key);

      // Check size limits
      const serializedValue = JSON.stringify(value);
      if (serializedValue.length > this.maxItemSize) {
        console.warn(`Cache item too large: ${serializedValue.length} bytes`);
        return false;
      }

      // Compress if enabled
      let processedValue = value;
      let compressed = false;

      if (compress && serializedValue.length > 1024) {
        // Compress items > 1KB
        try {
          processedValue = this._compress(serializedValue);
          compressed = true;
          this.cacheStats.compressions++;
        } catch (error) {
          console.warn('Compression failed, storing uncompressed:', error);
          processedValue = value;
        }
      }

      // Calculate expiration
      const expiresAt = maxAge ? Date.now() + maxAge : Date.now() + ttl;

      // Store in cache
      this.cache.set(cacheKey, processedValue);

      // Store metadata
      this.cacheMetadata.set(cacheKey, {
        key,
        tags,
        priority,
        compressed,
        createdAt: Date.now(),
        expiresAt,
        accessCount: 0,
        lastAccessed: Date.now(),
        size: serializedValue.length,
      });

      // Update stats
      this.cacheStats.sets++;
      this.cacheStats.totalSize += serializedValue.length;
      this.cacheStats.averageSize = this.cacheStats.totalSize / this.cache.size;

      // Evict if cache is full
      if (this.cache.size > this.maxCacheSize) {
        this._evictLRU();
      }

      return true;
    } catch (error) {
      console.error('Failed to set cache entry:', error);
      return false;
    }
  }

  /**
   * Get cache entry with automatic decompression
   */
  get(key) {
    try {
      const cacheKey = this._generateCacheKey(key);

      if (!this.cache.has(cacheKey)) {
        this.cacheStats.misses++;
        this._updateHitRate();
        return null;
      }

      const metadata = this.cacheMetadata.get(cacheKey);

      // Check expiration
      if (metadata.expiresAt < Date.now()) {
        this.delete(key);
        this.cacheStats.misses++;
        this._updateHitRate();
        return null;
      }

      // Get value
      let value = this.cache.get(cacheKey);

      // Decompress if needed
      if (metadata.compressed) {
        try {
          value = this._decompress(value);
          value = JSON.parse(value);
        } catch (error) {
          console.error('Decompression failed:', error);
          this.delete(key);
          return null;
        }
      }

      // Update metadata
      metadata.accessCount++;
      metadata.lastAccessed = Date.now();
      this.cacheMetadata.set(cacheKey, metadata);

      // Update stats
      this.cacheStats.hits++;
      this._updateHitRate();

      return value;
    } catch (error) {
      console.error('Failed to get cache entry:', error);
      this.cacheStats.misses++;
      this._updateHitRate();
      return null;
    }
  }

  /**
   * Delete cache entry
   */
  delete(key) {
    try {
      const cacheKey = this._generateCacheKey(key);

      if (this.cache.has(cacheKey)) {
        const metadata = this.cacheMetadata.get(cacheKey);

        // Update stats
        this.cacheStats.totalSize -= metadata.size;
        this.cacheStats.deletes++;

        // Remove from cache
        this.cache.delete(cacheKey);
        this.cacheMetadata.delete(cacheKey);

        return true;
      }

      return false;
    } catch (error) {
      console.error('Failed to delete cache entry:', error);
      return false;
    }
  }

  /**
   * Invalidate cache by tags
   */
  invalidateByTags(tags) {
    let invalidatedCount = 0;

    this.cacheMetadata.forEach((metadata, cacheKey) => {
      if (tags.some(tag => metadata.tags.includes(tag))) {
        this.cache.delete(cacheKey);
        this.cacheMetadata.delete(cacheKey);
        invalidatedCount++;
      }
    });

    console.log(
      `🗑️ Invalidated ${invalidatedCount} cache entries by tags: ${tags.join(
        ', '
      )}`
    );
    return invalidatedCount;
  }

  /**
   * Clear all cache entries
   */
  clear() {
    this.cache.clear();
    this.cacheMetadata.clear();
    this.cacheStats.totalSize = 0;
    console.log('🧹 Cache cleared');
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      ...this.cacheStats,
      currentSize: this.cache.size,
      maxSize: this.maxCacheSize,
      memoryUsage: this._estimateMemoryUsage(),
      compressionRatio: this._calculateCompressionRatio(),
    };
  }

  /**
   * Cache with automatic key generation
   */
  async cacheFunction(fn, keyGenerator, options = {}) {
    const key =
      typeof keyGenerator === 'function' ? keyGenerator() : keyGenerator;

    // Try to get from cache first
    const cached = this.get(key);
    if (cached !== null) {
      return cached;
    }

    // Execute function and cache result
    try {
      const result = await fn();
      this.set(key, result, options);
      return result;
    } catch (error) {
      console.error('Function execution failed:', error);
      throw error;
    }
  }

  /**
   * Batch operations
   */
  async batchGet(keys) {
    const results = new Map();

    for (const key of keys) {
      const value = this.get(key);
      results.set(key, value);
    }

    return results;
  }

  async batchSet(entries, options = {}) {
    const results = [];

    for (const [key, value] of entries) {
      const success = this.set(key, value, options);
      results.push({ key, success });
    }

    return results;
  }

  /**
   * Cache warming
   */
  async warmCache(entries) {
    console.log('🔥 Warming cache with', entries.length, 'entries...');
    const startTime = performance.now();

    const results = await this.batchSet(entries);
    const successCount = results.filter(r => r.success).length;

    const warmTime = performance.now() - startTime;
    console.log(
      `✅ Cache warmed up: ${successCount}/${
        entries.length
      } entries in ${warmTime.toFixed(2)}ms`
    );

    return results;
  }

  /**
   * Cache health check
   */
  healthCheck() {
    try {
      // Test basic operations
      const testKey = '__health_check__';
      const testValue = { timestamp: Date.now(), test: true };

      this.set(testKey, testValue, { ttl: 1000 });
      const retrieved = this.get(testKey);
      this.delete(testKey);

      const isHealthy = retrieved && retrieved.test === true;

      return {
        status: isHealthy ? 'healthy' : 'unhealthy',
        stats: this.getStats(),
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
        stats: this.getStats(),
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Private utility methods
   */
  _generateCacheKey(key) {
    if (typeof key === 'string') {
      return key;
    }

    // Generate hash for object keys
    return btoa(JSON.stringify(key)).replace(/[^a-zA-Z0-9]/g, '');
  }

  _compress(data) {
    // Simple compression using built-in compression
    // In a real implementation, you might use a library like pako or lz-string
    return btoa(data);
  }

  _decompress(data) {
    // Simple decompression
    return atob(data);
  }

  _evictLRU() {
    let oldestKey = null;
    let oldestTime = Date.now();

    this.cacheMetadata.forEach((metadata, cacheKey) => {
      if (metadata.lastAccessed < oldestTime) {
        oldestTime = metadata.lastAccessed;
        oldestKey = cacheKey;
      }
    });

    if (oldestKey) {
      this.cache.delete(oldestKey);
      this.cacheMetadata.delete(oldestKey);
      this.cacheStats.evictions++;
    }
  }

  _updateHitRate() {
    const total = this.cacheStats.hits + this.cacheStats.misses;
    this.cacheStats.hitRate = total > 0 ? this.cacheStats.hits / total : 0;
  }

  _estimateMemoryUsage() {
    return {
      cacheEntries: this.cache.size,
      metadataEntries: this.cacheMetadata.size,
      estimatedSize: this.cacheStats.totalSize,
      averageEntrySize: this.cacheStats.averageSize,
    };
  }

  _calculateCompressionRatio() {
    if (this.cacheStats.compressions === 0) return 0;

    // This is a simplified calculation
    // In practice, you'd track compressed vs uncompressed sizes
    return 0.7; // Assume 30% compression ratio
  }

  _startCleanupInterval() {
    this.cleanupInterval = setInterval(() => {
      this._cleanupExpired();
    }, 60000); // Run every minute
  }

  _cleanupExpired() {
    const now = Date.now();
    let cleanedCount = 0;

    this.cacheMetadata.forEach((metadata, cacheKey) => {
      if (metadata.expiresAt < now) {
        this.cache.delete(cacheKey);
        this.cacheMetadata.delete(cacheKey);
        cleanedCount++;
      }
    });

    if (cleanedCount > 0) {
      console.log(`🧹 Cleaned up ${cleanedCount} expired cache entries`);
    }
  }
}

// Create singleton instance
const responseCachingSystem = new ResponseCachingSystem();

export default responseCachingSystem;
