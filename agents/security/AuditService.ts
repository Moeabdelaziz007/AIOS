/**
 * AuditService.ts
 *
 * Comprehensive audit logging service for security events,
 * compliance tracking, and forensic analysis.
 */

import { Logger } from '../utils/Logger';

export interface AuditEvent {
  id: string;
  timestamp: Date;
  userId?: string;
  agentId?: string;
  event: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'authentication' | 'authorization' | 'data_access' | 'system' | 'security' | 'compliance';
  description: string;
  metadata: any;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  result: 'success' | 'failure' | 'warning';
}

export interface AuditConfig {
  enableAudit: boolean;
  logLevel: 'low' | 'medium' | 'high' | 'critical';
  retentionPeriod: number;
  enableEncryption: boolean;
  enableCompression: boolean;
  maxLogSize: number;
  enableRealTime: boolean;
  enableCompliance: boolean;
}

export interface AuditQuery {
  startDate?: Date;
  endDate?: Date;
  userId?: string;
  agentId?: string;
  event?: string;
  severity?: string;
  category?: string;
  result?: string;
  limit?: number;
  offset?: number;
}

export interface AuditStats {
  totalEvents: number;
  eventsByCategory: Record<string, number>;
  eventsBySeverity: Record<string, number>;
  eventsByResult: Record<string, number>;
  eventsByUser: Record<string, number>;
  eventsByAgent: Record<string, number>;
  lastEvent?: Date;
  firstEvent?: Date;
}

export class AuditService {
  private readonly logger: Logger;
  private config: AuditConfig;
  private auditEvents: Map<string, AuditEvent> = new Map();
  private eventIndex: Map<string, Set<string>> = new Map();
  private isInitialized: boolean = false;

  constructor(config: Partial<AuditConfig> = {}) {
    this.config = {
      enableAudit: true,
      logLevel: 'low',
      retentionPeriod: 2592000000, // 30 days
      enableEncryption: false,
      enableCompression: false,
      maxLogSize: 1000000, // 1MB
      enableRealTime: true,
      enableCompliance: true,
      ...config
    };

    this.logger = new Logger('AuditService');
  }

  /**
   * Initialize audit service
   */
  async initialize(): Promise<void> {
    try {
      this.logger.info('Initializing AuditService');

      if (!this.config.enableAudit) {
        this.logger.info('Audit logging is disabled');
        return;
      }

      // Initialize event indexes
      this.initializeIndexes();

      this.isInitialized = true;
      this.logger.info('AuditService initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize AuditService', error);
      throw error;
    }
  }

  /**
   * Log an audit event
   */
  async logEvent(event: Partial<AuditEvent>): Promise<string> {
    try {
      if (!this.config.enableAudit) {
        return '';
      }

      const auditEvent: AuditEvent = {
        id: this.generateEventId(),
        timestamp: new Date(),
        severity: 'medium',
        category: 'system',
        description: '',
        metadata: {},
        result: 'success',
        ...event
      };

      // Check if event should be logged based on severity
      if (!this.shouldLogEvent(auditEvent.severity)) {
        return auditEvent.id;
      }

      // Store the event
      this.auditEvents.set(auditEvent.id, auditEvent);

      // Update indexes
      this.updateIndexes(auditEvent);

      // Log to console if real-time logging is enabled
      if (this.config.enableRealTime) {
        this.logAuditEvent(auditEvent);
      }

      // Cleanup old events
      this.cleanupOldEvents();

      return auditEvent.id;
    } catch (error) {
      this.logger.error('Failed to log audit event', error);
      throw error;
    }
  }

  /**
   * Log authentication event
   */
  async logAuthEvent(userId: string, event: string, result: 'success' | 'failure', metadata?: any): Promise<string> {
    return this.logEvent({
      userId,
      event,
      category: 'authentication',
      severity: result === 'failure' ? 'high' : 'low',
      description: `Authentication ${result}: ${event}`,
      metadata,
      result
    });
  }

  /**
   * Log authorization event
   */
  async logAuthzEvent(
    userId: string,
    agentId: string,
    resource: string,
    action: string,
    result: 'success' | 'failure',
    metadata?: any
  ): Promise<string> {
    return this.logEvent({
      userId,
      agentId,
      event: 'authorization_check',
      category: 'authorization',
      severity: result === 'failure' ? 'medium' : 'low',
      description: `Authorization ${result}: ${action} on ${resource}`,
      metadata: { resource, action, ...metadata },
      result
    });
  }

  /**
   * Log data access event
   */
  async logDataAccessEvent(
    userId: string,
    agentId: string,
    dataType: string,
    action: string,
    result: 'success' | 'failure',
    metadata?: any
  ): Promise<string> {
    return this.logEvent({
      userId,
      agentId,
      event: 'data_access',
      category: 'data_access',
      severity: result === 'failure' ? 'medium' : 'low',
      description: `Data access ${result}: ${action} on ${dataType}`,
      metadata: { dataType, action, ...metadata },
      result
    });
  }

  /**
   * Log security event
   */
  async logSecurityEvent(
    event: string,
    severity: 'low' | 'medium' | 'high' | 'critical',
    description: string,
    metadata?: any
  ): Promise<string> {
    return this.logEvent({
      event,
      category: 'security',
      severity,
      description,
      metadata,
      result: severity === 'critical' ? 'failure' : 'success'
    });
  }

  /**
   * Query audit events
   */
  async queryEvents(query: AuditQuery): Promise<AuditEvent[]> {
    try {
      let events = Array.from(this.auditEvents.values());

      // Apply filters
      if (query.startDate) {
        events = events.filter(event => event.timestamp >= query.startDate!);
      }

      if (query.endDate) {
        events = events.filter(event => event.timestamp <= query.endDate!);
      }

      if (query.userId) {
        events = events.filter(event => event.userId === query.userId);
      }

      if (query.agentId) {
        events = events.filter(event => event.agentId === query.agentId);
      }

      if (query.event) {
        events = events.filter(event => event.event === query.event);
      }

      if (query.severity) {
        events = events.filter(event => event.severity === query.severity);
      }

      if (query.category) {
        events = events.filter(event => event.category === query.category);
      }

      if (query.result) {
        events = events.filter(event => event.result === query.result);
      }

      // Sort by timestamp (newest first)
      events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

      // Apply pagination
      const offset = query.offset || 0;
      const limit = query.limit || 100;
      events = events.slice(offset, offset + limit);

      return events;
    } catch (error) {
      this.logger.error('Failed to query audit events', error);
      throw error;
    }
  }

  /**
   * Get audit statistics
   */
  getAuditStats(): AuditStats {
    const events = Array.from(this.auditEvents.values());

    const stats: AuditStats = {
      totalEvents: events.length,
      eventsByCategory: {},
      eventsBySeverity: {},
      eventsByResult: {},
      eventsByUser: {},
      eventsByAgent: {}
    };

    events.forEach(event => {
      // Category stats
      stats.eventsByCategory[event.category] = (stats.eventsByCategory[event.category] || 0) + 1;

      // Severity stats
      stats.eventsBySeverity[event.severity] = (stats.eventsBySeverity[event.severity] || 0) + 1;

      // Result stats
      stats.eventsByResult[event.result] = (stats.eventsByResult[event.result] || 0) + 1;

      // User stats
      if (event.userId) {
        stats.eventsByUser[event.userId] = (stats.eventsByUser[event.userId] || 0) + 1;
      }

      // Agent stats
      if (event.agentId) {
        stats.eventsByAgent[event.agentId] = (stats.eventsByAgent[event.agentId] || 0) + 1;
      }

      // Time range
      if (!stats.firstEvent || event.timestamp < stats.firstEvent) {
        stats.firstEvent = event.timestamp;
      }
      if (!stats.lastEvent || event.timestamp > stats.lastEvent) {
        stats.lastEvent = event.timestamp;
      }
    });

    return stats;
  }

  /**
   * Export audit events
   */
  exportEvents(format: 'json' | 'csv' = 'json', query?: AuditQuery): string {
    const events = query ? this.queryEvents(query) : Array.from(this.auditEvents.values());

    if (format === 'json') {
      return JSON.stringify(events, null, 2);
    } else {
      // CSV format
      const csvLines = ['id,timestamp,userId,agentId,event,severity,category,description,result,metadata'];

      events.forEach(event => {
        csvLines.push(
          `${event.id},${event.timestamp.toISOString()},${event.userId || ''},${event.agentId || ''},${event.event},${event.severity},${event.category},"${event.description}","${event.result}","${JSON.stringify(event.metadata)}"`
        );
      });

      return csvLines.join('\n');
    }
  }

  /**
   * Clear audit events
   */
  clearEvents(): void {
    this.auditEvents.clear();
    this.eventIndex.clear();
    this.initializeIndexes();
    this.logger.info('All audit events cleared');
  }

  /**
   * Check if event should be logged based on severity
   */
  private shouldLogEvent(severity: string): boolean {
    const severityLevels = { low: 1, medium: 2, high: 3, critical: 4 };
    const configLevel = severityLevels[this.config.logLevel as keyof typeof severityLevels];
    const eventLevel = severityLevels[severity as keyof typeof severityLevels];

    return eventLevel >= configLevel;
  }

  /**
   * Log audit event to console
   */
  private logAuditEvent(event: AuditEvent): void {
    const logMessage = `AUDIT: ${event.event} - ${event.description}`;
    const metadata = {
      id: event.id,
      userId: event.userId,
      agentId: event.agentId,
      severity: event.severity,
      category: event.category,
      result: event.result,
      metadata: event.metadata
    };

    switch (event.severity) {
      case 'low':
        this.logger.info(logMessage, metadata);
        break;
      case 'medium':
        this.logger.warn(logMessage, metadata);
        break;
      case 'high':
      case 'critical':
        this.logger.error(logMessage, metadata);
        break;
    }
  }

  /**
   * Initialize event indexes
   */
  private initializeIndexes(): void {
    this.eventIndex.set('byUser', new Set());
    this.eventIndex.set('byAgent', new Set());
    this.eventIndex.set('byEvent', new Set());
    this.eventIndex.set('byCategory', new Set());
    this.eventIndex.set('bySeverity', new Set());
  }

  /**
   * Update event indexes
   */
  private updateIndexes(event: AuditEvent): void {
    if (event.userId) {
      this.eventIndex.get('byUser')!.add(event.userId);
    }
    if (event.agentId) {
      this.eventIndex.get('byAgent')!.add(event.agentId);
    }
    this.eventIndex.get('byEvent')!.add(event.event);
    this.eventIndex.get('byCategory')!.add(event.category);
    this.eventIndex.get('bySeverity')!.add(event.severity);
  }

  /**
   * Cleanup old events based on retention period
   */
  private cleanupOldEvents(): void {
    const cutoffTime = new Date(Date.now() - this.config.retentionPeriod);
    let cleanedCount = 0;

    for (const [id, event] of this.auditEvents.entries()) {
      if (event.timestamp < cutoffTime) {
        this.auditEvents.delete(id);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      this.logger.info(`Cleaned up ${cleanedCount} old audit events`);
    }
  }

  /**
   * Generate unique event ID
   */
  private generateEventId(): string {
    return `AUDIT_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get configuration
   */
  getConfig(): AuditConfig {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<AuditConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.logger.info('Audit configuration updated');
  }
}
