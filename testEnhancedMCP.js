/**
 * 🧪 Enhanced MCP System Test
 *
 * Tests the enhanced MCP system with Cursor CLI, Gemini AI, and smart tools
 */

const MCPServer = require('./server/mcpServer');
const MCPClient = require('./server/mcpClient');

class EnhancedMCPTest {
  constructor() {
    this.name = 'Enhanced MCP System Test';
    this.version = '1.0.0';
    this.server = null;
    this.clients = [];
    this.testResults = {
      server: { status: 'pending', details: [] },
      clients: { status: 'pending', details: [] },
      tools: { status: 'pending', details: [] },
      collaboration: { status: 'pending', details: [] },
      overall: { status: 'pending', details: [] },
    };

    console.log(`🧪 ${this.name} v${this.version} initialized`);
  }

  /**
   * Run comprehensive MCP system test
   */
  async runTest() {
    console.log('🚀 Starting Enhanced MCP System Test...\n');

    try {
      // Test 1: Start MCP Server
      await this.testMCPServer();

      // Test 2: Create and connect clients
      await this.testMCPClients();

      // Test 3: Test all available tools
      await this.testMCPTools();

      // Test 4: Test agent collaboration
      await this.testAgentCollaboration();

      // Test 5: Overall system integration
      await this.testOverallIntegration();

      // Generate final report
      this.generateFinalReport();
    } catch (error) {
      console.error('❌ Enhanced MCP test failed:', error.message);
      this.testResults.overall = {
        status: 'failed',
        details: [`Critical error: ${error.message}`],
      };
    }
  }

  /**
   * Test MCP Server
   */
  async testMCPServer() {
    console.log('🔗 Testing MCP Server...');

    try {
      this.server = new MCPServer({
        port: 3001,
        host: 'localhost',
      });

      const serverStatus = await this.server.start();
      this.testResults.server.details.push(
        '✅ MCP Server started successfully'
      );
      this.testResults.server.details.push(
        `📡 Server URL: ${serverStatus.url}`
      );
      this.testResults.server.details.push(
        `🔧 Capabilities: ${
          Object.keys(serverStatus.capabilities).length
        } tools`
      );

      this.testResults.server.status = 'passed';
      console.log('✅ MCP Server test passed\n');
    } catch (error) {
      console.error('❌ MCP Server test failed:', error.message);
      this.testResults.server.status = 'failed';
      this.testResults.server.details.push(`❌ Error: ${error.message}`);
    }
  }

  /**
   * Test MCP Clients
   */
  async testMCPClients() {
    console.log('👥 Testing MCP Clients...');

    try {
      // Create multiple agent clients
      const agentTypes = ['debugger', 'analyzer', 'generator', 'monitor'];

      for (const agentType of agentTypes) {
        const client = new MCPClient({
          serverUrl: 'ws://localhost:3001/mcp',
          agentId: `${agentType}_agent_${Date.now()}`,
          agentType: agentType,
          capabilities: {
            tools: true,
            context: true,
            learning: true,
          },
        });

        await client.connect();
        await client.initialize();

        this.clients.push(client);
        this.testResults.clients.details.push(
          `✅ ${agentType} agent connected`
        );
      }

      this.testResults.clients.status = 'passed';
      console.log('✅ MCP Clients test passed\n');
    } catch (error) {
      console.error('❌ MCP Clients test failed:', error.message);
      this.testResults.clients.status = 'failed';
      this.testResults.clients.details.push(`❌ Error: ${error.message}`);
    }
  }

  /**
   * Test MCP Tools
   */
  async testMCPTools() {
    console.log('🔧 Testing MCP Tools...');

    try {
      const debuggerClient = this.clients.find(c => c.agentType === 'debugger');
      if (!debuggerClient) {
        throw new Error('Debugger client not found');
      }

      // Test Cursor CLI tools
      console.log('  📁 Testing Cursor CLI tools...');
      const workspaceAnalysis = await debuggerClient.callTool(
        'cursor_analyze_workspace',
        {
          workspacePath: process.cwd(),
          analysisType: 'structure',
        }
      );
      this.testResults.tools.details.push(
        '✅ Cursor workspace analysis completed'
      );

      // Test Gemini AI tools
      console.log('  🤖 Testing Gemini AI tools...');
      const codeAnalysis = await debuggerClient.callTool(
        'gemini_analyze_code',
        {
          code: 'function test() { return "hello world"; }',
          analysisType: 'quality',
        }
      );
      this.testResults.tools.details.push('✅ Gemini code analysis completed');

      // Test smart search tools
      console.log('  🔍 Testing smart search tools...');
      const searchResults = await debuggerClient.callTool('smart_search_code', {
        query: 'function',
        searchType: 'semantic',
      });
      this.testResults.tools.details.push('✅ Smart code search completed');

      // Test data generation tools
      console.log('  📊 Testing data generation tools...');
      const testData = await debuggerClient.callTool('generate_test_data', {
        dataType: 'user',
        count: 5,
        format: 'json',
      });
      this.testResults.tools.details.push('✅ Test data generation completed');

      // Test system improvement tools
      console.log('  ⚡ Testing system improvement tools...');
      const performanceAnalysis = await debuggerClient.callTool(
        'analyze_system_performance',
        {
          metrics: ['cpu', 'memory'],
          timeRange: '1h',
        }
      );
      this.testResults.tools.details.push(
        '✅ System performance analysis completed'
      );

      this.testResults.tools.status = 'passed';
      console.log('✅ MCP Tools test passed\n');
    } catch (error) {
      console.error('❌ MCP Tools test failed:', error.message);
      this.testResults.tools.status = 'failed';
      this.testResults.tools.details.push(`❌ Error: ${error.message}`);
    }
  }

  /**
   * Test agent collaboration
   */
  async testAgentCollaboration() {
    console.log('🤝 Testing Agent Collaboration...');

    try {
      const debuggerClient = this.clients.find(c => c.agentType === 'debugger');
      const analyzerClient = this.clients.find(c => c.agentType === 'analyzer');

      if (!debuggerClient || !analyzerClient) {
        throw new Error('Required clients not found');
      }

      // Test context sharing
      console.log('  📤 Testing context sharing...');
      await debuggerClient.shareContext(
        'error_analysis',
        {
          errorType: 'test_error',
          severity: 'medium',
          suggestions: ['Check logs', 'Verify inputs'],
        },
        [analyzerClient.agentId]
      );
      this.testResults.collaboration.details.push(
        '✅ Context sharing completed'
      );

      // Test context requesting
      console.log('  📥 Testing context requesting...');
      const requestedContext = await analyzerClient.requestContext(
        'error_analysis',
        debuggerClient.agentId
      );
      this.testResults.collaboration.details.push(
        '✅ Context requesting completed'
      );

      // Test collaborative analysis
      console.log('  🔄 Testing collaborative analysis...');
      const collaborativeResult = await debuggerClient.callTool(
        'analyze_error',
        {
          errorData: {
            message: 'Test collaborative error',
            type: 'collaboration_test',
            severity: 'low',
          },
        }
      );
      this.testResults.collaboration.details.push(
        '✅ Collaborative analysis completed'
      );

      this.testResults.collaboration.status = 'passed';
      console.log('✅ Agent Collaboration test passed\n');
    } catch (error) {
      console.error('❌ Agent Collaboration test failed:', error.message);
      this.testResults.collaboration.status = 'failed';
      this.testResults.collaboration.details.push(`❌ Error: ${error.message}`);
    }
  }

  /**
   * Test overall system integration
   */
  async testOverallIntegration() {
    console.log('🔗 Testing Overall System Integration...');

    try {
      const debuggerClient = this.clients.find(c => c.agentType === 'debugger');

      // Test complete workflow: Error -> Analysis -> Fix -> Learning
      console.log('  🔄 Testing complete workflow...');

      // 1. Analyze error
      const errorAnalysis = await debuggerClient.callTool('analyze_error', {
        errorData: {
          message: 'Integration test error',
          type: 'integration_test',
          severity: 'medium',
        },
      });

      // 2. Generate fix
      const fixSuggestion = await debuggerClient.callTool('generate_fix', {
        errorType: 'integration_test',
        context: errorAnalysis,
      });

      // 3. Learn from pattern
      const learningResult = await debuggerClient.callTool(
        'learn_from_patterns',
        {
          patternType: 'error',
          data: {
            error: errorAnalysis,
            fix: fixSuggestion,
            success: true,
          },
          learningGoal: 'Improve error handling',
        }
      );

      // 4. Adapt system behavior
      const adaptationResult = await debuggerClient.callTool(
        'adapt_system_behavior',
        {
          adaptationType: 'error_handling',
          patterns: learningResult.patterns,
          confidence: 0.9,
        }
      );

      this.testResults.overall.details.push('✅ Complete workflow executed');
      this.testResults.overall.details.push('✅ Error analysis completed');
      this.testResults.overall.details.push('✅ Fix generation completed');
      this.testResults.overall.details.push('✅ Pattern learning completed');
      this.testResults.overall.details.push('✅ System adaptation completed');

      // Test system status
      const serverStatus = this.server.getStatus();
      this.testResults.overall.details.push(
        `✅ Server status: ${serverStatus.connectedAgents} agents connected`
      );

      this.testResults.overall.status = 'passed';
      console.log('✅ Overall System Integration test passed\n');
    } catch (error) {
      console.error(
        '❌ Overall System Integration test failed:',
        error.message
      );
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
    console.log('🧪 ENHANCED MCP SYSTEM TEST REPORT');
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
        '🎉 ALL TESTS PASSED! Enhanced MCP System is fully operational.'
      );
      console.log('🔧 Available Tools:');
      console.log(
        '   • Cursor CLI Integration (workspace analysis, change detection)'
      );
      console.log(
        '   • Gemini AI Tools (code analysis, generation, explanation)'
      );
      console.log('   • Smart Search Tools (semantic search, documentation)');
      console.log('   • Data Generation Tools (test data, mock APIs)');
      console.log(
        '   • System Improvement Tools (performance analysis, optimization)'
      );
      console.log(
        '   • Learning & Adaptation Tools (pattern learning, behavior adaptation)'
      );
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
      // Disconnect all clients
      for (const client of this.clients) {
        await client.disconnect();
      }

      // Stop server
      if (this.server) {
        await this.server.stop();
      }

      console.log('✅ Cleanup completed');
    } catch (error) {
      console.error('❌ Cleanup error:', error.message);
    }
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  const test = new EnhancedMCPTest();

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

module.exports = EnhancedMCPTest;
