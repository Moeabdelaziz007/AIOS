/**
 * BaseAgent.ts
 *
 * Enhanced base agent class based on high-quality patterns from ZQBAC and SelfOS projects.
 * Provides comprehensive functionality including security, error handling, and lifecycle management.
 */

import { ErrorCategory, ErrorHandler, ErrorSeverity } from '../utils/ErrorHandler';
import { Logger } from '../utils/Logger';
import { MetricsCollector } from '../utils/Metrics';
import { InputValidator } from '../utils/Validator';
import { LifecycleManager } from './LifecycleManager';
import { SecurityManager } from './SecurityManager';

export interface AgentConfig {
  id: string;
  role: string;
  permissions?: string[];
  capabilities?: string[];
  securityLevel?: 'low' | 'medium' | 'high' | 'critical';
  maxRetries?: number;
  timeout?: number;
  enableMetrics?: boolean;
  enableAudit?: boolean;
}

export interface AgentState {
  status: 'initializing' | 'ready' | 'busy' | 'error' | 'stopped';
  initialized: boolean;
  lastActivity: number;
  metrics: AgentMetrics;
  permissions: string[];
  capabilities: string[];
}

export interface AgentMetrics {
  tasksProcessed: number;
  errorsEncountered: number;
  averageExecutionTime: number;
  successRate: number;
  resourceUsage: ResourceUsage;
}

export interface ResourceUsage {
  memory: number;
  cpu: number;
  network: number;
  disk: number;
}

export interface TaskRequest {
  id: string;
  type: string;
  payload: any;
  priority: 'low' | 'normal' | 'high' | 'critical';
  timeout?: number;
  retries?: number;
}

export interface TaskResult {
  success: boolean;
  data?: any;
  error?: string;
  executionTime: number;
  metrics?: Partial<AgentMetrics>;
}

export abstract class BaseAgent {
  protected readonly logger: Logger;
  protected readonly securityManager: SecurityManager;
  protected readonly lifecycleManager: LifecycleManager;
  protected readonly metricsCollector: MetricsCollector;
  protected readonly errorHandler: ErrorHandler;
  protected readonly inputValidator: InputValidator;

  protected config: AgentConfig;
  protected state: AgentState;
  protected isInitialized: boolean = false;

  constructor(config: AgentConfig) {
    this.config = {
      securityLevel: 'medium',
      maxRetries: 3,
      timeout: 30000,
      enableMetrics: true,
      enableAudit: true,
      ...config
    };

    this.logger = new Logger(`Agent:${config.id}`);
    this.securityManager = new SecurityManager();
    this.lifecycleManager = new LifecycleManager();
    this.metricsCollector = new MetricsCollector();
    this.errorHandler = new ErrorHandler();
    this.inputValidator = new InputValidator();

    this.state = {
      status: 'initializing',
      initialized: false,
      lastActivity: Date.now(),
      metrics: {
        tasksProcessed: 0,
        errorsEncountered: 0,
        averageExecutionTime: 0,
        successRate: 0,
        resourceUsage: {
          memory: 0,
          cpu: 0,
          network: 0,
          disk: 0
        }
      },
      permissions: config.permissions || [],
      capabilities: config.capabilities || []
    };

    this.logger.info(`Agent ${config.id} created with role: ${config.role}`);
  }

  /**
   * Initialize the agent with configuration
   */
  async initialize(): Promise<void> {
    try {
      this.logger.info(`Initializing agent ${this.config.id}`);

      // Validate configuration
      await this.validateConfig();

      // Initialize security
      await this.securityManager.initialize(this.config);

      // Initialize lifecycle manager
      await this.lifecycleManager.initialize(this.config.id);

      // Initialize metrics collection
      if (this.config.enableMetrics) {
        await this.metricsCollector.start(this.config.id);
      }

      // Perform agent-specific initialization
      await this.onInitialize();

      this.state.status = 'ready';
      this.state.initialized = true;
      this.isInitialized = true;

      this.logger.info(`Agent ${this.config.id} initialized successfully`);
    } catch (error) {
      this.state.status = 'error';
      await this.errorHandler.handleError(error, ErrorCategory.INITIALIZATION, ErrorSeverity.HIGH, {
        agentId: this.config.id
      });
      throw error;
    }
  }

  /**
   * Process a task with comprehensive error handling and security
   */
  async processTask(task: TaskRequest): Promise<TaskResult> {
    const startTime = Date.now();

    try {
      // Validate agent is ready
      if (!this.isInitialized) {
        throw new Error('Agent not initialized');
      }

      // Validate task input
      const validationResult = await this.inputValidator.validateTask(task);
      if (!validationResult.valid) {
        throw new Error(`Task validation failed: ${validationResult.errors.join(', ')}`);
      }

      // Check permissions
      const hasPermission = await this.securityManager.checkPermission(this.config.id, task.type, task.payload);

      if (!hasPermission) {
        throw new Error(`Permission denied for task type: ${task.type}`);
      }

      // Update state
      this.state.status = 'busy';
      this.state.lastActivity = Date.now();

      // Execute task with retry logic
      const result = await this.executeWithRetry(task);

      // Update metrics
      const executionTime = Date.now() - startTime;
      this.updateMetrics(true, executionTime);

      this.state.status = 'ready';

      return {
        success: true,
        data: result,
        executionTime,
        metrics: this.state.metrics
      };
    } catch (error) {
      const executionTime = Date.now() - startTime;
      this.updateMetrics(false, executionTime);

      this.state.status = 'error';

      await this.errorHandler.handleError(error, ErrorCategory.TASK_PROCESSING, ErrorSeverity.MEDIUM, {
        agentId: this.config.id,
        taskId: task.id
      });

      return {
        success: false,
        error: error.message,
        executionTime,
        metrics: this.state.metrics
      };
    }
  }

  /**
   * Execute task with retry logic
   */
  private async executeWithRetry(task: TaskRequest): Promise<any> {
    let lastError: Error;
    const maxRetries = task.retries || this.config.maxRetries || 3;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await this.executeTask(task);
      } catch (error) {
        lastError = error as Error;

        if (attempt < maxRetries) {
          this.logger.warn(`Task ${task.id} failed, retrying (${attempt + 1}/${maxRetries})`);
          await this.delay(Math.pow(2, attempt) * 1000); // Exponential backoff
        }
      }
    }

    throw lastError!;
  }

  /**
   * Abstract method to be implemented by subclasses
   */
  protected abstract executeTask(task: TaskRequest): Promise<any>;

  /**
   * Hook for agent-specific initialization
   */
  protected async onInitialize(): Promise<void> {
    // Override in subclasses
  }

  /**
   * Validate agent configuration
   */
  private async validateConfig(): Promise<void> {
    if (!this.config.id || !this.config.role) {
      throw new Error('Agent ID and role are required');
    }

    if (this.config.securityLevel && !['low', 'medium', 'high', 'critical'].includes(this.config.securityLevel)) {
      throw new Error('Invalid security level');
    }
  }

  /**
   * Update agent metrics
   */
  private updateMetrics(success: boolean, executionTime: number): void {
    this.state.metrics.tasksProcessed++;

    if (!success) {
      this.state.metrics.errorsEncountered++;
    }

    // Update average execution time
    const totalTime = this.state.metrics.averageExecutionTime * (this.state.metrics.tasksProcessed - 1) + executionTime;
    this.state.metrics.averageExecutionTime = totalTime / this.state.metrics.tasksProcessed;

    // Update success rate
    this.state.metrics.successRate =
      ((this.state.metrics.tasksProcessed - this.state.metrics.errorsEncountered) / this.state.metrics.tasksProcessed) *
      100;

    // Update resource usage (simplified)
    this.state.metrics.resourceUsage.memory = process.memoryUsage().heapUsed;
    this.state.metrics.resourceUsage.cpu = process.cpuUsage().user;
  }

  /**
   * Get current agent state
   */
  getState(): AgentState {
    return { ...this.state };
  }

  /**
   * Get agent configuration
   */
  getConfig(): AgentConfig {
    return { ...this.config };
  }

  /**
   * Check if agent has specific capability
   */
  hasCapability(capability: string): boolean {
    return this.state.capabilities.includes(capability);
  }

  /**
   * Check if agent has specific permission
   */
  hasPermission(permission: string): boolean {
    return this.state.permissions.includes(permission);
  }

  /**
   * Add capability to agent
   */
  addCapability(capability: string): void {
    if (!this.state.capabilities.includes(capability)) {
      this.state.capabilities.push(capability);
      this.logger.info(`Added capability: ${capability}`);
    }
  }

  /**
   * Remove capability from agent
   */
  removeCapability(capability: string): void {
    const index = this.state.capabilities.indexOf(capability);
    if (index > -1) {
      this.state.capabilities.splice(index, 1);
      this.logger.info(`Removed capability: ${capability}`);
    }
  }

  /**
   * Stop the agent and cleanup resources
   */
  async stop(): Promise<void> {
    try {
      this.logger.info(`Stopping agent ${this.config.id}`);

      this.state.status = 'stopped';

      // Stop metrics collection
      if (this.config.enableMetrics) {
        await this.metricsCollector.stop();
      }

      // Perform agent-specific cleanup
      await this.onStop();

      this.logger.info(`Agent ${this.config.id} stopped successfully`);
    } catch (error) {
      await this.errorHandler.handleError(error, ErrorCategory.CLEANUP, ErrorSeverity.LOW, { agentId: this.config.id });
      throw error;
    }
  }

  /**
   * Hook for agent-specific cleanup
   */
  protected async onStop(): Promise<void> {
    // Override in subclasses
  }

  /**
   * Utility method for delays
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
