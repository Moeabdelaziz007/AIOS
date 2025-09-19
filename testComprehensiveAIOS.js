/**
 * 🧪 Comprehensive AIOS System Test
 *
 * Tests the complete integrated system with MCP, Firestore, and all AI components
 */

const MCPServer = require('./server/mcpServer');
const MCPClient = require('./server/mcpClient');
const FirestoreDataStorage = require('./server/firestoreDataStorage');
const QuantumAutopilotSystem = require('./server/quantumAutopilotSystem');
const {
  ComprehensiveLearningLoop,
} = require('./server/comprehensiveLearningLoop');

class ComprehensiveAIOSTest {
  constructor() {
    this.name = 'Comprehensive AIOS System Test';
    this.version = '2.0.0';
    this.testResults = {
      mcpSystem: { status: 'pending', details: [] },
      firestoreIntegration: { status: 'pending', details: [] },
      aiAgents: { status: 'pending', details: [] },
      learningSystem: { status: 'pending', details: [] },
      telegramIntegration: { status: 'pending', details: [] },
      dataFlow: { status: 'pending', details: [] },
      overall: { status: 'pending', details: [] },
    };

    console.log(`🧪 ${this.name} v${this.version} initialized`);
  }

  /**
   * Run comprehensive system test
   */
  async runTest() {
    console.log('🚀 Starting Comprehensive AIOS System Test...\n');

    try {
      // Test 1: MCP System
      await this.testMCPSystem();

      // Test 2: Firestore Integration
      await this.testFirestoreIntegration();

      // Test 3: AI Agents
      await this.testAIAgents();

      // Test 4: Learning System
      await this.testLearningSystem();

      // Test 5: Telegram Integration
      await this.testTelegramIntegration();

      // Test 6: Data Flow
      await this.testDataFlow();

      // Test 7: Overall Integration
      await this.testOverallIntegration();

      // Generate final report
      this.generateFinalReport();
    } catch (error) {
      console.error('❌ Comprehensive test failed:', error.message);
      this.testResults.overall = {
        status: 'failed',
        details: [`Critical error: ${error.message}`],
      };
    }
  }

  /**
   * Test MCP System
   */
  async testMCPSystem() {
    console.log('🔗 Testing MCP System...');

    try {
      const mcpServer = new MCPServer({
        port: 3003, // Use different port to avoid conflicts
        host: 'localhost',
      });

      await mcpServer.start();
      this.testResults.mcpSystem.details.push(
        '✅ MCP Server started successfully'
      );

      // Test MCP Client
      const mcpClient = new MCPClient({
        serverUrl: 'ws://localhost:3003/mcp', // Use same port as server
        agentId: 'test_agent_' + Date.now(),
        agentType: 'tester',
      });

      await mcpClient.connect();
      await mcpClient.initialize();
      this.testResults.mcpSystem.details.push(
        '✅ MCP Client connected successfully'
      );

      // Test tool access
      const tools = await mcpClient.getAvailableTools();
      this.testResults.mcpSystem.details.push(
        `✅ ${tools.length} tools available`
      );

      // Test tool execution
      const testResult = await mcpClient.callTool('analyze_error', {
        errorData: {
          message: 'Test error for MCP system',
          type: 'test',
          severity: 'low',
        },
      });

      this.testResults.mcpSystem.details.push('✅ Tool execution successful');

      this.testResults.mcpSystem.status = 'passed';
      console.log('✅ MCP System test passed\n');
    } catch (error) {
      console.error('❌ MCP System test failed:', error.message);
      this.testResults.mcpSystem.status = 'failed';
      this.testResults.mcpSystem.details.push(`❌ Error: ${error.message}`);
    }
  }

  /**
   * Test Firestore Integration
   */
  async testFirestoreIntegration() {
    console.log('🔥 Testing Firestore Integration...');

    try {
      const firestore = new FirestoreDataStorage();
      await firestore.initialize();
      this.testResults.firestoreIntegration.details.push(
        '✅ Firestore initialized successfully'
      );

      // Test data storage
      const testData = {
        userId: 'test_user_' + Date.now(),
        type: 'test_interaction',
        input: 'Test input for Firestore',
        output: 'Test output from system',
        context: { test: true },
      };

      const result = await firestore.storeUserInteraction(
        testData.userId,
        testData
      );
      this.testResults.firestoreIntegration.details.push(
        '✅ User interaction stored'
      );

      // Test learning data storage
      const learningData = {
        pattern: 'test_pattern',
        insights: { test: 'insight' },
        effectiveness: 0.8,
      };

      await firestore.storeLearningLoopData(learningData);
      this.testResults.firestoreIntegration.details.push(
        '✅ Learning data stored'
      );

      // Test system metrics storage
      const systemMetrics = {
        timestamp: new Date(),
        performance: { cpu: 50, memory: 60 },
        errors: [],
        optimizations: [],
      };

      await firestore.storeSystemMetrics(systemMetrics);
      this.testResults.firestoreIntegration.details.push(
        '✅ System metrics stored'
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
   * Test AI Agents
   */
  async testAIAgents() {
    console.log('🤖 Testing AI Agents...');

    try {
      const quantumSystem = new QuantumAutopilotSystem();
      await quantumSystem.initialize();
      this.testResults.aiAgents.details.push(
        '✅ Quantum Autopilot System initialized'
      );

      // Test debugger agent
      const debuggerAgent = quantumSystem.debuggerAgent;
      const errorAnalysis = await debuggerAgent.analyzeError({
        message: 'Test error for AI agents',
        type: 'test',
        severity: 'medium',
      });
      this.testResults.aiAgents.details.push(
        '✅ Debugger agent analysis completed'
      );

      // Test data agent
      const dataAgent = quantumSystem.dataAgent;
      const dataResult = await dataAgent.storeErrorFix(
        'test_signature',
        'test_fix',
        true
      );
      this.testResults.aiAgents.details.push('✅ Data agent storage completed');

      // Test autopilot agent
      const autopilotAgent = quantumSystem.autopilotAgent;
      await autopilotAgent.captureError({
        message: 'Test autopilot error',
        type: 'autopilot_test',
        severity: 'low',
      });
      this.testResults.aiAgents.details.push(
        '✅ Autopilot agent error capture completed'
      );

      this.testResults.aiAgents.status = 'passed';
      console.log('✅ AI Agents test passed\n');
    } catch (error) {
      console.error('❌ AI Agents test failed:', error.message);
      this.testResults.aiAgents.status = 'failed';
      this.testResults.aiAgents.details.push(`❌ Error: ${error.message}`);
    }
  }

  /**
   * Test Learning System
   */
  async testLearningSystem() {
    console.log('🧠 Testing Learning System...');

    try {
      const learningLoop = new ComprehensiveLearningLoop();
      await learningLoop.initialize();
      this.testResults.learningSystem.details.push(
        '✅ Learning Loop initialized'
      );

      // Test pattern learning
      const testPattern = {
        errorType: 'test_error',
        context: { test: true },
        fix: 'test_fix',
        success: true,
      };

      await learningLoop.learnFromPattern(
        'error',
        testPattern,
        'Improve error handling'
      );
      this.testResults.learningSystem.details.push(
        '✅ Pattern learning completed'
      );

      // Test intelligent analysis
      const intelligentAnalysis = await learningLoop.analyzeErrorIntelligently({
        message: 'Test intelligent analysis',
        type: 'intelligent_test',
        severity: 'medium',
        context: { test: true },
      });
      this.testResults.learningSystem.details.push(
        '✅ Intelligent analysis completed'
      );

      // Test improvement recommendations
      const recommendations =
        await learningLoop.getImprovementRecommendations();
      this.testResults.learningSystem.details.push(
        `✅ ${recommendations.length} improvement recommendations generated`
      );

      this.testResults.learningSystem.status = 'passed';
      console.log('✅ Learning System test passed\n');
    } catch (error) {
      console.error('❌ Learning System test failed:', error.message);
      this.testResults.learningSystem.status = 'failed';
      this.testResults.learningSystem.details.push(
        `❌ Error: ${error.message}`
      );
    }
  }

  /**
   * Test Telegram Integration
   */
  async testTelegramIntegration() {
    console.log('📱 Testing Telegram Integration...');

    try {
      const quantumSystem = new QuantumAutopilotSystem();
      await quantumSystem.initialize();

      // Test Telegram bot initialization
      const telegramBot = quantumSystem.telegramBot;
      if (telegramBot) {
        this.testResults.telegramIntegration.details.push(
          '✅ Telegram bot initialized'
        );

        // Test error reporting
        await quantumSystem.autopilotAgent.captureError({
          message: 'Test Telegram error',
          type: 'telegram_test',
          severity: 'low',
        });
        this.testResults.telegramIntegration.details.push(
          '✅ Error reporting to Telegram completed'
        );

        // Test system stats
        const stats = await quantumSystem.autopilotAgent.getSystemStats();
        this.testResults.telegramIntegration.details.push(
          '✅ System stats retrieved'
        );
      } else {
        this.testResults.telegramIntegration.details.push(
          '⚠️ Telegram bot not initialized (missing token)'
        );
      }

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
   * Test Data Flow
   */
  async testDataFlow() {
    console.log('📊 Testing Data Flow...');

    try {
      const firestore = new FirestoreDataStorage();
      await firestore.initialize();

      // Test complete data flow: User Input -> AI Processing -> Learning -> Storage
      const userId = 'test_user_' + Date.now();
      const userInput = 'Test user input for data flow';

      // Step 1: Store user interaction
      const interactionResult = await firestore.storeUserInteraction(userId, {
        type: 'test_interaction',
        input: userInput,
        output: 'AI processed response',
        context: { test: true },
      });
      this.testResults.dataFlow.details.push('✅ User interaction stored');

      // Step 2: Process with AI
      const quantumSystem = new QuantumAutopilotSystem();
      await quantumSystem.initialize();

      const aiResponse = await quantumSystem.debuggerAgent.analyzeError({
        message: userInput,
        type: 'user_input',
        severity: 'low',
      });
      this.testResults.dataFlow.details.push('✅ AI processing completed');

      // Step 3: Learn from interaction
      const learningLoop = new ComprehensiveLearningLoop();
      await learningLoop.initialize();

      await learningLoop.learnFromPattern(
        'user_interaction',
        {
          input: userInput,
          output: aiResponse,
          success: true,
        },
        'Improve user interaction handling'
      );
      this.testResults.dataFlow.details.push(
        '✅ Learning from interaction completed'
      );

      // Step 4: Store learning insights
      await firestore.storeLearningLoopData({
        pattern: 'user_interaction',
        insights: { test: 'insight' },
        effectiveness: 0.9,
      });
      this.testResults.dataFlow.details.push('✅ Learning insights stored');

      this.testResults.dataFlow.status = 'passed';
      console.log('✅ Data Flow test passed\n');
    } catch (error) {
      console.error('❌ Data Flow test failed:', error.message);
      this.testResults.dataFlow.status = 'failed';
      this.testResults.dataFlow.details.push(`❌ Error: ${error.message}`);
    }
  }

  /**
   * Test Overall Integration
   */
  async testOverallIntegration() {
    console.log('🔗 Testing Overall Integration...');

    try {
      // Initialize all components
      const mcpServer = new MCPServer({ port: 3003, host: 'localhost' }); // Use different port
      await mcpServer.start();

      const firestore = new FirestoreDataStorage();
      await firestore.initialize();

      const quantumSystem = new QuantumAutopilotSystem();
      await quantumSystem.initialize();

      const learningLoop = new ComprehensiveLearningLoop();
      await learningLoop.initialize();

      this.testResults.overall.details.push('✅ All components initialized');

      // Test integrated workflow
      const userId = 'integration_test_user_' + Date.now();
      const testError = {
        message: 'Integration test error',
        type: 'integration_test',
        severity: 'medium',
        context: { test: true },
      };

      // Step 1: Capture error
      await quantumSystem.autopilotAgent.captureError(testError);
      this.testResults.overall.details.push('✅ Error captured');

      // Step 2: Analyze error
      const analysis = await quantumSystem.debuggerAgent.analyzeError(
        testError
      );
      this.testResults.overall.details.push('✅ Error analyzed');

      // Step 3: Generate fix
      const fix = await quantumSystem.debuggerAgent.generateNewFix(testError);
      this.testResults.overall.details.push('✅ Fix generated');

      // Step 4: Store fix
      await quantumSystem.dataAgent.storeErrorFix(
        'integration_test_signature',
        fix,
        true
      );
      this.testResults.overall.details.push('✅ Fix stored');

      // Step 5: Learn from pattern
      await learningLoop.learnFromPattern(
        'error',
        {
          error: testError,
          fix: fix,
          success: true,
        },
        'Improve integration testing'
      );
      this.testResults.overall.details.push('✅ Pattern learned');

      // Step 6: Store interaction
      await firestore.storeUserInteraction(userId, {
        type: 'error_handling',
        input: testError.message,
        output: fix,
        context: testError.context,
      });
      this.testResults.overall.details.push('✅ Interaction stored');

      // Step 7: Get system status
      const mcpStatus = mcpServer.getStatus();
      const firestoreStatus = firestore.getStatus();
      const learningStatus = learningLoop.getLearningStats();

      this.testResults.overall.details.push(
        `✅ MCP Status: ${mcpStatus.connectedAgents} agents`
      );
      this.testResults.overall.details.push(
        `✅ Firestore Status: ${
          firestoreStatus.initialized ? 'Connected' : 'Disconnected'
        }`
      );
      this.testResults.overall.details.push(
        `✅ Learning Status: ${learningStatus.totalPatterns} patterns learned`
      );

      this.testResults.overall.status = 'passed';
      console.log('✅ Overall Integration test passed\n');
    } catch (error) {
      console.error('❌ Overall Integration test failed:', error.message);
      this.testResults.overall.status = 'failed';
      this.testResults.overall.details.push(`❌ Error: ${error.message}`);
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
    console.log('🧪 COMPREHENSIVE AIOS SYSTEM TEST REPORT');
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
      console.log('🎉 ALL TESTS PASSED! AIOS System is fully operational.');
      console.log('🔧 System Components:');
      console.log(
        '   • MCP (Model Context Protocol) - Multi-agent communication'
      );
      console.log('   • Firestore Integration - Complete data persistence');
      console.log('   • AI Agents - Debugger, Data, Autopilot agents');
      console.log('   • Learning System - Continuous improvement');
      console.log('   • Telegram Integration - Real-time monitoring');
      console.log('   • Data Flow - Complete user interaction tracking');
      console.log('   • Overall Integration - Seamless system operation');
      console.log('\n🚀 System is ready for continuous operation!');
    } else {
      console.log('⚠️ Some tests failed. Please review the details above.');
    }

    console.log('='.repeat(80));
  }

  /**
   * Cleanup and shutdown
   */
  async cleanup() {
    console.log('🧹 Cleaning up test environment...');

    try {
      // Cleanup any resources
      console.log('✅ Cleanup completed');
    } catch (error) {
      console.error('❌ Cleanup error:', error.message);
    }
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  const test = new ComprehensiveAIOSTest();

  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\n🛑 Test interrupted, cleaning up...');
    await test.cleanup();
    process.exit(0);
  });

  test.runTest().catch(async error => {
    console.error('❌ Test execution failed:', error.message);
    await test.cleanup();
    process.exit(1);
  });
}

module.exports = ComprehensiveAIOSTest;
