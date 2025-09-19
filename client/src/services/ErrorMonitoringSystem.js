/**
 * Comprehensive Error Monitoring System for AIOS
 * Provides real-time error tracking, analysis, and alerting
 */
class ErrorMonitoringSystem {
  constructor() {
    this.errors = new Map();
    this.errorPatterns = new Map();
    this.alertThresholds = this.getDefaultThresholds();
    this.isMonitoring = false;
    this.errorStats = {
      total: 0,
      critical: 0,
      warning: 0,
      info: 0,
      resolved: 0,
      unresolved: 0
    };
    this.alertChannels = [];
  }

  /**
   * Get default alert thresholds
   */
  getDefaultThresholds() {
    return {
      critical: {
        count: 5,
        timeWindow: 300000, // 5 minutes
        action: 'immediate_alert'
      },
      warning: {
        count: 10,
        timeWindow: 600000, // 10 minutes
        action: 'notify_admin'
      },
      info: {
        count: 50,
        timeWindow: 1800000, // 30 minutes
        action: 'log_only'
      }
    };
  }

  /**
   * Start error monitoring
   */
  startMonitoring() {
    if (this.isMonitoring) {
      console.warn('⚠️ Error monitoring is already running');
      return;
    }

    console.log('🔍 Starting comprehensive error monitoring...');
    this.isMonitoring = true;

    // Setup global error handlers
    this.setupGlobalErrorHandlers();

    // Start periodic analysis
    this.startPeriodicAnalysis();

    // Setup real-time monitoring
    this.setupRealTimeMonitoring();

    console.log('✅ Error monitoring started successfully');
  }

  /**
   * Stop error monitoring
   */
  stopMonitoring() {
    if (!this.isMonitoring) {
      console.warn('⚠️ Error monitoring is not running');
      return;
    }

    console.log('🛑 Stopping error monitoring...');
    this.isMonitoring = false;

    // Cleanup global handlers
    this.cleanupGlobalErrorHandlers();

    console.log('✅ Error monitoring stopped');
  }

  /**
   * Setup global error handlers
   */
  setupGlobalErrorHandlers() {
    // Window error handler
    window.addEventListener('error', event => {
      this.captureError({
        type: 'javascript',
        level: 'error',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      });
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', event => {
      this.captureError({
        type: 'promise_rejection',
        level: 'error',
        message: event.reason?.message || 'Unhandled promise rejection',
        stack: event.reason?.stack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      });
    });

    // Console error override
    const originalConsoleError = console.error;
    console.error = (...args) => {
      this.captureError({
        type: 'console_error',
        level: 'error',
        message: args.join(' '),
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      });
      originalConsoleError.apply(console, args);
    };

    // Console warn override
    const originalConsoleWarn = console.warn;
    console.warn = (...args) => {
      this.captureError({
        type: 'console_warning',
        level: 'warning',
        message: args.join(' '),
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      });
      originalConsoleWarn.apply(console, args);
    };
  }

  /**
   * Cleanup global error handlers
   */
  cleanupGlobalErrorHandlers() {
    // Remove event listeners
    window.removeEventListener('error', this.handleWindowError);
    window.removeEventListener('unhandledrejection', this.handleUnhandledRejection);
  }

  /**
   * Capture and process an error
   */
  captureError(errorData) {
    try {
      // Generate unique error ID
      const errorId = this.generateErrorId(errorData);

      // Enhance error data
      const enhancedError = this.enhanceErrorData(errorData);

      // Store error
      this.errors.set(errorId, enhancedError);

      // Update statistics
      this.updateErrorStats(enhancedError);

      // Analyze error patterns
      this.analyzeErrorPatterns(enhancedError);

      // Check alert thresholds
      this.checkAlertThresholds(enhancedError);

      // Log error
      console.log(`🚨 Error captured: ${enhancedError.message} (${enhancedError.level})`);

      return errorId;
    } catch (error) {
      console.error('❌ Error in error monitoring system:', error);
    }
  }

  /**
   * Generate unique error ID
   */
  generateErrorId(errorData) {
    const hash = this.simpleHash(JSON.stringify(errorData));
    return `error_${Date.now()}_${hash}`;
  }

  /**
   * Simple hash function
   */
  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Enhance error data with additional context
   */
  enhanceErrorData(errorData) {
    return {
      ...errorData,
      id: this.generateErrorId(errorData),
      sessionId: this.getSessionId(),
      userId: this.getCurrentUserId(),
      environment: process.env.NODE_ENV || 'development',
      version: this.getAppVersion(),
      resolved: false,
      occurrences: 1,
      firstOccurrence: errorData.timestamp,
      lastOccurrence: errorData.timestamp,
      tags: this.generateErrorTags(errorData),
      severity: this.calculateSeverity(errorData)
    };
  }

  /**
   * Get current session ID
   */
  getSessionId() {
    return sessionStorage.getItem('aios_session_id') || 'unknown';
  }

  /**
   * Get current user ID
   */
  getCurrentUserId() {
    // This would typically get from auth context
    return 'anonymous';
  }

  /**
   * Get app version
   */
  getAppVersion() {
    return process.env.REACT_APP_VERSION || '1.0.0';
  }

  /**
   * Generate error tags for categorization
   */
  generateErrorTags(errorData) {
    const tags = [];

    if (errorData.type) tags.push(errorData.type);
    if (errorData.level) tags.push(errorData.level);
    if (errorData.filename) tags.push('client_side');
    if (errorData.stack) tags.push('has_stack');

    return tags;
  }

  /**
   * Calculate error severity
   */
  calculateSeverity(errorData) {
    if (errorData.level === 'critical') return 'critical';
    if (errorData.level === 'error') return 'high';
    if (errorData.level === 'warning') return 'medium';
    return 'low';
  }

  /**
   * Update error statistics
   */
  updateErrorStats(error) {
    this.errorStats.total++;

    if (error.level === 'critical') this.errorStats.critical++;
    else if (error.level === 'warning') this.errorStats.warning++;
    else this.errorStats.info++;

    if (error.resolved) this.errorStats.resolved++;
    else this.errorStats.unresolved++;
  }

  /**
   * Analyze error patterns
   */
  analyzeErrorPatterns(error) {
    const patternKey = this.generatePatternKey(error);

    if (this.errorPatterns.has(patternKey)) {
      const pattern = this.errorPatterns.get(patternKey);
      pattern.count++;
      pattern.lastOccurrence = error.timestamp;
      pattern.errors.push(error.id);
    } else {
      this.errorPatterns.set(patternKey, {
        key: patternKey,
        message: error.message,
        type: error.type,
        level: error.level,
        count: 1,
        firstOccurrence: error.timestamp,
        lastOccurrence: error.timestamp,
        errors: [error.id],
        trend: 'stable'
      });
    }
  }

  /**
   * Generate pattern key for error grouping
   */
  generatePatternKey(error) {
    return `${error.type}_${error.level}_${this.simpleHash(error.message)}`;
  }

  /**
   * Check alert thresholds
   */
  checkAlertThresholds(error) {
    const threshold = this.alertThresholds[error.level];
    if (!threshold) return;

    const recentErrors = this.getRecentErrors(error.level, threshold.timeWindow);

    if (recentErrors.length >= threshold.count) {
      this.triggerAlert(error, recentErrors, threshold);
    }
  }

  /**
   * Get recent errors within time window
   */
  getRecentErrors(level, timeWindow) {
    const now = Date.now();
    const cutoff = now - timeWindow;

    return Array.from(this.errors.values()).filter(
      error => error.level === level && new Date(error.timestamp).getTime() > cutoff
    );
  }

  /**
   * Trigger alert based on threshold
   */
  triggerAlert(error, recentErrors, threshold) {
    const alert = {
      id: `alert_${Date.now()}`,
      level: error.level,
      message: `${recentErrors.length} ${error.level} errors in ${threshold.timeWindow / 1000}s`,
      errors: recentErrors.map(e => e.id),
      timestamp: new Date().toISOString(),
      action: threshold.action,
      resolved: false
    };

    console.warn(`🚨 ALERT: ${alert.message}`);

    // Send alert to configured channels
    this.sendAlert(alert);
  }

  /**
   * Send alert to configured channels
   */
  async sendAlert(alert) {
    for (const channel of this.alertChannels) {
      try {
        await channel.send(alert);
      } catch (error) {
        console.error('❌ Error sending alert:', error);
      }
    }
  }

  /**
   * Start periodic analysis
   */
  startPeriodicAnalysis() {
    setInterval(() => {
      this.performPeriodicAnalysis();
    }, 60000); // Every minute
  }

  /**
   * Perform periodic analysis
   */
  performPeriodicAnalysis() {
    // Analyze error trends
    this.analyzeErrorTrends();

    // Clean up old errors
    this.cleanupOldErrors();

    // Update error patterns
    this.updateErrorPatterns();
  }

  /**
   * Analyze error trends
   */
  analyzeErrorTrends() {
    for (const [key, pattern] of this.errorPatterns) {
      const recentCount = this.getRecentErrors(pattern.level, 300000).length;
      const previousCount = this.getRecentErrors(pattern.level, 600000).length - recentCount;

      if (recentCount > previousCount) {
        pattern.trend = 'increasing';
      } else if (recentCount < previousCount) {
        pattern.trend = 'decreasing';
      } else {
        pattern.trend = 'stable';
      }
    }
  }

  /**
   * Clean up old errors
   */
  cleanupOldErrors() {
    const cutoff = Date.now() - 24 * 60 * 60 * 1000; // 24 hours ago

    for (const [id, error] of this.errors) {
      if (new Date(error.timestamp).getTime() < cutoff) {
        this.errors.delete(id);
      }
    }
  }

  /**
   * Update error patterns
   */
  updateErrorPatterns() {
    // Remove patterns with no recent errors
    for (const [key, pattern] of this.errorPatterns) {
      const recentErrors = this.getRecentErrors(pattern.level, 3600000); // 1 hour
      if (recentErrors.length === 0) {
        this.errorPatterns.delete(key);
      }
    }
  }

  /**
   * Setup real-time monitoring
   */
  setupRealTimeMonitoring() {
    // Monitor API errors
    this.monitorAPIErrors();

    // Monitor performance issues
    this.monitorPerformance();

    // Monitor user interactions
    this.monitorUserInteractions();
  }

  /**
   * Monitor API errors
   */
  monitorAPIErrors() {
    // Override fetch to monitor API calls
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);

        if (!response.ok) {
          this.captureError({
            type: 'api_error',
            level: 'error',
            message: `API Error: ${response.status} ${response.statusText}`,
            url: args[0],
            status: response.status,
            timestamp: new Date().toISOString()
          });
        }

        return response;
      } catch (error) {
        this.captureError({
          type: 'api_error',
          level: 'error',
          message: `API Request Failed: ${error.message}`,
          url: args[0],
          timestamp: new Date().toISOString()
        });
        throw error;
      }
    };
  }

  /**
   * Monitor performance issues
   */
  monitorPerformance() {
    // Monitor long tasks
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            // Tasks longer than 50ms
            this.captureError({
              type: 'performance',
              level: 'warning',
              message: `Long task detected: ${entry.duration}ms`,
              duration: entry.duration,
              timestamp: new Date().toISOString()
            });
          }
        }
      });

      observer.observe({ entryTypes: ['longtask'] });
    }
  }

  /**
   * Monitor user interactions
   */
  monitorUserInteractions() {
    // Monitor unresponsive clicks
    let clickTimeout;
    document.addEventListener('click', event => {
      clearTimeout(clickTimeout);
      clickTimeout = setTimeout(() => {
        this.captureError({
          type: 'user_interaction',
          level: 'info',
          message: 'Unresponsive click detected',
          target: event.target.tagName,
          timestamp: new Date().toISOString()
        });
      }, 3000);
    });
  }

  /**
   * Get error statistics
   */
  getErrorStats() {
    return {
      ...this.errorStats,
      patterns: this.errorPatterns.size,
      monitoring: this.isMonitoring,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Get error patterns
   */
  getErrorPatterns() {
    return Array.from(this.errorPatterns.values());
  }

  /**
   * Get recent errors
   */
  getRecentErrors(limit = 50) {
    return Array.from(this.errors.values())
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  }

  /**
   * Resolve an error
   */
  resolveError(errorId) {
    const error = this.errors.get(errorId);
    if (error) {
      error.resolved = true;
      error.resolvedAt = new Date().toISOString();
      this.errorStats.resolved++;
      this.errorStats.unresolved--;
      console.log(`✅ Error resolved: ${errorId}`);
    }
  }

  /**
   * Add alert channel
   */
  addAlertChannel(channel) {
    this.alertChannels.push(channel);
  }

  /**
   * Remove alert channel
   */
  removeAlertChannel(channelId) {
    this.alertChannels = this.alertChannels.filter(channel => channel.id !== channelId);
  }

  /**
   * Get monitoring status
   */
  getMonitoringStatus() {
    return {
      isMonitoring: this.isMonitoring,
      errorStats: this.errorStats,
      patterns: this.errorPatterns.size,
      alertChannels: this.alertChannels.length,
      thresholds: this.alertThresholds,
      timestamp: new Date().toISOString()
    };
  }
}

export default ErrorMonitoringSystem;
