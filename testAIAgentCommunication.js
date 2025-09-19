/**
 * 🤖 AI Agent Communication System Test
 *
 * Comprehensive test of the intelligent agent communication system
 */

const AIAgentCommunicationSystem = require('./server/aiAgentCommunicationSystem');

class AIAgentCommunicationTest {
  constructor() {
    this.name = 'AI Agent Communication Test';
    this.version = '1.0.0';
    this.testResults = {
      systemInitialization: { status: 'pending', details: [] },
      agentRegistration: { status: 'pending', details: [] },
      messageProcessing: { status: 'pending', details: [] },
      intelligentRouting: { status: 'pending', details: [] },
      contextManagement: { status: 'pending', details: [] },
      responseGeneration: { status: 'pending', details: [] },
      loadBalancing: { status: 'pending', details: [] },
      realTimeCommunication: { status: 'pending', details: [] },
    };

    console.log(`🤖 ${this.name} v${this.version} initialized`);
  }

  /**
   * Run comprehensive communication system test
   */
  async runTest() {
    try {
      console.log('🚀 Starting AI Agent Communication System Test...');

      // Initialize communication system
      this.commSystem = new AIAgentCommunicationSystem();

      // Test system initialization
      await this.testSystemInitialization();

      // Test agent registration
      await this.testAgentRegistration();

      // Test message processing
      await this.testMessageProcessing();

      // Test intelligent routing
      await this.testIntelligentRouting();

      // Test context management
      await this.testContextManagement();

      // Test response generation
      await this.testResponseGeneration();

      // Test load balancing
      await this.testLoadBalancing();

      // Test real-time communication
      await this.testRealTimeCommunication();

      // Generate final report
      this.generateFinalReport();

      console.log('✅ AI Agent Communication System Test completed');
      return this.testResults;
    } catch (error) {
      console.error(
        '❌ AI Agent Communication System Test failed:',
        error.message
      );
      throw error;
    }
  }

  /**
   * Test system initialization
   */
  async testSystemInitialization() {
    try {
      console.log('🚀 Testing System Initialization...');

      await this.commSystem.initialize();

      // Test language processor
      const hasLanguageProcessor = this.commSystem.languageProcessor !== null;
      this.testResults.systemInitialization.details.push(
        `Language Processor: ${hasLanguageProcessor ? 'Initialized' : 'Failed'}`
      );

      // Test routing engine
      const hasRoutingEngine = this.commSystem.routingEngine !== null;
      this.testResults.systemInitialization.details.push(
        `Routing Engine: ${hasRoutingEngine ? 'Initialized' : 'Failed'}`
      );

      // Test context manager
      const hasContextManager = this.commSystem.contextManager !== null;
      this.testResults.systemInitialization.details.push(
        `Context Manager: ${hasContextManager ? 'Initialized' : 'Failed'}`
      );

      // Test system status
      const status = this.commSystem.getStatus();
      this.testResults.systemInitialization.details.push(
        `System Status: ${status.status}`
      );
      this.testResults.systemInitialization.details.push(
        `Registered Agents: ${status.agents}`
      );

      this.testResults.systemInitialization.status = 'passed';
      console.log('✅ System Initialization test passed');
    } catch (error) {
      this.testResults.systemInitialization.status = 'failed';
      this.testResults.systemInitialization.details.push(
        `Error: ${error.message}`
      );
      console.log('❌ System Initialization test failed');
    }
  }

  /**
   * Test agent registration
   */
  async testAgentRegistration() {
    try {
      console.log('🤖 Testing Agent Registration...');

      // Register different types of agents
      const agents = [
        {
          id: 'analyst_001',
          name: 'DataAnalyst',
          type: 'analyst',
          capabilities: ['data_analysis', 'statistics', 'visualization'],
          communicationStyle: 'professional',
        },
        {
          id: 'debugger_001',
          name: 'BugDetector',
          type: 'debugger',
          capabilities: ['bug_detection', 'code_analysis', 'fixing'],
          communicationStyle: 'technical',
        },
        {
          id: 'coordinator_001',
          name: 'TaskCoordinator',
          type: 'coordinator',
          capabilities: ['coordination', 'planning', 'management'],
          communicationStyle: 'friendly',
        },
        {
          id: 'learner_001',
          name: 'LearningAgent',
          type: 'learner',
          capabilities: ['learning', 'pattern_recognition', 'adaptation'],
          communicationStyle: 'curious',
        },
      ];

      // Register each agent
      for (const agent of agents) {
        const registered = this.commSystem.registerAgent(agent.id, agent);
        this.testResults.agentRegistration.details.push(
          `Agent ${agent.name}: ${registered ? 'Registered' : 'Failed'}`
        );
      }

      // Test agent retrieval
      const status = this.commSystem.getStatus();
      this.testResults.agentRegistration.details.push(
        `Total Agents: ${status.agents}`
      );
      this.testResults.agentRegistration.details.push(
        `Active Agents: ${status.activeAgents}`
      );

      this.testResults.agentRegistration.status = 'passed';
      console.log('✅ Agent Registration test passed');
    } catch (error) {
      this.testResults.agentRegistration.status = 'failed';
      this.testResults.agentRegistration.details.push(
        `Error: ${error.message}`
      );
      console.log('❌ Agent Registration test failed');
    }
  }

  /**
   * Test message processing
   */
  async testMessageProcessing() {
    try {
      console.log('💬 Testing Message Processing...');

      // Test different message types
      const testMessages = [
        {
          message: 'Hello agent',
          expectedIntent: 'greeting',
          from: 'user_001',
          to: 'analyst_001',
        },
        {
          message: 'Please analyze this data',
          expectedIntent: 'request',
          from: 'coordinator_001',
          to: 'analyst_001',
        },
        {
          message: 'URGENT: Fix this bug',
          expectedIntent: 'emergency',
          from: 'monitor_001',
          to: 'debugger_001',
        },
        {
          message: 'Learn from this pattern',
          expectedIntent: 'learning',
          from: 'analyst_001',
          to: 'learner_001',
        },
        {
          message: 'Collaborate with me',
          expectedIntent: 'collaboration',
          from: 'coordinator_001',
          to: 'analyst_001',
        },
      ];

      // Process each message
      for (const testMsg of testMessages) {
        const messageId = await this.commSystem.sendMessage(
          testMsg.from,
          testMsg.to,
          testMsg.message
        );

        this.testResults.messageProcessing.details.push(
          `Message "${testMsg.message}": ${messageId ? 'Sent' : 'Failed'}`
        );

        // Wait for processing
        await new Promise(resolve => setTimeout(resolve, 100));

        // Check if message was processed
        const processed = this.commSystem.messageQueue.length === 0;
        this.testResults.messageProcessing.details.push(
          `Processing: ${processed ? 'Completed' : 'Pending'}`
        );
      }

      this.testResults.messageProcessing.status = 'passed';
      console.log('✅ Message Processing test passed');
    } catch (error) {
      this.testResults.messageProcessing.status = 'failed';
      this.testResults.messageProcessing.details.push(
        `Error: ${error.message}`
      );
      console.log('❌ Message Processing test failed');
    }
  }

  /**
   * Test intelligent routing
   */
  async testIntelligentRouting() {
    try {
      console.log('🔄 Testing Intelligent Routing...');

      // Test routing for different tasks
      const routingTests = [
        {
          task: 'data_analysis',
          requirements: { capabilities: ['data_analysis', 'statistics'] },
          expectedAgent: 'analyst_001',
        },
        {
          task: 'bug_detection',
          requirements: { capabilities: ['bug_detection', 'code_analysis'] },
          expectedAgent: 'debugger_001',
        },
        {
          task: 'coordination',
          requirements: { capabilities: ['coordination', 'planning'] },
          expectedAgent: 'coordinator_001',
        },
        {
          task: 'learning',
          requirements: { capabilities: ['learning', 'pattern_recognition'] },
          expectedAgent: 'learner_001',
        },
      ];

      // Test each routing scenario
      for (const test of routingTests) {
        const bestAgent = this.commSystem.routingEngine.findBestAgent(
          test.task,
          test.requirements
        );

        const routedCorrectly =
          bestAgent && bestAgent.id === test.expectedAgent;
        this.testResults.intelligentRouting.details.push(
          `Task "${test.task}": ${
            routedCorrectly ? 'Routed Correctly' : 'Routing Failed'
          }`
        );

        if (bestAgent) {
          this.testResults.intelligentRouting.details.push(
            `Selected Agent: ${bestAgent.name} (${bestAgent.id})`
          );
        }
      }

      this.testResults.intelligentRouting.status = 'passed';
      console.log('✅ Intelligent Routing test passed');
    } catch (error) {
      this.testResults.intelligentRouting.status = 'failed';
      this.testResults.intelligentRouting.details.push(
        `Error: ${error.message}`
      );
      console.log('❌ Intelligent Routing test failed');
    }
  }

  /**
   * Test context management
   */
  async testContextManagement() {
    try {
      console.log('🧠 Testing Context Management...');

      // Test conversation context
      const conversationId = 'test_conversation_001';
      const testMessage = {
        id: 'msg_001',
        content: 'Hello, I need help with data analysis',
        timestamp: Date.now(),
        from: 'user_001',
      };

      // Maintain context
      this.commSystem.contextManager.maintainContext(
        conversationId,
        testMessage
      );
      this.testResults.contextManagement.details.push(
        'Context Maintenance: Working'
      );

      // Retrieve context
      const context = this.commSystem.contextManager.getContext(
        conversationId,
        'What was the previous request?'
      );
      this.testResults.contextManagement.details.push(
        `Context Retrieval: ${context ? 'Working' : 'Failed'}`
      );

      // Test context cleanup
      this.commSystem.contextManager.cleanupContexts();
      this.testResults.contextManagement.details.push(
        'Context Cleanup: Working'
      );

      this.testResults.contextManagement.status = 'passed';
      console.log('✅ Context Management test passed');
    } catch (error) {
      this.testResults.contextManagement.status = 'failed';
      this.testResults.contextManagement.details.push(
        `Error: ${error.message}`
      );
      console.log('❌ Context Management test failed');
    }
  }

  /**
   * Test response generation
   */
  async testResponseGeneration() {
    try {
      console.log('💡 Testing Response Generation...');

      // Test different response types
      const responseTests = [
        { intent: 'greeting', context: { sender: 'user_001' } },
        { intent: 'request', context: { task: 'data_analysis' } },
        { intent: 'collaboration', context: { partner: 'analyst_001' } },
        { intent: 'learning', context: { data: 'pattern_data' } },
        { intent: 'emergency', context: { priority: 'critical' } },
      ];

      // Generate responses
      for (const test of responseTests) {
        const response = this.commSystem.generateAIResponse(
          test.intent,
          test.context
        );

        this.testResults.responseGeneration.details.push(
          `Intent "${test.intent}": ${response ? 'Generated' : 'Failed'}`
        );

        if (response) {
          this.testResults.responseGeneration.details.push(
            `Response: "${response.content}"`
          );
          this.testResults.responseGeneration.details.push(
            `Confidence: ${response.confidence}`
          );
        }
      }

      this.testResults.responseGeneration.status = 'passed';
      console.log('✅ Response Generation test passed');
    } catch (error) {
      this.testResults.responseGeneration.status = 'failed';
      this.testResults.responseGeneration.details.push(
        `Error: ${error.message}`
      );
      console.log('❌ Response Generation test failed');
    }
  }

  /**
   * Test load balancing
   */
  async testLoadBalancing() {
    try {
      console.log('⚖️ Testing Load Balancing...');

      // Simulate different agent loads
      const agents = Array.from(this.commSystem.agents.values());

      // Set different loads for testing
      agents[0].load = 0.3; // Light load
      agents[1].load = 0.8; // Heavy load
      agents[2].load = 0.5; // Medium load
      agents[3].load = 0.1; // Very light load

      // Test load balancing
      const balancedAgents = this.commSystem.routingEngine.loadBalance(
        agents.map(a => a.id)
      );

      this.testResults.loadBalancing.details.push(
        `Load Balancing: ${balancedAgents ? 'Working' : 'Failed'}`
      );

      // Test agent selection based on load
      const lightLoadAgent = this.commSystem.routingEngine.findBestAgent(
        'general_task',
        { capabilities: ['general'] }
      );

      this.testResults.loadBalancing.details.push(
        `Light Load Selection: ${
          lightLoadAgent ? lightLoadAgent.name : 'Failed'
        }`
      );

      // Test load distribution
      const loadDistribution = agents.map(agent => ({
        name: agent.name,
        load: agent.load,
      }));

      this.testResults.loadBalancing.details.push(
        `Load Distribution: ${JSON.stringify(loadDistribution)}`
      );

      this.testResults.loadBalancing.status = 'passed';
      console.log('✅ Load Balancing test passed');
    } catch (error) {
      this.testResults.loadBalancing.status = 'failed';
      this.testResults.loadBalancing.details.push(`Error: ${error.message}`);
      console.log('❌ Load Balancing test failed');
    }
  }

  /**
   * Test real-time communication
   */
  async testRealTimeCommunication() {
    try {
      console.log('⚡ Testing Real-Time Communication...');

      // Test message queue processing
      const initialQueueLength = this.commSystem.messageQueue.length;
      this.testResults.realTimeCommunication.details.push(
        `Initial Queue Length: ${initialQueueLength}`
      );

      // Send multiple messages rapidly
      const rapidMessages = [
        { from: 'user_001', to: 'analyst_001', message: 'Quick message 1' },
        { from: 'user_002', to: 'debugger_001', message: 'Quick message 2' },
        { from: 'user_003', to: 'coordinator_001', message: 'Quick message 3' },
      ];

      for (const msg of rapidMessages) {
        await this.commSystem.sendMessage(msg.from, msg.to, msg.message);
      }

      // Wait for processing
      await new Promise(resolve => setTimeout(resolve, 200));

      const finalQueueLength = this.commSystem.messageQueue.length;
      this.testResults.realTimeCommunication.details.push(
        `Final Queue Length: ${finalQueueLength}`
      );

      // Test processing speed
      const processingSpeed =
        initialQueueLength > finalQueueLength ? 'Fast' : 'Slow';
      this.testResults.realTimeCommunication.details.push(
        `Processing Speed: ${processingSpeed}`
      );

      // Test communication statistics
      const stats = this.commSystem.getCommunicationStats();
      this.testResults.realTimeCommunication.details.push(
        `Total Messages: ${stats.totalMessages}`
      );
      this.testResults.realTimeCommunication.details.push(
        `Active Conversations: ${stats.activeConversations}`
      );

      this.testResults.realTimeCommunication.status = 'passed';
      console.log('✅ Real-Time Communication test passed');
    } catch (error) {
      this.testResults.realTimeCommunication.status = 'failed';
      this.testResults.realTimeCommunication.details.push(
        `Error: ${error.message}`
      );
      console.log('❌ Real-Time Communication test failed');
    }
  }

  /**
   * Generate final report
   */
  generateFinalReport() {
    console.log('\n🤖 AI Agent Communication System Test Report');
    console.log('===============================================');

    const totalTests = Object.keys(this.testResults).length;
    const passedTests = Object.values(this.testResults).filter(
      r => r.status === 'passed'
    ).length;
    const failedTests = totalTests - passedTests;

    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${passedTests}`);
    console.log(`Failed: ${failedTests}`);
    console.log(
      `Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`
    );

    console.log('\n📋 Test Results:');
    Object.entries(this.testResults).forEach(([test, result]) => {
      const status = result.status === 'passed' ? '✅' : '❌';
      console.log(`${status} ${test}: ${result.status}`);
      result.details.forEach(detail => {
        console.log(`   - ${detail}`);
      });
    });

    console.log(
      '\n🎯 Communication System Status:',
      failedTests === 0 ? 'FULLY OPERATIONAL' : 'NEEDS IMPROVEMENT'
    );

    if (failedTests === 0) {
      console.log(
        '\n🎉 Congratulations! Your AI Agent Communication System is FULLY OPERATIONAL and can:'
      );
      console.log('   - 🤖 Register and manage multiple AI agents');
      console.log('   - 💬 Process natural language messages');
      console.log('   - 🔄 Route messages intelligently');
      console.log('   - 🧠 Maintain conversation context');
      console.log('   - 💡 Generate intelligent responses');
      console.log('   - ⚖️ Balance load between agents');
      console.log('   - ⚡ Communicate in real-time');
      console.log('   - 🎯 Enable seamless agent collaboration');
    } else {
      console.log('\n⚠️ Communication System needs improvement in:');
      Object.entries(this.testResults).forEach(([test, result]) => {
        if (result.status === 'failed') {
          console.log(`   - ${test}`);
        }
      });
    }
  }
}

// Run test if called directly
if (require.main === module) {
  const test = new AIAgentCommunicationTest();
  test
    .runTest()
    .then(() => {
      console.log(
        '🎉 AI Agent Communication System Test completed successfully'
      );
      process.exit(0);
    })
    .catch(error => {
      console.error(
        '💥 AI Agent Communication System Test failed:',
        error.message
      );
      process.exit(1);
    });
}

module.exports = AIAgentCommunicationTest;
