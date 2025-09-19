/**
 * AdvancedAgent.template.ts
 *
 * Template for creating advanced agents with sophisticated functionality.
 * Includes error recovery, metrics, caching, and advanced features.
 */

import { AgentConfig, BaseAgent, TaskRequest } from '../core/BaseAgent';
import { Logger } from '../utils/Logger';
import { MetricsCollector } from '../utils/Metrics';

export interface AdvancedAgentConfig extends AgentConfig {
  // Advanced configuration properties
  enableMetrics?: boolean;
  enableCaching?: boolean;
  cacheSize?: number;
  enableRetry?: boolean;
  maxRetries?: number;
  retryDelay?: number;
  enableCircuitBreaker?: boolean;
  circuitBreakerThreshold?: number;
  enableRateLimiting?: boolean;
  rateLimit?: number;
  customFeatures?: string[];
}

export interface AdvancedAgentState {
  cache: Map<string, any>;
  circuitBreakerState: 'closed' | 'open' | 'half-open';
  circuitBreakerFailures: number;
  rateLimiterTokens: number;
  lastRateLimitReset: number;
  customMetrics: Map<string, number>;
}

export class AdvancedAgent extends BaseAgent {
  private readonly logger: Logger;
  private readonly metricsCollector: MetricsCollector;
  private advancedState: AdvancedAgentState;
  private config: AdvancedAgentConfig;

  constructor(config: AdvancedAgentConfig) {
    super(config);
    this.config = config;
    this.logger = new Logger(`AdvancedAgent:${config.id}`);
    this.metricsCollector = new MetricsCollector();

    this.advancedState = {
      cache: new Map(),
      circuitBreakerState: 'closed',
      circuitBreakerFailures: 0,
      rateLimiterTokens: config.rateLimit || 100,
      lastRateLimitReset: Date.now(),
      customMetrics: new Map()
    };
  }

  /**
   * Initialize the advanced agent
   */
  protected async onInitialize(): Promise<void> {
    this.logger.info('Initializing AdvancedAgent');

    try {
      // Initialize metrics collection
      if (this.config.enableMetrics) {
        await this.metricsCollector.start(this.config.id);
      }

      // Initialize cache
      if (this.config.enableCaching) {
        this.initializeCache();
      }

      // Initialize circuit breaker
      if (this.config.enableCircuitBreaker) {
        this.initializeCircuitBreaker();
      }

      // Initialize rate limiter
      if (this.config.enableRateLimiting) {
        this.initializeRateLimiter();
      }

      this.logger.info('AdvancedAgent initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize AdvancedAgent', error);
      throw error;
    }
  }

  /**
   * Execute task with advanced features
   */
  protected async executeTask(task: TaskRequest): Promise<any> {
    const startTime = Date.now();

    try {
      // Check circuit breaker
      if (this.config.enableCircuitBreaker && !this.isCircuitBreakerClosed()) {
        throw new Error('Circuit breaker is open');
      }

      // Check rate limit
      if (this.config.enableRateLimiting && !this.checkRateLimit()) {
        throw new Error('Rate limit exceeded');
      }

      // Check cache first
      if (this.config.enableCaching) {
        const cachedResult = this.getFromCache(task);
        if (cachedResult) {
          this.logger.debug('Task result retrieved from cache', { taskId: task.id });
          return cachedResult;
        }
      }

      // Execute task with retry logic
      const result = await this.executeWithRetry(task);

      // Cache result
      if (this.config.enableCaching && result) {
        this.setCache(task, result);
      }

      // Update circuit breaker on success
      if (this.config.enableCircuitBreaker) {
        this.onCircuitBreakerSuccess();
      }

      // Update metrics
      if (this.config.enableMetrics) {
        this.updateCustomMetrics('tasks_completed', 1);
        this.updateCustomMetrics('average_execution_time', Date.now() - startTime);
      }

      return result;
    } catch (error) {
      // Update circuit breaker on failure
      if (this.config.enableCircuitBreaker) {
        this.onCircuitBreakerFailure();
      }

      // Update metrics
      if (this.config.enableMetrics) {
        this.updateCustomMetrics('tasks_failed', 1);
      }

      this.logger.error(`Task execution failed: ${task.type}`, error);
      throw error;
    }
  }

  /**
   * Execute task with retry logic
   */
  private async executeWithRetry(task: TaskRequest): Promise<any> {
    if (!this.config.enableRetry) {
      return this.executeTaskLogic(task);
    }

    const maxRetries = this.config.maxRetries || 3;
    const retryDelay = this.config.retryDelay || 1000;
    let lastError: Error;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await this.executeTaskLogic(task);
      } catch (error) {
        lastError = error as Error;

        if (attempt < maxRetries) {
          this.logger.warn(`Task ${task.id} failed, retrying (${attempt + 1}/${maxRetries})`);
          await this.delay(retryDelay * Math.pow(2, attempt)); // Exponential backoff
        }
      }
    }

    throw lastError!;
  }

  /**
   * Execute the actual task logic
   */
  private async executeTaskLogic(task: TaskRequest): Promise<any> {
    // Add your task execution logic here
    switch (task.type) {
      case 'advanced_task':
        return await this.handleAdvancedTask(task);

      case 'cached_task':
        return await this.handleCachedTask(task);

      case 'metrics_task':
        return await this.handleMetricsTask(task);

      default:
        throw new Error(`Unknown task type: ${task.type}`);
    }
  }

  /**
   * Handle advanced task
   */
  private async handleAdvancedTask(task: TaskRequest): Promise<any> {
    this.logger.info('Handling advanced task', { payload: task.payload });

    // Simulate some processing time
    await this.delay(100);

    return {
      taskId: task.id,
      processedAt: new Date().toISOString(),
      result: 'Advanced task completed',
      features: this.config.customFeatures || []
    };
  }

  /**
   * Handle cached task
   */
  private async handleCachedTask(task: TaskRequest): Promise<any> {
    this.logger.info('Handling cached task', { payload: task.payload });

    return {
      taskId: task.id,
      processedAt: new Date().toISOString(),
      result: 'Cached task completed',
      cacheHit: this.advancedState.cache.has(task.id)
    };
  }

  /**
   * Handle metrics task
   */
  private async handleMetricsTask(task: TaskRequest): Promise<any> {
    this.logger.info('Handling metrics task', { payload: task.payload });

    return {
      taskId: task.id,
      processedAt: new Date().toISOString(),
      result: 'Metrics task completed',
      metrics: Object.fromEntries(this.advancedState.customMetrics)
    };
  }

  /**
   * Initialize cache
   */
  private initializeCache(): void {
    this.logger.info('Initializing cache');
    // Cache is already initialized in constructor
  }

  /**
   * Initialize circuit breaker
   */
  private initializeCircuitBreaker(): void {
    this.logger.info('Initializing circuit breaker');
    this.advancedState.circuitBreakerState = 'closed';
    this.advancedState.circuitBreakerFailures = 0;
  }

  /**
   * Initialize rate limiter
   */
  private initializeRateLimiter(): void {
    this.logger.info('Initializing rate limiter');
    this.advancedState.rateLimiterTokens = this.config.rateLimit || 100;
    this.advancedState.lastRateLimitReset = Date.now();
  }

  /**
   * Check if circuit breaker is closed
   */
  private isCircuitBreakerClosed(): boolean {
    return this.advancedState.circuitBreakerState === 'closed';
  }

  /**
   * Check rate limit
   */
  private checkRateLimit(): boolean {
    const now = Date.now();
    const timeSinceReset = now - this.advancedState.lastRateLimitReset;

    // Reset tokens every second
    if (timeSinceReset >= 1000) {
      this.advancedState.rateLimiterTokens = this.config.rateLimit || 100;
      this.advancedState.lastRateLimitReset = now;
    }

    if (this.advancedState.rateLimiterTokens > 0) {
      this.advancedState.rateLimiterTokens--;
      return true;
    }

    return false;
  }

  /**
   * Handle circuit breaker success
   */
  private onCircuitBreakerSuccess(): void {
    this.advancedState.circuitBreakerFailures = 0;
    if (this.advancedState.circuitBreakerState === 'half-open') {
      this.advancedState.circuitBreakerState = 'closed';
      this.logger.info('Circuit breaker closed after successful operation');
    }
  }

  /**
   * Handle circuit breaker failure
   */
  private onCircuitBreakerFailure(): void {
    this.advancedState.circuitBreakerFailures++;

    const threshold = this.config.circuitBreakerThreshold || 5;
    if (this.advancedState.circuitBreakerFailures >= threshold) {
      this.advancedState.circuitBreakerState = 'open';
      this.logger.warn('Circuit breaker opened due to failures');
    }
  }

  /**
   * Get from cache
   */
  private getFromCache(task: TaskRequest): any {
    const cacheKey = this.generateCacheKey(task);
    return this.advancedState.cache.get(cacheKey);
  }

  /**
   * Set cache
   */
  private setCache(task: TaskRequest, result: any): void {
    const cacheKey = this.generateCacheKey(task);
    this.advancedState.cache.set(cacheKey, result);

    // Implement cache size limit
    const maxSize = this.config.cacheSize || 100;
    if (this.advancedState.cache.size > maxSize) {
      const firstKey = this.advancedState.cache.keys().next().value;
      this.advancedState.cache.delete(firstKey);
    }
  }

  /**
   * Generate cache key
   */
  private generateCacheKey(task: TaskRequest): string {
    return `${task.type}_${JSON.stringify(task.payload)}`;
  }

  /**
   * Update custom metrics
   */
  private updateCustomMetrics(metricName: string, value: number): void {
    const currentValue = this.advancedState.customMetrics.get(metricName) || 0;
    this.advancedState.customMetrics.set(metricName, currentValue + value);
  }

  /**
   * Get advanced state
   */
  getAdvancedState(): AdvancedAgentState {
    return { ...this.advancedState };
  }

  /**
   * Get custom metrics
   */
  getCustomMetrics(): Record<string, number> {
    return Object.fromEntries(this.advancedState.customMetrics);
  }

  /**
   * Cleanup resources
   */
  protected async onStop(): Promise<void> {
    this.logger.info('Stopping AdvancedAgent');

    try {
      // Stop metrics collection
      if (this.config.enableMetrics) {
        await this.metricsCollector.stop();
      }

      // Clear cache
      this.advancedState.cache.clear();

      // Reset circuit breaker
      this.advancedState.circuitBreakerState = 'closed';
      this.advancedState.circuitBreakerFailures = 0;

      this.logger.info('AdvancedAgent stopped successfully');
    } catch (error) {
      this.logger.error('Error during AdvancedAgent cleanup', error);
      throw error;
    }
  }

  /**
   * Utility method for delays
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export the agent class for registration
export default AdvancedAgent;
