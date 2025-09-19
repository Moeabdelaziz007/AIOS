/**
 * AgentRegistry.ts
 *
 * Central registry for managing agent registration, discovery, and lifecycle.
 * Based on professional patterns from Open-WebUI and ZQBAC projects.
 */

import { Logger } from '../utils/Logger';
import { AgentConfig, AgentState, BaseAgent } from './BaseAgent';

export interface AgentInfo {
  id: string;
  agent: BaseAgent;
  config: AgentConfig;
  state: AgentState;
  registeredAt: Date;
  lastActivity: Date;
}

export interface RegistryStats {
  totalAgents: number;
  activeAgents: number;
  errorAgents: number;
  stoppedAgents: number;
  averageUptime: number;
}

export interface AgentFilter {
  status?: string;
  role?: string;
  capabilities?: string[];
  permissions?: string[];
}

export class AgentRegistry {
  private readonly logger: Logger;
  private agents: Map<string, AgentInfo> = new Map();
  private agentTypes: Map<string, typeof BaseAgent> = new Map();
  private eventListeners: Map<string, Function[]> = new Map();

  constructor() {
    this.logger = new Logger('AgentRegistry');
  }

  /**
   * Register an agent instance
   */
  async register(agentId: string, agent: BaseAgent): Promise<void> {
    try {
      if (this.agents.has(agentId)) {
        throw new Error(`Agent with ID '${agentId}' is already registered`);
      }

      const agentInfo: AgentInfo = {
        id: agentId,
        agent,
        config: agent.getConfig(),
        state: agent.getState(),
        registeredAt: new Date(),
        lastActivity: new Date()
      };

      this.agents.set(agentId, agentInfo);

      this.logger.info(`Agent '${agentId}' registered successfully`);
      this.emit('agentRegistered', { agentId, config: agent.getConfig() });
    } catch (error) {
      this.logger.error(`Failed to register agent '${agentId}'`, error);
      throw error;
    }
  }

  /**
   * Register an agent type/class
   */
  registerType(typeName: string, agentClass: typeof BaseAgent): void {
    this.agentTypes.set(typeName, agentClass);
    this.logger.info(`Agent type '${typeName}' registered`);
  }

  /**
   * Create and register an agent instance
   */
  async createAgent(agentId: string, typeName: string, config: AgentConfig): Promise<BaseAgent> {
    try {
      const AgentClass = this.agentTypes.get(typeName);
      if (!AgentClass) {
        throw new Error(`Unknown agent type: ${typeName}`);
      }

      const agent = new AgentClass(config);
      await this.register(agentId, agent);

      return agent;
    } catch (error) {
      this.logger.error(`Failed to create agent '${agentId}' of type '${typeName}'`, error);
      throw error;
    }
  }

  /**
   * Get agent by ID
   */
  getAgent(agentId: string): BaseAgent | null {
    const agentInfo = this.agents.get(agentId);
    return agentInfo ? agentInfo.agent : null;
  }

  /**
   * Get agent info by ID
   */
  getAgentInfo(agentId: string): AgentInfo | null {
    return this.agents.get(agentId) || null;
  }

  /**
   * Get all agents
   */
  getAllAgents(): AgentInfo[] {
    return Array.from(this.agents.values());
  }

  /**
   * Get agents by filter
   */
  getAgentsByFilter(filter: AgentFilter): AgentInfo[] {
    return Array.from(this.agents.values()).filter(agentInfo => {
      if (filter.status && agentInfo.state.status !== filter.status) {
        return false;
      }

      if (filter.role && agentInfo.config.role !== filter.role) {
        return false;
      }

      if (filter.capabilities) {
        const hasAllCapabilities = filter.capabilities.every(cap => agentInfo.state.capabilities.includes(cap));
        if (!hasAllCapabilities) {
          return false;
        }
      }

      if (filter.permissions) {
        const hasAllPermissions = filter.permissions.every(perm => agentInfo.state.permissions.includes(perm));
        if (!hasAllPermissions) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * Get agents by role
   */
  getAgentsByRole(role: string): AgentInfo[] {
    return this.getAgentsByFilter({ role });
  }

  /**
   * Get agents by status
   */
  getAgentsByStatus(status: string): AgentInfo[] {
    return this.getAgentsByFilter({ status });
  }

  /**
   * Get agents with specific capability
   */
  getAgentsWithCapability(capability: string): AgentInfo[] {
    return Array.from(this.agents.values()).filter(agentInfo => agentInfo.state.capabilities.includes(capability));
  }

  /**
   * Update agent state
   */
  async updateAgentState(agentId: string, newState: Partial<AgentState>): Promise<void> {
    const agentInfo = this.agents.get(agentId);
    if (!agentInfo) {
      throw new Error(`Agent '${agentId}' not found`);
    }

    agentInfo.state = { ...agentInfo.state, ...newState };
    agentInfo.lastActivity = new Date();

    this.logger.debug(`Agent '${agentId}' state updated`, newState);
    this.emit('agentStateUpdated', { agentId, newState });
  }

  /**
   * Unregister an agent
   */
  async unregister(agentId: string): Promise<boolean> {
    try {
      const agentInfo = this.agents.get(agentId);
      if (!agentInfo) {
        return false;
      }

      // Stop the agent if it's running
      if (agentInfo.state.status !== 'stopped') {
        await agentInfo.agent.stop();
      }

      this.agents.delete(agentId);

      this.logger.info(`Agent '${agentId}' unregistered`);
      this.emit('agentUnregistered', { agentId });

      return true;
    } catch (error) {
      this.logger.error(`Failed to unregister agent '${agentId}'`, error);
      throw error;
    }
  }

  /**
   * Initialize all registered agents
   */
  async initializeAllAgents(): Promise<void> {
    const agentIds = Array.from(this.agents.keys());

    this.logger.info(`Initializing ${agentIds.length} agents`);

    const initPromises = agentIds.map(async agentId => {
      try {
        const agentInfo = this.agents.get(agentId)!;
        await agentInfo.agent.initialize();
        await this.updateAgentState(agentId, { status: 'ready' });

        this.logger.info(`Agent '${agentId}' initialized successfully`);
      } catch (error) {
        this.logger.error(`Failed to initialize agent '${agentId}'`, error);
        await this.updateAgentState(agentId, { status: 'error' });
        throw error;
      }
    });

    await Promise.allSettled(initPromises);
  }

  /**
   * Stop all agents
   */
  async stopAllAgents(): Promise<void> {
    const agentIds = Array.from(this.agents.keys());

    this.logger.info(`Stopping ${agentIds.length} agents`);

    const stopPromises = agentIds.map(async agentId => {
      try {
        const agentInfo = this.agents.get(agentId)!;
        await agentInfo.agent.stop();
        await this.updateAgentState(agentId, { status: 'stopped' });

        this.logger.info(`Agent '${agentId}' stopped successfully`);
      } catch (error) {
        this.logger.error(`Failed to stop agent '${agentId}'`, error);
        throw error;
      }
    });

    await Promise.allSettled(stopPromises);
  }

  /**
   * Get registry statistics
   */
  getStats(): RegistryStats {
    const agents = Array.from(this.agents.values());
    const now = Date.now();

    const activeAgents = agents.filter(a => a.state.status === 'ready' || a.state.status === 'busy').length;
    const errorAgents = agents.filter(a => a.state.status === 'error').length;
    const stoppedAgents = agents.filter(a => a.state.status === 'stopped').length;

    const averageUptime =
      agents.length > 0 ? agents.reduce((sum, a) => sum + (now - a.registeredAt.getTime()), 0) / agents.length : 0;

    return {
      totalAgents: agents.length,
      activeAgents,
      errorAgents,
      stoppedAgents,
      averageUptime
    };
  }

  /**
   * Health check for all agents
   */
  async healthCheck(): Promise<{ healthy: number; unhealthy: number; details: any[] }> {
    const agents = Array.from(this.agents.values());
    let healthy = 0;
    let unhealthy = 0;
    const details: any[] = [];

    for (const agentInfo of agents) {
      try {
        const state = agentInfo.agent.getState();
        const isHealthy = state.status === 'ready' || state.status === 'busy';

        if (isHealthy) {
          healthy++;
        } else {
          unhealthy++;
        }

        details.push({
          agentId: agentInfo.id,
          status: state.status,
          healthy: isHealthy,
          lastActivity: agentInfo.lastActivity,
          uptime: Date.now() - agentInfo.registeredAt.getTime()
        });
      } catch (error) {
        unhealthy++;
        details.push({
          agentId: agentInfo.id,
          status: 'error',
          healthy: false,
          error: error.message
        });
      }
    }

    return { healthy, unhealthy, details };
  }

  /**
   * Cleanup inactive agents
   */
  async cleanupInactiveAgents(maxInactiveTime: number = 3600000): Promise<number> {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [agentId, agentInfo] of this.agents.entries()) {
      const inactiveTime = now - agentInfo.lastActivity.getTime();

      if (inactiveTime > maxInactiveTime && agentInfo.state.status !== 'busy') {
        try {
          await this.unregister(agentId);
          cleanedCount++;
        } catch (error) {
          this.logger.error(`Failed to cleanup agent '${agentId}'`, error);
        }
      }
    }

    if (cleanedCount > 0) {
      this.logger.info(`Cleaned up ${cleanedCount} inactive agents`);
    }

    return cleanedCount;
  }

  /**
   * Add event listener
   */
  on(event: string, listener: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(listener);
  }

  /**
   * Remove event listener
   */
  off(event: string, listener: Function): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  /**
   * Emit event
   */
  private emit(event: string, data: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(listener => {
        try {
          listener(data);
        } catch (error) {
          this.logger.error(`Error in event listener for '${event}'`, error);
        }
      });
    }
  }

  /**
   * Get available agent types
   */
  getAvailableTypes(): string[] {
    return Array.from(this.agentTypes.keys());
  }

  /**
   * Check if agent type is registered
   */
  hasType(typeName: string): boolean {
    return this.agentTypes.has(typeName);
  }

  /**
   * Get agent type class
   */
  getAgentType(typeName: string): typeof BaseAgent | null {
    return this.agentTypes.get(typeName) || null;
  }
}
