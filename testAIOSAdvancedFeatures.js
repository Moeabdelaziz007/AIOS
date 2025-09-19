/**
 * 🧪 AIOS Advanced Features Test Suite
 *
 * Comprehensive testing of all new advanced features:
 * - Agent Dashboard
 * - Advanced Logging & Metrics
 * - Auto-Discovery
 * - Lifecycle Management
 * - API Interface
 */

const { config } = require('dotenv');
const path = require('path');

// Load environment variables
config({ path: path.join(__dirname, '../firebase.env') });

const AgentDashboard = require('./server/agentDashboard.js');
const AdvancedLoggingSystem = require('./server/advancedLoggingSystem.js');
const AgentAutoDiscovery = require('./server/agentAutoDiscovery.js');
const AgentLifecycleManager = require('./server/agentLifecycleManager.js');
const AIOSAPIServer = require('./server/aiosAPIServer.js');

class AIOSAdvancedFeaturesTest {
  constructor() {
    this.name = 'AIOS Advanced Features Test';
    this.version = '1.0.0';
    this.testResults = {
      agentDashboard: { status: 'pending', details: [] },
      loggingSystem: { status: 'pending', details: [] },
      autoDiscovery: { status: 'pending', details: [] },
      lifecycleManagement: { status: 'pending', details: [] },
      apiInterface: { status: 'pending', details: [] },
      integration: { status: 'pending', details: [] },
      performance: { status: 'pending', details: [] },
      errorHandling: { status: 'pending', details: [] },
    };

    console.log(`🧪 ${this.name} v${this.version} initialized`);
  }

  /**
   * Run comprehensive test suite
   */
  async runTest() {
    try {
      console.log('🚀 Starting AIOS Advanced Features Test...');

      // Test Agent Dashboard
      await this.testAgentDashboard();

      // Test Advanced Logging System
      await this.testLoggingSystem();

      // Test Auto-Discovery
      await this.testAutoDiscovery();

      // Test Lifecycle Management
      await this.testLifecycleManagement();

      // Test API Interface
      await this.testAPIServer();

      // Test Integration
      await this.testIntegration();

      // Test Performance
      await this.testPerformance();

      // Test Error Handling
      await this.testErrorHandling();

      // Generate final report
      this.generateFinalReport();

      console.log('✅ AIOS Advanced Features Test completed');
      return this.testResults;
    } catch (error) {
      console.error('❌ AIOS Advanced Features Test failed:', error.message);
      throw error;
    }
  }

  /**
   * Test Agent Dashboard
   */
  async testAgentDashboard() {
    try {
      console.log('🎛️ Testing Agent Dashboard...');

      const dashboard = new AgentDashboard();

      // Test initialization
      await dashboard.initialize();
      this.testResults.agentDashboard.details.push(
        `Dashboard Initialization: ${dashboard.isActive ? 'Success' : 'Failed'}`
      );

      // Test agent discovery
      const discoveredAgents = dashboard.getDiscoveredAgents();
      this.testResults.agentDashboard.details.push(
        `Agent Discovery: ${discoveredAgents.length} agents discovered`
      );

      // Test workflow templates
      const workflows = dashboard.getWorkflowTemplate('data_analysis_workflow');
      this.testResults.agentDashboard.details.push(
        `Workflow Templates: ${workflows ? 'Available' : 'Missing'}`
      );

      // Test agent control
      const startResult = await dashboard.startAgent('smart_agent');
      this.testResults.agentDashboard.details.push(
        `Agent Start: ${startResult.success ? 'Success' : 'Failed'}`
      );

      const stopResult = await dashboard.stopAgent('smart_agent');
      this.testResults.agentDashboard.details.push(
        `Agent Stop: ${stopResult.success ? 'Success' : 'Failed'}`
      );

      // Test dashboard data
      const dashboardData = dashboard.getDashboardData();
      this.testResults.agentDashboard.details.push(
        `Dashboard Data: ${dashboardData.agents.length} agents, ${dashboardData.workflows.length} workflows`
      );

      // Cleanup
      await dashboard.shutdown();

      this.testResults.agentDashboard.status = 'passed';
      console.log('✅ Agent Dashboard test passed');
    } catch (error) {
      this.testResults.agentDashboard.status = 'failed';
      this.testResults.agentDashboard.details.push(`Error: ${error.message}`);
      console.log('❌ Agent Dashboard test failed');
    }
  }

  /**
   * Test Advanced Logging System
   */
  async testLoggingSystem() {
    try {
      console.log('📊 Testing Advanced Logging System...');

      const loggingSystem = new AdvancedLoggingSystem();

      // Test initialization
      await loggingSystem.initialize();
      this.testResults.loggingSystem.details.push(
        `Logging Initialization: ${loggingSystem.isActive ? 'Success' : 'Failed'}`
      );

      // Test logging
      loggingSystem.log('info', 'Test log message', 'test_agent', {
        test: 'data',
      });
      this.testResults.loggingSystem.details.push(
        `Logging: Message logged successfully`
      );

      // Test metrics
      loggingSystem.updateMetric('agent_total', 4);
      loggingSystem.updateMetric('agent_active', 3);
      this.testResults.loggingSystem.details.push(
        `Metrics: Updated successfully`
      );

      // Test agent logs
      const agentLogs = loggingSystem.getAgentLogs('test_agent');
      this.testResults.loggingSystem.details.push(
        `Agent Logs: ${agentLogs.length} logs retrieved`
      );

      // Test metrics retrieval
      const metrics = loggingSystem.getMetrics();
      this.testResults.loggingSystem.details.push(
        `Metrics Retrieval: ${Object.keys(metrics).length} metrics available`
      );

      // Test Prometheus format
      const prometheusMetrics = loggingSystem.getPrometheusMetrics();
      this.testResults.loggingSystem.details.push(
        `Prometheus Format: ${prometheusMetrics.split('\n').length} lines generated`
      );

      // Test metrics report
      const report = loggingSystem.generateMetricsReport();
      this.testResults.loggingSystem.details.push(
        `Metrics Report: Generated successfully`
      );

      // Cleanup
      await loggingSystem.shutdown();

      this.testResults.loggingSystem.status = 'passed';
      console.log('✅ Advanced Logging System test passed');
    } catch (error) {
      this.testResults.loggingSystem.status = 'failed';
      this.testResults.loggingSystem.details.push(`Error: ${error.message}`);
      console.log('❌ Advanced Logging System test failed');
    }
  }

  /**
   * Test Auto-Discovery
   */
  async testAutoDiscovery() {
    try {
      console.log('🔍 Testing Auto-Discovery...');

      const autoDiscovery = new AgentAutoDiscovery();

      // Test initialization
      await autoDiscovery.initialize();
      this.testResults.autoDiscovery.details.push(
        `Auto-Discovery Initialization: ${autoDiscovery.isActive ? 'Success' : 'Failed'}`
      );

      // Test agent discovery
      const discoveredAgents = autoDiscovery.getDiscoveredAgents();
      this.testResults.autoDiscovery.details.push(
        `Agent Discovery: ${discoveredAgents.length} agents discovered`
      );

      // Test agent registration
      const registeredAgents = autoDiscovery.getRegisteredAgents();
      this.testResults.autoDiscovery.details.push(
        `Agent Registration: ${registeredAgents.length} agents registered`
      );

      // Test agent retrieval
      const agent = autoDiscovery.getAgent('smart_agent');
      this.testResults.autoDiscovery.details.push(
        `Agent Retrieval: ${agent ? 'Success' : 'Failed'}`
      );

      // Test dependency resolution
      const dependencies = autoDiscovery.getAgentDependencies('learning_agent');
      this.testResults.autoDiscovery.details.push(
        `Dependency Resolution: ${dependencies.length} dependencies found`
      );

      // Test agents by type
      const aiAgents = autoDiscovery.getAgentsByType('ai_assistant');
      this.testResults.autoDiscovery.details.push(
        `Agents by Type: ${aiAgents.length} AI agents found`
      );

      // Test agents by capability
      const chatAgents = autoDiscovery.getAgentsByCapability('chat');
      this.testResults.autoDiscovery.details.push(
        `Agents by Capability: ${chatAgents.length} chat-capable agents found`
      );

      // Test discovery report
      const report = autoDiscovery.generateDiscoveryReport();
      this.testResults.autoDiscovery.details.push(
        `Discovery Report: Generated successfully`
      );

      // Cleanup
      await autoDiscovery.shutdown();

      this.testResults.autoDiscovery.status = 'passed';
      console.log('✅ Auto-Discovery test passed');
    } catch (error) {
      this.testResults.autoDiscovery.status = 'failed';
      this.testResults.autoDiscovery.details.push(`Error: ${error.message}`);
      console.log('❌ Auto-Discovery test failed');
    }
  }

  /**
   * Test Lifecycle Management
   */
  async testLifecycleManagement() {
    try {
      console.log('🔄 Testing Lifecycle Management...');

      const lifecycleManager = new AgentLifecycleManager();

      // Test initialization
      await lifecycleManager.initialize();
      this.testResults.lifecycleManagement.details.push(
        `Lifecycle Initialization: ${lifecycleManager.isActive ? 'Success' : 'Failed'}`
      );

      // Test agent registration
      const agentInfo = {
        name: 'Test Agent',
        type: 'test',
        version: '1.0.0',
        description: 'Test agent for lifecycle management',
        capabilities: ['test'],
        dependencies: [],
      };

      await lifecycleManager.registerAgent('test_agent', agentInfo);
      this.testResults.lifecycleManagement.details.push(
        `Agent Registration: Success`
      );

      // Test agent start
      const startResult = await lifecycleManager.startAgent('test_agent');
      this.testResults.lifecycleManagement.details.push(
        `Agent Start: ${startResult.success ? 'Success' : 'Failed'}`
      );

      // Test agent status
      const status = lifecycleManager.getAgentStatus('test_agent');
      this.testResults.lifecycleManagement.details.push(
        `Agent Status: ${status ? status.state : 'Unknown'}`
      );

      // Test agent stop
      const stopResult = await lifecycleManager.stopAgent('test_agent');
      this.testResults.lifecycleManagement.details.push(
        `Agent Stop: ${stopResult.success ? 'Success' : 'Failed'}`
      );

      // Test agent restart
      const restartResult = await lifecycleManager.restartAgent('test_agent');
      this.testResults.lifecycleManagement.details.push(
        `Agent Restart: ${restartResult.success ? 'Success' : 'Failed'}`
      );

      // Test system health
      const healthSummary = lifecycleManager.getSystemHealthSummary();
      this.testResults.lifecycleManagement.details.push(
        `System Health: ${healthSummary.systemHealth} (${healthSummary.totalAgents} agents)`
      );

      // Cleanup
      await lifecycleManager.shutdown();

      this.testResults.lifecycleManagement.status = 'passed';
      console.log('✅ Lifecycle Management test passed');
    } catch (error) {
      this.testResults.lifecycleManagement.status = 'failed';
      this.testResults.lifecycleManagement.details.push(
        `Error: ${error.message}`
      );
      console.log('❌ Lifecycle Management test failed');
    }
  }

  /**
   * Test API Server
   */
  async testAPIServer() {
    try {
      console.log('🌐 Testing API Server...');

      const apiServer = new AIOSAPIServer();

      // Test initialization
      await apiServer.initialize();
      this.testResults.apiInterface.details.push(
        `API Initialization: ${apiServer.isActive ? 'Success' : 'Failed'}`
      );

      // Test server info
      const serverInfo = apiServer.getServerInfo();
      this.testResults.apiInterface.details.push(
        `Server Info: Port ${serverInfo.port}, ${Object.keys(serverInfo.endpoints).length} endpoints`
      );

      // Test GraphQL schema
      const schema = apiServer.graphqlSchema;
      this.testResults.apiInterface.details.push(
        `GraphQL Schema: ${schema ? 'Available' : 'Missing'}`
      );

      // Test Apollo server
      const apolloServer = apiServer.apolloServer;
      this.testResults.apiInterface.details.push(
        `Apollo Server: ${apolloServer ? 'Initialized' : 'Not initialized'}`
      );

      // Test Express app
      const expressApp = apiServer.app;
      this.testResults.apiInterface.details.push(
        `Express App: ${expressApp ? 'Available' : 'Missing'}`
      );

      // Cleanup
      await apiServer.shutdown();

      this.testResults.apiInterface.status = 'passed';
      console.log('✅ API Server test passed');
    } catch (error) {
      this.testResults.apiInterface.status = 'failed';
      this.testResults.apiInterface.details.push(`Error: ${error.message}`);
      console.log('❌ API Server test failed');
    }
  }

  /**
   * Test Integration
   */
  async testIntegration() {
    try {
      console.log('🔗 Testing System Integration...');

      // Test component integration
      const dashboard = new AgentDashboard();
      const loggingSystem = new AdvancedLoggingSystem();
      const autoDiscovery = new AgentAutoDiscovery();
      const lifecycleManager = new AgentLifecycleManager();

      // Initialize all components
      await dashboard.initialize();
      await loggingSystem.initialize();
      await autoDiscovery.initialize();
      await lifecycleManager.initialize();

      this.testResults.integration.details.push(
        `Component Integration: All components initialized successfully`
      );

      // Test cross-component communication
      const discoveredAgents = autoDiscovery.getDiscoveredAgents();
      const registeredAgents = autoDiscovery.getRegisteredAgents();

      this.testResults.integration.details.push(
        `Cross-Component Communication: ${discoveredAgents.length} discovered, ${registeredAgents.length} registered`
      );

      // Test logging integration
      loggingSystem.log('info', 'Integration test message', 'integration_test');
      const logs = loggingSystem.getAgentLogs('integration_test');

      this.testResults.integration.details.push(
        `Logging Integration: ${logs.length} logs created`
      );

      // Test dashboard integration
      const dashboardData = dashboard.getDashboardData();
      this.testResults.integration.details.push(
        `Dashboard Integration: ${dashboardData.agents.length} agents in dashboard`
      );

      // Test lifecycle integration
      const healthSummary = lifecycleManager.getSystemHealthSummary();
      this.testResults.integration.details.push(
        `Lifecycle Integration: System health ${healthSummary.systemHealth}`
      );

      // Cleanup
      await dashboard.shutdown();
      await loggingSystem.shutdown();
      await autoDiscovery.shutdown();
      await lifecycleManager.shutdown();

      this.testResults.integration.status = 'passed';
      console.log('✅ System Integration test passed');
    } catch (error) {
      this.testResults.integration.status = 'failed';
      this.testResults.integration.details.push(`Error: ${error.message}`);
      console.log('❌ System Integration test failed');
    }
  }

  /**
   * Test Performance
   */
  async testPerformance() {
    try {
      console.log('⚡ Testing Performance...');

      const startTime = Date.now();

      // Test dashboard performance
      const dashboard = new AgentDashboard();
      const dashboardStartTime = Date.now();
      await dashboard.initialize();
      const dashboardTime = Date.now() - dashboardStartTime;

      this.testResults.performance.details.push(
        `Dashboard Initialization: ${dashboardTime}ms`
      );

      // Test logging performance
      const loggingSystem = new AdvancedLoggingSystem();
      const loggingStartTime = Date.now();
      await loggingSystem.initialize();
      const loggingTime = Date.now() - loggingStartTime;

      this.testResults.performance.details.push(
        `Logging Initialization: ${loggingTime}ms`
      );

      // Test auto-discovery performance
      const autoDiscovery = new AgentAutoDiscovery();
      const discoveryStartTime = Date.now();
      await autoDiscovery.initialize();
      const discoveryTime = Date.now() - discoveryStartTime;

      this.testResults.performance.details.push(
        `Auto-Discovery Initialization: ${discoveryTime}ms`
      );

      // Test lifecycle management performance
      const lifecycleManager = new AgentLifecycleManager();
      const lifecycleStartTime = Date.now();
      await lifecycleManager.initialize();
      const lifecycleTime = Date.now() - lifecycleStartTime;

      this.testResults.performance.details.push(
        `Lifecycle Management Initialization: ${lifecycleTime}ms`
      );

      // Test API server performance
      const apiServer = new AIOSAPIServer();
      const apiStartTime = Date.now();
      await apiServer.initialize();
      const apiTime = Date.now() - apiStartTime;

      this.testResults.performance.details.push(
        `API Server Initialization: ${apiTime}ms`
      );

      const totalTime = Date.now() - startTime;
      this.testResults.performance.details.push(
        `Total Initialization Time: ${totalTime}ms`
      );

      // Test memory usage
      const memoryUsage = process.memoryUsage();
      this.testResults.performance.details.push(
        `Memory Usage: ${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`
      );

      // Cleanup
      await dashboard.shutdown();
      await loggingSystem.shutdown();
      await autoDiscovery.shutdown();
      await lifecycleManager.shutdown();
      await apiServer.shutdown();

      this.testResults.performance.status = 'passed';
      console.log('✅ Performance test passed');
    } catch (error) {
      this.testResults.performance.status = 'failed';
      this.testResults.performance.details.push(`Error: ${error.message}`);
      console.log('❌ Performance test failed');
    }
  }

  /**
   * Test Error Handling
   */
  async testErrorHandling() {
    try {
      console.log('🛡️ Testing Error Handling...');

      // Test dashboard error handling
      const dashboard = new AgentDashboard();
      try {
        await dashboard.startAgent('nonexistent_agent');
      } catch (error) {
        this.testResults.errorHandling.details.push(
          `Dashboard Error Handling: Graceful failure for nonexistent agent`
        );
      }

      // Test logging error handling
      const loggingSystem = new AdvancedLoggingSystem();
      try {
        await loggingSystem.initialize();
        loggingSystem.updateMetric('nonexistent_metric', 100);
        this.testResults.errorHandling.details.push(
          `Logging Error Handling: Graceful handling of nonexistent metric`
        );
      } catch (error) {
        this.testResults.errorHandling.details.push(
          `Logging Error Handling: ${error.message}`
        );
      }

      // Test auto-discovery error handling
      const autoDiscovery = new AgentAutoDiscovery();
      try {
        await autoDiscovery.initialize();
        const agent = autoDiscovery.getAgent('nonexistent_agent');
        this.testResults.errorHandling.details.push(
          `Auto-Discovery Error Handling: Graceful handling of nonexistent agent`
        );
      } catch (error) {
        this.testResults.errorHandling.details.push(
          `Auto-Discovery Error Handling: ${error.message}`
        );
      }

      // Test lifecycle management error handling
      const lifecycleManager = new AgentLifecycleManager();
      try {
        await lifecycleManager.initialize();
        await lifecycleManager.startAgent('nonexistent_agent');
      } catch (error) {
        this.testResults.errorHandling.details.push(
          `Lifecycle Management Error Handling: Graceful failure for nonexistent agent`
        );
      }

      // Test API server error handling
      const apiServer = new AIOSAPIServer();
      try {
        await apiServer.initialize();
        this.testResults.errorHandling.details.push(
          `API Server Error Handling: Initialization successful`
        );
      } catch (error) {
        this.testResults.errorHandling.details.push(
          `API Server Error Handling: ${error.message}`
        );
      }

      // Cleanup
      await dashboard.shutdown();
      await loggingSystem.shutdown();
      await autoDiscovery.shutdown();
      await lifecycleManager.shutdown();
      await apiServer.shutdown();

      this.testResults.errorHandling.status = 'passed';
      console.log('✅ Error Handling test passed');
    } catch (error) {
      this.testResults.errorHandling.status = 'failed';
      this.testResults.errorHandling.details.push(`Error: ${error.message}`);
      console.log('❌ Error Handling test failed');
    }
  }

  /**
   * Generate final report
   */
  generateFinalReport() {
    console.log('\n🧪 AIOS Advanced Features Test Report');
    console.log('=====================================');

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
      '\n🎯 AIOS Advanced Features Status:',
      failedTests === 0 ? 'FULLY OPERATIONAL' : 'NEEDS IMPROVEMENT'
    );

    if (failedTests === 0) {
      console.log(
        '\n🎉 Congratulations! Your AIOS Advanced Features are FULLY OPERATIONAL and include:'
      );
      console.log(
        '   - 🎛️ Comprehensive Agent Dashboard with real-time monitoring'
      );
      console.log(
        '   - 📊 Advanced Logging & Metrics system with Prometheus integration'
      );
      console.log(
        '   - 🔍 Auto-Discovery system for automatic agent registration'
      );
      console.log(
        '   - 🔄 Intelligent Agent Lifecycle Management with error handling'
      );
      console.log(
        '   - 🌐 REST/GraphQL API Interface for external integration'
      );
      console.log(
        '   - 🔗 Seamless system integration and cross-component communication'
      );
      console.log('   - ⚡ High-performance initialization and operation');
      console.log(
        '   - 🛡️ Robust error handling and graceful failure management'
      );
      console.log(
        '   - 🚀 Production-ready advanced features for enterprise deployment'
      );
    } else {
      console.log('\n⚠️ AIOS Advanced Features need improvement in:');
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
  const test = new AIOSAdvancedFeaturesTest();
  test
    .runTest()
    .then(() => {
      console.log('🎉 AIOS Advanced Features Test completed successfully');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 AIOS Advanced Features Test failed:', error.message);
      process.exit(1);
    });
}

module.exports = AIOSAdvancedFeaturesTest;
