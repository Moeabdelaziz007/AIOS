/**
 * Comprehensive Monitoring System
 * Handles system health, metrics collection, and alerting
 */

const os = require('os');
const fs = require('fs');
const path = require('path');
const {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} = require('firebase/firestore');
const { db } = require('./firestoreDataStorage');

class MonitoringSystem {
  constructor() {
    this.metrics = {
      system: new Map(),
      performance: new Map(),
      errors: new Map(),
      users: new Map(),
      api: new Map(),
    };

    this.alerts = [];
    this.thresholds = {
      cpu: 80, // CPU usage percentage
      memory: 85, // Memory usage percentage
      disk: 90, // Disk usage percentage
      responseTime: 5000, // API response time in ms
      errorRate: 5, // Error rate percentage
      activeUsers: 1000, // Active users threshold
    };

    this.collectionInterval = 30000; // 30 seconds
    this.alertInterval = 60000; // 1 minute
    this.isMonitoring = false;
    this.intervals = new Map();

    this.telegramBot = null;
    this.alertChannels = {
      telegram: true,
      email: false,
      webhook: false,
    };
  }

  /**
   * Initialize monitoring system
   */
  async initialize(telegramBot = null) {
    try {
      this.telegramBot = telegramBot;

      // Start system monitoring
      this.startSystemMonitoring();

      // Start performance monitoring
      this.startPerformanceMonitoring();

      // Start error monitoring
      this.startErrorMonitoring();

      // Start user monitoring
      this.startUserMonitoring();

      // Start API monitoring
      this.startAPIMonitoring();

      // Start alert processing
      this.startAlertProcessing();

      this.isMonitoring = true;
      console.log('📊 Monitoring system initialized successfully');

      return true;
    } catch (error) {
      console.error('❌ Failed to initialize monitoring system:', error);
      throw error;
    }
  }

  /**
   * Start system monitoring
   */
  startSystemMonitoring() {
    const interval = setInterval(async () => {
      try {
        const systemMetrics = await this.collectSystemMetrics();
        this.metrics.system.set(Date.now(), systemMetrics);

        // Check thresholds
        this.checkSystemThresholds(systemMetrics);

        // Store in Firestore
        await this.storeMetrics('systemMetrics', systemMetrics);
      } catch (error) {
        console.error('❌ System monitoring error:', error);
      }
    }, this.collectionInterval);

    this.intervals.set('system', interval);
  }

  /**
   * Start performance monitoring
   */
  startPerformanceMonitoring() {
    const interval = setInterval(async () => {
      try {
        const performanceMetrics = await this.collectPerformanceMetrics();
        this.metrics.performance.set(Date.now(), performanceMetrics);

        // Check thresholds
        this.checkPerformanceThresholds(performanceMetrics);

        // Store in Firestore
        await this.storeMetrics('performanceMetrics', performanceMetrics);
      } catch (error) {
        console.error('❌ Performance monitoring error:', error);
      }
    }, this.collectionInterval);

    this.intervals.set('performance', interval);
  }

  /**
   * Start error monitoring
   */
  startErrorMonitoring() {
    const interval = setInterval(async () => {
      try {
        const errorMetrics = await this.collectErrorMetrics();
        this.metrics.errors.set(Date.now(), errorMetrics);

        // Check thresholds
        this.checkErrorThresholds(errorMetrics);

        // Store in Firestore
        await this.storeMetrics('errorMetrics', errorMetrics);
      } catch (error) {
        console.error('❌ Error monitoring error:', error);
      }
    }, this.collectionInterval);

    this.intervals.set('errors', interval);
  }

  /**
   * Start user monitoring
   */
  startUserMonitoring() {
    const interval = setInterval(async () => {
      try {
        const userMetrics = await this.collectUserMetrics();
        this.metrics.users.set(Date.now(), userMetrics);

        // Check thresholds
        this.checkUserThresholds(userMetrics);

        // Store in Firestore
        await this.storeMetrics('userMetrics', userMetrics);
      } catch (error) {
        console.error('❌ User monitoring error:', error);
      }
    }, this.collectionInterval);

    this.intervals.set('users', interval);
  }

  /**
   * Start API monitoring
   */
  startAPIMonitoring() {
    const interval = setInterval(async () => {
      try {
        const apiMetrics = await this.collectAPIMetrics();
        this.metrics.api.set(Date.now(), apiMetrics);

        // Check thresholds
        this.checkAPIThresholds(apiMetrics);

        // Store in Firestore
        await this.storeMetrics('apiMetrics', apiMetrics);
      } catch (error) {
        console.error('❌ API monitoring error:', error);
      }
    }, this.collectionInterval);

    this.intervals.set('api', interval);
  }

  /**
   * Start alert processing
   */
  startAlertProcessing() {
    const interval = setInterval(async () => {
      try {
        await this.processAlerts();
      } catch (error) {
        console.error('❌ Alert processing error:', error);
      }
    }, this.alertInterval);

    this.intervals.set('alerts', interval);
  }

  /**
   * Collect system metrics
   */
  async collectSystemMetrics() {
    const cpus = os.cpus();
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;

    // Calculate CPU usage
    let cpuUsage = 0;
    if (cpus.length > 0) {
      const cpu = cpus[0];
      const total = Object.values(cpu.times).reduce((a, b) => a + b, 0);
      const idle = cpu.times.idle;
      cpuUsage = ((total - idle) / total) * 100;
    }

    // Calculate disk usage
    const diskUsage = await this.getDiskUsage();

    return {
      timestamp: new Date().toISOString(),
      cpu: {
        usage: cpuUsage,
        cores: cpus.length,
        model: cpus[0]?.model || 'Unknown',
      },
      memory: {
        total: totalMem,
        used: usedMem,
        free: freeMem,
        usage: (usedMem / totalMem) * 100,
      },
      disk: diskUsage,
      platform: os.platform(),
      arch: os.arch(),
      uptime: os.uptime(),
      loadAverage: os.loadavg(),
      hostname: os.hostname(),
    };
  }

  /**
   * Collect performance metrics
   */
  async collectPerformanceMetrics() {
    const memUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();

    return {
      timestamp: new Date().toISOString(),
      process: {
        pid: process.pid,
        uptime: process.uptime(),
        memory: {
          rss: memUsage.rss,
          heapTotal: memUsage.heapTotal,
          heapUsed: memUsage.heapUsed,
          external: memUsage.external,
          arrayBuffers: memUsage.arrayBuffers,
        },
        cpu: {
          user: cpuUsage.user,
          system: cpuUsage.system,
        },
      },
      node: {
        version: process.version,
        platform: process.platform,
        arch: process.arch,
      },
      eventLoop: {
        lag: await this.getEventLoopLag(),
      },
    };
  }

  /**
   * Collect error metrics
   */
  async collectErrorMetrics() {
    // This would integrate with your error tracking system
    return {
      timestamp: new Date().toISOString(),
      errors: {
        total: 0, // Would be populated from error tracking
        byType: {},
        bySeverity: {},
        rate: 0,
      },
      exceptions: {
        uncaught: 0,
        unhandled: 0,
      },
    };
  }

  /**
   * Collect user metrics
   */
  async collectUserMetrics() {
    try {
      // Get active users from Firestore
      const activeUsersQuery = query(
        collection(db, 'userSessions'),
        where('isActive', '==', true)
      );
      const activeUsersSnapshot = await getDocs(activeUsersQuery);

      return {
        timestamp: new Date().toISOString(),
        users: {
          active: activeUsersSnapshot.size,
          total: 0, // Would be total registered users
          newToday: 0, // Would be new registrations today
          online: activeUsersSnapshot.size,
        },
        sessions: {
          active: activeUsersSnapshot.size,
          total: 0, // Would be total sessions
        },
      };
    } catch (error) {
      console.error('❌ Failed to collect user metrics:', error);
      return {
        timestamp: new Date().toISOString(),
        users: { active: 0, total: 0, newToday: 0, online: 0 },
        sessions: { active: 0, total: 0 },
      };
    }
  }

  /**
   * Collect API metrics
   */
  async collectAPIMetrics() {
    return {
      timestamp: new Date().toISOString(),
      requests: {
        total: 0, // Would be tracked from API middleware
        perSecond: 0,
        averageResponseTime: 0,
        errors: 0,
        successRate: 100,
      },
      endpoints: {
        // Would track individual endpoint metrics
      },
    };
  }

  /**
   * Get disk usage
   */
  async getDiskUsage() {
    try {
      const stats = fs.statSync(process.cwd());
      return {
        total: 0, // Would need system-specific implementation
        used: 0,
        free: 0,
        usage: 0,
      };
    } catch (error) {
      return { total: 0, used: 0, free: 0, usage: 0 };
    }
  }

  /**
   * Get event loop lag
   */
  async getEventLoopLag() {
    return new Promise(resolve => {
      const start = process.hrtime.bigint();
      setImmediate(() => {
        const lag = Number(process.hrtime.bigint() - start) / 1000000; // Convert to ms
        resolve(lag);
      });
    });
  }

  /**
   * Check system thresholds
   */
  checkSystemThresholds(metrics) {
    const alerts = [];

    if (metrics.cpu.usage > this.thresholds.cpu) {
      alerts.push({
        type: 'cpu',
        severity: 'warning',
        message: `High CPU usage: ${metrics.cpu.usage.toFixed(1)}%`,
        value: metrics.cpu.usage,
        threshold: this.thresholds.cpu,
      });
    }

    if (metrics.memory.usage > this.thresholds.memory) {
      alerts.push({
        type: 'memory',
        severity: 'warning',
        message: `High memory usage: ${metrics.memory.usage.toFixed(1)}%`,
        value: metrics.memory.usage,
        threshold: this.thresholds.memory,
      });
    }

    if (metrics.disk.usage > this.thresholds.disk) {
      alerts.push({
        type: 'disk',
        severity: 'critical',
        message: `High disk usage: ${metrics.disk.usage.toFixed(1)}%`,
        value: metrics.disk.usage,
        threshold: this.thresholds.disk,
      });
    }

    alerts.forEach(alert => this.addAlert(alert));
  }

  /**
   * Check performance thresholds
   */
  checkPerformanceThresholds(metrics) {
    const alerts = [];

    if (
      metrics.process.memory.heapUsed >
      metrics.process.memory.heapTotal * 0.9
    ) {
      alerts.push({
        type: 'heap',
        severity: 'warning',
        message: `High heap usage: ${(
          metrics.process.memory.heapUsed /
          1024 /
          1024
        ).toFixed(1)}MB`,
        value: metrics.process.memory.heapUsed,
        threshold: metrics.process.memory.heapTotal * 0.9,
      });
    }

    if (metrics.eventLoop.lag > 100) {
      alerts.push({
        type: 'eventLoop',
        severity: 'warning',
        message: `High event loop lag: ${metrics.eventLoop.lag.toFixed(1)}ms`,
        value: metrics.eventLoop.lag,
        threshold: 100,
      });
    }

    alerts.forEach(alert => this.addAlert(alert));
  }

  /**
   * Check error thresholds
   */
  checkErrorThresholds(metrics) {
    const alerts = [];

    if (metrics.errors.rate > this.thresholds.errorRate) {
      alerts.push({
        type: 'errorRate',
        severity: 'critical',
        message: `High error rate: ${metrics.errors.rate.toFixed(1)}%`,
        value: metrics.errors.rate,
        threshold: this.thresholds.errorRate,
      });
    }

    alerts.forEach(alert => this.addAlert(alert));
  }

  /**
   * Check user thresholds
   */
  checkUserThresholds(metrics) {
    const alerts = [];

    if (metrics.users.active > this.thresholds.activeUsers) {
      alerts.push({
        type: 'activeUsers',
        severity: 'info',
        message: `High active user count: ${metrics.users.active}`,
        value: metrics.users.active,
        threshold: this.thresholds.activeUsers,
      });
    }

    alerts.forEach(alert => this.addAlert(alert));
  }

  /**
   * Check API thresholds
   */
  checkAPIThresholds(metrics) {
    const alerts = [];

    if (metrics.requests.averageResponseTime > this.thresholds.responseTime) {
      alerts.push({
        type: 'responseTime',
        severity: 'warning',
        message: `High API response time: ${metrics.requests.averageResponseTime}ms`,
        value: metrics.requests.averageResponseTime,
        threshold: this.thresholds.responseTime,
      });
    }

    alerts.forEach(alert => this.addAlert(alert));
  }

  /**
   * Add alert
   */
  addAlert(alert) {
    const alertData = {
      ...alert,
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      acknowledged: false,
      resolved: false,
    };

    this.alerts.push(alertData);
    console.log(`🚨 Alert: ${alert.message}`);

    // Store in Firestore
    this.storeAlert(alertData);
  }

  /**
   * Process alerts
   */
  async processAlerts() {
    const unacknowledgedAlerts = this.alerts.filter(
      alert => !alert.acknowledged
    );

    for (const alert of unacknowledgedAlerts) {
      await this.sendAlert(alert);
    }
  }

  /**
   * Send alert
   */
  async sendAlert(alert) {
    try {
      if (this.alertChannels.telegram && this.telegramBot) {
        await this.sendTelegramAlert(alert);
      }

      if (this.alertChannels.email) {
        await this.sendEmailAlert(alert);
      }

      if (this.alertChannels.webhook) {
        await this.sendWebhookAlert(alert);
      }

      // Mark as acknowledged
      alert.acknowledged = true;
    } catch (error) {
      console.error('❌ Failed to send alert:', error);
    }
  }

  /**
   * Send Telegram alert
   */
  async sendTelegramAlert(alert) {
    if (!this.telegramBot) return;

    const severityEmoji = {
      info: 'ℹ️',
      warning: '⚠️',
      critical: '🚨',
      error: '❌',
    };

    const message = `${severityEmoji[alert.severity]} *AIOS System Alert*
    
*Type:* ${alert.type}
*Severity:* ${alert.severity.toUpperCase()}
*Message:* ${alert.message}
*Value:* ${alert.value}
*Threshold:* ${alert.threshold}
*Time:* ${new Date(alert.timestamp).toLocaleString()}

Alert ID: \`${alert.id}\``;

    try {
      await this.telegramBot.sendMessage(
        process.env.DEBUGGER_CHAT_ID,
        message,
        {
          parse_mode: 'Markdown',
        }
      );
    } catch (error) {
      console.error('❌ Failed to send Telegram alert:', error);
    }
  }

  /**
   * Send email alert
   */
  async sendEmailAlert(alert) {
    // Email implementation would go here
    console.log('📧 Email alert:', alert.message);
  }

  /**
   * Send webhook alert
   */
  async sendWebhookAlert(alert) {
    // Webhook implementation would go here
    console.log('🔗 Webhook alert:', alert.message);
  }

  /**
   * Store metrics in Firestore
   */
  async storeMetrics(collectionName, metrics) {
    try {
      await addDoc(collection(db, collectionName), metrics);
    } catch (error) {
      console.error(`❌ Failed to store ${collectionName}:`, error);
    }
  }

  /**
   * Store alert in Firestore
   */
  async storeAlert(alert) {
    try {
      await addDoc(collection(db, 'alerts'), alert);
    } catch (error) {
      console.error('❌ Failed to store alert:', error);
    }
  }

  /**
   * Get system health status
   */
  getHealthStatus() {
    const latestSystem = Array.from(this.metrics.system.values()).pop();
    const latestPerformance = Array.from(
      this.metrics.performance.values()
    ).pop();
    const latestErrors = Array.from(this.metrics.errors.values()).pop();
    const latestUsers = Array.from(this.metrics.users.values()).pop();

    const status = {
      overall: 'healthy',
      timestamp: new Date().toISOString(),
      components: {
        system: this.getComponentStatus(latestSystem, 'system'),
        performance: this.getComponentStatus(latestPerformance, 'performance'),
        errors: this.getComponentStatus(latestErrors, 'errors'),
        users: this.getComponentStatus(latestUsers, 'users'),
      },
      alerts: {
        total: this.alerts.length,
        unacknowledged: this.alerts.filter(a => !a.acknowledged).length,
        critical: this.alerts.filter(a => a.severity === 'critical').length,
      },
    };

    // Determine overall status
    const criticalAlerts = this.alerts.filter(
      a => a.severity === 'critical' && !a.resolved
    );
    if (criticalAlerts.length > 0) {
      status.overall = 'critical';
    } else if (
      this.alerts.filter(a => a.severity === 'warning' && !a.resolved).length >
      3
    ) {
      status.overall = 'warning';
    }

    return status;
  }

  /**
   * Get component status
   */
  getComponentStatus(metrics, type) {
    if (!metrics) return 'unknown';

    const thresholds = this.thresholds;

    switch (type) {
      case 'system':
        if (
          metrics.cpu?.usage > thresholds.cpu ||
          metrics.memory?.usage > thresholds.memory
        ) {
          return 'warning';
        }
        return 'healthy';

      case 'performance':
        if (
          metrics.process?.memory?.heapUsed >
          metrics.process?.memory?.heapTotal * 0.9
        ) {
          return 'warning';
        }
        return 'healthy';

      case 'errors':
        if (metrics.errors?.rate > thresholds.errorRate) {
          return 'critical';
        }
        return 'healthy';

      case 'users':
        return 'healthy';

      default:
        return 'unknown';
    }
  }

  /**
   * Get metrics summary
   */
  getMetricsSummary() {
    return {
      system: {
        count: this.metrics.system.size,
        latest: Array.from(this.metrics.system.values()).pop(),
      },
      performance: {
        count: this.metrics.performance.size,
        latest: Array.from(this.metrics.performance.values()).pop(),
      },
      errors: {
        count: this.metrics.errors.size,
        latest: Array.from(this.metrics.errors.values()).pop(),
      },
      users: {
        count: this.metrics.users.size,
        latest: Array.from(this.metrics.users.values()).pop(),
      },
      api: {
        count: this.metrics.api.size,
        latest: Array.from(this.metrics.api.values()).pop(),
      },
    };
  }

  /**
   * Stop monitoring
   */
  stopMonitoring() {
    this.intervals.forEach((interval, name) => {
      clearInterval(interval);
      console.log(`📊 Stopped ${name} monitoring`);
    });

    this.intervals.clear();
    this.isMonitoring = false;
  }

  /**
   * Update thresholds
   */
  updateThresholds(newThresholds) {
    this.thresholds = { ...this.thresholds, ...newThresholds };
    console.log('📊 Thresholds updated:', this.thresholds);
  }

  /**
   * Update alert channels
   */
  updateAlertChannels(channels) {
    this.alertChannels = { ...this.alertChannels, ...channels };
    console.log('📊 Alert channels updated:', this.alertChannels);
  }
}

module.exports = MonitoringSystem;
