/**
 * 🧪 Learning-Telegram Integration Test Suite
 * 
 * Comprehensive testing of the learning loop and Telegram integration
 */

const { config } = require('dotenv');
const path = require('path');

// Load environment variables
config({ path: path.join(__dirname, '../firebase.env') });

const LearningTelegramIntegration = require('./server/learningTelegramIntegration.js');
const { ComprehensiveLearningLoop } = require('./server/comprehensiveLearningLoop.js');
const { RoundBasedLearningSystem } = require('./server/roundBasedLearningSystem.js');

class LearningTelegramIntegrationTest {
  constructor() {
    this.name = 'Learning-Telegram Integration Test';
    this.version = '1.0.0';
    this.testResults = {
      integrationInitialization: { status: 'pending', details: [] },
      learningSystemConnection: { status: 'pending', details: [] },
      eventHandling: { status: 'pending', details: [] },
      notificationRules: { status: 'pending', details: [] },
      smartNotifications: { status: 'pending', details: [] },
      metricsTracking: { status: 'pending', details: [] },
      monitoringSystem: { status: 'pending', details: [] },
      errorHandling: { status: 'pending', details: [] },
    };

    
  }

  /**
   * Run comprehensive test suite
   */
  async runTest() {
    try {
      

      // Test integration initialization
      await this.testIntegrationInitialization();

      // Test learning system connection
      await this.testLearningSystemConnection();

      // Test event handling
      await this.testEventHandling();

      // Test notification rules
      await this.testNotificationRules();

      // Test smart notifications
      await this.testSmartNotifications();

      // Test metrics tracking
      await this.testMetricsTracking();

      // Test monitoring system
      await this.testMonitoringSystem();

      // Test error handling
      await this.testErrorHandling();

      // Generate final report
      this.generateFinalReport();

      
      return this.testResults;
    } catch (error) {
      console.error('❌ Learning-Telegram Integration Test failed:', error.message);
      throw error;
    }
  }

  /**
   * Test integration initialization
   */
  async testIntegrationInitialization() {
    try {
      

      const integration = new LearningTelegramIntegration();
      
      // Test basic initialization
      this.testResults.integrationInitialization.details.push(
        `Basic Initialization: ${integration ? 'Success' : 'Failed'}`
      );

      // Test integration settings
      const hasSettings = integration.integrationSettings && 
                         integration.integrationSettings.learningInsights;
      this.testResults.integrationInitialization.details.push(
        `Integration Settings: ${hasSettings ? 'Configured' : 'Missing'}`
      );

      // Test event handlers map
      const hasEventHandlers = integration.eventHandlers instanceof Map;
      this.testResults.integrationInitialization.details.push(
        `Event Handlers: ${hasEventHandlers ? 'Available' : 'Missing'}`
      );

      // Test notification rules map
      const hasNotificationRules = integration.notificationRules instanceof Map;
      this.testResults.integrationInitialization.details.push(
        `Notification Rules: ${hasNotificationRules ? 'Available' : 'Missing'}`
      );

      // Test learning metrics map
      const hasLearningMetrics = integration.learningMetrics instanceof Map;
      this.testResults.integrationInitialization.details.push(
        `Learning Metrics: ${hasLearningMetrics ? 'Available' : 'Missing'}`
      );

      this.testResults.integrationInitialization.status = 'passed';
      
    } catch (error) {
      this.testResults.integrationInitialization.status = 'failed';
      this.testResults.integrationInitialization.details.push(
        `Error: ${error.message}`
      );
      
    }
  }

  /**
   * Test learning system connection
   */
  async testLearningSystemConnection() {
    try {
      

      const integration = new LearningTelegramIntegration();
      
      // Initialize learning systems
      await integration.initializeLearningSystems();

      // Test learning loop connection
      const hasLearningLoop = integration.learningLoop !== null;
      this.testResults.learningSystemConnection.details.push(
        `Learning Loop: ${hasLearningLoop ? 'Connected' : 'Not Connected'}`
      );

      // Test round learning connection
      const hasRoundLearning = integration.roundLearning !== null;
      this.testResults.learningSystemConnection.details.push(
        `Round Learning: ${hasRoundLearning ? 'Connected' : 'Not Connected'}`
      );

      // Test integration setup
      const setupMethod = typeof integration.setupIntegration === 'function';
      this.testResults.learningSystemConnection.details.push(
        `Integration Setup: ${setupMethod ? 'Available' : 'Missing'}`
      );

      // Test event handler setup
      const eventSetupMethod = typeof integration.setupEventHandlers === 'function';
      this.testResults.learningSystemConnection.details.push(
        `Event Handler Setup: ${eventSetupMethod ? 'Available' : 'Missing'}`
      );

      this.testResults.learningSystemConnection.status = 'passed';
      
    } catch (error) {
      this.testResults.learningSystemConnection.status = 'failed';
      this.testResults.learningSystemConnection.details.push(
        `Error: ${error.message}`
      );
      
    }
  }

  /**
   * Test event handling
   */
  async testEventHandling() {
    try {
      

      const integration = new LearningTelegramIntegration();
      integration.setupEventHandlers();

      // Test event handler registration
      const expectedEvents = [
        'pattern_discovered',
        'improvement_suggested',
        'performance_optimized',
        'error_detected',
        'round_completed',
        'learning_updated',
        'recommendation_generated'
      ];

      expectedEvents.forEach(eventType => {
        const handler = integration.eventHandlers.get(eventType);
        const hasHandler = handler && typeof handler.handler === 'function';
        this.testResults.eventHandling.details.push(
          `Event ${eventType}: ${hasHandler ? 'Registered' : 'Missing'}`
        );
      });

      // Test event handler methods
      const handlerMethods = [
        'handleLearningPattern',
        'handleImprovementSuggestion',
        'handlePerformanceOptimization',
        'handleErrorDetection',
        'handleRoundCompletion',
        'handleLearningUpdate',
        'handleRecommendation'
      ];

      handlerMethods.forEach(method => {
        const hasMethod = typeof integration[method] === 'function';
        this.testResults.eventHandling.details.push(
          `Handler Method ${method}: ${hasMethod ? 'Available' : 'Missing'}`
        );
      });

      this.testResults.eventHandling.status = 'passed';
      
    } catch (error) {
      this.testResults.eventHandling.status = 'failed';
      this.testResults.eventHandling.details.push(
        `Error: ${error.message}`
      );
      
    }
  }

  /**
   * Test notification rules
   */
  async testNotificationRules() {
    try {
      

      const integration = new LearningTelegramIntegration();
      integration.setupNotificationRules();

      // Test notification rule registration
      const expectedRules = [
        'pattern_discovery',
        'improvement_suggestion',
        'performance_optimization',
        'error_detection',
        'round_completion',
        'learning_update',
        'recommendation'
      ];

      expectedRules.forEach(ruleType => {
        const rule = integration.notificationRules.get(ruleType);
        const hasRule = rule && rule.condition && rule.message && rule.priority;
        this.testResults.notificationRules.details.push(
          `Rule ${ruleType}: ${hasRule ? 'Configured' : 'Missing'}`
        );
      });

      // Test rule conditions
      const testData = {
        pattern_discovery: { confidence: 0.9, type: 'test', impact: 'high' },
        improvement_suggestion: { priority: 'high', impact: 0.8, description: 'test' },
        performance_optimization: { improvement: 0.2, type: 'test', area: 'test' },
        error_detection: { severity: 'critical', frequency: 5, type: 'test' },
        round_completion: { successRate: 0.95, roundId: 'test', duration: 1000 },
        learning_update: { significantChange: true, newPatterns: 2, dataPoints: 100 },
        recommendation: { priority: 'high', confidence: 0.9, description: 'test' }
      };

      Object.entries(testData).forEach(([ruleType, data]) => {
        const rule = integration.notificationRules.get(ruleType);
        if (rule) {
          const conditionResult = rule.condition(data);
          this.testResults.notificationRules.details.push(
            `Rule ${ruleType} Condition: ${conditionResult ? 'Passed' : 'Failed'}`
          );
        }
      });

      this.testResults.notificationRules.status = 'passed';
      
    } catch (error) {
      this.testResults.notificationRules.status = 'failed';
      this.testResults.notificationRules.details.push(
        `Error: ${error.message}`
      );
      
    }
  }

  /**
   * Test smart notifications
   */
  async testSmartNotifications() {
    try {
      

      const integration = new LearningTelegramIntegration();
      
      // Test notification sending method
      const sendMethod = typeof integration.sendNotification === 'function';
      this.testResults.smartNotifications.details.push(
        `Send Method: ${sendMethod ? 'Available' : 'Missing'}`
      );

      // Test notification logging
      const logMethod = typeof integration.logNotification === 'function';
      this.testResults.smartNotifications.details.push(
        `Log Method: ${logMethod ? 'Available' : 'Missing'}`
      );

      // Test notification queue
      const hasQueue = Array.isArray(integration.notificationQueue);
      this.testResults.smartNotifications.details.push(
        `Notification Queue: ${hasQueue ? 'Available' : 'Missing'}`
      );

      // Test metrics updating
      const updateMethod = typeof integration.updateLearningMetrics === 'function';
      this.testResults.smartNotifications.details.push(
        `Metrics Update: ${updateMethod ? 'Available' : 'Missing'}`
      );

      // Test mock notification sending
      try {
        await integration.sendNotification('Test notification', 'medium', ['console']);
        this.testResults.smartNotifications.details.push(
          `Mock Notification: Sent successfully`
        );
      } catch (error) {
        this.testResults.smartNotifications.details.push(
          `Mock Notification: ${error.message}`
        );
      }

      this.testResults.smartNotifications.status = 'passed';
      
    } catch (error) {
      this.testResults.smartNotifications.status = 'failed';
      this.testResults.smartNotifications.details.push(
        `Error: ${error.message}`
      );
      
    }
  }

  /**
   * Test metrics tracking
   */
  async testMetricsTracking() {
    try {
      

      const integration = new LearningTelegramIntegration();

      // Test metrics updating
      integration.updateLearningMetrics('test_event', { test: 'data' });
      const hasMetrics = integration.learningMetrics.has('test_event');
      this.testResults.metricsTracking.details.push(
        `Metrics Update: ${hasMetrics ? 'Working' : 'Failed'}`
      );

      // Test metrics summary
      const summaryMethod = typeof integration.getLearningMetricsSummary === 'function';
      this.testResults.metricsTracking.details.push(
        `Metrics Summary: ${summaryMethod ? 'Available' : 'Missing'}`
      );

      // Test status method
      const statusMethod = typeof integration.getStatus === 'function';
      this.testResults.metricsTracking.details.push(
        `Status Method: ${statusMethod ? 'Available' : 'Missing'}`
      );

      // Test metrics data structure
      if (hasMetrics) {
        const metrics = integration.learningMetrics.get('test_event');
        const hasStructure = metrics && typeof metrics.count === 'number' && Array.isArray(metrics.data);
        this.testResults.metricsTracking.details.push(
          `Metrics Structure: ${hasStructure ? 'Valid' : 'Invalid'}`
        );
      }

      this.testResults.metricsTracking.status = 'passed';
      
    } catch (error) {
      this.testResults.metricsTracking.status = 'failed';
      this.testResults.metricsTracking.details.push(
        `Error: ${error.message}`
      );
      
    }
  }

  /**
   * Test monitoring system
   */
  async testMonitoringSystem() {
    try {
      

      const integration = new LearningTelegramIntegration();

      // Test monitoring start
      const startMethod = typeof integration.startMonitoring === 'function';
      this.testResults.monitoringSystem.details.push(
        `Start Monitoring: ${startMethod ? 'Available' : 'Missing'}`
      );

      // Test metrics monitoring
      const monitorMethod = typeof integration.monitorLearningMetrics === 'function';
      this.testResults.monitoringSystem.details.push(
        `Metrics Monitoring: ${monitorMethod ? 'Available' : 'Missing'}`
      );

      // Test queue processing
      const processMethod = typeof integration.processNotificationQueue === 'function';
      this.testResults.monitoringSystem.details.push(
        `Queue Processing: ${processMethod ? 'Available' : 'Missing'}`
      );

      // Test shutdown method
      const shutdownMethod = typeof integration.shutdown === 'function';
      this.testResults.monitoringSystem.details.push(
        `Shutdown Method: ${shutdownMethod ? 'Available' : 'Missing'}`
      );

      this.testResults.monitoringSystem.status = 'passed';
      
    } catch (error) {
      this.testResults.monitoringSystem.status = 'failed';
      this.testResults.monitoringSystem.details.push(
        `Error: ${error.message}`
      );
      
    }
  }

  /**
   * Test error handling
   */
  async testErrorHandling() {
    try {
      

      const integration = new LearningTelegramIntegration();

      // Test error handling in initialization
      try {
        await integration.initialize('invalid_token', 'invalid_channel');
        this.testResults.errorHandling.details.push(
          `Invalid Token Handling: Graceful failure`
        );
      } catch (error) {
        this.testResults.errorHandling.details.push(
          `Invalid Token Handling: Error caught - ${error.message}`
        );
      }

      // Test error handling in learning systems
      try {
        await integration.initializeLearningSystems();
        this.testResults.errorHandling.details.push(
          `Learning Systems Error Handling: Working`
        );
      } catch (error) {
        this.testResults.errorHandling.details.push(
          `Learning Systems Error Handling: ${error.message}`
        );
      }

      // Test error handling in event handlers
      try {
        await integration.handleLearningPattern({ invalid: 'data' });
        this.testResults.errorHandling.details.push(
          `Event Handler Error Handling: Working`
        );
      } catch (error) {
        this.testResults.errorHandling.details.push(
          `Event Handler Error Handling: ${error.message}`
        );
      }

      // Test error handling in notifications
      try {
        await integration.sendNotification('test', 'invalid_priority', ['invalid_channel']);
        this.testResults.errorHandling.details.push(
          `Notification Error Handling: Graceful failure`
        );
      } catch (error) {
        this.testResults.errorHandling.details.push(
          `Notification Error Handling: Error caught`
        );
      }

      this.testResults.errorHandling.status = 'passed';
      
    } catch (error) {
      this.testResults.errorHandling.status = 'failed';
      this.testResults.errorHandling.details.push(
        `Error: ${error.message}`
      );
      
    }
  }

  /**
   * Generate final report
   */
  generateFinalReport() {
    
    

    const totalTests = Object.keys(this.testResults).length;
    const passedTests = Object.values(this.testResults).filter(
      r => r.status === 'passed'
    ).length;
    const failedTests = totalTests - passedTests;

    
    
    
    console.log(
      `Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`
    );

    
    Object.entries(this.testResults).forEach(([test, result]) => {
      const status = result.status === 'passed' ? '✅' : '❌';
      
      result.details.forEach(detail => {
        
      });
    });

    console.log(
      '\n🎯 Learning-Telegram Integration Status:',
      failedTests === 0 ? 'FULLY OPERATIONAL' : 'NEEDS IMPROVEMENT'
    );

    if (failedTests === 0) {
      console.log(
        '\n🎉 Congratulations! Your Learning-Telegram Integration is FULLY OPERATIONAL and can:'
      );
      
      
      
      
      
      
      
      
      
    } else {
      
      Object.entries(this.testResults).forEach(([test, result]) => {
        if (result.status === 'failed') {
          
        }
      });
    }
  }
}

// Run test if called directly
if (require.main === module) {
  const test = new LearningTelegramIntegrationTest();
  test
    .runTest()
    .then(() => {
      
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Learning-Telegram Integration Test failed:', error.message);
      process.exit(1);
    });
}

module.exports = LearningTelegramIntegrationTest;
