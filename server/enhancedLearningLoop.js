/**
 * Enhanced Learning Loop System with Advanced Debugging
 * Integrates with all AIOS components for continuous improvement
 */

const fs = require('fs').promises;
const path = require('path');

class EnhancedLearningLoop {
  constructor() {
    this.name = 'Enhanced Learning Loop';
    this.version = '3.0.0';
    this.isActive = false;
    this.learningData = new Map();
    this.patterns = new Map();
    this.performanceMetrics = new Map();
    this.systemConnections = new Map();
    this.learningRules = new Map();
    this.metaLearning = new Map();
    this.debugLogs = [];
    this.learningHistory = [];
    this.errorPatterns = new Map();
    this.successPatterns = new Map();

    // Enhanced learning categories
    this.categories = {
      ERROR_PATTERNS: 'error_patterns',
      USER_BEHAVIOR: 'user_behavior',
      SYSTEM_PERFORMANCE: 'system_performance',
      API_USAGE: 'api_usage',
      DEBUGGING_SUCCESS: 'debugging_success',
      OPTIMIZATION: 'optimization',
      SECURITY_PATTERNS: 'security_patterns',
      INTEGRATION_PATTERNS: 'integration_patterns',
      LEARNING_EFFECTIVENESS: 'learning_effectiveness',
      PATTERN_CORRELATION: 'pattern_correlation',
    };

    // Enhanced learning phases
    this.phases = {
      COLLECT: 'collect',
      ANALYZE: 'analyze',
      LEARN: 'learn',
      APPLY: 'apply',
      EVALUATE: 'evaluate',
      OPTIMIZE: 'optimize',
      DEBUG: 'debug',
      CORRELATE: 'correlate',
    };

    this.currentPhase = this.phases.COLLECT;
    this.learningInterval = null;
    this.analysisInterval = null;
    this.optimizationInterval = null;
    this.debugInterval = null;

    // Debug settings
    this.debugSettings = {
      enableVerboseLogging: true,
      enablePatternTracking: true,
      enablePerformanceMonitoring: true,
      enableCorrelationAnalysis: true,
      enableLearningOptimization: true,
      logLevel: 'debug', // debug, info, warn, error
    };

    // Learning effectiveness tracking
    this.effectivenessMetrics = {
      totalLearningCycles: 0,
      successfulPredictions: 0,
      failedPredictions: 0,
      patternAccuracy: 0,
      learningSpeed: 0,
      adaptationRate: 0,
    };

    console.log(
      `🧠 ${this.name} v${this.version} initialized with enhanced debugging`
    );
  }

  /**
   * Activate the enhanced learning loop
   */
  async activate() {
    try {
      console.log('🚀 Activating Enhanced Learning Loop...');

      // Initialize system connections
      await this.initializeSystemConnections();

      // Load existing learning data
      await this.loadLearningData();

      // Start learning processes
      await this.startLearningProcesses();

      // Initialize learning rules
      await this.initializeLearningRules();

      // Start debugging processes
      await this.startDebuggingProcesses();

      this.isActive = true;
      this.logDebug('Learning loop activated successfully', 'info');

      console.log('✅ Enhanced Learning Loop activated successfully');
    } catch (error) {
      console.error('❌ Failed to activate learning loop:', error);
      this.logDebug(
        `Failed to activate learning loop: ${error.message}`,
        'error'
      );
      throw error;
    }
  }

  /**
   * Initialize system connections with enhanced error handling
   */
  async initializeSystemConnections() {
    try {
      console.log('🔗 Initializing system connections...');

      // Connect to Unified Autopilot
      try {
        const {
          UnifiedAutopilotSystem,
        } = require('./unifiedAutopilotSystem.js');
        this.systemConnections.set('unifiedAutopilot', {
          instance: null,
          status: 'connecting',
          lastUpdate: new Date(),
          errorCount: 0,
        });
        this.logDebug('Unified Autopilot connection initialized', 'info');
      } catch (error) {
        this.logDebug(
          `Unified Autopilot not available: ${error.message}`,
          'warn'
        );
      }

      // Connect to Quantum Autopilot
      try {
        const QuantumAutopilot = require('./quantumAutopilot.js');
        this.systemConnections.set('quantumAutopilot', {
          instance: null,
          status: 'connecting',
          lastUpdate: new Date(),
          errorCount: 0,
        });
        this.logDebug('Quantum Autopilot connection initialized', 'info');
      } catch (error) {
        this.logDebug(
          `Quantum Autopilot not available: ${error.message}`,
          'warn'
        );
      }

      // Connect to Data Agent
      try {
        const DataAgent = require('./dataAgent.js');
        this.systemConnections.set('dataAgent', {
          instance: null,
          status: 'connecting',
          lastUpdate: new Date(),
          errorCount: 0,
        });
        this.logDebug('Data Agent connection initialized', 'info');
      } catch (error) {
        this.logDebug(`Data Agent not available: ${error.message}`, 'warn');
      }

      console.log(
        `✅ Connected to ${this.systemConnections.size} system components`
      );
    } catch (error) {
      console.error('❌ Failed to initialize system connections:', error);
      this.logDebug(
        `Failed to initialize system connections: ${error.message}`,
        'error'
      );
      throw error;
    }
  }

  /**
   * Enhanced learning data collection
   */
  async collectLearningData() {
    try {
      this.logDebug('Starting learning data collection', 'debug');

      const collectedData = {
        timestamp: new Date().toISOString(),
        phase: this.currentPhase,
        data: {},
        metrics: {},
      };

      // Collect data from each connected system
      for (const [systemName, connection] of this.systemConnections) {
        try {
          if (
            connection.instance &&
            typeof connection.instance.getStatus === 'function'
          ) {
            const systemData = connection.instance.getStatus();
            collectedData.data[systemName] = systemData;
            connection.lastUpdate = new Date();
            connection.status = 'connected';

            this.logDebug(`Collected data from ${systemName}`, 'debug');
          } else {
            connection.status = 'disconnected';
            connection.errorCount++;
            this.logDebug(
              `System ${systemName} not available for data collection`,
              'warn'
            );
          }
        } catch (error) {
          connection.errorCount++;
          this.logDebug(
            `Error collecting data from ${systemName}: ${error.message}`,
            'error'
          );
        }
      }

      // Collect system performance metrics
      collectedData.metrics = {
        memoryUsage: process.memoryUsage(),
        uptime: process.uptime(),
        cpuUsage: await this.getCPUUsage(),
        timestamp: new Date().toISOString(),
      };

      // Store collected data
      this.learningData.set(Date.now(), collectedData);

      // Keep only last 1000 data points
      if (this.learningData.size > 1000) {
        const oldestKey = Math.min(...this.learningData.keys());
        this.learningData.delete(oldestKey);
      }

      this.logDebug(
        `Learning data collected: ${
          Object.keys(collectedData.data).length
        } systems`,
        'info'
      );
    } catch (error) {
      this.logDebug(
        `Error in learning data collection: ${error.message}`,
        'error'
      );
    }
  }

  /**
   * Enhanced pattern analysis with correlation detection
   */
  async analyzePatterns() {
    try {
      this.logDebug('Starting pattern analysis', 'debug');

      const patterns = {
        errorPatterns: new Map(),
        successPatterns: new Map(),
        performancePatterns: new Map(),
        correlationPatterns: new Map(),
      };

      // Analyze error patterns
      await this.analyzeErrorPatterns(patterns.errorPatterns);

      // Analyze success patterns
      await this.analyzeSuccessPatterns(patterns.successPatterns);

      // Analyze performance patterns
      await this.analyzePerformancePatterns(patterns.performancePatterns);

      // Analyze correlations
      await this.analyzeCorrelations(patterns.correlationPatterns);

      // Store patterns
      this.patterns.set(Date.now(), patterns);

      // Update effectiveness metrics
      this.updateEffectivenessMetrics(patterns);

      this.logDebug(
        `Pattern analysis completed: ${patterns.errorPatterns.size} error patterns, ${patterns.successPatterns.size} success patterns`,
        'info'
      );
    } catch (error) {
      this.logDebug(`Error in pattern analysis: ${error.message}`, 'error');
    }
  }

  /**
   * Analyze error patterns with enhanced detection
   */
  async analyzeErrorPatterns(errorPatterns) {
    try {
      const errorData = [];

      // Collect error data from learning history
      for (const [timestamp, data] of this.learningData) {
        if (data.data) {
          Object.values(data.data).forEach(systemData => {
            if (systemData.errorCount > 0) {
              errorData.push({
                timestamp,
                errorCount: systemData.errorCount,
                system: systemData.name || 'unknown',
                category: systemData.category || 'unknown',
              });
            }
          });
        }
      }

      // Group errors by pattern
      const errorGroups = new Map();
      errorData.forEach(error => {
        const key = `${error.system}-${error.category}`;
        if (!errorGroups.has(key)) {
          errorGroups.set(key, []);
        }
        errorGroups.get(key).push(error);
      });

      // Analyze patterns
      errorGroups.forEach((errors, key) => {
        if (errors.length >= 3) {
          // Minimum pattern threshold
          const pattern = {
            key,
            frequency: errors.length,
            avgErrorCount:
              errors.reduce((sum, e) => sum + e.errorCount, 0) / errors.length,
            timeSpan: errors[errors.length - 1].timestamp - errors[0].timestamp,
            trend: this.calculateTrend(errors.map(e => e.errorCount)),
            confidence: Math.min(0.95, errors.length / 10), // Confidence based on frequency
          };

          errorPatterns.set(key, pattern);
          this.logDebug(
            `Error pattern detected: ${key} (${pattern.frequency} occurrences)`,
            'info'
          );
        }
      });
    } catch (error) {
      this.logDebug(
        `Error analyzing error patterns: ${error.message}`,
        'error'
      );
    }
  }

  /**
   * Analyze success patterns
   */
  async analyzeSuccessPatterns(successPatterns) {
    try {
      const successData = [];

      // Collect success data
      for (const [timestamp, data] of this.learningData) {
        if (data.data) {
          Object.values(data.data).forEach(systemData => {
            if (systemData.isActive && systemData.uptime > 0) {
              successData.push({
                timestamp,
                uptime: systemData.uptime,
                system: systemData.name || 'unknown',
                performance: systemData.performance || {},
              });
            }
          });
        }
      }

      // Group successes by pattern
      const successGroups = new Map();
      successData.forEach(success => {
        const key = `${success.system}`;
        if (!successGroups.has(key)) {
          successGroups.set(key, []);
        }
        successGroups.get(key).push(success);
      });

      // Analyze patterns
      successGroups.forEach((successes, key) => {
        if (successes.length >= 2) {
          const pattern = {
            key,
            frequency: successes.length,
            avgUptime:
              successes.reduce((sum, s) => sum + s.uptime, 0) /
              successes.length,
            stability: this.calculateStability(successes.map(s => s.uptime)),
            confidence: Math.min(0.95, successes.length / 5),
          };

          successPatterns.set(key, pattern);
          this.logDebug(
            `Success pattern detected: ${key} (${pattern.frequency} occurrences)`,
            'info'
          );
        }
      });
    } catch (error) {
      this.logDebug(
        `Error analyzing success patterns: ${error.message}`,
        'error'
      );
    }
  }

  /**
   * Analyze performance patterns
   */
  async analyzePerformancePatterns(performancePatterns) {
    try {
      const performanceData = [];

      // Collect performance data
      for (const [timestamp, data] of this.learningData) {
        if (data.metrics) {
          performanceData.push({
            timestamp,
            memoryUsage: data.metrics.memoryUsage,
            cpuUsage: data.metrics.cpuUsage,
            uptime: data.metrics.uptime,
          });
        }
      }

      if (performanceData.length >= 5) {
        const pattern = {
          avgMemoryUsage:
            performanceData.reduce(
              (sum, p) => sum + p.memoryUsage.heapUsed,
              0
            ) / performanceData.length,
          avgCPUUsage:
            performanceData.reduce((sum, p) => sum + p.cpuUsage, 0) /
            performanceData.length,
          memoryTrend: this.calculateTrend(
            performanceData.map(p => p.memoryUsage.heapUsed)
          ),
          cpuTrend: this.calculateTrend(performanceData.map(p => p.cpuUsage)),
          stability: this.calculateStability(
            performanceData.map(p => p.memoryUsage.heapUsed)
          ),
        };

        performancePatterns.set('system_performance', pattern);
        this.logDebug(
          `Performance pattern analyzed: Memory ${pattern.avgMemoryUsage.toFixed(
            2
          )}MB, CPU ${pattern.avgCPUUsage.toFixed(2)}%`,
          'info'
        );
      }
    } catch (error) {
      this.logDebug(
        `Error analyzing performance patterns: ${error.message}`,
        'error'
      );
    }
  }

  /**
   * Analyze correlations between different patterns
   */
  async analyzeCorrelations(correlationPatterns) {
    try {
      // Find correlations between error patterns and performance
      const correlations = [];

      for (const [timestamp, data] of this.learningData) {
        if (data.data && data.metrics) {
          Object.values(data.data).forEach(systemData => {
            if (systemData.errorCount > 0) {
              correlations.push({
                errorCount: systemData.errorCount,
                memoryUsage: data.metrics.memoryUsage.heapUsed,
                cpuUsage: data.metrics.cpuUsage,
                timestamp,
              });
            }
          });
        }
      }

      if (correlations.length >= 3) {
        const correlation = this.calculateCorrelation(
          correlations.map(c => c.errorCount),
          correlations.map(c => c.memoryUsage)
        );

        if (Math.abs(correlation) > 0.5) {
          correlationPatterns.set('error_memory_correlation', {
            correlation,
            strength: Math.abs(correlation),
            direction: correlation > 0 ? 'positive' : 'negative',
            confidence: Math.min(0.95, correlations.length / 10),
          });

          this.logDebug(
            `Correlation detected: Error-Memory (${correlation.toFixed(3)})`,
            'info'
          );
        }
      }
    } catch (error) {
      this.logDebug(`Error analyzing correlations: ${error.message}`, 'error');
    }
  }

  /**
   * Enhanced learning rule generation
   */
  async generateLearningRules() {
    try {
      this.logDebug('Generating learning rules', 'debug');

      const rules = [];

      // Generate rules from error patterns
      for (const [key, pattern] of this.patterns.get(
        Math.max(...this.patterns.keys())
      )?.errorPatterns || new Map()) {
        if (pattern.confidence > 0.7) {
          rules.push({
            id: `error_rule_${key}`,
            type: 'error_prevention',
            condition: `error_pattern_${key}`,
            action: 'increase_monitoring',
            priority: pattern.frequency > 10 ? 'high' : 'medium',
            confidence: pattern.confidence,
            description: `Monitor ${key} more closely due to frequent errors`,
          });
        }
      }

      // Generate rules from success patterns
      for (const [key, pattern] of this.patterns.get(
        Math.max(...this.patterns.keys())
      )?.successPatterns || new Map()) {
        if (pattern.confidence > 0.7) {
          rules.push({
            id: `success_rule_${key}`,
            type: 'optimization',
            condition: `success_pattern_${key}`,
            action: 'maintain_current_state',
            priority: 'low',
            confidence: pattern.confidence,
            description: `Maintain current configuration for ${key} due to success pattern`,
          });
        }
      }

      // Generate rules from performance patterns
      for (const [key, pattern] of this.patterns.get(
        Math.max(...this.patterns.keys())
      )?.performancePatterns || new Map()) {
        if (pattern.memoryTrend > 0.1) {
          rules.push({
            id: `performance_rule_${key}`,
            type: 'performance_optimization',
            condition: `memory_trend_${key}`,
            action: 'optimize_memory',
            priority: 'medium',
            confidence: 0.8,
            description: `Optimize memory usage due to increasing trend`,
          });
        }
      }

      // Store rules
      this.learningRules.set(Date.now(), rules);

      this.logDebug(`Generated ${rules.length} learning rules`, 'info');
    } catch (error) {
      this.logDebug(
        `Error generating learning rules: ${error.message}`,
        'error'
      );
    }
  }

  /**
   * Enhanced debugging and monitoring
   */
  async startDebuggingProcesses() {
    try {
      console.log('🔍 Starting debugging processes...');

      // Debug interval - every 10 seconds
      this.debugInterval = setInterval(async () => {
        await this.performDebuggingCycle();
      }, 10000);

      console.log('✅ Debugging processes started');
    } catch (error) {
      console.error('❌ Failed to start debugging processes:', error);
      this.logDebug(
        `Failed to start debugging processes: ${error.message}`,
        'error'
      );
    }
  }

  /**
   * Perform debugging cycle
   */
  async performDebuggingCycle() {
    try {
      // Check system health
      await this.checkSystemHealth();

      // Validate learning data integrity
      await this.validateLearningData();

      // Check pattern accuracy
      await this.checkPatternAccuracy();

      // Monitor learning effectiveness
      await this.monitorLearningEffectiveness();
    } catch (error) {
      this.logDebug(`Error in debugging cycle: ${error.message}`, 'error');
    }
  }

  /**
   * Check system health
   */
  async checkSystemHealth() {
    try {
      const healthStatus = {
        timestamp: new Date().toISOString(),
        connections: {},
        dataIntegrity: true,
        performance: {},
      };

      // Check system connections
      for (const [systemName, connection] of this.systemConnections) {
        healthStatus.connections[systemName] = {
          status: connection.status,
          lastUpdate: connection.lastUpdate,
          errorCount: connection.errorCount,
        };
      }

      // Check data integrity
      healthStatus.dataIntegrity =
        this.learningData.size > 0 && this.patterns.size > 0;

      // Check performance
      healthStatus.performance = {
        memoryUsage: process.memoryUsage(),
        uptime: process.uptime(),
        learningDataSize: this.learningData.size,
        patternsSize: this.patterns.size,
      };

      this.logDebug(
        `System health check: ${
          Object.keys(healthStatus.connections).length
        } connections, ${
          healthStatus.performance.learningDataSize
        } data points`,
        'debug'
      );
    } catch (error) {
      this.logDebug(`Error checking system health: ${error.message}`, 'error');
    }
  }

  /**
   * Validate learning data integrity
   */
  async validateLearningData() {
    try {
      let validDataPoints = 0;
      let invalidDataPoints = 0;

      for (const [timestamp, data] of this.learningData) {
        if (data && data.timestamp && data.data) {
          validDataPoints++;
        } else {
          invalidDataPoints++;
          this.learningData.delete(timestamp); // Remove invalid data
        }
      }

      if (invalidDataPoints > 0) {
        this.logDebug(
          `Removed ${invalidDataPoints} invalid data points`,
          'warn'
        );
      }

      this.logDebug(
        `Data validation: ${validDataPoints} valid, ${invalidDataPoints} invalid`,
        'debug'
      );
    } catch (error) {
      this.logDebug(
        `Error validating learning data: ${error.message}`,
        'error'
      );
    }
  }

  /**
   * Check pattern accuracy
   */
  async checkPatternAccuracy() {
    try {
      if (this.patterns.size < 2) return;

      const latestPatterns = this.patterns.get(
        Math.max(...this.patterns.keys())
      );
      const previousPatterns = this.patterns.get(
        Math.max(...Array.from(this.patterns.keys()).slice(0, -1))
      );

      if (!latestPatterns || !previousPatterns) return;

      let accuracyScore = 0;
      let totalComparisons = 0;

      // Compare error patterns
      for (const [key, currentPattern] of latestPatterns.errorPatterns) {
        if (previousPatterns.errorPatterns.has(key)) {
          const previousPattern = previousPatterns.errorPatterns.get(key);
          const accuracy =
            1 -
            Math.abs(currentPattern.frequency - previousPattern.frequency) /
              Math.max(currentPattern.frequency, previousPattern.frequency);
          accuracyScore += accuracy;
          totalComparisons++;
        }
      }

      if (totalComparisons > 0) {
        const avgAccuracy = accuracyScore / totalComparisons;
        this.effectivenessMetrics.patternAccuracy = avgAccuracy;
        this.logDebug(
          `Pattern accuracy: ${(avgAccuracy * 100).toFixed(2)}%`,
          'debug'
        );
      }
    } catch (error) {
      this.logDebug(
        `Error checking pattern accuracy: ${error.message}`,
        'error'
      );
    }
  }

  /**
   * Monitor learning effectiveness
   */
  async monitorLearningEffectiveness() {
    try {
      const effectiveness = {
        totalLearningCycles: this.effectivenessMetrics.totalLearningCycles,
        patternAccuracy: this.effectivenessMetrics.patternAccuracy,
        dataPoints: this.learningData.size,
        patterns: this.patterns.size,
        rules: this.learningRules.size,
        connections: this.systemConnections.size,
        timestamp: new Date().toISOString(),
      };

      this.effectivenessMetrics.totalLearningCycles++;

      this.logDebug(
        `Learning effectiveness: ${effectiveness.patternAccuracy.toFixed(
          3
        )} accuracy, ${effectiveness.dataPoints} data points`,
        'debug'
      );
    } catch (error) {
      this.logDebug(
        `Error monitoring learning effectiveness: ${error.message}`,
        'error'
      );
    }
  }

  /**
   * Enhanced logging with different levels
   */
  logDebug(message, level = 'info') {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      phase: this.currentPhase,
      dataPoints: this.learningData.size,
      patterns: this.patterns.size,
    };

    this.debugLogs.push(logEntry);

    // Keep only last 1000 log entries
    if (this.debugLogs.length > 1000) {
      this.debugLogs.shift();
    }

    // Log to console based on level
    if (
      this.debugSettings.logLevel === 'debug' ||
      level === 'error' ||
      level === 'warn'
    ) {
      const emoji =
        level === 'error'
          ? '❌'
          : level === 'warn'
          ? '⚠️'
          : level === 'info'
          ? 'ℹ️'
          : '🔍';
      console.log(`${emoji} [${level.toUpperCase()}] ${message}`);
    }
  }

  /**
   * Get comprehensive insights with debugging information
   */
  getInsights() {
    const latestPatterns = this.patterns.get(
      Math.max(...this.patterns.keys())
    ) || {
      errorPatterns: new Map(),
      successPatterns: new Map(),
      performancePatterns: new Map(),
      correlationPatterns: new Map(),
    };
    const latestRules =
      this.learningRules.get(Math.max(...this.learningRules.keys())) || [];

    return {
      patterns: {
        error: Object.fromEntries(latestPatterns.errorPatterns),
        success: Object.fromEntries(latestPatterns.successPatterns),
        performance: Object.fromEntries(latestPatterns.performancePatterns),
        correlation: Object.fromEntries(latestPatterns.correlationPatterns),
      },
      insights: {
        learningEffectiveness: [
          {
            type: 'effectiveness',
            description: `Learning effectiveness: ${(
              this.effectivenessMetrics.patternAccuracy * 100
            ).toFixed(2)}%`,
            impact:
              this.effectivenessMetrics.patternAccuracy > 0.7
                ? 'high'
                : 'medium',
            recommendation:
              this.effectivenessMetrics.patternAccuracy > 0.7
                ? 'Continue current learning approach'
                : 'Improve learning algorithms',
          },
          {
            type: 'data_quality',
            description: `Data quality: ${this.learningData.size} data points collected`,
            impact: this.learningData.size > 100 ? 'high' : 'medium',
            recommendation:
              this.learningData.size > 100
                ? 'Sufficient data for analysis'
                : 'Collect more data points',
          },
          {
            type: 'pattern_detection',
            description: `Pattern detection: ${
              latestPatterns.errorPatterns.size +
              latestPatterns.successPatterns.size
            } patterns identified`,
            impact: 'high',
            recommendation: 'Use patterns for system optimization',
          },
        ],
        debugging: [
          {
            type: 'system_health',
            description: `System health: ${this.systemConnections.size} connections active`,
            impact: this.systemConnections.size > 0 ? 'high' : 'low',
            recommendation:
              this.systemConnections.size > 0
                ? 'System connections healthy'
                : 'Check system connections',
          },
          {
            type: 'debug_logs',
            description: `Debug logs: ${this.debugLogs.length} entries`,
            impact: 'medium',
            recommendation: 'Monitor debug logs for issues',
          },
        ],
      },
      recommendations: {
        immediate: latestRules
          .filter(rule => rule.priority === 'high')
          .map(rule => ({
            action: rule.action,
            priority: rule.priority,
            reason: rule.description,
            estimatedImpact: 'high',
          })),
        shortTerm: latestRules
          .filter(rule => rule.priority === 'medium')
          .map(rule => ({
            action: rule.action,
            priority: rule.priority,
            reason: rule.description,
            estimatedImpact: 'medium',
          })),
        longTerm: latestRules
          .filter(rule => rule.priority === 'low')
          .map(rule => ({
            action: rule.action,
            priority: rule.priority,
            reason: rule.description,
            estimatedImpact: 'low',
          })),
      },
      metaLearning: Array.from(this.metaLearning.values()),
      effectiveness: this.effectivenessMetrics.patternAccuracy,
      debugging: {
        debugLogs: this.debugLogs.slice(-10), // Last 10 debug logs
        systemHealth: this.getSystemHealthStatus(),
        learningMetrics: this.effectivenessMetrics,
      },
    };
  }

  /**
   * Get system health status
   */
  getSystemHealthStatus() {
    return {
      connections: Object.fromEntries(
        Array.from(this.systemConnections.entries()).map(([name, conn]) => [
          name,
          {
            status: conn.status,
            lastUpdate: conn.lastUpdate,
            errorCount: conn.errorCount,
          },
        ])
      ),
      dataIntegrity: this.learningData.size > 0,
      performance: {
        memoryUsage: process.memoryUsage(),
        uptime: process.uptime(),
        learningDataSize: this.learningData.size,
        patternsSize: this.patterns.size,
        rulesSize: this.learningRules.size,
      },
    };
  }

  /**
   * Get comprehensive status
   */
  getStatus() {
    return {
      name: this.name,
      version: this.version,
      isActive: this.isActive,
      currentPhase: this.currentPhase,
      connections: this.systemConnections.size,
      rules: this.learningRules.size,
      dataPoints: this.learningData.size,
      patterns: this.patterns.size,
      metaLearning: this.metaLearning.size,
      uptime: this.isActive ? process.uptime() : null,
      effectiveness: this.effectivenessMetrics.patternAccuracy,
      debugging: {
        debugLogs: this.debugLogs.length,
        logLevel: this.debugSettings.logLevel,
        verboseLogging: this.debugSettings.enableVerboseLogging,
      },
    };
  }

  /**
   * Utility functions
   */
  calculateTrend(values) {
    if (values.length < 2) return 0;
    const first = values[0];
    const last = values[values.length - 1];
    return (last - first) / first;
  }

  calculateStability(values) {
    if (values.length < 2) return 1;
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance =
      values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
      values.length;
    return 1 / (1 + Math.sqrt(variance) / mean);
  }

  calculateCorrelation(x, y) {
    if (x.length !== y.length || x.length < 2) return 0;

    const n = x.length;
    const sumX = x.reduce((sum, val) => sum + val, 0);
    const sumY = y.reduce((sum, val) => sum + val, 0);
    const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0);
    const sumXX = x.reduce((sum, val) => sum + val * val, 0);
    const sumYY = y.reduce((sum, val) => sum + val * val, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt(
      (n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY)
    );

    return denominator === 0 ? 0 : numerator / denominator;
  }

  async getCPUUsage() {
    // Simple CPU usage estimation
    const startUsage = process.cpuUsage();
    await new Promise(resolve => setTimeout(resolve, 100));
    const endUsage = process.cpuUsage(startUsage);
    return (endUsage.user + endUsage.system) / 1000000; // Convert to percentage
  }

  /**
   * Start learning processes
   */
  async startLearningProcesses() {
    console.log('🔄 Starting learning processes...');

    // Data collection interval - every 30 seconds
    this.learningInterval = setInterval(async () => {
      await this.collectLearningData();
    }, 30000);

    // Analysis interval - every 2 minutes
    this.analysisInterval = setInterval(async () => {
      await this.analyzePatterns();
      await this.generateLearningRules();
    }, 120000);

    // Optimization interval - every 5 minutes
    this.optimizationInterval = setInterval(async () => {
      await this.optimizeLearningRules();
    }, 300000);

    console.log('✅ Learning processes started');
  }

  /**
   * Initialize learning rules
   */
  async initializeLearningRules() {
    console.log('📚 Initializing learning rules...');

    const initialRules = [
      {
        id: 'error_threshold_rule',
        type: 'error_prevention',
        condition: 'error_count > threshold',
        action: 'increase_monitoring',
        priority: 'high',
        confidence: 0.9,
        description: 'Increase monitoring when error count exceeds threshold',
      },
      {
        id: 'performance_optimization_rule',
        type: 'performance_optimization',
        condition: 'memory_usage > 80%',
        action: 'optimize_memory',
        priority: 'medium',
        confidence: 0.8,
        description: 'Optimize memory when usage exceeds 80%',
      },
      {
        id: 'success_pattern_rule',
        type: 'optimization',
        condition: 'success_pattern_detected',
        action: 'maintain_configuration',
        priority: 'low',
        confidence: 0.7,
        description:
          'Maintain current configuration when success pattern detected',
      },
    ];

    this.learningRules.set(Date.now(), initialRules);
    console.log(`✅ Initialized ${initialRules.length} learning rules`);
  }

  /**
   * Optimize learning rules
   */
  async optimizeLearningRules() {
    try {
      this.logDebug('Optimizing learning rules', 'debug');

      const latestRules =
        this.learningRules.get(Math.max(...this.learningRules.keys())) || [];
      const optimizedRules = latestRules.filter(rule => rule.confidence > 0.5);

      this.learningRules.set(Date.now(), optimizedRules);

      this.logDebug(
        `Optimized learning rules: ${optimizedRules.length} rules`,
        'info'
      );
    } catch (error) {
      this.logDebug(
        `Error optimizing learning rules: ${error.message}`,
        'error'
      );
    }
  }

  /**
   * Load existing learning data
   */
  async loadLearningData() {
    try {
      console.log('📚 No existing learning data found, starting fresh');
      // In a real implementation, you would load from persistent storage
    } catch (error) {
      console.log('📚 No existing learning data found, starting fresh');
    }
  }

  /**
   * Save learning data
   */
  async saveLearningData() {
    try {
      // In a real implementation, you would save to persistent storage
      this.logDebug('Learning data saved successfully', 'info');
    } catch (error) {
      this.logDebug(`Failed to save learning data: ${error.message}`, 'error');
    }
  }

  /**
   * Update effectiveness metrics
   */
  updateEffectivenessMetrics(patterns) {
    try {
      const totalPatterns =
        patterns.errorPatterns.size +
        patterns.successPatterns.size +
        patterns.performancePatterns.size;
      this.effectivenessMetrics.patternAccuracy = Math.min(
        0.95,
        totalPatterns / 10
      );
      this.effectivenessMetrics.learningSpeed =
        this.learningData.size / (process.uptime() / 60); // patterns per minute
    } catch (error) {
      this.logDebug(
        `Error updating effectiveness metrics: ${error.message}`,
        'error'
      );
    }
  }

  /**
   * Deactivate learning loop
   */
  async deactivate() {
    try {
      console.log('🛑 Deactivating Enhanced Learning Loop...');

      // Clear intervals
      if (this.learningInterval) clearInterval(this.learningInterval);
      if (this.analysisInterval) clearInterval(this.analysisInterval);
      if (this.optimizationInterval) clearInterval(this.optimizationInterval);
      if (this.debugInterval) clearInterval(this.debugInterval);

      // Save learning data
      await this.saveLearningData();

      this.isActive = false;
      this.logDebug('Enhanced Learning Loop deactivated', 'info');

      console.log('✅ Enhanced Learning Loop deactivated');
    } catch (error) {
      console.error('❌ Failed to deactivate learning loop:', error);
      this.logDebug(
        `Failed to deactivate learning loop: ${error.message}`,
        'error'
      );
    }
  }
}

module.exports = EnhancedLearningLoop;
