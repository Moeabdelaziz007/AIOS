/**
 * AIOS System Integration
 * Connects Learning Loop, Debug Tool, and Autopilot Systems
 */

const ComprehensiveLearningLoop = require('./comprehensiveLearningLoop.js');
const ComprehensiveDebugTool = require('./comprehensiveDebugTool.js');
const { UnifiedAutopilotSystem } = require('./unifiedAutopilotSystem.js');
const QuantumAutopilot = require('./quantumAutopilot.js');

class AIOSSystemIntegration {
  constructor() {
    this.name = 'AIOS System Integration';
    this.version = '2.0.0';
    this.isActive = false;

    // System components
    this.learningLoop = null;
    this.debugTool = null;
    this.unifiedAutopilot = null;
    this.quantumAutopilot = null;

    // Integration status
    this.integrationStatus = {
      learningLoop: false,
      debugTool: false,
      unifiedAutopilot: false,
      quantumAutopilot: false,
      telegramIntegration: false,
    };

    console.log(`🔗 ${this.name} v${this.version} initialized`);
  }

  /**
   * Initialize all systems with Telegram integration
   */
  async initialize(telegramConfig) {
    try {
      console.log('🚀 Initializing AIOS System Integration...');

      // Initialize Learning Loop
      await this.initializeLearningLoop();

      // Initialize Unified Autopilot
      await this.initializeUnifiedAutopilot();

      // Initialize Quantum Autopilot
      await this.initializeQuantumAutopilot();

      // Initialize Debug Tool with Telegram
      await this.initializeDebugTool(telegramConfig);

      // Connect all systems
      await this.connectAllSystems();

      this.isActive = true;
      console.log('✅ AIOS System Integration completed successfully');

      return {
        status: 'active',
        components: Object.keys(this.integrationStatus).length,
        activeComponents: Object.values(this.integrationStatus).filter(Boolean)
          .length,
      };
    } catch (error) {
      console.error('❌ Failed to initialize AIOS System Integration:', error);
      throw error;
    }
  }

  /**
   * Initialize Learning Loop
   */
  async initializeLearningLoop() {
    try {
      console.log('🧠 Initializing Learning Loop...');
      this.learningLoop = new ComprehensiveLearningLoop();
      await this.learningLoop.initialize();
      this.integrationStatus.learningLoop = true;
      console.log('✅ Learning Loop initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Learning Loop:', error);
      throw error;
    }
  }

  /**
   * Initialize Unified Autopilot
   */
  async initializeUnifiedAutopilot() {
    try {
      console.log('🤖 Initializing Unified Autopilot...');
      this.unifiedAutopilot = new UnifiedAutopilotSystem();
      await this.unifiedAutopilot.initialize();
      this.integrationStatus.unifiedAutopilot = true;
      console.log('✅ Unified Autopilot initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Unified Autopilot:', error);
      throw error;
    }
  }

  /**
   * Initialize Quantum Autopilot
   */
  async initializeQuantumAutopilot() {
    try {
      console.log('⚡ Initializing Quantum Autopilot...');
      this.quantumAutopilot = new QuantumAutopilot();
      await this.quantumAutopilot.initialize();
      this.integrationStatus.quantumAutopilot = true;
      console.log('✅ Quantum Autopilot initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Quantum Autopilot:', error);
      throw error;
    }
  }

  /**
   * Initialize Debug Tool with Telegram integration
   */
  async initializeDebugTool(telegramConfig) {
    try {
      console.log('🔧 Initializing Debug Tool with Telegram...');
      this.debugTool = new ComprehensiveDebugTool();

      // Connect debug tool to all systems
      this.debugTool.learningLoop = this.learningLoop;
      this.debugTool.unifiedAutopilot = this.unifiedAutopilot;
      this.debugTool.quantumAutopilot = this.quantumAutopilot;

      // Initialize with Telegram
      await this.debugTool.initialize(
        telegramConfig.token,
        telegramConfig.chatId
      );

      this.integrationStatus.debugTool = true;
      this.integrationStatus.telegramIntegration = true;
      console.log('✅ Debug Tool with Telegram initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Debug Tool:', error);
      throw error;
    }
  }

  /**
   * Connect all systems together
   */
  async connectAllSystems() {
    try {
      console.log('🔗 Connecting all systems...');

      // Connect Learning Loop to Autopilot Systems
      if (this.learningLoop && this.unifiedAutopilot) {
        this.learningLoop.systemConnections.get('unifiedAutopilot').instance =
          this.unifiedAutopilot;
      }

      if (this.learningLoop && this.quantumAutopilot) {
        this.learningLoop.systemConnections.get('quantumAutopilot').instance =
          this.quantumAutopilot;
      }

      // Connect Debug Tool to all systems
      if (this.debugTool) {
        this.debugTool.learningLoop = this.learningLoop;
        this.debugTool.unifiedAutopilot = this.unifiedAutopilot;
        this.debugTool.quantumAutopilot = this.quantumAutopilot;
      }

      console.log('✅ All systems connected');
    } catch (error) {
      console.error('❌ Failed to connect systems:', error);
      throw error;
    }
  }

  /**
   * Get comprehensive system status
   */
  getSystemStatus() {
    const status = {
      integration: {
        name: this.name,
        version: this.version,
        isActive: this.isActive,
        components: this.integrationStatus,
      },
      learningLoop: this.learningLoop?.getStatus() || null,
      debugTool: this.debugTool?.getDebugStatus() || null,
      unifiedAutopilot: this.unifiedAutopilot?.getStatus() || null,
      quantumAutopilot: this.quantumAutopilot?.getStatus() || null,
    };

    return status;
  }

  /**
   * Get learning insights from all systems
   */
  getLearningInsights() {
    const insights = {
      learningLoop: this.learningLoop?.getInsights() || null,
      debugTool: this.debugTool?.getDebugStatus() || null,
      unifiedAutopilot: this.unifiedAutopilot?.getStatus() || null,
      quantumAutopilot: this.quantumAutopilot?.getStatus() || null,
    };

    return insights;
  }

  /**
   * Run comprehensive system analysis
   */
  async runSystemAnalysis() {
    try {
      console.log('🔍 Running comprehensive system analysis...');

      const analysis = {
        timestamp: new Date().toISOString(),
        systems: {},
        recommendations: [],
        performance: {},
      };

      // Analyze Learning Loop
      if (this.learningLoop) {
        analysis.systems.learningLoop = {
          status: this.learningLoop.getStatus(),
          insights: this.learningLoop.getInsights(),
        };
      }

      // Analyze Debug Tool
      if (this.debugTool) {
        analysis.systems.debugTool = {
          status: this.debugTool.getDebugStatus(),
          connections: this.debugTool.getConnectionStatus(),
        };
      }

      // Analyze Autopilot Systems
      if (this.unifiedAutopilot) {
        analysis.systems.unifiedAutopilot = this.unifiedAutopilot.getStatus();
      }

      if (this.quantumAutopilot) {
        analysis.systems.quantumAutopilot = this.quantumAutopilot.getStatus();
      }

      // Generate recommendations
      analysis.recommendations = await this.generateSystemRecommendations(
        analysis
      );

      console.log('✅ System analysis completed');

      return analysis;
    } catch (error) {
      console.error('❌ Failed to run system analysis:', error);
      throw error;
    }
  }

  /**
   * Generate system recommendations
   */
  async generateSystemRecommendations(analysis) {
    const recommendations = [];

    // Check Learning Loop effectiveness
    if (analysis.systems.learningLoop?.insights?.effectiveness < 0.7) {
      recommendations.push({
        system: 'learningLoop',
        action: 'optimize_learning_rules',
        priority: 'medium',
        description: 'Learning effectiveness below optimal threshold',
        impact: 'Improve system learning capabilities',
      });
    }

    // Check system connections
    const activeConnections = Object.values(this.integrationStatus).filter(
      Boolean
    ).length;
    const totalConnections = Object.keys(this.integrationStatus).length;

    if (activeConnections < totalConnections) {
      recommendations.push({
        system: 'integration',
        action: 'fix_missing_connections',
        priority: 'high',
        description: `${
          totalConnections - activeConnections
        } system connections missing`,
        impact: 'Restore full system functionality',
      });
    }

    return recommendations;
  }

  /**
   * Deactivate all systems
   */
  async deactivate() {
    try {
      console.log('🛑 Deactivating AIOS System Integration...');

      // Deactivate Debug Tool
      if (this.debugTool) {
        await this.debugTool.deactivate();
      }

      // Deactivate Learning Loop
      if (this.learningLoop) {
        await this.learningLoop.deactivate();
      }

      // Deactivate Autopilot Systems
      if (this.unifiedAutopilot) {
        await this.unifiedAutopilot.deactivate();
      }

      if (this.quantumAutopilot) {
        await this.quantumAutopilot.deactivate();
      }

      this.isActive = false;
      console.log('✅ AIOS System Integration deactivated');
    } catch (error) {
      console.error('❌ Failed to deactivate system integration:', error);
    }
  }
}

module.exports = AIOSSystemIntegration;
