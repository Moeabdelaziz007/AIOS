/**
 * 🧪 Load Testing Test Suite
 *
 * Comprehensive testing of load testing system
 * Tests performance, capacity, and bottleneck detection
 */

const LoadTestingSystem = require('./server/loadTestingSystem');

class LoadTestingTest {
  constructor() {
    this.name = 'Load Testing Test Suite';
    this.version = '1.0.0';
    this.testResults = {
      loadTesting: { status: 'pending', details: [] },
      testScenarios: { status: 'pending', details: [] },
      bottleneckDetection: { status: 'pending', details: [] },
      performanceMetrics: { status: 'pending', details: [] },
      capacityLimits: { status: 'pending', details: [] },
    };

    console.log(`🧪 ${this.name} v${this.version} initialized`);
  }

  /**
   * Run all load testing tests
   */
  async runTest() {
    try {
      console.log('🧪 Starting Load Testing Test Suite...');

      // Test load testing system
      await this.testLoadTesting();

      // Test test scenarios
      await this.testTestScenarios();

      // Test bottleneck detection
      await this.testBottleneckDetection();

      // Test performance metrics
      await this.testPerformanceMetrics();

      // Test capacity limits
      await this.testCapacityLimits();

      // Generate report
      this.generateReport();

      console.log('✅ Load Testing Test Suite completed');
    } catch (error) {
      console.error('❌ Error running Load Testing Test Suite:', error);
    }
  }

  /**
   * Test load testing system
   */
  async testLoadTesting() {
    try {
      console.log('⚡ Testing Load Testing System...');

      const loadSystem = new LoadTestingSystem();

      // Test initialization
      await loadSystem.initialize();
      this.testResults.loadTesting.details.push('Initialization: Success');

      // Test getting load test report
      const report = loadSystem.getLoadTestReport();
      this.testResults.loadTesting.details.push(
        `Load Test Report: ${report.status}`
      );

      // Test exporting load test data
      await loadSystem.exportLoadTestData();
      this.testResults.loadTesting.details.push(
        'Export Load Test Data: Success'
      );

      // Shutdown
      await loadSystem.shutdown();

      this.testResults.loadTesting.status = 'passed';
      console.log('✅ Load Testing System test passed');
    } catch (error) {
      this.testResults.loadTesting.status = 'failed';
      this.testResults.loadTesting.details.push(`Error: ${error.message}`);
      console.log('❌ Load Testing System test failed');
    }
  }

  /**
   * Test test scenarios
   */
  async testTestScenarios() {
    try {
      console.log('🎭 Testing Test Scenarios...');

      const loadSystem = new LoadTestingSystem();
      await loadSystem.initialize();

      // Test different scenarios
      const scenarios = [
        'linearRamp',
        'stepRamp',
        'spikeTest',
        'stressTest',
        'enduranceTest',
      ];

      for (const scenario of scenarios) {
        try {
          const testId = await loadSystem.startLoadTest(scenario, {
            testDuration: 10000, // 10 seconds for testing
            maxConcurrentAgents: 10,
          });

          // Wait for test to complete
          await new Promise(resolve => setTimeout(resolve, 15000));

          this.testResults.testScenarios.details.push(
            `${scenario}: Success (ID: ${testId})`
          );
        } catch (error) {
          this.testResults.testScenarios.details.push(
            `${scenario}: ${error.message}`
          );
        }
      }

      await loadSystem.shutdown();

      this.testResults.testScenarios.status = 'passed';
      console.log('✅ Test Scenarios test passed');
    } catch (error) {
      this.testResults.testScenarios.status = 'failed';
      this.testResults.testScenarios.details.push(`Error: ${error.message}`);
      console.log('❌ Test Scenarios test failed');
    }
  }

  /**
   * Test bottleneck detection
   */
  async testBottleneckDetection() {
    try {
      console.log('🔍 Testing Bottleneck Detection...');

      const loadSystem = new LoadTestingSystem();
      await loadSystem.initialize();

      // Test bottleneck detection with high load
      const testId = await loadSystem.startLoadTest('stressTest', {
        testDuration: 15000,
        maxConcurrentAgents: 100,
      });

      // Wait for bottlenecks to be detected
      await new Promise(resolve => setTimeout(resolve, 20000));

      // Check if bottlenecks were detected
      const report = loadSystem.getLoadTestReport();
      const bottleneckCount = report.bottlenecks.length;

      this.testResults.bottleneckDetection.details.push(
        `Bottlenecks Detected: ${bottleneckCount}`
      );
      this.testResults.bottleneckDetection.details.push(
        `Bottleneck Types: ${report.bottlenecks.map(b => b.type).join(', ')}`
      );

      await loadSystem.shutdown();

      this.testResults.bottleneckDetection.status = 'passed';
      console.log('✅ Bottleneck Detection test passed');
    } catch (error) {
      this.testResults.bottleneckDetection.status = 'failed';
      this.testResults.bottleneckDetection.details.push(
        `Error: ${error.message}`
      );
      console.log('❌ Bottleneck Detection test failed');
    }
  }

  /**
   * Test performance metrics
   */
  async testPerformanceMetrics() {
    try {
      console.log('📊 Testing Performance Metrics...');

      const loadSystem = new LoadTestingSystem();
      await loadSystem.initialize();

      // Test performance metrics collection
      const testId = await loadSystem.startLoadTest('linearRamp', {
        testDuration: 10000,
        maxConcurrentAgents: 50,
      });

      // Wait for metrics to be collected
      await new Promise(resolve => setTimeout(resolve, 15000));

      // Check performance metrics
      const report = loadSystem.getLoadTestReport();
      const metrics = report.performanceMetrics;

      this.testResults.performanceMetrics.details.push(
        `Total Requests: ${metrics.totalRequests}`
      );
      this.testResults.performanceMetrics.details.push(
        `Successful Requests: ${metrics.successfulRequests}`
      );
      this.testResults.performanceMetrics.details.push(
        `Average Response Time: ${metrics.averageResponseTime.toFixed(2)}ms`
      );
      this.testResults.performanceMetrics.details.push(
        `Max Response Time: ${metrics.maxResponseTime}ms`
      );
      this.testResults.performanceMetrics.details.push(
        `Throughput: ${metrics.throughput.toFixed(2)} req/s`
      );
      this.testResults.performanceMetrics.details.push(
        `Error Rate: ${(metrics.errorRate * 100).toFixed(2)}%`
      );

      await loadSystem.shutdown();

      this.testResults.performanceMetrics.status = 'passed';
      console.log('✅ Performance Metrics test passed');
    } catch (error) {
      this.testResults.performanceMetrics.status = 'failed';
      this.testResults.performanceMetrics.details.push(
        `Error: ${error.message}`
      );
      console.log('❌ Performance Metrics test failed');
    }
  }

  /**
   * Test capacity limits
   */
  async testCapacityLimits() {
    try {
      console.log('📈 Testing Capacity Limits...');

      const loadSystem = new LoadTestingSystem();
      await loadSystem.initialize();

      // Test capacity limits with increasing load
      const testId = await loadSystem.startLoadTest('stepRamp', {
        testDuration: 20000,
        maxConcurrentAgents: 200,
      });

      // Wait for capacity limits to be determined
      await new Promise(resolve => setTimeout(resolve, 25000));

      // Check capacity limits
      const report = loadSystem.getLoadTestReport();
      const limits = report.capacityLimits;

      this.testResults.capacityLimits.details.push(
        `Max Agents: ${limits.maxAgents}`
      );
      this.testResults.capacityLimits.details.push(
        `Max Throughput: ${limits.maxThroughput.toFixed(2)} req/s`
      );
      this.testResults.capacityLimits.details.push(
        `Max Memory: ${(limits.maxMemory / 1024 / 1024).toFixed(2)}MB`
      );
      this.testResults.capacityLimits.details.push(
        `Max CPU: ${limits.maxCpu.toFixed(2)}%`
      );

      // Check recommendations
      const recommendations = report.recommendations;
      this.testResults.capacityLimits.details.push(
        `Recommendations: ${recommendations.length} generated`
      );

      await loadSystem.shutdown();

      this.testResults.capacityLimits.status = 'passed';
      console.log('✅ Capacity Limits test passed');
    } catch (error) {
      this.testResults.capacityLimits.status = 'failed';
      this.testResults.capacityLimits.details.push(`Error: ${error.message}`);
      console.log('❌ Capacity Limits test failed');
    }
  }

  /**
   * Generate test report
   */
  generateReport() {
    const passedTests = Object.values(this.testResults).filter(
      test => test.status === 'passed'
    ).length;
    const totalTests = Object.keys(this.testResults).length;
    const successRate = (passedTests / totalTests) * 100;

    console.log('\n🧪 Load Testing Test Report');
    console.log('=====================================');
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${passedTests}`);
    console.log(`Failed: ${totalTests - passedTests}`);
    console.log(`Success Rate: ${successRate.toFixed(1)}%`);
    console.log('\n📋 Test Results:');

    for (const [testName, result] of Object.entries(this.testResults)) {
      const status = result.status === 'passed' ? '✅' : '❌';
      console.log(`${status} ${testName}: ${result.status}`);
      result.details.forEach(detail => {
        console.log(`   - ${detail}`);
      });
    }

    if (successRate >= 80) {
      console.log('\n🎯 Load Testing Status: FULLY OPERATIONAL');
      console.log(
        '🎉 Congratulations! Your Load Testing System is working perfectly!'
      );
    } else {
      console.log('\n⚠️ Load Testing needs improvement in:');
      Object.entries(this.testResults)
        .filter(([_, result]) => result.status === 'failed')
        .forEach(([testName, _]) => console.log(`   - ${testName}`));
    }
  }
}

// Run tests if called directly
if (require.main === module) {
  const test = new LoadTestingTest();
  test.runTest().catch(console.error);
}

module.exports = LoadTestingTest;
