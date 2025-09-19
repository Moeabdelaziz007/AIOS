/**
 * 🤖 AI Agent Loader System
 *
 * Loads and manages AI agents from JSON configuration files
 */

const fs = require('fs').promises;
const path = require('path');

class AIAgentLoader {
  constructor() {
    this.name = 'AI Agent Loader';
    this.version = '2.0.0';
    this.agents = new Map();
    this.registry = null;
    this.configPath = path.join(__dirname, '../agents');

    console.log(`🤖 ${this.name} v${this.version} initialized`);
  }

  /**
   * Initialize the agent loader
   */
  async initialize() {
    try {
      console.log('🚀 Initializing AI Agent Loader...');

      // Load agent registry
      await this.loadAgentRegistry();

      // Load all agent configurations
      await this.loadAllAgents();

      console.log('✅ AI Agent Loader initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize agent loader:', error.message);
      return false;
    }
  }

  /**
   * Load agent registry
   */
  async loadAgentRegistry() {
    try {
      console.log('📋 Loading agent registry...');

      const registryPath = path.join(this.configPath, 'agent_registry.json');
      const registryData = await fs.readFile(registryPath, 'utf8');
      this.registry = JSON.parse(registryData);

      console.log(
        `✅ Loaded registry with ${this.registry.aios_agents_registry.total_agents} agents`
      );
    } catch (error) {
      console.error('❌ Failed to load agent registry:', error.message);
      throw error;
    }
  }

  /**
   * Load all agent configurations
   */
  async loadAllAgents() {
    try {
      console.log('🤖 Loading all agent configurations...');

      for (const agentInfo of this.registry.aios_agents_registry.agents) {
        await this.loadAgent(agentInfo);
      }

      console.log(`✅ Loaded ${this.agents.size} agents successfully`);
    } catch (error) {
      console.error('❌ Failed to load agents:', error.message);
      throw error;
    }
  }

  /**
   * Load individual agent configuration
   */
  async loadAgent(agentInfo) {
    try {
      console.log(`📁 Loading agent: ${agentInfo.name}`);

      const configPath = path.join(__dirname, agentInfo.config_file);
      const configData = await fs.readFile(configPath, 'utf8');
      const agentConfig = JSON.parse(configData);

      // Validate agent configuration
      this.validateAgentConfig(agentConfig);

      // Store agent configuration
      this.agents.set(agentInfo.agentId, {
        ...agentConfig,
        loadedAt: Date.now(),
        status: agentInfo.status,
      });

      console.log(`✅ Loaded agent: ${agentInfo.name} (${agentInfo.agentId})`);
    } catch (error) {
      console.error(
        `❌ Failed to load agent ${agentInfo.name}:`,
        error.message
      );
    }
  }

  /**
   * Validate agent configuration
   */
  validateAgentConfig(config) {
    const requiredFields = [
      'agentId',
      'name',
      'type',
      'capabilities',
      'communication',
      'workflow',
      'rules',
      'triggers',
    ];

    for (const field of requiredFields) {
      if (!config[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Validate communication object
    if (!config.communication.style || !config.communication.language) {
      throw new Error('Invalid communication configuration');
    }

    // Validate workflow steps
    if (
      !Array.isArray(config.workflow.steps) ||
      config.workflow.steps.length === 0
    ) {
      throw new Error('Invalid workflow configuration');
    }

    console.log(`✅ Agent configuration validated: ${config.name}`);
  }

  /**
   * Get agent by ID
   */
  getAgent(agentId) {
    return this.agents.get(agentId);
  }

  /**
   * Get agents by type
   */
  getAgentsByType(type) {
    const agents = [];
    for (const [id, agent] of this.agents.entries()) {
      if (agent.type === type) {
        agents.push({ id, ...agent });
      }
    }
    return agents;
  }

  /**
   * Get agents by capability
   */
  getAgentsByCapability(capability) {
    const agents = [];
    for (const [id, agent] of this.agents.entries()) {
      if (agent.capabilities.includes(capability)) {
        agents.push({ id, ...agent });
      }
    }
    return agents;
  }

  /**
   * Find best agent for task
   */
  findBestAgent(task, requirements = {}) {
    let bestAgent = null;
    let bestScore = 0;

    for (const [id, agent] of this.agents.entries()) {
      if (agent.status !== 'active') continue;

      let score = 0;

      // Match capabilities
      if (requirements.capabilities) {
        const matchingCapabilities = agent.capabilities.filter(cap =>
          requirements.capabilities.includes(cap)
        );
        score += matchingCapabilities.length * 0.4;
      }

      // Match agent type
      if (requirements.type && agent.type === requirements.type) {
        score += 0.3;
      }

      // Match communication style
      if (
        requirements.communicationStyle &&
        agent.communication.style === requirements.communicationStyle
      ) {
        score += 0.1;
      }

      // Consider agent load (if available)
      if (agent.load !== undefined) {
        score += (1 - agent.load) * 0.2;
      }

      if (score > bestScore) {
        bestScore = score;
        bestAgent = { id, ...agent };
      }
    }

    return bestAgent;
  }

  /**
   * Get agent communication patterns
   */
  getAgentCommunicationPatterns(agentId) {
    const agent = this.getAgent(agentId);
    if (!agent) return null;

    return {
      style: agent.communication.style,
      language: agent.communication.language,
      greeting: agent.communication.greeting,
      acknowledgment: agent.communication.acknowledgment,
      confirmation: agent.communication.confirmation,
      error: agent.communication.error,
      triggers: agent.triggers,
    };
  }

  /**
   * Get agent workflow
   */
  getAgentWorkflow(agentId) {
    const agent = this.getAgent(agentId);
    if (!agent) return null;

    return agent.workflow;
  }

  /**
   * Get agent rules
   */
  getAgentRules(agentId) {
    const agent = this.getAgent(agentId);
    if (!agent) return null;

    return agent.rules;
  }

  /**
   * Get collaboration partners for agent
   */
  getCollaborationPartners(agentId) {
    const agent = this.getAgent(agentId);
    if (!agent) return [];

    return agent.collaboration_partners || [];
  }

  /**
   * Get workflow template
   */
  getWorkflowTemplate(templateName) {
    if (!this.registry) return null;

    const templates = this.registry.aios_agents_registry.workflow_templates;
    return templates[templateName] || null;
  }

  /**
   * Get collaboration matrix
   */
  getCollaborationMatrix() {
    if (!this.registry) return null;

    return this.registry.aios_agents_registry.collaboration_matrix;
  }

  /**
   * Get all agents status
   */
  getAllAgentsStatus() {
    const status = {
      total: this.agents.size,
      active: 0,
      inactive: 0,
      byType: {},
      byCapability: {},
    };

    for (const [id, agent] of this.agents.entries()) {
      if (agent.status === 'active') {
        status.active++;
      } else {
        status.inactive++;
      }

      // Count by type
      status.byType[agent.type] = (status.byType[agent.type] || 0) + 1;

      // Count by capability
      for (const capability of agent.capabilities) {
        status.byCapability[capability] =
          (status.byCapability[capability] || 0) + 1;
      }
    }

    return status;
  }

  /**
   * Reload agent configuration
   */
  async reloadAgent(agentId) {
    try {
      console.log(`🔄 Reloading agent: ${agentId}`);

      const agentInfo = this.registry.aios_agents_registry.agents.find(
        agent => agent.agentId === agentId
      );

      if (!agentInfo) {
        throw new Error(`Agent ${agentId} not found in registry`);
      }

      await this.loadAgent(agentInfo);
      console.log(`✅ Reloaded agent: ${agentId}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to reload agent ${agentId}:`, error.message);
      return false;
    }
  }

  /**
   * Get system information
   */
  getSystemInfo() {
    return {
      name: this.name,
      version: this.version,
      configPath: this.configPath,
      agentsLoaded: this.agents.size,
      registryVersion: this.registry?.aios_agents_registry?.version,
      lastUpdated: this.registry?.aios_agents_registry?.last_updated,
    };
  }
}

module.exports = AIAgentLoader;
