/**
 * ⚡ Load Testing System
 *
 * Tests system performance under various load conditions
 * Determines maximum agent capacity and identifies bottlenecks
 */

const EventEmitter = require('events');
const fs = require('fs').promises;
const path = require('path');

class LoadTestingSystem extends EventEmitter {
  constructor() {
    super();
    this.name = 'Load Testing System';
    this.version = '1.0.0';
    this.isActive = false;

    // Load testing configuration
    this.config = {
      enabled: false,
      testDuration: 300000, // 5 minutes
      rampUpTime: 60000, // 1 minute
      maxConcurrentAgents: 1000,
      testScenarios: {
        linearRamp: true,
        stepRamp: true,
        spikeTest: true,
        stressTest: true,
        enduranceTest: true,
      },
      metrics: {
        responseTime: true,
        throughput: true,
        errorRate: true,
        resourceUsage: true,
        memoryUsage: true,
        cpuUsage: true,
      },
    };

    // Load testing state
    this.activeTests = new Map();
    this.testResults = [];
    this.currentLoad = 0;
    this.performanceMetrics = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      maxResponseTime: 0,
      minResponseTime: Infinity,
      throughput: 0,
      errorRate: 0,
      memoryPeak: 0,
      cpuPeak: 0,
    };

    // Bottleneck detection
    this.bottlenecks = [];
    this.capacityLimits = {
      maxAgents: 0,
      maxThroughput: 0,
      maxMemory: 0,
      maxCpu: 0,
    };

    console.log(`⚡ ${this.name} v${this.version} initialized`);
  }

  /**
   * Initialize load testing system
   */
  async initialize() {
    try {
      console.log('⚡ Initializing Load Testing System...');

      // Setup performance monitoring
      this.setupPerformanceMonitoring();

      // Setup bottleneck detection
      this.setupBottleneckDetection();

      // Setup test scenarios
      this.setupTestScenarios();

      this.isActive = true;
      console.log('✅ Load Testing System initialized successfully');

      return true;
    } catch (error) {
      console.error('❌ Error initializing Load Testing System:', error);
      throw error;
    }
  }

  /**
   * Setup performance monitoring
   */
  setupPerformanceMonitoring() {
    console.log('📊 Setting up performance monitoring...');

    // Monitor system metrics every second
    this.metricsInterval = setInterval(() => {
      this.collectPerformanceMetrics();
    }, 1000);

    // Monitor memory usage
    this.memoryInterval = setInterval(() => {
      this.monitorMemoryUsage();
    }, 5000);

    // Monitor CPU usage
    this.cpuInterval = setInterval(() => {
      this.monitorCpuUsage();
    }, 2000);

    console.log('✅ Performance monitoring setup completed');
  }

  /**
   * Setup bottleneck detection
   */
  setupBottleneckDetection() {
    console.log('🔍 Setting up bottleneck detection...');

    this.bottleneckThresholds = {
      responseTime: 5000, // 5 seconds
      errorRate: 0.05, // 5%
      memoryUsage: 0.9, // 90%
      cpuUsage: 0.9, // 90%
      throughput: 0.8, // 80% of peak
    };

    console.log('✅ Bottleneck detection setup completed');
  }

  /**
   * Setup test scenarios
   */
  setupTestScenarios() {
    console.log('🎭 Setting up test scenarios...');

    this.testScenarios = {
      linearRamp: this.executeLinearRampTest.bind(this),
      stepRamp: this.executeStepRampTest.bind(this),
      spikeTest: this.executeSpikeTest.bind(this),
      stressTest: this.executeStressTest.bind(this),
      enduranceTest: this.executeEnduranceTest.bind(this),
    };

    console.log('✅ Test scenarios setup completed');
  }

  /**
   * Start load testing
   */
  async startLoadTest(scenario = 'linearRamp', options = {}) {
    try {
      console.log(`⚡ Starting load test: ${scenario}`);

      const testId = `load_test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const test = {
        id: testId,
        scenario: scenario,
        startTime: new Date(),
        status: 'running',
        options: { ...this.config, ...options },
        results: {
          agents: [],
          metrics: [],
          bottlenecks: [],
          errors: [],
        },
      };

      this.activeTests.set(testId, test);

      // Execute test scenario
      await this.testScenarios[scenario](testId, test.options);

      console.log(`✅ Load test ${scenario} started successfully`);

      return testId;
    } catch (error) {
      console.error('❌ Error starting load test:', error);
      throw error;
    }
  }

  /**
   * Execute linear ramp test
   */
  async executeLinearRampTest(testId, options) {
    try {
      console.log(`📈 Executing linear ramp test (${testId})`);

      const test = this.activeTests.get(testId);
      const rampUpTime = options.rampUpTime || 60000;
      const maxAgents = options.maxConcurrentAgents || 100;
      const testDuration = options.testDuration || 300000;

      const rampUpInterval = rampUpTime / maxAgents;
      let currentAgents = 0;

      // Ramp up phase
      const rampUpPhase = setInterval(() => {
        if (currentAgents >= maxAgents) {
          clearInterval(rampUpPhase);
          return;
        }

        currentAgents++;
        this.simulateAgentLoad(currentAgents, testId);
      }, rampUpInterval);

      // Test duration phase
      setTimeout(() => {
        clearInterval(rampUpPhase);
        this.completeLoadTest(testId);
      }, testDuration);
    } catch (error) {
      console.error('❌ Error executing linear ramp test:', error);
      throw error;
    }
  }

  /**
   * Execute step ramp test
   */
  async executeStepRampTest(testId, options) {
    try {
      console.log(`📊 Executing step ramp test (${testId})`);

      const test = this.activeTests.get(testId);
      const maxAgents = options.maxConcurrentAgents || 100;
      const stepSize = 10;
      const stepDuration = 30000; // 30 seconds per step

      let currentAgents = 0;

      const stepInterval = setInterval(() => {
        if (currentAgents >= maxAgents) {
          clearInterval(stepInterval);
          this.completeLoadTest(testId);
          return;
        }

        currentAgents += stepSize;
        this.simulateAgentLoad(currentAgents, testId);
      }, stepDuration);
    } catch (error) {
      console.error('❌ Error executing step ramp test:', error);
      throw error;
    }
  }

  /**
   * Execute spike test
   */
  async executeSpikeTest(testId, options) {
    try {
      console.log(`📈 Executing spike test (${testId})`);

      const test = this.activeTests.get(testId);
      const baseLoad = 20;
      const spikeLoad = 200;
      const spikeDuration = 10000; // 10 seconds
      const testDuration = options.testDuration || 300000;

      // Start with base load
      this.simulateAgentLoad(baseLoad, testId);

      // Create spikes
      const spikeInterval = setInterval(() => {
        console.log(`📈 Creating load spike: ${spikeLoad} agents`);
        this.simulateAgentLoad(spikeLoad, testId);

        setTimeout(() => {
          console.log(`📉 Reducing load back to base: ${baseLoad} agents`);
          this.simulateAgentLoad(baseLoad, testId);
        }, spikeDuration);
      }, 60000); // Spike every minute

      // End test after duration
      setTimeout(() => {
        clearInterval(spikeInterval);
        this.completeLoadTest(testId);
      }, testDuration);
    } catch (error) {
      console.error('❌ Error executing spike test:', error);
      throw error;
    }
  }

  /**
   * Execute stress test
   */
  async executeStressTest(testId, options) {
    try {
      console.log(`🔥 Executing stress test (${testId})`);

      const test = this.activeTests.get(testId);
      const maxAgents = options.maxConcurrentAgents || 500;
      const testDuration = options.testDuration || 300000;

      // Start with maximum load immediately
      this.simulateAgentLoad(maxAgents, testId);

      // Monitor for system failure
      const stressMonitor = setInterval(() => {
        this.detectStressBottlenecks(testId);
      }, 5000);

      // End test after duration
      setTimeout(() => {
        clearInterval(stressMonitor);
        this.completeLoadTest(testId);
      }, testDuration);
    } catch (error) {
      console.error('❌ Error executing stress test:', error);
      throw error;
    }
  }

  /**
   * Execute endurance test
   */
  async executeEnduranceTest(testId, options) {
    try {
      console.log(`⏰ Executing endurance test (${testId})`);

      const test = this.activeTests.get(testId);
      const sustainedLoad = 50;
      const testDuration = options.testDuration || 1800000; // 30 minutes

      // Maintain sustained load
      this.simulateAgentLoad(sustainedLoad, testId);

      // Monitor for degradation
      const enduranceMonitor = setInterval(() => {
        this.detectEnduranceBottlenecks(testId);
      }, 30000); // Check every 30 seconds

      // End test after duration
      setTimeout(() => {
        clearInterval(enduranceMonitor);
        this.completeLoadTest(testId);
      }, testDuration);
    } catch (error) {
      console.error('❌ Error executing endurance test:', error);
      throw error;
    }
  }

  /**
   * Simulate agent load
   */
  async simulateAgentLoad(agentCount, testId) {
    try {
      console.log(`🤖 Simulating load with ${agentCount} agents`);

      this.currentLoad = agentCount;

      // Simulate agent operations
      const startTime = Date.now();

      for (let i = 0; i < agentCount; i++) {
        this.simulateAgentOperation(i, testId);
      }

      const responseTime = Date.now() - startTime;

      // Record metrics
      this.recordLoadMetrics(agentCount, responseTime, testId);

      // Check for bottlenecks
      this.checkForBottlenecks(agentCount, responseTime);
    } catch (error) {
      console.error('❌ Error simulating agent load:', error);
    }
  }

  /**
   * Simulate individual agent operation
   */
  async simulateAgentOperation(agentId, testId) {
    try {
      const operationStartTime = Date.now();

      // Simulate various agent operations
      const operations = [
        'data_processing',
        'api_call',
        'database_query',
        'file_operation',
        'network_request',
      ];

      const operation =
        operations[Math.floor(Math.random() * operations.length)];

      // Simulate operation time based on type
      const operationTimes = {
        data_processing: 100,
        api_call: 200,
        database_query: 150,
        file_operation: 300,
        network_request: 500,
      };

      const operationTime = operationTimes[operation] + Math.random() * 100;

      await new Promise(resolve => setTimeout(resolve, operationTime));

      const totalTime = Date.now() - operationStartTime;

      // Record operation metrics
      this.recordOperationMetrics(agentId, operation, totalTime, testId);
    } catch (error) {
      console.error(`❌ Error simulating agent operation ${agentId}:`, error);
    }
  }

  /**
   * Record load metrics
   */
  recordLoadMetrics(agentCount, responseTime, testId) {
    try {
      const test = this.activeTests.get(testId);
      if (!test) return;

      const metrics = {
        timestamp: new Date(),
        agentCount: agentCount,
        responseTime: responseTime,
        throughput: agentCount / (responseTime / 1000), // agents per second
        memoryUsage: process.memoryUsage().heapUsed,
        cpuUsage: process.cpuUsage().user / 1000000,
      };

      test.results.metrics.push(metrics);

      // Update global metrics
      this.performanceMetrics.totalRequests += agentCount;
      this.performanceMetrics.successfulRequests += agentCount;
      this.performanceMetrics.averageResponseTime =
        (this.performanceMetrics.averageResponseTime + responseTime) / 2;

      if (responseTime > this.performanceMetrics.maxResponseTime) {
        this.performanceMetrics.maxResponseTime = responseTime;
      }

      if (responseTime < this.performanceMetrics.minResponseTime) {
        this.performanceMetrics.minResponseTime = responseTime;
      }

      this.performanceMetrics.throughput =
        (this.performanceMetrics.totalRequests /
          (Date.now() - test.startTime.getTime())) *
        1000;
    } catch (error) {
      console.error('❌ Error recording load metrics:', error);
    }
  }

  /**
   * Record operation metrics
   */
  recordOperationMetrics(agentId, operation, responseTime, testId) {
    try {
      const test = this.activeTests.get(testId);
      if (!test) return;

      const operationMetrics = {
        agentId: agentId,
        operation: operation,
        responseTime: responseTime,
        timestamp: new Date(),
        success: responseTime < 5000, // Consider successful if under 5 seconds
      };

      test.results.agents.push(operationMetrics);

      if (!operationMetrics.success) {
        test.results.errors.push({
          agentId: agentId,
          operation: operation,
          error: 'Timeout',
          timestamp: new Date(),
        });
      }
    } catch (error) {
      console.error('❌ Error recording operation metrics:', error);
    }
  }

  /**
   * Check for bottlenecks
   */
  checkForBottlenecks(agentCount, responseTime) {
    try {
      const bottlenecks = [];

      // Check response time bottleneck
      if (responseTime > this.bottleneckThresholds.responseTime) {
        bottlenecks.push({
          type: 'response_time',
          severity: 'high',
          value: responseTime,
          threshold: this.bottleneckThresholds.responseTime,
          agentCount: agentCount,
        });
      }

      // Check memory bottleneck
      const memoryUsage = process.memoryUsage().heapUsed / (1024 * 1024 * 1024); // GB
      if (memoryUsage > this.bottleneckThresholds.memoryUsage) {
        bottlenecks.push({
          type: 'memory_usage',
          severity: 'high',
          value: memoryUsage,
          threshold: this.bottleneckThresholds.memoryUsage,
          agentCount: agentCount,
        });
      }

      // Check CPU bottleneck
      const cpuUsage = process.cpuUsage().user / 1000000;
      if (cpuUsage > this.bottleneckThresholds.cpuUsage) {
        bottlenecks.push({
          type: 'cpu_usage',
          severity: 'high',
          value: cpuUsage,
          threshold: this.bottleneckThresholds.cpuUsage,
          agentCount: agentCount,
        });
      }

      if (bottlenecks.length > 0) {
        this.bottlenecks.push(...bottlenecks);
        this.emit('bottleneck_detected', bottlenecks);

        // Update capacity limits
        this.updateCapacityLimits(agentCount, bottlenecks);
      }
    } catch (error) {
      console.error('❌ Error checking for bottlenecks:', error);
    }
  }

  /**
   * Detect stress bottlenecks
   */
  detectStressBottlenecks(testId) {
    try {
      const test = this.activeTests.get(testId);
      if (!test) return;

      const recentMetrics = test.results.metrics.slice(-10);
      if (recentMetrics.length === 0) return;

      const avgResponseTime =
        recentMetrics.reduce((sum, m) => sum + m.responseTime, 0) /
        recentMetrics.length;
      const errorRate = test.results.errors.length / test.results.agents.length;

      if (avgResponseTime > this.bottleneckThresholds.responseTime) {
        test.results.bottlenecks.push({
          type: 'stress_response_time',
          severity: 'critical',
          value: avgResponseTime,
          timestamp: new Date(),
        });
      }

      if (errorRate > this.bottleneckThresholds.errorRate) {
        test.results.bottlenecks.push({
          type: 'stress_error_rate',
          severity: 'critical',
          value: errorRate,
          timestamp: new Date(),
        });
      }
    } catch (error) {
      console.error('❌ Error detecting stress bottlenecks:', error);
    }
  }

  /**
   * Detect endurance bottlenecks
   */
  detectEnduranceBottlenecks(testId) {
    try {
      const test = this.activeTests.get(testId);
      if (!test) return;

      const recentMetrics = test.results.metrics.slice(-30); // Last 30 measurements
      if (recentMetrics.length < 10) return;

      // Check for performance degradation over time
      const firstHalf = recentMetrics.slice(
        0,
        Math.floor(recentMetrics.length / 2)
      );
      const secondHalf = recentMetrics.slice(
        Math.floor(recentMetrics.length / 2)
      );

      const firstHalfAvg =
        firstHalf.reduce((sum, m) => sum + m.responseTime, 0) /
        firstHalf.length;
      const secondHalfAvg =
        secondHalf.reduce((sum, m) => sum + m.responseTime, 0) /
        secondHalf.length;

      const degradation = (secondHalfAvg - firstHalfAvg) / firstHalfAvg;

      if (degradation > 0.2) {
        // 20% degradation
        test.results.bottlenecks.push({
          type: 'endurance_degradation',
          severity: 'medium',
          value: degradation,
          timestamp: new Date(),
        });
      }
    } catch (error) {
      console.error('❌ Error detecting endurance bottlenecks:', error);
    }
  }

  /**
   * Update capacity limits
   */
  updateCapacityLimits(agentCount, bottlenecks) {
    try {
      // Update maximum agent capacity
      if (agentCount > this.capacityLimits.maxAgents) {
        this.capacityLimits.maxAgents = agentCount;
      }

      // Update maximum throughput
      const currentThroughput = agentCount / (Date.now() / 1000);
      if (currentThroughput > this.capacityLimits.maxThroughput) {
        this.capacityLimits.maxThroughput = currentThroughput;
      }

      // Update maximum memory
      const memoryUsage = process.memoryUsage().heapUsed;
      if (memoryUsage > this.capacityLimits.maxMemory) {
        this.capacityLimits.maxMemory = memoryUsage;
      }

      // Update maximum CPU
      const cpuUsage = process.cpuUsage().user / 1000000;
      if (cpuUsage > this.capacityLimits.maxCpu) {
        this.capacityLimits.maxCpu = cpuUsage;
      }
    } catch (error) {
      console.error('❌ Error updating capacity limits:', error);
    }
  }

  /**
   * Complete load test
   */
  async completeLoadTest(testId) {
    try {
      console.log(`✅ Completing load test: ${testId}`);

      const test = this.activeTests.get(testId);
      if (!test) return;

      test.status = 'completed';
      test.endTime = new Date();
      test.duration = test.endTime.getTime() - test.startTime.getTime();

      // Calculate final metrics
      this.calculateFinalMetrics(test);

      // Move to results
      this.testResults.push(test);
      this.activeTests.delete(testId);

      // Emit completion event
      this.emit('load_test_completed', test);

      console.log(`✅ Load test ${testId} completed successfully`);
    } catch (error) {
      console.error('❌ Error completing load test:', error);
    }
  }

  /**
   * Calculate final metrics
   */
  calculateFinalMetrics(test) {
    try {
      const metrics = test.results.metrics;
      if (metrics.length === 0) return;

      // Calculate averages
      test.finalMetrics = {
        averageResponseTime:
          metrics.reduce((sum, m) => sum + m.responseTime, 0) / metrics.length,
        maxResponseTime: Math.max(...metrics.map(m => m.responseTime)),
        minResponseTime: Math.min(...metrics.map(m => m.responseTime)),
        averageThroughput:
          metrics.reduce((sum, m) => sum + m.throughput, 0) / metrics.length,
        maxThroughput: Math.max(...metrics.map(m => m.throughput)),
        averageMemoryUsage:
          metrics.reduce((sum, m) => sum + m.memoryUsage, 0) / metrics.length,
        maxMemoryUsage: Math.max(...metrics.map(m => m.memoryUsage)),
        averageCpuUsage:
          metrics.reduce((sum, m) => sum + m.cpuUsage, 0) / metrics.length,
        maxCpuUsage: Math.max(...metrics.map(m => m.cpuUsage)),
        totalOperations: test.results.agents.length,
        errorRate: test.results.errors.length / test.results.agents.length,
        bottleneckCount: test.results.bottlenecks.length,
      };
    } catch (error) {
      console.error('❌ Error calculating final metrics:', error);
    }
  }

  /**
   * Collect performance metrics
   */
  collectPerformanceMetrics() {
    try {
      const memUsage = process.memoryUsage();
      const cpuUsage = process.cpuUsage();

      this.performanceMetrics.memoryPeak = Math.max(
        this.performanceMetrics.memoryPeak,
        memUsage.heapUsed
      );
      this.performanceMetrics.cpuPeak = Math.max(
        this.performanceMetrics.cpuPeak,
        cpuUsage.user / 1000000
      );

      this.emit('performance_metrics', {
        memory: memUsage,
        cpu: cpuUsage,
        currentLoad: this.currentLoad,
        activeTests: this.activeTests.size,
      });
    } catch (error) {
      console.error('❌ Error collecting performance metrics:', error);
    }
  }

  /**
   * Monitor memory usage
   */
  monitorMemoryUsage() {
    try {
      const memUsage = process.memoryUsage();
      const memoryUsageGB = memUsage.heapUsed / (1024 * 1024 * 1024);

      if (memoryUsageGB > 1) {
        // Alert if over 1GB
        this.emit('memory_alert', {
          usage: memoryUsageGB,
          threshold: 1,
          timestamp: new Date(),
        });
      }
    } catch (error) {
      console.error('❌ Error monitoring memory usage:', error);
    }
  }

  /**
   * Monitor CPU usage
   */
  monitorCpuUsage() {
    try {
      const cpuUsage = process.cpuUsage();
      const cpuUsagePercent = (cpuUsage.user / 1000000) * 100;

      if (cpuUsagePercent > 80) {
        // Alert if over 80%
        this.emit('cpu_alert', {
          usage: cpuUsagePercent,
          threshold: 80,
          timestamp: new Date(),
        });
      }
    } catch (error) {
      console.error('❌ Error monitoring CPU usage:', error);
    }
  }

  /**
   * Get load testing report
   */
  getLoadTestReport() {
    const report = {
      status: this.isActive ? 'active' : 'inactive',
      config: this.config,
      performanceMetrics: this.performanceMetrics,
      capacityLimits: this.capacityLimits,
      bottlenecks: this.bottlenecks,
      activeTests: Array.from(this.activeTests.values()),
      completedTests: this.testResults,
      recommendations: this.generateRecommendations(),
    };

    return report;
  }

  /**
   * Generate recommendations
   */
  generateRecommendations() {
    const recommendations = [];

    // Analyze bottlenecks
    if (this.bottlenecks.length > 0) {
      const bottleneckTypes = this.bottlenecks.map(b => b.type);
      const uniqueTypes = [...new Set(bottleneckTypes)];

      uniqueTypes.forEach(type => {
        switch (type) {
          case 'response_time':
            recommendations.push({
              type: 'performance',
              priority: 'high',
              recommendation:
                'Optimize response times by implementing caching and connection pooling',
              impact: 'Reduce response times by 30-50%',
            });
            break;
          case 'memory_usage':
            recommendations.push({
              type: 'resource',
              priority: 'high',
              recommendation:
                'Implement memory optimization and garbage collection tuning',
              impact: 'Reduce memory usage by 20-40%',
            });
            break;
          case 'cpu_usage':
            recommendations.push({
              type: 'resource',
              priority: 'medium',
              recommendation:
                'Optimize CPU-intensive operations and implement load balancing',
              impact: 'Reduce CPU usage by 15-30%',
            });
            break;
        }
      });
    }

    // Analyze capacity limits
    if (this.capacityLimits.maxAgents > 0) {
      recommendations.push({
        type: 'scalability',
        priority: 'medium',
        recommendation: `System can handle up to ${this.capacityLimits.maxAgents} agents before performance degradation`,
        impact: 'Provides clear capacity planning guidelines',
      });
    }

    return recommendations;
  }

  /**
   * Export load testing data
   */
  async exportLoadTestData() {
    try {
      const exportData = {
        timestamp: new Date(),
        report: this.getLoadTestReport(),
        rawData: {
          testResults: this.testResults,
          bottlenecks: this.bottlenecks,
          performanceMetrics: this.performanceMetrics,
        },
      };

      const exportPath = path.join(
        __dirname,
        '../exports/load_testing_report.json'
      );
      await fs.mkdir(path.dirname(exportPath), { recursive: true });
      await fs.writeFile(exportPath, JSON.stringify(exportData, null, 2));

      console.log(`✅ Load testing data exported to: ${exportPath}`);
      return exportPath;
    } catch (error) {
      console.error('❌ Error exporting load testing data:', error);
      throw error;
    }
  }

  /**
   * Shutdown load testing system
   */
  async shutdown() {
    try {
      console.log('🔄 Shutting down Load Testing System...');

      // Stop all active tests
      for (const [testId, test] of this.activeTests) {
        await this.completeLoadTest(testId);
      }

      // Clear intervals
      if (this.metricsInterval) clearInterval(this.metricsInterval);
      if (this.memoryInterval) clearInterval(this.memoryInterval);
      if (this.cpuInterval) clearInterval(this.cpuInterval);

      // Export final data
      await this.exportLoadTestData();

      this.isActive = false;
      console.log('✅ Load Testing System shutdown completed');
    } catch (error) {
      console.error('❌ Error shutting down Load Testing System:', error);
      throw error;
    }
  }
}

module.exports = LoadTestingSystem;
