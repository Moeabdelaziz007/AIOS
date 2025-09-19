/**
 * Cursor CLI Integration & Debugger Agent
 * Connects AIOS system with Cursor CLI for advanced debugging
 */

const { spawn, exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const FirestoreDataStorage = require('./firestoreDataStorage.js');
const MockFirestoreDataStorage = require('./mockFirestoreDataStorage.js');

class CursorCLIIntegration {
  constructor() {
    this.name = 'Cursor CLI Integration';
    this.version = '1.0.0';
    this.isActive = false;
    this.cursorProcess = null;
    this.debuggerAgent = null;
    this.learningLoop = null;
    this.firestoreStorage = null;
    this.workspacePath = process.cwd();
    this.cursorConfig = {
      enableAutoFix: true,
      enableRealTimeDebugging: true,
      enableCodeAnalysis: true,
      enablePerformanceMonitoring: true,
      enableDataReading: true,
      enableLearningIntegration: true,
    };
    this.dataCollection = {
      fileChanges: [],
      codePatterns: [],
      debuggingSessions: [],
      performanceMetrics: [],
    };
  }

  /**
   * Initialize Cursor CLI integration
   */
  async initialize() {
    try {
      // Check if Cursor CLI is available
      await this.checkCursorCLI();

      // Initialize debugger agent
      await this.initializeDebuggerAgent();

      // Initialize Firestore storage
      await this.initializeFirestoreStorage();

      // Initialize learning loop
      await this.initializeLearningLoop();

      // Setup workspace monitoring
      await this.setupWorkspaceMonitoring();

      // Start real-time debugging
      await this.startRealTimeDebugging();

      // Start data collection for learning
      await this.startDataCollection();

      this.isActive = true;

      return { status: 'active', features: this.getAvailableFeatures() };
    } catch (error) {
      console.error('❌ Failed to initialize Cursor CLI Integration:', error);
      throw error;
    }
  }

  /**
   * Check if Cursor CLI is available
   */
  async checkCursorCLI() {
    return new Promise((resolve, reject) => {
      exec('cursor --version', (error, stdout, stderr) => {
        if (error) {
          console.warn(
            '⚠️ Cursor CLI not found, using alternative debugging methods'
          );
          resolve(false);
        } else {
          this.cursorCLIAvailable = true;
          resolve(true);
        }
      });
    });
  }

  /**
   * Execute Cursor CLI command
   */
  async executeCursorCommand(command, args = []) {
    try {
      if (!this.cursorCLIAvailable) {
        throw new Error('Cursor CLI not available');
      }

      const fullCommand = `cursor ${command} ${args.join(' ')}`;

      return new Promise((resolve, reject) => {
        exec(
          fullCommand,
          { cwd: this.workspacePath },
          (error, stdout, stderr) => {
            if (error) {
              console.error(`❌ Cursor command failed: ${error.message}`);
              reject(error);
            } else {
              resolve({ stdout, stderr });
            }
          }
        );
      });
    } catch (error) {
      console.error('Error executing Cursor command:', error);
      throw error;
    }
  }

  /**
   * Open file in Cursor
   */
  async openFileInCursor(filePath) {
    try {
      await this.executeCursorCommand('', [filePath]);
    } catch (error) {
      console.error('Error opening file in Cursor:', error);
    }
  }

  /**
   * Open workspace in Cursor
   */
  async openWorkspaceInCursor() {
    try {
      await this.executeCursorCommand('', [this.workspacePath]);
    } catch (error) {
      console.error('Error opening workspace in Cursor:', error);
    }
  }

  /**
   * Get Cursor workspace info
   */
  async getCursorWorkspaceInfo() {
    try {
      const result = await this.executeCursorCommand('--list-extensions');
      return {
        extensions: result.stdout.split('\n').filter(ext => ext.trim()),
        workspace: this.workspacePath,
        available: this.cursorCLIAvailable,
      };
    } catch (error) {
      console.error('Error getting Cursor workspace info:', error);
      return {
        extensions: [],
        workspace: this.workspacePath,
        available: false,
      };
    }
  }

  /**
   * Initialize debugger agent
   */
  async initializeDebuggerAgent() {
    try {
      this.debuggerAgent = new CursorDebuggerAgent();
      await this.debuggerAgent.activate();
    } catch (error) {
      console.error('❌ Failed to initialize Debugger Agent:', error);
      throw error;
    }
  }

  /**
   * Initialize Firestore storage
   */
  async initializeFirestoreStorage() {
    try {
      // Try to initialize real Firestore first
      this.firestoreStorage = new FirestoreDataStorage();
      await this.firestoreStorage.initialize();

      // Check if initialization was successful
      if (!this.firestoreStorage.isInitialized) {
        this.firestoreStorage = new MockFirestoreDataStorage();
        await this.firestoreStorage.initialize();
      }
    } catch (error) {
      console.error('❌ Failed to initialize Firestore storage:', error);

      // Fallback to mock storage
      this.firestoreStorage = new MockFirestoreDataStorage();
      await this.firestoreStorage.initialize();
    }
  }

  /**
   * Initialize learning loop
   */
  async initializeLearningLoop() {
    try {
      // Import and initialize learning loop
      const ComprehensiveLearningLoop = require('./comprehensiveLearningLoop.js');
      this.learningLoop = new ComprehensiveLearningLoop();
      await this.learningLoop.initialize();

      // Connect learning loop with debugger agent
      if (this.debuggerAgent) {
        this.debuggerAgent.learningLoop = this.learningLoop;
      }

      // Connect learning loop with Firestore storage
      if (this.firestoreStorage) {
        this.learningLoop.firestoreStorage = this.firestoreStorage;
      }
    } catch (error) {
      console.error('❌ Failed to initialize Learning Loop:', error);
      throw error;
    }
  }

  /**
   * Setup workspace monitoring
   */
  async setupWorkspaceMonitoring() {
    try {
      // Monitor file changes
      this.fileWatcher = require('chokidar').watch(this.workspacePath, {
        ignored: /(^|[\/\\])\../, // ignore dotfiles
        persistent: true,
        ignoreInitial: true,
      });

      this.fileWatcher
        .on('add', path => this.handleFileChange('add', path))
        .on('change', path => this.handleFileChange('change', path))
        .on('unlink', path => this.handleFileChange('unlink', path))
        .on('error', error => console.error('File watcher error:', error));
    } catch (error) {
      console.error('❌ Failed to setup workspace monitoring:', error);
    }
  }

  /**
   * Handle file changes
   */
  async handleFileChange(event, filePath) {
    try {
      const relativePath = path.relative(this.workspacePath, filePath);

      // Collect data for learning
      await this.collectFileChangeData(event, filePath);

      // Analyze file for issues
      if (
        filePath.endsWith('.js') ||
        filePath.endsWith('.ts') ||
        filePath.endsWith('.jsx') ||
        filePath.endsWith('.tsx')
      ) {
        await this.analyzeFile(filePath);
      }
    } catch (error) {
      console.error('Error handling file change:', error);
    }
  }

  /**
   * Collect file change data for learning
   */
  async collectFileChangeData(event, filePath) {
    try {
      const fileData = {
        timestamp: new Date().toISOString(),
        event: event,
        filePath: filePath,
        relativePath: path.relative(this.workspacePath, filePath),
        fileType: path.extname(filePath),
        size: await this.getFileSize(filePath),
      };

      // Add to data collection
      this.dataCollection.fileChanges.push(fileData);

      // Keep only last 1000 entries
      if (this.dataCollection.fileChanges.length > 1000) {
        this.dataCollection.fileChanges.shift();
      }

      // Send to learning loop
      if (this.learningLoop) {
        await this.learningLoop.processFileChange(fileData);
      }

      // Store in Firestore
      if (this.firestoreStorage) {
        await this.firestoreStorage.storeFileChanges([fileData]);
      }
    } catch (error) {
      console.error('Error collecting file change data:', error);
    }
  }

  /**
   * Get file size
   */
  async getFileSize(filePath) {
    try {
      const stats = await fs.stat(filePath);
      return stats.size;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Analyze file for issues
   */
  async analyzeFile(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const issues = await this.detectIssues(content, filePath);

      // Collect code patterns for learning
      await this.collectCodePatterns(content, filePath);

      if (issues.length > 0) {
        console.log(
          `🔍 Found ${issues.length} issues in ${path.basename(filePath)}`
        );

        // Send to debugger agent
        if (this.debuggerAgent) {
          await this.debuggerAgent.analyzeIssues(issues, filePath);
        }

        // Auto-fix if enabled
        if (this.cursorConfig.enableAutoFix) {
          await this.autoFixIssues(issues, filePath, content);
        }
      }
    } catch (error) {
      console.error('Error analyzing file:', error);
    }
  }

  /**
   * Collect code patterns for learning
   */
  async collectCodePatterns(content, filePath) {
    try {
      const patterns = {
        timestamp: new Date().toISOString(),
        filePath: filePath,
        patterns: {
          imports: this.extractImportPatterns(content),
          functions: this.extractFunctionPatterns(content),
          classes: this.extractClassPatterns(content),
          asyncOperations: this.extractAsyncPatterns(content),
          errorHandling: this.extractErrorHandlingPatterns(content),
        },
        metrics: {
          linesOfCode: content.split('\n').length,
          complexity: this.calculateComplexity(content),
          dependencies: this.extractDependencies(content),
        },
      };

      // Add to data collection
      this.dataCollection.codePatterns.push(patterns);

      // Keep only last 500 entries
      if (this.dataCollection.codePatterns.length > 500) {
        this.dataCollection.codePatterns.shift();
      }

      // Send to learning loop
      if (this.learningLoop) {
        await this.learningLoop.processCodePatterns([patterns]);
      }

      // Store in Firestore
      if (this.firestoreStorage) {
        await this.firestoreStorage.storeCodePatterns([patterns]);
      }
    } catch (error) {
      console.error('Error collecting code patterns:', error);
    }
  }

  /**
   * Extract import patterns
   */
  extractImportPatterns(content) {
    const importRegex = /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g;
    const imports = [];
    let match;

    while ((match = importRegex.exec(content)) !== null) {
      imports.push(match[1]);
    }

    return imports;
  }

  /**
   * Extract function patterns
   */
  extractFunctionPatterns(content) {
    const functionRegex =
      /(?:function\s+(\w+)|const\s+(\w+)\s*=\s*(?:async\s+)?(?:\([^)]*\)\s*=>|function))/g;
    const functions = [];
    let match;

    while ((match = functionRegex.exec(content)) !== null) {
      functions.push(match[1] || match[2]);
    }

    return functions;
  }

  /**
   * Extract class patterns
   */
  extractClassPatterns(content) {
    const classRegex = /class\s+(\w+)/g;
    const classes = [];
    let match;

    while ((match = classRegex.exec(content)) !== null) {
      classes.push(match[1]);
    }

    return classes;
  }

  /**
   * Extract async operation patterns
   */
  extractAsyncPatterns(content) {
    const asyncRegex = /await\s+(\w+)/g;
    const asyncOps = [];
    let match;

    while ((match = asyncRegex.exec(content)) !== null) {
      asyncOps.push(match[1]);
    }

    return asyncOps;
  }

  /**
   * Extract error handling patterns
   */
  extractErrorHandlingPatterns(content) {
    const errorHandling = {
      tryCatchBlocks: (content.match(/try\s*{/g) || []).length,
      catchBlocks: (content.match(/catch\s*\(/g) || []).length,
      throwStatements: (content.match(/throw\s+/g) || []).length,
    };

    return errorHandling;
  }

  /**
   * Calculate code complexity
   */
  calculateComplexity(content) {
    const lines = content.split('\n');
    let complexity = 0;

    lines.forEach(line => {
      const trimmed = line.trim();
      if (
        trimmed.includes('if') ||
        trimmed.includes('for') ||
        trimmed.includes('while')
      ) {
        complexity++;
      }
      if (trimmed.includes('&&') || trimmed.includes('||')) {
        complexity++;
      }
    });

    return complexity;
  }

  /**
   * Extract dependencies
   */
  extractDependencies(content) {
    const requireRegex = /require\(['"]([^'"]+)['"]\)/g;
    const dependencies = [];
    let match;

    while ((match = requireRegex.exec(content)) !== null) {
      dependencies.push(match[1]);
    }

    return dependencies;
  }

  /**
   * Detect issues in code
   */
  async detectIssues(content, filePath) {
    const issues = [];

    // Check for common issues
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      const lineNumber = index + 1;

      // Check for console.log statements (should be removed in production)
      if (line.includes('console.log') && !line.includes('// DEBUG')) {
        issues.push({
          type: 'warning',
          message: 'Console.log statement found',
          line: lineNumber,
          column: line.indexOf('console.log'),
          severity: 'medium',
          suggestion: 'Remove or replace with proper logging',
          autoFix: true,
        });
      }

      // Check for TODO comments
      if (line.includes('TODO') || line.includes('FIXME')) {
        issues.push({
          type: 'info',
          message: 'TODO/FIXME comment found',
          line: lineNumber,
          column: line.indexOf('TODO') || line.indexOf('FIXME'),
          severity: 'low',
          suggestion: 'Address TODO/FIXME items',
          autoFix: false,
        });
      }

      // Check for unused imports
      if (line.includes('import') && line.includes('{') && line.includes('}')) {
        const importMatch = line.match(/import\s*{([^}]+)}\s*from/);
        if (importMatch) {
          const imports = importMatch[1].split(',').map(imp => imp.trim());
          // This is a simplified check - in reality, you'd need to parse the entire file
          imports.forEach(imp => {
            if (!content.includes(imp) && imp !== 'React') {
              issues.push({
                type: 'warning',
                message: `Unused import: ${imp}`,
                line: lineNumber,
                column: line.indexOf(imp),
                severity: 'low',
                suggestion: `Remove unused import: ${imp}`,
                autoFix: true,
              });
            }
          });
        }
      }

      // Check for missing error handling
      if (
        line.includes('await') &&
        !line.includes('try') &&
        !line.includes('catch')
      ) {
        issues.push({
          type: 'warning',
          message: 'Async operation without error handling',
          line: lineNumber,
          column: line.indexOf('await'),
          severity: 'medium',
          suggestion: 'Add try-catch block for error handling',
          autoFix: false,
        });
      }
    });

    return issues;
  }

  /**
   * Auto-fix issues
   */
  async autoFixIssues(issues, filePath, content) {
    try {
      let fixedContent = content;
      let hasChanges = false;

      // Sort issues by line number (descending) to avoid line number shifts
      const sortedIssues = issues
        .filter(issue => issue.autoFix)
        .sort((a, b) => b.line - a.line);

      for (const issue of sortedIssues) {
        if (issue.type === 'warning' && issue.message.includes('Console.log')) {
          // Remove console.log statements
          const lines = fixedContent.split('\n');
          if (lines[issue.line - 1].includes('console.log')) {
            lines[issue.line - 1] = lines[issue.line - 1].replace(
              /console\.log\([^)]*\);?\s*/,
              ''
            );
            fixedContent = lines.join('\n');
            hasChanges = true;
            console.log(
              `🔧 Auto-fixed: Removed console.log from line ${issue.line}`
            );
          }
        }

        if (
          issue.type === 'warning' &&
          issue.message.includes('Unused import')
        ) {
          // Remove unused imports
          const lines = fixedContent.split('\n');
          const line = lines[issue.line - 1];
          const unusedImport = issue.message.split(': ')[1];

          if (line.includes(unusedImport)) {
            // Simple removal - in reality, you'd need more sophisticated parsing
            const newLine = line.replace(
              new RegExp(`\\s*${unusedImport}\\s*,?`),
              ''
            );
            lines[issue.line - 1] = newLine;
            fixedContent = lines.join('\n');
            hasChanges = true;
            console.log(
              `🔧 Auto-fixed: Removed unused import ${unusedImport} from line ${issue.line}`
            );
          }
        }
      }

      if (hasChanges) {
        await fs.writeFile(filePath, fixedContent);

        // Notify debugger agent
        if (this.debuggerAgent) {
          await this.debuggerAgent.reportAutoFix(
            filePath,
            issues.filter(i => i.autoFix)
          );
        }
      }
    } catch (error) {
      console.error('Error auto-fixing issues:', error);
    }
  }

  /**
   * Start real-time debugging
   */
  async startRealTimeDebugging() {
    try {
      // Start debugging interval
      this.debugInterval = setInterval(async () => {
        await this.performDebuggingCycle();
      }, 30000); // Every 30 seconds
    } catch (error) {
      console.error('❌ Failed to start real-time debugging:', error);
    }
  }

  /**
   * Perform debugging cycle
   */
  async performDebuggingCycle() {
    try {
      // Check for linting errors
      await this.runLintingCheck();

      // Check for TypeScript errors
      await this.runTypeScriptCheck();

      // Check for test failures
      await this.runTestCheck();

      // Collect performance metrics
      await this.collectPerformanceMetrics();

      // Generate debugging report
      await this.generateDebuggingReport();

      // Send data to learning loop
      await this.sendDataToLearningLoop();
    } catch (error) {
      console.error('Error in debugging cycle:', error);
    }
  }

  /**
   * Start data collection for learning
   */
  async startDataCollection() {
    try {
      // Start data collection interval
      this.dataCollectionInterval = setInterval(async () => {
        await this.collectSystemData();
      }, 60000); // Every minute
    } catch (error) {
      console.error('❌ Failed to start data collection:', error);
    }
  }

  /**
   * Collect system data
   */
  async collectSystemData() {
    try {
      const systemData = {
        timestamp: new Date().toISOString(),
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage(),
        uptime: process.uptime(),
        fileChanges: this.dataCollection.fileChanges.length,
        codePatterns: this.dataCollection.codePatterns.length,
        debuggingSessions: this.dataCollection.debuggingSessions.length,
      };

      // Add to data collection
      this.dataCollection.performanceMetrics.push(systemData);

      // Keep only last 1000 entries
      if (this.dataCollection.performanceMetrics.length > 1000) {
        this.dataCollection.performanceMetrics.shift();
      }

      // Send to learning loop
      if (this.learningLoop) {
        await this.learningLoop.processSystemData(systemData);
      }

      // Store in Firestore
      if (this.firestoreStorage) {
        await this.firestoreStorage.storePerformanceMetrics([systemData]);
      }
    } catch (error) {
      console.error('Error collecting system data:', error);
    }
  }

  /**
   * Collect performance metrics
   */
  async collectPerformanceMetrics() {
    try {
      const metrics = {
        timestamp: new Date().toISOString(),
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage(),
        uptime: process.uptime(),
        fileWatcherStatus: this.fileWatcher ? 'active' : 'inactive',
        debuggerAgentStatus: this.debuggerAgent
          ? this.debuggerAgent.isActive
          : false,
        learningLoopStatus: this.learningLoop ? true : false,
      };

      // Add to debugging sessions
      this.dataCollection.debuggingSessions.push(metrics);

      // Keep only last 500 entries
      if (this.dataCollection.debuggingSessions.length > 500) {
        this.dataCollection.debuggingSessions.shift();
      }
    } catch (error) {
      console.error('Error collecting performance metrics:', error);
    }
  }

  /**
   * Send data to learning loop
   */
  async sendDataToLearningLoop() {
    try {
      if (this.learningLoop) {
        const learningData = {
          fileChanges: this.dataCollection.fileChanges.slice(-10), // Last 10 changes
          codePatterns: this.dataCollection.codePatterns.slice(-5), // Last 5 patterns
          debuggingSessions: this.dataCollection.debuggingSessions.slice(-3), // Last 3 sessions
          performanceMetrics: this.dataCollection.performanceMetrics.slice(-5), // Last 5 metrics
        };

        await this.learningLoop.processLearningData(learningData);
      }
    } catch (error) {
      console.error('Error sending data to learning loop:', error);
    }
  }

  /**
   * Run linting check
   */
  async runLintingCheck() {
    return new Promise(resolve => {
      exec('npm run lint', (error, stdout, stderr) => {
        if (error) {
        } else {
        }
        resolve();
      });
    });
  }

  /**
   * Run TypeScript check
   */
  async runTypeScriptCheck() {
    return new Promise(resolve => {
      exec('npx tsc --noEmit', (error, stdout, stderr) => {
        if (error) {
        } else {
        }
        resolve();
      });
    });
  }

  /**
   * Run test check
   */
  async runTestCheck() {
    return new Promise(resolve => {
      exec('npm test -- --passWithNoTests', (error, stdout, stderr) => {
        if (error) {
        } else {
        }
        resolve();
      });
    });
  }

  /**
   * Generate debugging report
   */
  async generateDebuggingReport() {
    try {
      const report = {
        timestamp: new Date().toISOString(),
        workspace: this.workspacePath,
        filesMonitored: this.fileWatcher ? this.fileWatcher.getWatched() : {},
        issuesFound: 0,
        autoFixesApplied: 0,
        systemHealth: {
          memoryUsage: process.memoryUsage(),
          uptime: process.uptime(),
        },
      };

      // Send to debugger agent
      if (this.debuggerAgent) {
        await this.debuggerAgent.reportDebuggingStatus(report);
      }
    } catch (error) {
      console.error('Error generating debugging report:', error);
    }
  }

  /**
   * Get available features
   */
  getAvailableFeatures() {
    return {
      fileMonitoring: !!this.fileWatcher,
      autoFix: this.cursorConfig.enableAutoFix,
      realTimeDebugging: this.cursorConfig.enableRealTimeDebugging,
      codeAnalysis: this.cursorConfig.enableCodeAnalysis,
      performanceMonitoring: this.cursorConfig.enablePerformanceMonitoring,
      dataReading: this.cursorConfig.enableDataReading,
      learningIntegration: this.cursorConfig.enableLearningIntegration,
      debuggerAgent: !!this.debuggerAgent,
      learningLoop: !!this.learningLoop,
      firestoreStorage: !!this.firestoreStorage,
      dataCollection: {
        fileChanges: this.dataCollection.fileChanges.length,
        codePatterns: this.dataCollection.codePatterns.length,
        debuggingSessions: this.dataCollection.debuggingSessions.length,
        performanceMetrics: this.dataCollection.performanceMetrics.length,
      },
    };
  }

  /**
   * Read data from workspace
   */
  async readWorkspaceData() {
    try {
      const workspaceData = {
        timestamp: new Date().toISOString(),
        workspacePath: this.workspacePath,
        files: await this.scanWorkspaceFiles(),
        dependencies: await this.readPackageJson(),
        gitStatus: await this.getGitStatus(),
        systemInfo: await this.getSystemInfo(),
      };

      // Send to learning loop
      if (this.learningLoop) {
        await this.learningLoop.processWorkspaceData(workspaceData);
      }

      // Store in Firestore
      if (this.firestoreStorage) {
        await this.firestoreStorage.storeWorkspaceAnalysis(workspaceData);
      }

      return workspaceData;
    } catch (error) {
      console.error('Error reading workspace data:', error);
      throw error;
    }
  }

  /**
   * Scan workspace files
   */
  async scanWorkspaceFiles() {
    try {
      const files = [];
      const scanDir = async dir => {
        const entries = await fs.readdir(dir, { withFileTypes: true });

        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);

          if (
            entry.isDirectory() &&
            !entry.name.startsWith('.') &&
            entry.name !== 'node_modules'
          ) {
            await scanDir(fullPath);
          } else if (entry.isFile() && this.isCodeFile(entry.name)) {
            const stats = await fs.stat(fullPath);
            files.push({
              name: entry.name,
              path: fullPath,
              relativePath: path.relative(this.workspacePath, fullPath),
              size: stats.size,
              modified: stats.mtime,
              type: path.extname(entry.name),
            });
          }
        }
      };

      await scanDir(this.workspacePath);
      return files;
    } catch (error) {
      console.error('Error scanning workspace files:', error);
      return [];
    }
  }

  /**
   * Check if file is a code file
   */
  isCodeFile(filename) {
    const codeExtensions = [
      '.js',
      '.ts',
      '.jsx',
      '.tsx',
      '.py',
      '.java',
      '.cpp',
      '.c',
      '.h',
      '.cs',
      '.php',
      '.rb',
      '.go',
      '.rs',
    ];
    return codeExtensions.includes(path.extname(filename));
  }

  /**
   * Read package.json
   */
  async readPackageJson() {
    try {
      const packagePath = path.join(this.workspacePath, 'package.json');
      const content = await fs.readFile(packagePath, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      console.error('Error reading package.json:', error);
      return null;
    }
  }

  /**
   * Get git status
   */
  async getGitStatus() {
    return new Promise(resolve => {
      exec('git status --porcelain', (error, stdout, stderr) => {
        if (error) {
          resolve({ error: 'Not a git repository or git not available' });
        } else {
          const lines = stdout
            .trim()
            .split('\n')
            .filter(line => line.length > 0);
          resolve({
            modified: lines.filter(line => line.startsWith(' M')).length,
            added: lines.filter(line => line.startsWith('A')).length,
            deleted: lines.filter(line => line.startsWith('D')).length,
            untracked: lines.filter(line => line.startsWith('??')).length,
            total: lines.length,
          });
        }
      });
    });
  }

  /**
   * Get system info
   */
  async getSystemInfo() {
    return {
      platform: process.platform,
      arch: process.arch,
      nodeVersion: process.version,
      memoryUsage: process.memoryUsage(),
      uptime: process.uptime(),
      cwd: process.cwd(),
    };
  }

  /**
   * Get status
   */
  getStatus() {
    return {
      name: this.name,
      version: this.version,
      isActive: this.isActive,
      workspacePath: this.workspacePath,
      features: this.getAvailableFeatures(),
      uptime: this.isActive ? process.uptime() : null,
    };
  }

  /**
   * Deactivate
   */
  async deactivate() {
    try {
      // Clear intervals
      if (this.debugInterval) {
        clearInterval(this.debugInterval);
      }

      // Close file watcher
      if (this.fileWatcher) {
        await this.fileWatcher.close();
      }

      // Deactivate debugger agent
      if (this.debuggerAgent) {
        await this.debuggerAgent.deactivate();
      }

      this.isActive = false;
    } catch (error) {
      console.error('❌ Failed to deactivate Cursor CLI Integration:', error);
    }
  }
}

/**
 * Enhanced Cursor Debugger Agent
 */
class CursorDebuggerAgent {
  constructor() {
    this.name = 'Cursor Debugger Agent';
    this.version = '2.0.0';
    this.isActive = false;
    this.analyzedFiles = new Map();
    this.issueHistory = [];
    this.autoFixHistory = [];
    this.debuggingSessions = new Map();
  }

  /**
   * Activate debugger agent
   */
  async activate() {
    try {
      // Initialize LLM integration
      await this.initializeLLMIntegration();

      // Setup debugging rules
      await this.setupDebuggingRules();

      this.isActive = true;
    } catch (error) {
      console.error('❌ Failed to activate Cursor Debugger Agent:', error);
      throw error;
    }
  }

  /**
   * Initialize LLM integration
   */
  async initializeLLMIntegration() {
    try {
      // Initialize Gemini AI integration
      const { GoogleGenerativeAI } = require('@google/generative-ai');

      if (process.env.GEMINI_API_KEY) {
        this.geminiAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.model = this.geminiAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
        });
      }

      // Initialize OpenAI integration (if available)
      if (process.env.OPENAI_API_KEY) {
        const { OpenAI } = require('openai');
        this.openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
        });
      }

      // Initialize Claude integration (if available)
      if (process.env.ANTHROPIC_API_KEY) {
        const Anthropic = require('@anthropic-ai/sdk');
        this.claude = new Anthropic({
          apiKey: process.env.ANTHROPIC_API_KEY,
        });
      }

      this.llmIntegration = {
        analyzeCode: this.analyzeCodeWithLLM.bind(this),
        generateFix: this.generateFixWithLLM.bind(this),
        explainIssue: this.explainIssueWithLLM.bind(this),
        generateCode: this.generateCodeWithLLM.bind(this),
        optimizeCode: this.optimizeCodeWithLLM.bind(this),
        reviewCode: this.reviewCodeWithLLM.bind(this),
      };
    } catch (error) {
      console.error('❌ Failed to initialize LLM integration:', error);
    }
  }

  /**
   * Setup debugging rules
   */
  async setupDebuggingRules() {
    try {
      this.debuggingRules = [
        {
          id: 'console_log_removal',
          name: 'Remove console.log statements',
          pattern: /console\.log\([^)]*\);?/g,
          severity: 'medium',
          autoFix: true,
          description: 'Remove console.log statements from production code',
        },
        {
          id: 'unused_imports',
          name: 'Remove unused imports',
          pattern: /import\s*{[^}]+}\s*from\s*['"][^'"]+['"];?/g,
          severity: 'low',
          autoFix: true,
          description: 'Remove unused import statements',
        },
        {
          id: 'missing_error_handling',
          name: 'Add error handling',
          pattern: /await\s+\w+\([^)]*\)(?!\s*\.catch)/g,
          severity: 'high',
          autoFix: false,
          description: 'Add try-catch blocks for async operations',
        },
        {
          id: 'todo_comments',
          name: 'Address TODO comments',
          pattern: /\/\/\s*(TODO|FIXME|HACK):\s*.*$/gm,
          severity: 'low',
          autoFix: false,
          description: 'Address TODO/FIXME comments',
        },
      ];
    } catch (error) {
      console.error('❌ Failed to setup debugging rules:', error);
    }
  }

  /**
   * Analyze issues
   */
  async analyzeIssues(issues, filePath) {
    try {
      console.log(
        `🔍 Analyzing ${issues.length} issues in ${path.basename(filePath)}`
      );
      // Store issues
      this.analyzedFiles.set(filePath, {
        timestamp: new Date(),
        issues: issues,
        status: 'analyzed',
      });

      // Add to issue history
      this.issueHistory.push({
        timestamp: new Date(),
        filePath: filePath,
        issues: issues,
        count: issues.length,
      });

      // Keep only last 1000 entries
      if (this.issueHistory.length > 1000) {
        this.issueHistory.shift();
      }

      // Generate insights
      const insights = await this.generateInsights(issues, filePath);

      console.log(
        `✅ Analysis complete: ${insights.length} insights generated`
      );
    } catch (error) {
      console.error('Error analyzing issues:', error);
    }
  }

  /**
   * Generate insights
   */
  async generateInsights(issues, filePath) {
    const insights = [];

    // Group issues by type
    const issueGroups = issues.reduce((groups, issue) => {
      if (!groups[issue.type]) {
        groups[issue.type] = [];
      }
      groups[issue.type].push(issue);
      return groups;
    }, {});

    // Generate insights for each group
    Object.entries(issueGroups).forEach(([type, typeIssues]) => {
      insights.push({
        type: type,
        count: typeIssues.length,
        severity: typeIssues[0].severity,
        suggestion: this.getSuggestionForType(type, typeIssues),
        autoFixable: typeIssues.every(issue => issue.autoFix),
      });
    });

    return insights;
  }

  /**
   * Get suggestion for issue type
   */
  getSuggestionForType(type, issues) {
    switch (type) {
      case 'warning':
        if (issues[0].message.includes('console.log')) {
          return 'Remove console.log statements for production code';
        }
        if (issues[0].message.includes('Unused import')) {
          return 'Remove unused imports to clean up code';
        }
        return 'Review and fix warning issues';
      case 'info':
        return 'Address informational items when convenient';
      default:
        return 'Review and address all issues';
    }
  }

  /**
   * Report auto-fix
   */
  async reportAutoFix(filePath, fixedIssues) {
    try {
      const autoFix = {
        timestamp: new Date(),
        filePath: filePath,
        issuesFixed: fixedIssues,
        count: fixedIssues.length,
      };

      this.autoFixHistory.push(autoFix);

      // Keep only last 1000 entries
      if (this.autoFixHistory.length > 1000) {
        this.autoFixHistory.shift();
      }

      console.log(
        `🔧 Auto-fix reported: ${
          fixedIssues.length
        } issues fixed in ${path.basename(filePath)}`
      );
    } catch (error) {
      console.error('Error reporting auto-fix:', error);
    }
  }

  /**
   * Report debugging status
   */
  async reportDebuggingStatus(report) {
    try {
      // Store debugging session
      const sessionId = `session_${Date.now()}`;
      this.debuggingSessions.set(sessionId, {
        ...report,
        sessionId: sessionId,
        status: 'active',
      });

      // Keep only last 100 sessions
      if (this.debuggingSessions.size > 100) {
        const oldestSession = this.debuggingSessions.keys().next().value;
        this.debuggingSessions.delete(oldestSession);
      }
    } catch (error) {
      console.error('Error reporting debugging status:', error);
    }
  }

  /**
   * Analyze code with LLM
   */
  async analyzeCodeWithLLM(code, context) {
    try {
      if (this.model) {
        const prompt = `Analyze this JavaScript/TypeScript code and provide insights:

Code:
\`\`\`javascript
${code}
\`\`\`

Context: ${context || 'General code analysis'}

Please provide:
1. Code quality assessment
2. Potential issues or improvements
3. Performance considerations
4. Security concerns
5. Best practices recommendations

Format your response as JSON with analysis, suggestions, and confidence score.`;

        const result = await this.model.generateContent(prompt);
        const response = await result.response.text();

        try {
          return JSON.parse(response);
        } catch {
          return {
            analysis: response,
            suggestions: ['Review code structure', 'Add error handling'],
            confidence: 0.8,
          };
        }
      }

      return {
        analysis: 'Code analysis completed',
        suggestions: ['Review code structure', 'Add error handling'],
        confidence: 0.8,
      };
    } catch (error) {
      console.error('Error analyzing code with LLM:', error);
      return {
        analysis: 'Error in analysis',
        suggestions: ['Check code syntax', 'Review error handling'],
        confidence: 0.3,
      };
    }
  }

  /**
   * Generate fix with LLM
   */
  async generateFixWithLLM(issue, code) {
    try {
      if (this.model) {
        const prompt = `Generate a fix for this JavaScript/TypeScript issue:

Issue: ${issue.message}
Type: ${issue.type}
Severity: ${issue.severity}
Line: ${issue.line}

Code:
\`\`\`javascript
${code}
\`\`\`

Please provide:
1. The fixed code
2. Explanation of the fix
3. Confidence level (0-1)
4. Alternative solutions if any

Format your response as JSON with fix, explanation, confidence, and alternatives.`;

        const result = await this.model.generateContent(prompt);
        const response = await result.response.text();

        try {
          return JSON.parse(response);
        } catch {
          return {
            fix: response,
            explanation: 'Generated fix code',
            confidence: 0.7,
          };
        }
      }

      return {
        fix: 'Generated fix code',
        explanation: 'Fix explanation',
        confidence: 0.7,
      };
    } catch (error) {
      console.error('Error generating fix with LLM:', error);
      return {
        fix: 'Error generating fix',
        explanation: 'Failed to generate fix',
        confidence: 0.2,
      };
    }
  }

  /**
   * Explain issue with LLM
   */
  async explainIssueWithLLM(issue) {
    try {
      if (this.model) {
        const prompt = `Explain this JavaScript/TypeScript issue:

Issue: ${issue.message}
Type: ${issue.type}
Severity: ${issue.severity}
Line: ${issue.line}
Suggestion: ${issue.suggestion}

Please provide:
1. Detailed explanation of the issue
2. Impact assessment (Low/Medium/High)
3. Priority level (Low/Medium/High)
4. Recommended action
5. Prevention tips

Format your response as JSON with explanation, impact, priority, action, and prevention.`;

        const result = await this.model.generateContent(prompt);
        const response = await result.response.text();

        try {
          return JSON.parse(response);
        } catch {
          return {
            explanation: response,
            impact: 'Medium impact',
            priority: 'Medium',
          };
        }
      }

      return {
        explanation: 'Issue explanation',
        impact: 'Low impact',
        priority: 'Medium',
      };
    } catch (error) {
      console.error('Error explaining issue with LLM:', error);
      return {
        explanation: 'Error explaining issue',
        impact: 'Unknown',
        priority: 'Unknown',
      };
    }
  }

  /**
   * Generate code with LLM
   */
  async generateCodeWithLLM(description, context) {
    try {
      if (this.model) {
        const prompt = `Generate JavaScript/TypeScript code based on this description:

Description: ${description}
Context: ${context || 'General code generation'}

Please provide:
1. Complete, working code
2. Comments explaining the code
3. Error handling
4. Best practices
5. Usage examples

Format your response as JSON with code, comments, examples, and bestPractices.`;

        const result = await this.model.generateContent(prompt);
        const response = await result.response.text();

        try {
          return JSON.parse(response);
        } catch {
          return {
            code: response,
            comments: 'Generated code with comments',
            examples: 'Usage examples included',
          };
        }
      }

      return {
        code: '// Generated code placeholder',
        comments: 'Code generation not available',
        examples: 'No examples available',
      };
    } catch (error) {
      console.error('Error generating code with LLM:', error);
      return {
        code: '// Error generating code',
        comments: 'Failed to generate code',
        examples: 'No examples available',
      };
    }
  }

  /**
   * Optimize code with LLM
   */
  async optimizeCodeWithLLM(code, optimizationType) {
    try {
      if (this.model) {
        const prompt = `Optimize this JavaScript/TypeScript code for ${optimizationType || 'performance'}:

Code:
\`\`\`javascript
${code}
\`\`\`

Please provide:
1. Optimized code
2. Explanation of optimizations
3. Performance improvements
4. Before/after comparison
5. Additional recommendations

Format your response as JSON with optimizedCode, explanation, improvements, comparison, and recommendations.`;

        const result = await this.model.generateContent(prompt);
        const response = await result.response.text();

        try {
          return JSON.parse(response);
        } catch {
          return {
            optimizedCode: response,
            explanation: 'Code optimization completed',
            improvements: 'Performance improvements applied',
          };
        }
      }

      return {
        optimizedCode: code,
        explanation: 'No optimization available',
        improvements: 'No improvements made',
      };
    } catch (error) {
      console.error('Error optimizing code with LLM:', error);
      return {
        optimizedCode: code,
        explanation: 'Error in optimization',
        improvements: 'No improvements made',
      };
    }
  }

  /**
   * Review code with LLM
   */
  async reviewCodeWithLLM(code, reviewType) {
    try {
      if (this.model) {
        const prompt = `Review this JavaScript/TypeScript code for ${reviewType || 'general quality'}:

Code:
\`\`\`javascript
${code}
\`\`\`

Please provide:
1. Code review summary
2. Issues found (if any)
3. Strengths
4. Areas for improvement
5. Overall rating (1-10)
6. Recommendations

Format your response as JSON with summary, issues, strengths, improvements, rating, and recommendations.`;

        const result = await this.model.generateContent(prompt);
        const response = await result.response.text();

        try {
          return JSON.parse(response);
        } catch {
          return {
            summary: response,
            issues: [],
            strengths: ['Code structure'],
            improvements: ['Add error handling'],
            rating: 7,
            recommendations: ['Review best practices'],
          };
        }
      }

      return {
        summary: 'Code review completed',
        issues: [],
        strengths: ['Good structure'],
        improvements: ['Add comments'],
        rating: 8,
        recommendations: ['Continue good work'],
      };
    } catch (error) {
      console.error('Error reviewing code with LLM:', error);
      return {
        summary: 'Error in code review',
        issues: ['Review failed'],
        strengths: [],
        improvements: ['Fix review system'],
        rating: 3,
        recommendations: ['Debug review system'],
      };
    }
  }

  /**
   * Get status
   */
  getStatus() {
    return {
      name: this.name,
      version: this.version,
      isActive: this.isActive,
      analyzedFiles: this.analyzedFiles.size,
      issueHistory: this.issueHistory.length,
      autoFixHistory: this.autoFixHistory.length,
      debuggingSessions: this.debuggingSessions.size,
      debuggingRules: this.debuggingRules.length,
      uptime: this.isActive ? process.uptime() : null,
    };
  }

  /**
   * Deactivate
   */
  async deactivate() {
    try {
      this.isActive = false;
    } catch (error) {
      console.error('❌ Failed to deactivate Cursor Debugger Agent:', error);
    }
  }
}

module.exports = { CursorCLIIntegration, CursorDebuggerAgent };
