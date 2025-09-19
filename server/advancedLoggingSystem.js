/**
 * 📊 Advanced Logging & Metrics System
 *
 * Comprehensive logging and metrics collection for all agents
 * with Prometheus/Grafana integration support
 */

const fs = require('fs').promises;
const path = require('path');
const EventEmitter = require('events');

class AdvancedLoggingSystem extends EventEmitter {
  constructor() {
    super();
    this.name = 'Advanced Logging System';
    this.version = '1.0.0';
    this.isActive = false;

    // Logging configuration
    this.logConfig = {
      level: 'info', // debug, info, warn, error
      maxFileSize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
      logDir: path.join(__dirname, '../logs'),
      enableConsole: true,
      enableFile: true,
      enableMetrics: true,
    };

    // Metrics collection
    this.metrics = new Map();
    this.metricTypes = {
      COUNTER: 'counter',
      GAUGE: 'gauge',
      HISTOGRAM: 'histogram',
      SUMMARY: 'summary',
    };

    // Agent logs
    this.agentLogs = new Map();
    this.logBuffer = [];
    this.metricsBuffer = [];

    // Prometheus/Grafana integration
    this.prometheusMetrics = new Map();
    this.grafanaConfig = {
      enabled: false,
      endpoint: 'http://localhost:3000',
      apiKey: null,
    };

    console.log(`📊 ${this.name} v${this.version} initialized`);
  }

  /**
   * Initialize logging system
   */
  async initialize() {
    try {
      console.log('📊 Initializing Advanced Logging System...');

      // Create logs directory
      await this.createLogsDirectory();

      // Initialize metrics
      this.initializeMetrics();

      // Setup log rotation
      this.setupLogRotation();

      // Setup metrics collection
      this.setupMetricsCollection();

      // Setup Prometheus integration
      this.setupPrometheusIntegration();

      this.isActive = true;
      console.log('✅ Advanced Logging System initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Advanced Logging System:', error);
      return false;
    }
  }

  /**
   * Create logs directory
   */
  async createLogsDirectory() {
    try {
      await fs.mkdir(this.logConfig.logDir, { recursive: true });
      console.log(`✅ Logs directory created: ${this.logConfig.logDir}`);
    } catch (error) {
      console.error('❌ Failed to create logs directory:', error);
      throw error;
    }
  }

  /**
   * Initialize metrics
   */
  initializeMetrics() {
    console.log('📈 Initializing metrics...');

    // System metrics
    this.createMetric(
      'system_uptime',
      this.metricTypes.GAUGE,
      'System uptime in seconds'
    );
    this.createMetric(
      'system_memory_usage',
      this.metricTypes.GAUGE,
      'System memory usage in bytes'
    );
    this.createMetric(
      'system_cpu_usage',
      this.metricTypes.GAUGE,
      'System CPU usage percentage'
    );

    // Agent metrics
    this.createMetric(
      'agent_total',
      this.metricTypes.GAUGE,
      'Total number of agents'
    );
    this.createMetric(
      'agent_active',
      this.metricTypes.GAUGE,
      'Number of active agents'
    );
    this.createMetric(
      'agent_errors',
      this.metricTypes.COUNTER,
      'Total agent errors'
    );
    this.createMetric(
      'agent_tasks_completed',
      this.metricTypes.COUNTER,
      'Total tasks completed by agents'
    );
    this.createMetric(
      'agent_response_time',
      this.metricTypes.HISTOGRAM,
      'Agent response time in milliseconds'
    );

    // Workflow metrics
    this.createMetric(
      'workflow_total',
      this.metricTypes.GAUGE,
      'Total number of workflows'
    );
    this.createMetric(
      'workflow_completed',
      this.metricTypes.COUNTER,
      'Total completed workflows'
    );
    this.createMetric(
      'workflow_duration',
      this.metricTypes.HISTOGRAM,
      'Workflow duration in milliseconds'
    );

    // Learning metrics
    this.createMetric(
      'learning_patterns_discovered',
      this.metricTypes.COUNTER,
      'Total patterns discovered'
    );
    this.createMetric(
      'learning_accuracy',
      this.metricTypes.GAUGE,
      'Learning system accuracy'
    );
    this.createMetric(
      'learning_improvements',
      this.metricTypes.COUNTER,
      'Total improvements suggested'
    );

    console.log('✅ Metrics initialized');
  }

  /**
   * Create a metric
   */
  createMetric(name, type, description, labels = []) {
    const metric = {
      name,
      type,
      description,
      labels,
      value: 0,
      values: new Map(), // For histogram/summary
      timestamps: new Map(),
      createdAt: new Date(),
    };

    this.metrics.set(name, metric);

    // Also add to Prometheus metrics
    this.prometheusMetrics.set(name, {
      name: `aios_${name}`,
      type: type.toUpperCase(),
      help: description,
      labels: labels,
      value: 0,
    });
  }

  /**
   * Setup log rotation
   */
  setupLogRotation() {
    console.log('🔄 Setting up log rotation...');

    // Rotate logs every hour
    setInterval(
      () => {
        this.rotateLogs();
      },
      60 * 60 * 1000
    );

    console.log('✅ Log rotation setup completed');
  }

  /**
   * Setup metrics collection
   */
  setupMetricsCollection() {
    console.log('📊 Setting up metrics collection...');

    // Collect system metrics every 30 seconds
    setInterval(() => {
      this.collectSystemMetrics();
    }, 30000);

    // Flush metrics buffer every 5 minutes
    setInterval(
      () => {
        this.flushMetricsBuffer();
      },
      5 * 60 * 1000
    );

    console.log('✅ Metrics collection setup completed');
  }

  /**
   * Setup Prometheus integration
   */
  setupPrometheusIntegration() {
    console.log('🔗 Setting up Prometheus integration...');

    // This would integrate with actual Prometheus client
    // For now, we'll simulate the integration

    console.log('✅ Prometheus integration setup completed');
  }

  /**
   * Log message
   */
  log(level, message, agentId = 'system', metadata = {}) {
    try {
      const logEntry = {
        timestamp: new Date(),
        level: level.toUpperCase(),
        agent: agentId,
        message,
        metadata,
        id: this.generateLogId(),
      };

      // Add to buffer
      this.logBuffer.push(logEntry);

      // Console output
      if (this.logConfig.enableConsole) {
        this.logToConsole(logEntry);
      }

      // File output
      if (this.logConfig.enableFile) {
        this.logToFile(logEntry);
      }

      // Emit log event
      this.emit('log', logEntry);

      // Update agent logs
      this.updateAgentLogs(agentId, logEntry);
    } catch (error) {
      console.error('Error logging message:', error);
    }
  }

  /**
   * Log to console
   */
  logToConsole(logEntry) {
    const timestamp = logEntry.timestamp.toISOString();
    const level = logEntry.level.padEnd(5);
    const agent = logEntry.agent.padEnd(12);
    const message = logEntry.message;

    const logLine = `[${timestamp}] ${level} [${agent}] ${message}`;

    switch (logEntry.level) {
      case 'ERROR':
        console.error(logLine);
        break;
      case 'WARN':
        console.warn(logLine);
        break;
      case 'DEBUG':
        if (this.logConfig.level === 'debug') {
          console.debug(logLine);
        }
        break;
      default:
        console.log(logLine);
    }
  }

  /**
   * Log to file
   */
  async logToFile(logEntry) {
    try {
      const logFile = path.join(this.logConfig.logDir, `${logEntry.agent}.log`);
      const logLine = JSON.stringify(logEntry) + '\n';

      await fs.appendFile(logFile, logLine);
    } catch (error) {
      console.error('Error writing to log file:', error);
    }
  }

  /**
   * Update agent logs
   */
  updateAgentLogs(agentId, logEntry) {
    if (!this.agentLogs.has(agentId)) {
      this.agentLogs.set(agentId, []);
    }

    const logs = this.agentLogs.get(agentId);
    logs.push(logEntry);

    // Keep only last 1000 entries per agent
    if (logs.length > 1000) {
      logs.splice(0, logs.length - 1000);
    }
  }

  /**
   * Generate log ID
   */
  generateLogId() {
    return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Update metric
   */
  updateMetric(name, value, labels = {}) {
    try {
      const metric = this.metrics.get(name);
      if (!metric) {
        console.warn(`Metric ${name} not found`);
        return;
      }

      const labelKey = JSON.stringify(labels);

      switch (metric.type) {
        case this.metricTypes.COUNTER:
          metric.value += value;
          break;
        case this.metricTypes.GAUGE:
          metric.value = value;
          break;
        case this.metricTypes.HISTOGRAM:
          if (!metric.values.has(labelKey)) {
            metric.values.set(labelKey, []);
          }
          metric.values.get(labelKey).push(value);
          break;
        case this.metricTypes.SUMMARY:
          if (!metric.values.has(labelKey)) {
            metric.values.set(labelKey, { sum: 0, count: 0 });
          }
          const summary = metric.values.get(labelKey);
          summary.sum += value;
          summary.count += 1;
          break;
      }

      metric.timestamps.set(labelKey, new Date());

      // Add to metrics buffer
      this.metricsBuffer.push({
        name,
        value,
        labels,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error('Error updating metric:', error);
    }
  }

  /**
   * Collect system metrics
   */
  collectSystemMetrics() {
    try {
      // System uptime
      this.updateMetric('system_uptime', process.uptime());

      // Memory usage
      const memUsage = process.memoryUsage();
      this.updateMetric('system_memory_usage', memUsage.heapUsed);

      // CPU usage (simplified)
      const cpuUsage = process.cpuUsage();
      this.updateMetric('system_cpu_usage', cpuUsage.user / 1000000);
    } catch (error) {
      console.error('Error collecting system metrics:', error);
    }
  }

  /**
   * Flush metrics buffer
   */
  flushMetricsBuffer() {
    try {
      if (this.metricsBuffer.length === 0) return;

      // Save metrics to file
      const metricsFile = path.join(this.logConfig.logDir, 'metrics.json');
      const metricsData = {
        timestamp: new Date(),
        metrics: this.metricsBuffer,
      };

      fs.appendFile(metricsFile, JSON.stringify(metricsData) + '\n');

      // Clear buffer
      this.metricsBuffer = [];
    } catch (error) {
      console.error('Error flushing metrics buffer:', error);
    }
  }

  /**
   * Rotate logs
   */
  async rotateLogs() {
    try {
      console.log('🔄 Rotating logs...');

      const files = await fs.readdir(this.logConfig.logDir);
      const logFiles = files.filter(file => file.endsWith('.log'));

      for (const file of logFiles) {
        const filePath = path.join(this.logConfig.logDir, file);
        const stats = await fs.stat(filePath);

        if (stats.size > this.logConfig.maxFileSize) {
          // Rotate file
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
          const rotatedFile = `${file}.${timestamp}`;
          const rotatedPath = path.join(this.logConfig.logDir, rotatedFile);

          await fs.rename(filePath, rotatedPath);
          console.log(`✅ Rotated log file: ${file} → ${rotatedFile}`);
        }
      }
    } catch (error) {
      console.error('Error rotating logs:', error);
    }
  }

  /**
   * Get agent logs
   */
  getAgentLogs(agentId, limit = 100) {
    const logs = this.agentLogs.get(agentId) || [];
    return logs.slice(-limit);
  }

  /**
   * Get metrics
   */
  getMetrics(name = null) {
    if (name) {
      return this.metrics.get(name);
    }
    return Object.fromEntries(this.metrics);
  }

  /**
   * Get Prometheus metrics format
   */
  getPrometheusMetrics() {
    const prometheusOutput = [];

    for (const [name, metric] of this.prometheusMetrics) {
      prometheusOutput.push(`# HELP ${metric.name} ${metric.help}`);
      prometheusOutput.push(`# TYPE ${metric.name} ${metric.type}`);

      if (metric.labels && Object.keys(metric.labels).length > 0) {
        const labelStr = Object.entries(metric.labels)
          .map(([key, value]) => `${key}="${value}"`)
          .join(',');
        prometheusOutput.push(`${metric.name}{${labelStr}} ${metric.value}`);
      } else {
        prometheusOutput.push(`${metric.name} ${metric.value}`);
      }
    }

    return prometheusOutput.join('\n');
  }

  /**
   * Generate metrics report
   */
  generateMetricsReport() {
    const report = {
      timestamp: new Date(),
      system: {
        uptime: this.metrics.get('system_uptime')?.value || 0,
        memoryUsage: this.metrics.get('system_memory_usage')?.value || 0,
        cpuUsage: this.metrics.get('system_cpu_usage')?.value || 0,
      },
      agents: {
        total: this.metrics.get('agent_total')?.value || 0,
        active: this.metrics.get('agent_active')?.value || 0,
        errors: this.metrics.get('agent_errors')?.value || 0,
        tasksCompleted: this.metrics.get('agent_tasks_completed')?.value || 0,
      },
      workflows: {
        total: this.metrics.get('workflow_total')?.value || 0,
        completed: this.metrics.get('workflow_completed')?.value || 0,
      },
      learning: {
        patternsDiscovered:
          this.metrics.get('learning_patterns_discovered')?.value || 0,
        accuracy: this.metrics.get('learning_accuracy')?.value || 0,
        improvements: this.metrics.get('learning_improvements')?.value || 0,
      },
    };

    return report;
  }

  /**
   * Export logs
   */
  async exportLogs(agentId = null, startDate = null, endDate = null) {
    try {
      let logs = [];

      if (agentId) {
        logs = this.getAgentLogs(agentId);
      } else {
        // Export all logs
        for (const [id, agentLogs] of this.agentLogs) {
          logs.push(...agentLogs);
        }
      }

      // Filter by date range
      if (startDate || endDate) {
        logs = logs.filter(log => {
          const logDate = new Date(log.timestamp);
          if (startDate && logDate < new Date(startDate)) return false;
          if (endDate && logDate > new Date(endDate)) return false;
          return true;
        });
      }

      // Export to file
      const exportFile = path.join(
        this.logConfig.logDir,
        `export_${Date.now()}.json`
      );
      await fs.writeFile(exportFile, JSON.stringify(logs, null, 2));

      console.log(`✅ Logs exported to: ${exportFile}`);
      return exportFile;
    } catch (error) {
      console.error('Error exporting logs:', error);
      throw error;
    }
  }

  /**
   * Shutdown logging system
   */
  async shutdown() {
    try {
      console.log('🔄 Shutting down Advanced Logging System...');

      this.isActive = false;

      // Flush remaining buffers
      await this.flushMetricsBuffer();

      // Export final logs
      await this.exportLogs();

      console.log('✅ Advanced Logging System shutdown completed');
    } catch (error) {
      console.error('Error shutting down logging system:', error);
    }
  }
}

module.exports = AdvancedLoggingSystem;
