/**
 * User Consent Management System for AIOS
 * Comprehensive consent tracking, management, and compliance
 */

class ConsentManagementSystem {
  constructor() {
    this.consentTypes = {
      DATA_COLLECTION: 'data_collection',
      DATA_PROCESSING: 'data_processing',
      DATA_SHARING: 'data_sharing',
      MARKETING: 'marketing',
      ANALYTICS: 'analytics',
      COOKIES: 'cookies',
      LOCATION: 'location',
      BIOMETRIC: 'biometric',
      THIRD_PARTY: 'third_party',
      AI_PROCESSING: 'ai_processing',
    };

    this.consentStatus = {
      GRANTED: 'granted',
      DENIED: 'denied',
      WITHDRAWN: 'withdrawn',
      EXPIRED: 'expired',
      PENDING: 'pending',
    };

    this.consentRecords = new Map();
    this.consentPolicies = new Map();
    this.consentTemplates = new Map();

    this.consentStats = {
      totalConsents: 0,
      grantedConsents: 0,
      deniedConsents: 0,
      withdrawnConsents: 0,
      expiredConsents: 0,
      consentRate: 0,
      averageConsentTime: 0,
      consentTimes: [],
    };

    this.initializeConsentSystem();
  }

  /**
   * Initialize consent management system
   */
  async initializeConsentSystem() {
    try {
      console.log('📋 Initializing Consent Management System...');

      // Load consent policies
      await this.loadConsentPolicies();

      // Load consent templates
      await this.loadConsentTemplates();

      // Load existing consent records
      await this.loadConsentRecords();

      console.log('✅ Consent Management System initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize consent system:', error);
      throw error;
    }
  }

  /**
   * Request user consent
   */
  async requestConsent(userId, consentType, options = {}) {
    const startTime = performance.now();

    try {
      const {
        purpose = 'General data processing',
        description = 'We need your consent to process your data',
        required = false,
        expiresIn = null,
        dataCategories = [],
        thirdParties = [],
        retentionPeriod = null,
      } = options;

      // Check if consent already exists
      const existingConsent = this.getConsentRecord(userId, consentType);

      if (
        existingConsent &&
        existingConsent.status === this.consentStatus.GRANTED
      ) {
        if (!this.isConsentExpired(existingConsent)) {
          return {
            success: true,
            consentId: existingConsent.id,
            status: existingConsent.status,
            message: 'Consent already granted',
          };
        }
      }

      // Create consent request
      const consentRequest = {
        id: this.generateConsentId(),
        userId,
        consentType,
        purpose,
        description,
        required,
        expiresIn,
        dataCategories,
        thirdParties,
        retentionPeriod,
        status: this.consentStatus.PENDING,
        requestedAt: Date.now(),
        ipAddress: this.getClientIP(),
        userAgent: this.getUserAgent(),
        consentMethod: 'web_form',
      };

      // Store consent request
      this.storeConsentRequest(consentRequest);

      // Update stats
      const consentTime = performance.now() - startTime;
      this.updateConsentStats('requested', consentTime);

      // Log consent request
      this.logConsentEvent(
        'consent_requested',
        userId,
        consentType,
        consentRequest
      );

      return {
        success: true,
        consentId: consentRequest.id,
        consentRequest,
        message: 'Consent request created successfully',
      };
    } catch (error) {
      const consentTime = performance.now() - startTime;
      this.updateConsentStats('failed', consentTime);

      console.error('Failed to request consent:', error);
      throw error;
    }
  }

  /**
   * Grant consent
   */
  async grantConsent(userId, consentId, consentData = {}) {
    try {
      const consentRecord = this.getConsentRecordById(consentId);

      if (!consentRecord) {
        throw new Error('Consent record not found');
      }

      if (consentRecord.userId !== userId) {
        throw new Error('Unauthorized consent access');
      }

      // Update consent record
      const updatedRecord = {
        ...consentRecord,
        status: this.consentStatus.GRANTED,
        grantedAt: Date.now(),
        grantedBy: userId,
        consentData,
        ipAddress: this.getClientIP(),
        userAgent: this.getUserAgent(),
        version: this.getConsentVersion(consentRecord.consentType),
      };

      // Store updated record
      this.storeConsentRecord(updatedRecord);

      // Update stats
      this.updateConsentStats('granted');

      // Log consent grant
      this.logConsentEvent(
        'consent_granted',
        userId,
        consentRecord.consentType,
        updatedRecord
      );

      // Trigger consent granted actions
      await this.triggerConsentActions(
        consentRecord.consentType,
        'granted',
        userId
      );

      return {
        success: true,
        consentRecord: updatedRecord,
        message: 'Consent granted successfully',
      };
    } catch (error) {
      console.error('Failed to grant consent:', error);
      throw error;
    }
  }

  /**
   * Withdraw consent
   */
  async withdrawConsent(userId, consentId, reason = null) {
    try {
      const consentRecord = this.getConsentRecordById(consentId);

      if (!consentRecord) {
        throw new Error('Consent record not found');
      }

      if (consentRecord.userId !== userId) {
        throw new Error('Unauthorized consent access');
      }

      // Update consent record
      const updatedRecord = {
        ...consentRecord,
        status: this.consentStatus.WITHDRAWN,
        withdrawnAt: Date.now(),
        withdrawnBy: userId,
        withdrawalReason: reason,
        ipAddress: this.getClientIP(),
        userAgent: this.getUserAgent(),
      };

      // Store updated record
      this.storeConsentRecord(updatedRecord);

      // Update stats
      this.updateConsentStats('withdrawn');

      // Log consent withdrawal
      this.logConsentEvent(
        'consent_withdrawn',
        userId,
        consentRecord.consentType,
        updatedRecord
      );

      // Trigger consent withdrawal actions
      await this.triggerConsentActions(
        consentRecord.consentType,
        'withdrawn',
        userId
      );

      return {
        success: true,
        consentRecord: updatedRecord,
        message: 'Consent withdrawn successfully',
      };
    } catch (error) {
      console.error('Failed to withdraw consent:', error);
      throw error;
    }
  }

  /**
   * Check consent status
   */
  checkConsentStatus(userId, consentType) {
    const consentRecord = this.getConsentRecord(userId, consentType);

    if (!consentRecord) {
      return {
        hasConsent: false,
        status: 'not_requested',
        message: 'No consent record found',
      };
    }

    if (this.isConsentExpired(consentRecord)) {
      return {
        hasConsent: false,
        status: 'expired',
        message: 'Consent has expired',
        expiredAt: consentRecord.expiresAt,
      };
    }

    return {
      hasConsent: consentRecord.status === this.consentStatus.GRANTED,
      status: consentRecord.status,
      grantedAt: consentRecord.grantedAt,
      expiresAt: consentRecord.expiresAt,
      consentId: consentRecord.id,
    };
  }

  /**
   * Get user consent summary
   */
  getUserConsentSummary(userId) {
    const userConsents = Array.from(this.consentRecords.values()).filter(
      record => record.userId === userId
    );

    const summary = {
      userId,
      totalConsents: userConsents.length,
      grantedConsents: userConsents.filter(
        c => c.status === this.consentStatus.GRANTED
      ).length,
      deniedConsents: userConsents.filter(
        c => c.status === this.consentStatus.DENIED
      ).length,
      withdrawnConsents: userConsents.filter(
        c => c.status === this.consentStatus.WITHDRAWN
      ).length,
      expiredConsents: userConsents.filter(c => this.isConsentExpired(c))
        .length,
      consentDetails: userConsents.map(record => ({
        consentType: record.consentType,
        status: record.status,
        grantedAt: record.grantedAt,
        expiresAt: record.expiresAt,
        purpose: record.purpose,
      })),
    };

    return summary;
  }

  /**
   * Load consent policies
   */
  async loadConsentPolicies() {
    // Default consent policies
    const defaultPolicies = {
      [this.consentTypes.DATA_COLLECTION]: {
        name: 'Data Collection',
        description: 'Collection of personal data for service provision',
        required: true,
        expiresIn: 365 * 24 * 60 * 60 * 1000, // 1 year
        dataCategories: ['personal', 'contact', 'usage'],
        retentionPeriod: 7 * 365 * 24 * 60 * 60 * 1000, // 7 years
      },
      [this.consentTypes.MARKETING]: {
        name: 'Marketing Communications',
        description: 'Sending marketing emails and notifications',
        required: false,
        expiresIn: 2 * 365 * 24 * 60 * 60 * 1000, // 2 years
        dataCategories: ['contact', 'preferences'],
        retentionPeriod: 2 * 365 * 24 * 60 * 60 * 1000, // 2 years
      },
      [this.consentTypes.ANALYTICS]: {
        name: 'Analytics and Tracking',
        description: 'Collection of usage analytics and performance data',
        required: false,
        expiresIn: 365 * 24 * 60 * 60 * 1000, // 1 year
        dataCategories: ['usage', 'performance', 'device'],
        retentionPeriod: 2 * 365 * 24 * 60 * 60 * 1000, // 2 years
      },
    };

    Object.entries(defaultPolicies).forEach(([type, policy]) => {
      this.consentPolicies.set(type, policy);
    });
  }

  /**
   * Load consent templates
   */
  async loadConsentTemplates() {
    const templates = {
      [this.consentTypes.DATA_COLLECTION]: {
        title: 'Data Collection Consent',
        content:
          'We collect your personal data to provide and improve our services. This includes your name, email, and usage information.',
        legalBasis: 'Consent',
        dataController: 'AIOS Platform',
        contactEmail: 'privacy@aios.com',
      },
      [this.consentTypes.MARKETING]: {
        title: 'Marketing Communications Consent',
        content:
          'We would like to send you marketing communications about our products and services.',
        legalBasis: 'Consent',
        dataController: 'AIOS Platform',
        contactEmail: 'privacy@aios.com',
      },
    };

    Object.entries(templates).forEach(([type, template]) => {
      this.consentTemplates.set(type, template);
    });
  }

  /**
   * Load consent records
   */
  async loadConsentRecords() {
    // In a real implementation, this would load from a database
    // For now, we'll initialize with empty records
    console.log('📋 Consent records loaded');
  }

  /**
   * Store consent record
   */
  storeConsentRecord(record) {
    const key = `${record.userId}_${record.consentType}`;
    this.consentRecords.set(key, record);

    // Also store by ID for quick lookup
    this.consentRecords.set(record.id, record);
  }

  /**
   * Get consent record
   */
  getConsentRecord(userId, consentType) {
    const key = `${userId}_${consentType}`;
    return this.consentRecords.get(key);
  }

  /**
   * Get consent record by ID
   */
  getConsentRecordById(consentId) {
    return this.consentRecords.get(consentId);
  }

  /**
   * Store consent request
   */
  storeConsentRequest(request) {
    this.consentRecords.set(request.id, request);
  }

  /**
   * Check if consent is expired
   */
  isConsentExpired(consentRecord) {
    if (!consentRecord.expiresIn) return false;

    const expiresAt = consentRecord.grantedAt + consentRecord.expiresIn;
    return Date.now() > expiresAt;
  }

  /**
   * Update consent statistics
   */
  updateConsentStats(action, time = 0) {
    this.consentStats.totalConsents++;

    switch (action) {
      case 'granted':
        this.consentStats.grantedConsents++;
        break;
      case 'denied':
        this.consentStats.deniedConsents++;
        break;
      case 'withdrawn':
        this.consentStats.withdrawnConsents++;
        break;
      case 'expired':
        this.consentStats.expiredConsents++;
        break;
      default:
        // Handle unknown action
        break;
    }

    if (time > 0) {
      this.consentStats.consentTimes.push(time);
      this.consentStats.averageConsentTime =
        this.consentStats.consentTimes.reduce((a, b) => a + b, 0) /
        this.consentStats.consentTimes.length;
    }

    this.consentStats.consentRate =
      this.consentStats.totalConsents > 0
        ? this.consentStats.grantedConsents / this.consentStats.totalConsents
        : 0;
  }

  /**
   * Log consent events
   */
  logConsentEvent(eventType, userId, consentType, data) {
    const event = {
      id: this.generateEventId(),
      eventType,
      userId,
      consentType,
      data,
      timestamp: Date.now(),
      ipAddress: this.getClientIP(),
      userAgent: this.getUserAgent(),
    };

    // Store in audit log
    this.storeAuditEvent('consent', event);
  }

  /**
   * Trigger consent actions
   */
  async triggerConsentActions(consentType, action, userId) {
    // This would integrate with other systems to trigger actions based on consent changes
    console.log(
      `🔄 Triggering consent actions: ${consentType} - ${action} for user ${userId}`
    );
  }

  /**
   * Get consent statistics
   */
  getConsentStats() {
    return {
      ...this.consentStats,
      activeConsents: this.consentRecords.size,
      consentTypes: Object.keys(this.consentTypes).length,
      policies: this.consentPolicies.size,
      templates: this.consentTemplates.size,
    };
  }

  /**
   * Generate consent ID
   */
  generateConsentId() {
    return `consent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate event ID
   */
  generateEventId() {
    return Math.random().toString(36).substr(2, 9);
  }

  /**
   * Get consent version
   */
  getConsentVersion(consentType) {
    const policy = this.consentPolicies.get(consentType);
    return policy ? policy.version || '1.0' : '1.0';
  }

  /**
   * Get client IP
   */
  getClientIP() {
    // This would get the actual client IP
    return '127.0.0.1';
  }

  /**
   * Get user agent
   */
  getUserAgent() {
    return navigator.userAgent || 'Unknown';
  }

  /**
   * Store audit event
   */
  storeAuditEvent(type, event) {
    // This would integrate with your audit logging system
    console.log(`🔍 Audit Event [${type}]:`, event);
  }

  /**
   * Health check
   */
  async healthCheck() {
    try {
      return {
        status: 'healthy',
        message: 'Consent management system operational',
        stats: this.getConsentStats(),
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        message: error.message,
        stats: this.getConsentStats(),
        timestamp: new Date().toISOString(),
      };
    }
  }
}

// Create singleton instance
const consentManagementSystem = new ConsentManagementSystem();

export default consentManagementSystem;
