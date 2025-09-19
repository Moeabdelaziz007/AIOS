/**
 * 🎛️ Agent Dashboard System
 *
 * Comprehensive dashboard for managing all AIOS agents
 * with real-time status, workflow visualization, and control
 */

const fs = require('fs').promises;
const path = require('path');
const EventEmitter = require('events');

class AgentDashboard extends EventEmitter {
  constructor() {
    super();
    this.name = 'Agent Dashboard';
    this.version = '1.0.0';
    this.isActive = false;

    // Agent management
    this.agents = new Map();
    this.agentStatuses = new Map();
    this.workflowTemplates = new Map();

    // Dashboard data
    this.dashboardData = {
      agents: [],
      workflows: [],
      metrics: {},
      alerts: [],
      systemHealth: 'unknown',
    };

    // Real-time updates
    this.updateInterval = null;
    this.metricsInterval = null;

    // Agent lifecycle management
    this.agentLifecycle = new Map();
    this.errorHandlers = new Map();

    console.log(`🎛️ ${this.name} v${this.version} initialized`);
  }

  /**
   * Initialize dashboard system
   */
  async initialize() {
    try {
      console.log('🎛️ Initializing Agent Dashboard...');

      // Auto-discover agents
      await this.autoDiscoverAgents();

      // Load workflow templates
      await this.loadWorkflowTemplates();

      // Initialize agent lifecycle management
      this.initializeAgentLifecycle();

      // Setup real-time monitoring
      this.setupRealTimeMonitoring();

      // Setup error handling
      this.setupErrorHandling();

      this.isActive = true;
      console.log('✅ Agent Dashboard initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Agent Dashboard:', error);
      return false;
    }
  }

  /**
   * Auto-discover agents from configs directory
   */
  async autoDiscoverAgents() {
    try {
      console.log('🔍 Auto-discovering agents...');

      const configsDir = path.join(__dirname, '../agents/configs');

      try {
        const files = await fs.readdir(configsDir);
        const configFiles = files.filter(file => file.endsWith('.json'));

        for (const configFile of configFiles) {
          try {
            const configPath = path.join(configsDir, configFile);
            const configData = await fs.readFile(configPath, 'utf8');
            const config = JSON.parse(configData);

            const agentId = configFile.replace('.json', '');
            const agentInfo = {
              id: agentId,
              name: config.name || agentId,
              type: config.type || 'general',
              description: config.description || 'AI Agent',
              version: config.version || '1.0.0',
              status: 'discovered',
              configPath: configPath,
              config: config,
              lastSeen: new Date(),
              metrics: {
                uptime: 0,
                tasksCompleted: 0,
                errors: 0,
                performance: 0,
              },
            };

            this.agents.set(agentId, agentInfo);
            this.agentStatuses.set(agentId, 'discovered');

            console.log(`✅ Discovered agent: ${agentInfo.name} (${agentId})`);
          } catch (error) {
            console.error(
              `❌ Error loading agent config ${configFile}:`,
              error.message
            );
          }
        }

        console.log(
          `✅ Auto-discovery completed: ${this.agents.size} agents found`
        );
      } catch (error) {
        console.log(
          '⚠️ No agents configs directory found, creating sample agents'
        );
        await this.createSampleAgents();
      }
    } catch (error) {
      console.error('❌ Error in auto-discovery:', error);
    }
  }

  /**
   * Create sample agents for demonstration
   */
  async createSampleAgents() {
    const sampleAgents = [
      {
        id: 'smart_agent',
        name: 'Smart Agent',
        type: 'ai_assistant',
        description: 'AI-powered assistant with Gemini integration',
        version: '1.0.0',
        status: 'active',
        capabilities: ['chat', 'analysis', 'recommendations'],
        metrics: {
          uptime: 3600,
          tasksCompleted: 150,
          errors: 2,
          performance: 95,
        },
      },
      {
        id: 'data_agent',
        name: 'Data Agent',
        type: 'data_processor',
        description: 'Data collection and analytics agent',
        version: '1.0.0',
        status: 'active',
        capabilities: ['data_collection', 'analytics', 'reporting'],
        metrics: {
          uptime: 7200,
          tasksCompleted: 300,
          errors: 1,
          performance: 98,
        },
      },
      {
        id: 'debug_agent',
        name: 'Debug Agent',
        type: 'monitoring',
        description: 'System monitoring and error handling',
        version: '1.0.0',
        status: 'idle',
        capabilities: ['monitoring', 'debugging', 'error_handling'],
        metrics: {
          uptime: 1800,
          tasksCompleted: 50,
          errors: 0,
          performance: 92,
        },
      },
      {
        id: 'learning_agent',
        name: 'Learning Agent',
        type: 'learning',
        description: 'Pattern recognition and system learning',
        version: '1.0.0',
        status: 'active',
        capabilities: ['pattern_recognition', 'learning', 'optimization'],
        metrics: {
          uptime: 5400,
          tasksCompleted: 200,
          errors: 3,
          performance: 88,
        },
      },
    ];

    for (const agent of sampleAgents) {
      this.agents.set(agent.id, agent);
      this.agentStatuses.set(agent.id, agent.status);
    }

    console.log(`✅ Created ${sampleAgents.length} sample agents`);
  }

  /**
   * Load workflow templates
   */
  async loadWorkflowTemplates() {
    try {
      console.log('📋 Loading workflow templates...');

      const workflowTemplates = [
        {
          id: 'data_analysis_workflow',
          name: 'Data Analysis Workflow',
          description: 'Complete data analysis pipeline',
          steps: [
            {
              id: 'collect',
              name: 'Data Collection',
              agent: 'data_agent',
              status: 'pending',
            },
            {
              id: 'process',
              name: 'Data Processing',
              agent: 'data_agent',
              status: 'pending',
            },
            {
              id: 'analyze',
              name: 'Analysis',
              agent: 'smart_agent',
              status: 'pending',
            },
            {
              id: 'report',
              name: 'Report Generation',
              agent: 'smart_agent',
              status: 'pending',
            },
          ],
          status: 'template',
          estimatedDuration: 300000, // 5 minutes
        },
        {
          id: 'error_resolution_workflow',
          name: 'Error Resolution Workflow',
          description: 'Automated error detection and resolution',
          steps: [
            {
              id: 'detect',
              name: 'Error Detection',
              agent: 'debug_agent',
              status: 'pending',
            },
            {
              id: 'analyze',
              name: 'Error Analysis',
              agent: 'debug_agent',
              status: 'pending',
            },
            {
              id: 'resolve',
              name: 'Auto Resolution',
              agent: 'debug_agent',
              status: 'pending',
            },
            {
              id: 'verify',
              name: 'Verification',
              agent: 'learning_agent',
              status: 'pending',
            },
          ],
          status: 'template',
          estimatedDuration: 120000, // 2 minutes
        },
        {
          id: 'learning_optimization_workflow',
          name: 'Learning Optimization Workflow',
          description: 'System learning and optimization process',
          steps: [
            {
              id: 'collect',
              name: 'Data Collection',
              agent: 'learning_agent',
              status: 'pending',
            },
            {
              id: 'pattern',
              name: 'Pattern Recognition',
              agent: 'learning_agent',
              status: 'pending',
            },
            {
              id: 'optimize',
              name: 'Optimization',
              agent: 'learning_agent',
              status: 'pending',
            },
            {
              id: 'apply',
              name: 'Apply Changes',
              agent: 'smart_agent',
              status: 'pending',
            },
          ],
          status: 'template',
          estimatedDuration: 600000, // 10 minutes
        },
      ];

      for (const template of workflowTemplates) {
        this.workflowTemplates.set(template.id, template);
      }

      console.log(`✅ Loaded ${workflowTemplates.length} workflow templates`);
    } catch (error) {
      console.error('❌ Error loading workflow templates:', error);
    }
  }

  /**
   * Initialize agent lifecycle management
   */
  initializeAgentLifecycle() {
    console.log('🔄 Initializing agent lifecycle management...');

    // Agent lifecycle states
    const lifecycleStates = [
      'discovered',
      'initializing',
      'active',
      'idle',
      'error',
      'stopped',
    ];

    for (const state of lifecycleStates) {
      this.agentLifecycle.set(state, {
        transitions: [],
        handlers: new Map(),
        retryPolicy: {
          maxRetries: 3,
          retryDelay: 5000,
          backoffMultiplier: 2,
        },
      });
    }

    // Setup state transitions
    this.setupStateTransitions();

    console.log('✅ Agent lifecycle management initialized');
  }

  /**
   * Setup state transitions
   */
  setupStateTransitions() {
    const transitions = {
      discovered: ['initializing', 'error'],
      initializing: ['active', 'error'],
      active: ['idle', 'error', 'stopped'],
      idle: ['active', 'error', 'stopped'],
      error: ['initializing', 'stopped'],
      stopped: ['initializing'],
    };

    for (const [fromState, toStates] of Object.entries(transitions)) {
      this.agentLifecycle.get(fromState).transitions = toStates;
    }
  }

  /**
   * Setup real-time monitoring
   */
  setupRealTimeMonitoring() {
    console.log('📡 Setting up real-time monitoring...');

    // Update dashboard data every 5 seconds
    this.updateInterval = setInterval(() => {
      this.updateDashboardData();
    }, 5000);

    // Update metrics every 30 seconds
    this.metricsInterval = setInterval(() => {
      this.updateAgentMetrics();
    }, 30000);

    console.log('✅ Real-time monitoring setup completed');
  }

  /**
   * Setup error handling
   */
  setupErrorHandling() {
    console.log('🛡️ Setting up error handling...');

    // Global error handler
    this.on('agent_error', (agentId, error) => {
      this.handleAgentError(agentId, error);
    });

    // Agent status change handler
    this.on('agent_status_change', (agentId, oldStatus, newStatus) => {
      this.handleStatusChange(agentId, oldStatus, newStatus);
    });

    console.log('✅ Error handling setup completed');
  }

  /**
   * Update dashboard data
   */
  updateDashboardData() {
    try {
      this.dashboardData.agents = Array.from(this.agents.values()).map(
        agent => ({
          id: agent.id,
          name: agent.name,
          type: agent.type,
          status: this.agentStatuses.get(agent.id) || 'unknown',
          description: agent.description,
          version: agent.version,
          lastSeen: agent.lastSeen,
          metrics: agent.metrics,
          capabilities: agent.capabilities || [],
        })
      );

      this.dashboardData.workflows = Array.from(
        this.workflowTemplates.values()
      );

      this.dashboardData.systemHealth = this.calculateSystemHealth();

      this.dashboardData.alerts = this.generateAlerts();

      // Emit update event
      this.emit('dashboard_update', this.dashboardData);
    } catch (error) {
      console.error('Error updating dashboard data:', error);
    }
  }

  /**
   * Update agent metrics
   */
  updateAgentMetrics() {
    try {
      for (const [agentId, agent] of this.agents) {
        // Simulate metric updates
        const status = this.agentStatuses.get(agentId);

        if (status === 'active') {
          agent.metrics.uptime += 30; // Add 30 seconds
          agent.metrics.tasksCompleted += Math.floor(Math.random() * 3);
          agent.metrics.performance = Math.max(
            70,
            Math.min(100, agent.metrics.performance + (Math.random() - 0.5) * 5)
          );
        }

        agent.lastSeen = new Date();
      }
    } catch (error) {
      console.error('Error updating agent metrics:', error);
    }
  }

  /**
   * Calculate system health
   */
  calculateSystemHealth() {
    const totalAgents = this.agents.size;
    const activeAgents = Array.from(this.agentStatuses.values()).filter(
      status => status === 'active'
    ).length;
    const errorAgents = Array.from(this.agentStatuses.values()).filter(
      status => status === 'error'
    ).length;

    if (totalAgents === 0) return 'unknown';

    const healthRatio = activeAgents / totalAgents;

    if (healthRatio >= 0.8 && errorAgents === 0) return 'excellent';
    if (healthRatio >= 0.6 && errorAgents <= 1) return 'good';
    if (healthRatio >= 0.4) return 'fair';
    return 'poor';
  }

  /**
   * Generate alerts
   */
  generateAlerts() {
    const alerts = [];

    for (const [agentId, status] of this.agentStatuses) {
      const agent = this.agents.get(agentId);

      if (status === 'error') {
        alerts.push({
          id: `error_${agentId}_${Date.now()}`,
          type: 'error',
          severity: 'high',
          agent: agentId,
          message: `Agent ${agent.name} is in error state`,
          timestamp: new Date(),
          acknowledged: false,
        });
      }

      if (agent && agent.metrics.performance < 70) {
        alerts.push({
          id: `performance_${agentId}_${Date.now()}`,
          type: 'performance',
          severity: 'medium',
          agent: agentId,
          message: `Agent ${agent.name} performance is below threshold (${agent.metrics.performance}%)`,
          timestamp: new Date(),
          acknowledged: false,
        });
      }
    }

    return alerts;
  }

  /**
   * Handle agent error
   */
  async handleAgentError(agentId, error) {
    try {
      console.log(`🚨 Agent ${agentId} error:`, error.message);

      // Update agent status
      this.agentStatuses.set(agentId, 'error');

      // Update metrics
      const agent = this.agents.get(agentId);
      if (agent) {
        agent.metrics.errors++;
        agent.lastSeen = new Date();
      }

      // Attempt auto-recovery
      await this.attemptAutoRecovery(agentId, error);
    } catch (recoveryError) {
      console.error(
        `❌ Auto-recovery failed for agent ${agentId}:`,
        recoveryError
      );
    }
  }

  /**
   * Attempt auto-recovery
   */
  async attemptAutoRecovery(agentId, error) {
    try {
      const agent = this.agents.get(agentId);
      if (!agent) return;

      const retryPolicy = this.agentLifecycle.get('error').retryPolicy;

      // Simple retry logic
      setTimeout(async () => {
        try {
          console.log(`🔄 Attempting recovery for agent ${agentId}...`);

          // Simulate recovery
          this.agentStatuses.set(agentId, 'initializing');

          // Wait a bit then set to active
          setTimeout(() => {
            this.agentStatuses.set(agentId, 'active');
            console.log(`✅ Agent ${agentId} recovered successfully`);
          }, 2000);
        } catch (recoveryError) {
          console.error(
            `❌ Recovery failed for agent ${agentId}:`,
            recoveryError
          );
        }
      }, retryPolicy.retryDelay);
    } catch (error) {
      console.error('Error in auto-recovery:', error);
    }
  }

  /**
   * Handle status change
   */
  handleStatusChange(agentId, oldStatus, newStatus) {
    console.log(
      `🔄 Agent ${agentId} status changed: ${oldStatus} → ${newStatus}`
    );

    // Update last seen
    const agent = this.agents.get(agentId);
    if (agent) {
      agent.lastSeen = new Date();
    }

    // Emit status change event
    this.emit('agent_status_change', agentId, oldStatus, newStatus);
  }

  /**
   * Start agent
   */
  async startAgent(agentId) {
    try {
      console.log(`🚀 Starting agent ${agentId}...`);

      const agent = this.agents.get(agentId);
      if (!agent) {
        throw new Error(`Agent ${agentId} not found`);
      }

      const currentStatus = this.agentStatuses.get(agentId);
      if (currentStatus === 'active') {
        return { success: true, message: 'Agent is already active' };
      }

      // Change status to initializing
      this.agentStatuses.set(agentId, 'initializing');

      // Simulate startup process
      setTimeout(() => {
        this.agentStatuses.set(agentId, 'active');
        console.log(`✅ Agent ${agentId} started successfully`);
      }, 1000);

      return { success: true, message: 'Agent started successfully' };
    } catch (error) {
      console.error(`❌ Failed to start agent ${agentId}:`, error);
      this.agentStatuses.set(agentId, 'error');
      return { success: false, message: error.message };
    }
  }

  /**
   * Stop agent
   */
  async stopAgent(agentId) {
    try {
      console.log(`🛑 Stopping agent ${agentId}...`);

      const agent = this.agents.get(agentId);
      if (!agent) {
        throw new Error(`Agent ${agentId} not found`);
      }

      const currentStatus = this.agentStatuses.get(agentId);
      if (currentStatus === 'stopped') {
        return { success: true, message: 'Agent is already stopped' };
      }

      // Change status to stopped
      this.agentStatuses.set(agentId, 'stopped');

      console.log(`✅ Agent ${agentId} stopped successfully`);
      return { success: true, message: 'Agent stopped successfully' };
    } catch (error) {
      console.error(`❌ Failed to stop agent ${agentId}:`, error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Restart agent
   */
  async restartAgent(agentId) {
    try {
      console.log(`🔄 Restarting agent ${agentId}...`);

      // Stop first
      await this.stopAgent(agentId);

      // Wait a bit
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Start again
      return await this.startAgent(agentId);
    } catch (error) {
      console.error(`❌ Failed to restart agent ${agentId}:`, error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Get discovered agents
   */
  getDiscoveredAgents() {
    return Array.from(this.agents.values());
  }

  /**
   * Get dashboard data
   */
  getDashboardData() {
    return this.dashboardData;
  }

  /**
   * Get agent details
   */
  getAgentDetails(agentId) {
    const agent = this.agents.get(agentId);
    if (!agent) return null;

    return {
      ...agent,
      status: this.agentStatuses.get(agentId),
      lifecycle: this.agentLifecycle.get(this.agentStatuses.get(agentId)),
    };
  }

  /**
   * Get workflow template
   */
  getWorkflowTemplate(templateId) {
    return this.workflowTemplates.get(templateId);
  }

  /**
   * Execute workflow
   */
  async executeWorkflow(templateId) {
    try {
      const template = this.workflowTemplates.get(templateId);
      if (!template) {
        throw new Error(`Workflow template ${templateId} not found`);
      }

      console.log(`🔄 Executing workflow: ${template.name}`);

      // Create workflow instance
      const workflowInstance = {
        id: `${templateId}_${Date.now()}`,
        templateId: templateId,
        name: template.name,
        status: 'running',
        steps: template.steps.map(step => ({ ...step, status: 'pending' })),
        startTime: new Date(),
        currentStep: 0,
      };

      // Execute steps
      for (let i = 0; i < workflowInstance.steps.length; i++) {
        const step = workflowInstance.steps[i];
        step.status = 'running';

        console.log(`📋 Executing step: ${step.name} (${step.agent})`);

        // Simulate step execution
        await new Promise(resolve => setTimeout(resolve, 2000));

        step.status = 'completed';
        workflowInstance.currentStep = i + 1;
      }

      workflowInstance.status = 'completed';
      workflowInstance.endTime = new Date();

      console.log(`✅ Workflow ${template.name} completed successfully`);
      return workflowInstance;
    } catch (error) {
      console.error(`❌ Failed to execute workflow ${templateId}:`, error);
      throw error;
    }
  }

  /**
   * Shutdown dashboard
   */
  async shutdown() {
    try {
      console.log('🔄 Shutting down Agent Dashboard...');

      this.isActive = false;

      // Clear intervals
      if (this.updateInterval) {
        clearInterval(this.updateInterval);
      }

      if (this.metricsInterval) {
        clearInterval(this.metricsInterval);
      }

      // Stop all agents
      for (const agentId of this.agents.keys()) {
        await this.stopAgent(agentId);
      }

      console.log('✅ Agent Dashboard shutdown completed');
    } catch (error) {
      console.error('Error shutting down dashboard:', error);
    }
  }
}

module.exports = AgentDashboard;
