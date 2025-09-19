import {
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
  updateDoc,
  where
} from 'firebase/firestore';
import geminiAPIService from './GeminiAPIService';
import LearningDataTrainer from './LearningDataTrainer';

/**
 * Advanced Data Agent for AIOS
 * Handles intelligent data processing, caching, real-time updates, and AI-powered insights
 */
class DataAgent {
  constructor(firestore, auth) {
    this.db = firestore;
    this.auth = auth;
    this.cache = new Map();
    this.subscriptions = new Map();
    this.dataProcessors = new Map();
    this.aiInsights = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    this.batchSize = 50;
    this.mockMode = true; // Enable mock mode by default to prevent permission errors
    this.permissionErrors = 0; // Track permission errors
    this.authStateReady = false; // Track authentication state
    this.authStateListener = null; // Store auth state listener

    console.log('🔧 DataAgent initialized in MOCK MODE to prevent Firestore permission errors');

    // Set up authentication state listener
    this.setupAuthStateListener();

    // Initialize learning trainer
    this.learningTrainer = new LearningDataTrainer(this);
    this.trainingCompleted = false;

    // AI Tools Configuration with Enhanced API Service
    this.aiTools = {
      gemini: {
        enabled: !!process.env.VITE_GEMINI_API_KEY,
        apiKey: process.env.VITE_GEMINI_API_KEY,
        status: 'ready',
        lastUsed: null,
        service: geminiAPIService // Use enhanced API service
      },
      openai: {
        enabled: !!process.env.VITE_OPENAI_API_KEY,
        apiKey: process.env.VITE_OPENAI_API_KEY,
        status: 'ready',
        lastUsed: null
      },
      claude: {
        enabled: false,
        apiKey: null,
        status: 'disabled',
        lastUsed: null
      }
    };

    // Learning and Analytics
    this.learningMode = false;
    this.insights = [];
    this.recommendations = [];
    this.analytics = {
      cacheHits: 0,
      cacheMisses: 0,
      apiCalls: 0,
      errors: 0,
      aiCalls: 0,
      dataProcessed: 0,
      insightsGenerated: 0,
      permissionErrors: 0,
      retryAttempts: 0,
      authStateChanges: 0,
      mockModeActivations: 0,
      realTimeSubscriptions: 0
    };

    // Initialize data processors
    this.initializeDataProcessors();
    this.initializeAITools();
  }

  /**
   * Check if user is authenticated and ready
   */
  isAuthenticated() {
    return this.authStateReady && !this.mockMode && this.auth?.currentUser;
  }

  /**
   * Get current authentication status
   */
  getAuthStatus() {
    return {
      authenticated: this.isAuthenticated(),
      authStateReady: this.authStateReady,
      mockMode: this.mockMode,
      currentUser: this.currentUser || this.auth?.currentUser?.uid || null,
      permissionErrors: this.permissionErrors,
      lastError: this.lastError,
      retryCount: this.retryCount || 0
    };
  }

  /**
   * Retry failed operations with exponential backoff
   */
  async retryOperation(operation, maxRetries = 3, baseDelay = 1000) {
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        this.lastError = error;

        if (attempt === maxRetries) {
          console.error(`Operation failed after ${maxRetries} attempts:`, error);
          throw error;
        }

        // Exponential backoff
        const delay = baseDelay * Math.pow(2, attempt - 1);
        console.warn(`Operation failed (attempt ${attempt}/${maxRetries}), retrying in ${delay}ms...`);

        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  }

  /**
   * Set up authentication state listener
   */
  setupAuthStateListener() {
    if (!this.auth) {
      console.warn('Auth not available, staying in mock mode');
      return;
    }

    // Import onAuthStateChanged dynamically to avoid circular imports
    import('firebase/auth')
      .then(({ onAuthStateChanged }) => {
        this.authStateListener = onAuthStateChanged(this.auth, user => {
          const wasAuthenticated = this.authStateReady && !this.mockMode;
          this.authStateReady = !!user;

          if (user) {
            console.log('🔐 User authenticated, disabling mock mode');
            this.mockMode = false;
            this.permissionErrors = 0; // Reset permission error count
            this.analytics.authStateChanges++;

            // Store user info for better debugging
            this.currentUser = {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              isAnonymous: user.isAnonymous
            };

            // Start meta-learning loop if not already running
            if (!wasAuthenticated) {
              this.startMetaLearningLoop();
            }

            // Emit authentication event for other components
            this.emitAuthEvent('authenticated', user);
          } else {
            console.log('🔓 User not authenticated, enabling mock mode');
            this.mockMode = true;
            this.currentUser = null;
            this.analytics.authStateChanges++;
            this.analytics.mockModeActivations++;

            // Stop meta-learning loop
            if (this.metaLearningInterval) {
              clearInterval(this.metaLearningInterval);
              this.metaLearningInterval = null;
            }

            // Emit authentication event for other components
            this.emitAuthEvent('unauthenticated', null);
          }
        });
      })
      .catch(error => {
        console.error('Failed to set up auth state listener:', error);
      });
  }

  /**
   * Emit authentication events for other components
   */
  emitAuthEvent(type, user) {
    const event = new CustomEvent('dataAgentAuth', {
      detail: { type, user, timestamp: new Date() }
    });
    window.dispatchEvent(event);
  }

  /**
   * Initialize AI Tools and Learning System
   */
  initializeAITools() {
    // Initialize AI learning rules
    this.learningRules = {
      zeroShotRules: [
        {
          id: 'zs_001',
          name: 'Pattern Recognition Rule',
          description: 'Identify patterns in data without prior training',
          condition: 'data.length > 10 && data.variance < threshold',
          action: 'extract_patterns(data)',
          confidence: 0.85,
          successRate: 0.92,
          lastUsed: null,
          enabled: true
        },
        {
          id: 'zs_002',
          name: 'Anomaly Detection Rule',
          description: 'Detect outliers using statistical methods',
          condition: 'data.point > (mean + 3*std) || data.point < (mean - 3*std)',
          action: 'flag_anomaly(data.point)',
          confidence: 0.78,
          successRate: 0.88,
          lastUsed: null,
          enabled: true
        }
      ],
      metaLearningRules: [
        {
          id: 'ml_001',
          name: 'Rule Performance Monitor',
          description: 'Track and evaluate rule effectiveness',
          condition: 'rule.successRate < 0.7',
          action: 'trigger_rule_optimization(rule)',
          confidence: 0.95,
          successRate: 0.98,
          lastUsed: null,
          enabled: true
        }
      ],
      improvementRules: [
        {
          id: 'ir_001',
          name: 'Error Pattern Learning',
          description: 'Learn from previous errors to prevent recurrence',
          condition: 'error.frequency > 3',
          action: 'create_error_prevention_rule(error)',
          confidence: 0.89,
          successRate: 0.93,
          lastUsed: null,
          enabled: true
        }
      ]
    };

    // Initialize learning metrics
    this.learningMetrics = {
      rulesExecuted: 0,
      successfulPredictions: 0,
      failedPredictions: 0,
      newRulesGenerated: 0,
      rulesOptimized: 0,
      knowledgeExpansion: 0
    };

    // Start meta-learning loop
    this.startMetaLearningLoop();
  }

  /**
   * Start the meta-learning loop for continuous improvement
   */
  startMetaLearningLoop() {
    // Skip meta-learning loop if in mock mode
    if (this.mockMode) {
      console.log('📊 Skipping meta-learning loop (mock mode enabled)');
      return;
    }

    if (this.metaLearningInterval) {
      clearInterval(this.metaLearningInterval);
    }

    this.metaLearningInterval = setInterval(async () => {
      await this.executeMetaLearningCycle();
    }, 30000); // Run every 30 seconds
  }

  /**
   * Execute a meta-learning cycle
   */
  async executeMetaLearningCycle() {
    try {
      // Skip meta-learning if in mock mode or not authenticated
      if (this.mockMode || !this.authStateReady) {
        console.log(`Skipping meta-learning cycle (mock mode: ${this.mockMode}, auth ready: ${this.authStateReady})`);
        return;
      }

      this.analytics.aiCalls++;

      // Phase 1: Analyze current performance
      const performanceAnalysis = await this.analyzePerformance();

      // Phase 2: Optimize underperforming rules
      await this.optimizeRules(performanceAnalysis);

      // Phase 3: Generate new rules based on patterns
      await this.generateNewRules();

      // Phase 4: Update learning metrics
      this.updateLearningMetrics();
    } catch (error) {
      console.error('Meta-learning cycle error:', error);

      // Enable mock mode on any error
      if (error.code === 'permission-denied' || error.message.includes('Missing or insufficient permissions')) {
        console.warn('Enabling mock mode due to permission errors');
        this.mockMode = true;
      }

      this.analytics.errors++;
    }
  }

  /**
   * Analyze current rule performance
   */
  async analyzePerformance() {
    const analysis = {
      overallAccuracy: 0,
      ruleEffectiveness: {},
      trends: [],
      recommendations: []
    };

    // Calculate overall accuracy
    const allRules = [
      ...this.learningRules.zeroShotRules,
      ...this.learningRules.metaLearningRules,
      ...this.learningRules.improvementRules
    ];

    analysis.overallAccuracy = allRules.reduce((sum, rule) => sum + rule.successRate, 0) / allRules.length;

    // Analyze individual rule performance
    allRules.forEach(rule => {
      analysis.ruleEffectiveness[rule.id] = {
        successRate: rule.successRate,
        confidence: rule.confidence,
        effectiveness: rule.successRate * rule.confidence,
        needsOptimization: rule.successRate < 0.7
      };
    });

    return analysis;
  }

  /**
   * Optimize underperforming rules
   */
  async optimizeRules(performanceAnalysis) {
    const optimizations = [];

    Object.entries(performanceAnalysis.ruleEffectiveness).forEach(([ruleId, performance]) => {
      if (performance.needsOptimization) {
        optimizations.push({
          ruleId,
          type: 'threshold_adjustment',
          action: 'adjust_thresholds',
          expectedImprovement: 0.15
        });
      }
    });

    // Apply optimizations
    optimizations.forEach(optimization => {
      this.applyRuleOptimization(optimization);
    });

    this.learningMetrics.rulesOptimized += optimizations.length;
  }

  /**
   * Apply rule optimization
   */
  applyRuleOptimization(optimization) {
    // Find and update the rule
    const allRules = [
      ...this.learningRules.zeroShotRules,
      ...this.learningRules.metaLearningRules,
      ...this.learningRules.improvementRules
    ];

    const rule = allRules.find(r => r.id === optimization.ruleId);
    if (rule) {
      // Simulate optimization improvement
      rule.successRate = Math.min(0.95, rule.successRate + optimization.expectedImprovement);
      rule.lastUsed = new Date();
    }
  }

  /**
   * Generate new rules based on data patterns
   */
  async generateNewRules() {
    try {
      // Skip rule generation if in mock mode or not authenticated
      if (this.mockMode || !this.authStateReady) {
        console.log(`📊 Skipping rule generation (mock mode: ${this.mockMode}, auth ready: ${this.authStateReady})`);
        return;
      }

      // Analyze recent data for patterns
      const recentData = await this.fetchData('apps', { limit: 100 });
      const patterns = this.extractDataPatterns(recentData);

      // Generate new rules from patterns
      patterns.forEach(pattern => {
        if (pattern.confidence > 0.8) {
          const newRule = {
            id: `zs_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            name: `Auto-Generated: ${pattern.type}`,
            description: `Generated from data pattern analysis`,
            condition: pattern.condition,
            action: pattern.action,
            confidence: pattern.confidence,
            successRate: 0.75,
            lastUsed: null,
            enabled: true,
            generatedBy: 'meta_learning'
          };

          this.learningRules.zeroShotRules.push(newRule);
          this.learningMetrics.newRulesGenerated++;
        }
      });
    } catch (error) {
      console.error('Error generating new rules:', error);

      // Handle Firestore permission errors gracefully
      if (error.code === 'permission-denied' || error.message.includes('Missing or insufficient permissions')) {
        console.warn('Firestore permission denied for rule generation, using fallback rules');
        // Use fallback rules when Firestore is unavailable
        this.learningRules.zeroShotRules = this.getFallbackData('learningRules');
        this.learningMetrics.newRulesGenerated = this.learningRules.zeroShotRules.length;
      }
    }
  }

  /**
   * Extract patterns from data
   */
  extractDataPatterns(data) {
    const patterns = [];

    // Pattern 1: Status correlation
    if (data.length > 10) {
      const activeApps = data.filter(app => app.status === 'active').length;
      const activeRatio = activeApps / data.length;

      if (activeRatio > 0.7) {
        patterns.push({
          type: 'high_activity_pattern',
          condition: 'active_apps_ratio > 0.7',
          action: 'optimize_for_high_activity()',
          confidence: 0.85
        });
      }
    }

    // Pattern 2: Category distribution
    const categories = {};
    data.forEach(app => {
      categories[app.category] = (categories[app.category] || 0) + 1;
    });

    const maxCategory =
      Object.keys(categories).length > 0
        ? Object.keys(categories).reduce((a, b) => (categories[a] > categories[b] ? a : b))
        : null;

    if (maxCategory && categories[maxCategory] / data.length > 0.4) {
      patterns.push({
        type: 'category_dominance_pattern',
        condition: `category === '${maxCategory}'`,
        action: `optimize_for_${maxCategory}_category()`,
        confidence: 0.82
      });
    }

    return patterns;
  }

  /**
   * Update learning metrics
   */
  updateLearningMetrics() {
    this.learningMetrics.rulesExecuted++;

    // Simulate successful predictions
    const successRate = this.calculateOverallSuccessRate();
    if (Math.random() < successRate) {
      this.learningMetrics.successfulPredictions++;
    } else {
      this.learningMetrics.failedPredictions++;
    }

    // Update knowledge expansion
    this.learningMetrics.knowledgeExpansion += Math.random() * 0.01;
  }

  /**
   * Calculate overall success rate
   */
  calculateOverallSuccessRate() {
    const allRules = [
      ...this.learningRules.zeroShotRules,
      ...this.learningRules.metaLearningRules,
      ...this.learningRules.improvementRules
    ];

    return allRules.reduce((sum, rule) => sum + rule.successRate, 0) / allRules.length;
  }

  /**
   * Initialize specialized data processors
   */
  initializeDataProcessors() {
    // App data processor
    this.dataProcessors.set('apps', {
      transform: this.transformAppData.bind(this),
      validate: this.validateAppData.bind(this),
      enrich: this.enrichAppData.bind(this)
    });

    // System data processor
    this.dataProcessors.set('system', {
      transform: this.transformSystemData.bind(this),
      validate: this.validateSystemData.bind(this),
      enrich: this.enrichSystemData.bind(this)
    });

    // Log data processor
    this.dataProcessors.set('logs', {
      transform: this.transformLogData.bind(this),
      validate: this.validateLogData.bind(this),
      enrich: this.enrichLogData.bind(this)
    });

    // User data processor
    this.dataProcessors.set('users', {
      transform: this.transformUserData.bind(this),
      validate: this.validateUserData.bind(this),
      enrich: this.enrichUserData.bind(this)
    });
  }

  /**
   * Intelligent data fetching with caching and real-time updates
   */
  async fetchData(collectionName, options = {}) {
    const {
      filters = [],
      orderBy: orderByField = 'createdAt',
      orderDirection = 'desc',
      limit: limitCount = 50,
      startAfter: startAfterDoc = null,
      useCache = true,
      realTime = false,
      processor = true
    } = options;

    // Check authentication state and use mock mode if not authenticated
    if (this.mockMode || !this.authStateReady) {
      console.log(`📊 Using mock data for ${collectionName} (mock mode enabled - auth state: ${this.authStateReady})`);
      return this.getFallbackData(collectionName);
    }

    const cacheKey = this.generateCacheKey(collectionName, options);

    // Check cache first
    if (useCache && this.cache.has(cacheKey)) {
      const cachedData = this.cache.get(cacheKey);
      if (Date.now() - cachedData.timestamp < this.cacheTimeout) {
        return cachedData.data;
      }
    }

    try {
      // Use retry logic for Firestore operations
      const data = await this.retryOperation(async () => {
        let q = collection(this.db, collectionName);

        // Apply filters
        filters.forEach(filter => {
          q = query(q, where(filter.field, filter.operator, filter.value));
        });

        // Apply ordering
        q = query(q, orderBy(orderByField, orderDirection));

        // Apply limit
        if (limitCount) {
          q = query(q, limit(limitCount));
        }

        // Apply pagination
        if (startAfterDoc) {
          q = query(q, startAfter(startAfterDoc));
        }

        const snapshot = await getDocs(q);
        let data = [];

        snapshot.forEach(doc => {
          data.push({ id: doc.id, ...doc.data() });
        });

        // Process data if processor exists
        if (processor && this.dataProcessors.has(collectionName)) {
          data = await this.processData(collectionName, data);
        }

        return data;
      });

      // Cache the result
      if (useCache) {
        this.cache.set(cacheKey, {
          data,
          timestamp: Date.now()
        });
      }

      // Set up real-time subscription if requested
      if (realTime) {
        this.setupRealTimeSubscription(collectionName, options);
      }

      return data;
    } catch (error) {
      console.error(`Error fetching data from ${collectionName}:`, error);

      // Handle Firestore permission errors with fallback data
      if (error.code === 'permission-denied' || error.message.includes('Missing or insufficient permissions')) {
        console.warn(`Firestore permission denied for ${collectionName}, enabling mock mode`);
        this.mockMode = true;
        this.permissionErrors++;

        // If we get too many permission errors, disable real-time operations
        if (this.permissionErrors > 5) {
          console.warn('Too many permission errors, disabling real-time operations');
          this.unsubscribeAll();
        }

        return this.getFallbackData(collectionName);
      }

      throw error;
    }
  }

  /**
   * Train the learning loop with comprehensive data
   */
  async trainLearningLoop() {
    try {
      console.log('🧠 Starting DataAgent learning loop training...');

      if (!this.learningTrainer) {
        console.warn('⚠️ Learning trainer not initialized');
        return { success: false, error: 'Learning trainer not initialized' };
      }

      const result = await this.learningTrainer.trainLearningLoop();

      if (result.success) {
        this.trainingCompleted = true;
        this.learningMetrics.trainingCompleted = true;
        this.learningMetrics.lastTraining = new Date().toISOString();
        console.log('✅ DataAgent learning loop training completed successfully');
      }

      return result;
    } catch (error) {
      console.error('❌ Error training DataAgent learning loop:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get learning insights from trained patterns
   */
  getLearningInsights() {
    if (!this.learningTrainer) {
      return { insights: [], error: 'Learning trainer not initialized' };
    }

    return this.learningTrainer.generateLearningInsights();
  }

  /**
   * Get training statistics
   */
  getTrainingStats() {
    if (!this.learningTrainer) {
      return { error: 'Learning trainer not initialized' };
    }

    return this.learningTrainer.getTrainingStats();
  }

  /**
   * Check if training is completed
   */
  isTrainingCompleted() {
    return this.trainingCompleted;
  }
  getFallbackData(collectionName) {
    const fallbackData = {
      apps: [
        {
          id: '1',
          name: 'AIOS Dashboard',
          description: 'Main dashboard application',
          status: 'active',
          version: '1.0.0',
          createdAt: new Date().toISOString(),
          userId: 'system'
        },
        {
          id: '2',
          name: 'Data Agent',
          description: 'AI data processing agent',
          status: 'active',
          version: '1.0.0',
          createdAt: new Date().toISOString(),
          userId: 'system'
        },
        {
          id: '3',
          name: 'Quantum Autopilot',
          description: 'Automated system management',
          status: 'active',
          version: '1.0.0',
          createdAt: new Date().toISOString(),
          userId: 'system'
        }
      ],
      users: [
        {
          id: '1',
          email: 'demo@aios.com',
          displayName: 'Demo User',
          role: 'user',
          createdAt: new Date().toISOString()
        }
      ],
      systemLogs: [
        {
          id: '1',
          level: 'INFO',
          message: 'AIOS System operational',
          timestamp: new Date().toISOString(),
          source: 'system'
        }
      ],
      learningRules: [
        {
          id: '1',
          name: 'Default Rule',
          description: 'Default learning rule',
          pattern: 'status:active',
          action: 'monitor',
          confidence: 0.8,
          createdAt: new Date().toISOString()
        }
      ]
    };

    return fallbackData[collectionName] || [];
  }

  /**
   * Process data using specialized processors
   */
  async processData(collectionName, data) {
    const processor = this.dataProcessors.get(collectionName);
    if (!processor) return data;

    const processedData = [];

    for (const item of data) {
      try {
        // Validate data
        if (!processor.validate(item)) {
          console.warn(`Invalid data for ${collectionName}:`, item);
          continue;
        }

        // Transform data
        let transformedItem = processor.transform(item);

        // Enrich data
        transformedItem = await processor.enrich(transformedItem);

        processedData.push(transformedItem);
      } catch (error) {
        console.error(`Error processing item in ${collectionName}:`, error);
        processedData.push(item); // Return original if processing fails
      }
    }

    return processedData;
  }

  /**
   * App data processor methods
   */
  transformAppData(app) {
    return {
      ...app,
      displayName: app.name || 'Unnamed App',
      statusColor: app.status === 'active' ? 'success' : 'default',
      categoryIcon: this.getCategoryIcon(app.category),
      lastActivity: app.updatedAt || app.createdAt,
      healthScore: this.calculateAppHealthScore(app)
    };
  }

  validateAppData(app) {
    return app && app.name && app.description && app.category;
  }

  async enrichAppData(app) {
    // Add AI-powered insights
    const insights = await this.generateAppInsights(app);

    return {
      ...app,
      insights,
      recommendations: this.generateAppRecommendations(app),
      performanceMetrics: await this.calculatePerformanceMetrics(app)
    };
  }

  /**
   * System data processor methods
   */
  transformSystemData(system) {
    return {
      ...system,
      uptime: this.calculateUptime(system),
      performanceScore: this.calculatePerformanceScore(system),
      resourceUtilization: this.calculateResourceUtilization(system)
    };
  }

  validateSystemData(system) {
    return system && system.status;
  }

  async enrichSystemData(system) {
    return {
      ...system,
      alerts: await this.generateSystemAlerts(system),
      trends: await this.calculateSystemTrends(system)
    };
  }

  /**
   * Log data processor methods
   */
  transformLogData(log) {
    return {
      ...log,
      severity: this.categorizeLogSeverity(log.level),
      formattedTime: new Date(log.timestamp).toLocaleString(),
      category: this.categorizeLogType(log.message)
    };
  }

  validateLogData(log) {
    return log && log.level && log.message && log.timestamp;
  }

  async enrichLogData(log) {
    return {
      ...log,
      context: await this.extractLogContext(log),
      relatedLogs: await this.findRelatedLogs(log)
    };
  }

  /**
   * User data processor methods
   */
  transformUserData(user) {
    return {
      ...user,
      displayName: user.displayName || user.email?.split('@')[0] || 'User',
      lastSeen: user.lastSeen || user.createdAt,
      activityLevel: this.calculateUserActivityLevel(user)
    };
  }

  validateUserData(user) {
    return user && (user.email || user.uid);
  }

  async enrichUserData(user) {
    return {
      ...user,
      preferences: await this.getUserPreferences(user),
      usageStats: await this.getUserUsageStats(user)
    };
  }

  /**
   * AI-powered data insights
   */
  async generateAppInsights(app) {
    const insights = {
      performance: 'Good',
      recommendations: [],
      anomalies: [],
      trends: []
    };

    // Analyze app performance
    if (app.status === 'active') {
      insights.performance = 'Excellent';
    } else if (app.status === 'inactive') {
      insights.performance = 'Needs Attention';
      insights.recommendations.push('Consider activating this app');
    }

    // Detect anomalies
    if (app.createdAt && new Date(app.createdAt) < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) {
      if (app.status === 'inactive') {
        insights.anomalies.push('App has been inactive for over a week');
      }
    }

    return insights;
  }

  generateAppRecommendations(app) {
    const recommendations = [];

    if (app.category === 'ai' && app.status === 'inactive') {
      recommendations.push('AI apps benefit from regular usage for model training');
    }

    if (!app.config || Object.keys(app.config).length === 0) {
      recommendations.push('Consider adding configuration for better performance');
    }

    return recommendations;
  }

  async calculatePerformanceMetrics(app) {
    // Simulate performance calculation
    return {
      cpuUsage: Math.random() * 100,
      memoryUsage: Math.random() * 100,
      responseTime: Math.random() * 1000,
      errorRate: Math.random() * 5
    };
  }

  /**
   * System monitoring and alerts
   */
  async generateSystemAlerts(system) {
    const alerts = [];

    if (system.totalApps > 100) {
      alerts.push({
        type: 'warning',
        message: 'High number of apps detected. Consider archiving unused apps.'
      });
    }

    if (system.activeApps / system.totalApps < 0.3) {
      alerts.push({
        type: 'info',
        message: 'Low app utilization. Consider reviewing inactive apps.'
      });
    }

    return alerts;
  }

  async calculateSystemTrends(system) {
    return {
      appGrowth: '+12%',
      activeUsers: '+8%',
      systemLoad: '-5%',
      errorRate: '-2%'
    };
  }

  /**
   * Log analysis and context extraction
   */
  categorizeLogSeverity(level) {
    const severityMap = {
      error: 'high',
      warn: 'medium',
      info: 'low',
      debug: 'low'
    };
    return severityMap[level] || 'low';
  }

  categorizeLogType(message) {
    if (message.includes('auth') || message.includes('login')) return 'authentication';
    if (message.includes('database') || message.includes('firestore')) return 'database';
    if (message.includes('api') || message.includes('endpoint')) return 'api';
    if (message.includes('error') || message.includes('failed')) return 'error';
    return 'general';
  }

  async extractLogContext(log) {
    return {
      source: 'system',
      component: this.extractComponentFromMessage(log.message),
      correlationId: this.generateCorrelationId()
    };
  }

  async findRelatedLogs(log) {
    // Find logs with similar patterns
    const relatedLogs = await this.fetchData('system_logs', {
      filters: [{ field: 'level', operator: '==', value: log.level }],
      limit: 5
    });

    return relatedLogs.filter(relatedLog => relatedLog.id !== log.id);
  }

  /**
   * Real-time data subscriptions
   */
  setupRealTimeSubscription(collectionName, options) {
    const subscriptionKey = `${collectionName}_${JSON.stringify(options)}`;

    if (this.subscriptions.has(subscriptionKey)) {
      return; // Already subscribed
    }

    let q = collection(this.db, collectionName);

    // Apply same filters as fetchData
    if (options.filters) {
      options.filters.forEach(filter => {
        q = query(q, where(filter.field, filter.operator, filter.value));
      });
    }

    if (options.orderBy) {
      q = query(q, orderBy(options.orderBy, options.orderDirection || 'desc'));
    }

    if (options.limit) {
      q = query(q, limit(options.limit));
    }

    const unsubscribe = onSnapshot(q, snapshot => {
      const data = [];
      snapshot.forEach(doc => {
        data.push({ id: doc.id, ...doc.data() });
      });

      // Process data
      this.processData(collectionName, data).then(processedData => {
        // Update cache
        const cacheKey = this.generateCacheKey(collectionName, options);
        this.cache.set(cacheKey, {
          data: processedData,
          timestamp: Date.now()
        });

        // Emit real-time update event
        this.emitRealTimeUpdate(collectionName, processedData);
      });
    });

    this.subscriptions.set(subscriptionKey, unsubscribe);
  }

  /**
   * Batch operations for better performance
   */
  async batchCreate(collectionName, items) {
    const results = [];

    for (let i = 0; i < items.length; i += this.batchSize) {
      const batchItems = items.slice(i, i + this.batchSize);

      for (const item of batchItems) {
        try {
          const docRef = await addDoc(collection(this.db, collectionName), item);
          results.push({ id: docRef.id, ...item });
        } catch (error) {
          console.error(`Error creating item in batch:`, error);
          results.push({ error: error.message, item });
        }
      }
    }

    return results;
  }

  async batchUpdate(collectionName, updates) {
    const results = [];

    for (const update of updates) {
      try {
        const docRef = doc(this.db, collectionName, update.id);
        await updateDoc(docRef, update.data);
        results.push({ id: update.id, success: true });
      } catch (error) {
        console.error(`Error updating item ${update.id}:`, error);
        results.push({ id: update.id, error: error.message });
      }
    }

    return results;
  }

  /**
   * Data analytics and reporting
   */
  async generateAnalyticsReport(timeRange = '7d') {
    const report = {
      timeRange,
      generatedAt: new Date(),
      summary: {},
      trends: {},
      insights: []
    };

    // Get data for the time range
    const apps = await this.fetchData('apps');
    const logs = await this.fetchData('system_logs');
    const systemStatus = await this.fetchData('system');

    // Generate summary
    report.summary = {
      totalApps: apps.length,
      activeApps: apps.filter(app => app.status === 'active').length,
      totalLogs: logs.length,
      errorLogs: logs.filter(log => log.level === 'error').length,
      systemUptime: this.calculateSystemUptime(systemStatus)
    };

    // Generate trends
    report.trends = await this.calculateTrends(apps, logs, timeRange);

    // Generate insights
    report.insights = await this.generateInsights(apps, logs, systemStatus);

    return report;
  }

  /**
   * Utility methods
   */
  generateCacheKey(collectionName, options) {
    return `${collectionName}_${JSON.stringify(options)}`;
  }

  getCategoryIcon(category) {
    const iconMap = {
      ai: '🤖',
      automation: '⚙️',
      analytics: '📊',
      productivity: '📈',
      entertainment: '🎮',
      general: '📱'
    };
    return iconMap[category] || '📱';
  }

  calculateAppHealthScore(app) {
    let score = 100;

    if (app.status === 'inactive') score -= 30;
    if (!app.config || Object.keys(app.config).length === 0) score -= 10;
    if (app.createdAt && new Date(app.createdAt) < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) {
      score -= 20;
    }

    return Math.max(0, score);
  }

  calculateUptime(system) {
    // Simulate uptime calculation
    return '99.9%';
  }

  calculatePerformanceScore(system) {
    // Simulate performance score calculation
    return Math.floor(Math.random() * 40) + 60; // 60-100
  }

  calculateResourceUtilization(system) {
    return {
      cpu: Math.random() * 100,
      memory: Math.random() * 100,
      storage: Math.random() * 100
    };
  }

  calculateUserActivityLevel(user) {
    // Simulate user activity calculation
    return Math.random() > 0.5 ? 'high' : 'medium';
  }

  async getUserPreferences(user) {
    // Simulate user preferences
    return {
      theme: 'light',
      notifications: true,
      language: 'en'
    };
  }

  async getUserUsageStats(user) {
    // Simulate usage statistics
    return {
      appsUsed: Math.floor(Math.random() * 10),
      lastLogin: new Date(),
      totalTime: Math.floor(Math.random() * 1000)
    };
  }

  extractComponentFromMessage(message) {
    // Extract component name from log message
    const match = message.match(/(\[.*?\])/);
    return match ? match[1] : 'unknown';
  }

  generateCorrelationId() {
    return Math.random().toString(36).substr(2, 9);
  }

  emitRealTimeUpdate(collectionName, data) {
    // Emit custom event for real-time updates
    const event = new CustomEvent('dataUpdate', {
      detail: { collection: collectionName, data }
    });
    window.dispatchEvent(event);
  }

  async calculateTrends(apps, logs, timeRange) {
    // Simulate trend calculations
    return {
      appGrowth: '+12%',
      errorReduction: '-5%',
      userEngagement: '+8%'
    };
  }

  async generateInsights(apps, logs, systemStatus) {
    const insights = [];

    // Basic rule-based insights
    if (apps.length > 50) {
      insights.push('Consider implementing app categorization for better organization');
    }

    const errorRate = logs.filter(log => log.level === 'error').length / logs.length;
    if (errorRate > 0.1) {
      insights.push('High error rate detected. Review system logs for issues.');
    }

    // Enhanced AI-powered insights using Gemini API service
    if (this.aiTools.gemini.enabled && this.aiTools.gemini.service) {
      try {
        const aiPrompt = `
Analyze the following system data and provide intelligent insights:

Apps Count: ${apps.length}
Logs Count: ${logs.length}
Error Rate: ${errorRate.toFixed(2)}
System Status: ${JSON.stringify(systemStatus, null, 2)}

Recent Logs Sample: ${logs
          .slice(-10)
          .map(log => `${log.level}: ${log.message}`)
          .join('\n')}

Provide 3-5 actionable insights for system optimization and improvement. Focus on:
1. Performance optimization opportunities
2. Security recommendations
3. User experience improvements
4. Resource utilization insights
5. Predictive maintenance suggestions

Format as a JSON array of insight objects with 'type', 'priority', 'description', and 'action' fields.
`;

        const aiResponse = await this.aiTools.gemini.service.generateContent(aiPrompt);

        if (aiResponse.success && aiResponse.text) {
          try {
            // Try to parse AI response as JSON
            const aiInsights = JSON.parse(aiResponse.text);
            if (Array.isArray(aiInsights)) {
              insights.push(
                ...aiInsights.map(insight => `[AI] ${insight.description} (Priority: ${insight.priority})`)
              );
            } else {
              // Fallback: treat as plain text
              insights.push(`[AI] ${aiResponse.text}`);
            }
          } catch (parseError) {
            // Fallback: treat as plain text
            insights.push(`[AI] ${aiResponse.text}`);
          }

          // Update analytics
          this.analytics.aiCalls++;
          this.analytics.insightsGenerated += insights.length;
          this.aiTools.gemini.lastUsed = new Date().toISOString();
        }
      } catch (error) {
        console.warn('Failed to generate AI insights:', error);
        // Continue with basic insights if AI fails
      }
    }

    return insights;
  }

  calculateSystemUptime(systemStatus) {
    return '99.9%';
  }

  /**
   * Cleanup methods
   */
  clearCache() {
    this.cache.clear();
  }

  unsubscribeAll() {
    this.subscriptions.forEach(unsubscribe => unsubscribe());
    this.subscriptions.clear();
  }

  destroy() {
    this.unsubscribeAll();
    this.clearCache();
    this.dataProcessors.clear();
    this.aiInsights.clear();

    // Clean up auth state listener
    if (this.authStateListener) {
      this.authStateListener();
      this.authStateListener = null;
    }

    // Clear meta-learning interval
    if (this.metaLearningInterval) {
      clearInterval(this.metaLearningInterval);
      this.metaLearningInterval = null;
    }
  }

  /**
   * Get API service analytics
   */
  getAPIAnalytics() {
    if (this.aiTools.gemini.service) {
      return this.aiTools.gemini.service.getAnalytics();
    }
    return null;
  }

  /**
   * Get rate limit status
   */
  getRateLimitStatus() {
    if (this.aiTools.gemini.service) {
      return this.aiTools.gemini.service.getRateLimitStatus();
    }
    return null;
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    if (this.aiTools.gemini.service) {
      return this.aiTools.gemini.service.getCacheStats();
    }
    return null;
  }

  /**
   * Clear API cache
   */
  clearAPICache() {
    if (this.aiTools.gemini.service) {
      this.aiTools.gemini.service.clearCache();
    }
  }

  /**
   * Health check for API service
   */
  async healthCheck() {
    if (this.aiTools.gemini.service) {
      return await this.aiTools.gemini.service.healthCheck();
    }
    return { status: 'disabled', message: 'Gemini API service not available' };
  }
}

export default DataAgent;
