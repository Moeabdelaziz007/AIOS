/**
 * AIOS Smart Agent Bot - Powerful AI Assistant with Enhanced API Integration
 * Advanced AI agent with access to user data, search, and smart tools
 * Now powered by enhanced Gemini API service with error handling, rate limiting, and caching
 */

import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './FirebaseService.js';
import geminiAPIService from './GeminiAPIService';
import lazyLoadingSystem from './LazyLoadingSystem';
import performanceMonitoringSystem from './PerformanceMonitoringSystem';
import responseCachingSystem from './ResponseCachingSystem';

class AIOSSmartAgent {
  constructor() {
    this.userData = null;
    this.tools = new Map();
    this.plugins = new Map();
    this.isInitialized = false;
    this.conversationHistory = [];
    this.activeTools = new Set();
    this.apiService = geminiAPIService;
    this.lazyLoader = lazyLoadingSystem;
    this.performanceMonitor = performanceMonitoringSystem;
    this.cache = responseCachingSystem;

    // Performance optimization flags
    this.toolsLoaded = false;
    this.pluginsLoaded = false;
  }

  /**
   * Initialize the AI agent with enhanced Gemini API service
   */
  async initialize() {
    try {
      console.log(
        '🤖 Initializing AIOS Smart Agent with Enhanced API Service...'
      );

      // Initialize the enhanced Gemini API service
      await this.apiService.initialize();

      // Initialize tools and plugins
      await this.initializeTools();
      await this.initializePlugins();

      this.isInitialized = true;
      console.log(
        '✅ AIOS Smart Agent initialized successfully with enhanced API service'
      );

      // Log API service status
      const apiStatus = await this.apiService.healthCheck();
      console.log('📊 API Service Status:', apiStatus.status);
    } catch (error) {
      console.error('❌ Failed to initialize AIOS Smart Agent:', error);
      throw error;
    }
  }

  /**
   * Initialize powerful tools for the agent
   */
  async initializeTools() {
    // Data Access Tools
    this.tools.set('user_data_access', {
      name: 'User Data Access',
      description: 'Access comprehensive user data and analytics',
      execute: this.accessUserData.bind(this),
    });

    this.tools.set('firestore_search', {
      name: 'Firestore Search',
      description: 'Search and query Firestore database',
      execute: this.searchFirestore.bind(this),
    });

    this.tools.set('system_monitoring', {
      name: 'System Monitoring',
      description: 'Monitor system performance and health',
      execute: this.monitorSystem.bind(this),
    });

    this.tools.set('web_search', {
      name: 'Web Search',
      description: 'Search the web for real-time information',
      execute: this.webSearch.bind(this),
    });

    this.tools.set('code_analysis', {
      name: 'Code Analysis',
      description: 'Analyze and understand code patterns',
      execute: this.analyzeCode.bind(this),
    });

    this.tools.set('data_visualization', {
      name: 'Data Visualization',
      description: 'Create charts and visualizations from data',
      execute: this.createVisualization.bind(this),
    });

    this.tools.set('file_operations', {
      name: 'File Operations',
      description: 'Read, write, and manipulate files',
      execute: this.fileOperations.bind(this),
    });

    this.tools.set('api_integration', {
      name: 'API Integration',
      description: 'Integrate with external APIs and services',
      execute: this.apiIntegration.bind(this),
    });

    console.log(`🔧 Initialized ${this.tools.size} powerful tools`);
  }

  /**
   * Initialize smart plugins
   */
  async initializePlugins() {
    // Learning Plugin
    this.plugins.set('learning_plugin', {
      name: 'Learning Plugin',
      description: 'Learn from user interactions and improve responses',
      execute: this.learningPlugin.bind(this),
    });

    // Analytics Plugin
    this.plugins.set('analytics_plugin', {
      name: 'Analytics Plugin',
      description: 'Analyze user behavior and provide insights',
      execute: this.analyticsPlugin.bind(this),
    });

    // Automation Plugin
    this.plugins.set('automation_plugin', {
      name: 'Automation Plugin',
      description: 'Automate tasks and workflows',
      execute: this.automationPlugin.bind(this),
    });

    // Security Plugin
    this.plugins.set('security_plugin', {
      name: 'Security Plugin',
      description: 'Monitor security and detect threats',
      execute: this.securityPlugin.bind(this),
    });

    console.log(`🔌 Initialized ${this.plugins.size} smart plugins`);
  }

  /**
   * Set user data for personalized assistance
   */
  async setUserData(userId) {
    try {
      // Fetch user data from Firestore
      const userQuery = query(
        collection(db, 'users'),
        where('uid', '==', userId)
      );
      const userSnapshot = await getDocs(userQuery);

      if (!userSnapshot.empty) {
        this.userData = userSnapshot.docs[0].data();
        console.log('👤 User data loaded for personalized assistance');
      }
    } catch (error) {
      console.error('❌ Failed to load user data:', error);
    }
  }

  /**
   * Process user query with AI agent capabilities
   */
  async processQuery(query, userId = null) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      if (userId) {
        await this.setUserData(userId);
      }

      // Analyze query to determine required tools
      const requiredTools = await this.analyzeQueryRequirements(query);

      // Execute tools and gather data
      const toolResults = await this.executeTools(requiredTools, query);

      // Generate response with context
      const response = await this.generateResponse(query, toolResults);

      // Store conversation
      this.conversationHistory.push({
        query,
        response,
        tools: requiredTools,
        timestamp: new Date().toISOString(),
      });

      return response;
    } catch (error) {
      console.error('❌ Failed to process query:', error);
      return {
        error: 'Sorry, I encountered an error processing your request.',
        details: error.message,
      };
    }
  }

  /**
   * Analyze query to determine required tools
   */
  async analyzeQueryRequirements(query) {
    const requiredTools = [];

    // Check for data-related queries
    if (
      query.toLowerCase().includes('my data') ||
      query.toLowerCase().includes('user data')
    ) {
      requiredTools.push('user_data_access');
    }

    // Check for search queries
    if (
      query.toLowerCase().includes('search') ||
      query.toLowerCase().includes('find')
    ) {
      requiredTools.push('firestore_search');
      requiredTools.push('web_search');
    }

    // Check for system queries
    if (
      query.toLowerCase().includes('system') ||
      query.toLowerCase().includes('performance')
    ) {
      requiredTools.push('system_monitoring');
    }

    // Check for code queries
    if (
      query.toLowerCase().includes('code') ||
      query.toLowerCase().includes('programming')
    ) {
      requiredTools.push('code_analysis');
    }

    // Check for visualization queries
    if (
      query.toLowerCase().includes('chart') ||
      query.toLowerCase().includes('graph')
    ) {
      requiredTools.push('data_visualization');
    }

    return requiredTools;
  }

  /**
   * Execute required tools
   */
  async executeTools(toolNames, query) {
    const results = {};

    for (const toolName of toolNames) {
      if (this.tools.has(toolName)) {
        try {
          const tool = this.tools.get(toolName);
          results[toolName] = await tool.execute(query, this.userData);
        } catch (error) {
          console.error(`❌ Tool ${toolName} failed:`, error);
          results[toolName] = { error: error.message };
        }
      }
    }

    return results;
  }

  /**
   * Generate AI response with context using enhanced API service
   */
  async generateResponse(query, toolResults) {
    try {
      const context = this.buildContext(toolResults);
      const userContext = this.buildUserContext();

      const prompt = `
You are AIOS Smart Agent, a powerful AI assistant with access to user data, system monitoring, and various tools.

User Context: ${userContext}
Tool Results: ${JSON.stringify(toolResults, null, 2)}
Context: ${context}

User Query: ${query}

Provide a comprehensive, helpful response using the available data and tool results. Be personal, intelligent, and actionable.
`;

      // Use enhanced API service with error handling, rate limiting, and caching
      const response = await this.apiService.generateContent(prompt);

      // Handle API service response format
      if (response.success === false) {
        console.error('❌ API service error:', response.error);
        return {
          text: 'I apologize, but I encountered an error generating a response.',
          error: response.message,
          requestId: response.requestId,
        };
      }

      return {
        text: response.text,
        tools: Object.keys(toolResults),
        timestamp: response.timestamp,
        context: context,
        requestId: response.requestId,
        usage: response.usage,
      };
    } catch (error) {
      console.error('❌ Failed to generate response:', error);
      return {
        text: 'I apologize, but I encountered an error generating a response.',
        error: error.message,
      };
    }
  }

  /**
   * Build context from tool results
   */
  buildContext(toolResults) {
    let context = '';

    if (toolResults.user_data_access) {
      context += `User Data: ${JSON.stringify(toolResults.user_data_access)}\n`;
    }

    if (toolResults.system_monitoring) {
      context += `System Status: ${JSON.stringify(
        toolResults.system_monitoring
      )}\n`;
    }

    if (toolResults.firestore_search) {
      context += `Database Results: ${JSON.stringify(
        toolResults.firestore_search
      )}\n`;
    }

    return context;
  }

  /**
   * Build user context
   */
  buildUserContext() {
    if (!this.userData) return 'No user data available';

    return `
User Profile:
- Name: ${this.userData.fullName || this.userData.displayName || 'Unknown'}
- Email: ${this.userData.email || 'Not provided'}
- Company: ${this.userData.company || 'Not provided'}
- Location: ${this.userData.location || 'Not provided'}
- Interests: ${this.userData.interests?.join(', ') || 'Not specified'}
- Login Method: ${this.userData.behaviorData?.loginMethod || 'Unknown'}
- Device: ${this.userData.deviceInfo?.vendor || 'Unknown'} ${
      this.userData.platform || 'Unknown'
    }
- Browser: ${this.userData.browserInfo?.name || 'Unknown'} ${
      this.userData.browserInfo?.version || 'Unknown'
    }
`;
  }

  // Tool Implementations
  async accessUserData(query, userData) {
    return {
      userProfile: userData,
      analytics: await this.getUserAnalytics(userData?.uid),
      behavior: await this.getUserBehavior(userData?.uid),
    };
  }

  async searchFirestore(query, userData) {
    try {
      // Search across multiple collections
      const collections = [
        'users',
        'userAnalytics',
        'userSessions',
        'userBehavior',
      ];
      const results = {};

      for (const collectionName of collections) {
        const q = query(collection(db, collectionName));
        const snapshot = await getDocs(q);
        results[collectionName] = snapshot.docs.map(doc => doc.data());
      }

      return results;
    } catch (error) {
      return { error: error.message };
    }
  }

  async monitorSystem(query, userData) {
    return {
      memory: process.memoryUsage(),
      uptime: process.uptime(),
      platform: process.platform,
      nodeVersion: process.version,
      timestamp: new Date().toISOString(),
    };
  }

  async webSearch(query, userData) {
    // Implement web search functionality
    return {
      searchQuery: query,
      results: 'Web search results would be implemented here',
      timestamp: new Date().toISOString(),
    };
  }

  async analyzeCode(query, userData) {
    // Implement code analysis
    return {
      analysis: 'Code analysis would be implemented here',
      patterns: [],
      suggestions: [],
    };
  }

  async createVisualization(query, userData) {
    // Implement data visualization
    return {
      chartType: 'determined from query',
      data: 'processed data for visualization',
      visualization: 'chart configuration',
    };
  }

  async fileOperations(query, userData) {
    // Implement file operations
    return {
      operation: 'file operation based on query',
      result: 'file operation result',
    };
  }

  async apiIntegration(query, userData) {
    // Implement API integration
    return {
      api: 'determined from query',
      result: 'API integration result',
    };
  }

  // Plugin Implementations
  async learningPlugin(query, userData) {
    // Learn from interactions
    return {
      learned: true,
      patterns: 'extracted patterns',
      improvements: 'suggested improvements',
    };
  }

  async analyticsPlugin(query, userData) {
    // Analyze user behavior
    return {
      insights: 'behavioral insights',
      trends: 'usage trends',
      recommendations: 'personalized recommendations',
    };
  }

  async automationPlugin(query, userData) {
    // Automate tasks
    return {
      automated: true,
      tasks: 'automated tasks',
      workflows: 'created workflows',
    };
  }

  async securityPlugin(query, userData) {
    // Monitor security
    return {
      threats: 'detected threats',
      security: 'security status',
      recommendations: 'security recommendations',
    };
  }

  // Helper methods
  async getUserAnalytics(userId) {
    if (!userId) return null;

    try {
      const analyticsQuery = query(
        collection(db, 'userAnalytics'),
        where('userId', '==', userId)
      );
      const snapshot = await getDocs(analyticsQuery);
      return snapshot.docs.map(doc => doc.data());
    } catch (error) {
      console.error('Failed to get user analytics:', error);
      return null;
    }
  }

  async getUserBehavior(userId) {
    if (!userId) return null;

    try {
      const behaviorQuery = query(
        collection(db, 'userBehavior'),
        where('userId', '==', userId)
      );
      const snapshot = await getDocs(behaviorQuery);
      return snapshot.docs.map(doc => doc.data());
    } catch (error) {
      console.error('Failed to get user behavior:', error);
      return null;
    }
  }

  /**
   * Get available tools and plugins
   */
  getAvailableTools() {
    return Array.from(this.tools.keys());
  }

  getAvailablePlugins() {
    return Array.from(this.plugins.keys());
  }

  /**
   * Get conversation history
   */
  getConversationHistory() {
    return this.conversationHistory;
  }

  /**
   * Clear conversation history
   */
  clearHistory() {
    this.conversationHistory = [];
  }

  /**
   * Get API service analytics
   */
  getAPIAnalytics() {
    return this.apiService.getAnalytics();
  }

  /**
   * Get rate limit status
   */
  getRateLimitStatus() {
    return this.apiService.getRateLimitStatus();
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return this.apiService.getCacheStats();
  }

  /**
   * Clear API cache
   */
  clearAPICache() {
    this.apiService.clearCache();
  }

  /**
   * Reset API analytics
   */
  resetAPIAnalytics() {
    this.apiService.resetAnalytics();
  }

  /**
   * Health check for API service
   */
  async healthCheck() {
    return await this.apiService.healthCheck();
  }
}

export default AIOSSmartAgent;
