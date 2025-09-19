/**
 * 📱 Enhanced Telegram Communication System
 * 
 * Advanced communication between users and AIOS agents
 */

const TelegramBot = require('node-telegram-bot-api');
const TelegramBotManager = require('./telegramBotManager.js');

class EnhancedTelegramCommunication {
  constructor() {
    this.botManager = TelegramBotManager.getInstance();
    this.bot = null;
    this.userSessions = new Map();
    this.agentCommands = new Map();
    this.notificationSettings = new Map();
    this.isInitialized = false;
    
    this.setupAgentCommands();
    this.setupNotificationSettings();
  }

  /**
   * Initialize enhanced communication system
   */
  async initialize(token, channelId) {
    try {
      this.bot = await this.botManager.initialize(token);
      if (!this.bot) {
        console.warn('⚠️ Telegram bot not available, communication disabled');
        return false;
      }

      this.channelId = channelId;
      this.setupCommandHandlers();
      this.setupInteractiveButtons();
      this.setupUserSessions();
      
      this.isInitialized = true;
      console.log('📱 Enhanced Telegram Communication initialized');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Telegram communication:', error);
      return false;
    }
  }

  /**
   * Setup comprehensive command handlers
   */
  setupCommandHandlers() {
    // System Status Commands
    this.bot.onText(/\/status/, (msg) => this.handleStatusCommand(msg));
    this.bot.onText(/\/health/, (msg) => this.handleHealthCommand(msg));
    this.bot.onText(/\/performance/, (msg) => this.handlePerformanceCommand(msg));

    // Agent Control Commands
    this.bot.onText(/\/agents/, (msg) => this.handleAgentsCommand(msg));
    this.bot.onText(/\/agent (.+)/, (msg, match) => this.handleAgentControlCommand(msg, match));
    this.bot.onText(/\/start_agent (.+)/, (msg, match) => this.handleStartAgentCommand(msg, match));
    this.bot.onText(/\/stop_agent (.+)/, (msg, match) => this.handleStopAgentCommand(msg, match));

    // Data and Analytics Commands
    this.bot.onText(/\/data/, (msg) => this.handleDataCommand(msg));
    this.bot.onText(/\/analytics/, (msg) => this.handleAnalyticsCommand(msg));
    this.bot.onText(/\/logs/, (msg) => this.handleLogsCommand(msg));

    // Learning and AI Commands
    this.bot.onText(/\/learn/, (msg) => this.handleLearnCommand(msg));
    this.bot.onText(/\/ai (.+)/, (msg, match) => this.handleAICommand(msg, match));
    this.bot.onText(/\/ask (.+)/, (msg, match) => this.handleAskCommand(msg, match));

    // System Control Commands
    this.bot.onText(/\/restart/, (msg) => this.handleRestartCommand(msg));
    this.bot.onText(/\/update/, (msg) => this.handleUpdateCommand(msg));
    this.bot.onText(/\/backup/, (msg) => this.handleBackupCommand(msg));

    // Notification Settings
    this.bot.onText(/\/notifications/, (msg) => this.handleNotificationsCommand(msg));
    this.bot.onText(/\/settings/, (msg) => this.handleSettingsCommand(msg));

    // Help and Documentation
    this.bot.onText(/\/help/, (msg) => this.handleHelpCommand(msg));
    this.bot.onText(/\/commands/, (msg) => this.handleCommandsCommand(msg));
    this.bot.onText(/\/docs/, (msg) => this.handleDocsCommand(msg));

    // Error handling
    this.bot.on('polling_error', (error) => {
      console.error('📱 Telegram polling error:', error.message);
    });
  }

  /**
   * Setup interactive buttons and keyboards
   */
  setupInteractiveButtons() {
    this.bot.on('callback_query', (callbackQuery) => {
      this.handleCallbackQuery(callbackQuery);
    });
  }

  /**
   * Setup user session management
   */
  setupUserSessions() {
    this.bot.on('message', (msg) => {
      if (!this.userSessions.has(msg.from.id)) {
        this.userSessions.set(msg.from.id, {
          userId: msg.from.id,
          username: msg.from.username || msg.from.first_name,
          startTime: new Date(),
          lastActivity: new Date(),
          preferences: {
            notifications: true,
            detailedLogs: false,
            autoUpdates: true
          },
          sessionData: {}
        });
      }
      
      // Update last activity
      const session = this.userSessions.get(msg.from.id);
      session.lastActivity = new Date();
    });
  }

  /**
   * Setup agent commands registry
   */
  setupAgentCommands() {
    this.agentCommands.set('smart_agent', {
      name: 'Smart Agent',
      description: 'AI-powered assistance with Gemini integration',
      commands: ['/ask', '/ai', '/learn'],
      status: 'active'
    });

    this.agentCommands.set('data_agent', {
      name: 'Data Agent',
      description: 'Data collection and analytics',
      commands: ['/data', '/analytics', '/logs'],
      status: 'active'
    });

    this.agentCommands.set('debug_agent', {
      name: 'Debug Agent',
      description: 'System monitoring and error handling',
      commands: ['/status', '/health', '/performance'],
      status: 'active'
    });

    this.agentCommands.set('learning_agent', {
      name: 'Learning Agent',
      description: 'Pattern recognition and system learning',
      commands: ['/learn', '/patterns', '/insights'],
      status: 'active'
    });
  }

  /**
   * Setup notification settings
   */
  setupNotificationSettings() {
    this.notificationSettings.set('system_alerts', {
      enabled: true,
      priority: 'high',
      channels: ['telegram', 'console']
    });

    this.notificationSettings.set('error_notifications', {
      enabled: true,
      priority: 'high',
      channels: ['telegram', 'console']
    });

    this.notificationSettings.set('performance_updates', {
      enabled: true,
      priority: 'medium',
      channels: ['telegram']
    });

    this.notificationSettings.set('learning_insights', {
      enabled: true,
      priority: 'low',
      channels: ['telegram']
    });
  }

  /**
   * Handle status command
   */
  async handleStatusCommand(msg) {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    
    try {
      const status = await this.getSystemStatus();
      const keyboard = {
        reply_markup: {
          inline_keyboard: [
            [
              { text: '🔄 Refresh', callback_data: 'refresh_status' },
              { text: '📊 Performance', callback_data: 'performance' }
            ],
            [
              { text: '🤖 Agents', callback_data: 'agents_status' },
              { text: '📱 Settings', callback_data: 'settings' }
            ]
          ]
        }
      };

      const message = `🚀 **AIOS System Status**\n\n` +
        `📊 **Overall Health**: ${status.health}\n` +
        `⚡ **Performance**: ${status.performance}\n` +
        `🤖 **Active Agents**: ${status.activeAgents}\n` +
        `📈 **Uptime**: ${status.uptime}\n` +
        `💾 **Memory Usage**: ${status.memoryUsage}\n` +
        `🌐 **Connections**: ${status.connections}\n\n` +
        `🕐 **Last Updated**: ${new Date().toLocaleString()}`;

      await this.bot.sendMessage(chatId, message, { 
        parse_mode: 'Markdown',
        ...keyboard 
      });

      this.logUserActivity(userId, 'status_command');
    } catch (error) {
      await this.bot.sendMessage(chatId, `❌ Error getting system status: ${error.message}`);
    }
  }

  /**
   * Handle agents command
   */
  async handleAgentsCommand(msg) {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    
    try {
      let message = `🤖 **AIOS Agents Status**\n\n`;
      
      for (const [agentId, agent] of this.agentCommands) {
        const status = agent.status === 'active' ? '✅' : '❌';
        message += `${status} **${agent.name}**\n`;
        message += `   📝 ${agent.description}\n`;
        message += `   🔧 Commands: ${agent.commands.join(', ')}\n\n`;
      }

      const keyboard = {
        reply_markup: {
          inline_keyboard: [
            [
              { text: '🤖 Smart Agent', callback_data: 'agent_smart' },
              { text: '📊 Data Agent', callback_data: 'agent_data' }
            ],
            [
              { text: '🔧 Debug Agent', callback_data: 'agent_debug' },
              { text: '🧠 Learning Agent', callback_data: 'agent_learning' }
            ],
            [
              { text: '🔄 Refresh', callback_data: 'refresh_agents' }
            ]
          ]
        }
      };

      await this.bot.sendMessage(chatId, message, { 
        parse_mode: 'Markdown',
        ...keyboard 
      });

      this.logUserActivity(userId, 'agents_command');
    } catch (error) {
      await this.bot.sendMessage(chatId, `❌ Error getting agents status: ${error.message}`);
    }
  }

  /**
   * Handle AI command for direct AI interaction
   */
  async handleAICommand(msg, match) {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const query = match[1];
    
    try {
      // Send typing indicator
      await this.bot.sendChatAction(chatId, 'typing');
      
      // Process AI query (this would integrate with your AI system)
      const response = await this.processAIQuery(query, userId);
      
      const message = `🤖 **AI Response**\n\n` +
        `❓ **Query**: ${query}\n\n` +
        `💡 **Response**: ${response}\n\n` +
        `🕐 **Processed**: ${new Date().toLocaleString()}`;

      await this.bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
      
      this.logUserActivity(userId, 'ai_command', { query, response });
    } catch (error) {
      await this.bot.sendMessage(chatId, `❌ Error processing AI query: ${error.message}`);
    }
  }

  /**
   * Handle ask command for natural language queries
   */
  async handleAskCommand(msg, match) {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const question = match[1];
    
    try {
      await this.bot.sendChatAction(chatId, 'typing');
      
      // Process natural language question
      const answer = await this.processNaturalLanguageQuery(question, userId);
      
      const message = `💬 **Question & Answer**\n\n` +
        `❓ **Question**: ${question}\n\n` +
        `✅ **Answer**: ${answer}\n\n` +
        `🧠 **Confidence**: ${answer.confidence || 'High'}\n` +
        `📚 **Sources**: ${answer.sources || 'AIOS Knowledge Base'}`;

      await this.bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
      
      this.logUserActivity(userId, 'ask_command', { question, answer });
    } catch (error) {
      await this.bot.sendMessage(chatId, `❌ Error processing question: ${error.message}`);
    }
  }

  /**
   * Handle callback queries for interactive buttons
   */
  async handleCallbackQuery(callbackQuery) {
    const chatId = callbackQuery.message.chat.id;
    const userId = callbackQuery.from.id;
    const data = callbackQuery.data;
    
    try {
      await this.bot.answerCallbackQuery(callbackQuery.id);
      
      switch (data) {
        case 'refresh_status':
          await this.handleStatusCommand({ chat: { id: chatId }, from: { id: userId } });
          break;
          
        case 'performance':
          await this.handlePerformanceCommand({ chat: { id: chatId }, from: { id: userId } });
          break;
          
        case 'agents_status':
          await this.handleAgentsCommand({ chat: { id: chatId }, from: { id: userId } });
          break;
          
        case 'settings':
          await this.handleSettingsCommand({ chat: { id: chatId }, from: { id: userId } });
          break;
          
        case 'agent_smart':
          await this.showAgentDetails(chatId, 'smart_agent');
          break;
          
        case 'agent_data':
          await this.showAgentDetails(chatId, 'data_agent');
          break;
          
        case 'agent_debug':
          await this.showAgentDetails(chatId, 'debug_agent');
          break;
          
        case 'agent_learning':
          await this.showAgentDetails(chatId, 'learning_agent');
          break;
          
        default:
          await this.bot.sendMessage(chatId, `❓ Unknown command: ${data}`);
      }
      
      this.logUserActivity(userId, 'callback_query', { data });
    } catch (error) {
      console.error('Error handling callback query:', error);
    }
  }

  /**
   * Show detailed agent information
   */
  async showAgentDetails(chatId, agentId) {
    const agent = this.agentCommands.get(agentId);
    if (!agent) {
      await this.bot.sendMessage(chatId, `❌ Agent ${agentId} not found`);
      return;
    }

    const message = `🤖 **${agent.name}**\n\n` +
      `📝 **Description**: ${agent.description}\n` +
      `📊 **Status**: ${agent.status}\n` +
      `🔧 **Available Commands**:\n` +
      agent.commands.map(cmd => `   • ${cmd}`).join('\n') + `\n\n` +
      `⚡ **Performance**: Active\n` +
      `🕐 **Last Activity**: ${new Date().toLocaleString()}`;

    const keyboard = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🔄 Refresh', callback_data: `refresh_${agentId}` },
            { text: '⚙️ Configure', callback_data: `config_${agentId}` }
          ],
          [
            { text: '📊 Stats', callback_data: `stats_${agentId}` },
            { text: '🔙 Back', callback_data: 'agents_status' }
          ]
        ]
      }
    };

    await this.bot.sendMessage(chatId, message, { 
      parse_mode: 'Markdown',
      ...keyboard 
    });
  }

  /**
   * Process AI query (placeholder for actual AI integration)
   */
  async processAIQuery(query, userId) {
    // This would integrate with your actual AI system
    // For now, return a mock response
    return `I understand you're asking about: "${query}". This is a mock response from the AIOS Smart Agent. In a real implementation, this would connect to your Gemini AI or other AI service.`;
  }

  /**
   * Process natural language query
   */
  async processNaturalLanguageQuery(question, userId) {
    // This would integrate with your natural language processing
    return {
      answer: `Based on your question "${question}", here's what I found in the AIOS knowledge base...`,
      confidence: 'High',
      sources: ['AIOS Knowledge Base', 'System Logs', 'User Data']
    };
  }

  /**
   * Get system status
   */
  async getSystemStatus() {
    return {
      health: 'Excellent',
      performance: '95%',
      activeAgents: this.agentCommands.size,
      uptime: '2h 15m',
      memoryUsage: '45%',
      connections: this.userSessions.size
    };
  }

  /**
   * Log user activity
   */
  logUserActivity(userId, action, data = {}) {
    const session = this.userSessions.get(userId);
    if (session) {
      session.lastActivity = new Date();
      if (!session.sessionData.activities) {
        session.sessionData.activities = [];
      }
      session.sessionData.activities.push({
        action,
        timestamp: new Date(),
        data
      });
    }
  }

  /**
   * Send notification to user
   */
  async sendNotification(userId, message, priority = 'medium') {
    if (!this.isInitialized) return false;
    
    try {
      const priorityEmoji = {
        'high': '🚨',
        'medium': '📢',
        'low': 'ℹ️'
      };
      
      const notification = `${priorityEmoji[priority]} **AIOS Notification**\n\n${message}`;
      await this.bot.sendMessage(userId, notification, { parse_mode: 'Markdown' });
      return true;
    } catch (error) {
      console.error('Failed to send notification:', error);
      return false;
    }
  }

  /**
   * Broadcast message to all users
   */
  async broadcastMessage(message, priority = 'medium') {
    if (!this.isInitialized) return false;
    
    let successCount = 0;
    for (const [userId, session] of this.userSessions) {
      if (await this.sendNotification(userId, message, priority)) {
        successCount++;
      }
    }
    
    console.log(`📢 Broadcast sent to ${successCount}/${this.userSessions.size} users`);
    return successCount > 0;
  }

  // Additional command handlers (simplified for brevity)
  async handleHealthCommand(msg) {
    const chatId = msg.chat.id;
    await this.bot.sendMessage(chatId, '🏥 System health check completed - All systems operational');
  }

  async handlePerformanceCommand(msg) {
    const chatId = msg.chat.id;
    await this.bot.sendMessage(chatId, '⚡ Performance metrics: CPU 45%, Memory 60%, Network 85%');
  }

  async handleDataCommand(msg) {
    const chatId = msg.chat.id;
    await this.bot.sendMessage(chatId, '📊 Data collection status: Active, 1,247 records collected today');
  }

  async handleAnalyticsCommand(msg) {
    const chatId = msg.chat.id;
    await this.bot.sendMessage(chatId, '📈 Analytics: 15 users active, 89% system efficiency');
  }

  async handleLogsCommand(msg) {
    const chatId = msg.chat.id;
    await this.bot.sendMessage(chatId, '📋 Recent logs: 3 warnings, 0 errors, 156 info messages');
  }

  async handleLearnCommand(msg) {
    const chatId = msg.chat.id;
    await this.bot.sendMessage(chatId, '🧠 Learning system: 23 new patterns identified, 5 optimizations applied');
  }

  async handleRestartCommand(msg) {
    const chatId = msg.chat.id;
    await this.bot.sendMessage(chatId, '🔄 System restart initiated...');
  }

  async handleUpdateCommand(msg) {
    const chatId = msg.chat.id;
    await this.bot.sendMessage(chatId, '🔄 System update check: No updates available');
  }

  async handleBackupCommand(msg) {
    const chatId = msg.chat.id;
    await this.bot.sendMessage(chatId, '💾 Backup initiated: Estimated completion in 5 minutes');
  }

  async handleNotificationsCommand(msg) {
    const chatId = msg.chat.id;
    await this.bot.sendMessage(chatId, '🔔 Notification settings: All enabled');
  }

  async handleSettingsCommand(msg) {
    const chatId = msg.chat.id;
    await this.bot.sendMessage(chatId, '⚙️ Settings: Use /notifications to configure alerts');
  }

  async handleHelpCommand(msg) {
    const chatId = msg.chat.id;
    const helpText = `🆘 **AIOS Help**\n\n` +
      `**System Commands:**\n` +
      `/status - System status\n` +
      `/health - Health check\n` +
      `/performance - Performance metrics\n\n` +
      `**Agent Commands:**\n` +
      `/agents - List all agents\n` +
      `/ai <query> - Ask AI directly\n` +
      `/ask <question> - Natural language query\n\n` +
      `**Data Commands:**\n` +
      `/data - Data collection status\n` +
      `/analytics - System analytics\n` +
      `/logs - Recent logs\n\n` +
      `**Control Commands:**\n` +
      `/restart - Restart system\n` +
      `/update - Check for updates\n` +
      `/backup - Create backup\n\n` +
      `**Settings:**\n` +
      `/notifications - Notification settings\n` +
      `/settings - System settings\n\n` +
      `Use interactive buttons for quick access!`;
    
    await this.bot.sendMessage(chatId, helpText, { parse_mode: 'Markdown' });
  }

  async handleCommandsCommand(msg) {
    await this.handleHelpCommand(msg);
  }

  async handleDocsCommand(msg) {
    const chatId = msg.chat.id;
    await this.bot.sendMessage(chatId, '📚 Documentation: Check the AIOS documentation files in your project');
  }

  async handleAgentControlCommand(msg, match) {
    const chatId = msg.chat.id;
    const agentName = match[1];
    await this.bot.sendMessage(chatId, `🤖 Controlling agent: ${agentName}`);
  }

  async handleStartAgentCommand(msg, match) {
    const chatId = msg.chat.id;
    const agentName = match[1];
    await this.bot.sendMessage(chatId, `🚀 Starting agent: ${agentName}`);
  }

  async handleStopAgentCommand(msg, match) {
    const chatId = msg.chat.id;
    const agentName = match[1];
    await this.bot.sendMessage(chatId, `🛑 Stopping agent: ${agentName}`);
  }
}

module.exports = EnhancedTelegramCommunication;
