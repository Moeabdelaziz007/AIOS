/**
 * Performance Monitoring System for AIOS
 * Comprehensive performance tracking, metrics collection, and analysis
 */

class PerformanceMonitoringSystem {
  constructor() {
    this.metrics = new Map();
    this.performanceEntries = [];
    this.alerts = [];
    this.thresholds = {
      responseTime: 1000, // 1 second
      memoryUsage: 100 * 1024 * 1024, // 100MB
      cpuUsage: 80, // 80%
      errorRate: 0.05, // 5%
      cacheHitRate: 0.8, // 80%
    };

    this.monitoringConfig = {
      enabled: true,
      sampleRate: 1.0, // 100% sampling
      maxEntries: 10000,
      alertCooldown: 300000, // 5 minutes
      metricsRetention: 24 * 60 * 60 * 1000, // 24 hours
    };

    this.performanceStats = {
      totalRequests: 0,
      averageResponseTime: 0,
      p95ResponseTime: 0,
      p99ResponseTime: 0,
      errorCount: 0,
      memoryPeak: 0,
      cpuPeak: 0,
      cacheHitRate: 0,
      throughput: 0,
    };

    this.startMonitoring();
  }

  /**
   * Start performance monitoring
   */
  startMonitoring() {
    if (!this.monitoringConfig.enabled) return;

    // Monitor page load performance
    this._monitorPageLoad();

    // Monitor resource loading
    this._monitorResourceLoading();

    // Monitor memory usage
    this._monitorMemoryUsage();

    // Monitor API calls
    this._monitorAPICalls();

    // Start periodic metrics collection
    this._startMetricsCollection();

    console.log('📊 Performance monitoring started');
  }

  /**
   * Record performance metric
   */
  recordMetric(name, value, metadata = {}) {
    if (!this.monitoringConfig.enabled) return;

    const timestamp = Date.now();
    const entry = {
      name,
      value,
      timestamp,
      metadata,
      id: this._generateId(),
    };

    // Add to entries
    this.performanceEntries.push(entry);

    // Trim entries if needed
    if (this.performanceEntries.length > this.monitoringConfig.maxEntries) {
      this.performanceEntries = this.performanceEntries.slice(
        -this.monitoringConfig.maxEntries
      );
    }

    // Update metrics
    this._updateMetrics(name, value);

    // Check thresholds
    this._checkThresholds(name, value);

    // Clean old entries
    this._cleanupOldEntries();
  }

  /**
   * Measure function execution time
   */
  async measureExecution(name, fn, metadata = {}) {
    const startTime = performance.now();
    const startMemory = this._getMemoryUsage();

    try {
      const result = await fn();
      const endTime = performance.now();
      const endMemory = this._getMemoryUsage();

      const executionTime = endTime - startTime;
      const memoryDelta = endMemory - startMemory;

      this.recordMetric('execution_time', executionTime, {
        ...metadata,
        function: name,
        memoryDelta,
      });

      return result;
    } catch (error) {
      const endTime = performance.now();
      const executionTime = endTime - startTime;

      this.recordMetric('execution_error', executionTime, {
        ...metadata,
        function: name,
        error: error.message,
      });

      throw error;
    }
  }

  /**
   * Monitor API call performance
   */
  monitorAPICall(url, method, startTime, endTime, success, responseSize = 0) {
    const duration = endTime - startTime;

    this.recordMetric('api_call_duration', duration, {
      url,
      method,
      success,
      responseSize,
      endpoint: this._extractEndpoint(url),
    });

    // Update stats
    this.performanceStats.totalRequests++;
    this._updateResponseTimeStats(duration);

    if (!success) {
      this.performanceStats.errorCount++;
    }
  }

  /**
   * Monitor cache performance
   */
  monitorCacheOperation(operation, hit, key, size = 0) {
    this.recordMetric('cache_operation', hit ? 1 : 0, {
      operation,
      key: this._hashKey(key),
      size,
    });
  }

  /**
   * Monitor memory usage
   */
  monitorMemoryUsage() {
    const memoryInfo = this._getMemoryUsage();
    this.recordMetric('memory_usage', memoryInfo);

    if (memoryInfo > this.performanceStats.memoryPeak) {
      this.performanceStats.memoryPeak = memoryInfo;
    }
  }

  /**
   * Get performance statistics
   */
  getStats() {
    return {
      ...this.performanceStats,
      thresholds: this.thresholds,
      config: this.monitoringConfig,
      recentMetrics: this._getRecentMetrics(),
      alerts: this.alerts.slice(-10), // Last 10 alerts
    };
  }

  /**
   * Get detailed metrics for a specific time range
   */
  getMetrics(name, timeRange = 3600000) {
    // 1 hour default
    const cutoff = Date.now() - timeRange;

    return this.performanceEntries
      .filter(entry => entry.name === name && entry.timestamp > cutoff)
      .map(entry => ({
        value: entry.value,
        timestamp: entry.timestamp,
        metadata: entry.metadata,
      }));
  }

  /**
   * Generate performance report
   */
  generateReport(timeRange = 3600000) {
    const cutoff = Date.now() - timeRange;
    const recentEntries = this.performanceEntries.filter(
      entry => entry.timestamp > cutoff
    );

    const report = {
      timestamp: new Date().toISOString(),
      timeRange,
      summary: this._generateSummary(recentEntries),
      metrics: this._groupMetricsByName(recentEntries),
      recommendations: this._generateRecommendations(recentEntries),
      alerts: this.alerts.filter(alert => alert.timestamp > cutoff),
    };

    return report;
  }

  /**
   * Set performance thresholds
   */
  setThresholds(newThresholds) {
    this.thresholds = { ...this.thresholds, ...newThresholds };
    console.log('📊 Performance thresholds updated:', this.thresholds);
  }

  /**
   * Clear performance data
   */
  clearData() {
    this.performanceEntries = [];
    this.alerts = [];
    this.metrics.clear();
    console.log('🧹 Performance data cleared');
  }

  /**
   * Private monitoring methods
   */
  _monitorPageLoad() {
    if (typeof window !== 'undefined' && window.performance) {
      window.addEventListener('load', () => {
        const navigation = performance.getEntriesByType('navigation')[0];

        this.recordMetric(
          'page_load_time',
          navigation.loadEventEnd - navigation.loadEventStart
        );
        this.recordMetric(
          'dom_content_loaded',
          navigation.domContentLoadedEventEnd -
            navigation.domContentLoadedEventStart
        );
        this.recordMetric('first_paint', this._getFirstPaint());
        this.recordMetric(
          'first_contentful_paint',
          this._getFirstContentfulPaint()
        );
      });
    }
  }

  _monitorResourceLoading() {
    if (typeof window !== 'undefined' && window.performance) {
      const observer = new PerformanceObserver(list => {
        list.getEntries().forEach(entry => {
          this.recordMetric('resource_load_time', entry.duration, {
            resource: entry.name,
            type: entry.initiatorType,
            size: entry.transferSize,
          });
        });
      });

      observer.observe({ entryTypes: ['resource'] });
    }
  }

  _monitorMemoryUsage() {
    if (
      typeof window !== 'undefined' &&
      window.performance &&
      window.performance.memory
    ) {
      setInterval(() => {
        this.monitorMemoryUsage();
      }, 30000); // Every 30 seconds
    }
  }

  _monitorAPICalls() {
    // Override fetch to monitor API calls
    if (typeof window !== 'undefined' && window.fetch) {
      const originalFetch = window.fetch;

      window.fetch = async (...args) => {
        const startTime = performance.now();
        const url = args[0];
        const method = args[1]?.method || 'GET';

        try {
          const response = await originalFetch(...args);
          const endTime = performance.now();

          this.monitorAPICall(url, method, startTime, endTime, response.ok);

          return response;
        } catch (error) {
          const endTime = performance.now();
          this.monitorAPICall(url, method, startTime, endTime, false);
          throw error;
        }
      };
    }
  }

  _startMetricsCollection() {
    setInterval(() => {
      this._collectSystemMetrics();
    }, 60000); // Every minute
  }

  _collectSystemMetrics() {
    // Collect various system metrics
    this.monitorMemoryUsage();

    // Monitor cache performance
    if (typeof window !== 'undefined' && window.caches) {
      this._monitorCachePerformance();
    }
  }

  _monitorCachePerformance() {
    // This would integrate with the ResponseCachingSystem
    // For now, we'll simulate cache metrics
    this.recordMetric('cache_size', this._estimateCacheSize());
  }

  /**
   * Utility methods
   */
  _updateMetrics(name, value) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, {
        count: 0,
        sum: 0,
        min: Infinity,
        max: -Infinity,
        values: [],
      });
    }

    const metric = this.metrics.get(name);
    metric.count++;
    metric.sum += value;
    metric.min = Math.min(metric.min, value);
    metric.max = Math.max(metric.max, value);
    metric.values.push(value);

    // Keep only recent values
    if (metric.values.length > 1000) {
      metric.values = metric.values.slice(-1000);
    }
  }

  _checkThresholds(name, value) {
    const threshold = this.thresholds[name];
    if (!threshold) return;

    const exceeded = value > threshold;
    if (exceeded) {
      this._createAlert(name, value, threshold);
    }
  }

  _createAlert(metric, value, threshold) {
    const alert = {
      id: this._generateId(),
      metric,
      value,
      threshold,
      timestamp: Date.now(),
      severity: this._calculateSeverity(value, threshold),
    };

    // Check cooldown
    const recentAlert = this.alerts.find(
      a =>
        a.metric === metric &&
        Date.now() - a.timestamp < this.monitoringConfig.alertCooldown
    );

    if (!recentAlert) {
      this.alerts.push(alert);
      console.warn(
        `⚠️ Performance alert: ${metric} = ${value} (threshold: ${threshold})`
      );
    }
  }

  _calculateSeverity(value, threshold) {
    const ratio = value / threshold;
    if (ratio > 2) return 'critical';
    if (ratio > 1.5) return 'high';
    if (ratio > 1.2) return 'medium';
    return 'low';
  }

  _updateResponseTimeStats(duration) {
    const currentAvg = this.performanceStats.averageResponseTime;
    const totalRequests = this.performanceStats.totalRequests;

    this.performanceStats.averageResponseTime =
      (currentAvg * (totalRequests - 1) + duration) / totalRequests;
  }

  _getRecentMetrics() {
    const cutoff = Date.now() - 300000; // Last 5 minutes
    return this.performanceEntries
      .filter(entry => entry.timestamp > cutoff)
      .slice(-100); // Last 100 entries
  }

  _generateSummary(entries) {
    const metrics = this._groupMetricsByName(entries);

    return {
      totalEntries: entries.length,
      metricsCount: Object.keys(metrics).length,
      averageResponseTime: this._calculateAverage(metrics.execution_time),
      errorRate: this._calculateErrorRate(entries),
      memoryUsage: this._getLatestValue(metrics.memory_usage),
    };
  }

  _groupMetricsByName(entries) {
    const grouped = {};

    entries.forEach(entry => {
      if (!grouped[entry.name]) {
        grouped[entry.name] = [];
      }
      grouped[entry.name].push(entry);
    });

    return grouped;
  }

  _generateRecommendations(entries) {
    const recommendations = [];

    // Check response times
    const responseTimes = entries.filter(e => e.name === 'execution_time');
    if (responseTimes.length > 0) {
      const avgResponseTime = this._calculateAverage(responseTimes);
      if (avgResponseTime > 1000) {
        recommendations.push({
          type: 'performance',
          priority: 'high',
          message:
            'Average response time is high. Consider optimizing slow operations.',
          metric: 'execution_time',
          value: avgResponseTime,
        });
      }
    }

    // Check memory usage
    const memoryEntries = entries.filter(e => e.name === 'memory_usage');
    if (memoryEntries.length > 0) {
      const latestMemory = this._getLatestValue(memoryEntries);
      if (latestMemory > this.thresholds.memoryUsage) {
        recommendations.push({
          type: 'memory',
          priority: 'medium',
          message:
            'Memory usage is high. Consider implementing memory optimization.',
          metric: 'memory_usage',
          value: latestMemory,
        });
      }
    }

    return recommendations;
  }

  _calculateAverage(entries) {
    if (!entries || entries.length === 0) return 0;
    return (
      entries.reduce((sum, entry) => sum + entry.value, 0) / entries.length
    );
  }

  _calculateErrorRate(entries) {
    const errorEntries = entries.filter(e => e.name === 'execution_error');
    return entries.length > 0 ? errorEntries.length / entries.length : 0;
  }

  _getLatestValue(entries) {
    if (!entries || entries.length === 0) return 0;
    return entries[entries.length - 1].value;
  }

  _getMemoryUsage() {
    if (
      typeof window !== 'undefined' &&
      window.performance &&
      window.performance.memory
    ) {
      return window.performance.memory.usedJSHeapSize;
    }
    return 0;
  }

  _getFirstPaint() {
    if (typeof window !== 'undefined' && window.performance) {
      const paintEntries = performance.getEntriesByType('paint');
      const firstPaint = paintEntries.find(
        entry => entry.name === 'first-paint'
      );
      return firstPaint ? firstPaint.startTime : 0;
    }
    return 0;
  }

  _getFirstContentfulPaint() {
    if (typeof window !== 'undefined' && window.performance) {
      const paintEntries = performance.getEntriesByType('paint');
      const fcp = paintEntries.find(
        entry => entry.name === 'first-contentful-paint'
      );
      return fcp ? fcp.startTime : 0;
    }
    return 0;
  }

  _extractEndpoint(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname;
    } catch {
      return url;
    }
  }

  _hashKey(key) {
    return btoa(JSON.stringify(key)).substring(0, 16);
  }

  _estimateCacheSize() {
    // This would integrate with the actual cache system
    return 0;
  }

  _cleanupOldEntries() {
    const cutoff = Date.now() - this.monitoringConfig.metricsRetention;
    this.performanceEntries = this.performanceEntries.filter(
      entry => entry.timestamp > cutoff
    );
  }

  _generateId() {
    return Math.random().toString(36).substr(2, 9);
  }
}

// Create singleton instance
const performanceMonitoringSystem = new PerformanceMonitoringSystem();

export default performanceMonitoringSystem;
