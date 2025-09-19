/**
 * 📊 Real-time System Monitoring via Telegram
 *
 * Continuous monitoring and alerting system
 */

const EventEmitter = require('events');

class RealTimeSystemMonitor extends EventEmitter {
  constructor() {
    super();
    this.monitoringInterval = null;
    this.metrics = {
      system: {},
      performance: {},
      agents: {},
      errors: []
    };
    this.thresholds = {
      cpu: 80,
      memory: 85,
      disk: 90,
      responseTime: 5000,
      errorRate: 5
    };
    this.alertHistory = new Map();
    this.isMonitoring = false;

    this.setupMonitoring();
  }

  /**
   * Start real-time monitoring
   */
  startMonitoring(intervalMs = 30000) {
    if (this.isMonitoring) {
      console.log('📊 Monitoring already active');
      return;
    }

    this.isMonitoring = true;
    this.monitoringInterval = setInterval(() => {
      this.collectMetrics();
      this.analyzeMetrics();
      this.checkThresholds();
    }, intervalMs);

    console.log(`📊 Real-time monitoring started (${intervalMs}ms interval)`);
    this.emit('monitoring_started', { interval: intervalMs });
  }

  /**
   * Stop monitoring
   */
  stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }

    this.isMonitoring = false;
    console.log('📊 Real-time monitoring stopped');
    this.emit('monitoring_stopped');
  }

  /**
   * Collect system metrics
   */
  async collectMetrics() {
    try {
      // System metrics
      this.metrics.system = {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        cpu: await this.getCPUUsage(),
        timestamp: new Date()
      };

      // Performance metrics
      this.metrics.performance = {
        responseTime: await this.getAverageResponseTime(),
        throughput: await this.getThroughput(),
        activeConnections: await this.getActiveConnections(),
        timestamp: new Date()
      };

      // Agent metrics
      this.metrics.agents = await this.getAgentMetrics();

      // Error metrics
      this.metrics.errors = await this.getErrorMetrics();

      this.emit('metrics_collected', this.metrics);
    } catch (error) {
      console.error('❌ Error collecting metrics:', error);
      this.emit('metrics_error', error);
    }
  }

  /**
   * Analyze collected metrics
   */
  analyzeMetrics() {
    const analysis = {
      healthScore: this.calculateHealthScore(),
      trends: this.calculateTrends(),
      anomalies: this.detectAnomalies(),
      recommendations: this.generateRecommendations(),
      timestamp: new Date()
    };

    this.emit('metrics_analyzed', analysis);
  }

  /**
   * Check thresholds and trigger alerts
   */
  checkThresholds() {
    const alerts = [];

    // CPU threshold
    if (this.metrics.system.cpu > this.thresholds.cpu) {
      alerts.push({
        type: 'cpu_high',
        severity: 'warning',
        message: `CPU usage is ${this.metrics.system.cpu}% (threshold: ${this.thresholds.cpu}%)`,
        value: this.metrics.system.cpu,
        threshold: this.thresholds.cpu
      });
    }

    // Memory threshold
    if (this.metrics.system.memory && this.metrics.system.memory.heapUsed && this.metrics.system.memory.heapTotal) {
      const memoryUsage = (this.metrics.system.memory.heapUsed / this.metrics.system.memory.heapTotal) * 100;
      if (memoryUsage > this.thresholds.memory) {
        alerts.push({
          type: 'memory_high',
          severity: 'warning',
          message: `Memory usage is ${memoryUsage.toFixed(1)}% (threshold: ${this.thresholds.memory}%)`,
          value: memoryUsage,
          threshold: this.thresholds.memory
        });
      }
    }

    // Response time threshold
    if (this.metrics.performance.responseTime > this.thresholds.responseTime) {
      alerts.push({
        type: 'response_slow',
        severity: 'warning',
        message: `Response time is ${this.metrics.performance.responseTime}ms (threshold: ${this.thresholds.responseTime}ms)`,
        value: this.metrics.performance.responseTime,
        threshold: this.thresholds.responseTime
      });
    }

    // Error rate threshold
    const errorRate = this.calculateErrorRate();
    if (errorRate > this.thresholds.errorRate) {
      alerts.push({
        type: 'error_rate_high',
        severity: 'critical',
        message: `Error rate is ${errorRate}% (threshold: ${this.thresholds.errorRate}%)`,
        value: errorRate,
        threshold: this.thresholds.errorRate
      });
    }

    // Process alerts
    alerts.forEach(alert => {
      this.processAlert(alert);
    });

    if (alerts.length > 0) {
      this.emit('alerts_generated', alerts);
    }
  }

  /**
   * Process alert
   */
  processAlert(alert) {
    const alertKey = `${alert.type}_${Math.floor(Date.now() / 60000)}`; // Group by minute

    if (!this.alertHistory.has(alertKey)) {
      this.alertHistory.set(alertKey, {
        ...alert,
        count: 1,
        firstSeen: new Date(),
        lastSeen: new Date()
      });

      this.emit('alert_triggered', alert);
    } else {
      const existingAlert = this.alertHistory.get(alertKey);
      existingAlert.count++;
      existingAlert.lastSeen = new Date();
    }
  }

  /**
   * Calculate system health score
   */
  calculateHealthScore() {
    let score = 100;

    // CPU impact
    if (this.metrics.system.cpu > this.thresholds.cpu) {
      score -= (this.metrics.system.cpu - this.thresholds.cpu) * 2;
    }

    // Memory impact - with null checks
    if (this.metrics.system.memory && this.metrics.system.memory.heapUsed && this.metrics.system.memory.heapTotal) {
      const memoryUsage = (this.metrics.system.memory.heapUsed / this.metrics.system.memory.heapTotal) * 100;
      if (memoryUsage > this.thresholds.memory) {
        score -= (memoryUsage - this.thresholds.memory) * 2;
      }
    }

    // Response time impact
    if (this.metrics.performance.responseTime > this.thresholds.responseTime) {
      score -= ((this.metrics.performance.responseTime - this.thresholds.responseTime) / 1000) * 5;
    }

    // Error rate impact
    const errorRate = this.calculateErrorRate();
    if (errorRate > this.thresholds.errorRate) {
      score -= errorRate * 3;
    }

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Calculate trends
   */
  calculateTrends() {
    // This would analyze historical data to identify trends
    return {
      cpu: 'stable',
      memory: 'increasing',
      responseTime: 'stable',
      errors: 'decreasing'
    };
  }

  /**
   * Detect anomalies
   */
  detectAnomalies() {
    const anomalies = [];

    // Simple anomaly detection based on thresholds
    if (this.metrics.system.cpu > this.thresholds.cpu * 1.5) {
      anomalies.push({
        type: 'cpu_spike',
        severity: 'high',
        description: 'Unusual CPU spike detected'
      });
    }

    return anomalies;
  }

  /**
   * Generate recommendations
   */
  generateRecommendations() {
    const recommendations = [];

    if (this.metrics.system.cpu > this.thresholds.cpu) {
      recommendations.push({
        type: 'performance',
        priority: 'high',
        action: 'Consider optimizing CPU-intensive operations',
        impact: 'Reduce CPU usage'
      });
    }

    if (this.metrics.system.memory && this.metrics.system.memory.heapUsed && this.metrics.system.memory.heapTotal) {
      const memoryUsage = (this.metrics.system.memory.heapUsed / this.metrics.system.memory.heapTotal) * 100;
      if (memoryUsage > this.thresholds.memory) {
        recommendations.push({
          type: 'memory',
          priority: 'medium',
          action: 'Review memory usage and consider garbage collection',
          impact: 'Improve memory efficiency'
        });
      }
    }

    return recommendations;
  }

  /**
   * Get CPU usage (simplified)
   */
  async getCPUUsage() {
    // Simplified CPU usage calculation
    const startUsage = process.cpuUsage();
    await new Promise(resolve => setTimeout(resolve, 100));
    const endUsage = process.cpuUsage(startUsage);

    const totalUsage = (endUsage.user + endUsage.system) / 1000000; // Convert to seconds
    return Math.min(100, totalUsage * 100); // Convert to percentage
  }

  /**
   * Get average response time
   */
  async getAverageResponseTime() {
    // This would track actual API response times
    return Math.random() * 1000 + 100; // Mock data
  }

  /**
   * Get throughput
   */
  async getThroughput() {
    // This would track requests per second
    return Math.random() * 100 + 50; // Mock data
  }

  /**
   * Get active connections
   */
  async getActiveConnections() {
    // This would track WebSocket connections
    return Math.floor(Math.random() * 20) + 5; // Mock data
  }

  /**
   * Get agent metrics
   */
  async getAgentMetrics() {
    // This would get metrics from the agent controller
    return {
      totalAgents: 5,
      activeAgents: 5,
      averageResponseTime: 1.2,
      totalCommands: 1247,
      successRate: 94.5
    };
  }

  /**
   * Get error metrics
   */
  async getErrorMetrics() {
    // This would track recent errors
    return {
      totalErrors: 3,
      criticalErrors: 0,
      warnings: 3,
      lastError: new Date(Date.now() - 300000) // 5 minutes ago
    };
  }

  /**
   * Calculate error rate
   */
  calculateErrorRate() {
    const errorMetrics = this.metrics.errors;
    if (!errorMetrics.totalErrors) return 0;

    // Simplified error rate calculation
    return (errorMetrics.totalErrors / 100) * 100; // Mock calculation
  }

  /**
   * Get monitoring status
   */
  getMonitoringStatus() {
    return {
      isActive: this.isMonitoring,
      interval: this.monitoringInterval ? 30000 : null,
      metrics: this.metrics,
      healthScore: this.calculateHealthScore(),
      activeAlerts: Array.from(this.alertHistory.values()).filter(
        alert => Date.now() - alert.lastSeen.getTime() < 300000 // Last 5 minutes
      ),
      thresholds: this.thresholds
    };
  }

  /**
   * Update thresholds
   */
  updateThresholds(newThresholds) {
    this.thresholds = { ...this.thresholds, ...newThresholds };
    this.emit('thresholds_updated', this.thresholds);
  }

  /**
   * Get alert history
   */
  getAlertHistory(hours = 24) {
    const cutoffTime = Date.now() - hours * 60 * 60 * 1000;
    return Array.from(this.alertHistory.values())
      .filter(alert => alert.firstSeen.getTime() > cutoffTime)
      .sort((a, b) => b.firstSeen - a.firstSeen);
  }

  /**
   * Clear old alerts
   */
  clearOldAlerts(hours = 24) {
    const cutoffTime = Date.now() - hours * 60 * 60 * 1000;
    for (const [key, alert] of this.alertHistory) {
      if (alert.firstSeen.getTime() < cutoffTime) {
        this.alertHistory.delete(key);
      }
    }
  }

  /**
   * Setup monitoring
   */
  setupMonitoring() {
    // Setup event listeners
    this.on('alert_triggered', alert => {
      console.log(`🚨 Alert: ${alert.message}`);
    });

    this.on('metrics_collected', metrics => {
      // Could send metrics to external monitoring systems
    });

    // Clear old alerts every hour
    setInterval(
      () => {
        this.clearOldAlerts(24);
      },
      60 * 60 * 1000
    );
  }

  /**
   * Generate monitoring report
   */
  generateReport() {
    const status = this.getMonitoringStatus();
    const alertHistory = this.getAlertHistory(24);

    return {
      summary: {
        healthScore: status.healthScore,
        isMonitoring: status.isActive,
        totalAlerts: alertHistory.length,
        criticalAlerts: alertHistory.filter(a => a.severity === 'critical').length
      },
      metrics: this.metrics,
      alerts: alertHistory,
      recommendations: this.generateRecommendations(),
      timestamp: new Date()
    };
  }
}

module.exports = RealTimeSystemMonitor;
