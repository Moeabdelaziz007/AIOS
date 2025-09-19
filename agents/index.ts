/**
 * index.ts
 *
 * Main entry point for the AIOS Agents system.
 * Exports all core classes and utilities for easy integration.
 */

// Core classes
export { AgentRegistry, type AgentFilter, type AgentInfo, type RegistryStats } from './core/AgentRegistry';
export { BaseAgent, type AgentConfig, type AgentState, type TaskRequest, type TaskResult } from './core/BaseAgent';
export { LifecycleManager, type HealthCheck, type LifecycleConfig, type LifecycleState } from './core/LifecycleManager';
export { SecurityManager, type Permission, type SecurityConfig, type UserSession } from './core/SecurityManager';

// Utility classes
export {
  ErrorCategory,
  ErrorHandler,
  ErrorSeverity,
  type ErrorReport,
  type RecoveryStrategy
} from './utils/ErrorHandler';
export { LogLevel, Logger, type LogEntry, type LoggerConfig } from './utils/Logger';
export { MetricsCollector, type MetricData, type PerformanceMetrics, type ResourceMetrics } from './utils/Metrics';
export { InputValidator, type ValidationResult, type ValidationRule, type ValidationSchema } from './utils/Validator';

// Security services
export { AuditService, type AuditConfig, type AuditEvent, type AuditQuery } from './security/AuditService';
export { CryptoService, type CryptoConfig, type EncryptionResult, type HashResult } from './security/CryptoService';
export { PolicyEngine, type PolicyContext, type PolicyResult, type PolicyRule } from './security/PolicyEngine';

// Specialized agents
export {
  CommunicationAgent,
  type CommunicationAgentConfig,
  type CommunicationTask,
  type Message
} from './specialized/CommunicationAgent';

// Templates
export { AdvancedAgent, type AdvancedAgentConfig, type AdvancedAgentState } from './templates/AdvancedAgent.template';
export { BasicAgent, type BasicAgentConfig } from './templates/BasicAgent.template';

/**
 * Create a new agent registry instance
 */
export function createAgentRegistry(): AgentRegistry {
  return new AgentRegistry();
}

/**
 * Create a new security manager instance
 */
export function createSecurityManager(config?: Partial<SecurityConfig>): SecurityManager {
  return new SecurityManager(config);
}

/**
 * Create a new logger instance
 */
export function createLogger(context: string, config?: Partial<LoggerConfig>): Logger {
  return new Logger(context, config);
}

/**
 * Create a new error handler instance
 */
export function createErrorHandler(): ErrorHandler {
  return new ErrorHandler();
}

/**
 * Create a new metrics collector instance
 */
export function createMetricsCollector(config?: Partial<MetricConfig>): MetricsCollector {
  return new MetricsCollector(config);
}

/**
 * Create a new input validator instance
 */
export function createInputValidator(): InputValidator {
  return new InputValidator();
}

/**
 * Create a new audit service instance
 */
export function createAuditService(config?: Partial<AuditConfig>): AuditService {
  return new AuditService(config);
}

/**
 * Create a new crypto service instance
 */
export function createCryptoService(config?: Partial<CryptoConfig>): CryptoService {
  return new CryptoService(config);
}

/**
 * Create a new policy engine instance
 */
export function createPolicyEngine(config?: Partial<PolicyConfig>): PolicyEngine {
  return new PolicyEngine(config);
}

/**
 * Create a new lifecycle manager instance
 */
export function createLifecycleManager(config?: Partial<LifecycleConfig>): LifecycleManager {
  return new LifecycleManager(config);
}

/**
 * Default configuration for the agents system
 */
export const defaultConfig = {
  security: {
    enableAudit: true,
    enableEncryption: true,
    sessionTimeout: 3600000,
    maxLoginAttempts: 5
  },
  logging: {
    level: LogLevel.INFO,
    enableConsole: true,
    enableFile: false,
    format: 'compact' as const
  },
  metrics: {
    collectionInterval: 5000,
    retentionPeriod: 3600000,
    enableRealTime: true
  },
  lifecycle: {
    enableHealthChecks: true,
    healthCheckInterval: 30000,
    startupTimeout: 60000,
    shutdownTimeout: 30000
  },
  policy: {
    enablePolicyEngine: true,
    defaultEffect: 'deny' as const,
    enableAudit: true,
    enableCaching: true
  }
};

/**
 * Initialize the complete agents system
 */
export async function initializeAgentsSystem(config: Partial<typeof defaultConfig> = {}): Promise<{
  registry: AgentRegistry;
  security: SecurityManager;
  audit: AuditService;
  crypto: CryptoService;
  policy: PolicyEngine;
  logger: Logger;
}> {
  const finalConfig = { ...defaultConfig, ...config };

  // Create core services
  const logger = createLogger('AgentsSystem', finalConfig.logging);
  const security = createSecurityManager(finalConfig.security);
  const audit = createAuditService(finalConfig.security);
  const crypto = createCryptoService(finalConfig.security);
  const policy = createPolicyEngine(finalConfig.policy);
  const registry = createAgentRegistry();

  // Initialize services
  await security.initialize(finalConfig.security);
  await audit.initialize();
  await crypto.initialize();
  await policy.initialize();

  logger.info('AIOS Agents system initialized successfully');

  return {
    registry,
    security,
    audit,
    crypto,
    policy,
    logger
  };
}
