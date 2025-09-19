/**
 * Enhanced AIOS Integration System
 * Integrates all new UX and monitoring components
 */

const ConversationHistoryManager = require('./conversationHistoryManager');
const UserPreferencesManager = require('./userPreferencesManager');
const MultiLanguageManager = require('./multiLanguageManager');
const VoiceManager = require('./voiceManager');
const MonitoringSystem = require('./monitoringSystem');
const LoggingSystem = require('./loggingSystem');

class EnhancedAIOSIntegration {
  constructor() {
    this.conversationHistory = new ConversationHistoryManager();
    this.userPreferences = new UserPreferencesManager();
    this.multiLanguage = new MultiLanguageManager();
    this.voiceManager = new VoiceManager();
    this.monitoring = new MonitoringSystem();
    this.logging = new LoggingSystem();

    this.isInitialized = false;
    this.telegramBot = null;
    this.smartAgent = null;
  }

  /**
   * Initialize all systems
   */
  async initialize(telegramBot = null, smartAgent = null) {
    try {
      this.logging.log(
        'INFO',
        'Initializing Enhanced AIOS Integration System...'
      );

      this.telegramBot = telegramBot;
      this.smartAgent = smartAgent;

      // Initialize monitoring system
      await this.monitoring.initialize(telegramBot);
      this.logging.log('INFO', 'Monitoring system initialized');

      // Initialize voice manager
      if (this.voiceManager.isSupported) {
        await this.voiceManager.initialize();
        this.voiceManager.enableAIOSCommands();
        this.logging.log('INFO', 'Voice manager initialized');
      } else {
        this.logging.log(
          'WARN',
          'Voice features not supported in this environment'
        );
      }

      // Set up voice callbacks
      this.setupVoiceCallbacks();

      // Set up monitoring callbacks
      this.setupMonitoringCallbacks();

      this.isInitialized = true;
      this.logging.log(
        'INFO',
        'Enhanced AIOS Integration System initialized successfully'
      );

      return true;
    } catch (error) {
      this.logging.log(
        'ERROR',
        'Failed to initialize Enhanced AIOS Integration System:',
        error
      );
      throw error;
    }
  }

  /**
   * Setup voice callbacks
   */
  setupVoiceCallbacks() {
    this.voiceManager.setCallbacks({
      onResult: async transcript => {
        this.logging.logUserAction('voice_input', 'voice_command', {
          transcript,
        });

        if (this.smartAgent) {
          await this.voiceManager.processAIOSVoiceInput(
            transcript,
            this.smartAgent
          );
        }
      },
      onError: error => {
        this.logging.log('ERROR', 'Voice recognition error:', error);
      },
      onStart: () => {
        this.logging.log('INFO', 'Voice recognition started');
      },
      onEnd: () => {
        this.logging.log('INFO', 'Voice recognition ended');
      },
    });
  }

  /**
   * Setup monitoring callbacks
   */
  setupMonitoringCallbacks() {
    // This would integrate with the monitoring system's alert callbacks
    this.logging.log('INFO', 'Monitoring callbacks configured');
  }

  /**
   * Process user query with enhanced features
   */
  async processUserQuery(userId, query, metadata = {}) {
    try {
      this.logging.logUserAction(userId, 'query_processed', {
        query,
        ...metadata,
      });

      // Get user preferences
      const preferences = await this.userPreferences.getUserPreferences(userId);

      // Set language from preferences
      await this.multiLanguage.loadLanguageFromPreferences(
        this.userPreferences,
        userId
      );

      // Process query with smart agent
      let response = null;
      if (this.smartAgent) {
        response = await this.smartAgent.processQuery(query, userId);
      } else {
        response = { text: 'Smart agent not available' };
      }

      // Save conversation history
      await this.conversationHistory.saveMessage(
        userId,
        metadata.conversationId || this.generateConversationId(),
        query,
        response,
        {
          ...metadata,
          preferences: preferences,
          language: this.multiLanguage.getCurrentLanguage(),
        }
      );

      // Log performance metrics
      this.logging.logPerformanceMetric(
        'query_processing_time',
        Date.now() - metadata.startTime || 0,
        {
          userId,
          queryLength: query.length,
          responseLength: response.text?.length || 0,
        }
      );

      return {
        response,
        preferences,
        language: this.multiLanguage.getCurrentLanguage(),
        conversationId: metadata.conversationId,
      };
    } catch (error) {
      this.logging.log('ERROR', 'Failed to process user query:', error);
      throw error;
    }
  }

  /**
   * Get user conversation history
   */
  async getUserConversationHistory(userId, conversationId = null, limit = 20) {
    try {
      const history = await this.conversationHistory.getConversationHistory(
        userId,
        conversationId,
        limit
      );

      // Translate messages based on user's language preference
      const preferences = await this.userPreferences.getUserPreferences(userId);
      await this.multiLanguage.loadLanguageFromPreferences(
        this.userPreferences,
        userId
      );

      const translatedHistory = history.map(conv => ({
        ...conv,
        message: {
          ...conv.message,
          text: this.multiLanguage.t('message_received', {
            text: conv.message.text,
          }),
        },
        response: {
          ...conv.response,
          text: this.multiLanguage.t('ai_response', {
            text: conv.response.text,
          }),
        },
      }));

      this.logging.logUserAction(userId, 'conversation_history_accessed', {
        conversationId,
        historyLength: history.length,
      });

      return translatedHistory;
    } catch (error) {
      this.logging.log('ERROR', 'Failed to get conversation history:', error);
      return [];
    }
  }

  /**
   * Update user preferences
   */
  async updateUserPreferences(userId, preferences) {
    try {
      const updatedPreferences =
        await this.userPreferences.updateUserPreferences(userId, preferences);

      // Update language if changed
      if (preferences.language) {
        this.multiLanguage.setLanguage(preferences.language);
      }

      // Update voice settings if changed
      if (preferences.voiceSettings) {
        this.voiceManager.setVoiceSettings(preferences.voiceSettings);
      }

      this.logging.logUserAction(userId, 'preferences_updated', {
        preferences,
      });

      return updatedPreferences;
    } catch (error) {
      this.logging.log('ERROR', 'Failed to update user preferences:', error);
      throw error;
    }
  }

  /**
   * Get system health status
   */
  getSystemHealthStatus() {
    try {
      const healthStatus = this.monitoring.getHealthStatus();
      const logStats = this.logging.getLogStats();
      const voiceStatus = this.voiceManager.getStatus();

      return {
        ...healthStatus,
        components: {
          ...healthStatus.components,
          logging: {
            status: 'healthy',
            stats: logStats,
          },
          voice: {
            status: voiceStatus.supported ? 'healthy' : 'unavailable',
            details: voiceStatus,
          },
          language: {
            status: 'healthy',
            current: this.multiLanguage.getCurrentLanguage(),
            supported: Object.keys(this.multiLanguage.getSupportedLanguages())
              .length,
          },
        },
      };
    } catch (error) {
      this.logging.log('ERROR', 'Failed to get system health status:', error);
      return { overall: 'error', error: error.message };
    }
  }

  /**
   * Get user analytics
   */
  async getUserAnalytics(userId) {
    try {
      const conversationAnalytics =
        await this.conversationHistory.getConversationAnalytics(userId);
      const preferences = await this.userPreferences.getUserPreferences(userId);
      const conversationSummaries =
        await this.conversationHistory.getConversationSummaries(userId);

      return {
        userId,
        conversationAnalytics,
        preferences: await this.userPreferences.getPreferencesAnalytics(userId),
        conversationSummaries,
        language: this.multiLanguage.getCurrentLanguage(),
        voiceEnabled: this.voiceManager.isSupported,
        lastActivity: conversationAnalytics?.activityByDay
          ? Object.keys(conversationAnalytics.activityByDay).pop()
          : null,
      };
    } catch (error) {
      this.logging.log('ERROR', 'Failed to get user analytics:', error);
      return null;
    }
  }

  /**
   * Export user data
   */
  async exportUserData(userId) {
    try {
      const preferences = await this.userPreferences.exportPreferences(userId);
      const conversationHistory =
        await this.conversationHistory.getConversationHistory(
          userId,
          null,
          1000
        );
      const analytics = await this.getUserAnalytics(userId);

      const exportData = {
        userId,
        exportDate: new Date().toISOString(),
        preferences,
        conversationHistory,
        analytics,
        language: this.multiLanguage.getCurrentLanguage(),
        voiceSettings: this.voiceManager.getStatus(),
      };

      this.logging.logUserAction(userId, 'data_exported', {
        conversationCount: conversationHistory.length,
        preferencesCount: Object.keys(preferences.preferences).length,
      });

      return exportData;
    } catch (error) {
      this.logging.log('ERROR', 'Failed to export user data:', error);
      throw error;
    }
  }

  /**
   * Import user data
   */
  async importUserData(userId, importData) {
    try {
      // Import preferences
      if (importData.preferences) {
        await this.userPreferences.importPreferences(
          userId,
          importData.preferences
        );
      }

      // Set language
      if (importData.language) {
        this.multiLanguage.setLanguage(importData.language);
      }

      // Set voice settings
      if (importData.voiceSettings) {
        this.voiceManager.setVoiceSettings(importData.voiceSettings);
      }

      this.logging.logUserAction(userId, 'data_imported', {
        hasPreferences: !!importData.preferences,
        hasConversations: !!importData.conversationHistory,
        language: importData.language,
      });

      return true;
    } catch (error) {
      this.logging.log('ERROR', 'Failed to import user data:', error);
      throw error;
    }
  }

  /**
   * Generate conversation ID
   */
  generateConversationId() {
    return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get system metrics
   */
  getSystemMetrics() {
    try {
      const monitoringMetrics = this.monitoring.getMetricsSummary();
      const logStats = this.logging.getLogStats();
      const voiceAnalytics = this.voiceManager.getVoiceAnalytics();

      return {
        monitoring: monitoringMetrics,
        logging: logStats,
        voice: voiceAnalytics,
        language: this.multiLanguage.getLanguageStats(),
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logging.log('ERROR', 'Failed to get system metrics:', error);
      return null;
    }
  }

  /**
   * Clean up old data
   */
  async cleanupOldData(userId, daysOld = 30) {
    try {
      const conversationCleanup =
        await this.conversationHistory.cleanupOldConversations(userId, daysOld);
      const logCleanup = this.logging.cleanOldLogFiles(daysOld);

      this.logging.logUserAction(userId, 'data_cleanup', {
        conversationsDeleted: conversationCleanup,
        logFilesDeleted: logCleanup,
        daysOld,
      });

      return {
        conversationsDeleted: conversationCleanup,
        logFilesDeleted: logCleanup,
      };
    } catch (error) {
      this.logging.log('ERROR', 'Failed to cleanup old data:', error);
      return { conversationsDeleted: 0, logFilesDeleted: 0 };
    }
  }

  /**
   * Get system status report
   */
  async getSystemStatusReport() {
    try {
      const healthStatus = this.getSystemHealthStatus();
      const metrics = this.getSystemMetrics();
      const logFiles = this.logging.getLogFiles();

      const report = {
        timestamp: new Date().toISOString(),
        health: healthStatus,
        metrics,
        components: {
          conversationHistory: {
            status: 'active',
            manager: 'ConversationHistoryManager',
          },
          userPreferences: {
            status: 'active',
            manager: 'UserPreferencesManager',
          },
          multiLanguage: {
            status: 'active',
            currentLanguage: this.multiLanguage.getCurrentLanguage(),
            supportedLanguages: Object.keys(
              this.multiLanguage.getSupportedLanguages()
            ).length,
          },
          voiceManager: {
            status: this.voiceManager.isSupported ? 'active' : 'unavailable',
            supported: this.voiceManager.isSupported,
          },
          monitoring: {
            status: this.monitoring.isMonitoring ? 'active' : 'inactive',
            monitoring: this.monitoring.isMonitoring,
          },
          logging: {
            status: 'active',
            logFiles: logFiles.length,
            currentLevel: this.logging.getLogLevel(),
          },
        },
      };

      return report;
    } catch (error) {
      this.logging.log(
        'ERROR',
        'Failed to generate system status report:',
        error
      );
      return { error: error.message };
    }
  }

  /**
   * Stop all systems
   */
  async stop() {
    try {
      this.logging.log('INFO', 'Stopping Enhanced AIOS Integration System...');

      // Stop monitoring
      this.monitoring.stopMonitoring();

      // Stop voice manager
      if (this.voiceManager.isListening) {
        this.voiceManager.stopListening();
      }
      if (this.voiceManager.isSpeaking) {
        this.voiceManager.stopSpeaking();
      }

      this.isInitialized = false;
      this.logging.log('INFO', 'Enhanced AIOS Integration System stopped');

      return true;
    } catch (error) {
      this.logging.log(
        'ERROR',
        'Failed to stop Enhanced AIOS Integration System:',
        error
      );
      throw error;
    }
  }
}

module.exports = EnhancedAIOSIntegration;
