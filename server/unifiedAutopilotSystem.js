/**
 * 🔧 AIOS Agent Consolidation Fix
 *
 * This file provides a unified agent system to replace the duplicate
 * agent classes found in the codebase analysis.
 */

const TelegramBotManager = require('./telegramBotManager.js');
const { config } = require('dotenv');
const path = require('path');

// Load environment variables
config({ path: path.join(__dirname, '../firebase.env') });

/**
 * 🎯 Unified Error Processor
 * Centralizes all error processing logic
 */
class ErrorProcessor {
  constructor() {
    this.errorHistory = new Map();
    this.errorPatterns = new Map();
    this.rateLimitTracker = new Map();
  }

  /**
   * Generate consistent error keys across the system
   */
  generateErrorKey(errorData) {
    const message = errorData.message.toLowerCase();
    const file = errorData.file.toLowerCase();

    // Extract key patterns for consistent categorization
    if (message.includes('firebase') && message.includes('permission')) {
      return 'firebase-permission-error';
    }
    if (message.includes('network') && message.includes('error')) {
      return 'network-error';
    }
    if (message.includes('api') && message.includes('key')) {
      return 'api-key-error';
    }
    if (message.includes('socket') && message.includes('connection')) {
      return 'socket-connection-error';
    }

    return `${file}-${message.substring(0, 50)}`.replace(/[^a-z0-9-]/g, '-');
  }

  /**
   * Categorize errors consistently
   */
  categorizeError(message) {
    const msg = message.toLowerCase();

    if (msg.includes('firebase') && msg.includes('permission')) {
      return 'firebase-permission';
    }
    if (msg.includes('network') || msg.includes('connection')) {
      return 'network-connection';
    }
    if (msg.includes('api') && msg.includes('key')) {
      return 'api-key-config';
    }
    if (msg.includes('socket') && msg.includes('connection')) {
      return 'socket-connection';
    }
    if (msg.includes('syntax') || msg.includes('parse')) {
      return 'syntax-error';
    }
    if (msg.includes('import') || msg.includes('module')) {
      return 'module-import';
    }
    if (msg.includes('undefined') || msg.includes('null')) {
      return 'null-reference';
    }

    return 'unknown';
  }

  /**
   * Determine error priority consistently
   */
  determinePriority(errorData) {
    const errorKey = this.generateErrorKey(errorData);
    const errorCount = this.errorHistory.get(errorKey)?.count || 1;

    if (errorCount >= 10) return 'CRITICAL';
    if (errorCount >= 5) return 'HIGH';
    if (errorCount >= 2) return 'MEDIUM';
    return 'LOW';
  }

  /**
   * Check if error should be processed (rate limiting)
   */
  shouldProcessError(errorData) {
    const errorKey = this.generateErrorKey(errorData);
    const now = Date.now();
    const lastProcessed = this.rateLimitTracker.get(errorKey) || 0;

    // Rate limit: same error within 30 seconds
    if (now - lastProcessed < 30000) {
      return false;
    }

    // Update tracker
    this.rateLimitTracker.set(errorKey, now);
    return true;
  }

  /**
   * Process error with unified logic
   */
  async processError(errorData) {
    if (!this.shouldProcessError(errorData)) {
      return { processed: false, reason: 'rate_limited' };
    }

    const errorKey = this.generateErrorKey(errorData);
    const category = this.categorizeError(errorData.message);
    const priority = this.determinePriority(errorData);

    // Update error history
    this.errorHistory.set(errorKey, {
      ...errorData,
      count: (this.errorHistory.get(errorKey)?.count || 0) + 1,
      firstSeen:
        this.errorHistory.get(errorKey)?.firstSeen || new Date().toISOString(),
      lastSeen: new Date().toISOString(),
      category,
      priority,
    });

    return {
      processed: true,
      errorKey,
      category,
      priority,
      count: this.errorHistory.get(errorKey).count,
    };
  }
}

/**
 * 🎯 Unified Logger
 * Centralizes all logging functionality
 */
class Logger {
  constructor() {
    this.logLevels = {
      ERROR: 'error',
      WARN: 'warn',
      INFO: 'log',
      DEBUG: 'log',
    };
  }

  /**
   * Log with consistent formatting
   */
  log(level, message, context = {}) {
    const timestamp = new Date().toISOString();
    const logLevel = this.logLevels[level] || 'log';
    const formattedMessage = `[${timestamp}] ${level}: ${message}`;

    // Add context if provided
    if (Object.keys(context).length > 0) {
      console[logLevel](formattedMessage, context);
    } else {
      console[logLevel](formattedMessage);
    }
  }

  /**
   * Error logging with stack trace
   */
  error(message, error = null, context = {}) {
    this.log('ERROR', message, context);
    if (error && error.stack) {
      console.error('Stack trace:', error.stack);
    }
  }

  /**
   * Info logging
   */
  info(message, context = {}) {
    this.log('INFO', message, context);
  }

  /**
   * Debug logging
   */
  debug(message, context = {}) {
    this.log('DEBUG', message, context);
  }
}

/**
 * 🎯 Unified Autopilot System
 * Consolidates all agent functionality
 */
class UnifiedAutopilotSystem {
  constructor() {
    this.errorProcessor = new ErrorProcessor();
    this.logger = new Logger();
    this.isActive = false;
    this.telegramBot = null;
    this.channelId = process.env.TELEGRAM_CHANNEL_ID;
    this.debuggerChatId = process.env.DEBUGGER_CHAT_ID;

    this.logger.info('🚀 Unified Autopilot System initialized');
  }

  /**
   * Initialize the system
   */
  async initialize() {
    try {
      // Initialize Telegram bot using centralized manager
      const botManager = TelegramBotManager.getInstance();
      this.telegramBot = await botManager.initialize(
        process.env.TELEGRAM_BOT_TOKEN
      );

      // Setup error handlers
      this.setupErrorHandlers();

      // Setup Telegram handlers
      this.setupTelegramHandlers();

      this.isActive = true;
      this.logger.info('✅ Unified Autopilot System activated');
    } catch (error) {
      this.logger.error('Failed to initialize Unified Autopilot System', error);
      throw error;
    }
  }

  /**
   * Setup global error handlers
   */
  setupErrorHandlers() {
    // Uncaught exceptions
    process.on('uncaughtException', error => {
      this.handleError({
        type: 'uncaughtException',
        message: error.message,
        stack: error.stack,
        file: 'unknown',
        line: 'n/a',
        timestamp: new Date().toISOString(),
        severity: 'critical',
      });
    });

    // Unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      this.handleError({
        type: 'unhandledRejection',
        message: reason.toString(),
        stack: reason.stack || 'No stack trace',
        file: 'unknown',
        line: 'n/a',
        timestamp: new Date().toISOString(),
        severity: 'high',
      });
    });

    // Console error override with loop protection
    const originalError = console.error;
    console.error = (...args) => {
      originalError(...args);

      const errorMessage = args.join(' ');

      // Don't log Telegram errors back to avoid loops
      if (
        errorMessage.includes('ETELEGRAM') ||
        errorMessage.includes('Too Many Requests')
      ) {
        return;
      }

      this.handleError({
        type: 'console.error',
        message: errorMessage,
        stack: new Error().stack,
        file: 'console',
        line: 'n/a',
        timestamp: new Date().toISOString(),
        severity: 'medium',
      });
    };
  }

  /**
   * Setup Telegram bot handlers
   */
  setupTelegramHandlers() {
    if (!this.telegramBot) return;

    // Status command
    this.telegramBot.onText(/\/status/, async msg => {
      await this.sendStatusReport(msg.chat.id);
    });

    // Debug command
    this.telegramBot.onText(/\/debug (.+)/, async (msg, match) => {
      const command = match[1];
      await this.handleDebugCommand(msg.chat.id, command);
    });

    this.logger.info('📡 Telegram handlers setup complete');
  }

  /**
   * Main error handling method
   */
  async handleError(errorData) {
    try {
      const result = await this.errorProcessor.processError(errorData);

      if (!result.processed) {
        this.logger.debug(`Skipping error: ${result.reason}`, {
          error: errorData.message,
        });
        return;
      }

      // Log the error
      this.logger.info(
        `Error processed: ${result.category} (${result.priority})`,
        {
          errorKey: result.errorKey,
          count: result.count,
        }
      );

      // Send to Telegram if high priority
      if (result.priority === 'CRITICAL' || result.priority === 'HIGH') {
        await this.sendErrorToTelegram(errorData, result);
      }
    } catch (error) {
      this.logger.error('Error in handleError', error);
    }
  }

  /**
   * Send error to Telegram
   */
  async sendErrorToTelegram(errorData, result) {
    try {
      if (!this.telegramBot || !this.channelId) return;

      const message = `🚨 **${result.priority} Error** (${result.count}x)

**Type:** ${errorData.type}
**Category:** ${result.category}
**File:** ${errorData.file}
**Message:** ${errorData.message}
**Time:** ${new Date().toLocaleString()}

\`\`\`
${errorData.stack?.substring(0, 300) || 'No stack trace'}
\`\`\``;

      await this.telegramBot.sendMessage(this.channelId, message, {
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
      });
    } catch (error) {
      this.logger.error('Failed to send error to Telegram', error);
    }
  }

  /**
   * Send status report
   */
  async sendStatusReport(chatId) {
    try {
      const errorCount = this.errorProcessor.errorHistory.size;
      const message = `📊 **Unified Autopilot Status**

**System Status:** ${this.isActive ? '🟢 Active' : '🔴 Inactive'}
**Errors Tracked:** ${errorCount}
**Error Categories:** ${
        new Set(
          Array.from(this.errorProcessor.errorHistory.values()).map(
            e => e.category
          )
        ).size
      }

**Recent Errors:**
${
  Array.from(this.errorProcessor.errorHistory.entries())
    .slice(-3)
    .map(([key, error]) => `• ${key} (${error.count}x) - ${error.priority}`)
    .join('\n') || '• No recent errors'
}

**Available Commands:**
/status - System status
/debug [category] - Debug specific category`;

      await this.telegramBot.sendMessage(chatId, message, {
        parse_mode: 'Markdown',
      });
    } catch (error) {
      this.logger.error('Failed to send status report', error);
    }
  }

  /**
   * Handle debug commands
   */
  async handleDebugCommand(chatId, command) {
    try {
      const errorCount = this.errorProcessor.errorHistory.size;
      const categoryCount = new Set(
        Array.from(this.errorProcessor.errorHistory.values()).map(
          e => e.category
        )
      ).size;

      const message = `🔍 **Debug Info**

**Command:** ${command}
**Total Errors:** ${errorCount}
**Categories:** ${categoryCount}

**Error Distribution:**
${Array.from(this.errorProcessor.errorHistory.values())
  .reduce((acc, error) => {
    acc[error.category] = (acc[error.category] || 0) + 1;
    return acc;
  }, {})
  .map(([category, count]) => `• ${category}: ${count}`)
  .join('\n')}`;

      await this.telegramBot.sendMessage(chatId, message, {
        parse_mode: 'Markdown',
      });
    } catch (error) {
      this.logger.error('Failed to handle debug command', error);
    }
  }

  /**
   * Get system status
   */
  getStatus() {
    return {
      isActive: this.isActive,
      errorCount: this.errorProcessor.errorHistory.size,
      categories: new Set(
        Array.from(this.errorProcessor.errorHistory.values()).map(
          e => e.category
        )
      ).size,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
    };
  }
}

module.exports = {
  UnifiedAutopilotSystem,
  ErrorProcessor,
  Logger,
};
