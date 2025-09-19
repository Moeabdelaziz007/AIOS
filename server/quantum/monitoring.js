/**
 * 📊 Quantum Monitoring Module
 * 
 * Handles system monitoring, performance tracking, and health checks
 */

class QuantumMonitoring {
  constructor() {
    this.name = 'Quantum Monitoring';
    this.version = '1.0.0';
    this.isInitialized = false;
    
    // Monitoring data
    this.metrics = new Map();
    this.healthChecks = new Map();
    this.alerts = new Map();
    this.performanceData = new Map();
    
    // Monitoring configuration
    this.config = {
      metricsInterval: 30000, // 30 seconds
      healthCheckInterval: 60000, // 1 minute
      alertThresholds: {
        cpu: 80,
        memory: 85,
        responseTime: 5000,
        errorRate: 0.1
      }
    };
    
    console.log(`📊 ${this.name} v${this.version} initialized`);
  }

  /**
   * Initialize the Monitoring System
   */
  async initialize() {
    try {
      console.log('📊 Initializing Quantum Monitoring...');
      
      // Initialize metrics collection
      await this.initializeMetrics();
      
      // Setup health checks
      await this.setupHealthChecks();
      
      // Start monitoring loops
      this.startMonitoringLoops();
      
      this.isInitialized = true;
      console.log('✅ Quantum Monitoring initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Monitoring:', error.message);
      return false;
    }
  }

  /**
   * Execute task with monitoring
   */
  async executeWithMonitoring(task, analysis) {
    const startTime = Date.now();
    const taskId = task.id || this.generateTaskId();
    
    try {
      console.log(`📊 Monitoring task execution: ${taskId}`);
      
      // Record task start
      this.recordTaskStart(taskId, task, analysis);
      
      // Execute the task (simulated)
      const result = await this.executeTask(task, analysis);
      
      // Record task completion
      const duration = Date.now() - startTime;
      this.recordTaskCompletion(taskId, result, duration);
      
      // Check for performance issues
      await this.checkPerformanceIssues(taskId, result, duration);
      
      return {
        ...result,
        taskId,
        duration,
        monitoring: {
          startTime,
          endTime: Date.now(),
          metrics: this.getTaskMetrics(taskId)
        }
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      this.recordTaskError(taskId, error, duration);
      throw error;
    }
  }

  /**
   * Execute a task (simulated)
   */
  async executeTask(task, analysis) {
    // Simulate task execution based on analysis
    const estimatedDuration = analysis.timeline?.estimated || 30000;
    const successProbability = analysis.strategy?.successProbability || 0.8;
    
    // Simulate execution time
    await new Promise(resolve => setTimeout(resolve, Math.min(estimatedDuration, 5000)));
    
    // Simulate success/failure based on probability
    const success = Math.random() < successProbability;
    
    if (success) {
      return {
        success: true,
        result: `Task ${task.type} completed successfully`,
        data: {
          taskType: task.type,
          complexity: analysis.complexity,
          strategy: analysis.strategy?.name
        }
      };
    } else {
      throw new Error(`Task ${task.type} failed during execution`);
    }
  }

  /**
   * Record task start
   */
  recordTaskStart(taskId, task, analysis) {
    const metrics = {
      taskId,
      taskType: task.type,
      startTime: Date.now(),
      analysis: analysis,
      systemMetrics: this.getCurrentSystemMetrics()
    };
    
    this.metrics.set(taskId, metrics);
    console.log(`📊 Task ${taskId} started monitoring`);
  }

  /**
   * Record task completion
   */
  recordTaskCompletion(taskId, result, duration) {
    const metrics = this.metrics.get(taskId);
    if (metrics) {
      metrics.endTime = Date.now();
      metrics.duration = duration;
      metrics.result = result;
      metrics.success = result.success;
      metrics.systemMetricsEnd = this.getCurrentSystemMetrics();
      
      // Calculate performance metrics
      metrics.performance = this.calculatePerformanceMetrics(metrics);
      
      console.log(`📊 Task ${taskId} completed in ${duration}ms`);
    }
  }

  /**
   * Record task error
   */
  recordTaskError(taskId, error, duration) {
    const metrics = this.metrics.get(taskId);
    if (metrics) {
      metrics.endTime = Date.now();
      metrics.duration = duration;
      metrics.error = error.message;
      metrics.success = false;
      metrics.systemMetricsEnd = this.getCurrentSystemMetrics();
      
      // Record error metrics
      metrics.performance = this.calculatePerformanceMetrics(metrics);
      
      console.log(`📊 Task ${taskId} failed after ${duration}ms: ${error.message}`);
    }
  }

  /**
   * Calculate performance metrics
   */
  calculatePerformanceMetrics(metrics) {
    const startMetrics = metrics.systemMetrics;
    const endMetrics = metrics.systemMetricsEnd;
    
    return {
      cpuUsage: endMetrics.cpu - startMetrics.cpu,
      memoryUsage: endMetrics.memory - startMetrics.memory,
      memoryPeak: Math.max(startMetrics.memory, endMetrics.memory),
      duration: metrics.duration,
      efficiency: this.calculateEfficiency(metrics)
    };
  }

  /**
   * Calculate task efficiency
   */
  calculateEfficiency(metrics) {
    const { duration, analysis } = metrics;
    const estimatedDuration = analysis.timeline?.estimated || 30000;
    
    // Efficiency based on duration vs estimation
    const timeEfficiency = Math.max(0, 1 - Math.abs(duration - estimatedDuration) / estimatedDuration);
    
    // Efficiency based on resource usage
    const resourceEfficiency = 1 - (metrics.performance?.memoryUsage || 0) / 100;
    
    return (timeEfficiency + resourceEfficiency) / 2;
  }

  /**
   * Check for performance issues
   */
  async checkPerformanceIssues(taskId, result, duration) {
    const metrics = this.metrics.get(taskId);
    if (!metrics) return;
    
    const issues = [];
    
    // Check duration threshold
    if (duration > this.config.alertThresholds.responseTime) {
      issues.push({
        type: 'performance',
        severity: 'warning',
        message: `Task took ${duration}ms, exceeding threshold of ${this.config.alertThresholds.responseTime}ms`,
        taskId,
        metric: 'duration',
        value: duration,
        threshold: this.config.alertThresholds.responseTime
      });
    }
    
    // Check memory usage
    const memoryUsage = metrics.performance?.memoryPeak || 0;
    if (memoryUsage > this.config.alertThresholds.memory) {
      issues.push({
        type: 'resource',
        severity: 'warning',
        message: `High memory usage: ${memoryUsage}%`,
        taskId,
        metric: 'memory',
        value: memoryUsage,
        threshold: this.config.alertThresholds.memory
      });
    }
    
    // Check CPU usage
    const cpuUsage = metrics.performance?.cpuUsage || 0;
    if (cpuUsage > this.config.alertThresholds.cpu) {
      issues.push({
        type: 'resource',
        severity: 'warning',
        message: `High CPU usage: ${cpuUsage}%`,
        taskId,
        metric: 'cpu',
        value: cpuUsage,
        threshold: this.config.alertThresholds.cpu
      });
    }
    
    // Record issues
    if (issues.length > 0) {
      this.alerts.set(taskId, issues);
      console.log(`⚠️ Performance issues detected for task ${taskId}: ${issues.length} issues`);
    }
  }

  /**
   * Get current system metrics
   */
  getCurrentSystemMetrics() {
    const memUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();
    
    return {
      memory: (memUsage.heapUsed / memUsage.heapTotal) * 100,
      cpu: cpuUsage.user / 1000000,
      uptime: process.uptime(),
      timestamp: Date.now()
    };
  }

  /**
   * Get task metrics
   */
  getTaskMetrics(taskId) {
    return this.metrics.get(taskId) || null;
  }

  /**
   * Get system health
   */
  getSystemHealth() {
    const currentMetrics = this.getCurrentSystemMetrics();
    const recentTasks = this.getRecentTasks(10);
    
    const health = {
      status: 'healthy',
      timestamp: Date.now(),
      metrics: currentMetrics,
      tasks: {
        total: recentTasks.length,
        successful: recentTasks.filter(t => t.success).length,
        failed: recentTasks.filter(t => !t.success).length,
        avgDuration: this.calculateAverageDuration(recentTasks)
      },
      alerts: this.getActiveAlerts(),
      recommendations: this.generateHealthRecommendations(currentMetrics, recentTasks)
    };
    
    // Determine overall health status
    if (currentMetrics.memory > 90 || currentMetrics.cpu > 90) {
      health.status = 'critical';
    } else if (currentMetrics.memory > 80 || currentMetrics.cpu > 80) {
      health.status = 'warning';
    } else if (this.getActiveAlerts().length > 5) {
      health.status = 'warning';
    }
    
    return health;
  }

  /**
   * Get recent tasks
   */
  getRecentTasks(count = 10) {
    const tasks = Array.from(this.metrics.values())
      .filter(metrics => metrics.endTime)
      .sort((a, b) => b.endTime - a.endTime)
      .slice(0, count);
    
    return tasks.map(metrics => ({
      taskId: metrics.taskId,
      taskType: metrics.taskType,
      duration: metrics.duration,
      success: metrics.success,
      endTime: metrics.endTime
    }));
  }

  /**
   * Calculate average duration
   */
  calculateAverageDuration(tasks) {
    if (tasks.length === 0) return 0;
    
    const totalDuration = tasks.reduce((sum, task) => sum + task.duration, 0);
    return totalDuration / tasks.length;
  }

  /**
   * Get active alerts
   */
  getActiveAlerts() {
    const alerts = [];
    
    for (const [taskId, taskAlerts] of this.alerts) {
      alerts.push(...taskAlerts);
    }
    
    // Filter recent alerts (last hour)
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    return alerts.filter(alert => alert.timestamp > oneHourAgo);
  }

  /**
   * Generate health recommendations
   */
  generateHealthRecommendations(metrics, tasks) {
    const recommendations = [];
    
    if (metrics.memory > 80) {
      recommendations.push({
        type: 'memory',
        priority: 'high',
        message: 'High memory usage detected, consider optimizing memory usage'
      });
    }
    
    if (metrics.cpu > 80) {
      recommendations.push({
        type: 'cpu',
        priority: 'high',
        message: 'High CPU usage detected, consider optimizing CPU-intensive operations'
      });
    }
    
    const failedTasks = tasks.filter(t => !t.success).length;
    if (failedTasks > tasks.length * 0.2) {
      recommendations.push({
        type: 'reliability',
        priority: 'medium',
        message: 'High failure rate detected, investigate common failure patterns'
      });
    }
    
    const avgDuration = this.calculateAverageDuration(tasks);
    if (avgDuration > 30000) {
      recommendations.push({
        type: 'performance',
        priority: 'medium',
        message: 'Slow task execution detected, consider performance optimization'
      });
    }
    
    return recommendations;
  }

  /**
   * Initialize metrics collection
   */
  async initializeMetrics() {
    console.log('📊 Initializing metrics collection...');
    
    // Initialize system metrics
    this.metrics.set('system', {
      startTime: Date.now(),
      metrics: this.getCurrentSystemMetrics()
    });
  }

  /**
   * Setup health checks
   */
  async setupHealthChecks() {
    console.log('📊 Setting up health checks...');
    
    const healthChecks = {
      'memory': {
        name: 'Memory Usage Check',
        threshold: this.config.alertThresholds.memory,
        check: () => this.getCurrentSystemMetrics().memory
      },
      'cpu': {
        name: 'CPU Usage Check',
        threshold: this.config.alertThresholds.cpu,
        check: () => this.getCurrentSystemMetrics().cpu
      },
      'response_time': {
        name: 'Response Time Check',
        threshold: this.config.alertThresholds.responseTime,
        check: () => this.calculateAverageDuration(this.getRecentTasks(5))
      }
    };
    
    for (const [key, check] of Object.entries(healthChecks)) {
      this.healthChecks.set(key, check);
    }
  }

  /**
   * Start monitoring loops
   */
  startMonitoringLoops() {
    console.log('📊 Starting monitoring loops...');
    
    // Metrics collection loop
    setInterval(() => {
      this.collectMetrics();
    }, this.config.metricsInterval);
    
    // Health check loop
    setInterval(() => {
      this.runHealthChecks();
    }, this.config.healthCheckInterval);
    
    // Performance analysis loop
    setInterval(() => {
      this.analyzePerformance();
    }, this.config.metricsInterval * 2);
  }

  /**
   * Collect system metrics
   */
  collectMetrics() {
    try {
      const metrics = this.getCurrentSystemMetrics();
      this.performanceData.set(Date.now(), metrics);
      
      // Keep only last 1000 data points
      if (this.performanceData.size > 1000) {
        const oldestKey = Math.min(...this.performanceData.keys());
        this.performanceData.delete(oldestKey);
      }
    } catch (error) {
      console.error('❌ Error collecting metrics:', error.message);
    }
  }

  /**
   * Run health checks
   */
  runHealthChecks() {
    try {
      for (const [key, check] of this.healthChecks) {
        const value = check.check();
        if (value > check.threshold) {
          console.warn(`⚠️ Health check failed: ${check.name} - ${value} > ${check.threshold}`);
        }
      }
    } catch (error) {
      console.error('❌ Error running health checks:', error.message);
    }
  }

  /**
   * Analyze performance trends
   */
  analyzePerformance() {
    try {
      const recentData = Array.from(this.performanceData.entries())
        .slice(-10)
        .map(([timestamp, metrics]) => metrics);
      
      if (recentData.length < 5) return;
      
      // Calculate trends
      const memoryTrend = this.calculateTrend(recentData.map(d => d.memory));
      const cpuTrend = this.calculateTrend(recentData.map(d => d.cpu));
      
      if (memoryTrend > 0.1) {
        console.warn('⚠️ Memory usage trending upward');
      }
      
      if (cpuTrend > 0.1) {
        console.warn('⚠️ CPU usage trending upward');
      }
    } catch (error) {
      console.error('❌ Error analyzing performance:', error.message);
    }
  }

  /**
   * Calculate trend from data points
   */
  calculateTrend(values) {
    if (values.length < 2) return 0;
    
    let trend = 0;
    for (let i = 1; i < values.length; i++) {
      trend += values[i] - values[i - 1];
    }
    
    return trend / (values.length - 1);
  }

  /**
   * Generate task ID
   */
  generateTaskId() {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get monitoring statistics
   */
  getStatistics() {
    const tasks = Array.from(this.metrics.values()).filter(m => m.endTime);
    const alerts = this.getActiveAlerts();
    
    return {
      totalTasks: tasks.length,
      successfulTasks: tasks.filter(t => t.success).length,
      failedTasks: tasks.filter(t => !t.success).length,
      avgDuration: this.calculateAverageDuration(tasks),
      activeAlerts: alerts.length,
      systemHealth: this.getSystemHealth().status,
      uptime: process.uptime()
    };
  }

  /**
   * Shutdown the Monitoring System
   */
  async shutdown() {
    try {
      this.isInitialized = false;
      console.log('✅ Quantum Monitoring shutdown completed');
    } catch (error) {
      console.error('❌ Error shutting down Monitoring:', error.message);
    }
  }
}

module.exports = QuantumMonitoring;
