/**
 * 🚀 Quantum Autopilot System - Core Orchestrator
 * 
 * Main orchestrator that coordinates all quantum autopilot components
 * This file has been refactored from the original large quantumAutopilotSystem.js
 */

const QuantumTelegramBot = require('./quantum/telegramBot');
const QuantumPolicyEngine = require('./quantum/policyEngine');
const QuantumLearningSystem = require('./quantum/learningSystem');
const QuantumMonitoring = require('./quantum/monitoring');
const QuantumUtils = require('./quantum/utils');

class QuantumAutopilotSystem {
  constructor() {
    this.name = 'Quantum Autopilot System';
    this.version = '2.0.0';
    this.isActive = false;
    
    // Initialize components
    this.telegramBot = new QuantumTelegramBot();
    this.policyEngine = new QuantumPolicyEngine();
    this.learningSystem = new QuantumLearningSystem();
    this.monitoring = new QuantumMonitoring();
    this.utils = new QuantumUtils();
    
    // System state
    this.state = {
      isInitialized: false,
      currentSession: null,
      activeAgents: new Map(),
      performanceMetrics: new Map(),
      errorHistory: [],
      learningData: new Map()
    };
    
    console.log(`🚀 ${this.name} v${this.version} initialized`);
  }

  /**
   * Initialize the Quantum Autopilot System
   */
  async initialize() {
    try {
      console.log('🚀 Initializing Quantum Autopilot System...');
      
      // Initialize Telegram bot
      const telegramInitialized = await this.telegramBot.initialize();
      if (!telegramInitialized) {
        console.log('⚠️ Telegram bot not initialized, continuing without Telegram integration');
      }
      
      // Initialize policy engine
      await this.policyEngine.initialize();
      
      // Initialize learning system
      await this.learningSystem.initialize();
      
      // Initialize monitoring
      await this.monitoring.initialize();
      
      this.state.isInitialized = true;
      this.isActive = true;
      
      console.log('✅ Quantum Autopilot System initialization completed');
      return true;
    } catch (error) {
      console.error('❌ Error initializing Quantum Autopilot System:', error.message);
      return false;
    }
  }

  /**
   * Start a new development session
   */
  async startSession(sessionConfig = {}) {
    try {
      if (!this.state.isInitialized) {
        throw new Error('System not initialized');
      }
      
      const sessionId = this.utils.generateSessionId();
      const session = {
        id: sessionId,
        startTime: Date.now(),
        config: sessionConfig,
        agents: new Map(),
        metrics: {
          tasksCompleted: 0,
          errorsDetected: 0,
          fixesApplied: 0,
          learningUpdates: 0
        },
        status: 'active'
      };
      
      this.state.currentSession = session;
      
      // Notify Telegram bot
      await this.telegramBot.sendSessionStart(session);
      
      console.log(`🎯 Started new session: ${sessionId}`);
      return session;
    } catch (error) {
      console.error('❌ Error starting session:', error.message);
      throw error;
    }
  }

  /**
   * Process a development task
   */
  async processTask(task) {
    try {
      if (!this.state.currentSession) {
        throw new Error('No active session');
      }
      
      console.log(`📋 Processing task: ${task.type} - ${task.description}`);
      
      // Analyze task using policy engine
      const analysis = await this.policyEngine.analyzeTask(task);
      
      // Execute task with monitoring
      const result = await this.monitoring.executeWithMonitoring(task, analysis);
      
      // Learn from task execution
      await this.learningSystem.learnFromTask(task, result);
      
      // Update session metrics
      this.state.currentSession.metrics.tasksCompleted++;
      
      // Notify Telegram bot
      await this.telegramBot.sendTaskUpdate(task, result);
      
      return result;
    } catch (error) {
      console.error('❌ Error processing task:', error.message);
      
      // Record error
      this.state.errorHistory.push({
        timestamp: Date.now(),
        task: task,
        error: error.message,
        stack: error.stack
      });
      
      // Notify Telegram bot about error
      await this.telegramBot.sendErrorNotification(task, error);
      
      throw error;
    }
  }

  /**
   * Get system status
   */
  getStatus() {
    return {
      name: this.name,
      version: this.version,
      isActive: this.isActive,
      isInitialized: this.state.isInitialized,
      currentSession: this.state.currentSession ? {
        id: this.state.currentSession.id,
        startTime: this.state.currentSession.startTime,
        status: this.state.currentSession.status,
        metrics: this.state.currentSession.metrics
      } : null,
      activeAgents: this.state.activeAgents.size,
      errorCount: this.state.errorHistory.length,
      performanceMetrics: Object.fromEntries(this.state.performanceMetrics)
    };
  }

  /**
   * Get performance insights
   */
  getPerformanceInsights() {
    return {
      sessionMetrics: this.state.currentSession?.metrics || {},
      errorPatterns: this.learningSystem.getErrorPatterns(),
      learningProgress: this.learningSystem.getLearningProgress(),
      systemHealth: this.monitoring.getSystemHealth(),
      recommendations: this.policyEngine.getRecommendations()
    };
  }

  /**
   * Shutdown the system
   */
  async shutdown() {
    try {
      console.log('🛑 Shutting down Quantum Autopilot System...');
      
      // End current session
      if (this.state.currentSession) {
        await this.endSession();
      }
      
      // Shutdown components
      await this.telegramBot.shutdown();
      await this.policyEngine.shutdown();
      await this.learningSystem.shutdown();
      await this.monitoring.shutdown();
      
      this.isActive = false;
      this.state.isInitialized = false;
      
      console.log('✅ Quantum Autopilot System shutdown completed');
    } catch (error) {
      console.error('❌ Error during shutdown:', error.message);
    }
  }

  /**
   * End current session
   */
  async endSession() {
    if (!this.state.currentSession) {
      return;
    }
    
    const session = this.state.currentSession;
    session.endTime = Date.now();
    session.status = 'completed';
    session.duration = session.endTime - session.startTime;
    
    // Generate session report
    const report = this.generateSessionReport(session);
    
    // Notify Telegram bot
    await this.telegramBot.sendSessionEnd(session, report);
    
    // Store session data
    await this.learningSystem.storeSessionData(session);
    
    this.state.currentSession = null;
    
    console.log(`✅ Session ended: ${session.id} (${session.duration}ms)`);
    return report;
  }

  /**
   * Generate session report
   */
  generateSessionReport(session) {
    return {
      sessionId: session.id,
      duration: session.duration,
      metrics: session.metrics,
      efficiency: this.calculateSessionEfficiency(session),
      insights: this.getPerformanceInsights(),
      recommendations: this.policyEngine.getRecommendations()
    };
  }

  /**
   * Calculate session efficiency
   */
  calculateSessionEfficiency(session) {
    const { tasksCompleted, errorsDetected, fixesApplied } = session.metrics;
    
    if (tasksCompleted === 0) return 0;
    
    const errorRate = errorsDetected / tasksCompleted;
    const fixRate = errorsDetected > 0 ? fixesApplied / errorsDetected : 1;
    
    return Math.max(0, 1 - errorRate + (fixRate * 0.5));
  }
}

module.exports = QuantumAutopilotSystem;
