/**
 * 📱 Quantum Telegram Bot Module
 * 
 * Handles all Telegram bot functionality for the Quantum Autopilot System
 */

const TelegramBot = require('node-telegram-bot-api');
const { config } = require('dotenv');
const path = require('path');

// Load environment variables
config({ path: path.join(__dirname, '../../firebase.env') });

class QuantumTelegramBot {
  constructor() {
    this.name = 'Quantum Telegram Bot';
    this.version = '1.0.0';
    this.bot = null;
    this.isInitialized = false;
    this.channelId = process.env.TELEGRAM_CHANNEL_ID;
    this.debuggerChatId = process.env.DEBUGGER_CHAT_ID;
    
    console.log(`📱 ${this.name} v${this.version} initialized`);
  }

  /**
   * Initialize Telegram Bot with enhanced configuration
   */
  async initialize() {
    try {
      if (!process.env.TELEGRAM_BOT_TOKEN) {
        console.warn('⚠️ TELEGRAM_BOT_TOKEN not found, Telegram integration disabled');
        return false;
      }

      this.bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
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

      // Setup enhanced error handlers
      this.bot.on('polling_error', (error) => {
        console.error('📱 Telegram polling error:', error.message);
        setTimeout(() => {
          if (this.bot) {
            this.bot.stopPolling().then(() => {
              console.log('🔄 Attempting Telegram reconnection...');
              this.initialize();
            });
          }
        }, 5000);
      });

      this.bot.on('error', (error) => {
        console.error('📱 Telegram bot error:', error.message);
      });

      // Setup callback query handlers for interactive buttons
      this.bot.on('callback_query', (callbackQuery) => {
        this.handleCallbackQuery(callbackQuery);
      });

      // Setup command handlers
      this.bot.onText(/\/status/, (msg) => {
        this.handleStatusCommand(msg);
      });

      this.bot.onText(/\/stats/, (msg) => {
        this.handleStatsCommand(msg);
      });

      this.bot.onText(/\/recommendations/, (msg) => {
        this.handleRecommendationsCommand(msg);
      });

      const me = await this.bot.getMe();
      console.log(`✅ Telegram Bot connected: @${me.username} (${me.first_name})`);

      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Telegram Bot:', error.message);
      this.bot = null;
      return false;
    }
  }

  /**
   * Send session start notification
   */
  async sendSessionStart(session) {
    if (!this.isInitialized || !this.channelId) return;

    try {
      const message = `🚀 *New Development Session Started*\n\n` +
        `📋 Session ID: \`${session.id}\`\n` +
        `⏰ Start Time: ${new Date(session.startTime).toLocaleString()}\n` +
        `🎯 Configuration: ${JSON.stringify(session.config, null, 2)}`;

      await this.bot.sendMessage(this.channelId, message, {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              { text: '📊 View Status', callback_data: 'status' },
              { text: '📈 View Stats', callback_data: 'stats' }
            ]
          ]
        }
      });
    } catch (error) {
      console.error('❌ Error sending session start notification:', error.message);
    }
  }

  /**
   * Send task update notification
   */
  async sendTaskUpdate(task, result) {
    if (!this.isInitialized || !this.channelId) return;

    try {
      const status = result.success ? '✅' : '❌';
      const message = `${status} *Task Update*\n\n` +
        `📋 Task: ${task.type}\n` +
        `📝 Description: ${task.description}\n` +
        `⏱️ Duration: ${result.duration || 'N/A'}ms\n` +
        `📊 Status: ${result.success ? 'Success' : 'Failed'}`;

      await this.bot.sendMessage(this.channelId, message, {
        parse_mode: 'Markdown'
      });
    } catch (error) {
      console.error('❌ Error sending task update:', error.message);
    }
  }

  /**
   * Send error notification
   */
  async sendErrorNotification(task, error) {
    if (!this.isInitialized || !this.debuggerChatId) return;

    try {
      const message = `🚨 *Error Detected*\n\n` +
        `📋 Task: ${task.type}\n` +
        `📝 Description: ${task.description}\n` +
        `❌ Error: \`${error.message}\`\n` +
        `📍 Stack: \`${error.stack?.substring(0, 500)}...\``;

      await this.bot.sendMessage(this.debuggerChatId, message, {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              { text: '🔧 Auto-Fix', callback_data: `fix_${task.id}` },
              { text: '📊 Analyze', callback_data: `analyze_${task.id}` }
            ]
          ]
        }
      });
    } catch (error) {
      console.error('❌ Error sending error notification:', error.message);
    }
  }

  /**
   * Send session end notification
   */
  async sendSessionEnd(session, report) {
    if (!this.isInitialized || !this.channelId) return;

    try {
      const message = `🏁 *Session Completed*\n\n` +
        `📋 Session ID: \`${session.id}\`\n` +
        `⏱️ Duration: ${session.duration}ms\n` +
        `📊 Tasks Completed: ${session.metrics.tasksCompleted}\n` +
        `🐛 Errors Detected: ${session.metrics.errorsDetected}\n` +
        `🔧 Fixes Applied: ${session.metrics.fixesApplied}\n` +
        `📈 Efficiency: ${(report.efficiency * 100).toFixed(1)}%`;

      await this.bot.sendMessage(this.channelId, message, {
        parse_mode: 'Markdown'
      });
    } catch (error) {
      console.error('❌ Error sending session end notification:', error.message);
    }
  }

  /**
   * Handle callback queries from inline keyboards
   */
  async handleCallbackQuery(callbackQuery) {
    try {
      const data = callbackQuery.data;
      const chatId = callbackQuery.message.chat.id;

      if (data === 'status') {
        await this.handleStatusCallback(chatId);
      } else if (data === 'stats') {
        await this.handleStatsCallback(chatId);
      } else if (data.startsWith('fix_')) {
        await this.handleFixCallback(chatId, data);
      } else if (data.startsWith('analyze_')) {
        await this.handleAnalyzeCallback(chatId, data);
      }

      // Answer the callback query
      await this.bot.answerCallbackQuery(callbackQuery.id);
    } catch (error) {
      console.error('❌ Error handling callback query:', error.message);
    }
  }

  /**
   * Handle status command
   */
  async handleStatusCommand(msg) {
    try {
      const message = `📊 *System Status*\n\n` +
        `🤖 Bot: ${this.isInitialized ? 'Active' : 'Inactive'}\n` +
        `📱 Channel: ${this.channelId || 'Not configured'}\n` +
        `🐛 Debug Chat: ${this.debuggerChatId || 'Not configured'}\n` +
        `⏰ Uptime: ${process.uptime()}s`;

      await this.bot.sendMessage(msg.chat.id, message, {
        parse_mode: 'Markdown'
      });
    } catch (error) {
      console.error('❌ Error handling status command:', error.message);
    }
  }

  /**
   * Handle stats command
   */
  async handleStatsCommand(msg) {
    try {
      const message = `📈 *System Statistics*\n\n` +
        `💾 Memory Usage: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB\n` +
        `⏰ Process Uptime: ${process.uptime()}s\n` +
        `🔄 Node Version: ${process.version}`;

      await this.bot.sendMessage(msg.chat.id, message, {
        parse_mode: 'Markdown'
      });
    } catch (error) {
      console.error('❌ Error handling stats command:', error.message);
    }
  }

  /**
   * Handle recommendations command
   */
  async handleRecommendationsCommand(msg) {
    try {
      const message = `💡 *System Recommendations*\n\n` +
        `🔧 Regular maintenance recommended\n` +
        `📊 Monitor performance metrics\n` +
        `🔄 Update dependencies regularly\n` +
        `🛡️ Review security settings`;

      await this.bot.sendMessage(msg.chat.id, message, {
        parse_mode: 'Markdown'
      });
    } catch (error) {
      console.error('❌ Error handling recommendations command:', error.message);
    }
  }

  /**
   * Handle status callback
   */
  async handleStatusCallback(chatId) {
    const message = `📊 *Current Status*\n\n` +
      `🤖 Bot: Active\n` +
      `📱 Connected: Yes\n` +
      `⏰ Last Update: ${new Date().toLocaleString()}`;

    await this.bot.sendMessage(chatId, message, {
      parse_mode: 'Markdown'
    });
  }

  /**
   * Handle stats callback
   */
  async handleStatsCallback(chatId) {
    const message = `📈 *Live Statistics*\n\n` +
      `💾 Memory: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB\n` +
      `⏰ Uptime: ${process.uptime()}s\n` +
      `🔄 CPU: ${process.cpuUsage().user / 1000000}s`;

    await this.bot.sendMessage(chatId, message, {
      parse_mode: 'Markdown'
    });
  }

  /**
   * Handle fix callback
   */
  async handleFixCallback(chatId, data) {
    const taskId = data.replace('fix_', '');
    const message = `🔧 *Auto-Fix Initiated*\n\n` +
      `📋 Task ID: ${taskId}\n` +
      `⏰ Started: ${new Date().toLocaleString()}\n` +
      `🔄 Status: Processing...`;

    await this.bot.sendMessage(chatId, message, {
      parse_mode: 'Markdown'
    });
  }

  /**
   * Handle analyze callback
   */
  async handleAnalyzeCallback(chatId, data) {
    const taskId = data.replace('analyze_', '');
    const message = `📊 *Analysis Initiated*\n\n` +
      `📋 Task ID: ${taskId}\n` +
      `⏰ Started: ${new Date().toLocaleString()}\n` +
      `🔍 Status: Analyzing...`;

    await this.bot.sendMessage(chatId, message, {
      parse_mode: 'Markdown'
    });
  }

  /**
   * Shutdown the Telegram bot
   */
  async shutdown() {
    try {
      if (this.bot) {
        await this.bot.stopPolling();
        this.bot = null;
      }
      this.isInitialized = false;
      console.log('✅ Telegram Bot shutdown completed');
    } catch (error) {
      console.error('❌ Error shutting down Telegram Bot:', error.message);
    }
  }
}

module.exports = QuantumTelegramBot;
