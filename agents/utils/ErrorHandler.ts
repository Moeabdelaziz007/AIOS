/**
 * ErrorHandler.ts
 *
 * Comprehensive error handling system with categorization, recovery strategies,
 * and detailed error reporting. Based on patterns from SelfOS and ZQBAC projects.
 */

import { Logger } from './Logger';

export enum ErrorCategory {
  INITIALIZATION = 'initialization',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  VALIDATION = 'validation',
  NETWORK = 'network',
  DATABASE = 'database',
  FILE_SYSTEM = 'file_system',
  TASK_PROCESSING = 'task_processing',
  COMMUNICATION = 'communication',
  RESOURCE = 'resource',
  SECURITY = 'security',
  CLEANUP = 'cleanup',
  UNKNOWN = 'unknown'
}

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export interface ErrorContext {
  agentId?: string;
  taskId?: string;
  userId?: string;
  operationId?: string;
  timestamp?: Date;
  [key: string]: any;
}

export interface ErrorReport {
  id: string;
  category: ErrorCategory;
  severity: ErrorSeverity;
  message: string;
  stack?: string;
  context: ErrorContext;
  timestamp: Date;
  resolved: boolean;
  resolution?: string;
}

export interface RecoveryStrategy {
  name: string;
  description: string;
  canRecover: (error: Error, context: ErrorContext) => boolean;
  recover: (error: Error, context: ErrorContext) => Promise<any>;
}

export class ErrorHandler {
  private readonly logger: Logger;
  private errorReports: Map<string, ErrorReport> = new Map();
  private recoveryStrategies: Map<ErrorCategory, RecoveryStrategy[]> = new Map();
  private errorCounts: Map<ErrorCategory, number> = new Map();

  constructor() {
    this.logger = new Logger('ErrorHandler');
    this.initializeRecoveryStrategies();
  }

  /**
   * Handle an error with comprehensive processing
   */
  async handleError(
    error: Error,
    category: ErrorCategory = ErrorCategory.UNKNOWN,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    context: ErrorContext = {}
  ): Promise<{ success: boolean; error: ErrorReport; recovered?: any }> {
    try {
      const errorReport = this.createErrorReport(error, category, severity, context);

      // Store error report
      this.errorReports.set(errorReport.id, errorReport);

      // Update error counts
      this.updateErrorCounts(category);

      // Log error
      this.logError(errorReport);

      // Attempt recovery
      const recoveryResult = await this.attemptRecovery(error, category, context);

      if (recoveryResult.success) {
        errorReport.resolved = true;
        errorReport.resolution = 'Recovered automatically';
        this.logger.info(`Error ${errorReport.id} recovered successfully`);

        return {
          success: true,
          error: errorReport,
          recovered: recoveryResult.result
        };
      }

      return {
        success: false,
        error: errorReport
      };
    } catch (handlerError) {
      this.logger.error('Error handler failed', handlerError);
      throw handlerError;
    }
  }

  /**
   * Create error report
   */
  private createErrorReport(
    error: Error,
    category: ErrorCategory,
    severity: ErrorSeverity,
    context: ErrorContext
  ): ErrorReport {
    return {
      id: this.generateErrorId(),
      category,
      severity,
      message: error.message,
      stack: error.stack,
      context: {
        ...context,
        timestamp: new Date()
      },
      timestamp: new Date(),
      resolved: false
    };
  }

  /**
   * Attempt error recovery
   */
  private async attemptRecovery(
    error: Error,
    category: ErrorCategory,
    context: ErrorContext
  ): Promise<{ success: boolean; result?: any }> {
    const strategies = this.recoveryStrategies.get(category) || [];

    for (const strategy of strategies) {
      try {
        if (strategy.canRecover(error, context)) {
          this.logger.info(`Attempting recovery with strategy: ${strategy.name}`);
          const result = await strategy.recover(error, context);

          return {
            success: true,
            result
          };
        }
      } catch (recoveryError) {
        this.logger.warn(`Recovery strategy ${strategy.name} failed`, recoveryError);
      }
    }

    return { success: false };
  }

  /**
   * Log error with appropriate level
   */
  private logError(errorReport: ErrorReport): void {
    const logMessage = `Error ${errorReport.id}: ${errorReport.message}`;
    const metadata = {
      category: errorReport.category,
      severity: errorReport.severity,
      context: errorReport.context
    };

    switch (errorReport.severity) {
      case ErrorSeverity.LOW:
        this.logger.warn(logMessage, metadata);
        break;
      case ErrorSeverity.MEDIUM:
        this.logger.error(logMessage, metadata);
        break;
      case ErrorSeverity.HIGH:
        this.logger.error(logMessage, metadata);
        break;
      case ErrorSeverity.CRITICAL:
        this.logger.fatal(logMessage, metadata);
        break;
    }
  }

  /**
   * Update error counts
   */
  private updateErrorCounts(category: ErrorCategory): void {
    const currentCount = this.errorCounts.get(category) || 0;
    this.errorCounts.set(category, currentCount + 1);
  }

  /**
   * Generate unique error ID
   */
  private generateErrorId(): string {
    return `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Initialize recovery strategies
   */
  private initializeRecoveryStrategies(): void {
    // Network error recovery
    this.addRecoveryStrategy(ErrorCategory.NETWORK, {
      name: 'retry_with_backoff',
      description: 'Retry network operation with exponential backoff',
      canRecover: (error, context) => {
        return (
          error.message.includes('timeout') || error.message.includes('connection') || error.message.includes('network')
        );
      },
      recover: async (error, context) => {
        // TODO: Implement retry logic
        return { retry: true, delay: 1000 };
      }
    });

    // Validation error recovery
    this.addRecoveryStrategy(ErrorCategory.VALIDATION, {
      name: 'sanitize_input',
      description: 'Sanitize and retry with cleaned input',
      canRecover: (error, context) => {
        return error.message.includes('validation') || error.message.includes('invalid');
      },
      recover: async (error, context) => {
        // TODO: Implement input sanitization
        return { sanitized: true };
      }
    });

    // Resource error recovery
    this.addRecoveryStrategy(ErrorCategory.RESOURCE, {
      name: 'cleanup_and_retry',
      description: 'Clean up resources and retry operation',
      canRecovery: (error, context) => {
        return error.message.includes('resource') || error.message.includes('memory') || error.message.includes('disk');
      },
      recover: async (error, context) => {
        // TODO: Implement resource cleanup
        return { cleaned: true };
      }
    });
  }

  /**
   * Add recovery strategy
   */
  addRecoveryStrategy(category: ErrorCategory, strategy: RecoveryStrategy): void {
    if (!this.recoveryStrategies.has(category)) {
      this.recoveryStrategies.set(category, []);
    }
    this.recoveryStrategies.get(category)!.push(strategy);
  }

  /**
   * Get error statistics
   */
  getErrorStats(): { total: number; byCategory: Record<string, number>; bySeverity: Record<string, number> } {
    const total = Array.from(this.errorCounts.values()).reduce((sum, count) => sum + count, 0);
    const byCategory = Object.fromEntries(this.errorCounts);

    const bySeverity: Record<string, number> = {};
    for (const report of this.errorReports.values()) {
      bySeverity[report.severity] = (bySeverity[report.severity] || 0) + 1;
    }

    return {
      total,
      byCategory,
      bySeverity
    };
  }

  /**
   * Get error report by ID
   */
  getErrorReport(errorId: string): ErrorReport | null {
    return this.errorReports.get(errorId) || null;
  }

  /**
   * Get all error reports
   */
  getAllErrorReports(): ErrorReport[] {
    return Array.from(this.errorReports.values());
  }

  /**
   * Get error reports by category
   */
  getErrorReportsByCategory(category: ErrorCategory): ErrorReport[] {
    return Array.from(this.errorReports.values()).filter(report => report.category === category);
  }

  /**
   * Get error reports by severity
   */
  getErrorReportsBySeverity(severity: ErrorSeverity): ErrorReport[] {
    return Array.from(this.errorReports.values()).filter(report => report.severity === severity);
  }

  /**
   * Mark error as resolved
   */
  markErrorResolved(errorId: string, resolution: string): boolean {
    const report = this.errorReports.get(errorId);
    if (report) {
      report.resolved = true;
      report.resolution = resolution;
      return true;
    }
    return false;
  }

  /**
   * Clear resolved errors
   */
  clearResolvedErrors(): number {
    let clearedCount = 0;

    for (const [id, report] of this.errorReports.entries()) {
      if (report.resolved) {
        this.errorReports.delete(id);
        clearedCount++;
      }
    }

    return clearedCount;
  }

  /**
   * Get recent errors
   */
  getRecentErrors(limit: number = 10): ErrorReport[] {
    return Array.from(this.errorReports.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }
}
