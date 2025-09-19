/**
 * 📱 Centralized Telegram Bot Manager
 *
 * Prevents multiple bot instances and manages single connection
 */

const TelegramBot = require('node-telegram-bot-api');

class TelegramBotManager {
  constructor() {
    this.bot = null;
    this.isInitialized = false;
    this.instance = null;
  }

  // Singleton pattern to ensure only one instance
  static getInstance() {
    if (!TelegramBotManager.instance) {
      TelegramBotManager.instance = new TelegramBotManager();
    }
    return TelegramBotManager.instance;
  }

  // Initialize bot only once
  async initialize(token) {
    if (this.isInitialized && this.bot) {
      console.log(
        '📱 Telegram Bot already initialized, reusing existing instance'
      );
      return this.bot;
    }

    if (!token || token === 'your_telegram_bot_token_here') {
      console.warn(
        '⚠️ TELEGRAM_BOT_TOKEN not configured, Telegram integration disabled'
      );
      return null;
    }

    try {
      // Stop any existing polling
      if (this.bot) {
        await this.bot.stopPolling();
      }

      this.bot = new TelegramBot(token, {
        polling: {
          interval: 1000,
          autoStart: true,
          params: {
            timeout: 10,
          },
        },
        request: {
          agentOptions: {
            keepAlive: true,
            family: 4,
          },
        },
      });

      // Setup error handlers
      this.bot.on('polling_error', error => {
        console.error('📱 Telegram polling error:', error.message);
        // Don't auto-reconnect to prevent conflicts
      });

      this.bot.on('error', error => {
        console.error('📱 Telegram bot error:', error.message);
      });

      // Test connection
      const me = await this.bot.getMe();
      console.log(
        `✅ Telegram Bot connected: @${me.username} (${me.first_name})`
      );

      this.isInitialized = true;
      return this.bot;
    } catch (error) {
      console.error('❌ Failed to initialize Telegram Bot:', error.message);
      this.bot = null;
      this.isInitialized = false;
      return null;
    }
  }

  // Get bot instance
  getBot() {
    return this.bot;
  }

  // Stop bot
  async stop() {
    if (this.bot) {
      await this.bot.stopPolling();
      this.bot = null;
      this.isInitialized = false;
      console.log('📱 Telegram Bot stopped');
    }
  }

  // Send message safely
  async sendMessage(chatId, message, options = {}) {
    if (!this.bot || !this.isInitialized) {
      console.warn('📱 Telegram Bot not initialized, message not sent');
      return false;
    }

    try {
      await this.bot.sendMessage(chatId, message, options);
      return true;
    } catch (error) {
      console.error('📱 Failed to send Telegram message:', error.message);
      return false;
    }
  }
}

module.exports = TelegramBotManager;
