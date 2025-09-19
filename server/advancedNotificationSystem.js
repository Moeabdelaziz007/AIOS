/**
 * 🔔 Advanced Notification System with Preferences
 *
 * Comprehensive notification management with user preferences
 */

class AdvancedNotificationSystem {
  constructor() {
    this.notificationChannels = new Map();
    this.userPreferences = new Map();
    this.notificationHistory = new Map();
    this.scheduledNotifications = new Map();
    this.notificationTemplates = new Map();
    this.rateLimits = new Map();

    this.initializeNotificationChannels();
    this.initializeTemplates();
    this.setupDefaultPreferences();
  }

  /**
   * Initialize notification channels
   */
  initializeNotificationChannels() {
    this.notificationChannels.set('telegram', {
      name: 'Telegram',
      type: 'messaging',
      enabled: true,
      priority: 'high',
      capabilities: ['text', 'markdown', 'buttons', 'files'],
      rateLimit: { max: 30, window: 60000 }, // 30 messages per minute
      config: {
        botToken: process.env.TELEGRAM_BOT_TOKEN,
        channelId: process.env.TELEGRAM_CHANNEL_ID,
      },
    });

    this.notificationChannels.set('email', {
      name: 'Email',
      type: 'email',
      enabled: false,
      priority: 'medium',
      capabilities: ['html', 'text', 'attachments'],
      rateLimit: { max: 10, window: 3600000 }, // 10 emails per hour
      config: {
        smtp: process.env.SMTP_SERVER,
        from: process.env.EMAIL_FROM,
      },
    });

    this.notificationChannels.set('webhook', {
      name: 'Webhook',
      type: 'http',
      enabled: false,
      priority: 'low',
      capabilities: ['json', 'xml'],
      rateLimit: { max: 100, window: 60000 }, // 100 requests per minute
      config: {
        url: process.env.WEBHOOK_URL,
        headers: { 'Content-Type': 'application/json' },
      },
    });

    this.notificationChannels.set('console', {
      name: 'Console',
      type: 'logging',
      enabled: true,
      priority: 'low',
      capabilities: ['text', 'structured'],
      rateLimit: { max: 1000, window: 60000 }, // 1000 logs per minute
      config: {},
    });
  }

  /**
   * Initialize notification templates
   */
  initializeTemplates() {
    this.notificationTemplates.set('system_alert', {
      name: 'System Alert',
      channels: ['telegram', 'console'],
      template: {
        telegram: `🚨 **System Alert**\n\n**Type**: {{type}}\n**Severity**: {{severity}}\n**Message**: {{message}}\n**Time**: {{timestamp}}\n**Component**: {{component}}`,
        console: `[{{timestamp}}] {{severity.toUpperCase()}} {{type}}: {{message}}`,
        email: `<h2>System Alert</h2><p><strong>Type:</strong> {{type}}</p><p><strong>Severity:</strong> {{severity}}</p><p><strong>Message:</strong> {{message}}</p><p><strong>Time:</strong> {{timestamp}}</p>`,
      },
      priority: 'high',
    });

    this.notificationTemplates.set('agent_status', {
      name: 'Agent Status',
      channels: ['telegram'],
      template: {
        telegram: `🤖 **Agent Status Update**\n\n**Agent**: {{agentName}}\n**Status**: {{status}}\n**Performance**: {{performance}}\n**Last Activity**: {{lastActivity}}`,
        console: `[{{timestamp}}] Agent {{agentName}} status: {{status}}`,
      },
      priority: 'medium',
    });

    this.notificationTemplates.set('performance_report', {
      name: 'Performance Report',
      channels: ['telegram', 'email'],
      template: {
        telegram: `📊 **Performance Report**\n\n**CPU**: {{cpu}}%\n**Memory**: {{memory}}%\n**Response Time**: {{responseTime}}ms\n**Health Score**: {{healthScore}}/100`,
        email: `<h2>Performance Report</h2><p><strong>CPU:</strong> {{cpu}}%</p><p><strong>Memory:</strong> {{memory}}%</p><p><strong>Response Time:</strong> {{responseTime}}ms</p><p><strong>Health Score:</strong> {{healthScore}}/100</p>`,
      },
      priority: 'medium',
    });

    this.notificationTemplates.set('user_activity', {
      name: 'User Activity',
      channels: ['telegram'],
      template: {
        telegram: `👤 **User Activity**\n\n**User**: {{username}}\n**Action**: {{action}}\n**Agent**: {{agentName}}\n**Time**: {{timestamp}}`,
        console: `[{{timestamp}}] User {{username}} performed {{action}} with {{agentName}}`,
      },
      priority: 'low',
    });

    this.notificationTemplates.set('learning_insight', {
      name: 'Learning Insight',
      channels: ['telegram'],
      template: {
        telegram: `🧠 **Learning Insight**\n\n**Pattern**: {{pattern}}\n**Confidence**: {{confidence}}%\n**Impact**: {{impact}}\n**Recommendation**: {{recommendation}}`,
        console: `[{{timestamp}}] Learning insight: {{pattern}} ({{confidence}}% confidence)`,
      },
      priority: 'low',
    });
  }

  /**
   * Setup default user preferences
   */
  setupDefaultPreferences() {
    this.defaultPreferences = {
      notifications: {
        enabled: true,
        channels: ['telegram'],
        frequency: 'realtime',
        quietHours: {
          enabled: false,
          start: '22:00',
          end: '08:00',
          timezone: 'UTC',
        },
        priorities: {
          critical: true,
          high: true,
          medium: true,
          low: false,
        },
        categories: {
          system_alerts: true,
          agent_status: true,
          performance_reports: true,
          user_activity: false,
          learning_insights: true,
          errors: true,
          warnings: true,
          info: false,
        },
      },
      formatting: {
        language: 'en',
        timezone: 'UTC',
        dateFormat: 'YYYY-MM-DD HH:mm:ss',
        includeMetadata: true,
        includeTimestamps: true,
      },
      rateLimiting: {
        enabled: true,
        maxPerMinute: 10,
        maxPerHour: 50,
        burstLimit: 5,
      },
    };
  }

  /**
   * Set user preferences
   */
  setUserPreferences(userId, preferences) {
    const userPrefs = {
      ...this.defaultPreferences,
      ...preferences,
      updatedAt: new Date(),
    };

    this.userPreferences.set(userId, userPrefs);
    console.log(`🔔 Preferences updated for user ${userId}`);
    return userPrefs;
  }

  /**
   * Get user preferences
   */
  getUserPreferences(userId) {
    if (!this.userPreferences.has(userId)) {
      this.userPreferences.set(userId, { ...this.defaultPreferences });
    }

    return this.userPreferences.get(userId);
  }

  /**
   * Send notification
   */
  async sendNotification(userId, notification) {
    try {
      const userPrefs = this.getUserPreferences(userId);

      // Check if notifications are enabled
      if (!userPrefs.notifications.enabled) {
        console.log(`🔔 Notifications disabled for user ${userId}`);
        return { success: false, reason: 'notifications_disabled' };
      }

      // Check quiet hours
      if (this.isQuietHours(userPrefs)) {
        console.log(`🔔 Quiet hours active for user ${userId}`);
        return { success: false, reason: 'quiet_hours' };
      }

      // Check priority filter
      if (!userPrefs.notifications.priorities[notification.priority]) {
        console.log(
          `🔔 Priority ${notification.priority} filtered for user ${userId}`
        );
        return { success: false, reason: 'priority_filtered' };
      }

      // Check category filter
      if (!userPrefs.notifications.categories[notification.category]) {
        console.log(
          `🔔 Category ${notification.category} filtered for user ${userId}`
        );
        return { success: false, reason: 'category_filtered' };
      }

      // Check rate limiting
      if (!this.checkRateLimit(userId, notification)) {
        console.log(`🔔 Rate limit exceeded for user ${userId}`);
        return { success: false, reason: 'rate_limited' };
      }

      // Process notification through enabled channels
      const results = [];
      for (const channelName of userPrefs.notifications.channels) {
        const channel = this.notificationChannels.get(channelName);
        if (channel && channel.enabled) {
          const result = await this.sendToChannel(
            channel,
            userId,
            notification,
            userPrefs
          );
          results.push({ channel: channelName, ...result });
        }
      }

      // Log notification
      this.logNotification(userId, notification, results);

      return {
        success: true,
        results,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error('❌ Error sending notification:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send to specific channel
   */
  async sendToChannel(channel, userId, notification, userPrefs) {
    try {
      const template = this.notificationTemplates.get(notification.template);
      if (!template) {
        throw new Error(`Template ${notification.template} not found`);
      }

      const channelTemplate = template.template[channel.type];
      if (!channelTemplate) {
        throw new Error(`Template not available for channel ${channel.type}`);
      }

      // Format message
      const message = this.formatMessage(
        channelTemplate,
        notification.data,
        userPrefs
      );

      // Send based on channel type
      switch (channel.type) {
        case 'messaging':
          return await this.sendTelegramMessage(userId, message, notification);
        case 'email':
          return await this.sendEmail(userId, message, notification);
        case 'http':
          return await this.sendWebhook(userId, message, notification);
        case 'logging':
          return await this.sendConsoleLog(message, notification);
        default:
          throw new Error(`Unknown channel type: ${channel.type}`);
      }
    } catch (error) {
      console.error(`❌ Error sending to channel ${channel.name}:`, error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send Telegram message
   */
  async sendTelegramMessage(userId, message, notification) {
    // This would integrate with your Telegram bot
    console.log(`📱 Telegram to ${userId}: ${message}`);
    return { success: true, channel: 'telegram' };
  }

  /**
   * Send email
   */
  async sendEmail(userId, message, notification) {
    // This would integrate with your email service
    console.log(`📧 Email to ${userId}: ${message}`);
    return { success: true, channel: 'email' };
  }

  /**
   * Send webhook
   */
  async sendWebhook(userId, message, notification) {
    // This would send HTTP request to webhook URL
    console.log(`🔗 Webhook to ${userId}: ${message}`);
    return { success: true, channel: 'webhook' };
  }

  /**
   * Send console log
   */
  async sendConsoleLog(message, notification) {
    console.log(`📝 Console: ${message}`);
    return { success: true, channel: 'console' };
  }

  /**
   * Format message with template
   */
  formatMessage(template, data, userPrefs) {
    let message = template;

    // Replace placeholders
    for (const [key, value] of Object.entries(data)) {
      const placeholder = `{{${key}}}`;
      message = message.replace(new RegExp(placeholder, 'g'), value);
    }

    // Add timestamp if enabled
    if (userPrefs.formatting.includeTimestamps) {
      const timestamp = new Date().toLocaleString();
      message = message.replace('{{timestamp}}', timestamp);
    }

    return message;
  }

  /**
   * Check if in quiet hours
   */
  isQuietHours(userPrefs) {
    if (!userPrefs.notifications.quietHours.enabled) {
      return false;
    }

    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
    const { start, end } = userPrefs.notifications.quietHours;

    // Simple time comparison (would need timezone handling in production)
    return currentTime >= start || currentTime <= end;
  }

  /**
   * Check rate limiting
   */
  checkRateLimit(userId, notification) {
    const userPrefs = this.getUserPreferences(userId);
    if (!userPrefs.rateLimiting.enabled) {
      return true;
    }

    const now = Date.now();
    const userLimits = this.rateLimits.get(userId) || {
      minute: { count: 0, resetTime: now + 60000 },
      hour: { count: 0, resetTime: now + 3600000 },
    };

    // Reset counters if needed
    if (now > userLimits.minute.resetTime) {
      userLimits.minute = { count: 0, resetTime: now + 60000 };
    }
    if (now > userLimits.hour.resetTime) {
      userLimits.hour = { count: 0, resetTime: now + 3600000 };
    }

    // Check limits
    if (userLimits.minute.count >= userPrefs.rateLimiting.maxPerMinute) {
      return false;
    }
    if (userLimits.hour.count >= userPrefs.rateLimiting.maxPerHour) {
      return false;
    }

    // Increment counters
    userLimits.minute.count++;
    userLimits.hour.count++;
    this.rateLimits.set(userId, userLimits);

    return true;
  }

  /**
   * Log notification
   */
  logNotification(userId, notification, results) {
    if (!this.notificationHistory.has(userId)) {
      this.notificationHistory.set(userId, []);
    }

    const logEntry = {
      notification,
      results,
      timestamp: new Date(),
      success: results.some(r => r.success),
    };

    this.notificationHistory.get(userId).push(logEntry);

    // Keep only last 100 notifications per user
    const history = this.notificationHistory.get(userId);
    if (history.length > 100) {
      history.shift();
    }
  }

  /**
   * Schedule notification
   */
  scheduleNotification(userId, notification, delayMs) {
    const notificationId = `scheduled_${Date.now()}_${Math.random()}`;

    const timeoutId = setTimeout(async () => {
      await this.sendNotification(userId, notification);
      this.scheduledNotifications.delete(notificationId);
    }, delayMs);

    this.scheduledNotifications.set(notificationId, {
      userId,
      notification,
      scheduledAt: new Date(),
      executeAt: new Date(Date.now() + delayMs),
      timeoutId,
    });

    return notificationId;
  }

  /**
   * Cancel scheduled notification
   */
  cancelScheduledNotification(notificationId) {
    const scheduled = this.scheduledNotifications.get(notificationId);
    if (scheduled) {
      clearTimeout(scheduled.timeoutId);
      this.scheduledNotifications.delete(notificationId);
      return true;
    }
    return false;
  }

  /**
   * Get notification history
   */
  getNotificationHistory(userId, limit = 50) {
    const history = this.notificationHistory.get(userId) || [];
    return history.slice(-limit);
  }

  /**
   * Get notification statistics
   */
  getNotificationStats(userId = null) {
    const histories = userId
      ? [this.notificationHistory.get(userId) || []]
      : Array.from(this.notificationHistory.values());

    const allNotifications = histories.flat();

    const stats = {
      total: allNotifications.length,
      successful: allNotifications.filter(n => n.success).length,
      failed: allNotifications.filter(n => !n.success).length,
      byPriority: {},
      byCategory: {},
      byChannel: {},
      averagePerDay: 0,
    };

    // Calculate stats by priority, category, and channel
    allNotifications.forEach(notification => {
      const { priority, category } = notification.notification;

      stats.byPriority[priority] = (stats.byPriority[priority] || 0) + 1;
      stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;

      notification.results.forEach(result => {
        stats.byChannel[result.channel] =
          (stats.byChannel[result.channel] || 0) + 1;
      });
    });

    return stats;
  }

  /**
   * Update notification settings
   */
  updateNotificationSettings(userId, settings) {
    const userPrefs = this.getUserPreferences(userId);
    userPrefs.notifications = { ...userPrefs.notifications, ...settings };
    this.userPreferences.set(userId, userPrefs);
    return userPrefs;
  }

  /**
   * Test notification
   */
  async testNotification(userId, channel = 'telegram') {
    const testNotification = {
      template: 'system_alert',
      priority: 'medium',
      category: 'system_alerts',
      data: {
        type: 'Test Notification',
        severity: 'info',
        message: 'This is a test notification to verify your settings',
        component: 'Notification System',
      },
    };

    return await this.sendNotification(userId, testNotification);
  }

  /**
   * Get available channels
   */
  getAvailableChannels() {
    return Array.from(this.notificationChannels.values())
      .filter(channel => channel.enabled)
      .map(channel => ({
        id: channel.name.toLowerCase(),
        name: channel.name,
        type: channel.type,
        capabilities: channel.capabilities,
      }));
  }

  /**
   * Get notification templates
   */
  getNotificationTemplates() {
    return Array.from(this.notificationTemplates.entries()).map(
      ([id, template]) => ({
        id,
        name: template.name,
        channels: template.channels,
        priority: template.priority,
      })
    );
  }
}

module.exports = AdvancedNotificationSystem;
