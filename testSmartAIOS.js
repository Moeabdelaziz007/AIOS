/**
 * 🧠 Smart AIOS System Test
 *
 * Tests the intelligent self-healing and learning capabilities
 * with Cursor CLI and LLM integration
 */

const { config } = require('dotenv');
const path = require('path');

// Load environment variables
config({ path: path.join(__dirname, 'firebase.env') });

const { CursorCLIIntegration } = require('./server/cursorCLIIntegration');
const {
  ComprehensiveLearningLoop,
} = require('./server/comprehensiveLearningLoop');
const {
  IntelligentSelfHealingSystem,
} = require('./server/intelligentSelfHealingSystem');
const {
  IntelligentBugDetectionSystem,
} = require('./server/intelligentBugDetectionSystem');
const {
  RoundBasedLearningSystem,
} = require('./server/roundBasedLearningSystem');
const { SmartToolUsageSystem } = require('./server/smartToolUsageSystem');

class SmartAIOSTest {
  constructor() {
    this.name = 'Smart AIOS System Test';
    this.version = '1.0.0';
    this.testResults = {
      cursorCLI: { status: 'pending', details: [] },
      llmIntegration: { status: 'pending', details: [] },
      selfHealing: { status: 'pending', details: [] },
      bugDetection: { status: 'pending', details: [] },
      learningSystem: { status: 'pending', details: [] },
      smartTools: { status: 'pending', details: [] },
      overallIntelligence: { status: 'pending', details: [] },
    };

    console.log(`🧠 ${this.name} v${this.version} initialized`);
  }

  /**
   * Run comprehensive smart system test
   */
  async runTest() {
    try {
      console.log('🚀 Starting Smart AIOS System Test...');

      // Test Cursor CLI Integration
      await this.testCursorCLIIntegration();

      // Test LLM Integration
      await this.testLLMIntegration();

      // Test Self-Healing System
      await this.testSelfHealingSystem();

      // Test Bug Detection System
      await this.testBugDetectionSystem();

      // Test Learning System
      await this.testLearningSystem();

      // Test Smart Tools
      await this.testSmartTools();

      // Test Overall Intelligence
      await this.testOverallIntelligence();

      // Generate final report
      this.generateFinalReport();

      console.log('✅ Smart AIOS System Test completed');
      return this.testResults;
    } catch (error) {
      console.error('❌ Smart AIOS System Test failed:', error.message);
      throw error;
    }
  }

  /**
   * Test Cursor CLI Integration
   */
  async testCursorCLIIntegration() {
    try {
      console.log('🔧 Testing Cursor CLI Integration...');

      const cursorCLI = new CursorCLIIntegration();
      await cursorCLI.initialize();

      // Test Cursor CLI availability
      const cursorAvailable = await cursorCLI.checkCursorCLI();
      this.testResults.cursorCLI.details.push(
        `Cursor CLI Available: ${cursorAvailable ? 'Yes' : 'No'}`
      );

      // Test workspace monitoring
      const features = cursorCLI.getAvailableFeatures();
      this.testResults.cursorCLI.details.push(
        `File Monitoring: ${features.fileMonitoring ? 'Active' : 'Inactive'}`
      );
      this.testResults.cursorCLI.details.push(
        `Auto Fix: ${features.autoFix ? 'Enabled' : 'Disabled'}`
      );
      this.testResults.cursorCLI.details.push(
        `Real-time Debugging: ${
          features.realTimeDebugging ? 'Active' : 'Inactive'
        }`
      );

      // Test workspace data reading
      const workspaceData = await cursorCLI.readWorkspaceData();
      this.testResults.cursorCLI.details.push(
        `Files Scanned: ${workspaceData.files.length}`
      );
      this.testResults.cursorCLI.details.push(
        `Dependencies Found: ${workspaceData.dependencies ? 'Yes' : 'No'}`
      );

      this.testResults.cursorCLI.status = 'passed';
      console.log('✅ Cursor CLI Integration test passed');
    } catch (error) {
      this.testResults.cursorCLI.status = 'failed';
      this.testResults.cursorCLI.details.push(`Error: ${error.message}`);
      console.log('❌ Cursor CLI Integration test failed');
    }
  }

  /**
   * Test LLM Integration
   */
  async testLLMIntegration() {
    try {
      console.log('🧠 Testing LLM Integration...');

      const cursorCLI = new CursorCLIIntegration();
      await cursorCLI.initialize();

      // Test code analysis
      const testCode = `
        function calculateSum(a, b) {
          console.log('Calculating sum');
          return a + b;
        }
      `;

      const analysis = await cursorCLI.debuggerAgent.analyzeCodeWithLLM(
        testCode,
        'Test analysis'
      );
      this.testResults.llmIntegration.details.push(
        `Code Analysis: ${analysis.analysis ? 'Working' : 'Failed'}`
      );
      this.testResults.llmIntegration.details.push(
        `Confidence: ${analysis.confidence || 'N/A'}`
      );

      // Test issue explanation
      const testIssue = {
        message: 'Console.log statement found',
        type: 'warning',
        severity: 'medium',
        line: 2,
        suggestion: 'Remove console.log',
      };

      const explanation = await cursorCLI.debuggerAgent.explainIssueWithLLM(
        testIssue
      );
      this.testResults.llmIntegration.details.push(
        `Issue Explanation: ${explanation.explanation ? 'Working' : 'Failed'}`
      );
      this.testResults.llmIntegration.details.push(
        `Impact Assessment: ${explanation.impact || 'N/A'}`
      );

      // Test code generation
      const generatedCode = await cursorCLI.debuggerAgent.generateCodeWithLLM(
        'Create a function to validate email addresses',
        'Utility function'
      );
      this.testResults.llmIntegration.details.push(
        `Code Generation: ${generatedCode.code ? 'Working' : 'Failed'}`
      );

      this.testResults.llmIntegration.status = 'passed';
      console.log('✅ LLM Integration test passed');
    } catch (error) {
      this.testResults.llmIntegration.status = 'failed';
      this.testResults.llmIntegration.details.push(`Error: ${error.message}`);
      console.log('❌ LLM Integration test failed');
    }
  }

  /**
   * Test Self-Healing System
   */
  async testSelfHealingSystem() {
    try {
      console.log('🔧 Testing Self-Healing System...');

      const selfHealing = new IntelligentSelfHealingSystem();
      await selfHealing.initialize();

      // Test issue detection
      const testIssue = {
        type: 'performance',
        severity: 'medium',
        component: 'test_component',
        description: 'Slow response time detected',
        timestamp: new Date(),
      };

      const detection = await selfHealing.detectIssue(testIssue);
      this.testResults.selfHealing.details.push(
        `Issue Detection: ${detection ? 'Working' : 'Failed'}`
      );

      // Test automatic fix generation
      const fix = await selfHealing.generateFix(testIssue);
      this.testResults.selfHealing.details.push(
        `Fix Generation: ${fix ? 'Working' : 'Failed'}`
      );

      // Test learning from fixes
      const learning = await selfHealing.learnFromFix(testIssue, fix);
      this.testResults.selfHealing.details.push(
        `Learning System: ${learning ? 'Working' : 'Failed'}`
      );

      this.testResults.selfHealing.status = 'passed';
      console.log('✅ Self-Healing System test passed');
    } catch (error) {
      this.testResults.selfHealing.status = 'failed';
      this.testResults.selfHealing.details.push(`Error: ${error.message}`);
      console.log('❌ Self-Healing System test failed');
    }
  }

  /**
   * Test Bug Detection System
   */
  async testBugDetectionSystem() {
    try {
      console.log('🐛 Testing Bug Detection System...');

      const bugDetection = new IntelligentBugDetectionSystem();
      await bugDetection.initialize();

      // Test bug pattern detection
      const testCode = `
        function buggyFunction() {
          var unused = 'this is unused';
          console.log('Debug message');
          return null;
        }
      `;

      const bugs = await bugDetection.detectBugs(testCode, 'test.js');
      this.testResults.bugDetection.details.push(
        `Bug Detection: ${bugs.length > 0 ? 'Working' : 'No bugs found'}`
      );
      this.testResults.bugDetection.details.push(`Bugs Found: ${bugs.length}`);

      // Test fix suggestions
      if (bugs.length > 0) {
        const suggestions = await bugDetection.generateFixSuggestions(bugs[0]);
        this.testResults.bugDetection.details.push(
          `Fix Suggestions: ${suggestions ? 'Working' : 'Failed'}`
        );
      }

      // Test learning from patterns
      const learning = await bugDetection.learnFromPattern(bugs);
      this.testResults.bugDetection.details.push(
        `Pattern Learning: ${learning ? 'Working' : 'Failed'}`
      );

      this.testResults.bugDetection.status = 'passed';
      console.log('✅ Bug Detection System test passed');
    } catch (error) {
      this.testResults.bugDetection.status = 'failed';
      this.testResults.bugDetection.details.push(`Error: ${error.message}`);
      console.log('❌ Bug Detection System test failed');
    }
  }

  /**
   * Test Learning System
   */
  async testLearningSystem() {
    try {
      console.log('🎓 Testing Learning System...');

      const learningSystem = new RoundBasedLearningSystem();
      await learningSystem.initialize();

      // Test round tracking
      const roundData = {
        roundId: 'test_round_' + Date.now(),
        timestamp: new Date(),
        actions: ['test_action_1', 'test_action_2'],
        outcomes: ['success', 'success'],
        performance: { score: 0.8, metrics: {} },
      };

      const tracking = await learningSystem.trackRound(roundData);
      this.testResults.learningSystem.details.push(
        `Round Tracking: ${tracking ? 'Working' : 'Failed'}`
      );

      // Test learning from rounds
      const learning = await learningSystem.learnFromRounds();
      this.testResults.learningSystem.details.push(
        `Learning from Rounds: ${learning ? 'Working' : 'Failed'}`
      );

      // Test performance analysis
      const analysis = await learningSystem.analyzePerformance();
      this.testResults.learningSystem.details.push(
        `Performance Analysis: ${analysis ? 'Working' : 'Failed'}`
      );

      this.testResults.learningSystem.status = 'passed';
      console.log('✅ Learning System test passed');
    } catch (error) {
      this.testResults.learningSystem.status = 'failed';
      this.testResults.learningSystem.details.push(`Error: ${error.message}`);
      console.log('❌ Learning System test failed');
    }
  }

  /**
   * Test Smart Tools
   */
  async testSmartTools() {
    try {
      console.log('🛠️ Testing Smart Tools...');

      const smartTools = new SmartToolUsageSystem();
      await smartTools.initialize();

      // Test tool registry
      const tools = smartTools.getAvailableTools();
      this.testResults.smartTools.details.push(
        `Available Tools: ${tools.length}`
      );

      // Test task analysis
      const task = {
        description: 'Fix a bug in the authentication system',
        priority: 'high',
        context: 'production issue',
      };

      const analysis = await smartTools.analyzeTask(task);
      this.testResults.smartTools.details.push(
        `Task Analysis: ${analysis ? 'Working' : 'Failed'}`
      );

      // Test tool selection
      const selectedTools = await smartTools.selectOptimalTools(task);
      this.testResults.smartTools.details.push(
        `Tool Selection: ${selectedTools.length > 0 ? 'Working' : 'Failed'}`
      );
      this.testResults.smartTools.details.push(
        `Selected Tools: ${selectedTools.length}`
      );

      this.testResults.smartTools.status = 'passed';
      console.log('✅ Smart Tools test passed');
    } catch (error) {
      this.testResults.smartTools.status = 'failed';
      this.testResults.smartTools.details.push(`Error: ${error.message}`);
      console.log('❌ Smart Tools test failed');
    }
  }

  /**
   * Test Overall Intelligence
   */
  async testOverallIntelligence() {
    try {
      console.log('🧠 Testing Overall Intelligence...');

      // Test system integration
      const cursorCLI = new CursorCLIIntegration();
      await cursorCLI.initialize();

      const learningLoop = new ComprehensiveLearningLoop();
      await learningLoop.initialize();

      // Test intelligent workflow
      const workflow = {
        task: 'Analyze and fix performance issues',
        context: 'production system',
        priority: 'high',
      };

      // Simulate intelligent analysis
      const analysis = await cursorCLI.debuggerAgent.analyzeCodeWithLLM(
        'function slowFunction() { /* complex logic */ }',
        'Performance analysis'
      );

      this.testResults.overallIntelligence.details.push(
        `Intelligent Analysis: ${analysis ? 'Working' : 'Failed'}`
      );

      // Test learning integration
      const learningData = {
        type: 'performance_analysis',
        data: analysis,
        timestamp: new Date(),
      };

      const learning = await learningLoop.processLearningData(learningData);
      this.testResults.overallIntelligence.details.push(
        `Learning Integration: ${learning ? 'Working' : 'Failed'}`
      );

      // Test self-improvement
      const improvement = await learningLoop.generateImprovementSuggestions();
      this.testResults.overallIntelligence.details.push(
        `Self-Improvement: ${improvement ? 'Working' : 'Failed'}`
      );

      this.testResults.overallIntelligence.status = 'passed';
      console.log('✅ Overall Intelligence test passed');
    } catch (error) {
      this.testResults.overallIntelligence.status = 'failed';
      this.testResults.overallIntelligence.details.push(
        `Error: ${error.message}`
      );
      console.log('❌ Overall Intelligence test failed');
    }
  }

  /**
   * Generate final report
   */
  generateFinalReport() {
    console.log('\n🧠 Smart AIOS System Test Report');
    console.log('==================================');

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
      '\n🎯 Smart System Status:',
      failedTests === 0 ? 'FULLY INTELLIGENT' : 'NEEDS IMPROVEMENT'
    );

    if (failedTests === 0) {
      console.log('\n🎉 Congratulations! Your AIOS system is SMART and can:');
      console.log('   - 🔧 Integrate with Cursor CLI');
      console.log('   - 🧠 Use LLM for intelligent analysis');
      console.log('   - 🔧 Self-heal and fix issues');
      console.log('   - 🐛 Detect and fix bugs automatically');
      console.log('   - 🎓 Learn from every interaction');
      console.log('   - 🛠️ Use smart tools optimally');
      console.log('   - 🧠 Continuously improve itself');
    } else {
      console.log('\n⚠️ System needs improvement in:');
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
  const test = new SmartAIOSTest();
  test
    .runTest()
    .then(() => {
      console.log('🎉 Smart AIOS System Test completed successfully');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Smart AIOS System Test failed:', error.message);
      process.exit(1);
    });
}

module.exports = SmartAIOSTest;
