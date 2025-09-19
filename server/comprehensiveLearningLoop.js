/**
 * Comprehensive Learning Loop System
 * Integrates with all AIOS components for continuous improvement
 */

const fs = require('fs').promises;
const path = require('path');

class ComprehensiveLearningLoop {
  constructor() {
    this.name = 'Comprehensive Learning Loop';
    this.version = '3.0.0';
    this.isActive = false;
    this.learningData = new Map();
    this.patterns = new Map();
    this.performanceMetrics = new Map();
    this.systemConnections = new Map();
    this.learningRules = new Map();
    this.metaLearning = new Map();

    // Enhanced debugging intelligence
    this.debuggingIntelligence = new Map();
    this.errorCorrelations = new Map();
    this.fixEffectiveness = new Map();
    this.predictiveModels = new Map();
    this.contextualLearning = new Map();
    this.adaptiveStrategies = new Map();

    // Advanced pattern recognition
    this.patternMatchers = new Map();
    this.semanticAnalysis = new Map();
    this.causalChains = new Map();
    this.solutionTemplates = new Map();

    // Learning categories
    this.categories = {
      ERROR_PATTERNS: 'error_patterns',
      USER_BEHAVIOR: 'user_behavior',
      SYSTEM_PERFORMANCE: 'system_performance',
      API_USAGE: 'api_usage',
      DEBUGGING_SUCCESS: 'debugging_success',
      OPTIMIZATION: 'optimization',
      SECURITY_PATTERNS: 'security_patterns',
      INTEGRATION_PATTERNS: 'integration_patterns',
      CODE_PATTERNS: 'code_patterns',
      FILE_CHANGES: 'file_changes',
      DEBUGGING_SESSIONS: 'debugging_sessions',
      WORKSPACE_ANALYSIS: 'workspace_analysis',
      // New enhanced categories
      INTELLIGENT_DEBUGGING: 'intelligent_debugging',
      PREDICTIVE_ANALYSIS: 'predictive_analysis',
      CONTEXTUAL_FIXES: 'contextual_fixes',
      ADAPTIVE_LEARNING: 'adaptive_learning',
      CAUSAL_REASONING: 'causal_reasoning',
      SEMANTIC_PATTERNS: 'semantic_patterns',
    };

    // Learning phases
    this.phases = {
      COLLECT: 'collect',
      ANALYZE: 'analyze',
      LEARN: 'learn',
      APPLY: 'apply',
      EVALUATE: 'evaluate',
      OPTIMIZE: 'optimize',
      // New enhanced phases
      PREDICT: 'predict',
      PREVENT: 'prevent',
      ADAPT: 'adapt',
      REASON: 'reason',
    };

    this.currentPhase = this.phases.COLLECT;
    this.learningInterval = null;
    this.analysisInterval = null;
    this.optimizationInterval = null;
    this.intelligenceInterval = null;

    console.log(
      `🧠 ${this.name} v${this.version} initialized with enhanced debugging intelligence`
    );
  }

  /**
   * Initialize the comprehensive learning loop
   */
  async initialize() {
    try {
      

      // Initialize system connections
      await this.initializeSystemConnections();

      // Load existing learning data
      await this.loadLearningData();

      // Start learning processes
      await this.startLearningProcesses();

      // Initialize learning rules
      await this.initializeLearningRules();

      this.isActive = true;
      

      return {
        status: 'active',
        connections: this.systemConnections.size,
        rules: this.learningRules.size,
        patterns: this.patterns.size,
      };
    } catch (error) {
      console.error('❌ Failed to initialize learning loop:', error);
      throw error;
    }
  }

  /**
   * Enhanced intelligent debugging analysis
   */
  async analyzeErrorIntelligently(errorData) {
    try {
      

      const analysis = {
        errorSignature: this.generateErrorSignature(errorData),
        semanticAnalysis: await this.performSemanticAnalysis(errorData),
        causalChain: await this.buildCausalChain(errorData),
        contextualFactors: await this.analyzeContextualFactors(errorData),
        predictiveRisk: await this.calculatePredictiveRisk(errorData),
        solutionCandidates: await this.generateSolutionCandidates(errorData),
        confidence: 0,
        recommendations: [],
      };

      // Calculate overall confidence
      analysis.confidence = this.calculateAnalysisConfidence(analysis);

      // Generate intelligent recommendations
      analysis.recommendations =
        await this.generateIntelligentRecommendations(analysis);

      // Store analysis for future learning
      this.debuggingIntelligence.set(analysis.errorSignature, analysis);

      console.log(
        `✅ Intelligent analysis completed with confidence: ${analysis.confidence}`
      );
      return analysis;
    } catch (error) {
      console.error('❌ Intelligent error analysis failed:', error.message);
      return null;
    }
  }

  /**
   * Process learning data from all connected systems
   */
  async processLearningData(data) {
    try {
      if (data.userBehavior) {
        await this.processUserBehavior(data.userBehavior);
      }

      if (data.systemPerformance) {
        await this.processSystemPerformance(data.systemPerformance);
      }

      if (data.apiUsage) {
        await this.processApiUsage(data.apiUsage);
      }

      if (data.debuggingSuccess) {
        await this.processDebuggingSuccess(data.debuggingSuccess);
      }

      // Process Cursor CLI data
      if (data.fileChanges) {
        await this.processFileChanges(data.fileChanges);
      }

      if (data.codePatterns) {
        await this.processCodePatterns(data.codePatterns);
      }

      if (data.debuggingSessions) {
        await this.processDebuggingSessions(data.debuggingSessions);
      }

      if (data.performanceMetrics) {
        await this.processPerformanceMetrics(data.performanceMetrics);
      }

      // Update learning metrics
      await this.updateLearningMetrics();

      
    } catch (error) {
      console.error('❌ Failed to process learning data:', error);
      throw error;
    }
  }

  /**
   * Activate the comprehensive learning loop
   */
  async activate() {
    try {
      

      // Initialize system connections
      await this.initializeSystemConnections();

      // Load existing learning data
      await this.loadLearningData();

      // Start learning processes
      await this.startLearningProcesses();

      // Initialize learning rules
      await this.initializeLearningRules();

      this.isActive = true;
      

      return {
        status: 'active',
        connections: this.systemConnections.size,
        rules: this.learningRules.size,
        patterns: this.patterns.size,
      };
    } catch (error) {
      console.error(
        '❌ Failed to activate Comprehensive Learning Loop:',
        error
      );
      throw error;
    }
  }

  /**
   * Initialize connections to all system components
   */
  async initializeSystemConnections() {
    

    // Connect to Unified Autopilot System
    try {
      const { UnifiedAutopilotSystem } = require('./unifiedAutopilotSystem.js');
      this.systemConnections.set('unifiedAutopilot', {
        instance: null, // Will be set by main system
        type: 'error_processing',
        capabilities: [
          'error_analysis',
          'pattern_recognition',
          'fix_generation',
        ],
      });
    } catch (error) {
      console.warn('⚠️ Unified Autopilot System not available:', error.message);
    }

    // Connect to Quantum Autopilot System
    try {
      const QuantumAutopilot = require('./quantumAutopilot.js');
      this.systemConnections.set('quantumAutopilot', {
        instance: null, // Will be set by main system
        type: 'multi_agent',
        capabilities: [
          'telegram_integration',
          'error_monitoring',
          'system_health',
        ],
      });
    } catch (error) {
      console.warn('⚠️ Quantum Autopilot System not available:', error.message);
    }

    // Connect to Error Flow Manager
    try {
      const ErrorFlowManager = require('./errorFlowManager.js');
      this.systemConnections.set('errorFlowManager', {
        instance: null, // Will be set by main system
        type: 'error_distribution',
        capabilities: ['error_routing', 'priority_management', 'flow_control'],
      });
    } catch (error) {
      console.warn('⚠️ Error Flow Manager not available:', error.message);
    }

    // Connect to Data Agent
    try {
      const DataAgent = require('./dataAgent.js');
      this.systemConnections.set('dataAgent', {
        instance: null, // Will be set by main system
        type: 'data_processing',
        capabilities: ['data_analysis', 'caching', 'insights_generation'],
      });
    } catch (error) {
      console.warn('⚠️ Data Agent not available:', error.message);
    }

    console.log(
      `✅ Connected to ${this.systemConnections.size} system components`
    );
  }

  /**
   * Initialize comprehensive learning rules
   */
  async initializeLearningRules() {
    

    // Error Pattern Learning Rules
    this.learningRules.set('error_pattern_analysis', {
      name: 'Error Pattern Analysis',
      category: this.categories.ERROR_PATTERNS,
      description: 'Analyzes error patterns across all systems',
      rules: [
        'Identify recurring error types',
        'Track error frequency and timing',
        'Analyze error context and environment',
        'Detect error correlation patterns',
        'Predict potential error occurrences',
      ],
      weight: 0.3,
      active: true,
    });

    // User Behavior Learning Rules
    this.learningRules.set('user_behavior_analysis', {
      name: 'User Behavior Analysis',
      category: this.categories.USER_BEHAVIOR,
      description: 'Learns from user interactions and preferences',
      rules: [
        'Track user navigation patterns',
        'Analyze feature usage frequency',
        'Learn user preferences and settings',
        'Identify optimal user flows',
        'Predict user needs and actions',
      ],
      weight: 0.25,
      active: true,
    });

    // System Performance Learning Rules
    this.learningRules.set('performance_optimization', {
      name: 'Performance Optimization',
      category: this.categories.SYSTEM_PERFORMANCE,
      description: 'Learns optimal system configurations',
      rules: [
        'Monitor system resource usage',
        'Identify performance bottlenecks',
        'Learn optimal configuration patterns',
        'Predict resource requirements',
        'Optimize system parameters',
      ],
      weight: 0.2,
      active: true,
    });

    // API Usage Learning Rules
    this.learningRules.set('api_usage_optimization', {
      name: 'API Usage Optimization',
      category: this.categories.API_USAGE,
      description: 'Learns optimal API usage patterns',
      rules: [
        'Track API call patterns',
        'Analyze response times and success rates',
        'Learn optimal request batching',
        'Identify API usage inefficiencies',
        'Optimize API call strategies',
      ],
      weight: 0.15,
      active: true,
    });

    // Debugging Success Learning Rules
    this.learningRules.set('debugging_success_patterns', {
      name: 'Debugging Success Patterns',
      category: this.categories.DEBUGGING_SUCCESS,
      description: 'Learns from successful debugging sessions',
      rules: [
        'Track successful error resolutions',
        'Analyze debugging strategies',
        'Learn effective fix patterns',
        'Identify debugging best practices',
        'Improve debugging efficiency',
      ],
      weight: 0.1,
      active: true,
    });

    
  }

  /**
   * Start all learning processes
   */
  async startLearningProcesses() {
    

    // Data collection process (every 30 seconds)
    this.learningInterval = setInterval(async () => {
      await this.collectLearningData();
    }, 30000);

    // Analysis process (every 5 minutes)
    this.analysisInterval = setInterval(async () => {
      await this.analyzeLearningData();
    }, 300000);

    // Optimization process (every 15 minutes)
    this.optimizationInterval = setInterval(async () => {
      await this.optimizeLearningRules();
    }, 900000);

    
  }

  /**
   * Collect learning data from all connected systems
   */
  async collectLearningData() {
    try {
      const timestamp = new Date().toISOString();
      const collectedData = {
        timestamp,
        systems: {},
        metrics: {},
        patterns: {},
      };

      // Collect data from each connected system
      for (const [systemName, connection] of this.systemConnections) {
        if (connection.instance) {
          try {
            const systemData = await this.collectSystemData(
              systemName,
              connection
            );
            collectedData.systems[systemName] = systemData;
          } catch (error) {
            console.warn(
              `⚠️ Failed to collect data from ${systemName}:`,
              error.message
            );
          }
        }
      }

      // Store collected data
      this.learningData.set(timestamp, collectedData);

      // Keep only last 1000 entries to prevent memory issues
      if (this.learningData.size > 1000) {
        const oldestKey = this.learningData.keys().next().value;
        this.learningData.delete(oldestKey);
      }

      console.log(
        `📊 Collected learning data from ${
          Object.keys(collectedData.systems).length
        } systems`
      );
    } catch (error) {
      console.error('❌ Failed to collect learning data:', error);
    }
  }

  /**
   * Collect data from a specific system
   */
  async collectSystemData(systemName, connection) {
    const data = {
      timestamp: new Date().toISOString(),
      type: connection.type,
      capabilities: connection.capabilities,
      metrics: {},
      events: [],
      patterns: {},
    };

    switch (systemName) {
      case 'unifiedAutopilot':
        data.metrics = {
          errorsProcessed: connection.instance?.getErrorCount?.() || 0,
          patternsDetected: connection.instance?.getPatternCount?.() || 0,
          fixesGenerated: connection.instance?.getFixCount?.() || 0,
        };
        break;

      case 'quantumAutopilot':
        data.metrics = {
          notificationsSent: connection.instance?.getNotificationCount?.() || 0,
          commandsProcessed: connection.instance?.getCommandCount?.() || 0,
          systemHealth: connection.instance?.getSystemHealth?.() || 'unknown',
        };
        break;

      case 'errorFlowManager':
        data.metrics = {
          errorsRouted: connection.instance?.getRoutedErrorCount?.() || 0,
          priorityLevels:
            connection.instance?.getPriorityDistribution?.() || {},
          flowEfficiency: connection.instance?.getFlowEfficiency?.() || 0,
        };
        break;

      case 'dataAgent':
        data.metrics = {
          cacheHitRate: connection.instance?.getCacheHitRate?.() || 0,
          dataProcessed: connection.instance?.getDataProcessed?.() || 0,
          insightsGenerated: connection.instance?.getInsightsCount?.() || 0,
        };
        break;
    }

    return data;
  }

  /**
   * Analyze collected learning data
   */
  async analyzeLearningData() {
    try {
      

      const analysisResults = {
        timestamp: new Date().toISOString(),
        patterns: {},
        insights: {},
        recommendations: {},
        performance: {},
      };

      // Analyze error patterns
      analysisResults.patterns.error = await this.analyzeErrorPatterns();

      // Analyze user behavior
      analysisResults.patterns.userBehavior = await this.analyzeUserBehavior();

      // Analyze system performance
      analysisResults.performance = await this.analyzeSystemPerformance();

      // Generate insights
      analysisResults.insights = await this.generateInsights(analysisResults);

      // Generate recommendations
      analysisResults.recommendations =
        await this.generateRecommendations(analysisResults);

      // Store analysis results
      this.patterns.set(analysisResults.timestamp, analysisResults);

      

      return analysisResults;
    } catch (error) {
      console.error('❌ Failed to analyze learning data:', error);
    }
  }

  /**
   * Analyze error patterns across systems
   */
  async analyzeErrorPatterns() {
    const errorPatterns = {
      frequency: {},
      timing: {},
      correlation: {},
      resolution: {},
    };

    // Analyze error frequency
    for (const [timestamp, data] of this.learningData) {
      for (const [systemName, systemData] of Object.entries(data.systems)) {
        if (systemData.metrics.errorsProcessed) {
          const hour = new Date(timestamp).getHours();
          errorPatterns.frequency[hour] =
            (errorPatterns.frequency[hour] || 0) +
            systemData.metrics.errorsProcessed;
        }
      }
    }

    // Analyze error timing patterns
    const errorTimes = Array.from(this.learningData.keys()).map(ts =>
      new Date(ts).getHours()
    );
    errorPatterns.timing = this.calculateTimePatterns(errorTimes);

    return errorPatterns;
  }

  /**
   * Calculate time patterns from error timestamps
   */
  calculateTimePatterns(errorTimes) {
    if (!errorTimes || errorTimes.length === 0) {
      return {
        peakHours: [],
        lowHours: [],
        distribution: {},
        average: 0,
        pattern: 'none',
      };
    }

    // Count occurrences by hour
    const hourCounts = {};
    errorTimes.forEach(hour => {
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });

    // Find peak and low hours
    const sortedHours = Object.entries(hourCounts).sort(
      ([, a], [, b]) => b - a
    );

    const peakHours = sortedHours.slice(0, 3).map(([hour]) => parseInt(hour));
    const lowHours = sortedHours.slice(-3).map(([hour]) => parseInt(hour));

    // Calculate average
    const totalErrors = errorTimes.length;
    const average = totalErrors / 24; // Average per hour

    // Determine pattern
    let pattern = 'random';
    if (peakHours.some(hour => hour >= 9 && hour <= 17)) {
      pattern = 'business_hours';
    } else if (peakHours.some(hour => hour >= 18 || hour <= 6)) {
      pattern = 'after_hours';
    }

    return {
      peakHours,
      lowHours,
      distribution: hourCounts,
      average: Math.round(average * 100) / 100,
      pattern,
      totalErrors,
    };
  }

  /**
   * Analyze user behavior patterns
   */
  async analyzeUserBehavior() {
    const behaviorPatterns = {
      navigation: {},
      preferences: {},
      usage: {},
      efficiency: {},
    };

    // This would analyze user interaction data
    // For now, return placeholder data
    behaviorPatterns.navigation = {
      mostUsedFeatures: ['dashboard', 'apps', 'settings'],
      averageSessionDuration: '15 minutes',
      commonPaths: ['login -> dashboard -> apps'],
    };

    return behaviorPatterns;
  }

  /**
   * Analyze system performance metrics
   */
  async analyzeSystemPerformance() {
    const performance = {
      responseTime: {},
      resourceUsage: {},
      efficiency: {},
      bottlenecks: [],
    };

    // Analyze performance data from collected metrics
    for (const [timestamp, data] of this.learningData) {
      for (const [systemName, systemData] of Object.entries(data.systems)) {
        if (systemData.metrics) {
          // Track performance metrics over time
          if (!performance.responseTime[systemName]) {
            performance.responseTime[systemName] = [];
          }
          performance.responseTime[systemName].push({
            timestamp,
            value: systemData.metrics.responseTime || 0,
          });
        }
      }
    }

    return performance;
  }

  /**
   * Generate insights from analysis
   */
  async generateInsights(analysisResults) {
    const insights = {
      errorInsights: [],
      performanceInsights: [],
      userInsights: [],
      systemInsights: [],
    };

    // Generate error insights
    if (analysisResults.patterns.error) {
      insights.errorInsights.push({
        type: 'frequency_pattern',
        description: 'Peak error times identified',
        impact: 'high',
        recommendation: 'Increase monitoring during peak hours',
      });
    }

    // Generate performance insights
    insights.performanceInsights.push({
      type: 'optimization_opportunity',
      description: 'System performance can be optimized',
      impact: 'medium',
      recommendation: 'Implement caching strategies',
    });

    return insights;
  }

  /**
   * Generate recommendations based on analysis
   */
  async generateRecommendations(analysisResults) {
    const recommendations = {
      immediate: [],
      shortTerm: [],
      longTerm: [],
    };

    // Immediate recommendations
    recommendations.immediate.push({
      action: 'increase_monitoring',
      reason: 'Error frequency patterns detected',
      priority: 'high',
      estimatedImpact: 'Reduce error resolution time by 30%',
    });

    // Short-term recommendations
    recommendations.shortTerm.push({
      action: 'optimize_caching',
      reason: 'Performance analysis shows caching opportunities',
      priority: 'medium',
      estimatedImpact: 'Improve response time by 20%',
    });

    // Long-term recommendations
    recommendations.longTerm.push({
      action: 'implement_predictive_monitoring',
      reason: 'Pattern analysis shows predictable error patterns',
      priority: 'low',
      estimatedImpact: 'Prevent 50% of errors before they occur',
    });

    return recommendations;
  }

  /**
   * Optimize learning rules based on performance
   */
  async optimizeLearningRules() {
    try {
      

      for (const [ruleId, rule] of this.learningRules) {
        // Calculate rule effectiveness
        const effectiveness = await this.calculateRuleEffectiveness(ruleId);

        // Update rule weight based on effectiveness
        if (effectiveness > 0.8) {
          rule.weight = Math.min(rule.weight * 1.1, 1.0);
        } else if (effectiveness < 0.3) {
          rule.weight = Math.max(rule.weight * 0.9, 0.1);
        }

        // Store optimization results
        this.metaLearning.set(ruleId, {
          effectiveness,
          lastOptimized: new Date().toISOString(),
          weight: rule.weight,
        });
      }

      
    } catch (error) {
      console.error('❌ Failed to optimize learning rules:', error);
    }
  }

  /**
   * Calculate effectiveness of a learning rule
   */
  async calculateRuleEffectiveness(ruleId) {
    // This would calculate how effective a rule has been
    // For now, return a random value between 0 and 1
    return Math.random();
  }

  /**
   * Apply learned patterns to improve system performance
   */
  async applyLearning() {
    try {
      

      const applications = [];

      // Apply error pattern learning
      const errorPatterns = this.patterns.get(
        Array.from(this.patterns.keys()).pop()
      );
      if (errorPatterns?.patterns?.error) {
        applications.push(
          await this.applyErrorPatternLearning(errorPatterns.patterns.error)
        );
      }

      // Apply performance optimization learning
      const performanceData = this.patterns.get(
        Array.from(this.patterns.keys()).pop()
      );
      if (performanceData?.performance) {
        applications.push(
          await this.applyPerformanceLearning(performanceData.performance)
        );
      }

      

      return applications;
    } catch (error) {
      console.error('❌ Failed to apply learning:', error);
    }
  }

  /**
   * Apply error pattern learning to connected systems
   */
  async applyErrorPatternLearning(errorPatterns) {
    const applications = [];

    // Apply to Unified Autopilot System
    const unifiedAutopilot = this.systemConnections.get('unifiedAutopilot');
    if (unifiedAutopilot?.instance) {
      try {
        // Update error detection patterns
        await unifiedAutopilot.instance.updateErrorPatterns?.(errorPatterns);
        applications.push('Updated Unified Autopilot error patterns');
      } catch (error) {
        console.warn(
          '⚠️ Failed to update Unified Autopilot patterns:',
          error.message
        );
      }
    }

    return applications;
  }

  /**
   * Apply performance learning to connected systems
   */
  async applyPerformanceLearning(performanceData) {
    const applications = [];

    // Apply to Data Agent
    const dataAgent = this.systemConnections.get('dataAgent');
    if (dataAgent?.instance) {
      try {
        // Update caching strategies based on performance data
        await dataAgent.instance.optimizeCaching?.(performanceData);
        applications.push('Optimized Data Agent caching');
      } catch (error) {
        console.warn('⚠️ Failed to optimize Data Agent:', error.message);
      }
    }

    return applications;
  }

  /**
   * Get comprehensive learning status
   */
  getStatus() {
    return {
      name: this.name,
      version: this.version,
      isActive: this.isActive,
      currentPhase: this.currentPhase,
      connections: this.systemConnections.size,
      rules: this.learningRules.size,
      dataPoints: this.learningData.size,
      patterns: this.patterns.size,
      metaLearning: this.metaLearning.size,
      uptime: this.isActive ? Date.now() - this.startTime : 0,
    };
  }

  /**
   * Get learning insights and recommendations
   */
  getInsights() {
    const latestPatterns = Array.from(this.patterns.values()).pop();
    const latestMetaLearning = Array.from(this.metaLearning.values());

    return {
      patterns: latestPatterns?.patterns || {},
      insights: latestPatterns?.insights || {},
      recommendations: latestPatterns?.recommendations || {},
      metaLearning: latestMetaLearning,
      effectiveness: this.calculateOverallEffectiveness(),
    };
  }

  /**
   * Calculate overall learning effectiveness
   */
  calculateOverallEffectiveness() {
    if (this.metaLearning.size === 0) return 0;

    const effectivenessValues = Array.from(this.metaLearning.values()).map(
      meta => meta.effectiveness
    );

    return (
      effectivenessValues.reduce((sum, val) => sum + val, 0) /
      effectivenessValues.length
    );
  }

  /**
   * Load existing learning data from storage
   */
  async loadLearningData() {
    try {
      const dataPath = path.join(__dirname, 'learning_data.json');
      const data = await fs.readFile(dataPath, 'utf8');
      const parsedData = JSON.parse(data);

      // Restore learning data
      this.learningData = new Map(parsedData.learningData || []);
      this.patterns = new Map(parsedData.patterns || []);
      this.metaLearning = new Map(parsedData.metaLearning || []);

      
    } catch (error) {
      
    }
  }

  /**
   * Save learning data to storage
   */
  async saveLearningData() {
    try {
      const dataPath = path.join(__dirname, 'learning_data.json');
      const data = {
        learningData: Array.from(this.learningData.entries()),
        patterns: Array.from(this.patterns.entries()),
        metaLearning: Array.from(this.metaLearning.entries()),
        lastSaved: new Date().toISOString(),
      };

      await fs.writeFile(dataPath, JSON.stringify(data, null, 2));
      
    } catch (error) {
      console.error('❌ Failed to save learning data:', error);
    }
  }

  /**
   * Deactivate the learning loop
   */
  async deactivate() {
    try {
      

      // Stop all intervals
      if (this.learningInterval) clearInterval(this.learningInterval);
      if (this.analysisInterval) clearInterval(this.analysisInterval);
      if (this.optimizationInterval) clearInterval(this.optimizationInterval);

      // Save learning data
      await this.saveLearningData();

      this.isActive = false;
      
    } catch (error) {
      console.error('❌ Failed to deactivate learning loop:', error);
    }
  }

  /**
   * Process file changes from Cursor CLI
   */
  async processFileChanges(fileChanges) {
    try {
      

      for (const change of fileChanges) {
        const pattern = {
          timestamp: change.timestamp,
          event: change.event,
          fileType: change.fileType,
          size: change.size,
          category: this.categories.FILE_CHANGES,
        };

        // Store pattern
        const key = `file_change_${change.event}_${change.fileType}`;
        this.patterns.set(key, pattern);

        // Learn from patterns
        await this.learnFromFileChangePattern(change);

        // Store in Firestore if available
        if (this.firestoreStorage) {
          await this.firestoreStorage.storeFileChanges([change]);
        }
      }

      
    } catch (error) {
      console.error('❌ Failed to process file changes:', error);
    }
  }

  /**
   * Process code patterns from Cursor CLI
   */
  async processCodePatterns(codePatterns) {
    try {
      // Ensure codePatterns is an array
      if (!Array.isArray(codePatterns)) {
        console.error(
          '❌ codePatterns must be an array, received:',
          typeof codePatterns
        );
        return;
      }

      

      for (const pattern of codePatterns) {
        // Analyze code complexity patterns
        await this.analyzeCodeComplexityPattern(pattern);

        // Learn from import patterns
        await this.learnFromImportPatterns(pattern.patterns.imports);

        // Learn from function patterns
        await this.learnFromFunctionPatterns(pattern.patterns.functions);

        // Learn from error handling patterns
        await this.learnFromErrorHandlingPatterns(
          pattern.patterns.errorHandling
        );

        // Store pattern
        const key = `code_pattern_${path.basename(pattern.filePath)}`;
        this.patterns.set(key, {
          ...pattern,
          category: this.categories.CODE_PATTERNS,
        });

        // Store in Firestore if available
        if (this.firestoreStorage) {
          await this.firestoreStorage.storeCodePatterns([pattern]);
        }
      }

      
    } catch (error) {
      console.error('❌ Failed to process code patterns:', error);
    }
  }

  /**
   * Process debugging sessions from Cursor CLI
   */
  async processDebuggingSessions(debuggingSessions) {
    try {
      console.log(
        `🔧 Processing ${debuggingSessions.length} debugging sessions...`
      );

      for (const session of debuggingSessions) {
        // Analyze debugging patterns
        await this.analyzeDebuggingPattern(session);

        // Learn from debugging success/failure
        await this.learnFromDebuggingSession(session);

        // Store session
        const key = `debug_session_${session.timestamp}`;
        this.patterns.set(key, {
          ...session,
          category: this.categories.DEBUGGING_SESSIONS,
        });

        // Store in Firestore if available
        if (this.firestoreStorage) {
          await this.firestoreStorage.storeDebuggingSessions([session]);
        }
      }

      
    } catch (error) {
      console.error('❌ Failed to process debugging sessions:', error);
    }
  }

  /**
   * Process performance metrics from Cursor CLI
   */
  async processPerformanceMetrics(performanceMetrics) {
    try {
      console.log(
        `📊 Processing ${performanceMetrics.length} performance metrics...`
      );

      for (const metrics of performanceMetrics) {
        // Analyze performance trends
        await this.analyzePerformanceTrends(metrics);

        // Learn from performance patterns
        await this.learnFromPerformancePatterns(metrics);

        // Store metrics
        const key = `perf_metrics_${metrics.timestamp}`;
        this.performanceMetrics.set(key, {
          ...metrics,
          category: this.categories.SYSTEM_PERFORMANCE,
        });

        // Store in Firestore if available
        if (this.firestoreStorage) {
          await this.firestoreStorage.storePerformanceMetrics([metrics]);
        }
      }

      
    } catch (error) {
      console.error('❌ Failed to process performance metrics:', error);
    }
  }

  /**
   * Process workspace data from Cursor CLI
   */
  async processWorkspaceData(workspaceData) {
    try {
      

      // Analyze workspace structure
      await this.analyzeWorkspaceStructure(workspaceData);

      // Learn from project patterns
      await this.learnFromProjectPatterns(workspaceData);

      // Store workspace analysis
      const key = `workspace_${workspaceData.timestamp}`;
      this.patterns.set(key, {
        ...workspaceData,
        category: this.categories.WORKSPACE_ANALYSIS,
      });

      // Store in Firestore if available
      if (this.firestoreStorage) {
        await this.firestoreStorage.storeWorkspaceAnalysis(workspaceData);
      }

      
    } catch (error) {
      console.error('❌ Failed to process workspace data:', error);
    }
  }

  /**
   * Process system data
   */
  async processSystemData(systemData) {
    try {
      

      // Store system data
      const key = `system_${systemData.timestamp}`;
      this.performanceMetrics.set(key, {
        ...systemData,
        category: this.categories.SYSTEM_PERFORMANCE,
      });

      // Store in Firestore if available
      if (this.firestoreStorage) {
        await this.firestoreStorage.storePerformanceMetrics([systemData]);
      }

      
    } catch (error) {
      console.error('❌ Failed to process system data:', error);
    }
  }

  // Placeholder methods for learning algorithms
  async learnFromFileChangePattern(change) {
    // Implement file change pattern learning
  }

  async analyzeCodeComplexityPattern(pattern) {
    // Implement code complexity analysis
  }

  async learnFromImportPatterns(imports) {
    // Implement import pattern learning
  }

  async learnFromFunctionPatterns(functions) {
    // Implement function pattern learning
  }

  async learnFromErrorHandlingPatterns(errorHandling) {
    // Implement error handling pattern learning
  }

  async analyzeDebuggingPattern(session) {
    // Implement debugging pattern analysis
  }

  async learnFromDebuggingSession(session) {
    // Implement debugging session learning
  }

  async analyzePerformanceTrends(metrics) {
    // Implement performance trend analysis
  }

  async learnFromPerformancePatterns(metrics) {
    // Implement performance pattern learning
  }

  async analyzeWorkspaceStructure(workspaceData) {
    // Implement workspace structure analysis
  }

  /**
   * Update learning metrics
   */
  async updateLearningMetrics() {
    try {
      // Update performance metrics
      this.performanceMetrics.set('lastUpdate', new Date().toISOString());
      this.performanceMetrics.set('totalPatterns', this.patterns.size);
      this.performanceMetrics.set('totalRules', this.learningRules.size);

      
    } catch (error) {
      console.error('❌ Failed to update learning metrics:', error);
    }
  }

  /**
   * Generate improvement suggestions
   */
  async generateImprovementSuggestions() {
    try {
      

      const suggestions = [];

      // Analyze learning data for patterns
      const patterns = this.analyzeLearningPatterns();

      // Generate suggestions based on patterns
      if (patterns.errorPatterns.length > 0) {
        suggestions.push({
          type: 'error_prevention',
          priority: 'high',
          suggestion: 'Implement better error handling patterns',
          confidence: 0.8,
        });
      }

      if (patterns.performanceIssues.length > 0) {
        suggestions.push({
          type: 'performance_optimization',
          priority: 'medium',
          suggestion: 'Optimize performance bottlenecks',
          confidence: 0.7,
        });
      }

      if (patterns.codeQualityIssues.length > 0) {
        suggestions.push({
          type: 'code_quality',
          priority: 'medium',
          suggestion: 'Improve code quality standards',
          confidence: 0.6,
        });
      }

      
      return suggestions;
    } catch (error) {
      console.error('Error generating improvement suggestions:', error);
      return [];
    }
  }

  /**
   * Analyze learning patterns
   */
  analyzeLearningPatterns() {
    return {
      errorPatterns: [],
      performanceIssues: [],
      codeQualityIssues: [],
      userBehaviorPatterns: [],
      systemOptimizations: [],
    };
  }

  /**
   * Process file change
   */
  async processFileChange(change) {
    try {
      await this.processFileChanges([change]);
    } catch (error) {
      console.error('❌ Failed to process file change:', error);
    }
  }
}

module.exports = ComprehensiveLearningLoop;
module.exports.ComprehensiveLearningLoop = ComprehensiveLearningLoop;
