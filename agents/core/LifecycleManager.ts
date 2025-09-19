/**
 * LifecycleManager.ts
 *
 * Comprehensive lifecycle management system for agents.
 * Handles initialization, startup, shutdown, and health monitoring.
 */

import { Logger } from './Logger';

export interface LifecycleConfig {
  enableHealthChecks: boolean;
  healthCheckInterval: number;
  startupTimeout: number;
  shutdownTimeout: number;
  enableGracefulShutdown: boolean;
  maxRetries: number;
  retryDelay: number;
}

export interface LifecycleState {
  phase: 'created' | 'initializing' | 'ready' | 'running' | 'stopping' | 'stopped' | 'error';
  startTime?: Date;
  readyTime?: Date;
  stopTime?: Date;
  errorCount: number;
  lastError?: Error;
  healthStatus: 'healthy' | 'unhealthy' | 'unknown';
  lastHealthCheck?: Date;
}

export interface HealthCheck {
  name: string;
  check: () => Promise<boolean>;
  timeout: number;
  critical: boolean;
}

export interface LifecycleEvent {
  type: 'initialized' | 'started' | 'stopped' | 'error' | 'healthCheck';
  timestamp: Date;
  agentId: string;
  data?: any;
}

export class LifecycleManager {
  private readonly logger: Logger;
  private config: LifecycleConfig;
  private state: LifecycleState;
  private healthChecks: Map<string, HealthCheck> = new Map();
  private healthCheckInterval?: NodeJS.Timeout;
  private eventListeners: Map<string, Function[]> = new Map();
  private agentId: string;

  constructor(config: Partial<LifecycleConfig> = {}) {
    this.config = {
      enableHealthChecks: true,
      healthCheckInterval: 30000, // 30 seconds
      startupTimeout: 60000, // 1 minute
      shutdownTimeout: 30000, // 30 seconds
      enableGracefulShutdown: true,
      maxRetries: 3,
      retryDelay: 1000,
      ...config
    };

    this.logger = new Logger('LifecycleManager');
    this.agentId = '';

    this.state = {
      phase: 'created',
      errorCount: 0,
      healthStatus: 'unknown'
    };
  }

  /**
   * Initialize lifecycle manager for an agent
   */
  async initialize(agentId: string): Promise<void> {
    try {
      this.agentId = agentId;
      this.logger.info(`Initializing lifecycle manager for agent: ${agentId}`);

      this.state.phase = 'initializing';
      this.state.startTime = new Date();

      // Start health checks if enabled
      if (this.config.enableHealthChecks) {
        this.startHealthChecks();
      }

      this.emit('initialized', { agentId, timestamp: new Date() });
      this.logger.info('Lifecycle manager initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize lifecycle manager', error);
      this.state.phase = 'error';
      this.state.lastError = error as Error;
      throw error;
    }
  }

  /**
   * Start the agent lifecycle
   */
  async start(): Promise<void> {
    try {
      this.logger.info(`Starting agent lifecycle: ${this.agentId}`);

      if (this.state.phase !== 'initializing') {
        throw new Error(`Cannot start agent from phase: ${this.state.phase}`);
      }

      this.state.phase = 'ready';
      this.state.readyTime = new Date();

      this.emit('started', { agentId: this.agentId, timestamp: new Date() });
      this.logger.info('Agent lifecycle started successfully');
    } catch (error) {
      this.logger.error('Failed to start agent lifecycle', error);
      this.state.phase = 'error';
      this.state.lastError = error as Error;
      this.state.errorCount++;
      throw error;
    }
  }

  /**
   * Stop the agent lifecycle
   */
  async stop(): Promise<void> {
    try {
      this.logger.info(`Stopping agent lifecycle: ${this.agentId}`);

      if (this.state.phase === 'stopped') {
        this.logger.warn('Agent lifecycle already stopped');
        return;
      }

      this.state.phase = 'stopping';

      // Stop health checks
      if (this.healthCheckInterval) {
        clearInterval(this.healthCheckInterval);
        this.healthCheckInterval = undefined;
      }

      // Perform graceful shutdown if enabled
      if (this.config.enableGracefulShutdown) {
        await this.performGracefulShutdown();
      }

      this.state.phase = 'stopped';
      this.state.stopTime = new Date();

      this.emit('stopped', { agentId: this.agentId, timestamp: new Date() });
      this.logger.info('Agent lifecycle stopped successfully');
    } catch (error) {
      this.logger.error('Failed to stop agent lifecycle', error);
      this.state.phase = 'error';
      this.state.lastError = error as Error;
      this.state.errorCount++;
      throw error;
    }
  }

  /**
   * Add a health check
   */
  addHealthCheck(name: string, check: HealthCheck): void {
    this.healthChecks.set(name, check);
    this.logger.info(`Added health check: ${name}`);
  }

  /**
   * Remove a health check
   */
  removeHealthCheck(name: string): boolean {
    const removed = this.healthChecks.delete(name);
    if (removed) {
      this.logger.info(`Removed health check: ${name}`);
    }
    return removed;
  }

  /**
   * Perform health check
   */
  async performHealthCheck(): Promise<{ healthy: boolean; results: Record<string, boolean> }> {
    const results: Record<string, boolean> = {};
    let overallHealthy = true;

    for (const [name, healthCheck] of this.healthChecks.entries()) {
      try {
        const timeoutPromise = new Promise<boolean>((_, reject) => {
          setTimeout(() => reject(new Error('Health check timeout')), healthCheck.timeout);
        });

        const checkPromise = healthCheck.check();
        const result = await Promise.race([checkPromise, timeoutPromise]);

        results[name] = result;

        if (!result && healthCheck.critical) {
          overallHealthy = false;
        }
      } catch (error) {
        this.logger.error(`Health check failed: ${name}`, error);
        results[name] = false;

        if (healthCheck.critical) {
          overallHealthy = false;
        }
      }
    }

    this.state.healthStatus = overallHealthy ? 'healthy' : 'unhealthy';
    this.state.lastHealthCheck = new Date();

    this.emit('healthCheck', {
      agentId: this.agentId,
      timestamp: new Date(),
      healthy: overallHealthy,
      results
    });

    return { healthy: overallHealthy, results };
  }

  /**
   * Get current lifecycle state
   */
  getState(): LifecycleState {
    return { ...this.state };
  }

  /**
   * Get lifecycle statistics
   */
  getStats(): any {
    const now = new Date();

    return {
      phase: this.state.phase,
      uptime: this.state.startTime ? now.getTime() - this.state.startTime.getTime() : 0,
      readyTime: this.state.readyTime ? now.getTime() - this.state.readyTime.getTime() : 0,
      errorCount: this.state.errorCount,
      healthStatus: this.state.healthStatus,
      lastHealthCheck: this.state.lastHealthCheck,
      healthChecksCount: this.healthChecks.size,
      lastError: this.state.lastError?.message
    };
  }

  /**
   * Check if agent is healthy
   */
  isHealthy(): boolean {
    return this.state.healthStatus === 'healthy';
  }

  /**
   * Check if agent is ready
   */
  isReady(): boolean {
    return this.state.phase === 'ready' || this.state.phase === 'running';
  }

  /**
   * Check if agent is running
   */
  isRunning(): boolean {
    return this.state.phase === 'running';
  }

  /**
   * Check if agent is stopped
   */
  isStopped(): boolean {
    return this.state.phase === 'stopped';
  }

  /**
   * Record an error
   */
  recordError(error: Error): void {
    this.state.errorCount++;
    this.state.lastError = error;

    this.emit('error', {
      agentId: this.agentId,
      timestamp: new Date(),
      error: error.message,
      errorCount: this.state.errorCount
    });

    this.logger.error('Lifecycle error recorded', error);
  }

  /**
   * Reset error count
   */
  resetErrorCount(): void {
    this.state.errorCount = 0;
    this.state.lastError = undefined;
    this.logger.info('Error count reset');
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
   * Start health checks
   */
  private startHealthChecks(): void {
    if (this.healthCheckInterval) {
      return; // Already running
    }

    this.healthCheckInterval = setInterval(async () => {
      try {
        await this.performHealthCheck();
      } catch (error) {
        this.logger.error('Health check failed', error);
      }
    }, this.config.healthCheckInterval);

    this.logger.info('Health checks started');
  }

  /**
   * Perform graceful shutdown
   */
  private async performGracefulShutdown(): Promise<void> {
    this.logger.info('Performing graceful shutdown');

    // Give time for ongoing operations to complete
    await this.delay(this.config.shutdownTimeout);

    this.logger.info('Graceful shutdown completed');
  }

  /**
   * Emit lifecycle event
   */
  private emit(event: string, data: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(listener => {
        try {
          listener(data);
        } catch (error) {
          this.logger.error(`Error in lifecycle event listener for '${event}'`, error);
        }
      });
    }
  }

  /**
   * Utility method for delays
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get configuration
   */
  getConfig(): LifecycleConfig {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<LifecycleConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.logger.info('Lifecycle configuration updated');
  }
}
