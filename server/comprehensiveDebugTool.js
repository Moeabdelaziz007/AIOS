/**
 * Comprehensive Debug Tool with Telegram Integration
 * Connects Learning Loop to Telegram and Autopilot Systems
 */

const TelegramBotManager = require('./telegramBotManager.js');
const fs = require('fs').promises;
const path = require('path');

class ComprehensiveDebugTool {
  constructor() {
    this.name = 'Comprehensive Debug Tool';
    this.version = '2.0.0';
    this.isActive = false;
    this.telegramBot = null;
    this.learningLoop = null;
    this.unifiedAutopilot = null;
    this.quantumAutopilot = null;
    this.debugSessions = new Map();
    this.activeMonitors = new Map();
    this.debugHistory = [];

    // Debug categories
    this.debugCategories = {
      SYSTEM_HEALTH: 'system_health',
      ERROR_ANALYSIS: 'error_analysis',
      PERFORMANCE: 'performance',
      LEARNING_INSIGHTS: 'learning_insights',
      USER_BEHAVIOR: 'user_behavior',
      INTEGRATION_STATUS: 'integration_status',
    };

    // Telegram commands
    this.telegramCommands = {
      '/debug': 'Start comprehensive debugging session',
      '/debug-status': 'Get current debug status',
      '/debug-history': 'View debug history',
      '/debug-patterns': 'Analyze error patterns',
      '/debug-learning': 'Show learning insights',
      '/debug-monitor': 'Start real-time monitoring',
      '/debug-stop': 'Stop all monitoring',
      '/debug-report': 'Generate debug report',
      '/debug-optimize': 'Run system optimization',
      '/debug-help': 'Show all debug commands',
    };

    console.log(`🔧 ${this.name} v${this.version} initialized`);
  }

  /**
   * Initialize and connect to all systems
   */
  async initialize(telegramToken, chatId) {
    try {
      console.log('🚀 Initializing Comprehensive Debug Tool...');

      // Initialize Telegram bot
      await this.initializeTelegramBot(telegramToken, chatId);

      // Connect to Learning Loop
      await this.connectToLearningLoop();

      // Connect to Autopilot Systems
      await this.connectToAutopilotSystems();

      // Setup debug monitoring
      await this.setupDebugMonitoring();

      this.isActive = true;
      console.log('✅ Comprehensive Debug Tool initialized successfully');

      // Send initialization message to Telegram
      await this.sendTelegramMessage(
        '🔧 Comprehensive Debug Tool activated!\n\nAvailable commands:\n' +
          Object.entries(this.telegramCommands)
            .map(([cmd, desc]) => `${cmd} - ${desc}`)
            .join('\n')
      );

      return { status: 'active', connections: this.getConnectionStatus() };
    } catch (error) {
      console.error('❌ Failed to initialize Debug Tool:', error);
      throw error;
    }
  }

  /**
   * Initialize Telegram bot connection
   */
  async initializeTelegramBot(token, chatId) {
    try {
      // Use centralized bot manager
      const botManager = TelegramBotManager.getInstance();
      this.telegramBot = await botManager.initialize(token);
      this.chatId = chatId;

      // Setup command handlers
      this.setupTelegramHandlers();

      console.log('✅ Telegram bot connected via centralized manager');
    } catch (error) {
      console.error('❌ Failed to connect Telegram bot:', error);
      throw error;
    }
  }

  /**
   * Connect to Learning Loop system
   */
  async connectToLearningLoop() {
    try {
      const ComprehensiveLearningLoop = require('./comprehensiveLearningLoop.js');
      this.learningLoop = new ComprehensiveLearningLoop();
      await this.learningLoop.initialize();

      console.log('✅ Connected to Learning Loop');
    } catch (error) {
      console.warn('⚠️ Learning Loop not available:', error.message);
    }
  }

  /**
   * Connect to Autopilot Systems
   */
  async connectToAutopilotSystems() {
    try {
      // Connect to Unified Autopilot
      const { UnifiedAutopilotSystem } = require('./unifiedAutopilotSystem.js');
      this.unifiedAutopilot = new UnifiedAutopilotSystem();

      // Connect to Quantum Autopilot
      const QuantumAutopilot = require('./quantumAutopilot.js');
      this.quantumAutopilot = new QuantumAutopilot();

      console.log('✅ Connected to Autopilot Systems');
    } catch (error) {
      console.warn('⚠️ Some Autopilot systems not available:', error.message);
    }
  }

  /**
   * Setup Telegram command handlers
   */
  setupTelegramHandlers() {
    // Debug command handler
    this.telegramBot.onText(/\/debug/, async msg => {
      await this.handleDebugCommand(msg);
    });

    // Debug status handler
    this.telegramBot.onText(/\/debug-status/, async msg => {
      await this.handleDebugStatusCommand(msg);
    });

    // Debug patterns handler
    this.telegramBot.onText(/\/debug-patterns/, async msg => {
      await this.handleDebugPatternsCommand(msg);
    });

    // Debug learning handler
    this.telegramBot.onText(/\/debug-learning/, async msg => {
      await this.handleDebugLearningCommand(msg);
    });

    // Debug monitor handler
    this.telegramBot.onText(/\/debug-monitor/, async msg => {
      await this.handleDebugMonitorCommand(msg);
    });

    // Debug stop handler
    this.telegramBot.onText(/\/debug-stop/, async msg => {
      await this.handleDebugStopCommand(msg);
    });

    // Debug report handler
    this.telegramBot.onText(/\/debug-report/, async msg => {
      await this.handleDebugReportCommand(msg);
    });

    // Debug optimize handler
    this.telegramBot.onText(/\/debug-optimize/, async msg => {
      await this.handleDebugOptimizeCommand(msg);
    });

    // Debug help handler
    this.telegramBot.onText(/\/debug-help/, async msg => {
      await this.handleDebugHelpCommand(msg);
    });
  }

  /**
   * Handle /debug command
   */
  async handleDebugCommand(msg) {
    try {
      const sessionId = `debug_${Date.now()}`;
      const session = {
        id: sessionId,
        startTime: new Date(),
        user: msg.from.username || msg.from.first_name,
        status: 'active',
        findings: [],
        recommendations: [],
      };

      this.debugSessions.set(sessionId, session);

      // Start comprehensive debugging
      const debugResults = await this.runComprehensiveDebug();

      // Update session with results
      session.findings = debugResults.findings;
      session.recommendations = debugResults.recommendations;
      session.endTime = new Date();
      session.duration = session.endTime - session.startTime;

      // Send results to Telegram
      await this.sendDebugResults(session, debugResults);
    } catch (error) {
      await this.sendTelegramMessage(
        `❌ Debug command failed: ${error.message}`
      );
    }
  }

  /**
   * Run comprehensive debugging analysis
   */
  async runComprehensiveDebug() {
    const findings = [];
    const recommendations = [];

    // System Health Analysis
    const systemHealth = await this.analyzeSystemHealth();
    findings.push(...systemHealth.findings);
    recommendations.push(...systemHealth.recommendations);

    // Error Pattern Analysis
    const errorPatterns = await this.analyzeErrorPatterns();
    findings.push(...errorPatterns.findings);
    recommendations.push(...errorPatterns.recommendations);

    // Performance Analysis
    const performance = await this.analyzePerformance();
    findings.push(...performance.findings);
    recommendations.push(...performance.recommendations);

    // Learning Insights Analysis
    const learningInsights = await this.analyzeLearningInsights();
    findings.push(...learningInsights.findings);
    recommendations.push(...learningInsights.recommendations);

    return { findings, recommendations };
  }

  /**
   * Analyze system health
   */
  async analyzeSystemHealth() {
    const findings = [];
    const recommendations = [];

    // Check Learning Loop health
    if (this.learningLoop) {
      const learningStatus = this.learningLoop.getStatus();
      if (learningStatus.isActive) {
        findings.push({
          category: this.debugCategories.SYSTEM_HEALTH,
          type: 'success',
          message: `Learning Loop is active with ${learningStatus.dataPoints} data points`,
          severity: 'low',
        });
      } else {
        findings.push({
          category: this.debugCategories.SYSTEM_HEALTH,
          type: 'warning',
          message: 'Learning Loop is not active',
          severity: 'medium',
        });
        recommendations.push({
          action: 'activate_learning_loop',
          priority: 'high',
          description: 'Activate the Learning Loop system',
        });
      }
    }

    // Check Autopilot Systems health
    if (this.unifiedAutopilot) {
      const autopilotStatus = this.unifiedAutopilot.getStatus();
      findings.push({
        category: this.debugCategories.SYSTEM_HEALTH,
        type: 'info',
        message: `Unified Autopilot: ${autopilotStatus.status}`,
        severity: 'low',
      });
    }

    return { findings, recommendations };
  }

  /**
   * Analyze error patterns
   */
  async analyzeErrorPatterns() {
    const findings = [];
    const recommendations = [];

    if (this.learningLoop) {
      const insights = this.learningLoop.getInsights();

      if (insights.patterns.error) {
        findings.push({
          category: this.debugCategories.ERROR_ANALYSIS,
          type: 'info',
          message: 'Error patterns detected and analyzed',
          severity: 'low',
          data: insights.patterns.error,
        });
      }

      if (insights.recommendations.immediate?.length > 0) {
        insights.recommendations.immediate.forEach(rec => {
          recommendations.push({
            action: rec.action,
            priority: rec.priority,
            description: rec.reason,
            impact: rec.estimatedImpact,
          });
        });
      }
    }

    return { findings, recommendations };
  }

  /**
   * Analyze system performance
   */
  async analyzePerformance() {
    const findings = [];
    const recommendations = [];

    if (this.learningLoop) {
      const insights = this.learningLoop.getInsights();

      if (insights.patterns.systemPerformance) {
        findings.push({
          category: this.debugCategories.PERFORMANCE,
          type: 'info',
          message: 'Performance patterns analyzed',
          severity: 'low',
          data: insights.patterns.systemPerformance,
        });
      }

      if (insights.recommendations.shortTerm?.length > 0) {
        insights.recommendations.shortTerm.forEach(rec => {
          recommendations.push({
            action: rec.action,
            priority: rec.priority,
            description: rec.reason,
            impact: rec.estimatedImpact,
          });
        });
      }
    }

    return { findings, recommendations };
  }

  /**
   * Analyze learning insights
   */
  async analyzeLearningInsights() {
    const findings = [];
    const recommendations = [];

    if (this.learningLoop) {
      const insights = this.learningLoop.getInsights();

      if (insights.insights) {
        Object.values(insights.insights).forEach(insightArray => {
          insightArray.forEach(insight => {
            findings.push({
              category: this.debugCategories.LEARNING_INSIGHTS,
              type: insight.type,
              message: insight.description,
              severity: insight.impact,
              recommendation: insight.recommendation,
            });
          });
        });
      }

      if (insights.effectiveness > 0.7) {
        findings.push({
          category: this.debugCategories.LEARNING_INSIGHTS,
          type: 'success',
          message: `Learning effectiveness: ${(
            insights.effectiveness * 100
          ).toFixed(1)}%`,
          severity: 'low',
        });
      } else {
        findings.push({
          category: this.debugCategories.LEARNING_INSIGHTS,
          type: 'warning',
          message: `Learning effectiveness below optimal: ${(
            insights.effectiveness * 100
          ).toFixed(1)}%`,
          severity: 'medium',
        });
        recommendations.push({
          action: 'optimize_learning_rules',
          priority: 'medium',
          description: 'Improve learning rule effectiveness',
        });
      }
    }

    return { findings, recommendations };
  }

  /**
   * Send debug results to Telegram
   */
  async sendDebugResults(session, results) {
    let message = `🔧 **Debug Session Complete**\n\n`;
    message += `**Session ID:** ${session.id}\n`;
    message += `**Duration:** ${session.duration}ms\n`;
    message += `**Findings:** ${results.findings.length}\n`;
    message += `**Recommendations:** ${results.recommendations.length}\n\n`;

    // Add findings summary
    if (results.findings.length > 0) {
      message += `**📊 Findings Summary:**\n`;
      results.findings.slice(0, 5).forEach(finding => {
        const emoji =
          finding.type === 'success'
            ? '✅'
            : finding.type === 'warning'
              ? '⚠️'
              : finding.type === 'error'
                ? '❌'
                : 'ℹ️';
        message += `${emoji} ${finding.message}\n`;
      });
      if (results.findings.length > 5) {
        message += `... and ${results.findings.length - 5} more\n`;
      }
      message += `\n`;
    }

    // Add recommendations summary
    if (results.recommendations.length > 0) {
      message += `**🎯 Top Recommendations:**\n`;
      results.recommendations.slice(0, 3).forEach(rec => {
        message += `• **${rec.action}** (${rec.priority})\n  ${rec.description}\n`;
      });
      message += `\n`;
    }

    message += `Use /debug-report for detailed analysis`;

    await this.sendTelegramMessage(message);
  }

  /**
   * Handle /debug-status command
   */
  async handleDebugStatusCommand(msg) {
    try {
      const status = this.getDebugStatus();
      let message = `🔧 **Debug Tool Status**\n\n`;
      message += `**Status:** ${
        status.isActive ? '🟢 Active' : '🔴 Inactive'
      }\n`;
      message += `**Version:** ${status.version}\n`;
      message += `**Active Sessions:** ${status.activeSessions}\n`;
      message += `**Active Monitors:** ${status.activeMonitors}\n`;
      message += `**Debug History:** ${status.historyCount}\n\n`;

      message += `**System Connections:**\n`;
      message += `• Learning Loop: ${
        status.connections.learningLoop ? '✅' : '❌'
      }\n`;
      message += `• Unified Autopilot: ${
        status.connections.unifiedAutopilot ? '✅' : '❌'
      }\n`;
      message += `• Quantum Autopilot: ${
        status.connections.quantumAutopilot ? '✅' : '❌'
      }\n`;

      await this.sendTelegramMessage(message);
    } catch (error) {
      await this.sendTelegramMessage(
        `❌ Status command failed: ${error.message}`
      );
    }
  }

  /**
   * Handle /debug-patterns command
   */
  async handleDebugPatternsCommand(msg) {
    try {
      if (!this.learningLoop) {
        await this.sendTelegramMessage('❌ Learning Loop not connected');
        return;
      }

      const insights = this.learningLoop.getInsights();
      let message = `🔍 **Error Pattern Analysis**\n\n`;

      if (insights.patterns.error) {
        message += `**Error Patterns Detected:**\n`;
        Object.entries(insights.patterns.error).forEach(([type, data]) => {
          message += `• **${type}:** ${JSON.stringify(data).substring(
            0,
            100
          )}...\n`;
        });
      } else {
        message += `No error patterns detected yet.\n`;
      }

      await this.sendTelegramMessage(message);
    } catch (error) {
      await this.sendTelegramMessage(
        `❌ Patterns command failed: ${error.message}`
      );
    }
  }

  /**
   * Handle /debug-learning command
   */
  async handleDebugLearningCommand(msg) {
    try {
      if (!this.learningLoop) {
        await this.sendTelegramMessage('❌ Learning Loop not connected');
        return;
      }

      const insights = this.learningLoop.getInsights();
      let message = `🧠 **Learning Insights**\n\n`;

      message += `**Effectiveness:** ${(insights.effectiveness * 100).toFixed(
        1
      )}%\n`;
      message += `**Meta Learning Rules:** ${insights.metaLearning.length}\n\n`;

      if (insights.insights) {
        message += `**Key Insights:**\n`;
        Object.entries(insights.insights).forEach(
          ([category, insightArray]) => {
            if (insightArray.length > 0) {
              message += `• **${category}:** ${insightArray.length} insights\n`;
            }
          }
        );
      }

      await this.sendTelegramMessage(message);
    } catch (error) {
      await this.sendTelegramMessage(
        `❌ Learning command failed: ${error.message}`
      );
    }
  }

  /**
   * Handle /debug-monitor command
   */
  async handleDebugMonitorCommand(msg) {
    try {
      const monitorId = `monitor_${Date.now()}`;
      const monitor = {
        id: monitorId,
        startTime: new Date(),
        user: msg.from.username || msg.from.first_name,
        status: 'active',
        interval: null,
      };

      // Start real-time monitoring
      monitor.interval = setInterval(async () => {
        await this.sendMonitoringUpdate(monitor);
      }, 60000); // Every minute

      this.activeMonitors.set(monitorId, monitor);

      await this.sendTelegramMessage(
        `🔍 **Real-time Monitoring Started**\n\nMonitor ID: ${monitorId}\nUse /debug-stop to stop monitoring`
      );
    } catch (error) {
      await this.sendTelegramMessage(
        `❌ Monitor command failed: ${error.message}`
      );
    }
  }

  /**
   * Send monitoring update to Telegram
   */
  async sendMonitoringUpdate(monitor) {
    try {
      const status = this.getDebugStatus();
      let message = `📊 **Monitoring Update**\n\n`;
      message += `**Monitor ID:** ${monitor.id}\n`;
      message += `**Uptime:** ${Date.now() - monitor.startTime}ms\n`;
      message += `**System Status:** ${
        status.isActive ? '🟢 Active' : '🔴 Inactive'
      }\n`;

      if (this.learningLoop) {
        const learningStatus = this.learningLoop.getStatus();
        message += `**Learning Data Points:** ${learningStatus.dataPoints}\n`;
      }

      await this.sendTelegramMessage(message);
    } catch (error) {
      console.error('Failed to send monitoring update:', error);
    }
  }

  /**
   * Handle /debug-stop command
   */
  async handleDebugStopCommand(msg) {
    try {
      // Stop all active monitors
      for (const [monitorId, monitor] of this.activeMonitors) {
        if (monitor.interval) {
          clearInterval(monitor.interval);
        }
        monitor.status = 'stopped';
        monitor.endTime = new Date();
      }

      const stoppedCount = this.activeMonitors.size;
      this.activeMonitors.clear();

      await this.sendTelegramMessage(
        `🛑 **Monitoring Stopped**\n\nStopped ${stoppedCount} active monitors`
      );
    } catch (error) {
      await this.sendTelegramMessage(
        `❌ Stop command failed: ${error.message}`
      );
    }
  }

  /**
   * Handle /debug-report command
   */
  async handleDebugReportCommand(msg) {
    try {
      const report = await this.generateDebugReport();
      await this.sendTelegramMessage(report);
    } catch (error) {
      await this.sendTelegramMessage(
        `❌ Report command failed: ${error.message}`
      );
    }
  }

  /**
   * Generate comprehensive debug report
   */
  async generateDebugReport() {
    let report = `📋 **Comprehensive Debug Report**\n\n`;
    report += `**Generated:** ${new Date().toISOString()}\n`;
    report += `**Tool Version:** ${this.version}\n\n`;

    // System Status
    const status = this.getDebugStatus();
    report += `**System Status:**\n`;
    report += `• Active: ${status.isActive ? 'Yes' : 'No'}\n`;
    report += `• Active Sessions: ${status.activeSessions}\n`;
    report += `• Active Monitors: ${status.activeMonitors}\n\n`;

    // Learning Loop Status
    if (this.learningLoop) {
      const learningStatus = this.learningLoop.getStatus();
      report += `**Learning Loop:**\n`;
      report += `• Status: ${
        learningStatus.isActive ? 'Active' : 'Inactive'
      }\n`;
      report += `• Data Points: ${learningStatus.dataPoints}\n`;
      report += `• Patterns: ${learningStatus.patterns}\n`;
      report += `• Rules: ${learningStatus.rules}\n\n`;
    }

    // Recent Debug Sessions
    const recentSessions = Array.from(this.debugSessions.values())
      .slice(-5)
      .reverse();

    if (recentSessions.length > 0) {
      report += `**Recent Debug Sessions:**\n`;
      recentSessions.forEach(session => {
        report += `• ${session.id}: ${session.findings.length} findings, ${session.recommendations.length} recommendations\n`;
      });
    }

    return report;
  }

  /**
   * Handle /debug-optimize command
   */
  async handleDebugOptimizeCommand(msg) {
    try {
      await this.sendTelegramMessage('⚡ **Starting System Optimization...**');

      const optimizations = [];

      // Optimize Learning Loop
      if (this.learningLoop) {
        await this.learningLoop.optimizeLearningRules();
        optimizations.push('Learning rules optimized');
      }

      // Apply learning patterns
      if (this.learningLoop) {
        await this.learningLoop.applyLearning();
        optimizations.push('Learning patterns applied');
      }

      await this.sendTelegramMessage(
        `✅ **Optimization Complete**\n\nApplied optimizations:\n${optimizations
          .map(opt => `• ${opt}`)
          .join('\n')}`
      );
    } catch (error) {
      await this.sendTelegramMessage(
        `❌ Optimization failed: ${error.message}`
      );
    }
  }

  /**
   * Handle /debug-help command
   */
  async handleDebugHelpCommand(msg) {
    let help = `🔧 **Debug Tool Commands**\n\n`;
    Object.entries(this.telegramCommands).forEach(([cmd, desc]) => {
      help += `${cmd} - ${desc}\n`;
    });

    await this.sendTelegramMessage(help);
  }

  /**
   * Setup debug monitoring
   */
  async setupDebugMonitoring() {
    try {
      console.log('🔍 Setting up debug monitoring...');

      // Initialize monitoring intervals
      this.monitoringInterval = setInterval(async () => {
        await this.collectSystemMetrics();
      }, 30000); // Every 30 seconds

      console.log('✅ Debug monitoring setup complete');
    } catch (error) {
      console.error('❌ Failed to setup debug monitoring:', error);
      throw error;
    }
  }

  /**
   * Collect system metrics for monitoring
   */
  async collectSystemMetrics() {
    try {
      const metrics = {
        timestamp: new Date().toISOString(),
        learningLoop: this.learningLoop?.getStatus() || null,
        unifiedAutopilot: this.unifiedAutopilot?.getStatus() || null,
        quantumAutopilot: this.quantumAutopilot?.getStatus() || null,
        debugTool: this.getDebugStatus(),
      };

      // Store metrics for analysis
      this.debugHistory.push(metrics);

      // Keep only last 100 entries
      if (this.debugHistory.length > 100) {
        this.debugHistory.shift();
      }
    } catch (error) {
      console.error('Failed to collect system metrics:', error);
    }
  }

  /**
   * Send message to Telegram
   */
  async sendTelegramMessage(message) {
    try {
      if (this.telegramBot && this.chatId) {
        await this.telegramBot.sendMessage(this.chatId, message, {
          parse_mode: 'Markdown',
        });
      }
    } catch (error) {
      console.error('Failed to send Telegram message:', error);
    }
  }

  /**
   * Get debug tool status
   */
  getDebugStatus() {
    return {
      name: this.name,
      version: this.version,
      isActive: this.isActive,
      activeSessions: this.debugSessions.size,
      activeMonitors: this.activeMonitors.size,
      historyCount: this.debugHistory.length,
      connections: {
        learningLoop: !!this.learningLoop,
        unifiedAutopilot: !!this.unifiedAutopilot,
        quantumAutopilot: !!this.quantumAutopilot,
        telegramBot: !!this.telegramBot,
      },
    };
  }

  /**
   * Get connection status
   */
  getConnectionStatus() {
    return {
      learningLoop: !!this.learningLoop,
      unifiedAutopilot: !!this.unifiedAutopilot,
      quantumAutopilot: !!this.quantumAutopilot,
      telegramBot: !!this.telegramBot,
    };
  }

  /**
   * Deactivate debug tool
   */
  async deactivate() {
    try {
      console.log('🛑 Deactivating Comprehensive Debug Tool...');

      // Stop all monitors
      for (const [monitorId, monitor] of this.activeMonitors) {
        if (monitor.interval) {
          clearInterval(monitor.interval);
        }
      }
      this.activeMonitors.clear();

      // Deactivate learning loop
      if (this.learningLoop) {
        await this.learningLoop.deactivate();
      }

      // Stop Telegram bot
      if (this.telegramBot) {
        await this.telegramBot.stopPolling();
      }

      this.isActive = false;
      console.log('✅ Comprehensive Debug Tool deactivated');
    } catch (error) {
      console.error('❌ Failed to deactivate debug tool:', error);
    }
  }
}

module.exports = ComprehensiveDebugTool;
