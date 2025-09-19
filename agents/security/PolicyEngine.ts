/**
 * PolicyEngine.ts
 *
 * Policy enforcement engine for access control, resource management,
 * and compliance rules.
 */

import { Logger } from '../utils/Logger';

export interface PolicyRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  priority: number;
  conditions: PolicyCondition[];
  actions: PolicyAction[];
  effect: 'allow' | 'deny' | 'warn';
  resource: string;
  subject: string;
  context?: any;
}

export interface PolicyCondition {
  type: 'equals' | 'contains' | 'matches' | 'greater' | 'less' | 'in' | 'not_in' | 'custom';
  field: string;
  value: any;
  operator?: string;
  customFunction?: (context: any) => boolean;
}

export interface PolicyAction {
  type: 'log' | 'notify' | 'block' | 'redirect' | 'custom';
  parameters: any;
  customFunction?: (context: any) => void;
}

export interface PolicyContext {
  userId?: string;
  agentId?: string;
  resource: string;
  action: string;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  metadata?: any;
}

export interface PolicyResult {
  allowed: boolean;
  ruleId?: string;
  reason?: string;
  actions: PolicyAction[];
  metadata?: any;
}

export interface PolicyConfig {
  enablePolicyEngine: boolean;
  defaultEffect: 'allow' | 'deny';
  enableAudit: boolean;
  enableCaching: boolean;
  cacheTimeout: number;
  enableRealTime: boolean;
  maxRules: number;
}

export class PolicyEngine {
  private readonly logger: Logger;
  private config: PolicyConfig;
  private policies: Map<string, PolicyRule> = new Map();
  private policyCache: Map<string, PolicyResult> = new Map();
  private isInitialized: boolean = false;

  constructor(config: Partial<PolicyConfig> = {}) {
    this.config = {
      enablePolicyEngine: true,
      defaultEffect: 'deny',
      enableAudit: true,
      enableCaching: true,
      cacheTimeout: 300000, // 5 minutes
      enableRealTime: true,
      maxRules: 1000,
      ...config
    };

    this.logger = new Logger('PolicyEngine');
  }

  /**
   * Initialize policy engine
   */
  async initialize(): Promise<void> {
    try {
      this.logger.info('Initializing PolicyEngine');

      if (!this.config.enablePolicyEngine) {
        this.logger.info('Policy engine is disabled');
        return;
      }

      // Load default policies
      await this.loadDefaultPolicies();

      this.isInitialized = true;
      this.logger.info('PolicyEngine initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize PolicyEngine', error);
      throw error;
    }
  }

  /**
   * Check permission against policies
   */
  async checkPermission(userId: string, action: string, resource: any): Promise<boolean> {
    try {
      const context: PolicyContext = {
        userId,
        agentId: 'system',
        resource: typeof resource === 'string' ? resource : JSON.stringify(resource),
        action,
        timestamp: new Date()
      };

      const result = await this.evaluatePolicies(context);
      return result.allowed;
    } catch (error) {
      this.logger.error('Permission check failed', error);
      return this.config.defaultEffect === 'allow';
    }
  }

  /**
   * Evaluate policies for a given context
   */
  async evaluatePolicies(context: PolicyContext): Promise<PolicyResult> {
    try {
      // Check cache first
      if (this.config.enableCaching) {
        const cacheKey = this.generateCacheKey(context);
        const cachedResult = this.policyCache.get(cacheKey);
        if (cachedResult) {
          return cachedResult;
        }
      }

      // Get applicable policies
      const applicablePolicies = this.getApplicablePolicies(context);

      // Sort by priority (higher priority first)
      applicablePolicies.sort((a, b) => b.priority - a.priority);

      // Evaluate policies
      for (const policy of applicablePolicies) {
        const result = await this.evaluatePolicy(policy, context);
        if (result.allowed !== null) {
          // Cache result
          if (this.config.enableCaching) {
            const cacheKey = this.generateCacheKey(context);
            this.policyCache.set(cacheKey, result);
          }

          return result;
        }
      }

      // Default result if no policy matches
      const defaultResult: PolicyResult = {
        allowed: this.config.defaultEffect === 'allow',
        reason: 'No applicable policy found',
        actions: []
      };

      return defaultResult;
    } catch (error) {
      this.logger.error('Policy evaluation failed', error);
      return {
        allowed: this.config.defaultEffect === 'allow',
        reason: 'Policy evaluation error',
        actions: []
      };
    }
  }

  /**
   * Add a new policy rule
   */
  async addPolicy(policy: PolicyRule): Promise<void> {
    try {
      if (this.policies.size >= this.config.maxRules) {
        throw new Error('Maximum number of policies reached');
      }

      this.policies.set(policy.id, policy);
      this.logger.info(`Added policy: ${policy.name}`);

      // Clear cache as policies have changed
      this.clearCache();
    } catch (error) {
      this.logger.error('Failed to add policy', error);
      throw error;
    }
  }

  /**
   * Remove a policy rule
   */
  async removePolicy(policyId: string): Promise<boolean> {
    try {
      const removed = this.policies.delete(policyId);
      if (removed) {
        this.logger.info(`Removed policy: ${policyId}`);
        this.clearCache();
      }
      return removed;
    } catch (error) {
      this.logger.error('Failed to remove policy', error);
      throw error;
    }
  }

  /**
   * Update a policy rule
   */
  async updatePolicy(policyId: string, updates: Partial<PolicyRule>): Promise<boolean> {
    try {
      const policy = this.policies.get(policyId);
      if (!policy) {
        return false;
      }

      const updatedPolicy = { ...policy, ...updates };
      this.policies.set(policyId, updatedPolicy);

      this.logger.info(`Updated policy: ${policyId}`);
      this.clearCache();

      return true;
    } catch (error) {
      this.logger.error('Failed to update policy', error);
      throw error;
    }
  }

  /**
   * Get all policies
   */
  getAllPolicies(): PolicyRule[] {
    return Array.from(this.policies.values());
  }

  /**
   * Get policies by resource
   */
  getPoliciesByResource(resource: string): PolicyRule[] {
    return Array.from(this.policies.values()).filter(policy => policy.resource === resource || policy.resource === '*');
  }

  /**
   * Get policies by subject
   */
  getPoliciesBySubject(subject: string): PolicyRule[] {
    return Array.from(this.policies.values()).filter(policy => policy.subject === subject || policy.subject === '*');
  }

  /**
   * Evaluate a single policy
   */
  private async evaluatePolicy(policy: PolicyRule, context: PolicyContext): Promise<PolicyResult> {
    try {
      // Check if all conditions are met
      const conditionsMet = await this.evaluateConditions(policy.conditions, context);

      if (!conditionsMet) {
        return { allowed: null, actions: [] };
      }

      // Execute actions
      await this.executeActions(policy.actions, context);

      return {
        allowed: policy.effect === 'allow',
        ruleId: policy.id,
        reason: policy.description,
        actions: policy.actions
      };
    } catch (error) {
      this.logger.error(`Policy evaluation failed for ${policy.id}`, error);
      return { allowed: null, actions: [] };
    }
  }

  /**
   * Evaluate policy conditions
   */
  private async evaluateConditions(conditions: PolicyCondition[], context: PolicyContext): Promise<boolean> {
    for (const condition of conditions) {
      const met = await this.evaluateCondition(condition, context);
      if (!met) {
        return false;
      }
    }
    return true;
  }

  /**
   * Evaluate a single condition
   */
  private async evaluateCondition(condition: PolicyCondition, context: PolicyContext): Promise<boolean> {
    try {
      const fieldValue = this.getFieldValue(condition.field, context);

      switch (condition.type) {
        case 'equals':
          return fieldValue === condition.value;

        case 'contains':
          return typeof fieldValue === 'string' && fieldValue.includes(condition.value);

        case 'matches':
          return typeof fieldValue === 'string' && new RegExp(condition.value).test(fieldValue);

        case 'greater':
          return typeof fieldValue === 'number' && fieldValue > condition.value;

        case 'less':
          return typeof fieldValue === 'number' && fieldValue < condition.value;

        case 'in':
          return Array.isArray(condition.value) && condition.value.includes(fieldValue);

        case 'not_in':
          return Array.isArray(condition.value) && !condition.value.includes(fieldValue);

        case 'custom':
          return condition.customFunction ? condition.customFunction(context) : false;

        default:
          return false;
      }
    } catch (error) {
      this.logger.error(`Condition evaluation failed: ${condition.field}`, error);
      return false;
    }
  }

  /**
   * Execute policy actions
   */
  private async executeActions(actions: PolicyAction[], context: PolicyContext): Promise<void> {
    for (const action of actions) {
      try {
        await this.executeAction(action, context);
      } catch (error) {
        this.logger.error(`Action execution failed: ${action.type}`, error);
      }
    }
  }

  /**
   * Execute a single action
   */
  private async executeAction(action: PolicyAction, context: PolicyContext): Promise<void> {
    switch (action.type) {
      case 'log':
        this.logger.info(`Policy action: ${action.parameters.message}`, context);
        break;

      case 'notify':
        // TODO: Implement notification system
        this.logger.info(`Policy notification: ${action.parameters.message}`, context);
        break;

      case 'block':
        // Blocking is handled by the policy result
        break;

      case 'redirect':
        // TODO: Implement redirect functionality
        break;

      case 'custom':
        if (action.customFunction) {
          action.customFunction(context);
        }
        break;
    }
  }

  /**
   * Get field value from context
   */
  private getFieldValue(field: string, context: PolicyContext): any {
    const fieldParts = field.split('.');
    let value: any = context;

    for (const part of fieldParts) {
      if (value && typeof value === 'object' && part in value) {
        value = value[part];
      } else {
        return undefined;
      }
    }

    return value;
  }

  /**
   * Get applicable policies for context
   */
  private getApplicablePolicies(context: PolicyContext): PolicyRule[] {
    return Array.from(this.policies.values()).filter(policy => {
      if (!policy.enabled) {
        return false;
      }

      // Check resource match
      if (policy.resource !== '*' && policy.resource !== context.resource) {
        return false;
      }

      // Check subject match
      if (policy.subject !== '*' && policy.subject !== context.userId) {
        return false;
      }

      return true;
    });
  }

  /**
   * Generate cache key for context
   */
  private generateCacheKey(context: PolicyContext): string {
    return `${context.userId}_${context.agentId}_${context.resource}_${context.action}`;
  }

  /**
   * Clear policy cache
   */
  clearCache(): void {
    this.policyCache.clear();
    this.logger.info('Policy cache cleared');
  }

  /**
   * Load default policies
   */
  private async loadDefaultPolicies(): Promise<void> {
    // Add some default security policies
    const defaultPolicies: PolicyRule[] = [
      {
        id: 'default_deny',
        name: 'Default Deny',
        description: 'Deny all actions by default',
        enabled: true,
        priority: 1,
        conditions: [],
        actions: [],
        effect: 'deny',
        resource: '*',
        subject: '*'
      },
      {
        id: 'admin_full_access',
        name: 'Admin Full Access',
        description: 'Allow full access for admin users',
        enabled: true,
        priority: 100,
        conditions: [
          {
            type: 'equals',
            field: 'userId',
            value: 'admin'
          }
        ],
        actions: [],
        effect: 'allow',
        resource: '*',
        subject: 'admin'
      }
    ];

    for (const policy of defaultPolicies) {
      this.policies.set(policy.id, policy);
    }

    this.logger.info(`Loaded ${defaultPolicies.length} default policies`);
  }

  /**
   * Get policy statistics
   */
  getPolicyStats(): any {
    const policies = Array.from(this.policies.values());

    return {
      totalPolicies: policies.length,
      enabledPolicies: policies.filter(p => p.enabled).length,
      disabledPolicies: policies.filter(p => !p.enabled).length,
      allowPolicies: policies.filter(p => p.effect === 'allow').length,
      denyPolicies: policies.filter(p => p.effect === 'deny').length,
      warnPolicies: policies.filter(p => p.effect === 'warn').length,
      cacheSize: this.policyCache.size,
      maxRules: this.config.maxRules
    };
  }

  /**
   * Get configuration
   */
  getConfig(): PolicyConfig {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<PolicyConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.logger.info('Policy configuration updated');
  }
}
