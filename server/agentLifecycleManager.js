/**
 * Agent Lifecycle Management System
 *
 * Comprehensive lifecycle management for all agents with
 * start/stop/restart capabilities and intelligent error handling
 */

const EventEmitter = require('events');

class AgentLifecycleManager extends EventEmitter {
  constructor() {
    super();
    this.name = 'Agent Lifecycle Manager';
    this.version = '1.0.0';
    this.isActive = false;

    // Lifecycle states
    this.states = {
      DISCOVERED: 'discovered',
      INITIALIZING: 'initializing',
      ACTIVE: 'active',
      IDLE: 'idle',
      ERROR: 'error',
      STOPPED: 'stopped',
      RESTARTING: 'restarting',
    };

    // Agent management
    this.agents = new Map();
    this.agentStates = new Map();
    this.agentProcesses = new Map();
    this.agentHealth = new Map();

    // Error handling
    this.errorHandlers = new Map();
    this.retryPolicies = new Map();
    this.fallbackStrategies = new Map();

    // Lifecycle policies
    this.lifecyclePolicies = {
      maxRetries: 3,
      retryDelay: 5000,
      backoffMultiplier: 2,
      healthCheckInterval: 30000,
      timeoutThreshold: 60000,
      autoRecovery: true,
      gracefulShutdown: true,
    };

    console.log('Agent Lifecycle Manager v' + this.version + ' initialized');
  }

  /**
   * Initialize lifecycle manager
   */
  async initialize() {
    try {
      console.log('Initializing Agent Lifecycle Manager...');

      // Setup state transitions
      this.setupStateTransitions();

      // Setup error handling
      this.setupErrorHandling();

      // Setup retry policies
      this.setupRetryPolicies();

      // Setup fallback strategies
      this.setupFallbackStrategies();

      // Setup health monitoring
      this.setupHealthMonitoring();

      // Setup lifecycle policies
      this.setupLifecyclePolicies();

      this.isActive = true;
      console.log('Agent Lifecycle Manager initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize Agent Lifecycle Manager:', error);
      return false;
    }
  }

  /**
   * Setup state transitions
   */
  setupStateTransitions() {
    console.log('Setting up state transitions...');

    this.stateTransitions = {
      [this.states.DISCOVERED]: [this.states.INITIALIZING, this.states.ERROR],
      [this.states.INITIALIZING]: [
        this.states.ACTIVE,
        this.states.ERROR,
        this.states.STOPPED,
      ],
      [this.states.ACTIVE]: [
        this.states.IDLE,
        this.states.ERROR,
        this.states.STOPPED,
        this.states.RESTARTING,
      ],
      [this.states.IDLE]: [
        this.states.ACTIVE,
        this.states.ERROR,
        this.states.STOPPED,
        this.states.RESTARTING,
      ],
      [this.states.ERROR]: [this.states.INITIALIZING, this.states.STOPPED],
      [this.states.STOPPED]: [this.states.INITIALIZING, this.states.RESTARTING],
      [this.states.RESTARTING]: [this.states.INITIALIZING, this.states.ERROR, this.states.STOPPED],
    };

    console.log('State transitions setup completed');
  }

  /**
   * Setup error handling
   */
  setupErrorHandling() {
    console.log('Setting up error handling...');

    // Global error handler
    this.on('agent_error', (agentId, error) => {
      this.handleAgentError(agentId, error);
    });

    // State change handler
    this.on('state_change', (agentId, oldState, newState) => {
      this.handleStateChange(agentId, oldState, newState);
    });

    // Health check handler
    this.on('health_check', (agentId, health) => {
      this.handleHealthCheck(agentId, health);
    });

    console.log('Error handling setup completed');
  }

  /**
   * Setup retry policies
   */
  setupRetryPolicies() {
    console.log('Setting up retry policies...');

    const defaultRetryPolicy = {
      maxRetries: this.lifecyclePolicies.maxRetries,
      retryDelay: this.lifecyclePolicies.retryDelay,
      backoffMultiplier: this.lifecyclePolicies.backoffMultiplier,
      retryableErrors: ['timeout', 'connection_error', 'temporary_failure'],
      nonRetryableErrors: [
        'configuration_error',
        'permission_denied',
        'invalid_input',
      ],
    };

    this.retryPolicies.set('default', defaultRetryPolicy);

    // Agent-specific retry policies
    this.retryPolicies.set('smart_agent', {
      ...defaultRetryPolicy,
      maxRetries: 5,
      retryDelay: 3000,
    });

    this.retryPolicies.set('data_agent', {
      ...defaultRetryPolicy,
      maxRetries: 2,
      retryDelay: 10000,
    });

    console.log('Retry policies setup completed');
  }

  /**
   * Setup fallback strategies
   */
  setupFallbackStrategies() {
    console.log('Setting up fallback strategies...');

    const defaultFallback = {
      enabled: true,
      strategies: ['restart', 'graceful_degradation', 'alternative_agent'],
      priority: ['restart', 'graceful_degradation', 'alternative_agent'],
    };

    this.fallbackStrategies.set('default', defaultFallback);

    // Agent-specific fallback strategies
    this.fallbackStrategies.set('smart_agent', {
      ...defaultFallback,
      strategies: ['restart', 'fallback_model', 'cached_response'],
    });

    this.fallbackStrategies.set('data_agent', {
      ...defaultFallback,
      strategies: ['restart', 'batch_mode', 'offline_mode'],
    });

    console.log('Fallback strategies setup completed');
  }

  /**
   * Setup health monitoring
   */
  setupHealthMonitoring() {
    console.log('Setting up health monitoring...');

    // Health check interval
    setInterval(() => {
      this.performHealthChecks();
    }, this.lifecyclePolicies.healthCheckInterval);

    console.log('Health monitoring setup completed');
  }

  /**
   * Setup lifecycle policies
   */
  setupLifecyclePolicies() {
    console.log('Setting up lifecycle policies...');

    // Auto-recovery policy
    if (this.lifecyclePolicies.autoRecovery) {
      this.on('agent_error', (agentId, error) => {
        setTimeout(() => {
          this.attemptAutoRecovery(agentId, error);
        }, this.lifecyclePolicies.retryDelay);
      });
    }

    console.log('Lifecycle policies setup completed');
  }

  /**
   * Register agent
   */
  async registerAgent(agentId, agentInfo) {
    try {
      console.log('Registering agent: ' + agentId);

      const agent = {
        id: agentId,
        name: agentInfo.name,
        type: agentInfo.type,
        version: agentInfo.version,
        description: agentInfo.description,
        capabilities: agentInfo.capabilities || [],
        dependencies: agentInfo.dependencies || [],
        endpoints: agentInfo.endpoints || {},
        settings: agentInfo.settings || {},
        registeredAt: new Date(),
        lastActivity: new Date(),
        retryCount: 0,
        errorCount: 0,
        healthScore: 100,
      };

      this.agents.set(agentId, agent);
      this.agentStates.set(agentId, this.states.DISCOVERED);
      this.agentHealth.set(agentId, {
        status: 'unknown',
        lastCheck: new Date(),
        score: 100,
        issues: [],
      });

      console.log('Agent registered: ' + agentId);

      // Emit registration event
      this.emit('agent_registered', agentId, agent);

      return agent;
    } catch (error) {
      console.error('Error registering agent ' + agentId + ':', error);
      throw error;
    }
  }

  /**
   * Start agent
   */
  async startAgent(agentId) {
    try {
      console.log('Starting agent: ' + agentId);

      const agent = this.agents.get(agentId);
      if (!agent) {
        throw new Error('Agent ' + agentId + ' not found');
      }

      const currentState = this.agentStates.get(agentId);

      // Check if agent can be started
      if (!this.canTransitionTo(currentState, this.states.INITIALIZING)) {
        throw new Error(
          'Agent ' + agentId + ' cannot be started from state ' + currentState
        );
      }

      // Change state to initializing
      await this.changeAgentState(agentId, this.states.INITIALIZING);

      // Perform startup sequence
      await this.performStartupSequence(agentId);

      // Change state to active
      await this.changeAgentState(agentId, this.states.ACTIVE);

      console.log('Agent started: ' + agentId);

      // Emit start event
      this.emit('agent_started', agentId, agent);

      return { success: true, message: 'Agent started successfully' };
    } catch (error) {
      console.error('Error starting agent ' + agentId + ':', error);

      // Try to change state to error, but handle gracefully if agent doesn't exist
      try {
        await this.changeAgentState(agentId, this.states.ERROR);
      } catch (stateError) {
        // Agent might not exist, just log the error
        console.error('Could not change agent state to error:', stateError.message);
      }
      
      // Emit error event
      this.emit('agent_error', agentId, error);

      return { success: false, message: error.message };
    }
  }

  /**
   * Stop agent
   */
  async stopAgent(agentId) {
    try {
      console.log('Stopping agent: ' + agentId);

      const agent = this.agents.get(agentId);
      if (!agent) {
        throw new Error('Agent ' + agentId + ' not found');
      }

      const currentState = this.agentStates.get(agentId);

      // Check if agent can be stopped
      if (!this.canTransitionTo(currentState, this.states.STOPPED)) {
        throw new Error(
          'Agent ' + agentId + ' cannot be stopped from state ' + currentState
        );
      }

      // Perform graceful shutdown if enabled
      if (this.lifecyclePolicies.gracefulShutdown) {
        await this.performGracefulShutdown(agentId);
      }

      // Change state to stopped
      await this.changeAgentState(agentId, this.states.STOPPED);

      console.log('Agent stopped: ' + agentId);

      // Emit stop event
      this.emit('agent_stopped', agentId, agent);

      return { success: true, message: 'Agent stopped successfully' };
    } catch (error) {
      console.error('Error stopping agent ' + agentId + ':', error);

      // Force stop
      await this.changeAgentState(agentId, this.states.STOPPED);

      return { success: false, message: error.message };
    }
  }

  /**
   * Restart agent
   */
  async restartAgent(agentId) {
    try {
      console.log('Restarting agent: ' + agentId);

      const agent = this.agents.get(agentId);
      if (!agent) {
        throw new Error('Agent ' + agentId + ' not found');
      }

      const currentState = this.agentStates.get(agentId);

      // Check if agent can be restarted
      if (!this.canTransitionTo(currentState, this.states.RESTARTING)) {
        throw new Error(
          'Agent ' + agentId + ' cannot be restarted from state ' + currentState
        );
      }

      // Change state to restarting
      await this.changeAgentState(agentId, this.states.RESTARTING);

      // Stop agent first
      await this.stopAgent(agentId);

      // Wait a bit
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Start agent again
      const result = await this.startAgent(agentId);

      console.log('Agent restarted: ' + agentId);

      // Emit restart event
      this.emit('agent_restarted', agentId, agent);

      return result;
    } catch (error) {
      console.error('Error restarting agent ' + agentId + ':', error);
      
      // Try to change state to error, but handle gracefully if agent doesn't exist
      try {
        await this.changeAgentState(agentId, this.states.ERROR);
      } catch (stateError) {
        // Agent might not exist, just log the error
        console.error('Could not change agent state to error:', stateError.message);
      }
      
      return { success: false, message: error.message };
    }
  }

  /**
   * Change agent state
   */
  async changeAgentState(agentId, newState) {
    try {
      let oldState = this.agentStates.get(agentId);

      if (oldState === newState) {
        return; // No change needed
      }

      // If agent doesn't exist, create a basic state entry
      if (oldState === undefined) {
        this.agentStates.set(agentId, this.states.DISCOVERED);
        oldState = this.states.DISCOVERED;
      }
      
      // Validate transition
      if (!this.canTransitionTo(oldState, newState)) {
        throw new Error(
          'Invalid state transition: ' + oldState + ' -> ' + newState
        );
      }

      // Update state
      this.agentStates.set(agentId, newState);

      // Update agent info
      const agent = this.agents.get(agentId);
      if (agent) {
        agent.lastActivity = new Date();
      }

      console.log(
        'Agent ' + agentId + ' state changed: ' + oldState + ' -> ' + newState
      );

      // Emit state change event
      this.emit('state_change', agentId, oldState, newState);
    } catch (error) {
      console.error('Error changing agent state ' + agentId + ':', error);
      throw error;
    }
  }

  /**
   * Check if state transition is valid
   */
  canTransitionTo(currentState, newState) {
    const allowedTransitions = this.stateTransitions[currentState] || [];
    return allowedTransitions.includes(newState);
  }

  /**
   * Perform startup sequence
   */
  async performStartupSequence(agentId) {
    try {
      const agent = this.agents.get(agentId);
      if (!agent) return;

      console.log('Performing startup sequence for agent: ' + agentId);

      // Check dependencies
      await this.checkDependencies(agentId);

      // Initialize agent
      await this.initializeAgent(agentId);

      // Perform health check
      await this.performHealthCheck(agentId);

      console.log('Startup sequence completed for agent: ' + agentId);
    } catch (error) {
      console.error(
        'Startup sequence failed for agent ' + agentId + ':',
        error
      );
      throw error;
    }
  }

  /**
   * Check dependencies
   */
  async checkDependencies(agentId) {
    try {
      const agent = this.agents.get(agentId);
      if (!agent || !agent.dependencies) return;

      console.log('Checking dependencies for agent: ' + agentId);

      for (const dependency of agent.dependencies) {
        const depState = this.agentStates.get(dependency);
        if (depState !== this.states.ACTIVE) {
          throw new Error(
            'Dependency ' +
              dependency +
              ' is not active (state: ' +
              depState +
              ')'
          );
        }
      }

      console.log('Dependencies check passed for agent: ' + agentId);
    } catch (error) {
      console.error(
        'Dependencies check failed for agent ' + agentId + ':',
        error
      );
      throw error;
    }
  }

  /**
   * Initialize agent
   */
  async initializeAgent(agentId) {
    try {
      const agent = this.agents.get(agentId);
      if (!agent) return;

      console.log('Initializing agent: ' + agentId);

      // Simulate initialization process
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('Agent initialized: ' + agentId);
    } catch (error) {
      console.error('Initialization failed for agent ' + agentId + ':', error);
      throw error;
    }
  }

  /**
   * Perform graceful shutdown
   */
  async performGracefulShutdown(agentId) {
    try {
      const agent = this.agents.get(agentId);
      if (!agent) return;

      console.log('Performing graceful shutdown for agent: ' + agentId);

      // Simulate graceful shutdown process
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('Graceful shutdown completed for agent: ' + agentId);
    } catch (error) {
      console.error(
        'Graceful shutdown failed for agent ' + agentId + ':',
        error
      );
      throw error;
    }
  }

  /**
   * Perform health check
   */
  async performHealthCheck(agentId) {
    try {
      const agent = this.agents.get(agentId);
      if (!agent) return;

      console.log('Performing health check for agent: ' + agentId);

      // Simulate health check
      const healthScore = Math.random() * 100;
      const isHealthy = healthScore > 70;

      const health = {
        status: isHealthy ? 'healthy' : 'unhealthy',
        score: healthScore,
        lastCheck: new Date(),
        issues: isHealthy ? [] : ['Performance below threshold'],
      };

      this.agentHealth.set(agentId, health);

      // Update agent health score
      agent.healthScore = healthScore;

      console.log(
        'Health check completed for agent ' +
          agentId +
          ': ' +
          health.status +
          ' (' +
          healthScore.toFixed(1) +
          '%)'
      );

      // Emit health check event
      this.emit('health_check', agentId, health);

      return health;
    } catch (error) {
      console.error('Health check failed for agent ' + agentId + ':', error);
      throw error;
    }
  }

  /**
   * Perform health checks for all agents
   */
  async performHealthChecks() {
    try {
      for (const agentId of this.agents.keys()) {
        const state = this.agentStates.get(agentId);
        if (state === this.states.ACTIVE || state === this.states.IDLE) {
          await this.performHealthCheck(agentId);
        }
      }
    } catch (error) {
      console.error('Error performing health checks:', error);
    }
  }

  /**
   * Handle agent error
   */
  async handleAgentError(agentId, error) {
    try {
      console.log('Handling error for agent ' + agentId + ':', error.message);

      const agent = this.agents.get(agentId);
      if (!agent) return;

      // Update error count
      agent.errorCount++;

      // Check retry policy
      const retryPolicy =
        this.retryPolicies.get(agentId) || this.retryPolicies.get('default');

      if (agent.retryCount < retryPolicy.maxRetries) {
        console.log(
          'Attempting retry for agent ' +
            agentId +
            ' (' +
            (agent.retryCount + 1) +
            '/' +
            retryPolicy.maxRetries +
            ')'
        );

        agent.retryCount++;

        // Calculate retry delay with backoff
        const retryDelay =
          retryPolicy.retryDelay *
          Math.pow(retryPolicy.backoffMultiplier, agent.retryCount - 1);

        setTimeout(async () => {
          try {
            await this.restartAgent(agentId);
          } catch (retryError) {
            console.error(
              'Retry failed for agent ' + agentId + ':',
              retryError
            );
          }
        }, retryDelay);
      } else {
        console.log('Max retries exceeded for agent ' + agentId);

        // Apply fallback strategy
        await this.applyFallbackStrategy(agentId, error);
      }
    } catch (error) {
      console.error('Error handling agent error ' + agentId + ':', error);
    }
  }

  /**
   * Apply fallback strategy
   */
  async applyFallbackStrategy(agentId, error) {
    try {
      const fallbackStrategy =
        this.fallbackStrategies.get(agentId) ||
        this.fallbackStrategies.get('default');

      console.log('Applying fallback strategy for agent ' + agentId);

      for (const strategy of fallbackStrategy.priority) {
        try {
          switch (strategy) {
            case 'restart':
              await this.restartAgent(agentId);
              break;
            case 'graceful_degradation':
              await this.enableGracefulDegradation(agentId);
              break;
            case 'alternative_agent':
              await this.switchToAlternativeAgent(agentId);
              break;
            default:
              console.log('Unknown fallback strategy: ' + strategy);
          }

          console.log(
            'Fallback strategy ' + strategy + ' applied for agent ' + agentId
          );
          return;
        } catch (strategyError) {
          console.error(
            'Fallback strategy ' +
              strategy +
              ' failed for agent ' +
              agentId +
              ':',
            strategyError
          );
        }
      }

      console.log('All fallback strategies failed for agent ' + agentId);
    } catch (error) {
      console.error(
        'Error applying fallback strategy for agent ' + agentId + ':',
        error
      );
    }
  }

  /**
   * Enable graceful degradation
   */
  async enableGracefulDegradation(agentId) {
    console.log('Enabling graceful degradation for agent ' + agentId);
    // Implementation would go here
  }

  /**
   * Switch to alternative agent
   */
  async switchToAlternativeAgent(agentId) {
    console.log('Switching to alternative agent for ' + agentId);
    // Implementation would go here
  }

  /**
   * Attempt auto-recovery
   */
  async attemptAutoRecovery(agentId, error) {
    try {
      console.log('Attempting auto-recovery for agent ' + agentId);

      // Simple auto-recovery: restart the agent
      await this.restartAgent(agentId);

      console.log('Auto-recovery successful for agent ' + agentId);
    } catch (error) {
      console.error('Auto-recovery failed for agent ' + agentId + ':', error);
    }
  }

  /**
   * Handle state change
   */
  handleStateChange(agentId, oldState, newState) {
    console.log(
      'Agent ' + agentId + ' state changed: ' + oldState + ' -> ' + newState
    );

    // Update agent info
    const agent = this.agents.get(agentId);
    if (agent) {
      agent.lastActivity = new Date();
    }
  }

  /**
   * Handle health check
   */
  handleHealthCheck(agentId, health) {
    const agent = this.agents.get(agentId);
    if (agent) {
      agent.healthScore = health.score;
    }
  }

  /**
   * Get agent status
   */
  getAgentStatus(agentId) {
    const agent = this.agents.get(agentId);
    const state = this.agentStates.get(agentId);
    const health = this.agentHealth.get(agentId);

    if (!agent) return null;

    return {
      id: agentId,
      name: agent.name,
      type: agent.type,
      state: state,
      health: health,
      lastActivity: agent.lastActivity,
      retryCount: agent.retryCount,
      errorCount: agent.errorCount,
      healthScore: agent.healthScore,
    };
  }

  /**
   * Get all agent statuses
   */
  getAllAgentStatuses() {
    const statuses = [];

    for (const agentId of this.agents.keys()) {
      const status = this.getAgentStatus(agentId);
      if (status) {
        statuses.push(status);
      }
    }

    return statuses;
  }

  /**
   * Get agents by state
   */
  getAgentsByState(state) {
    return Array.from(this.agents.keys()).filter(
      agentId => this.agentStates.get(agentId) === state
    );
  }

  /**
   * Get system health summary
   */
  getSystemHealthSummary() {
    const totalAgents = this.agents.size;
    const activeAgents = this.getAgentsByState(this.states.ACTIVE).length;
    const errorAgents = this.getAgentsByState(this.states.ERROR).length;
    const stoppedAgents = this.getAgentsByState(this.states.STOPPED).length;

    const avgHealthScore =
      Array.from(this.agentHealth.values()).reduce(
        (sum, health) => sum + health.score,
        0
      ) / totalAgents || 0;

    return {
      totalAgents,
      activeAgents,
      errorAgents,
      stoppedAgents,
      avgHealthScore: avgHealthScore.toFixed(1),
      systemHealth:
        avgHealthScore > 80
          ? 'excellent'
          : avgHealthScore > 60
            ? 'good'
            : 'poor',
    };
  }

  /**
   * Shutdown lifecycle manager
   */
  async shutdown() {
    try {
      console.log('Shutting down Agent Lifecycle Manager...');

      this.isActive = false;

      // Stop all agents gracefully
      for (const agentId of this.agents.keys()) {
        const state = this.agentStates.get(agentId);
        if (state === this.states.ACTIVE || state === this.states.IDLE) {
          await this.stopAgent(agentId);
        }
      }

      console.log('Agent Lifecycle Manager shutdown completed');
    } catch (error) {
      console.error('Error shutting down lifecycle manager:', error);
    }
  }
}

module.exports = AgentLifecycleManager;
