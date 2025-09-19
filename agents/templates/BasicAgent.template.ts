/**
 * BasicAgent.template.ts
 *
 * Template for creating basic agents with standard functionality.
 * Copy this file and customize for your specific agent needs.
 */

import { AgentConfig, BaseAgent, TaskRequest } from '../core/BaseAgent';
import { Logger } from '../utils/Logger';

export interface BasicAgentConfig extends AgentConfig {
  // Add your specific configuration properties here
  customProperty?: string;
  maxConcurrentTasks?: number;
  enableCaching?: boolean;
}

export class BasicAgent extends BaseAgent {
  private readonly logger: Logger;
  private customState: any = {};

  constructor(config: BasicAgentConfig) {
    super(config);
    this.logger = new Logger(`BasicAgent:${config.id}`);
  }

  /**
   * Initialize the agent with custom logic
   */
  protected async onInitialize(): Promise<void> {
    this.logger.info('Initializing BasicAgent');

    // Add your initialization logic here
    this.customState = {
      initialized: true,
      customProperty: this.config.customProperty || 'default',
      maxConcurrentTasks: this.config.maxConcurrentTasks || 5,
      enableCaching: this.config.enableCaching || false
    };

    this.logger.info('BasicAgent initialized successfully');
  }

  /**
   * Execute a task with custom logic
   */
  protected async executeTask(task: TaskRequest): Promise<any> {
    this.logger.info(`Executing task: ${task.type}`, { taskId: task.id });

    try {
      // Add your task execution logic here
      switch (task.type) {
        case 'example_task':
          return await this.handleExampleTask(task);

        case 'custom_task':
          return await this.handleCustomTask(task);

        default:
          throw new Error(`Unknown task type: ${task.type}`);
      }
    } catch (error) {
      this.logger.error(`Task execution failed: ${task.type}`, error);
      throw error;
    }
  }

  /**
   * Handle example task
   */
  private async handleExampleTask(task: TaskRequest): Promise<any> {
    this.logger.info('Handling example task', { payload: task.payload });

    // Add your task-specific logic here
    const result = {
      taskId: task.id,
      processedAt: new Date().toISOString(),
      result: 'Task completed successfully',
      customData: this.customState.customProperty
    };

    return result;
  }

  /**
   * Handle custom task
   */
  private async handleCustomTask(task: TaskRequest): Promise<any> {
    this.logger.info('Handling custom task', { payload: task.payload });

    // Add your custom task logic here
    const result = {
      taskId: task.id,
      processedAt: new Date().toISOString(),
      result: 'Custom task completed',
      data: task.payload
    };

    return result;
  }

  /**
   * Cleanup resources when agent stops
   */
  protected async onStop(): Promise<void> {
    this.logger.info('Stopping BasicAgent');

    // Add your cleanup logic here
    this.customState = {};

    this.logger.info('BasicAgent stopped successfully');
  }

  /**
   * Get custom state
   */
  getCustomState(): any {
    return { ...this.customState };
  }

  /**
   * Update custom state
   */
  updateCustomState(newState: any): void {
    this.customState = { ...this.customState, ...newState };
    this.logger.debug('Custom state updated', newState);
  }
}

// Export the agent class for registration
export default BasicAgent;
