/**
 * 🔗 Learning-Telegram Integration System
 * 
 * Bridges learning loop insights with Telegram notifications
 * for intelligent, context-aware communication
 */

const EnhancedTelegramChat = require('./enhancedTelegramChat.js');
const { ComprehensiveLearningLoop } = require('./comprehensiveLearningLoop.js');
const { RoundBasedLearningSystem } = require('./roundBasedLearningSystem.js');

class LearningTelegramIntegration {
  constructor() {
    this.name = 'Learning-Telegram Integration';
    this.version = '1.0.0';
    this.isActive = false;
    
    // Core components
    this.telegramChat = null;
    this.learningLoop = null;
    this.roundLearning = null;
    
    // Integration settings
    this.integrationSettings = {
      learningInsights: {
        enabled: true,
        frequency: 'real-time',
        priority: 'medium',
        channels: ['telegram', 'console']
      },
      patternNotifications: {
        enabled: true,
        threshold: 0.8,
        priority: 'high',
        channels: ['telegram']
      },
      performanceAlerts: {
        enabled: true,
        threshold: 0.7,
        priority: 'high',
        channels: ['telegram']
      },
      errorNotifications: {
        enabled: true,
        threshold: 3,
        priority: 'critical',
        channels: ['telegram', 'console']
      }
    };
    
    // Learning event handlers
    this.eventHandlers = new Map();
    this.notificationQueue = [];
    this.learningMetrics = new Map();
    
    // Smart notification rules
    this.notificationRules = new Map();
    this.userPreferences = new Map();
    
    
  }

  /**
   * Initialize the integration system
   */
  async initialize(telegramToken, channelId) {
    try {
      
      
      // Initialize Telegram chat system
      this.telegramChat = new EnhancedTelegramChat();
      await this.telegramChat.initialize(telegramToken, channelId);
      
      // Initialize learning systems
      await this.initializeLearningSystems();
      
      // Setup integration
      await this.setupIntegration();
      
      // Setup event handlers
      this.setupEventHandlers();
      
      // Setup notification rules
      this.setupNotificationRules();
      
      // Start monitoring
      this.startMonitoring();
      
      this.isActive = true;
      
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Learning-Telegram Integration:', error);
      return false;
    }
  }

  /**
   * Initialize learning systems
   */
  async initializeLearningSystems() {
    try {
      
      
      // Initialize comprehensive learning loop
      this.learningLoop = new ComprehensiveLearningLoop();
      await this.learningLoop.initialize();
      
      // Initialize round-based learning system
      this.roundLearning = new RoundBasedLearningSystem();
      await this.roundLearning.initialize();
      
      
    } catch (error) {
      console.error('❌ Failed to initialize learning systems:', error);
      throw error;
    }
  }

  /**
   * Setup integration between systems
   */
  async setupIntegration() {
    try {
      
      
      // Connect learning loop to Telegram
      if (this.learningLoop && this.telegramChat) {
        // Subscribe to learning events
        this.learningLoop.on('pattern_discovered', (pattern) => {
          this.handleLearningPattern(pattern);
        });
        
        this.learningLoop.on('improvement_suggested', (suggestion) => {
          this.handleImprovementSuggestion(suggestion);
        });
        
        this.learningLoop.on('performance_optimized', (optimization) => {
          this.handlePerformanceOptimization(optimization);
        });
        
        this.learningLoop.on('error_detected', (error) => {
          this.handleErrorDetection(error);
        });
      }
      
      // Connect round learning to Telegram
      if (this.roundLearning && this.telegramChat) {
        this.roundLearning.on('round_completed', (round) => {
          this.handleRoundCompletion(round);
        });
        
        this.roundLearning.on('learning_updated', (learning) => {
          this.handleLearningUpdate(learning);
        });
        
        this.roundLearning.on('recommendation_generated', (recommendation) => {
          this.handleRecommendation(recommendation);
        });
      }
      
      
    } catch (error) {
      console.error('❌ Failed to setup integration:', error);
      throw error;
    }
  }

  /**
   * Setup event handlers
   */
  setupEventHandlers() {
    // Learning pattern handler
    this.eventHandlers.set('pattern_discovered', {
      handler: this.handleLearningPattern.bind(this),
      priority: 'high',
      enabled: true
    });
    
    // Improvement suggestion handler
    this.eventHandlers.set('improvement_suggested', {
      handler: this.handleImprovementSuggestion.bind(this),
      priority: 'medium',
      enabled: true
    });
    
    // Performance optimization handler
    this.eventHandlers.set('performance_optimized', {
      handler: this.handlePerformanceOptimization.bind(this),
      priority: 'medium',
      enabled: true
    });
    
    // Error detection handler
    this.eventHandlers.set('error_detected', {
      handler: this.handleErrorDetection.bind(this),
      priority: 'critical',
      enabled: true
    });
    
    // Round completion handler
    this.eventHandlers.set('round_completed', {
      handler: this.handleRoundCompletion.bind(this),
      priority: 'low',
      enabled: true
    });
    
    // Learning update handler
    this.eventHandlers.set('learning_updated', {
      handler: this.handleLearningUpdate.bind(this),
      priority: 'low',
      enabled: true
    });
    
    // Recommendation handler
    this.eventHandlers.set('recommendation_generated', {
      handler: this.handleRecommendation.bind(this),
      priority: 'medium',
      enabled: true
    });
  }

  /**
   * Setup notification rules
   */
  setupNotificationRules() {
    // Pattern discovery rules
    this.notificationRules.set('pattern_discovery', {
      condition: (data) => data.confidence > 0.8,
      message: (data) => `🎉 **New Pattern Discovered!**\n\n` +
                        `🔍 **Pattern Type**: ${data.type}\n` +
                        `🎯 **Confidence**: ${(data.confidence * 100).toFixed(1)}%\n` +
                        `📊 **Impact**: ${data.impact}\n` +
                        `🕐 **Discovered**: ${new Date().toLocaleString()}\n\n` +
                        `💡 **Description**: ${data.description || 'High-confidence pattern identified'}`,
      priority: 'high',
      channels: ['telegram']
    });
    
    // Improvement suggestion rules
    this.notificationRules.set('improvement_suggestion', {
      condition: (data) => data.priority === 'high' || data.impact > 0.7,
      message: (data) => `💡 **Improvement Suggestion**\n\n` +
                        `📝 **Suggestion**: ${data.description}\n` +
                        `🎯 **Priority**: ${data.priority}\n` +
                        `📈 **Expected Impact**: ${(data.impact * 100).toFixed(1)}%\n` +
                        `🔧 **Category**: ${data.category || 'General'}\n` +
                        `🕐 **Generated**: ${new Date().toLocaleString()}\n\n` +
                        `⚡ **Action Required**: ${data.actionRequired || 'Review and consider implementation'}`,
      priority: 'medium',
      channels: ['telegram']
    });
    
    // Performance optimization rules
    this.notificationRules.set('performance_optimization', {
      condition: (data) => data.improvement > 0.1,
      message: (data) => `⚡ **Performance Optimized**\n\n` +
                        `🔧 **Optimization**: ${data.type}\n` +
                        `📊 **Improvement**: ${(data.improvement * 100).toFixed(1)}%\n` +
                        `🎯 **Area**: ${data.area}\n` +
                        `⏱️ **Duration**: ${data.duration || 'N/A'}ms\n` +
                        `🕐 **Applied**: ${new Date().toLocaleString()}\n\n` +
                        `📈 **Impact**: ${data.impact || 'System performance enhanced'}`,
      priority: 'medium',
      channels: ['telegram']
    });
    
    // Error detection rules
    this.notificationRules.set('error_detection', {
      condition: (data) => data.severity === 'critical' || data.frequency > 3,
      message: (data) => `🚨 **Error Detected**\n\n` +
                        `❌ **Error Type**: ${data.type}\n` +
                        `📝 **Description**: ${data.message}\n` +
                        `🔴 **Severity**: ${data.severity}\n` +
                        `📊 **Frequency**: ${data.frequency} occurrences\n` +
                        `📍 **Location**: ${data.location || 'Unknown'}\n` +
                        `🕐 **Detected**: ${new Date().toLocaleString()}\n\n` +
                        `🔧 **Auto-Fix**: ${data.autoFix ? 'Available' : 'Manual intervention required'}`,
      priority: 'critical',
      channels: ['telegram', 'console']
    });
    
    // Round completion rules
    this.notificationRules.set('round_completion', {
      condition: (data) => data.successRate > 0.9 || data.learningInsights.length > 0,
      message: (data) => `🔄 **Learning Round Completed**\n\n` +
                        `📋 **Round ID**: ${data.roundId}\n` +
                        `✅ **Success Rate**: ${(data.successRate * 100).toFixed(1)}%\n` +
                        `⏱️ **Duration**: ${data.duration}ms\n` +
                        `📊 **Tasks**: ${data.tasksCompleted}\n` +
                        `🧠 **Insights**: ${data.learningInsights.length}\n` +
                        `🕐 **Completed**: ${new Date().toLocaleString()}\n\n` +
                        `💡 **Key Learning**: ${data.keyLearning || 'Round completed successfully'}`,
      priority: 'low',
      channels: ['telegram']
    });
    
    // Learning update rules
    this.notificationRules.set('learning_update', {
      condition: (data) => data.significantChange || data.newPatterns > 0,
      message: (data) => `🧠 **Learning System Updated**\n\n` +
                        `📚 **Data Points**: ${data.dataPoints}\n` +
                        `🔍 **Patterns**: ${data.patterns}\n` +
                        `🆕 **New Patterns**: ${data.newPatterns}\n` +
                        `📈 **Accuracy**: ${(data.accuracy * 100).toFixed(1)}%\n` +
                        `🕐 **Updated**: ${new Date().toLocaleString()}\n\n` +
                        `🎯 **Status**: ${data.status || 'Learning system optimized'}`,
      priority: 'low',
      channels: ['telegram']
    });
    
    // Recommendation rules
    this.notificationRules.set('recommendation', {
      condition: (data) => data.priority === 'high' || data.confidence > 0.8,
      message: (data) => `🎯 **System Recommendation**\n\n` +
                        `💡 **Recommendation**: ${data.description}\n` +
                        `🎯 **Priority**: ${data.priority}\n` +
                        `📊 **Confidence**: ${(data.confidence * 100).toFixed(1)}%\n` +
                        `📈 **Expected Benefit**: ${data.benefit || 'Improved system performance'}\n` +
                        `🕐 **Generated**: ${new Date().toLocaleString()}\n\n` +
                        `⚡ **Next Steps**: ${data.nextSteps || 'Review and implement if applicable'}`,
      priority: 'medium',
      channels: ['telegram']
    });
  }

  /**
   * Handle learning pattern discovery
   */
  async handleLearningPattern(pattern) {
    try {
      
      
      const rule = this.notificationRules.get('pattern_discovery');
      if (rule && rule.condition(pattern)) {
        const message = rule.message(pattern);
        await this.sendNotification(message, rule.priority, rule.channels);
        
        // Update learning metrics
        this.updateLearningMetrics('pattern_discovered', pattern);
      }
    } catch (error) {
      console.error('Error handling learning pattern:', error);
    }
  }

  /**
   * Handle improvement suggestion
   */
  async handleImprovementSuggestion(suggestion) {
    try {
      
      
      const rule = this.notificationRules.get('improvement_suggestion');
      if (rule && rule.condition(suggestion)) {
        const message = rule.message(suggestion);
        await this.sendNotification(message, rule.priority, rule.channels);
        
        // Update learning metrics
        this.updateLearningMetrics('improvement_suggested', suggestion);
      }
    } catch (error) {
      console.error('Error handling improvement suggestion:', error);
    }
  }

  /**
   * Handle performance optimization
   */
  async handlePerformanceOptimization(optimization) {
    try {
      
      
      const rule = this.notificationRules.get('performance_optimization');
      if (rule && rule.condition(optimization)) {
        const message = rule.message(optimization);
        await this.sendNotification(message, rule.priority, rule.channels);
        
        // Update learning metrics
        this.updateLearningMetrics('performance_optimized', optimization);
      }
    } catch (error) {
      console.error('Error handling performance optimization:', error);
    }
  }

  /**
   * Handle error detection
   */
  async handleErrorDetection(error) {
    try {
      
      
      const rule = this.notificationRules.get('error_detection');
      if (rule && rule.condition(error)) {
        const message = rule.message(error);
        await this.sendNotification(message, rule.priority, rule.channels);
        
        // Update learning metrics
        this.updateLearningMetrics('error_detected', error);
      }
    } catch (error) {
      console.error('Error handling error detection:', error);
    }
  }

  /**
   * Handle round completion
   */
  async handleRoundCompletion(round) {
    try {
      
      
      const rule = this.notificationRules.get('round_completion');
      if (rule && rule.condition(round)) {
        const message = rule.message(round);
        await this.sendNotification(message, rule.priority, rule.channels);
        
        // Update learning metrics
        this.updateLearningMetrics('round_completed', round);
      }
    } catch (error) {
      console.error('Error handling round completion:', error);
    }
  }

  /**
   * Handle learning update
   */
  async handleLearningUpdate(learning) {
    try {
      
      
      const rule = this.notificationRules.get('learning_update');
      if (rule && rule.condition(learning)) {
        const message = rule.message(learning);
        await this.sendNotification(message, rule.priority, rule.channels);
        
        // Update learning metrics
        this.updateLearningMetrics('learning_updated', learning);
      }
    } catch (error) {
      console.error('Error handling learning update:', error);
    }
  }

  /**
   * Handle recommendation
   */
  async handleRecommendation(recommendation) {
    try {
      
      
      const rule = this.notificationRules.get('recommendation');
      if (rule && rule.condition(recommendation)) {
        const message = rule.message(recommendation);
        await this.sendNotification(message, rule.priority, rule.channels);
        
        // Update learning metrics
        this.updateLearningMetrics('recommendation_generated', recommendation);
      }
    } catch (error) {
      console.error('Error handling recommendation:', error);
    }
  }

  /**
   * Send notification through specified channels
   */
  async sendNotification(message, priority = 'medium', channels = ['telegram']) {
    try {
      for (const channel of channels) {
        switch (channel) {
          case 'telegram':
            if (this.telegramChat && this.telegramChat.isInitialized) {
              // Send to channel if configured
              if (this.telegramChat.channelId) {
                await this.telegramChat.bot.sendMessage(
                  this.telegramChat.channelId, 
                  message, 
                  { parse_mode: 'Markdown' }
                );
              }
              
              // Send to subscribed users
              for (const [userId, preferences] of this.userPreferences) {
                if (preferences.notifications && preferences.priority.includes(priority)) {
                  await this.telegramChat.sendNotification(userId, message, priority);
                }
              }
            }
            break;
            
          case 'console':
            } NOTIFICATION:`);
            
            break;
        }
      }
      
      // Log notification
      this.logNotification(message, priority, channels);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }

  /**
   * Update learning metrics
   */
  updateLearningMetrics(eventType, data) {
    try {
      const timestamp = new Date();
      const metrics = this.learningMetrics.get(eventType) || {
        count: 0,
        lastUpdate: timestamp,
        data: []
      };
      
      metrics.count++;
      metrics.lastUpdate = timestamp;
      metrics.data.push({
        timestamp,
        data,
        processed: true
      });
      
      // Keep only last 100 entries
      if (metrics.data.length > 100) {
        metrics.data = metrics.data.slice(-100);
      }
      
      this.learningMetrics.set(eventType, metrics);
    } catch (error) {
      console.error('Error updating learning metrics:', error);
    }
  }

  /**
   * Log notification
   */
  logNotification(message, priority, channels) {
    try {
      const logEntry = {
        timestamp: new Date(),
        message,
        priority,
        channels,
        processed: true
      };
      
      this.notificationQueue.push(logEntry);
      
      // Keep only last 1000 entries
      if (this.notificationQueue.length > 1000) {
        this.notificationQueue = this.notificationQueue.slice(-1000);
      }
    } catch (error) {
      console.error('Error logging notification:', error);
    }
  }

  /**
   * Start monitoring
   */
  startMonitoring() {
    try {
      
      
      // Monitor learning metrics every 5 minutes
      setInterval(() => {
        this.monitorLearningMetrics();
      }, 5 * 60 * 1000);
      
      // Process notification queue every minute
      setInterval(() => {
        this.processNotificationQueue();
      }, 60 * 1000);
      
      
    } catch (error) {
      console.error('Error starting monitoring:', error);
    }
  }

  /**
   * Monitor learning metrics
   */
  async monitorLearningMetrics() {
    try {
      const metrics = {
        totalEvents: 0,
        eventTypes: {},
        notificationsSent: this.notificationQueue.length,
        lastUpdate: new Date()
      };
      
      for (const [eventType, data] of this.learningMetrics) {
        metrics.totalEvents += data.count;
        metrics.eventTypes[eventType] = data.count;
      }
      
      // Send periodic status update
      if (metrics.totalEvents > 0) {
        const eventBreakdown = Object.entries(metrics.eventTypes)
          .map(([type, count]) => '   - ' + type + ': ' + count)
          .join('\n');
        
        const message = 'Learning Integration Status\n\n' +
                      'Total Events: ' + metrics.totalEvents + '\n' +
                      'Notifications Sent: ' + metrics.notificationsSent + '\n' +
                      'Last Update: ' + metrics.lastUpdate.toLocaleString() + '\n\n' +
                      'Event Breakdown:\n' +
                      eventBreakdown;
        
        await this.sendNotification(message, 'low', ['console']);
      }
    } catch (error) {
      console.error('Error monitoring learning metrics:', error);
    }
  }

  /**
   * Process notification queue
   */
  processNotificationQueue() {
    try {
      const recentNotifications = this.notificationQueue.filter(
        entry => Date.now() - entry.timestamp.getTime() < 24 * 60 * 60 * 1000 // Last 24 hours
      );
      
      if (recentNotifications.length > 0) {
        
      }
    } catch (error) {
      console.error('Error processing notification queue:', error);
    }
  }

  /**
   * Get integration status
   */
  getStatus() {
    return {
      isActive: this.isActive,
      telegramChat: this.telegramChat ? this.telegramChat.isInitialized : false,
      learningLoop: this.learningLoop !== null,
      roundLearning: this.roundLearning !== null,
      eventHandlers: this.eventHandlers.size,
      notificationRules: this.notificationRules.size,
      learningMetrics: this.learningMetrics.size,
      notificationQueue: this.notificationQueue.length
    };
  }

  /**
   * Get learning metrics summary
   */
  getLearningMetricsSummary() {
    const summary = {
      totalEvents: 0,
      eventTypes: {},
      notificationsSent: this.notificationQueue.length,
      lastUpdate: new Date()
    };
    
    for (const [eventType, data] of this.learningMetrics) {
      summary.totalEvents += data.count;
      summary.eventTypes[eventType] = {
        count: data.count,
        lastUpdate: data.lastUpdate
      };
    }
    
    return summary;
  }

  /**
   * Shutdown integration
   */
  async shutdown() {
    try {
      
      
      this.isActive = false;
      
      // Clear intervals
      if (this.monitoringInterval) {
        clearInterval(this.monitoringInterval);
      }
      
      if (this.queueInterval) {
        clearInterval(this.queueInterval);
      }
      
    } catch (error) {
      console.error('Error shutting down integration:', error);
    }
  }
}

module.exports = LearningTelegramIntegration;
