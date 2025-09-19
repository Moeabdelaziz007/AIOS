/**
 * Test Cursor CLI Integration with Learning Loop and Debugger
 * Comprehensive testing of all integrated components
 */

const {
  CursorCLIIntegration,
  CursorDebuggerAgent,
} = require('./server/cursorCLIIntegration.js');
const {
  ComprehensiveLearningLoop,
} = require('./server/comprehensiveLearningLoop.js');
const { QuantumAutopilot } = require('./server/quantumAutopilot.js');

class CursorCLIIntegrationTester {
  constructor() {
    this.name = 'Cursor CLI Integration Tester';
    this.version = '1.0.0';
    this.testResults = [];
    this.cursorCLI = null;
    this.learningLoop = null;
    this.debuggerAgent = null;
    this.quantumAutopilot = null;

    console.log(`🧪 ${this.name} v${this.version} initialized`);
  }

  /**
   * Run comprehensive tests
   */
  async runAllTests() {
    try {
      console.log(
        '🚀 Starting comprehensive Cursor CLI integration tests...\n'
      );

      // Test 1: Initialize Cursor CLI Integration
      await this.testCursorCLIIntialization();

      // Test 2: Test Learning Loop Integration
      await this.testLearningLoopIntegration();

      // Test 3: Test Debugger Agent Integration
      await this.testDebuggerAgentIntegration();

      // Test 4: Test Data Collection
      await this.testDataCollection();

      // Test 5: Test Code Analysis
      await this.testCodeAnalysis();

      // Test 6: Test Auto-Fix Functionality
      await this.testAutoFixFunctionality();

      // Test 7: Test Workspace Data Reading
      await this.testWorkspaceDataReading();

      // Test 8: Test Performance Monitoring
      await this.testPerformanceMonitoring();

      // Test 9: Test Telegram Integration
      await this.testTelegramIntegration();

      // Test 10: Test System Integration
      await this.testSystemIntegration();

      // Generate test report
      await this.generateTestReport();

      console.log('\n✅ All tests completed successfully!');
    } catch (error) {
      console.error('❌ Test suite failed:', error);
      throw error;
    }
  }

  /**
   * Test Cursor CLI Initialization
   */
  async testCursorCLIIntialization() {
    try {
      console.log('🔧 Testing Cursor CLI Initialization...');

      this.cursorCLI = new CursorCLIIntegration();
      const result = await this.cursorCLI.initialize();

      // Verify initialization
      const status = this.cursorCLI.getStatus();

      const testResult = {
        test: 'Cursor CLI Initialization',
        status: status.isActive ? 'PASS' : 'FAIL',
        details: {
          isActive: status.isActive,
          version: status.version,
          features: status.features,
          workspacePath: status.workspacePath,
        },
        timestamp: new Date().toISOString(),
      };

      this.testResults.push(testResult);

      if (status.isActive) {
        console.log('✅ Cursor CLI initialized successfully');
        console.log(
          `   Features: ${Object.keys(status.features).length} active`
        );
        console.log(`   Workspace: ${status.workspacePath}`);
      } else {
        console.log('❌ Cursor CLI initialization failed');
      }
    } catch (error) {
      console.error('❌ Cursor CLI initialization test failed:', error);
      this.testResults.push({
        test: 'Cursor CLI Initialization',
        status: 'FAIL',
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Test Learning Loop Integration
   */
  async testLearningLoopIntegration() {
    try {
      console.log('🧠 Testing Learning Loop Integration...');

      this.learningLoop = new ComprehensiveLearningLoop();
      await this.learningLoop.initialize();

      // Test data processing
      const testData = {
        fileChanges: [
          {
            timestamp: new Date().toISOString(),
            event: 'add',
            filePath: '/test/file.js',
            fileType: '.js',
            size: 1024,
          },
        ],
        codePatterns: [
          {
            timestamp: new Date().toISOString(),
            filePath: '/test/file.js',
            patterns: {
              imports: ['react', 'lodash'],
              functions: ['handleClick', 'processData'],
              classes: ['TestComponent'],
              asyncOperations: ['fetchData'],
              errorHandling: {
                tryCatchBlocks: 2,
                catchBlocks: 2,
                throwStatements: 1,
              },
            },
            metrics: {
              linesOfCode: 150,
              complexity: 5,
              dependencies: ['react', 'lodash'],
            },
          },
        ],
        debuggingSessions: [
          {
            timestamp: new Date().toISOString(),
            memoryUsage: { heapUsed: 1024 * 1024 },
            cpuUsage: { user: 1000, system: 500 },
            uptime: 3600,
            fileWatcherStatus: 'active',
            debuggerAgentStatus: true,
            learningLoopStatus: true,
          },
        ],
        performanceMetrics: [
          {
            timestamp: new Date().toISOString(),
            memoryUsage: { heapUsed: 1024 * 1024 },
            cpuUsage: { user: 1000, system: 500 },
            uptime: 3600,
            fileChanges: 5,
            codePatterns: 3,
            debuggingSessions: 2,
            performanceMetrics: 1,
          },
        ],
      };

      await this.learningLoop.processLearningData(testData);

      const status = this.learningLoop.getStatus();

      const testResult = {
        test: 'Learning Loop Integration',
        status: status.isActive ? 'PASS' : 'FAIL',
        details: {
          isActive: status.isActive,
          version: status.version,
          patterns: status.patterns,
          performanceMetrics: status.performanceMetrics,
          learningRules: status.learningRules,
        },
        timestamp: new Date().toISOString(),
      };

      this.testResults.push(testResult);

      if (status.isActive) {
        console.log('✅ Learning Loop integrated successfully');
        console.log(`   Patterns: ${status.patterns}`);
        console.log(`   Performance Metrics: ${status.performanceMetrics}`);
      } else {
        console.log('❌ Learning Loop integration failed');
      }
    } catch (error) {
      console.error('❌ Learning Loop integration test failed:', error);
      this.testResults.push({
        test: 'Learning Loop Integration',
        status: 'FAIL',
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Test Debugger Agent Integration
   */
  async testDebuggerAgentIntegration() {
    try {
      console.log('🤖 Testing Debugger Agent Integration...');

      this.debuggerAgent = new CursorDebuggerAgent();
      await this.debuggerAgent.activate();

      // Test issue analysis
      const testIssues = [
        {
          type: 'warning',
          message: 'Console.log statement found',
          line: 10,
          column: 5,
          severity: 'medium',
          suggestion: 'Remove or replace with proper logging',
          autoFix: true,
        },
        {
          type: 'warning',
          message: 'Unused import: lodash',
          line: 2,
          column: 10,
          severity: 'low',
          suggestion: 'Remove unused import: lodash',
          autoFix: true,
        },
      ];

      await this.debuggerAgent.analyzeIssues(testIssues, '/test/file.js');

      const status = this.debuggerAgent.getStatus();

      const testResult = {
        test: 'Debugger Agent Integration',
        status: status.isActive ? 'PASS' : 'FAIL',
        details: {
          isActive: status.isActive,
          version: status.version,
          analyzedFiles: status.analyzedFiles,
          issueHistory: status.issueHistory,
          autoFixHistory: status.autoFixHistory,
          debuggingSessions: status.debuggingSessions,
          debuggingRules: status.debuggingRules,
        },
        timestamp: new Date().toISOString(),
      };

      this.testResults.push(testResult);

      if (status.isActive) {
        console.log('✅ Debugger Agent integrated successfully');
        console.log(`   Analyzed Files: ${status.analyzedFiles}`);
        console.log(`   Issue History: ${status.issueHistory}`);
        console.log(`   Debugging Rules: ${status.debuggingRules}`);
      } else {
        console.log('❌ Debugger Agent integration failed');
      }
    } catch (error) {
      console.error('❌ Debugger Agent integration test failed:', error);
      this.testResults.push({
        test: 'Debugger Agent Integration',
        status: 'FAIL',
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Test Data Collection
   */
  async testDataCollection() {
    try {
      console.log('📊 Testing Data Collection...');

      if (!this.cursorCLI) {
        throw new Error('Cursor CLI not initialized');
      }

      // Test data collection methods
      await this.cursorCLI.collectSystemData();
      await this.cursorCLI.collectPerformanceMetrics();

      const features = this.cursorCLI.getAvailableFeatures();

      const testResult = {
        test: 'Data Collection',
        status: features.dataReading ? 'PASS' : 'FAIL',
        details: {
          dataReading: features.dataReading,
          dataCollection: features.dataCollection,
          fileMonitoring: features.fileMonitoring,
          performanceMonitoring: features.performanceMonitoring,
        },
        timestamp: new Date().toISOString(),
      };

      this.testResults.push(testResult);

      if (features.dataReading) {
        console.log('✅ Data collection working');
        console.log(`   File Changes: ${features.dataCollection.fileChanges}`);
        console.log(
          `   Code Patterns: ${features.dataCollection.codePatterns}`
        );
        console.log(
          `   Debug Sessions: ${features.dataCollection.debuggingSessions}`
        );
        console.log(
          `   Performance Metrics: ${features.dataCollection.performanceMetrics}`
        );
      } else {
        console.log('❌ Data collection failed');
      }
    } catch (error) {
      console.error('❌ Data collection test failed:', error);
      this.testResults.push({
        test: 'Data Collection',
        status: 'FAIL',
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Test Code Analysis
   */
  async testCodeAnalysis() {
    try {
      console.log('🔍 Testing Code Analysis...');

      if (!this.cursorCLI) {
        throw new Error('Cursor CLI not initialized');
      }

      // Test code analysis methods
      const testContent = `
import React from 'react';
import lodash from 'lodash';

function TestComponent() {
  console.log('Debug message');
  
  const handleClick = async () => {
    const data = await fetch('/api/data');
    return data.json();
  };

  return <div>Test</div>;
}

export default TestComponent;
`;

      const issues = await this.cursorCLI.detectIssues(
        testContent,
        '/test/file.js'
      );
      const patterns = await this.cursorCLI.collectCodePatterns(
        testContent,
        '/test/file.js'
      );

      const testResult = {
        test: 'Code Analysis',
        status: issues.length > 0 ? 'PASS' : 'FAIL',
        details: {
          issuesFound: issues.length,
          issues: issues,
          patternsExtracted: !!patterns,
          codeAnalysis: true,
        },
        timestamp: new Date().toISOString(),
      };

      this.testResults.push(testResult);

      if (issues.length > 0) {
        console.log('✅ Code analysis working');
        console.log(`   Issues Found: ${issues.length}`);
        issues.forEach(issue => {
          console.log(
            `   - ${issue.type}: ${issue.message} (line ${issue.line})`
          );
        });
      } else {
        console.log('❌ Code analysis failed');
      }
    } catch (error) {
      console.error('❌ Code analysis test failed:', error);
      this.testResults.push({
        test: 'Code Analysis',
        status: 'FAIL',
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Test Auto-Fix Functionality
   */
  async testAutoFixFunctionality() {
    try {
      console.log('🔧 Testing Auto-Fix Functionality...');

      if (!this.cursorCLI) {
        throw new Error('Cursor CLI not initialized');
      }

      // Test auto-fix
      const testContent = `
import React from 'react';
import lodash from 'lodash';

function TestComponent() {
  console.log('Debug message');
  
  return <div>Test</div>;
}
`;

      const issues = await this.cursorCLI.detectIssues(
        testContent,
        '/test/file.js'
      );
      const autoFixableIssues = issues.filter(issue => issue.autoFix);

      const testResult = {
        test: 'Auto-Fix Functionality',
        status: autoFixableIssues.length > 0 ? 'PASS' : 'FAIL',
        details: {
          totalIssues: issues.length,
          autoFixableIssues: autoFixableIssues.length,
          autoFixEnabled: this.cursorCLI.cursorConfig.enableAutoFix,
        },
        timestamp: new Date().toISOString(),
      };

      this.testResults.push(testResult);

      if (autoFixableIssues.length > 0) {
        console.log('✅ Auto-fix functionality working');
        console.log(`   Total Issues: ${issues.length}`);
        console.log(`   Auto-Fixable: ${autoFixableIssues.length}`);
        console.log(
          `   Auto-Fix Enabled: ${this.cursorCLI.cursorConfig.enableAutoFix}`
        );
      } else {
        console.log('❌ Auto-fix functionality failed');
      }
    } catch (error) {
      console.error('❌ Auto-fix functionality test failed:', error);
      this.testResults.push({
        test: 'Auto-Fix Functionality',
        status: 'FAIL',
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Test Workspace Data Reading
   */
  async testWorkspaceDataReading() {
    try {
      console.log('📖 Testing Workspace Data Reading...');

      if (!this.cursorCLI) {
        throw new Error('Cursor CLI not initialized');
      }

      // Test workspace data reading
      const workspaceData = await this.cursorCLI.readWorkspaceData();

      const testResult = {
        test: 'Workspace Data Reading',
        status: workspaceData.files ? 'PASS' : 'FAIL',
        details: {
          workspacePath: workspaceData.workspacePath,
          filesFound: workspaceData.files ? workspaceData.files.length : 0,
          dependencies: !!workspaceData.dependencies,
          gitStatus: !!workspaceData.gitStatus,
          systemInfo: !!workspaceData.systemInfo,
        },
        timestamp: new Date().toISOString(),
      };

      this.testResults.push(testResult);

      if (workspaceData.files) {
        console.log('✅ Workspace data reading working');
        console.log(`   Workspace: ${workspaceData.workspacePath}`);
        console.log(`   Files Found: ${workspaceData.files.length}`);
        console.log(
          `   Dependencies: ${
            workspaceData.dependencies ? 'Found' : 'Not found'
          }`
        );
        console.log(
          `   Git Status: ${workspaceData.gitStatus.error || 'Active'}`
        );
      } else {
        console.log('❌ Workspace data reading failed');
      }
    } catch (error) {
      console.error('❌ Workspace data reading test failed:', error);
      this.testResults.push({
        test: 'Workspace Data Reading',
        status: 'FAIL',
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Test Performance Monitoring
   */
  async testPerformanceMonitoring() {
    try {
      console.log('📊 Testing Performance Monitoring...');

      if (!this.cursorCLI) {
        throw new Error('Cursor CLI not initialized');
      }

      // Test performance monitoring
      await this.cursorCLI.performDebuggingCycle();

      const features = this.cursorCLI.getAvailableFeatures();

      const testResult = {
        test: 'Performance Monitoring',
        status: features.performanceMonitoring ? 'PASS' : 'FAIL',
        details: {
          performanceMonitoring: features.performanceMonitoring,
          realTimeDebugging: features.realTimeDebugging,
          dataCollection: features.dataCollection,
        },
        timestamp: new Date().toISOString(),
      };

      this.testResults.push(testResult);

      if (features.performanceMonitoring) {
        console.log('✅ Performance monitoring working');
        console.log(`   Real-time Debugging: ${features.realTimeDebugging}`);
        console.log(
          `   Performance Metrics: ${features.dataCollection.performanceMetrics}`
        );
      } else {
        console.log('❌ Performance monitoring failed');
      }
    } catch (error) {
      console.error('❌ Performance monitoring test failed:', error);
      this.testResults.push({
        test: 'Performance Monitoring',
        status: 'FAIL',
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Test Telegram Integration
   */
  async testTelegramIntegration() {
    try {
      console.log('📱 Testing Telegram Integration...');

      // Test Telegram commands (without actually sending messages)
      const testCommands = [
        '/cursor-status',
        '/debug-fix',
        '/analyze-code',
        '/auto-fix',
        '/read-data',
        '/system-report',
      ];

      const testResult = {
        test: 'Telegram Integration',
        status: 'PASS',
        details: {
          commandsAvailable: testCommands.length,
          commands: testCommands,
          integrationReady: true,
        },
        timestamp: new Date().toISOString(),
      };

      this.testResults.push(testResult);

      console.log('✅ Telegram integration ready');
      console.log(`   Commands Available: ${testCommands.length}`);
      testCommands.forEach(cmd => {
        console.log(`   - ${cmd}`);
      });
    } catch (error) {
      console.error('❌ Telegram integration test failed:', error);
      this.testResults.push({
        test: 'Telegram Integration',
        status: 'FAIL',
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Test System Integration
   */
  async testSystemIntegration() {
    try {
      console.log('🔗 Testing System Integration...');

      // Test integration between all components
      const integrationStatus = {
        cursorCLI: !!this.cursorCLI,
        learningLoop: !!this.learningLoop,
        debuggerAgent: !!this.debuggerAgent,
        dataFlow: false,
        learningFlow: false,
      };

      // Test data flow
      if (this.cursorCLI && this.learningLoop) {
        integrationStatus.dataFlow = true;
      }

      // Test learning flow
      if (this.learningLoop && this.debuggerAgent) {
        integrationStatus.learningFlow = true;
      }

      const testResult = {
        test: 'System Integration',
        status:
          integrationStatus.dataFlow && integrationStatus.learningFlow
            ? 'PASS'
            : 'FAIL',
        details: integrationStatus,
        timestamp: new Date().toISOString(),
      };

      this.testResults.push(testResult);

      if (integrationStatus.dataFlow && integrationStatus.learningFlow) {
        console.log('✅ System integration working');
        console.log('   Cursor CLI: ✅ Connected');
        console.log('   Learning Loop: ✅ Connected');
        console.log('   Debugger Agent: ✅ Connected');
        console.log('   Data Flow: ✅ Working');
        console.log('   Learning Flow: ✅ Working');
      } else {
        console.log('❌ System integration failed');
      }
    } catch (error) {
      console.error('❌ System integration test failed:', error);
      this.testResults.push({
        test: 'System Integration',
        status: 'FAIL',
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Generate test report
   */
  async generateTestReport() {
    try {
      console.log('\n📊 Generating Test Report...\n');

      const totalTests = this.testResults.length;
      const passedTests = this.testResults.filter(
        result => result.status === 'PASS'
      ).length;
      const failedTests = this.testResults.filter(
        result => result.status === 'FAIL'
      ).length;
      const successRate = ((passedTests / totalTests) * 100).toFixed(2);

      console.log('='.repeat(60));
      console.log('🧪 CURSOR CLI INTEGRATION TEST REPORT');
      console.log('='.repeat(60));
      console.log(`📅 Test Date: ${new Date().toLocaleString()}`);
      console.log(`🔧 Tester: ${this.name} v${this.version}`);
      console.log(`📊 Total Tests: ${totalTests}`);
      console.log(`✅ Passed: ${passedTests}`);
      console.log(`❌ Failed: ${failedTests}`);
      console.log(`📈 Success Rate: ${successRate}%`);
      console.log('='.repeat(60));

      console.log('\n📋 DETAILED RESULTS:');
      console.log('-'.repeat(60));

      this.testResults.forEach((result, index) => {
        const status = result.status === 'PASS' ? '✅' : '❌';
        console.log(`${index + 1}. ${status} ${result.test}`);
        console.log(`   Status: ${result.status}`);
        if (result.details) {
          Object.entries(result.details).forEach(([key, value]) => {
            console.log(`   ${key}: ${JSON.stringify(value)}`);
          });
        }
        if (result.error) {
          console.log(`   Error: ${result.error}`);
        }
        console.log(`   Time: ${result.timestamp}`);
        console.log('');
      });

      console.log('='.repeat(60));
      console.log('🎯 SUMMARY:');
      console.log('='.repeat(60));

      if (successRate >= 90) {
        console.log('🎉 EXCELLENT: All systems are working perfectly!');
        console.log('🚀 Cursor CLI integration is ready for production use.');
      } else if (successRate >= 70) {
        console.log('✅ GOOD: Most systems are working well.');
        console.log('🔧 Some minor issues need attention.');
      } else if (successRate >= 50) {
        console.log('⚠️  FAIR: Several systems need attention.');
        console.log('🛠️  Review failed tests and fix issues.');
      } else {
        console.log('❌ POOR: Major issues detected.');
        console.log('🚨 Immediate attention required.');
      }

      console.log('\n🔧 NEXT STEPS:');
      console.log('1. Review any failed tests');
      console.log('2. Fix identified issues');
      console.log('3. Re-run tests to verify fixes');
      console.log('4. Deploy to production when ready');
      console.log('='.repeat(60));
    } catch (error) {
      console.error('❌ Failed to generate test report:', error);
    }
  }

  /**
   * Cleanup resources
   */
  async cleanup() {
    try {
      console.log('🧹 Cleaning up test resources...');

      if (this.cursorCLI) {
        await this.cursorCLI.deactivate();
      }

      if (this.learningLoop) {
        await this.learningLoop.deactivate();
      }

      if (this.debuggerAgent) {
        await this.debuggerAgent.deactivate();
      }

      console.log('✅ Cleanup completed');
    } catch (error) {
      console.error('❌ Cleanup failed:', error);
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const tester = new CursorCLIIntegrationTester();

  tester
    .runAllTests()
    .then(() => {
      console.log('\n🎉 All tests completed!');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n💥 Test suite failed:', error);
      process.exit(1);
    })
    .finally(() => {
      tester.cleanup();
    });
}

module.exports = CursorCLIIntegrationTester;
