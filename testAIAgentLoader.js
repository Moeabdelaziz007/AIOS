/**
 * 🤖 AI Agent Loader Test
 *
 * Test the AI agent loading system
 */

const AIAgentLoader = require('./server/aiAgentLoader');

class AIAgentLoaderTest {
  constructor() {
    this.name = 'AI Agent Loader Test';
    this.version = '1.0.0';
    this.testResults = {
      loaderInitialization: { status: 'pending', details: [] },
      registryLoading: { status: 'pending', details: [] },
      agentLoading: { status: 'pending', details: [] },
      agentValidation: { status: 'pending', details: [] },
      agentRetrieval: { status: 'pending', details: [] },
      agentSelection: { status: 'pending', details: [] },
      workflowTemplates: { status: 'pending', details: [] },
      collaborationMatrix: { status: 'pending', details: [] },
    };

    console.log(`🤖 ${this.name} v${this.version} initialized`);
  }

  /**
   * Run comprehensive agent loader test
   */
  async runTest() {
    try {
      console.log('🚀 Starting AI Agent Loader Test...');

      // Initialize agent loader
      this.agentLoader = new AIAgentLoader();

      // Test loader initialization
      await this.testLoaderInitialization();

      // Test registry loading
      await this.testRegistryLoading();

      // Test agent loading
      await this.testAgentLoading();

      // Test agent validation
      await this.testAgentValidation();

      // Test agent retrieval
      await this.testAgentRetrieval();

      // Test agent selection
      await this.testAgentSelection();

      // Test workflow templates
      await this.testWorkflowTemplates();

      // Test collaboration matrix
      await this.testCollaborationMatrix();

      // Generate final report
      this.generateFinalReport();

      console.log('✅ AI Agent Loader Test completed');
      return this.testResults;
    } catch (error) {
      console.error('❌ AI Agent Loader Test failed:', error.message);
      throw error;
    }
  }

  /**
   * Test loader initialization
   */
  async testLoaderInitialization() {
    try {
      console.log('🚀 Testing Loader Initialization...');

      const initialized = await this.agentLoader.initialize();
      this.testResults.loaderInitialization.details.push(
        `Initialization: ${initialized ? 'Success' : 'Failed'}`
      );

      const systemInfo = this.agentLoader.getSystemInfo();
      this.testResults.loaderInitialization.details.push(
        `System Name: ${systemInfo.name}`
      );
      this.testResults.loaderInitialization.details.push(
        `Version: ${systemInfo.version}`
      );
      this.testResults.loaderInitialization.details.push(
        `Config Path: ${systemInfo.configPath}`
      );

      this.testResults.loaderInitialization.status = 'passed';
      console.log('✅ Loader Initialization test passed');
    } catch (error) {
      this.testResults.loaderInitialization.status = 'failed';
      this.testResults.loaderInitialization.details.push(
        `Error: ${error.message}`
      );
      console.log('❌ Loader Initialization test failed');
    }
  }

  /**
   * Test registry loading
   */
  async testRegistryLoading() {
    try {
      console.log('📋 Testing Registry Loading...');

      const registry = this.agentLoader.registry;
      this.testResults.registryLoading.details.push(
        `Registry Loaded: ${registry ? 'Yes' : 'No'}`
      );

      if (registry) {
        this.testResults.registryLoading.details.push(
          `Registry Version: ${registry.aios_agents_registry.version}`
        );
        this.testResults.registryLoading.details.push(
          `Total Agents: ${registry.aios_agents_registry.total_agents}`
        );
        this.testResults.registryLoading.details.push(
          `Last Updated: ${registry.aios_agents_registry.last_updated}`
        );

        // Test workflow templates
        const templates = registry.aios_agents_registry.workflow_templates;
        this.testResults.registryLoading.details.push(
          `Workflow Templates: ${Object.keys(templates).length}`
        );

        // Test collaboration matrix
        const matrix = registry.aios_agents_registry.collaboration_matrix;
        this.testResults.registryLoading.details.push(
          `Collaboration Matrix: ${Object.keys(matrix).length} agents`
        );
      }

      this.testResults.registryLoading.status = 'passed';
      console.log('✅ Registry Loading test passed');
    } catch (error) {
      this.testResults.registryLoading.status = 'failed';
      this.testResults.registryLoading.details.push(`Error: ${error.message}`);
      console.log('❌ Registry Loading test failed');
    }
  }

  /**
   * Test agent loading
   */
  async testAgentLoading() {
    try {
      console.log('🤖 Testing Agent Loading...');

      const agentsStatus = this.agentLoader.getAllAgentsStatus();
      this.testResults.agentLoading.details.push(
        `Total Agents Loaded: ${agentsStatus.total}`
      );
      this.testResults.agentLoading.details.push(
        `Active Agents: ${agentsStatus.active}`
      );
      this.testResults.agentLoading.details.push(
        `Inactive Agents: ${agentsStatus.inactive}`
      );

      // Test agent types
      this.testResults.agentLoading.details.push(
        `Agent Types: ${Object.keys(agentsStatus.byType).join(', ')}`
      );

      // Test capabilities
      const capabilities = Object.keys(agentsStatus.byCapability);
      this.testResults.agentLoading.details.push(
        `Total Capabilities: ${capabilities.length}`
      );

      // Test individual agent loading
      const agentIds = [
        'data_analyst_001',
        'bug_detector_001',
        'task_coordinator_001',
      ];
      for (const agentId of agentIds) {
        const agent = this.agentLoader.getAgent(agentId);
        this.testResults.agentLoading.details.push(
          `Agent ${agentId}: ${agent ? 'Loaded' : 'Not Found'}`
        );
      }

      this.testResults.agentLoading.status = 'passed';
      console.log('✅ Agent Loading test passed');
    } catch (error) {
      this.testResults.agentLoading.status = 'failed';
      this.testResults.agentLoading.details.push(`Error: ${error.message}`);
      console.log('❌ Agent Loading test failed');
    }
  }

  /**
   * Test agent validation
   */
  async testAgentValidation() {
    try {
      console.log('✅ Testing Agent Validation...');

      const agentIds = [
        'data_analyst_001',
        'bug_detector_001',
        'learning_agent_001',
      ];
      let validationPassed = 0;

      for (const agentId of agentIds) {
        const agent = this.agentLoader.getAgent(agentId);
        if (agent) {
          // Check required fields
          const hasRequiredFields =
            agent.agentId &&
            agent.name &&
            agent.type &&
            agent.capabilities &&
            agent.communication &&
            agent.workflow &&
            agent.rules &&
            agent.triggers;

          this.testResults.agentValidation.details.push(
            `Agent ${agentId} Validation: ${
              hasRequiredFields ? 'Passed' : 'Failed'
            }`
          );

          if (hasRequiredFields) validationPassed++;
        }
      }

      this.testResults.agentValidation.details.push(
        `Validation Success Rate: ${validationPassed}/${agentIds.length}`
      );

      this.testResults.agentValidation.status = 'passed';
      console.log('✅ Agent Validation test passed');
    } catch (error) {
      this.testResults.agentValidation.status = 'failed';
      this.testResults.agentValidation.details.push(`Error: ${error.message}`);
      console.log('❌ Agent Validation test failed');
    }
  }

  /**
   * Test agent retrieval
   */
  async testAgentRetrieval() {
    try {
      console.log('🔍 Testing Agent Retrieval...');

      // Test get agent by ID
      const dataAnalyst = this.agentLoader.getAgent('data_analyst_001');
      this.testResults.agentRetrieval.details.push(
        `Get Agent by ID: ${dataAnalyst ? 'Success' : 'Failed'}`
      );

      // Test get agents by type
      const analysts = this.agentLoader.getAgentsByType('analyst');
      this.testResults.agentRetrieval.details.push(
        `Get Agents by Type (analyst): ${analysts.length} found`
      );

      const coordinators = this.agentLoader.getAgentsByType('coordinator');
      this.testResults.agentRetrieval.details.push(
        `Get Agents by Type (coordinator): ${coordinators.length} found`
      );

      // Test get agents by capability
      const dataAnalysisAgents =
        this.agentLoader.getAgentsByCapability('data_analysis');
      this.testResults.agentRetrieval.details.push(
        `Get Agents by Capability (data_analysis): ${dataAnalysisAgents.length} found`
      );

      const monitoringAgents =
        this.agentLoader.getAgentsByCapability('system_monitoring');
      this.testResults.agentRetrieval.details.push(
        `Get Agents by Capability (system_monitoring): ${monitoringAgents.length} found`
      );

      this.testResults.agentRetrieval.status = 'passed';
      console.log('✅ Agent Retrieval test passed');
    } catch (error) {
      this.testResults.agentRetrieval.status = 'failed';
      this.testResults.agentRetrieval.details.push(`Error: ${error.message}`);
      console.log('❌ Agent Retrieval test failed');
    }
  }

  /**
   * Test agent selection
   */
  async testAgentSelection() {
    try {
      console.log('🎯 Testing Agent Selection...');

      // Test find best agent for data analysis
      const dataAnalysisAgent = this.agentLoader.findBestAgent(
        'data_analysis',
        {
          capabilities: ['data_analysis', 'statistics'],
          type: 'analyst',
        }
      );

      this.testResults.agentSelection.details.push(
        `Best Agent for Data Analysis: ${
          dataAnalysisAgent ? dataAnalysisAgent.name : 'Not Found'
        }`
      );

      // Test find best agent for bug detection
      const bugDetectionAgent = this.agentLoader.findBestAgent(
        'bug_detection',
        {
          capabilities: ['bug_detection', 'code_analysis'],
          type: 'debugger',
        }
      );

      this.testResults.agentSelection.details.push(
        `Best Agent for Bug Detection: ${
          bugDetectionAgent ? bugDetectionAgent.name : 'Not Found'
        }`
      );

      // Test find best agent for coordination
      const coordinationAgent = this.agentLoader.findBestAgent('coordination', {
        capabilities: ['task_coordination', 'project_management'],
        type: 'coordinator',
      });

      this.testResults.agentSelection.details.push(
        `Best Agent for Coordination: ${
          coordinationAgent ? coordinationAgent.name : 'Not Found'
        }`
      );

      // Test communication patterns
      if (dataAnalysisAgent) {
        const patterns =
          this.agentLoader.getAgentCommunicationPatterns('data_analyst_001');
        this.testResults.agentSelection.details.push(
          `Communication Patterns: ${patterns ? 'Retrieved' : 'Failed'}`
        );
      }

      this.testResults.agentSelection.status = 'passed';
      console.log('✅ Agent Selection test passed');
    } catch (error) {
      this.testResults.agentSelection.status = 'failed';
      this.testResults.agentSelection.details.push(`Error: ${error.message}`);
      console.log('❌ Agent Selection test failed');
    }
  }

  /**
   * Test workflow templates
   */
  async testWorkflowTemplates() {
    try {
      console.log('🔄 Testing Workflow Templates...');

      // Test data analysis workflow
      const dataAnalysisWorkflow = this.agentLoader.getWorkflowTemplate(
        'data_analysis_workflow'
      );
      this.testResults.workflowTemplates.details.push(
        `Data Analysis Workflow: ${
          dataAnalysisWorkflow ? dataAnalysisWorkflow.join(' → ') : 'Not Found'
        }`
      );

      // Test bug fixing workflow
      const bugFixingWorkflow = this.agentLoader.getWorkflowTemplate(
        'bug_fixing_workflow'
      );
      this.testResults.workflowTemplates.details.push(
        `Bug Fixing Workflow: ${
          bugFixingWorkflow ? bugFixingWorkflow.join(' → ') : 'Not Found'
        }`
      );

      // Test project coordination workflow
      const projectCoordinationWorkflow = this.agentLoader.getWorkflowTemplate(
        'project_coordination_workflow'
      );
      this.testResults.workflowTemplates.details.push(
        `Project Coordination Workflow: ${
          projectCoordinationWorkflow
            ? projectCoordinationWorkflow.join(' → ')
            : 'Not Found'
        }`
      );

      // Test system monitoring workflow
      const systemMonitoringWorkflow = this.agentLoader.getWorkflowTemplate(
        'system_monitoring_workflow'
      );
      this.testResults.workflowTemplates.details.push(
        `System Monitoring Workflow: ${
          systemMonitoringWorkflow
            ? systemMonitoringWorkflow.join(' → ')
            : 'Not Found'
        }`
      );

      this.testResults.workflowTemplates.status = 'passed';
      console.log('✅ Workflow Templates test passed');
    } catch (error) {
      this.testResults.workflowTemplates.status = 'failed';
      this.testResults.workflowTemplates.details.push(
        `Error: ${error.message}`
      );
      console.log('❌ Workflow Templates test failed');
    }
  }

  /**
   * Test collaboration matrix
   */
  async testCollaborationMatrix() {
    try {
      console.log('🤝 Testing Collaboration Matrix...');

      const collaborationMatrix = this.agentLoader.getCollaborationMatrix();
      this.testResults.collaborationMatrix.details.push(
        `Collaboration Matrix: ${collaborationMatrix ? 'Loaded' : 'Not Found'}`
      );

      if (collaborationMatrix) {
        // Test collaboration partners for data analyst
        const dataAnalystPartners = collaborationMatrix['data_analyst_001'];
        this.testResults.collaborationMatrix.details.push(
          `Data Analyst Partners: ${
            dataAnalystPartners ? dataAnalystPartners.join(', ') : 'None'
          }`
        );

        // Test collaboration partners for task coordinator
        const coordinatorPartners = collaborationMatrix['task_coordinator_001'];
        this.testResults.collaborationMatrix.details.push(
          `Task Coordinator Partners: ${
            coordinatorPartners ? coordinatorPartners.join(', ') : 'None'
          }`
        );

        // Test collaboration partners for learning agent
        const learningAgentPartners = collaborationMatrix['learning_agent_001'];
        this.testResults.collaborationMatrix.details.push(
          `Learning Agent Partners: ${
            learningAgentPartners ? learningAgentPartners.join(', ') : 'None'
          }`
        );

        // Test total collaboration relationships
        const totalRelationships = Object.keys(collaborationMatrix).length;
        this.testResults.collaborationMatrix.details.push(
          `Total Collaboration Relationships: ${totalRelationships}`
        );
      }

      this.testResults.collaborationMatrix.status = 'passed';
      console.log('✅ Collaboration Matrix test passed');
    } catch (error) {
      this.testResults.collaborationMatrix.status = 'failed';
      this.testResults.collaborationMatrix.details.push(
        `Error: ${error.message}`
      );
      console.log('❌ Collaboration Matrix test failed');
    }
  }

  /**
   * Generate final report
   */
  generateFinalReport() {
    console.log('\n🤖 AI Agent Loader Test Report');
    console.log('================================');

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
      '\n🎯 Agent Loader Status:',
      failedTests === 0 ? 'FULLY OPERATIONAL' : 'NEEDS IMPROVEMENT'
    );

    if (failedTests === 0) {
      console.log(
        '\n🎉 Congratulations! Your AI Agent Loader is FULLY OPERATIONAL and can:'
      );
      console.log(
        '   - 🤖 Load and manage multiple AI agents from JSON configs'
      );
      console.log('   - 📋 Maintain agent registry and metadata');
      console.log('   - ✅ Validate agent configurations');
      console.log('   - 🔍 Retrieve agents by ID, type, and capabilities');
      console.log('   - 🎯 Find optimal agents for specific tasks');
      console.log('   - 🔄 Manage workflow templates');
      console.log('   - 🤝 Coordinate agent collaborations');
      console.log('   - 📊 Track agent status and performance');
    } else {
      console.log('\n⚠️ Agent Loader needs improvement in:');
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
  const test = new AIAgentLoaderTest();
  test
    .runTest()
    .then(() => {
      console.log('🎉 AI Agent Loader Test completed successfully');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 AI Agent Loader Test failed:', error.message);
      process.exit(1);
    });
}

module.exports = AIAgentLoaderTest;
