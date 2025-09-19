/**
 * 🧠 Round-Based Learning System
 *
 * Learns from each round of testing and debugging to improve performance
 * Continuously adapts strategies based on success/failure patterns
 */

class RoundBasedLearningSystem {
  constructor() {
    this.name = 'Round-Based Learning System';
    this.version = '1.0.0';
    this.isActive = false;

    // Round tracking
    this.currentRound = 0;
    this.roundHistory = new Map();
    this.roundMetrics = new Map();

    // Learning data
    this.successPatterns = new Map();
    this.failurePatterns = new Map();
    this.improvementStrategies = new Map();
    this.adaptationRules = new Map();

    // Performance tracking
    this.performanceHistory = [];
    this.improvementTrends = new Map();
    this.efficiencyMetrics = new Map();

    console.log(`🧠 ${this.name} v${this.version} initialized`);
  }

  /**
   * Initialize the learning system
   */
  async initialize() {
    try {
      console.log('🚀 Initializing Round-Based Learning System...');

      // Load previous round data
      await this.loadRoundHistory();

      // Initialize learning models
      await this.initializeLearningModels();

      // Start learning loop
      this.startLearningLoop();

      this.isActive = true;
      console.log('✅ Round-Based Learning System initialized successfully');

      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Learning System:', error.message);
      return false;
    }
  }

  /**
   * Start a new round
   */
  async startNewRound(roundType = 'test') {
    try {
      this.currentRound++;
      const roundId = `round_${this.currentRound}_${Date.now()}`;

      console.log(`🎯 Starting Round ${this.currentRound}: ${roundType}`);

      const roundData = {
        id: roundId,
        type: roundType,
        startTime: Date.now(),
        endTime: null,
        status: 'running',
        tests: [],
        issues: [],
        fixes: [],
        metrics: {
          totalTests: 0,
          passedTests: 0,
          failedTests: 0,
          issuesDetected: 0,
          fixesApplied: 0,
          successRate: 0.0,
          efficiency: 0.0,
        },
        learning: {
          patternsLearned: 0,
          strategiesImproved: 0,
          adaptationsApplied: 0,
        },
      };

      this.roundHistory.set(roundId, roundData);
      this.roundMetrics.set(this.currentRound, roundData);

      console.log(`📊 Round ${this.currentRound} started with ID: ${roundId}`);

      return roundId;
    } catch (error) {
      console.error('❌ Error starting new round:', error.message);
      return null;
    }
  }

  /**
   * Record test result in current round
   */
  async recordTestResult(roundId, testData) {
    try {
      const round = this.roundHistory.get(roundId);
      if (!round) {
        throw new Error(`Round ${roundId} not found`);
      }

      const testResult = {
        id: `test_${Date.now()}`,
        name: testData.name || 'Unknown Test',
        type: testData.type || 'generic',
        status: testData.status || 'unknown',
        duration: testData.duration || 0,
        error: testData.error || null,
        details: testData.details || {},
        timestamp: Date.now(),
      };

      round.tests.push(testResult);
      round.metrics.totalTests++;

      if (testResult.status === 'passed') {
        round.metrics.passedTests++;
      } else if (testResult.status === 'failed') {
        round.metrics.failedTests++;
      }

      // Update success rate
      round.metrics.successRate =
        round.metrics.passedTests / round.metrics.totalTests;

      console.log(
        `📝 Test recorded: ${testResult.name} - ${testResult.status}`
      );

      return testResult;
    } catch (error) {
      console.error('❌ Error recording test result:', error.message);
      return null;
    }
  }

  /**
   * Record issue detection in current round
   */
  async recordIssueDetection(roundId, issueData) {
    try {
      const round = this.roundHistory.get(roundId);
      if (!round) {
        throw new Error(`Round ${roundId} not found`);
      }

      const issue = {
        id: `issue_${Date.now()}`,
        type: issueData.type || 'unknown',
        severity: issueData.severity || 'medium',
        message: issueData.message || '',
        context: issueData.context || {},
        detectionTime: Date.now(),
        resolution: null,
      };

      round.issues.push(issue);
      round.metrics.issuesDetected++;

      console.log(`🐛 Issue recorded: ${issue.type} - ${issue.severity}`);

      return issue;
    } catch (error) {
      console.error('❌ Error recording issue detection:', error.message);
      return null;
    }
  }

  /**
   * Record fix application in current round
   */
  async recordFixApplication(roundId, fixData) {
    try {
      const round = this.roundHistory.get(roundId);
      if (!round) {
        throw new Error(`Round ${roundId} not found`);
      }

      const fix = {
        id: `fix_${Date.now()}`,
        issueId: fixData.issueId || null,
        strategy: fixData.strategy || 'unknown',
        success: fixData.success || false,
        duration: fixData.duration || 0,
        details: fixData.details || {},
        appliedTime: Date.now(),
      };

      round.fixes.push(fix);
      round.metrics.fixesApplied++;

      console.log(
        `🔧 Fix recorded: ${fix.strategy} - ${
          fix.success ? 'SUCCESS' : 'FAILED'
        }`
      );

      return fix;
    } catch (error) {
      console.error('❌ Error recording fix application:', error.message);
      return null;
    }
  }

  /**
   * Complete a round and analyze results
   */
  async completeRound(roundId) {
    try {
      const round = this.roundHistory.get(roundId);
      if (!round) {
        throw new Error(`Round ${roundId} not found`);
      }

      round.endTime = Date.now();
      round.status = 'completed';
      round.metrics.duration = round.endTime - round.startTime;

      // Calculate efficiency
      round.metrics.efficiency = this.calculateEfficiency(round);

      console.log(`✅ Round ${this.currentRound} completed`);
      console.log(
        `📊 Results: ${round.metrics.passedTests}/${round.metrics.totalTests} tests passed`
      );
      console.log(
        `🐛 Issues: ${round.metrics.issuesDetected} detected, ${round.metrics.fixesApplied} fixed`
      );
      console.log(
        `⚡ Efficiency: ${(round.metrics.efficiency * 100).toFixed(1)}%`
      );

      // Analyze round results
      await this.analyzeRoundResults(round);

      // Learn from round
      await this.learnFromRound(round);

      // Update performance history
      this.updatePerformanceHistory(round);

      // Generate improvements for next round
      await this.generateRoundImprovements(round);

      return round;
    } catch (error) {
      console.error('❌ Error completing round:', error.message);
      return null;
    }
  }

  /**
   * Calculate round efficiency
   */
  calculateEfficiency(round) {
    const metrics = round.metrics;

    // Efficiency factors
    const testEfficiency = metrics.successRate;
    const issueResolutionRate =
      metrics.issuesDetected > 0
        ? metrics.fixesApplied / metrics.issuesDetected
        : 1.0;
    const timeEfficiency = Math.max(0, 1 - metrics.duration / (5 * 60 * 1000)); // 5 min baseline

    // Weighted average
    return (
      testEfficiency * 0.5 + issueResolutionRate * 0.3 + timeEfficiency * 0.2
    );
  }

  /**
   * Analyze round results
   */
  async analyzeRoundResults(round) {
    try {
      console.log(`🔍 Analyzing Round ${this.currentRound} results...`);

      // Analyze test patterns
      const testAnalysis = this.analyzeTestPatterns(round.tests);

      // Analyze issue patterns
      const issueAnalysis = this.analyzeIssuePatterns(round.issues);

      // Analyze fix patterns
      const fixAnalysis = this.analyzeFixPatterns(round.fixes);

      // Store analysis
      round.analysis = {
        tests: testAnalysis,
        issues: issueAnalysis,
        fixes: fixAnalysis,
        timestamp: Date.now(),
      };

      console.log(`📈 Analysis completed for Round ${this.currentRound}`);
    } catch (error) {
      console.error('❌ Error analyzing round results:', error.message);
    }
  }

  /**
   * Analyze test patterns
   */
  analyzeTestPatterns(tests) {
    const analysis = {
      totalTests: tests.length,
      passedTests: tests.filter(t => t.status === 'passed').length,
      failedTests: tests.filter(t => t.status === 'failed').length,
      averageDuration:
        tests.reduce((sum, t) => sum + t.duration, 0) / tests.length,
      testTypes: {},
      failureReasons: {},
      successFactors: [],
    };

    // Analyze test types
    for (const test of tests) {
      analysis.testTypes[test.type] = (analysis.testTypes[test.type] || 0) + 1;

      if (test.status === 'failed' && test.error) {
        const reason = this.categorizeFailureReason(test.error);
        analysis.failureReasons[reason] =
          (analysis.failureReasons[reason] || 0) + 1;
      }

      if (test.status === 'passed') {
        analysis.successFactors.push({
          test: test.name,
          duration: test.duration,
          type: test.type,
        });
      }
    }

    return analysis;
  }

  /**
   * Analyze issue patterns
   */
  analyzeIssuePatterns(issues) {
    const analysis = {
      totalIssues: issues.length,
      issueTypes: {},
      severityDistribution: {},
      resolutionRate: 0,
      commonPatterns: [],
    };

    for (const issue of issues) {
      analysis.issueTypes[issue.type] =
        (analysis.issueTypes[issue.type] || 0) + 1;
      analysis.severityDistribution[issue.severity] =
        (analysis.severityDistribution[issue.severity] || 0) + 1;
    }

    // Calculate resolution rate
    const resolvedIssues = issues.filter(
      i => i.resolution && i.resolution.success
    );
    analysis.resolutionRate =
      issues.length > 0 ? resolvedIssues.length / issues.length : 0;

    return analysis;
  }

  /**
   * Analyze fix patterns
   */
  analyzeFixPatterns(fixes) {
    const analysis = {
      totalFixes: fixes.length,
      successfulFixes: fixes.filter(f => f.success).length,
      fixStrategies: {},
      averageFixDuration:
        fixes.reduce((sum, f) => sum + f.duration, 0) / fixes.length,
      effectivenessByStrategy: {},
    };

    for (const fix of fixes) {
      analysis.fixStrategies[fix.strategy] =
        (analysis.fixStrategies[fix.strategy] || 0) + 1;

      if (!analysis.effectivenessByStrategy[fix.strategy]) {
        analysis.effectivenessByStrategy[fix.strategy] = {
          total: 0,
          successful: 0,
        };
      }

      analysis.effectivenessByStrategy[fix.strategy].total++;
      if (fix.success) {
        analysis.effectivenessByStrategy[fix.strategy].successful++;
      }
    }

    return analysis;
  }

  /**
   * Learn from round
   */
  async learnFromRound(round) {
    try {
      console.log(`🧠 Learning from Round ${this.currentRound}...`);

      // Learn from successful patterns
      await this.learnFromSuccesses(round);

      // Learn from failures
      await this.learnFromFailures(round);

      // Update improvement strategies
      await this.updateImprovementStrategies(round);

      // Adapt rules based on performance
      await this.adaptRules(round);

      round.learning.patternsLearned =
        this.successPatterns.size + this.failurePatterns.size;
      round.learning.strategiesImproved = this.improvementStrategies.size;
      round.learning.adaptationsApplied = this.adaptationRules.size;

      console.log(`✅ Learning completed for Round ${this.currentRound}`);
    } catch (error) {
      console.error('❌ Error learning from round:', error.message);
    }
  }

  /**
   * Learn from successful patterns
   */
  async learnFromSuccesses(round) {
    const successfulTests = round.tests.filter(t => t.status === 'passed');
    const successfulFixes = round.fixes.filter(f => f.success);

    // Extract success patterns
    for (const test of successfulTests) {
      const pattern = this.extractSuccessPattern(test);
      if (pattern) {
        this.successPatterns.set(pattern.id, {
          ...pattern,
          occurrences:
            (this.successPatterns.get(pattern.id)?.occurrences || 0) + 1,
          lastSeen: Date.now(),
        });
      }
    }

    for (const fix of successfulFixes) {
      const pattern = this.extractFixPattern(fix);
      if (pattern) {
        this.successPatterns.set(pattern.id, {
          ...pattern,
          occurrences:
            (this.successPatterns.get(pattern.id)?.occurrences || 0) + 1,
          lastSeen: Date.now(),
        });
      }
    }
  }

  /**
   * Learn from failures
   */
  async learnFromFailures(round) {
    const failedTests = round.tests.filter(t => t.status === 'failed');
    const failedFixes = round.fixes.filter(f => !f.success);

    // Extract failure patterns
    for (const test of failedTests) {
      const pattern = this.extractFailurePattern(test);
      if (pattern) {
        this.failurePatterns.set(pattern.id, {
          ...pattern,
          occurrences:
            (this.failurePatterns.get(pattern.id)?.occurrences || 0) + 1,
          lastSeen: Date.now(),
        });
      }
    }

    for (const fix of failedFixes) {
      const pattern = this.extractFailurePattern(fix);
      if (pattern) {
        this.failurePatterns.set(pattern.id, {
          ...pattern,
          occurrences:
            (this.failurePatterns.get(pattern.id)?.occurrences || 0) + 1,
          lastSeen: Date.now(),
        });
      }
    }
  }

  /**
   * Extract success pattern
   */
  extractSuccessPattern(test) {
    return {
      id: `success_${test.type}_${test.name}`,
      type: 'test_success',
      testType: test.type,
      testName: test.name,
      duration: test.duration,
      factors: test.details.successFactors || [],
    };
  }

  /**
   * Extract fix pattern
   */
  extractFixPattern(fix) {
    return {
      id: `fix_success_${fix.strategy}`,
      type: 'fix_success',
      strategy: fix.strategy,
      duration: fix.duration,
      factors: fix.details.successFactors || [],
    };
  }

  /**
   * Extract failure pattern
   */
  extractFailurePattern(item) {
    return {
      id: `failure_${item.type || item.strategy}_${Date.now()}`,
      type: item.type || 'fix_failure',
      error: item.error || item.details.error,
      context: item.context || item.details.context,
      factors: item.details.failureFactors || [],
    };
  }

  /**
   * Update improvement strategies
   */
  async updateImprovementStrategies(round) {
    const analysis = round.analysis;

    // Update strategies based on test analysis
    if (analysis.tests.failureReasons) {
      for (const [reason, count] of Object.entries(
        analysis.tests.failureReasons
      )) {
        const strategy = this.generateImprovementStrategy(
          'test_failure',
          reason,
          count
        );
        this.improvementStrategies.set(strategy.id, strategy);
      }
    }

    // Update strategies based on fix analysis
    if (analysis.fixes.effectivenessByStrategy) {
      for (const [strategy, effectiveness] of Object.entries(
        analysis.fixes.effectivenessByStrategy
      )) {
        if (effectiveness.successful / effectiveness.total < 0.7) {
          const improvement = this.generateImprovementStrategy(
            'fix_ineffectiveness',
            strategy,
            effectiveness
          );
          this.improvementStrategies.set(improvement.id, improvement);
        }
      }
    }
  }

  /**
   * Generate improvement strategy
   */
  generateImprovementStrategy(type, target, data) {
    return {
      id: `strategy_${type}_${target}_${Date.now()}`,
      type: type,
      target: target,
      data: data,
      priority: this.calculateStrategyPriority(type, data),
      actions: this.generateStrategyActions(type, target),
      createdAt: Date.now(),
    };
  }

  /**
   * Calculate strategy priority
   */
  calculateStrategyPriority(type, data) {
    if (type === 'test_failure') {
      return Math.min(10, data * 2); // Higher count = higher priority
    } else if (type === 'fix_ineffectiveness') {
      return Math.min(10, (1 - data.successful / data.total) * 10);
    }
    return 5;
  }

  /**
   * Generate strategy actions
   */
  generateStrategyActions(type, target) {
    const actionTemplates = {
      test_failure: {
        connection: [
          'improve_retry_logic',
          'add_fallback_mechanism',
          'enhance_error_handling',
        ],
        initialization: [
          'fix_method_names',
          'add_singleton_pattern',
          'improve_dependency_management',
        ],
        validation: [
          'enhance_data_validation',
          'improve_schema_validation',
          'add_error_recovery',
        ],
      },
      fix_ineffectiveness: {
        default: [
          'analyze_fix_strategy',
          'improve_fix_generation',
          'enhance_validation',
        ],
      },
    };

    const actions = actionTemplates[type]?.[target] ||
      actionTemplates[type]?.['default'] || ['generic_improvement'];
    return actions;
  }

  /**
   * Adapt rules based on performance
   */
  async adaptRules(round) {
    const efficiency = round.metrics.efficiency;

    if (efficiency < 0.5) {
      // Low efficiency - add more aggressive rules
      this.adaptationRules.set('aggressive_mode', {
        enabled: true,
        reason: 'Low efficiency detected',
        actions: ['increase_monitoring', 'reduce_timeouts', 'add_fallbacks'],
      });
    } else if (efficiency > 0.8) {
      // High efficiency - optimize for speed
      this.adaptationRules.set('optimization_mode', {
        enabled: true,
        reason: 'High efficiency detected',
        actions: [
          'reduce_monitoring',
          'increase_timeouts',
          'streamline_processes',
        ],
      });
    }
  }

  /**
   * Update performance history
   */
  updatePerformanceHistory(round) {
    const performanceData = {
      round: this.currentRound,
      timestamp: Date.now(),
      efficiency: round.metrics.efficiency,
      successRate: round.metrics.successRate,
      issuesDetected: round.metrics.issuesDetected,
      fixesApplied: round.metrics.fixesApplied,
      duration: round.metrics.duration,
    };

    this.performanceHistory.push(performanceData);

    // Keep only last 50 rounds
    if (this.performanceHistory.length > 50) {
      this.performanceHistory = this.performanceHistory.slice(-50);
    }
  }

  /**
   * Generate improvements for next round
   */
  async generateRoundImprovements(round) {
    try {
      console.log(
        `🎯 Generating improvements for Round ${this.currentRound + 1}...`
      );

      const improvements = {
        round: this.currentRound + 1,
        basedOn: this.currentRound,
        timestamp: Date.now(),
        recommendations: [],
        adaptations: [],
        optimizations: [],
      };

      // Generate recommendations based on analysis
      if (round.analysis.tests.failureReasons) {
        for (const [reason, count] of Object.entries(
          round.analysis.tests.failureReasons
        )) {
          improvements.recommendations.push({
            type: 'test_improvement',
            target: reason,
            priority: count,
            action: `Address ${reason} failures (${count} occurrences)`,
          });
        }
      }

      // Generate adaptations based on performance
      if (round.metrics.efficiency < 0.6) {
        improvements.adaptations.push({
          type: 'efficiency_improvement',
          action: 'Implement more aggressive error handling',
          priority: 'high',
        });
      }

      // Generate optimizations based on patterns
      const topFailurePatterns = Array.from(this.failurePatterns.entries())
        .sort((a, b) => b[1].occurrences - a[1].occurrences)
        .slice(0, 3);

      for (const [patternId, pattern] of topFailurePatterns) {
        improvements.optimizations.push({
          type: 'pattern_optimization',
          pattern: patternId,
          occurrences: pattern.occurrences,
          action: `Optimize handling of ${pattern.type} patterns`,
        });
      }

      // Store improvements
      this.improvementTrends.set(this.currentRound + 1, improvements);

      console.log(
        `✅ Generated ${improvements.recommendations.length} recommendations for next round`
      );

      return improvements;
    } catch (error) {
      console.error('❌ Error generating round improvements:', error.message);
      return null;
    }
  }

  /**
   * Categorize failure reason
   */
  categorizeFailureReason(error) {
    const errorMessage = error.message || error.toString();

    if (
      errorMessage.includes('not a function') ||
      errorMessage.includes('not a constructor')
    ) {
      return 'initialization';
    } else if (
      errorMessage.includes('ECONNREFUSED') ||
      errorMessage.includes('ETIMEDOUT')
    ) {
      return 'connection';
    } else if (
      errorMessage.includes('validation') ||
      errorMessage.includes('invalid')
    ) {
      return 'validation';
    } else if (errorMessage.includes('timeout')) {
      return 'timeout';
    } else {
      return 'unknown';
    }
  }

  /**
   * Load round history
   */
  async loadRoundHistory() {
    try {
      console.log('📚 Loading round history...');
      // Implementation would load from persistent storage
    } catch (error) {
      console.log('⚠️ No round history found, starting fresh');
    }
  }

  /**
   * Initialize learning models
   */
  async initializeLearningModels() {
    try {
      console.log('🤖 Initializing learning models...');
      // Implementation would initialize ML models
    } catch (error) {
      console.error('❌ Error initializing learning models:', error.message);
    }
  }

  /**
   * Start learning loop
   */
  startLearningLoop() {
    console.log('🔄 Starting learning loop...');

    // Run learning analysis every 10 minutes
    setInterval(() => {
      this.runLearningAnalysis();
    }, 600000);
  }

  /**
   * Run learning analysis
   */
  async runLearningAnalysis() {
    try {
      console.log('🧠 Running learning analysis...');

      // Analyze performance trends
      this.analyzePerformanceTrends();

      // Update learning models
      this.updateLearningModels();

      // Generate insights
      this.generateLearningInsights();
    } catch (error) {
      console.error('❌ Learning analysis error:', error.message);
    }
  }

  /**
   * Analyze performance trends
   */
  analyzePerformanceTrends() {
    if (this.performanceHistory.length < 3) return;

    const recent = this.performanceHistory.slice(-5);
    const trend = this.calculateTrend(recent.map(p => p.efficiency));

    console.log(
      `📈 Performance trend: ${
        trend > 0 ? 'IMPROVING' : trend < 0 ? 'DECLINING' : 'STABLE'
      }`
    );
  }

  /**
   * Calculate trend
   */
  calculateTrend(values) {
    if (values.length < 2) return 0;

    let trend = 0;
    for (let i = 1; i < values.length; i++) {
      trend += values[i] - values[i - 1];
    }

    return trend / (values.length - 1);
  }

  /**
   * Update learning models
   */
  updateLearningModels() {
    console.log('🤖 Updating learning models...');
    // Implementation would update ML models
  }

  /**
   * Generate learning insights
   */
  generateLearningInsights() {
    console.log('💡 Generating learning insights...');
    // Implementation would generate insights
  }

  /**
   * Get system status
   */
  getStatus() {
    return {
      isActive: this.isActive,
      currentRound: this.currentRound,
      totalRounds: this.roundHistory.size,
      successPatterns: this.successPatterns.size,
      failurePatterns: this.failurePatterns.size,
      improvementStrategies: this.improvementStrategies.size,
      adaptationRules: this.adaptationRules.size,
    };
  }

  /**
   * Get learning insights
   */
  getLearningInsights() {
    const insights = {
      totalRounds: this.currentRound,
      averageEfficiency: this.calculateAverageEfficiency(),
      improvementTrend: this.calculateImprovementTrend(),
      topSuccessPatterns: this.getTopSuccessPatterns(),
      topFailurePatterns: this.getTopFailurePatterns(),
      recommendations: this.getCurrentRecommendations(),
    };

    return insights;
  }

  /**
   * Calculate average efficiency
   */
  calculateAverageEfficiency() {
    if (this.performanceHistory.length === 0) return 0;

    const sum = this.performanceHistory.reduce(
      (acc, p) => acc + p.efficiency,
      0
    );
    return sum / this.performanceHistory.length;
  }

  /**
   * Calculate improvement trend
   */
  calculateImprovementTrend() {
    if (this.performanceHistory.length < 3) return 0;

    const recent = this.performanceHistory.slice(-3);
    return this.calculateTrend(recent.map(p => p.efficiency));
  }

  /**
   * Get top success patterns
   */
  getTopSuccessPatterns() {
    return Array.from(this.successPatterns.entries())
      .sort((a, b) => b[1].occurrences - a[1].occurrences)
      .slice(0, 5)
      .map(([id, pattern]) => ({ id, ...pattern }));
  }

  /**
   * Get top failure patterns
   */
  getTopFailurePatterns() {
    return Array.from(this.failurePatterns.entries())
      .sort((a, b) => b[1].occurrences - a[1].occurrences)
      .slice(0, 5)
      .map(([id, pattern]) => ({ id, ...pattern }));
  }

  /**
   * Track a new round
   */
  async trackRound(roundData) {
    try {
      console.log(`🔄 Tracking round: ${roundData.roundId}`);

      const round = {
        roundId: roundData.roundId,
        timestamp: roundData.timestamp || new Date(),
        startTime: Date.now(),
        endTime: null,
        status: 'active',
        actions: roundData.actions || [],
        outcomes: roundData.outcomes || [],
        performance: roundData.performance || { score: 0, metrics: {} },
        context: roundData.context || {},
        metrics: {
          totalTests: 0,
          passedTests: 0,
          failedTests: 0,
          issuesDetected: 0,
          fixesApplied: 0,
          efficiency: 0,
          duration: 0,
        },
        fixes: [],
        learning: {
          patterns: [],
          insights: [],
          improvements: [],
        },
      };

      this.roundHistory.set(roundData.roundId, round);
      this.currentRound = roundData.roundId;

      console.log(`✅ Round ${roundData.roundId} tracked successfully`);
      return true;
    } catch (error) {
      console.error('❌ Error tracking round:', error.message);
      return false;
    }
  }

  /**
   * Generate recommendations
   */
  async generateRecommendations() {
    try {
      console.log('💡 Generating recommendations...');

      const recommendations = [];

      // Analyze recent rounds
      const recentRounds = Array.from(this.roundHistory.values())
        .slice(-5)
        .filter(round => round.status === 'completed');

      if (recentRounds.length === 0) {
        return recommendations;
      }

      // Performance-based recommendations
      const avgEfficiency =
        recentRounds.reduce((sum, round) => sum + round.metrics.efficiency, 0) /
        recentRounds.length;

      if (avgEfficiency < 0.7) {
        recommendations.push({
          type: 'performance',
          priority: 'high',
          suggestion: 'Improve system efficiency',
          confidence: 0.8,
        });
      }

      // Error-based recommendations
      const totalErrors = recentRounds.reduce(
        (sum, round) => sum + round.metrics.failedTests,
        0
      );

      if (totalErrors > recentRounds.length * 2) {
        recommendations.push({
          type: 'error_reduction',
          priority: 'high',
          suggestion: 'Focus on error reduction strategies',
          confidence: 0.9,
        });
      }

      // Learning-based recommendations
      const learningRate = this.calculateLearningRate();
      if (learningRate < 0.5) {
        recommendations.push({
          type: 'learning',
          priority: 'medium',
          suggestion: 'Enhance learning mechanisms',
          confidence: 0.7,
        });
      }

      console.log(`✅ Generated ${recommendations.length} recommendations`);
      return recommendations;
    } catch (error) {
      console.error('❌ Error generating recommendations:', error.message);
      return [];
    }
  }

  /**
   * Calculate learning rate
   */
  calculateLearningRate() {
    const rounds = Array.from(this.roundHistory.values());
    if (rounds.length < 2) return 0;

    const recent = rounds.slice(-3);
    const older = rounds.slice(-6, -3);

    if (older.length === 0) return 0;

    const recentAvg =
      recent.reduce((sum, round) => sum + round.metrics.efficiency, 0) /
      recent.length;
    const olderAvg =
      older.reduce((sum, round) => sum + round.metrics.efficiency, 0) /
      older.length;

    return Math.max(0, (recentAvg - olderAvg) / olderAvg);
  }

  /**
   * Learn from rounds
   */
  async learnFromRounds() {
    try {
      console.log('🎓 Learning from rounds...');

      const rounds = Array.from(this.roundHistory.values());
      if (rounds.length === 0) {
        console.log('No rounds to learn from');
        return true;
      }

      // Analyze successful patterns
      const successfulRounds = rounds.filter(
        round => round.metrics.efficiency > 0.7
      );

      if (successfulRounds.length > 0) {
        await this.extractSuccessPatterns(successfulRounds);
      }

      // Analyze failure patterns
      const failedRounds = rounds.filter(
        round => round.metrics.efficiency < 0.5
      );

      if (failedRounds.length > 0) {
        await this.extractFailurePatterns(failedRounds);
      }

      // Update learning models
      await this.updateLearningModels();

      console.log(`✅ Learned from ${rounds.length} rounds`);
      return true;
    } catch (error) {
      console.error('❌ Error learning from rounds:', error.message);
      return false;
    }
  }

  /**
   * Get learning metrics
   */
  getLearningMetrics() {
    try {
      const rounds = Array.from(this.roundHistory.values());
      const completedRounds = rounds.filter(
        round => round.status === 'completed'
      );

      if (completedRounds.length === 0) {
        return {
          totalRounds: 0,
          completedRounds: 0,
          averageEfficiency: 0,
          learningRate: 0,
          successRate: 0,
        };
      }

      const avgEfficiency =
        completedRounds.reduce(
          (sum, round) => sum + round.metrics.efficiency,
          0
        ) / completedRounds.length;

      const successRate =
        completedRounds.filter(round => round.metrics.efficiency > 0.7).length /
        completedRounds.length;

      return {
        totalRounds: rounds.length,
        completedRounds: completedRounds.length,
        averageEfficiency: avgEfficiency,
        learningRate: this.calculateLearningRate(),
        successRate: successRate,
        successPatterns: this.successPatterns.size,
        failurePatterns: this.failurePatterns.size,
      };
    } catch (error) {
      console.error('❌ Error getting learning metrics:', error.message);
      return null;
    }
  }

  /**
   * Extract success patterns
   */
  async extractSuccessPatterns(successfulRounds) {
    try {
      for (const round of successfulRounds) {
        const patternId = `success_${round.roundId}`;
        this.successPatterns.set(patternId, {
          roundId: round.roundId,
          actions: round.actions,
          context: round.context,
          efficiency: round.metrics.efficiency,
          timestamp: round.timestamp,
          occurrences: 1,
        });
      }

      console.log(`✅ Extracted ${successfulRounds.length} success patterns`);
    } catch (error) {
      console.error('❌ Error extracting success patterns:', error.message);
    }
  }

  /**
   * Extract failure patterns
   */
  async extractFailurePatterns(failedRounds) {
    try {
      for (const round of failedRounds) {
        const patternId = `failure_${round.roundId}`;
        this.failurePatterns.set(patternId, {
          roundId: round.roundId,
          actions: round.actions,
          context: round.context,
          efficiency: round.metrics.efficiency,
          timestamp: round.timestamp,
          occurrences: 1,
        });
      }

      console.log(`✅ Extracted ${failedRounds.length} failure patterns`);
    } catch (error) {
      console.error('❌ Error extracting failure patterns:', error.message);
    }
  }

  /**
   * Update learning models
   */
  async updateLearningModels() {
    try {
      // Update success pattern occurrences
      for (const [id, pattern] of this.successPatterns.entries()) {
        pattern.occurrences = (pattern.occurrences || 0) + 1;
      }

      // Update failure pattern occurrences
      for (const [id, pattern] of this.failurePatterns.entries()) {
        pattern.occurrences = (pattern.occurrences || 0) + 1;
      }

      console.log('✅ Learning models updated');
    } catch (error) {
      console.error('❌ Error updating learning models:', error.message);
    }
  }

  /**
   * Analyze performance
   */
  async analyzePerformance() {
    try {
      console.log('📊 Analyzing performance...');

      const rounds = Array.from(this.roundHistory.values());
      if (rounds.length === 0) {
        return {
          analysis: 'No rounds to analyze',
          trends: [],
          recommendations: [],
        };
      }

      // Calculate performance trends
      const trends = this.calculatePerformanceTrends();

      // Generate performance recommendations
      const recommendations =
        await this.generatePerformanceRecommendations(trends);

      const analysis = {
        totalRounds: rounds.length,
        averageEfficiency: this.calculateAverageEfficiency(),
        performanceTrend: trends.overall,
        trends: trends,
        recommendations: recommendations,
        timestamp: new Date(),
      };

      console.log('✅ Performance analysis completed');
      return analysis;
    } catch (error) {
      console.error('❌ Error analyzing performance:', error.message);
      return null;
    }
  }

  /**
   * Calculate performance trends
   */
  calculatePerformanceTrends() {
    const rounds = Array.from(this.roundHistory.values()).sort(
      (a, b) => a.timestamp - b.timestamp
    );

    if (rounds.length < 2) {
      return { overall: 'stable', efficiency: 'stable', errorRate: 'stable' };
    }

    const recent = rounds.slice(-3);
    const older = rounds.slice(-6, -3);

    const recentAvg =
      recent.reduce((sum, round) => sum + round.metrics.efficiency, 0) /
      recent.length;
    const olderAvg =
      older.length > 0
        ? older.reduce((sum, round) => sum + round.metrics.efficiency, 0) /
          older.length
        : recentAvg;

    const trend =
      recentAvg > olderAvg
        ? 'improving'
        : recentAvg < olderAvg
          ? 'declining'
          : 'stable';

    return {
      overall: trend,
      efficiency: trend,
      errorRate: trend,
      recentAverage: recentAvg,
      olderAverage: olderAvg,
    };
  }

  /**
   * Calculate average efficiency
   */
  calculateAverageEfficiency() {
    const rounds = Array.from(this.roundHistory.values());
    if (rounds.length === 0) return 0;

    return (
      rounds.reduce((sum, round) => sum + round.metrics.efficiency, 0) /
      rounds.length
    );
  }

  /**
   * Generate performance recommendations
   */
  async generatePerformanceRecommendations(trends) {
    const recommendations = [];

    if (trends.overall === 'declining') {
      recommendations.push({
        type: 'performance',
        priority: 'high',
        suggestion: 'Performance is declining, investigate bottlenecks',
        confidence: 0.9,
      });
    }

    if (trends.recentAverage < 0.6) {
      recommendations.push({
        type: 'efficiency',
        priority: 'high',
        suggestion: 'Low efficiency detected, optimize processes',
        confidence: 0.8,
      });
    }

    if (trends.overall === 'improving') {
      recommendations.push({
        type: 'maintenance',
        priority: 'low',
        suggestion: 'Performance is improving, maintain current practices',
        confidence: 0.7,
      });
    }

    return recommendations;
  }

  /**
   * Get current recommendations
   */
  getCurrentRecommendations() {
    const nextRound = this.currentRound + 1;
    const improvements = this.improvementTrends.get(nextRound);

    return improvements ? improvements.recommendations : [];
  }
}

module.exports = { RoundBasedLearningSystem };
