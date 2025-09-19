/**
 * Validator.ts
 *
 * Comprehensive input validation system with schema support,
 * sanitization, and custom validation rules.
 */

import { Logger } from './Logger';

export interface ValidationRule {
  type: 'required' | 'string' | 'number' | 'boolean' | 'array' | 'object' | 'email' | 'url' | 'uuid' | 'custom';
  value?: any;
  min?: number;
  max?: number;
  pattern?: RegExp;
  customValidator?: (value: any) => boolean | string;
  message?: string;
}

export interface ValidationSchema {
  [key: string]: ValidationRule | ValidationSchema;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  data?: any;
}

export interface ValidationError {
  field: string;
  message: string;
  value: any;
  rule: string;
}

export interface TaskValidationSchema {
  id: ValidationRule;
  type: ValidationRule;
  payload: ValidationSchema;
  priority?: ValidationRule;
  timeout?: ValidationRule;
  retries?: ValidationRule;
}

export class InputValidator {
  private readonly logger: Logger;
  private validationCache: Map<string, ValidationResult> = new Map();
  private customValidators: Map<string, (value: any) => boolean | string> = new Map();

  constructor() {
    this.logger = new Logger('InputValidator');
    this.initializeDefaultValidators();
  }

  /**
   * Validate data against a schema
   */
  async validate(data: any, schema: ValidationSchema): Promise<ValidationResult> {
    try {
      const cacheKey = this.generateCacheKey(data, schema);

      // Check cache first
      if (this.validationCache.has(cacheKey)) {
        return this.validationCache.get(cacheKey)!;
      }

      const errors: ValidationError[] = [];
      const validatedData = this.validateObject(data, schema, '', errors);

      const result: ValidationResult = {
        valid: errors.length === 0,
        errors,
        data: validatedData
      };

      // Cache result if valid
      if (result.valid) {
        this.validationCache.set(cacheKey, result);
      }

      return result;
    } catch (error) {
      this.logger.error('Validation error', error);
      return {
        valid: false,
        errors: [
          {
            field: 'validation',
            message: 'Validation process failed',
            value: data,
            rule: 'system'
          }
        ]
      };
    }
  }

  /**
   * Validate task input
   */
  async validateTask(task: any): Promise<ValidationResult> {
    const schema: TaskValidationSchema = {
      id: { type: 'required' },
      type: { type: 'required' },
      payload: { type: 'object' },
      priority: { type: 'string', value: ['low', 'normal', 'high', 'critical'] },
      timeout: { type: 'number', min: 1000, max: 300000 },
      retries: { type: 'number', min: 0, max: 10 }
    };

    return this.validate(task, schema);
  }

  /**
   * Validate object recursively
   */
  private validateObject(data: any, schema: ValidationSchema, path: string, errors: ValidationError[]): any {
    const result: any = {};

    for (const [key, rule] of Object.entries(schema)) {
      const fieldPath = path ? `${path}.${key}` : key;
      const value = data[key];

      if (this.isValidationRule(rule)) {
        const validationResult = this.validateField(value, rule, fieldPath);
        if (!validationResult.valid) {
          errors.push(...validationResult.errors);
        } else {
          result[key] = validationResult.value;
        }
      } else {
        // Nested object validation
        if (value && typeof value === 'object') {
          result[key] = this.validateObject(value, rule as ValidationSchema, fieldPath, errors);
        } else {
          result[key] = value;
        }
      }
    }

    return result;
  }

  /**
   * Validate a single field
   */
  private validateField(value: any, rule: ValidationRule, fieldPath: string): ValidationResult {
    const errors: ValidationError[] = [];

    // Required validation
    if (rule.type === 'required' && (value === undefined || value === null || value === '')) {
      errors.push({
        field: fieldPath,
        message: rule.message || `${fieldPath} is required`,
        value,
        rule: 'required'
      });
      return { valid: false, errors };
    }

    // Skip other validations if value is empty and not required
    if (value === undefined || value === null || value === '') {
      return { valid: true, errors: [], data: value };
    }

    // Type validations
    switch (rule.type) {
      case 'string':
        if (typeof value !== 'string') {
          errors.push({
            field: fieldPath,
            message: rule.message || `${fieldPath} must be a string`,
            value,
            rule: 'string'
          });
        } else {
          if (rule.min !== undefined && value.length < rule.min) {
            errors.push({
              field: fieldPath,
              message: rule.message || `${fieldPath} must be at least ${rule.min} characters`,
              value,
              rule: 'min'
            });
          }
          if (rule.max !== undefined && value.length > rule.max) {
            errors.push({
              field: fieldPath,
              message: rule.message || `${fieldPath} must be at most ${rule.max} characters`,
              value,
              rule: 'max'
            });
          }
          if (rule.pattern && !rule.pattern.test(value)) {
            errors.push({
              field: fieldPath,
              message: rule.message || `${fieldPath} does not match required pattern`,
              value,
              rule: 'pattern'
            });
          }
        }
        break;

      case 'number':
        if (typeof value !== 'number' || isNaN(value)) {
          errors.push({
            field: fieldPath,
            message: rule.message || `${fieldPath} must be a number`,
            value,
            rule: 'number'
          });
        } else {
          if (rule.min !== undefined && value < rule.min) {
            errors.push({
              field: fieldPath,
              message: rule.message || `${fieldPath} must be at least ${rule.min}`,
              value,
              rule: 'min'
            });
          }
          if (rule.max !== undefined && value > rule.max) {
            errors.push({
              field: fieldPath,
              message: rule.message || `${fieldPath} must be at most ${rule.max}`,
              value,
              rule: 'max'
            });
          }
        }
        break;

      case 'boolean':
        if (typeof value !== 'boolean') {
          errors.push({
            field: fieldPath,
            message: rule.message || `${fieldPath} must be a boolean`,
            value,
            rule: 'boolean'
          });
        }
        break;

      case 'array':
        if (!Array.isArray(value)) {
          errors.push({
            field: fieldPath,
            message: rule.message || `${fieldPath} must be an array`,
            value,
            rule: 'array'
          });
        } else {
          if (rule.min !== undefined && value.length < rule.min) {
            errors.push({
              field: fieldPath,
              message: rule.message || `${fieldPath} must have at least ${rule.min} items`,
              value,
              rule: 'min'
            });
          }
          if (rule.max !== undefined && value.length > rule.max) {
            errors.push({
              field: fieldPath,
              message: rule.message || `${fieldPath} must have at most ${rule.max} items`,
              value,
              rule: 'max'
            });
          }
        }
        break;

      case 'object':
        if (typeof value !== 'object' || Array.isArray(value)) {
          errors.push({
            field: fieldPath,
            message: rule.message || `${fieldPath} must be an object`,
            value,
            rule: 'object'
          });
        }
        break;

      case 'email':
        if (typeof value !== 'string' || !this.isValidEmail(value)) {
          errors.push({
            field: fieldPath,
            message: rule.message || `${fieldPath} must be a valid email address`,
            value,
            rule: 'email'
          });
        }
        break;

      case 'url':
        if (typeof value !== 'string' || !this.isValidUrl(value)) {
          errors.push({
            field: fieldPath,
            message: rule.message || `${fieldPath} must be a valid URL`,
            value,
            rule: 'url'
          });
        }
        break;

      case 'uuid':
        if (typeof value !== 'string' || !this.isValidUuid(value)) {
          errors.push({
            field: fieldPath,
            message: rule.message || `${fieldPath} must be a valid UUID`,
            value,
            rule: 'uuid'
          });
        }
        break;

      case 'custom':
        if (rule.customValidator) {
          const customResult = rule.customValidator(value);
          if (customResult !== true) {
            errors.push({
              field: fieldPath,
              message:
                rule.message ||
                (typeof customResult === 'string' ? customResult : `${fieldPath} failed custom validation`),
              value,
              rule: 'custom'
            });
          }
        }
        break;
    }

    // Value validation (enum-like)
    if (rule.value && Array.isArray(rule.value) && !rule.value.includes(value)) {
      errors.push({
        field: fieldPath,
        message: rule.message || `${fieldPath} must be one of: ${rule.value.join(', ')}`,
        value,
        rule: 'enum'
      });
    }

    return {
      valid: errors.length === 0,
      errors,
      data: value
    };
  }

  /**
   * Check if a rule is a ValidationRule
   */
  private isValidationRule(rule: any): rule is ValidationRule {
    return rule && typeof rule === 'object' && 'type' in rule;
  }

  /**
   * Validate email format
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate URL format
   */
  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Validate UUID format
   */
  private isValidUuid(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  /**
   * Add custom validator
   */
  addCustomValidator(name: string, validator: (value: any) => boolean | string): void {
    this.customValidators.set(name, validator);
    this.logger.info(`Added custom validator: ${name}`);
  }

  /**
   * Get task validation schema for specific task type
   */
  getTaskValidationSchema(taskType: string): ValidationSchema {
    // Base schema for all tasks
    const baseSchema: ValidationSchema = {
      id: { type: 'required' },
      type: { type: 'required' },
      payload: { type: 'object' }
    };

    // Add type-specific validations
    switch (taskType) {
      case 'send_message':
        return {
          ...baseSchema,
          payload: {
            channel: { type: 'required' },
            message: { type: 'required' },
            sender: { type: 'required' },
            metadata: { type: 'object' }
          }
        };

      case 'receive_message':
        return {
          ...baseSchema,
          payload: {
            channel: { type: 'required' }
          }
        };

      default:
        return baseSchema;
    }
  }

  /**
   * Sanitize input data
   */
  sanitizeInput(data: any): any {
    if (typeof data === 'string') {
      return data.trim().replace(/[<>]/g, '');
    }

    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeInput(item));
    }

    if (typeof data === 'object' && data !== null) {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(data)) {
        sanitized[key] = this.sanitizeInput(value);
      }
      return sanitized;
    }

    return data;
  }

  /**
   * Generate cache key for validation
   */
  private generateCacheKey(data: any, schema: ValidationSchema): string {
    return `validation_${JSON.stringify(data)}_${JSON.stringify(schema)}`;
  }

  /**
   * Clear validation cache
   */
  clearCache(): void {
    this.validationCache.clear();
    this.logger.info('Validation cache cleared');
  }

  /**
   * Initialize default validators
   */
  private initializeDefaultValidators(): void {
    // Add some useful custom validators
    this.addCustomValidator('alphanumeric', (value: string) => {
      return /^[a-zA-Z0-9]+$/.test(value) || 'Must contain only alphanumeric characters';
    });

    this.addCustomValidator('positive', (value: number) => {
      return value > 0 || 'Must be a positive number';
    });

    this.addCustomValidator('nonEmpty', (value: any) => {
      return (value !== null && value !== undefined && value !== '') || 'Must not be empty';
    });
  }
}
