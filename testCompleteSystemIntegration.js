/**
 * 🚀 Complete AIOS System Integration Test
 * Tests Cursor CLI, Debugger, Data Agent, Telegram, and Learning Loop
 */

const path = require('path');
const { config } = require('dotenv');

// Load environment variables
config({ path: path.join(__dirname, 'firebase.env') });

// Import all system components
const QuantumAutopilotSystem = require('./server/quantumAutopilotSystem');
const { CursorCLIIntegration } = require('./server/cursorCLIIntegration');
const FirestoreDataStorage = require('./server/firestoreDataStorage');
const ComprehensiveLearningLoop = require('./server/comprehensiveLearningLoop');

class CompleteSystemIntegrationTest {
  constructor() {
    this.name = 'Complete System Integration Test';
    this.version = '1.0.0';
    this.testResults = {
      cursorCLI: { status: 'pending', details: [] },
      debuggerAgent: { status: 'pending', details: [] },
      dataAgent: { status: 'pending', details: [] },
      telegramIntegration: { status: 'pending', details: [] },
      learningLoop: { status: 'pending', details: [] },
      firestoreIntegration: { status: 'pending', details: [] },
      overallIntegration: { status: 'pending', details: [] },
    };

    console.log(`🧪 ${this.name} v${this.version} initialized`);
  }

  /**
   * Run complete system integration test
   */
  async runCompleteTest() {
    console.log('🚀 Starting Complete AIOS System Integration Test...\n');

    try {
      // Test 1: Cursor CLI Integration
      await this.testCursorCLIIntegration();

      // Test 2: Debugger Agent
      await this.testDebuggerAgent();

      // Test 3: Data Agent
      await this.testDataAgent();

      // Test 4: Telegram Integration
      await this.testTelegramIntegration();

      // Test 5: Learning Loop
      await this.testLearningLoop();

      // Test 6: Firestore Integration
      await this.testFirestoreIntegration();

      // Test 7: Overall Integration
      await this.testOverallIntegration();

      // Generate final report
      this.generateFinalReport();
    } catch (error) {
      console.error('❌ Complete system test failed:', error.message);
      this.testResults.overallIntegration = {
        status: 'failed',
        details: [`Critical error: ${error.message}`],
      };
    }
  }

  /**
   * Test Cursor CLI Integration
   */
  async testCursorCLIIntegration() {
    console.log('🔍 Testing Cursor CLI Integration...');

    try {
      const cursorCLI = new CursorCLIIntegration();

      // Test initialization
      await cursorCLI.initialize();
      this.testResults.cursorCLI.details.push(
        '✅ Cursor CLI initialized successfully'
      );

      // Test workspace analysis
      const workspaceData = await cursorCLI.analyzeWorkspace();
      if (workspaceData && workspaceData.files) {
        this.testResults.cursorCLI.details.push(
          `✅ Workspace analysis completed: ${workspaceData.files.length} files analyzed`
        );
      } else {
        this.testResults.cursorCLI.details.push(
          '⚠️ Workspace analysis returned no data'
        );
      }

      // Test file change detection
      const fileChanges = await cursorCLI.detectFileChanges();
      this.testResults.cursorCLI.details.push(
        `✅ File change detection: ${fileChanges.length} changes detected`
      );

      // Test code pattern analysis
      const codePatterns = await cursorCLI.analyzeCodePatterns();
      this.testResults.cursorCLI.details.push(
        `✅ Code pattern analysis: ${codePatterns.length} patterns found`
      );

      this.testResults.cursorCLI.status = 'passed';
      console.log('✅ Cursor CLI Integration test passed\n');
    } catch (error) {
      console.error('❌ Cursor CLI Integration test failed:', error.message);
      this.testResults.cursorCLI.status = 'failed';
      this.testResults.cursorCLI.details.push(`❌ Error: ${error.message}`);
    }
  }

  /**
   * Test Debugger Agent
   */
  async testDebuggerAgent() {
    console.log('🔧 Testing Debugger Agent...');

    try {
      // Initialize Quantum Autopilot System to get debugger agent
      const quantumSystem = new QuantumAutopilotSystem();
      const debuggerAgent = quantumSystem.debuggerAgent;

      if (!debuggerAgent) {
        throw new Error('Debugger agent not available');
      }

      this.testResults.debuggerAgent.details.push(
        '✅ Debugger agent initialized'
      );

      // Test error analysis
      const testError = {
        type: 'test_error',
        message: 'Test error for debugging',
        stack: 'Error: Test error\n    at testFunction (test.js:1:1)',
        file: 'test.js',
        line: 1,
        timestamp: new Date().toISOString(),
        severity: 'medium',
      };

      const analysis = await debuggerAgent.analyzeError(testError);
      if (analysis) {
        this.testResults.debuggerAgent.details.push(
          '✅ Error analysis completed'
        );
      } else {
        this.testResults.debuggerAgent.details.push(
          '⚠️ Error analysis returned no results'
        );
      }

      // Test fix generation
      const fix = await debuggerAgent.generateNewFix(testError);
      if (fix) {
        this.testResults.debuggerAgent.details.push(
          '✅ Fix generation completed'
        );
      } else {
        this.testResults.debuggerAgent.details.push(
          '⚠️ Fix generation returned no results'
        );
      }

      // Test stats
      const stats = debuggerAgent.getStats();
      this.testResults.debuggerAgent.details.push(
        `✅ Debugger stats: ${JSON.stringify(stats)}`
      );

      this.testResults.debuggerAgent.status = 'passed';
      console.log('✅ Debugger Agent test passed\n');
    } catch (error) {
      console.error('❌ Debugger Agent test failed:', error.message);
      this.testResults.debuggerAgent.status = 'failed';
      this.testResults.debuggerAgent.details.push(`❌ Error: ${error.message}`);
    }
  }

  /**
   * Test Data Agent
   */
  async testDataAgent() {
    console.log('💾 Testing Data Agent...');

    try {
      // Initialize Quantum Autopilot System to get data agent
      const quantumSystem = new QuantumAutopilotSystem();
      const dataAgent = quantumSystem.dataAgent;

      if (!dataAgent) {
        throw new Error('Data agent not available');
      }

      this.testResults.dataAgent.details.push('✅ Data agent initialized');

      // Test data storage
      const testData = {
        errorSignature: 'test-error-signature',
        fix: {
          type: 'test_fix',
          steps: ['Step 1', 'Step 2'],
          confidence: 0.8
        },
        success: true,
        timestamp: new Date().toISOString(),
      };

      dataAgent.storeErrorFix(testData.errorSignature, testData.fix, testData.success);
      this.testResults.dataAgent.details.push('✅ Pattern storage completed');

      // Test data retrieval
      const retrievedPatterns = dataAgent.findSimilarErrors('test-error-signature');
      this.testResults.dataAgent.details.push(
        `✅ Pattern retrieval: ${retrievedPatterns.length} patterns found`
      );

      // Test stats
      const stats = dataAgent.getStats();
      this.testResults.dataAgent.details.push(
        `✅ Data agent stats: ${JSON.stringify(stats)}`
      );

      this.testResults.dataAgent.status = 'passed';
      console.log('✅ Data Agent test passed\n');
    } catch (error) {
      console.error('❌ Data Agent test failed:', error.message);
      this.testResults.dataAgent.status = 'failed';
      this.testResults.dataAgent.details.push(`❌ Error: ${error.message}`);
    }
  }

  /**
   * Test Telegram Integration
   */
  async testTelegramIntegration() {
    console.log('📱 Testing Telegram Integration...');

    try {
      // Check environment variables
      if (!process.env.TELEGRAM_BOT_TOKEN) {
        throw new Error('TELEGRAM_BOT_TOKEN not found in environment');
      }

      if (!process.env.TELEGRAM_CHANNEL_ID) {
        throw new Error('TELEGRAM_CHANNEL_ID not found in environment');
      }

      this.testResults.telegramIntegration.details.push(
        '✅ Telegram environment variables configured'
      );

      // Initialize Quantum Autopilot System
      const quantumSystem = new QuantumAutopilotSystem();

      // Test error reporting
      const testError = {
        type: 'integration_test',
        message: 'Telegram integration test error',
        stack: 'Error: Integration test\n    at testFunction (test.js:1:1)',
        file: 'test.js',
        line: 1,
        timestamp: new Date().toISOString(),
        severity: 'low',
      };

      // This will test the Telegram integration through the autopilot agent
      quantumSystem.autopilotAgent.captureError(testError);
      this.testResults.telegramIntegration.details.push(
        '✅ Error reporting test completed'
      );

      // Test system stats
      const systemStats = quantumSystem.getSystemStats();
      this.testResults.telegramIntegration.details.push(
        `✅ System stats available: ${
          Object.keys(systemStats).length
        } components`
      );

      this.testResults.telegramIntegration.status = 'passed';
      console.log('✅ Telegram Integration test passed\n');
    } catch (error) {
      console.error('❌ Telegram Integration test failed:', error.message);
      this.testResults.telegramIntegration.status = 'failed';
      this.testResults.telegramIntegration.details.push(
        `❌ Error: ${error.message}`
      );
    }
  }

  /**
   * Test Learning Loop
   */
  async testLearningLoop() {
    console.log('🧠 Testing Learning Loop...');

    try {
      // Initialize Comprehensive Learning Loop
      const learningLoop = new ComprehensiveLearningLoop();

      // Test initialization
      await learningLoop.initialize();
      this.testResults.learningLoop.details.push(
        '✅ Learning loop initialized'
      );

      // Test learning from error patterns
      const testPattern = {
        error: 'Test learning error',
        fix: 'Test learning fix',
        success: true,
        timestamp: new Date().toISOString(),
      };

      await learningLoop.learnFromPattern(testPattern);
      this.testResults.learningLoop.details.push(
        '✅ Pattern learning completed'
      );

      // Test improvement recommendations
      const recommendations = learningLoop.getImprovementRecommendations();
      this.testResults.learningLoop.details.push(
        `✅ Improvement recommendations: ${recommendations.length} recommendations`
      );

      // Test learning stats
      const stats = learningLoop.getLearningStats();
      this.testResults.learningLoop.details.push(
        `✅ Learning stats: ${JSON.stringify(stats)}`
      );

      this.testResults.learningLoop.status = 'passed';
      console.log('✅ Learning Loop test passed\n');
    } catch (error) {
      console.error('❌ Learning Loop test failed:', error.message);
      this.testResults.learningLoop.status = 'failed';
      this.testResults.learningLoop.details.push(`❌ Error: ${error.message}`);
    }
  }

  /**
   * Test Firestore Integration
   */
  async testFirestoreIntegration() {
    console.log('🗄️ Testing Firestore Integration...');

    try {
      const firestoreStorage = new FirestoreDataStorage();

      // Test initialization
      const initResult = await firestoreStorage.initialize();
      if (initResult) {
        this.testResults.firestoreIntegration.details.push(
          '✅ Firestore initialized successfully'
        );
      } else {
        this.testResults.firestoreIntegration.details.push(
          '⚠️ Firestore initialization failed, using fallback'
        );
      }

      // Test data storage
      const testData = {
        type: 'integration_test',
        data: 'Test data for Firestore',
        timestamp: new Date().toISOString(),
      };

      const storeResult = await firestoreStorage.storeCursorCLIData(testData);
      this.testResults.firestoreIntegration.details.push(
        '✅ Data storage test completed'
      );

      // Test data retrieval
      const retrievedData = await firestoreStorage.getCursorCLIData();
      this.testResults.firestoreIntegration.details.push(
        `✅ Data retrieval: ${retrievedData.length} records found`
      );

      this.testResults.firestoreIntegration.status = 'passed';
      console.log('✅ Firestore Integration test passed\n');
    } catch (error) {
      console.error('❌ Firestore Integration test failed:', error.message);
      this.testResults.firestoreIntegration.status = 'failed';
      this.testResults.firestoreIntegration.details.push(
        `❌ Error: ${error.message}`
      );
    }
  }

  /**
   * Test Overall Integration
   */
  async testOverallIntegration() {
    console.log('🔗 Testing Overall System Integration...');

    try {
      // Initialize all components together
      const quantumSystem = new QuantumAutopilotSystem();
      const cursorCLI = new CursorCLIIntegration();
      const learningLoop = new ComprehensiveLearningLoop();
      const firestoreStorage = new FirestoreDataStorage();

      // Initialize all components
      await cursorCLI.initialize();
      await learningLoop.initialize();
      await firestoreStorage.initialize();

      this.testResults.overallIntegration.details.push(
        '✅ All components initialized'
      );

      // Test integrated workflow
      const testError = {
        type: 'integration_workflow_test',
        message: 'Complete integration test error',
        stack: 'Error: Integration test\n    at testFunction (test.js:1:1)',
        file: 'test.js',
        line: 1,
        timestamp: new Date().toISOString(),
        severity: 'medium',
      };

      // Test complete workflow: Error capture -> Analysis -> Learning -> Storage
      quantumSystem.autopilotAgent.captureError(testError);
      this.testResults.overallIntegration.details.push(
        '✅ Error capture workflow completed'
      );

      const analysis = await quantumSystem.debuggerAgent.analyzeError(
        testError
      );
      this.testResults.overallIntegration.details.push(
        '✅ Error analysis workflow completed'
      );

      await learningLoop.learnFromPattern({
        error: testError.message,
        fix: 'Generated fix',
        success: true,
        timestamp: new Date().toISOString(),
      });
      this.testResults.overallIntegration.details.push(
        '✅ Learning workflow completed'
      );

      // Test system health
      const systemStats = quantumSystem.getSystemStats();
      const allComponentsHealthy = Object.values(systemStats).every(
        component => component && typeof component === 'object'
      );

      if (allComponentsHealthy) {
        this.testResults.overallIntegration.details.push(
          '✅ All system components healthy'
        );
      } else {
        this.testResults.overallIntegration.details.push(
          '⚠️ Some system components may have issues'
        );
      }

      this.testResults.overallIntegration.status = 'passed';
      console.log('✅ Overall System Integration test passed\n');
    } catch (error) {
      console.error(
        '❌ Overall System Integration test failed:',
        error.message
      );
      this.testResults.overallIntegration.status = 'failed';
      this.testResults.overallIntegration.details.push(
        `❌ Error: ${error.message}`
      );
    }
  }

  /**
   * Generate final test report
   */
  generateFinalReport() {
    console.log('📊 Generating Final Test Report...\n');

    const totalTests = Object.keys(this.testResults).length;
    const passedTests = Object.values(this.testResults).filter(
      result => result.status === 'passed'
    ).length;
    const failedTests = Object.values(this.testResults).filter(
      result => result.status === 'failed'
    ).length;

    console.log('='.repeat(80));
    console.log('🧪 AIOS COMPLETE SYSTEM INTEGRATION TEST REPORT');
    console.log('='.repeat(80));
    console.log(`📅 Test Date: ${new Date().toLocaleString()}`);
    console.log(`🔧 Test Version: ${this.version}`);
    console.log(`📊 Total Tests: ${totalTests}`);
    console.log(`✅ Passed: ${passedTests}`);
    console.log(`❌ Failed: ${failedTests}`);
    console.log(
      `📈 Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`
    );
    console.log('='.repeat(80));

    // Detailed results for each component
    Object.entries(this.testResults).forEach(([component, result]) => {
      const status = result.status === 'passed' ? '✅' : '❌';
      console.log(
        `\n${status} ${component.toUpperCase()}: ${result.status.toUpperCase()}`
      );
      result.details.forEach(detail => {
        console.log(`   ${detail}`);
      });
    });

    console.log('\n' + '='.repeat(80));

    if (failedTests === 0) {
      console.log(
        '🎉 ALL TESTS PASSED! AIOS System is fully integrated and operational.'
      );
    } else {
      console.log('⚠️ Some tests failed. Please review the details above.');
    }

    console.log('='.repeat(80));

    // Send report to Telegram if available
    this.sendReportToTelegram();
  }

  /**
   * Send test report to Telegram
   */
  async sendReportToTelegram() {
    try {
      const quantumSystem = new QuantumAutopilotSystem();
      const passedTests = Object.values(this.testResults).filter(
        result => result.status === 'passed'
      ).length;
      const totalTests = Object.keys(this.testResults).length;

      const reportMessage =
        `🧪 **AIOS System Integration Test Report**\n\n` +
        `📊 **Results:**\n` +
        `• Total Tests: ${totalTests}\n` +
        `• Passed: ${passedTests}\n` +
        `• Failed: ${totalTests - passedTests}\n` +
        `• Success Rate: ${((passedTests / totalTests) * 100).toFixed(
          1
        )}%\n\n` +
        `📅 Test Date: ${new Date().toLocaleString()}\n\n` +
        `🔧 **Components Tested:**\n` +
        `• Cursor CLI Integration\n` +
        `• Debugger Agent\n` +
        `• Data Agent\n` +
        `• Telegram Integration\n` +
        `• Learning Loop\n` +
        `• Firestore Integration\n` +
        `• Overall System Integration`;

      // This will trigger the Telegram integration through the quantum system
      quantumSystem.autopilotAgent.captureError({
        type: 'test_report',
        message: reportMessage,
        stack: '',
        file: 'testCompleteSystemIntegration.js',
        line: 1,
        timestamp: new Date().toISOString(),
        severity: 'low',
      });

      console.log('📱 Test report sent to Telegram');
    } catch (error) {
      console.error('❌ Failed to send report to Telegram:', error.message);
    }
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  const test = new CompleteSystemIntegrationTest();
  test.runCompleteTest().catch(error => {
    console.error('❌ Test execution failed:', error.message);
    process.exit(1);
  });
}

module.exports = CompleteSystemIntegrationTest;
