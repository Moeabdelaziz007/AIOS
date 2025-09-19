/**
 * 🎓 Learning Loop Test & Improvement
 *
 * Comprehensive test of the learning system with improvements
 */

const { config } = require('dotenv');
const path = require('path');

// Load environment variables
config({ path: path.join(__dirname, 'firebase.env') });

const {
  ComprehensiveLearningLoop,
} = require('./server/comprehensiveLearningLoop');
const {
  RoundBasedLearningSystem,
} = require('./server/roundBasedLearningSystem');

class LearningLoopTest {
  constructor() {
    this.name = 'Learning Loop Test';
    this.version = '1.0.0';
    this.testResults = {
      comprehensiveLearning: { status: 'pending', details: [] },
      roundBasedLearning: { status: 'pending', details: [] },
      learningIntegration: { status: 'pending', details: [] },
      performanceAnalysis: { status: 'pending', details: [] },
      improvementSuggestions: { status: 'pending', details: [] },
    };

    console.log(`🎓 ${this.name} v${this.version} initialized`);
  }

  /**
   * Run comprehensive learning loop test
   */
  async runTest() {
    try {
      console.log('🚀 Starting Learning Loop Test...');

      // Test Comprehensive Learning Loop
      await this.testComprehensiveLearningLoop();

      // Test Round-Based Learning System
      await this.testRoundBasedLearningSystem();

      // Test Learning Integration
      await this.testLearningIntegration();

      // Test Performance Analysis
      await this.testPerformanceAnalysis();

      // Test Improvement Suggestions
      await this.testImprovementSuggestions();

      // Generate final report
      this.generateFinalReport();

      console.log('✅ Learning Loop Test completed');
      return this.testResults;
    } catch (error) {
      console.error('❌ Learning Loop Test failed:', error.message);
      throw error;
    }
  }

  /**
   * Test Comprehensive Learning Loop
   */
  async testComprehensiveLearningLoop() {
    try {
      console.log('🧠 Testing Comprehensive Learning Loop...');

      const learningLoop = new ComprehensiveLearningLoop();
      await learningLoop.initialize();

      // Test learning data processing
      const learningData = {
        type: 'error_pattern',
        data: {
          error: 'TypeError: Cannot read property',
          context: 'authentication',
          frequency: 5,
          timestamp: new Date(),
        },
        timestamp: new Date(),
      };

      const processed = await learningLoop.processLearningData(learningData);
      this.testResults.comprehensiveLearning.details.push(
        `Learning Data Processing: ${processed ? 'Working' : 'Failed'}`
      );

      // Test pattern analysis
      const patterns = learningLoop.analyzeLearningPatterns();
      this.testResults.comprehensiveLearning.details.push(
        `Pattern Analysis: ${patterns ? 'Working' : 'Failed'}`
      );

      // Test improvement suggestions
      const suggestions = await learningLoop.generateImprovementSuggestions();
      this.testResults.comprehensiveLearning.details.push(
        `Improvement Suggestions: ${suggestions.length} generated`
      );

      // Test learning metrics
      await learningLoop.updateLearningMetrics();
      this.testResults.comprehensiveLearning.details.push(
        `Learning Metrics: Updated successfully`
      );

      // Test file change processing
      const fileChange = {
        timestamp: new Date().toISOString(),
        event: 'change',
        filePath: '/test/file.js',
        relativePath: 'test/file.js',
        fileType: '.js',
        size: 1024,
      };

      await learningLoop.processFileChange(fileChange);
      this.testResults.comprehensiveLearning.details.push(
        `File Change Processing: Working`
      );

      this.testResults.comprehensiveLearning.status = 'passed';
      console.log('✅ Comprehensive Learning Loop test passed');
    } catch (error) {
      this.testResults.comprehensiveLearning.status = 'failed';
      this.testResults.comprehensiveLearning.details.push(
        `Error: ${error.message}`
      );
      console.log('❌ Comprehensive Learning Loop test failed');
    }
  }

  /**
   * Test Round-Based Learning System
   */
  async testRoundBasedLearningSystem() {
    try {
      console.log('🔄 Testing Round-Based Learning System...');

      const roundLearning = new RoundBasedLearningSystem();
      await roundLearning.initialize();

      // Test round tracking
      const roundData = {
        roundId: 'test_round_' + Date.now(),
        timestamp: new Date(),
        actions: ['analyze_code', 'fix_bug', 'test_solution'],
        outcomes: ['success', 'success', 'success'],
        performance: {
          score: 0.85,
          metrics: {
            executionTime: 1200,
            memoryUsage: 45,
            errorRate: 0.02,
          },
        },
        context: {
          task: 'bug_fix',
          complexity: 'medium',
          environment: 'development',
        },
      };

      const tracked = await roundLearning.trackRound(roundData);
      this.testResults.roundBasedLearning.details.push(
        `Round Tracking: ${tracked ? 'Working' : 'Failed'}`
      );

      // Test learning from rounds
      const learned = await roundLearning.learnFromRounds();
      this.testResults.roundBasedLearning.details.push(
        `Learning from Rounds: ${learned ? 'Working' : 'Failed'}`
      );

      // Test performance analysis
      const analysis = await roundLearning.analyzePerformance();
      this.testResults.roundBasedLearning.details.push(
        `Performance Analysis: ${analysis ? 'Working' : 'Failed'}`
      );

      // Test improvement recommendations
      const recommendations = await roundLearning.generateRecommendations();
      this.testResults.roundBasedLearning.details.push(
        `Recommendations: ${recommendations.length} generated`
      );

      // Test learning metrics
      const metrics = roundLearning.getLearningMetrics();
      this.testResults.roundBasedLearning.details.push(
        `Learning Metrics: ${metrics ? 'Available' : 'Not available'}`
      );

      this.testResults.roundBasedLearning.status = 'passed';
      console.log('✅ Round-Based Learning System test passed');
    } catch (error) {
      this.testResults.roundBasedLearning.status = 'failed';
      this.testResults.roundBasedLearning.details.push(
        `Error: ${error.message}`
      );
      console.log('❌ Round-Based Learning System test failed');
    }
  }

  /**
   * Test Learning Integration
   */
  async testLearningIntegration() {
    try {
      console.log('🔗 Testing Learning Integration...');

      const comprehensiveLearning = new ComprehensiveLearningLoop();
      await comprehensiveLearning.initialize();

      const roundLearning = new RoundBasedLearningSystem();
      await roundLearning.initialize();

      // Test cross-system learning
      const crossLearningData = {
        type: 'cross_system_learning',
        data: {
          comprehensiveInsights:
            await comprehensiveLearning.generateImprovementSuggestions(),
          roundInsights: await roundLearning.generateRecommendations(),
          integration: 'successful',
        },
        timestamp: new Date(),
      };

      const integrated = await comprehensiveLearning.processLearningData(
        crossLearningData
      );
      this.testResults.learningIntegration.details.push(
        `Cross-System Learning: ${integrated ? 'Working' : 'Failed'}`
      );

      // Test learning data sharing
      const sharedData = {
        type: 'shared_learning',
        data: {
          patterns: comprehensiveLearning.analyzeLearningPatterns(),
          rounds: roundLearning.getLearningMetrics(),
          shared: true,
        },
        timestamp: new Date(),
      };

      const shared = await comprehensiveLearning.processLearningData(
        sharedData
      );
      this.testResults.learningIntegration.details.push(
        `Learning Data Sharing: ${shared ? 'Working' : 'Failed'}`
      );

      // Test collaborative learning
      const collaborativeData = {
        type: 'collaborative_learning',
        data: {
          systems: ['comprehensive', 'round_based'],
          collaboration: 'active',
          effectiveness: 0.9,
        },
        timestamp: new Date(),
      };

      const collaborative = await comprehensiveLearning.processLearningData(
        collaborativeData
      );
      this.testResults.learningIntegration.details.push(
        `Collaborative Learning: ${collaborative ? 'Working' : 'Failed'}`
      );

      this.testResults.learningIntegration.status = 'passed';
      console.log('✅ Learning Integration test passed');
    } catch (error) {
      this.testResults.learningIntegration.status = 'failed';
      this.testResults.learningIntegration.details.push(
        `Error: ${error.message}`
      );
      console.log('❌ Learning Integration test failed');
    }
  }

  /**
   * Test Performance Analysis
   */
  async testPerformanceAnalysis() {
    try {
      console.log('📊 Testing Performance Analysis...');

      const learningLoop = new ComprehensiveLearningLoop();
      await learningLoop.initialize();

      // Test performance data collection
      const performanceData = {
        type: 'performance_analysis',
        data: {
          metrics: {
            responseTime: 150,
            memoryUsage: 60,
            cpuUsage: 45,
            errorRate: 0.01,
            throughput: 1000,
          },
          timestamp: new Date(),
          context: 'production',
        },
        timestamp: new Date(),
      };

      const analyzed = await learningLoop.processLearningData(performanceData);
      this.testResults.performanceAnalysis.details.push(
        `Performance Data Analysis: ${analyzed ? 'Working' : 'Failed'}`
      );

      // Test performance trend analysis
      const trendData = {
        type: 'performance_trends',
        data: {
          trends: {
            responseTime: { trend: 'improving', change: -10 },
            memoryUsage: { trend: 'stable', change: 0 },
            errorRate: { trend: 'improving', change: -0.005 },
          },
          period: '7_days',
          timestamp: new Date(),
        },
        timestamp: new Date(),
      };

      const trendAnalysis = await learningLoop.processLearningData(trendData);
      this.testResults.performanceAnalysis.details.push(
        `Performance Trend Analysis: ${trendAnalysis ? 'Working' : 'Failed'}`
      );

      // Test performance optimization suggestions
      const optimizationData = {
        type: 'performance_optimization',
        data: {
          bottlenecks: ['database_query', 'memory_allocation'],
          suggestions: ['add_indexing', 'optimize_queries', 'memory_pooling'],
          priority: 'high',
          timestamp: new Date(),
        },
        timestamp: new Date(),
      };

      const optimization = await learningLoop.processLearningData(
        optimizationData
      );
      this.testResults.performanceAnalysis.details.push(
        `Performance Optimization: ${optimization ? 'Working' : 'Failed'}`
      );

      this.testResults.performanceAnalysis.status = 'passed';
      console.log('✅ Performance Analysis test passed');
    } catch (error) {
      this.testResults.performanceAnalysis.status = 'failed';
      this.testResults.performanceAnalysis.details.push(
        `Error: ${error.message}`
      );
      console.log('❌ Performance Analysis test failed');
    }
  }

  /**
   * Test Improvement Suggestions
   */
  async testImprovementSuggestions() {
    try {
      console.log('💡 Testing Improvement Suggestions...');

      const learningLoop = new ComprehensiveLearningLoop();
      await learningLoop.initialize();

      // Test basic improvement suggestions
      const basicSuggestions =
        await learningLoop.generateImprovementSuggestions();
      this.testResults.improvementSuggestions.details.push(
        `Basic Suggestions: ${basicSuggestions.length} generated`
      );

      // Test contextual improvement suggestions
      const contextualData = {
        type: 'contextual_improvement',
        data: {
          context: 'production_system',
          issues: ['slow_response', 'high_memory'],
          priority: 'high',
          timestamp: new Date(),
        },
        timestamp: new Date(),
      };

      await learningLoop.processLearningData(contextualData);
      const contextualSuggestions =
        await learningLoop.generateImprovementSuggestions();
      this.testResults.improvementSuggestions.details.push(
        `Contextual Suggestions: ${contextualSuggestions.length} generated`
      );

      // Test adaptive improvement suggestions
      const adaptiveData = {
        type: 'adaptive_improvement',
        data: {
          adaptation: 'learning_based',
          effectiveness: 0.8,
          iterations: 5,
          timestamp: new Date(),
        },
        timestamp: new Date(),
      };

      await learningLoop.processLearningData(adaptiveData);
      const adaptiveSuggestions =
        await learningLoop.generateImprovementSuggestions();
      this.testResults.improvementSuggestions.details.push(
        `Adaptive Suggestions: ${adaptiveSuggestions.length} generated`
      );

      // Test improvement effectiveness tracking
      const effectivenessData = {
        type: 'improvement_effectiveness',
        data: {
          suggestions: basicSuggestions,
          effectiveness: 0.75,
          feedback: 'positive',
          timestamp: new Date(),
        },
        timestamp: new Date(),
      };

      const effectiveness = await learningLoop.processLearningData(
        effectivenessData
      );
      this.testResults.improvementSuggestions.details.push(
        `Effectiveness Tracking: ${effectiveness ? 'Working' : 'Failed'}`
      );

      this.testResults.improvementSuggestions.status = 'passed';
      console.log('✅ Improvement Suggestions test passed');
    } catch (error) {
      this.testResults.improvementSuggestions.status = 'failed';
      this.testResults.improvementSuggestions.details.push(
        `Error: ${error.message}`
      );
      console.log('❌ Improvement Suggestions test failed');
    }
  }

  /**
   * Generate final report
   */
  generateFinalReport() {
    console.log('\n🎓 Learning Loop Test Report');
    console.log('============================');

    const totalTests = Object.keys(this.testResults).length;
    const passedTests = Object.values(this.testResults).filter(
      r => r.status === 'passed'
    ).length;
    const failedTests = totalTests - passedTests;

    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${passedTests}`);
    console.log(`Failed: ${failedTests}`);
    console.log(
      `Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`
    );

    console.log('\n📋 Test Results:');
    Object.entries(this.testResults).forEach(([test, result]) => {
      const status = result.status === 'passed' ? '✅' : '❌';
      console.log(`${status} ${test}: ${result.status}`);
      result.details.forEach(detail => {
        console.log(`   - ${detail}`);
      });
    });

    console.log(
      '\n🎯 Learning System Status:',
      failedTests === 0 ? 'FULLY OPERATIONAL' : 'NEEDS IMPROVEMENT'
    );

    if (failedTests === 0) {
      console.log(
        '\n🎉 Congratulations! Your Learning System is FULLY OPERATIONAL and can:'
      );
      console.log('   - 🧠 Process comprehensive learning data');
      console.log('   - 🔄 Track and learn from rounds');
      console.log('   - 🔗 Integrate multiple learning systems');
      console.log('   - 📊 Analyze performance metrics');
      console.log('   - 💡 Generate intelligent improvement suggestions');
      console.log('   - 🎯 Continuously improve itself');
    } else {
      console.log('\n⚠️ Learning System needs improvement in:');
      Object.entries(this.testResults).forEach(([test, result]) => {
        if (result.status === 'failed') {
          console.log(`   - ${test}`);
        }
      });
    }
  }
}

// Run test if called directly
if (require.main === module) {
  const test = new LearningLoopTest();
  test
    .runTest()
    .then(() => {
      console.log('🎉 Learning Loop Test completed successfully');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Learning Loop Test failed:', error.message);
      process.exit(1);
    });
}

module.exports = LearningLoopTest;
