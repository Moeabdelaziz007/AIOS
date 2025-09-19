/**
 * Lazy Loading System for AIOS
 * Dynamic loading of tools, plugins, and components for improved performance
 */

class LazyLoadingSystem {
  constructor() {
    this.loadedModules = new Map();
    this.loadingPromises = new Map();
    this.moduleCache = new Map();
    this.loadingStats = {
      totalModules: 0,
      loadedModules: 0,
      failedModules: 0,
      averageLoadTime: 0,
      loadTimes: [],
    };
  }

  /**
   * Lazy load a module with caching and error handling
   */
  async loadModule(modulePath, moduleName = null) {
    const key = moduleName || modulePath;

    // Return cached module if available
    if (this.moduleCache.has(key)) {
      return this.moduleCache.get(key);
    }

    // Return existing promise if already loading
    if (this.loadingPromises.has(key)) {
      return this.loadingPromises.get(key);
    }

    // Create loading promise
    const loadingPromise = this._loadModuleInternal(modulePath, key);
    this.loadingPromises.set(key, loadingPromise);

    try {
      const module = await loadingPromise;
      this.moduleCache.set(key, module);
      this.loadingPromises.delete(key);
      this.loadedModules.set(key, module);

      // Update stats
      this.loadingStats.loadedModules++;

      return module;
    } catch (error) {
      this.loadingPromises.delete(key);
      this.loadingStats.failedModules++;
      console.error(`Failed to load module ${key}:`, error);
      throw error;
    }
  }

  /**
   * Internal module loading with performance tracking
   */
  async _loadModuleInternal(modulePath, key) {
    const startTime = performance.now();

    try {
      let module;

      // Handle different module types
      if (modulePath.startsWith('http')) {
        // Dynamic import for external modules
        module = await import(modulePath);
      } else if (modulePath.startsWith('./') || modulePath.startsWith('../')) {
        // Dynamic import for local modules
        module = await import(modulePath);
      } else {
        // Require for Node.js modules
        module = require(modulePath);
      }

      // Track load time
      const loadTime = performance.now() - startTime;
      this.loadingStats.loadTimes.push(loadTime);
      this.loadingStats.averageLoadTime =
        this.loadingStats.loadTimes.reduce((a, b) => a + b, 0) /
        this.loadingStats.loadTimes.length;

      return module.default || module;
    } catch (error) {
      const loadTime = performance.now() - startTime;
      this.loadingStats.loadTimes.push(loadTime);
      throw error;
    }
  }

  /**
   * Preload critical modules
   */
  async preloadModules(modulePaths) {
    const preloadPromises = modulePaths.map(({ path, name }) =>
      this.loadModule(path, name)
    );

    try {
      await Promise.allSettled(preloadPromises);
      console.log(`✅ Preloaded ${modulePaths.length} critical modules`);
    } catch (error) {
      console.warn('Some modules failed to preload:', error);
    }
  }

  /**
   * Load module with fallback
   */
  async loadModuleWithFallback(primaryPath, fallbackPath, moduleName) {
    try {
      return await this.loadModule(primaryPath, moduleName);
    } catch (error) {
      console.warn(
        `Primary module ${moduleName} failed, trying fallback:`,
        error
      );
      return await this.loadModule(fallbackPath, `${moduleName}_fallback`);
    }
  }

  /**
   * Batch load modules
   */
  async batchLoadModules(moduleConfigs) {
    const results = new Map();
    const errors = new Map();

    // Load modules in parallel with concurrency limit
    const concurrencyLimit = 5;
    const chunks = this._chunkArray(moduleConfigs, concurrencyLimit);

    for (const chunk of chunks) {
      const chunkPromises = chunk.map(async ({ path, name }) => {
        try {
          const module = await this.loadModule(path, name);
          results.set(name, module);
        } catch (error) {
          errors.set(name, error);
        }
      });

      await Promise.allSettled(chunkPromises);
    }

    return { results, errors };
  }

  /**
   * Get loading statistics
   */
  getLoadingStats() {
    return {
      ...this.loadingStats,
      cacheHitRate:
        this.moduleCache.size /
        (this.moduleCache.size + this.loadingStats.failedModules),
      memoryUsage: this._estimateMemoryUsage(),
    };
  }

  /**
   * Clear module cache
   */
  clearCache() {
    this.moduleCache.clear();
    this.loadedModules.clear();
    console.log('🧹 Module cache cleared');
  }

  /**
   * Warm up cache with frequently used modules
   */
  async warmUpCache(modulePaths) {
    console.log('🔥 Warming up module cache...');
    const startTime = performance.now();

    await this.preloadModules(modulePaths);

    const warmUpTime = performance.now() - startTime;
    console.log(`✅ Cache warmed up in ${warmUpTime.toFixed(2)}ms`);
  }

  /**
   * Utility methods
   */
  _chunkArray(array, chunkSize) {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }

  _estimateMemoryUsage() {
    // Rough estimation of memory usage
    return {
      cachedModules: this.moduleCache.size,
      loadedModules: this.loadedModules.size,
      estimatedSize: (this.moduleCache.size + this.loadedModules.size) * 1024, // Rough estimate
    };
  }
}

// Create singleton instance
const lazyLoadingSystem = new LazyLoadingSystem();

export default lazyLoadingSystem;
