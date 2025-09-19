const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs').promises;
const path = require('path');

const execAsync = promisify(exec);

class CursorCLIService {
  constructor() {
    this.isAvailable = false;
    this.version = null;
    this.capabilities = [];
    this.workspacePath =
      process.env.WORKSPACE_PATH || '/Users/cryptojoker710/Desktop/AIOS';

    this.initialize();
  }

  async initialize() {
    try {
      // Check if Cursor CLI is available
      const { stdout } = await execAsync('cursor --version');
      this.isAvailable = true;
      this.version = stdout.trim();
      this.capabilities = [
        'code-analysis',
        'ai-suggestions',
        'auto-completion',
        'error-detection',
        'refactoring',
        'documentation-generation',
        'test-generation',
        'code-optimization',
      ];

      console.log('✅ Cursor CLI available:', this.version);
      console.log('📁 Workspace path:', this.workspacePath);
    } catch (error) {
      console.log('⚠️ Cursor CLI not available:', error.message);
      this.isAvailable = false;
    }
  }

  // Code Analysis
  async analyzeCode(code, language = 'javascript') {
    if (!this.isAvailable) {
      throw new Error('Cursor CLI not available');
    }

    try {
      // Create temporary file for analysis
      const tempFile = path.join(this.workspacePath, 'temp_analysis.js');
      await fs.writeFile(tempFile, code);

      // Use Cursor CLI to analyze the code
      const { stdout } = await execAsync(
        `cursor analyze "${tempFile}" --language ${language}`
      );

      // Clean up temporary file
      await fs.unlink(tempFile);

      return this.parseAnalysisOutput(stdout);
    } catch (error) {
      console.error('Error analyzing code:', error);
      throw error;
    }
  }

  // Get AI Suggestions
  async getSuggestions(context, prompt, options = {}) {
    if (!this.isAvailable) {
      throw new Error('Cursor CLI not available');
    }

    try {
      const { language = 'javascript', maxSuggestions = 5 } = options;

      // Use Cursor CLI to get AI suggestions
      const command = `cursor suggest --context "${context}" --prompt "${prompt}" --language ${language} --max-suggestions ${maxSuggestions}`;
      const { stdout } = await execAsync(command);

      return this.parseSuggestionsOutput(stdout);
    } catch (error) {
      console.error('Error getting suggestions:', error);
      throw error;
    }
  }

  // Auto-completion
  async getAutoCompletion(code, cursorPosition, language = 'javascript') {
    if (!this.isAvailable) {
      throw new Error('Cursor CLI not available');
    }

    try {
      // Create temporary file with cursor position marker
      const lines = code.split('\n');
      lines[cursorPosition.line] =
        lines[cursorPosition.line].slice(0, cursorPosition.character) +
        '|CURSOR|' +
        lines[cursorPosition.line].slice(cursorPosition.character);

      const tempFile = path.join(this.workspacePath, 'temp_completion.js');
      await fs.writeFile(tempFile, lines.join('\n'));

      // Use Cursor CLI for auto-completion
      const { stdout } = await execAsync(
        `cursor complete "${tempFile}" --language ${language}`
      );

      // Clean up temporary file
      await fs.unlink(tempFile);

      return this.parseCompletionOutput(stdout);
    } catch (error) {
      console.error('Error getting auto-completion:', error);
      throw error;
    }
  }

  // Error Detection
  async detectErrors(code, language = 'javascript') {
    if (!this.isAvailable) {
      throw new Error('Cursor CLI not available');
    }

    try {
      const tempFile = path.join(this.workspacePath, 'temp_errors.js');
      await fs.writeFile(tempFile, code);

      // Use Cursor CLI to detect errors
      const { stdout } = await execAsync(
        `cursor lint "${tempFile}" --language ${language}`
      );

      // Clean up temporary file
      await fs.unlink(tempFile);

      return this.parseErrorOutput(stdout);
    } catch (error) {
      console.error('Error detecting errors:', error);
      throw error;
    }
  }

  // Code Refactoring
  async refactorCode(code, refactorType, language = 'javascript') {
    if (!this.isAvailable) {
      throw new Error('Cursor CLI not available');
    }

    try {
      const tempFile = path.join(this.workspacePath, 'temp_refactor.js');
      await fs.writeFile(tempFile, code);

      // Use Cursor CLI for refactoring
      const { stdout } = await execAsync(
        `cursor refactor "${tempFile}" --type ${refactorType} --language ${language}`
      );

      // Clean up temporary file
      await fs.unlink(tempFile);

      return this.parseRefactorOutput(stdout);
    } catch (error) {
      console.error('Error refactoring code:', error);
      throw error;
    }
  }

  // Documentation Generation
  async generateDocumentation(code, language = 'javascript') {
    if (!this.isAvailable) {
      throw new Error('Cursor CLI not available');
    }

    try {
      const tempFile = path.join(this.workspacePath, 'temp_docs.js');
      await fs.writeFile(tempFile, code);

      // Use Cursor CLI to generate documentation
      const { stdout } = await execAsync(
        `cursor docs "${tempFile}" --language ${language}`
      );

      // Clean up temporary file
      await fs.unlink(tempFile);

      return this.parseDocumentationOutput(stdout);
    } catch (error) {
      console.error('Error generating documentation:', error);
      throw error;
    }
  }

  // Test Generation
  async generateTests(code, language = 'javascript') {
    if (!this.isAvailable) {
      throw new Error('Cursor CLI not available');
    }

    try {
      const tempFile = path.join(this.workspacePath, 'temp_tests.js');
      await fs.writeFile(tempFile, code);

      // Use Cursor CLI to generate tests
      const { stdout } = await execAsync(
        `cursor test "${tempFile}" --language ${language}`
      );

      // Clean up temporary file
      await fs.unlink(tempFile);

      return this.parseTestOutput(stdout);
    } catch (error) {
      console.error('Error generating tests:', error);
      throw error;
    }
  }

  // Code Optimization
  async optimizeCode(code, language = 'javascript') {
    if (!this.isAvailable) {
      throw new Error('Cursor CLI not available');
    }

    try {
      const tempFile = path.join(this.workspacePath, 'temp_optimize.js');
      await fs.writeFile(tempFile, code);

      // Use Cursor CLI for code optimization
      const { stdout } = await execAsync(
        `cursor optimize "${tempFile}" --language ${language}`
      );

      // Clean up temporary file
      await fs.unlink(tempFile);

      return this.parseOptimizationOutput(stdout);
    } catch (error) {
      console.error('Error optimizing code:', error);
      throw error;
    }
  }

  // Smart Apps Integration
  async analyzeSmartNotesApp() {
    if (!this.isAvailable) {
      throw new Error('Cursor CLI not available');
    }

    try {
      const notesAppPath = path.join(
        this.workspacePath,
        'client/src/pages/SmartNotesApp.js'
      );
      const code = await fs.readFile(notesAppPath, 'utf8');

      return await this.analyzeCode(code, 'javascript');
    } catch (error) {
      console.error('Error analyzing Smart Notes App:', error);
      throw error;
    }
  }

  async analyzeSmartAlarmApp() {
    if (!this.isAvailable) {
      throw new Error('Cursor CLI not available');
    }

    try {
      const alarmAppPath = path.join(
        this.workspacePath,
        'client/src/pages/SmartAlarmApp.js'
      );
      const code = await fs.readFile(alarmAppPath, 'utf8');

      return await this.analyzeCode(code, 'javascript');
    } catch (error) {
      console.error('Error analyzing Smart Alarm App:', error);
      throw error;
    }
  }

  async analyzeSmartMapsApp() {
    if (!this.isAvailable) {
      throw new Error('Cursor CLI not available');
    }

    try {
      const mapsAppPath = path.join(
        this.workspacePath,
        'client/src/pages/SmartMapsApp.js'
      );
      const code = await fs.readFile(mapsAppPath, 'utf8');

      return await this.analyzeCode(code, 'javascript');
    } catch (error) {
      console.error('Error analyzing Smart Maps App:', error);
      throw error;
    }
  }

  // Parse output methods
  parseAnalysisOutput(output) {
    const analysis = {
      complexity: 'medium',
      issues: [],
      suggestions: [],
      metrics: {},
    };

    const lines = output.split('\n');
    for (const line of lines) {
      if (line.includes('complexity:')) {
        analysis.complexity = line.split('complexity:')[1].trim();
      } else if (line.includes('issue:')) {
        analysis.issues.push(line.split('issue:')[1].trim());
      } else if (line.includes('suggestion:')) {
        analysis.suggestions.push(line.split('suggestion:')[1].trim());
      }
    }

    return analysis;
  }

  parseSuggestionsOutput(output) {
    const suggestions = [];
    const lines = output.split('\n');

    for (const line of lines) {
      if (line.includes('suggestion:') || line.includes('recommendation:')) {
        suggestions.push({
          type: 'cursor',
          content: line.replace(/.*suggestion:|.*recommendation:/, '').trim(),
          confidence: 85,
        });
      }
    }

    return suggestions;
  }

  parseCompletionOutput(output) {
    const completions = [];
    const lines = output.split('\n');

    for (const line of lines) {
      if (line.trim()) {
        completions.push({
          text: line.trim(),
          type: 'completion',
        });
      }
    }

    return completions;
  }

  parseErrorOutput(output) {
    const errors = [];
    const lines = output.split('\n');

    for (const line of lines) {
      if (line.includes('error:') || line.includes('warning:')) {
        const parts = line.split(':');
        if (parts.length >= 3) {
          errors.push({
            type: line.includes('error:') ? 'error' : 'warning',
            line: parseInt(parts[1]) || 0,
            message: parts.slice(2).join(':').trim(),
          });
        }
      }
    }

    return errors;
  }

  parseRefactorOutput(output) {
    return {
      original: '',
      refactored: output.trim(),
      changes: [],
    };
  }

  parseDocumentationOutput(output) {
    return {
      documentation: output.trim(),
      functions: [],
      classes: [],
    };
  }

  parseTestOutput(output) {
    return {
      tests: output.trim(),
      coverage: 'unknown',
    };
  }

  parseOptimizationOutput(output) {
    return {
      optimized: output.trim(),
      improvements: [],
      performance: 'unknown',
    };
  }

  // Get service status
  getStatus() {
    return {
      available: this.isAvailable,
      version: this.version,
      capabilities: this.capabilities,
      workspacePath: this.workspacePath,
    };
  }
}

module.exports = CursorCLIService;
