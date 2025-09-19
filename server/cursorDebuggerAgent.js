const { readFile, writeFile, readdir } = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

class CursorDebuggerAgent {
  constructor() {
    this.workspaceRoot = process.cwd();
    this.fixHistory = new Map();
    this.patternDatabase = new Map();
    this.isActive = false;
    this.cursorWorkspace = null;
    this.llmIntegration = null;
    this.workspaceContext = new Map();
    console.log('🔧 Cursor Debugger Agent initialized');
  }

  // Activate the debugger agent
  activate() {
    this.isActive = true;
    this.initializeCursorWorkspace();
    this.initializeLLMIntegration();
    console.log('🟢 Cursor Debugger Agent activated');
    console.log('🔗 Cursor workspace integration enabled');
    console.log('🧠 LLM integration enabled');
    return this;
  }

  // Initialize Cursor workspace integration
  async initializeCursorWorkspace() {
    try {
      // Scan workspace for project structure
      await this.scanWorkspace();
      console.log('📁 Workspace scanned successfully');
    } catch (error) {
      console.error('Failed to initialize Cursor workspace:', error);
    }
  }

  // Initialize LLM integration for debugging
  async initializeLLMIntegration() {
    try {
      // Set up LLM context for debugging
      this.llmIntegration = {
        context: await this.buildLLMContext(),
        capabilities: [
          'code-analysis',
          'error-pattern-recognition',
          'fix-suggestion',
          'code-generation',
          'refactoring'
        ],
        isActive: true
      };
      console.log('🧠 LLM integration initialized');
    } catch (error) {
      console.error('Failed to initialize LLM integration:', error);
    }
  }

  // Scan workspace for project structure
  async scanWorkspace() {
    try {
      const projectStructure = await this.getProjectStructure();
      this.workspaceContext.set('structure', projectStructure);
      
      // Analyze key files
      const keyFiles = await this.analyzeKeyFiles();
      this.workspaceContext.set('keyFiles', keyFiles);
      
      // Build dependency graph
      const dependencies = await this.buildDependencyGraph();
      this.workspaceContext.set('dependencies', dependencies);
      
    } catch (error) {
      console.error('Failed to scan workspace:', error);
    }
  }

  // Get project structure
  async getProjectStructure() {
    try {
      const structure = {
        root: this.workspaceRoot,
        client: await this.scanDirectory(path.join(this.workspaceRoot, 'client')),
        server: await this.scanDirectory(path.join(this.workspaceRoot, 'server')),
        config: await this.scanDirectory(this.workspaceRoot, ['package.json', 'firebase.json', 'firebase.env'])
      };
      return structure;
    } catch (error) {
      console.error('Failed to get project structure:', error);
      return null;
    }
  }

  // Scan directory for files
  async scanDirectory(dirPath, filterExtensions = null) {
    try {
      const files = await readdir(dirPath, { withFileTypes: true });
      const result = {
        files: [],
        directories: []
      };

      for (const file of files) {
        if (file.isDirectory()) {
          result.directories.push(file.name);
        } else if (file.isFile()) {
          if (!filterExtensions || filterExtensions.includes(file.name)) {
            result.files.push(file.name);
          }
        }
      }

      return result;
    } catch (error) {
      console.error(`Failed to scan directory ${dirPath}:`, error);
      return { files: [], directories: [] };
    }
  }

  // Analyze key files for context
  async analyzeKeyFiles() {
    const keyFiles = {};
    
    try {
      // Analyze package.json
      const packageJsonPath = path.join(this.workspaceRoot, 'package.json');
      const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8'));
      keyFiles.packageJson = {
        dependencies: packageJson.dependencies || {},
        scripts: packageJson.scripts || {},
        name: packageJson.name
      };

      // Analyze firebase.env
      const envPath = path.join(this.workspaceRoot, 'firebase.env');
      const envContent = await readFile(envPath, 'utf8');
      keyFiles.environment = this.parseEnvFile(envContent);

      // Analyze main server file
      const serverPath = path.join(this.workspaceRoot, 'server', 'index.js');
      const serverContent = await readFile(serverPath, 'utf8');
      keyFiles.server = {
        imports: this.extractImports(serverContent),
        exports: this.extractExports(serverContent),
        functions: this.extractFunctions(serverContent)
      };

    } catch (error) {
      console.error('Failed to analyze key files:', error);
    }

    return keyFiles;
  }

  // Build dependency graph
  async buildDependencyGraph() {
    const graph = {
      internal: new Map(),
      external: new Map()
    };

    try {
      // Scan server files for dependencies
      const serverFiles = await this.getServerFiles();
      for (const file of serverFiles) {
        const content = await readFile(file, 'utf8');
        const imports = this.extractImports(content);
        
        for (const imp of imports) {
          if (imp.startsWith('./') || imp.startsWith('../')) {
            // Internal dependency
            if (!graph.internal.has(imp)) {
              graph.internal.set(imp, []);
            }
            graph.internal.get(imp).push(file);
          } else {
            // External dependency
            if (!graph.external.has(imp)) {
              graph.external.set(imp, []);
            }
            graph.external.get(imp).push(file);
          }
        }
      }
    } catch (error) {
      console.error('Failed to build dependency graph:', error);
    }

    return graph;
  }

  // Get server files
  async getServerFiles() {
    try {
      const serverDir = path.join(this.workspaceRoot, 'server');
      const files = await readdir(serverDir);
      return files
        .filter(file => file.endsWith('.js'))
        .map(file => path.join(serverDir, file));
    } catch (error) {
      console.error('Failed to get server files:', error);
      return [];
    }
  }

  // Build LLM context for debugging
  async buildLLMContext() {
    const context = {
      projectType: 'Node.js + React',
      framework: 'Express + Socket.io',
      database: 'Firebase Firestore',
      authentication: 'Firebase Auth',
      deployment: 'Firebase Hosting',
      workspaceStructure: this.workspaceContext.get('structure'),
      keyFiles: this.workspaceContext.get('keyFiles'),
      dependencies: this.workspaceContext.get('dependencies'),
      commonPatterns: this.getCommonPatterns()
    };

    return context;
  }

  // Get common error patterns
  getCommonPatterns() {
    return {
      'firebase-permission': {
        description: 'Firebase permission denied errors',
        commonCauses: [
          'Missing Firestore rules',
          'Incorrect API key configuration',
          'Authentication not properly set up'
        ],
        solutions: [
          'Update firestore.rules',
          'Check environment variables',
          'Verify Firebase project settings'
        ]
      },
      'network-connection': {
        description: 'Network connection issues',
        commonCauses: [
          'Wrong API URL',
          'CORS configuration',
          'Server not running'
        ],
        solutions: [
          'Check API_BASE_URL',
          'Update CORS settings',
          'Verify server status'
        ]
      },
      'module-import': {
        description: 'Module import/export issues',
        commonCauses: [
          'Missing dependencies',
          'Incorrect import paths',
          'ES6/CommonJS mismatch'
        ],
        solutions: [
          'Install missing packages',
          'Fix import paths',
          'Convert module syntax'
        ]
      }
    };
  }

  // Deactivate the debugger agent
  deactivate() {
    this.isActive = false;
    console.log('🔴 Cursor Debugger Agent deactivated');
    return this;
  }

  // Main debugging method - analyzes error and suggests fixes
  async debugError(errorData) {
    if (!this.isActive) {
      console.log('⚠️ Debugger Agent is not active');
      return null;
    }

    try {
      console.log(`🔍 Debugging error: ${errorData.message}`);
      
      // Step 1: Analyze error pattern
      const errorPattern = await this.analyzeErrorPattern(errorData);
      
      // Step 2: Check for existing fixes
      const existingFix = await this.findExistingFix(errorPattern);
      if (existingFix) {
        console.log(`✅ Found existing fix pattern: ${existingFix.type}`);
        return await this.applyExistingFix(existingFix, errorData);
      }

      // Step 3: Generate new fix using Cursor workspace context
      const suggestedFix = await this.generateFix(errorData, errorPattern);
      
      // Step 4: Store fix pattern for future use
      await this.storeFixPattern(errorPattern, suggestedFix);
      
      return suggestedFix;

    } catch (error) {
      console.error('Error in debugError:', error);
      return null;
    }
  }

  // Analyze error pattern to understand the issue
  async analyzeErrorPattern(errorData) {
    const pattern = {
      type: this.categorizeError(errorData.message),
      file: errorData.file,
      line: errorData.line,
      context: await this.getFileContext(errorData.file, errorData.line),
      timestamp: new Date().toISOString()
    };

    console.log(`📊 Error pattern analyzed: ${pattern.type}`);
    return pattern;
  }

  // Categorize error type
  categorizeError(message) {
    const msg = message.toLowerCase();
    
    if (msg.includes('firebase') && msg.includes('permission')) {
      return 'firebase-permission';
    }
    if (msg.includes('network') || msg.includes('connection')) {
      return 'network-connection';
    }
    if (msg.includes('api') && msg.includes('key')) {
      return 'api-key-config';
    }
    if (msg.includes('socket') && msg.includes('connection')) {
      return 'socket-connection';
    }
    if (msg.includes('syntax') || msg.includes('parse')) {
      return 'syntax-error';
    }
    if (msg.includes('import') || msg.includes('module')) {
      return 'module-import';
    }
    if (msg.includes('undefined') || msg.includes('null')) {
      return 'null-reference';
    }
    
    return 'unknown';
  }

  // Get file context around the error line
  async getFileContext(filePath, lineNumber) {
    try {
      if (filePath === 'unknown' || filePath === 'console') {
        return null;
      }

      const fullPath = path.resolve(this.workspaceRoot, filePath);
      const content = await readFile(fullPath, 'utf8');
      const lines = content.split('\n');
      
      const startLine = Math.max(0, lineNumber - 5);
      const endLine = Math.min(lines.length - 1, lineNumber + 5);
      
      return {
        file: filePath,
        lines: lines.slice(startLine, endLine + 1),
        lineNumbers: Array.from({ length: endLine - startLine + 1 }, (_, i) => startLine + i + 1),
        errorLine: lineNumber
      };
    } catch (error) {
      console.log(`Could not read file context for ${filePath}:`, error.message);
      return null;
    }
  }

  // Find existing fix pattern
  async findExistingFix(errorPattern) {
    const patternKey = `${errorPattern.type}-${errorPattern.file}`;
    return this.patternDatabase.get(patternKey);
  }

  // Generate new fix using Cursor workspace analysis
  async generateFix(errorData, errorPattern) {
    console.log(`🔧 Generating fix for: ${errorPattern.type}`);
    
    switch (errorPattern.type) {
      case 'firebase-permission':
        return await this.fixFirebasePermission(errorData, errorPattern);
      case 'network-connection':
        return await this.fixNetworkConnection(errorData, errorPattern);
      case 'api-key-config':
        return await this.fixApiKeyConfig(errorData, errorPattern);
      case 'socket-connection':
        return await this.fixSocketConnection(errorData, errorPattern);
      case 'syntax-error':
        return await this.fixSyntaxError(errorData, errorPattern);
      case 'module-import':
        return await this.fixModuleImport(errorData, errorPattern);
      case 'null-reference':
        return await this.fixNullReference(errorData, errorPattern);
      default:
        return await this.fixGenericError(errorData, errorPattern);
    }
  }

  // Fix Firebase permission issues
  async fixFirebasePermission(errorData, errorPattern) {
    const fixes = [];
    
    // Check Firestore rules
    try {
      const rulesPath = path.join(this.workspaceRoot, 'firestore.rules');
      const rulesContent = await readFile(rulesPath, 'utf8');
      
      if (rulesContent.includes('allow read, write: if false')) {
        fixes.push({
          type: 'firestore-rules',
          action: 'update-firestore-rules',
          description: 'Update Firestore rules to allow authenticated users',
          confidence: 0.9,
          code: `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}`
        });
      }
    } catch (error) {
      console.log('Could not check Firestore rules:', error.message);
    }

    // Check environment variables
    try {
      const envPath = path.join(this.workspaceRoot, 'client', '.env');
      const envContent = await readFile(envPath, 'utf8');
      
      if (!envContent.includes('REACT_APP_FIREBASE_API_KEY')) {
        fixes.push({
          type: 'env-variables',
          action: 'add-firebase-env',
          description: 'Add Firebase environment variables to .env file',
          confidence: 0.8,
          code: `REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id`
        });
      }
    } catch (error) {
      console.log('Could not check environment file:', error.message);
    }

    return {
      type: 'firebase-permission',
      fixes: fixes,
      confidence: fixes.length > 0 ? Math.max(...fixes.map(f => f.confidence)) : 0.5,
      description: 'Firebase permission fixes generated'
    };
  }

  // Fix network connection issues
  async fixNetworkConnection(errorData, errorPattern) {
    const fixes = [];
    
    // Check API URL configuration
    try {
      const apiPath = path.join(this.workspaceRoot, 'client', 'src', 'services', 'api.js');
      const apiContent = await readFile(apiPath, 'utf8');
      
      if (apiContent.includes('localhost:3000')) {
        fixes.push({
          type: 'api-url',
          action: 'update-api-url',
          description: 'Update API URL from port 3000 to 5000',
          confidence: 0.9,
          code: `const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';`
        });
      }
    } catch (error) {
      console.log('Could not check API configuration:', error.message);
    }

    return {
      type: 'network-connection',
      fixes: fixes,
      confidence: fixes.length > 0 ? Math.max(...fixes.map(f => f.confidence)) : 0.5,
      description: 'Network connection fixes generated'
    };
  }

  // Fix API key configuration
  async fixApiKeyConfig(errorData, errorPattern) {
    const fixes = [];
    
    // Check for missing REACT_APP_ prefix
    try {
      const envPath = path.join(this.workspaceRoot, 'client', '.env');
      const envContent = await readFile(envPath, 'utf8');
      
      if (envContent.includes('FIREBASE_API_KEY=') && !envContent.includes('REACT_APP_FIREBASE_API_KEY=')) {
        fixes.push({
          type: 'env-prefix',
          action: 'add-react-app-prefix',
          description: 'Add REACT_APP_ prefix to Firebase environment variables',
          confidence: 0.95,
          code: `REACT_APP_FIREBASE_API_KEY=AIzaSyApDku-geNVplwIgRBz2U0rs46aAVo-_mE
REACT_APP_FIREBASE_AUTH_DOMAIN=aios-97581.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=aios-97581`
        });
      }
    } catch (error) {
      console.log('Could not check environment configuration:', error.message);
    }

    return {
      type: 'api-key-config',
      fixes: fixes,
      confidence: fixes.length > 0 ? Math.max(...fixes.map(f => f.confidence)) : 0.5,
      description: 'API key configuration fixes generated'
    };
  }

  // Fix socket connection issues
  async fixSocketConnection(errorData, errorPattern) {
    return {
      type: 'socket-connection',
      fixes: [{
        type: 'socket-config',
        action: 'check-socket-url',
        description: 'Verify Socket.IO server URL and CORS settings',
        confidence: 0.7,
        code: `const socket = io('http://localhost:5000', {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});`
      }],
      confidence: 0.7,
      description: 'Socket connection fixes generated'
    };
  }

  // Fix syntax errors
  async fixSyntaxError(errorData, errorPattern) {
    if (errorPattern.context) {
      const errorLine = errorPattern.context.lines[errorPattern.context.errorLine - errorPattern.context.lineNumbers[0]];
      
      // Common syntax fixes
      const fixes = [];
      
      if (errorLine && errorLine.includes('import') && errorLine.includes('from') && !errorLine.includes(';')) {
        fixes.push({
          type: 'syntax',
          action: 'add-semicolon',
          description: 'Add missing semicolon to import statement',
          confidence: 0.8,
          code: errorLine.trim() + ';'
        });
      }

      return {
        type: 'syntax-error',
        fixes: fixes,
        confidence: fixes.length > 0 ? Math.max(...fixes.map(f => f.confidence)) : 0.5,
        description: 'Syntax error fixes generated'
      };
    }

    return {
      type: 'syntax-error',
      fixes: [],
      confidence: 0.3,
      description: 'Could not analyze syntax error'
    };
  }

  // Fix module import issues
  async fixModuleImport(errorData, errorPattern) {
    return {
      type: 'module-import',
      fixes: [{
        type: 'import',
        action: 'check-import-path',
        description: 'Verify import path and module installation',
        confidence: 0.6,
        code: '// Check if module is installed: npm install module-name'
      }],
      confidence: 0.6,
      description: 'Module import fixes generated'
    };
  }

  // Fix null reference issues
  async fixNullReference(errorData, errorPattern) {
    return {
      type: 'null-reference',
      fixes: [{
        type: 'null-check',
        action: 'add-null-check',
        description: 'Add null/undefined checks before accessing properties',
        confidence: 0.7,
        code: 'if (variable && variable.property) { /* safe access */ }'
      }],
      confidence: 0.7,
      description: 'Null reference fixes generated'
    };
  }

  // Fix generic errors
  async fixGenericError(errorData, errorPattern) {
    return {
      type: 'generic',
      fixes: [{
        type: 'generic',
        action: 'manual-review',
        description: 'Manual review required for this error type',
        confidence: 0.3,
        code: '// Manual review needed'
      }],
      confidence: 0.3,
      description: 'Generic error fixes generated'
    };
  }

  // Apply existing fix
  async applyExistingFix(existingFix, errorData) {
    console.log(`🔧 Applying existing fix: ${existingFix.type}`);
    
    for (const fix of existingFix.fixes) {
      await this.applyFix(fix, errorData);
    }

    return existingFix;
  }

  // Apply individual fix
  async applyFix(fix, errorData) {
    try {
      console.log(`🔧 Applying fix: ${fix.action}`);
      
      switch (fix.action) {
        case 'update-firestore-rules':
          await this.updateFirestoreRules(fix.code);
          break;
        case 'add-firebase-env':
          await this.addFirebaseEnv(fix.code);
          break;
        case 'update-api-url':
          await this.updateApiUrl(fix.code);
          break;
        case 'add-react-app-prefix':
          await this.addReactAppPrefix(fix.code);
          break;
        case 'check-socket-url':
          console.log('Socket URL check suggested');
          break;
        case 'add-semicolon':
          await this.addSemicolon(errorData.file, fix.code);
          break;
        case 'check-import-path':
          console.log('Import path check suggested');
          break;
        case 'add-null-check':
          console.log('Null check suggested');
          break;
        case 'manual-review':
          console.log('Manual review required');
          break;
      }
    } catch (error) {
      console.error(`Failed to apply fix ${fix.action}:`, error);
    }
  }

  // Update Firestore rules
  async updateFirestoreRules(code) {
    try {
      const rulesPath = path.join(this.workspaceRoot, 'firestore.rules');
      await writeFile(rulesPath, code);
      console.log('✅ Firestore rules updated');
    } catch (error) {
      console.error('Failed to update Firestore rules:', error);
    }
  }

  // Add Firebase environment variables
  async addFirebaseEnv(code) {
    try {
      const envPath = path.join(this.workspaceRoot, 'client', '.env');
      await writeFile(envPath, code);
      console.log('✅ Firebase environment variables added');
    } catch (error) {
      console.error('Failed to add Firebase env:', error);
    }
  }

  // Update API URL
  async updateApiUrl(code) {
    try {
      const apiPath = path.join(this.workspaceRoot, 'client', 'src', 'services', 'api.js');
      const apiContent = await readFile(apiPath, 'utf8');
      const updatedContent = apiContent.replace(
        /const API_BASE_URL = .*;/,
        code
      );
      await writeFile(apiPath, updatedContent);
      console.log('✅ API URL updated');
    } catch (error) {
      console.error('Failed to update API URL:', error);
    }
  }

  // Add REACT_APP_ prefix
  async addReactAppPrefix(code) {
    try {
      const envPath = path.join(this.workspaceRoot, 'client', '.env');
      await writeFile(envPath, code);
      console.log('✅ REACT_APP_ prefix added');
    } catch (error) {
      console.error('Failed to add REACT_APP_ prefix:', error);
    }
  }

  // Add semicolon to import statement
  async addSemicolon(filePath, code) {
    try {
      const fullPath = path.resolve(this.workspaceRoot, filePath);
      const content = await readFile(fullPath, 'utf8');
      const lines = content.split('\n');
      
      // Find and replace the line
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('import') && lines[i].includes('from') && !lines[i].includes(';')) {
          lines[i] = lines[i].trim() + ';';
          break;
        }
      }
      
      await writeFile(fullPath, lines.join('\n'));
      console.log('✅ Semicolon added to import statement');
    } catch (error) {
      console.error('Failed to add semicolon:', error);
    }
  }

  // Store fix pattern for future use
  async storeFixPattern(errorPattern, fix) {
    const patternKey = `${errorPattern.type}-${errorPattern.file}`;
    this.patternDatabase.set(patternKey, fix);
    console.log(`💾 Fix pattern stored: ${patternKey}`);
  }

  // Get debugger status
  getStatus() {
    return {
      isActive: this.isActive,
      patternsStored: this.patternDatabase.size,
      workspaceRoot: this.workspaceRoot,
      cursorWorkspace: this.cursorWorkspace,
      llmIntegration: this.llmIntegration,
      workspaceContext: Object.fromEntries(this.workspaceContext)
    };
  }

  // Parse environment file
  parseEnvFile(content) {
    const env = {};
    const lines = content.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          env[key.trim()] = valueParts.join('=').trim();
        }
      }
    }
    
    return env;
  }

  // Extract imports from code
  extractImports(content) {
    const imports = [];
    const lines = content.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('import ') || trimmed.startsWith('const ') && trimmed.includes('require(')) {
        imports.push(trimmed);
      }
    }
    
    return imports;
  }

  // Extract exports from code
  extractExports(content) {
    const exports = [];
    const lines = content.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('export ') || trimmed.startsWith('module.exports')) {
        exports.push(trimmed);
      }
    }
    
    return exports;
  }

  // Extract functions from code
  extractFunctions(content) {
    const functions = [];
    const lines = content.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('function ') || trimmed.startsWith('const ') && trimmed.includes('= (') || trimmed.startsWith('async ')) {
        functions.push(trimmed);
      }
    }
    
    return functions;
  }

  // Enhanced debugging with LLM context
  async debugErrorWithLLM(errorData) {
    if (!this.isActive || !this.llmIntegration) {
      console.log('⚠️ Debugger Agent or LLM integration not active');
      return null;
    }

    try {
      console.log(`🧠 LLM-enhanced debugging for: ${errorData.message}`);
      
      // Build comprehensive context
      const context = {
        error: errorData,
        workspace: this.workspaceContext.get('structure'),
        dependencies: this.workspaceContext.get('dependencies'),
        keyFiles: this.workspaceContext.get('keyFiles'),
        llmContext: this.llmIntegration.context
      };

      // Generate LLM-powered fix
      const llmFix = await this.generateLLMFix(context);
      
      // Store fix pattern
      await this.storeFixPattern(errorData, llmFix);
      
      return llmFix;

    } catch (error) {
      console.error('Error in LLM debugging:', error);
      return null;
    }
  }

  // Generate fix using LLM context
  async generateLLMFix(context) {
    const { error, workspace, dependencies, keyFiles, llmContext } = context;
    
    // Analyze error with full context
    const analysis = {
      errorType: this.categorizeError(error.message),
      affectedFiles: this.findAffectedFiles(error, workspace),
      relatedDependencies: this.findRelatedDependencies(error, dependencies),
      suggestedFixes: this.generateContextualFixes(error, llmContext)
    };

    return {
      type: 'llm-enhanced',
      analysis: analysis,
      fixes: analysis.suggestedFixes,
      confidence: this.calculateConfidence(analysis),
      description: 'LLM-enhanced fix generated with full workspace context'
    };
  }

  // Find affected files
  findAffectedFiles(error, workspace) {
    const affected = [];
    
    if (error.file && error.file !== 'unknown') {
      affected.push(error.file);
    }

    // Find related files based on error type
    if (error.message.includes('firebase')) {
      affected.push('client/src/services/FirebaseService.js');
      affected.push('server/index.js');
    }

    if (error.message.includes('socket')) {
      affected.push('server/index.js');
      affected.push('client/src/services/api.js');
    }

    return affected;
  }

  // Find related dependencies
  findRelatedDependencies(error, dependencies) {
    const related = [];
    
    if (error.message.includes('firebase')) {
      related.push('firebase/app', 'firebase/firestore', 'firebase/auth');
    }

    if (error.message.includes('socket')) {
      related.push('socket.io');
    }

    if (error.message.includes('express')) {
      related.push('express');
    }

    return related;
  }

  // Generate contextual fixes
  generateContextualFixes(error, llmContext) {
    const fixes = [];
    const errorType = this.categorizeError(error.message);

    // Use LLM context to generate more accurate fixes
    if (errorType === 'firebase-permission') {
      fixes.push({
        type: 'firebase-permission',
        action: 'update-firestore-rules',
        description: 'Update Firestore rules based on project structure',
        confidence: 0.9,
        code: this.generateFirestoreRules(llmContext),
        context: 'Based on project authentication setup'
      });

      fixes.push({
        type: 'firebase-permission',
        action: 'check-environment-variables',
        description: 'Verify Firebase environment variables',
        confidence: 0.8,
        code: this.generateEnvCheck(llmContext),
        context: 'Based on project configuration'
      });
    }

    return fixes;
  }

  // Generate Firestore rules based on context
  generateFirestoreRules(context) {
    return `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow authenticated users to read system data
    match /system/{document=**} {
      allow read: if request.auth != null;
    }
    
    // Allow authenticated users to write error logs
    match /error_logs/{document=**} {
      allow write: if request.auth != null;
    }
  }
}`;
  }

  // Generate environment check
  generateEnvCheck(context) {
    return `// Check these environment variables:
// REACT_APP_FIREBASE_API_KEY
// REACT_APP_FIREBASE_AUTH_DOMAIN
// REACT_APP_FIREBASE_PROJECT_ID
// REACT_APP_FIREBASE_STORAGE_BUCKET
// REACT_APP_FIREBASE_MESSAGING_SENDER_ID
// REACT_APP_FIREBASE_APP_ID`;
  }

  // Calculate confidence based on analysis
  calculateConfidence(analysis) {
    let confidence = 0.5;
    
    if (analysis.affectedFiles.length > 0) confidence += 0.2;
    if (analysis.relatedDependencies.length > 0) confidence += 0.2;
    if (analysis.suggestedFixes.length > 0) confidence += 0.1;
    
    return Math.min(confidence, 1.0);
  }
}

module.exports = CursorDebuggerAgent;
