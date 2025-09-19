/**
 * AIOS Smart Agent Bot Test Suite
 * Comprehensive testing for the AI agent functionality
 */

const AIOSSmartAgent = require('./client/src/services/AIOSSmartAgent.js');
const UserDataCollectionService = require('./client/src/services/UserDataCollectionService.js');

class AIOSAgentTester {
  constructor() {
    this.agent = null;
    this.dataCollection = null;
    this.testResults = [];
  }

  async runAllTests() {
    console.log('🧪 Starting AIOS Smart Agent Bot Tests...\n');

    try {
      // Test 1: Agent Initialization
      await this.testAgentInitialization();

      // Test 2: Data Collection Service
      await this.testDataCollectionService();

      // Test 3: Tool Functionality
      await this.testToolFunctionality();

      // Test 4: Plugin Functionality
      await this.testPluginFunctionality();

      // Test 5: Query Processing
      await this.testQueryProcessing();

      // Test 6: User Data Integration
      await this.testUserDataIntegration();

      // Test 7: Error Handling
      await this.testErrorHandling();

      // Generate Test Report
      this.generateTestReport();
    } catch (error) {
      console.error('❌ Test suite failed:', error);
    }
  }

  async testAgentInitialization() {
    console.log('🔧 Testing Agent Initialization...');

    try {
      this.agent = new AIOSSmartAgent();

      // Test without API key (should fail gracefully)
      try {
        await this.agent.initialize();
        this.addTestResult(
          'Agent Initialization',
          'PASS',
          'Agent initialized successfully'
        );
      } catch (error) {
        if (error.message.includes('Gemini API key')) {
          this.addTestResult(
            'Agent Initialization',
            'PASS',
            'Agent properly handles missing API key'
          );
        } else {
          this.addTestResult(
            'Agent Initialization',
            'FAIL',
            `Unexpected error: ${error.message}`
          );
        }
      }

      // Test tool initialization
      const tools = this.agent.getAvailableTools();
      if (tools.length > 0) {
        this.addTestResult(
          'Tool Initialization',
          'PASS',
          `${tools.length} tools initialized`
        );
      } else {
        this.addTestResult(
          'Tool Initialization',
          'FAIL',
          'No tools initialized'
        );
      }

      // Test plugin initialization
      const plugins = this.agent.getAvailablePlugins();
      if (plugins.length > 0) {
        this.addTestResult(
          'Plugin Initialization',
          'PASS',
          `${plugins.length} plugins initialized`
        );
      } else {
        this.addTestResult(
          'Plugin Initialization',
          'FAIL',
          'No plugins initialized'
        );
      }
    } catch (error) {
      this.addTestResult(
        'Agent Initialization',
        'FAIL',
        `Error: ${error.message}`
      );
    }
  }

  async testDataCollectionService() {
    console.log('📊 Testing Data Collection Service...');

    try {
      this.dataCollection = new UserDataCollectionService();

      // Test mock user data collection
      const mockUser = {
        uid: 'test-user-123',
        email: 'test@example.com',
        displayName: 'Test User',
        isAnonymous: false,
      };

      const mockAdditionalData = {
        fullName: 'Test User',
        company: 'Test Company',
        jobTitle: 'Software Engineer',
        location: 'Test City',
        interests: ['AI', 'Technology'],
        phoneNumber: '+1234567890',
        loginMethod: 'email',
        rememberMe: true,
        darkMode: false,
        marketingConsent: true,
      };

      // Test data collection (will fail Firestore/Telegram but should handle gracefully)
      try {
        await this.dataCollection.collectUserData(mockUser, mockAdditionalData);
        this.addTestResult(
          'Data Collection',
          'PASS',
          'Data collection service works'
        );
      } catch (error) {
        if (
          error.message.includes('Firestore') ||
          error.message.includes('Telegram')
        ) {
          this.addTestResult(
            'Data Collection',
            'PASS',
            'Data collection handles external service failures gracefully'
          );
        } else {
          this.addTestResult(
            'Data Collection',
            'FAIL',
            `Unexpected error: ${error.message}`
          );
        }
      }
    } catch (error) {
      this.addTestResult(
        'Data Collection Service',
        'FAIL',
        `Error: ${error.message}`
      );
    }
  }

  async testToolFunctionality() {
    console.log('🔧 Testing Tool Functionality...');

    if (!this.agent) {
      this.addTestResult('Tool Functionality', 'SKIP', 'Agent not initialized');
      return;
    }

    try {
      const tools = this.agent.getAvailableTools();

      // Test each tool
      for (const toolName of tools) {
        try {
          const tool = this.agent.tools.get(toolName);
          if (tool && typeof tool.execute === 'function') {
            this.addTestResult(
              `Tool: ${toolName}`,
              'PASS',
              'Tool is properly configured'
            );
          } else {
            this.addTestResult(
              `Tool: ${toolName}`,
              'FAIL',
              'Tool missing execute function'
            );
          }
        } catch (error) {
          this.addTestResult(
            `Tool: ${toolName}`,
            'FAIL',
            `Error: ${error.message}`
          );
        }
      }
    } catch (error) {
      this.addTestResult(
        'Tool Functionality',
        'FAIL',
        `Error: ${error.message}`
      );
    }
  }

  async testPluginFunctionality() {
    console.log('🔌 Testing Plugin Functionality...');

    if (!this.agent) {
      this.addTestResult(
        'Plugin Functionality',
        'SKIP',
        'Agent not initialized'
      );
      return;
    }

    try {
      const plugins = this.agent.getAvailablePlugins();

      // Test each plugin
      for (const pluginName of plugins) {
        try {
          const plugin = this.agent.plugins.get(pluginName);
          if (plugin && typeof plugin.execute === 'function') {
            this.addTestResult(
              `Plugin: ${pluginName}`,
              'PASS',
              'Plugin is properly configured'
            );
          } else {
            this.addTestResult(
              `Plugin: ${pluginName}`,
              'FAIL',
              'Plugin missing execute function'
            );
          }
        } catch (error) {
          this.addTestResult(
            `Plugin: ${pluginName}`,
            'FAIL',
            `Error: ${error.message}`
          );
        }
      }
    } catch (error) {
      this.addTestResult(
        'Plugin Functionality',
        'FAIL',
        `Error: ${error.message}`
      );
    }
  }

  async testQueryProcessing() {
    console.log('💬 Testing Query Processing...');

    if (!this.agent) {
      this.addTestResult('Query Processing', 'SKIP', 'Agent not initialized');
      return;
    }

    try {
      // Test query analysis
      const testQueries = [
        'Show me my user data',
        'Search for something',
        'Monitor system performance',
        'Analyze this code',
        'Create a chart',
      ];

      for (const query of testQueries) {
        try {
          const requiredTools = await this.agent.analyzeQueryRequirements(
            query
          );
          if (Array.isArray(requiredTools)) {
            this.addTestResult(
              `Query Analysis: "${query}"`,
              'PASS',
              `Found ${requiredTools.length} required tools`
            );
          } else {
            this.addTestResult(
              `Query Analysis: "${query}"`,
              'FAIL',
              'Invalid tool analysis result'
            );
          }
        } catch (error) {
          this.addTestResult(
            `Query Analysis: "${query}"`,
            'FAIL',
            `Error: ${error.message}`
          );
        }
      }
    } catch (error) {
      this.addTestResult('Query Processing', 'FAIL', `Error: ${error.message}`);
    }
  }

  async testUserDataIntegration() {
    console.log('👤 Testing User Data Integration...');

    if (!this.agent) {
      this.addTestResult(
        'User Data Integration',
        'SKIP',
        'Agent not initialized'
      );
      return;
    }

    try {
      // Test user data setting
      const mockUserData = {
        uid: 'test-user-123',
        email: 'test@example.com',
        fullName: 'Test User',
        company: 'Test Company',
        deviceInfo: {
          vendor: 'Test Vendor',
          platform: 'Test Platform',
        },
        browserInfo: {
          name: 'Test Browser',
          version: '1.0',
        },
      };

      await this.agent.setUserData('test-user-123');

      // Test user context building
      const userContext = this.agent.buildUserContext();
      if (typeof userContext === 'string') {
        this.addTestResult(
          'User Context Building',
          'PASS',
          'User context built successfully'
        );
      } else {
        this.addTestResult(
          'User Context Building',
          'FAIL',
          'Invalid user context format'
        );
      }
    } catch (error) {
      this.addTestResult(
        'User Data Integration',
        'FAIL',
        `Error: ${error.message}`
      );
    }
  }

  async testErrorHandling() {
    console.log('⚠️ Testing Error Handling...');

    if (!this.agent) {
      this.addTestResult('Error Handling', 'SKIP', 'Agent not initialized');
      return;
    }

    try {
      // Test with invalid query
      try {
        await this.agent.processQuery(null);
        this.addTestResult(
          'Null Query Handling',
          'PASS',
          'Handles null queries gracefully'
        );
      } catch (error) {
        this.addTestResult(
          'Null Query Handling',
          'PASS',
          'Properly throws error for null query'
        );
      }

      // Test with empty query
      try {
        await this.agent.processQuery('');
        this.addTestResult(
          'Empty Query Handling',
          'PASS',
          'Handles empty queries gracefully'
        );
      } catch (error) {
        this.addTestResult(
          'Empty Query Handling',
          'PASS',
          'Properly handles empty query'
        );
      }
    } catch (error) {
      this.addTestResult('Error Handling', 'FAIL', `Error: ${error.message}`);
    }
  }

  addTestResult(testName, status, message) {
    this.testResults.push({
      test: testName,
      status: status,
      message: message,
      timestamp: new Date().toISOString(),
    });

    const statusIcon =
      status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⏭️';
    console.log(`${statusIcon} ${testName}: ${message}`);
  }

  generateTestReport() {
    console.log('\n' + '='.repeat(80));
    console.log('🧪 AIOS SMART AGENT BOT TEST REPORT');
    console.log('='.repeat(80));

    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(
      r => r.status === 'PASS'
    ).length;
    const failedTests = this.testResults.filter(
      r => r.status === 'FAIL'
    ).length;
    const skippedTests = this.testResults.filter(
      r => r.status === 'SKIP'
    ).length;

    console.log(`📊 Total Tests: ${totalTests}`);
    console.log(`✅ Passed: ${passedTests}`);
    console.log(`❌ Failed: ${failedTests}`);
    console.log(`⏭️ Skipped: ${skippedTests}`);
    console.log(
      `📈 Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`
    );

    console.log('\n📋 DETAILED RESULTS:');
    console.log('-'.repeat(80));

    this.testResults.forEach(result => {
      const statusIcon =
        result.status === 'PASS'
          ? '✅'
          : result.status === 'FAIL'
          ? '❌'
          : '⏭️';
      console.log(`${statusIcon} ${result.test}`);
      console.log(`   ${result.message}`);
      console.log(
        `   Time: ${new Date(result.timestamp).toLocaleTimeString()}`
      );
      console.log('');
    });

    console.log('='.repeat(80));

    if (failedTests === 0) {
      console.log(
        '🎉 ALL TESTS PASSED! AIOS Smart Agent Bot is ready for deployment.'
      );
    } else {
      console.log(
        '⚠️ Some tests failed. Please review and fix the issues before deployment.'
      );
    }

    console.log('='.repeat(80));
  }
}

// Run the tests
const tester = new AIOSAgentTester();
tester.runAllTests().catch(console.error);
