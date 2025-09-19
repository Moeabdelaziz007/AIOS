/**
 * Enhanced Gemini API Service with Error Handling, Rate Limiting, and Caching
 * Comprehensive API service for AIOS with robust error handling and performance optimization
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiAPIService {
  constructor() {
    this.genAI = null;
    this.model = null;
    this.isInitialized = false;

    // Rate limiting configuration
    this.rateLimits = {
      requestsPerMinute:
        parseInt(process.env.GEMINI_RATE_LIMIT_REQUESTS_PER_MINUTE) || 60,
      requestsPerHour:
        parseInt(process.env.GEMINI_RATE_LIMIT_REQUESTS_PER_HOUR) || 1000,
      requestsPerDay:
        parseInt(process.env.GEMINI_RATE_LIMIT_REQUESTS_PER_DAY) || 10000,
    };

    // Rate limiting tracking
    this.requestHistory = {
      minute: [],
      hour: [],
      day: [],
    };

    // Caching configuration
    this.cacheConfig = {
      enabled: process.env.GEMINI_CACHE_ENABLED === 'true',
      ttl: parseInt(process.env.GEMINI_CACHE_TTL_SECONDS) || 300, // 5 minutes
      maxSize: parseInt(process.env.GEMINI_CACHE_MAX_SIZE) || 1000,
    };

    // Cache storage
    this.cache = new Map();
    this.cacheTimestamps = new Map();

    // Error handling configuration
    this.retryConfig = {
      maxRetries: 3,
      baseDelay: 1000, // 1 second
      maxDelay: 10000, // 10 seconds
      backoffMultiplier: 2,
    };

    // Analytics and monitoring
    this.analytics = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      cacheHits: 0,
      cacheMisses: 0,
      rateLimitHits: 0,
      averageResponseTime: 0,
      errorTypes: {},
      lastRequestTime: null,
    };

    // API configuration
    this.apiConfig = {
      model: process.env.GEMINI_MODEL || 'gemini-1.5-pro',
      maxTokens: parseInt(process.env.GEMINI_MAX_TOKENS) || 8192,
      temperature: parseFloat(process.env.GEMINI_TEMPERATURE) || 0.7,
      topK: parseInt(process.env.GEMINI_TOP_K) || 40,
      topP: parseFloat(process.env.GEMINI_TOP_P) || 0.95,
    };
  }

  /**
   * Initialize the Gemini API service
   */
  async initialize() {
    try {
      console.log('🚀 Initializing Enhanced Gemini API Service...');

      // Get API key from environment variables
      const apiKey = this.getAPIKey();
      if (!apiKey) {
        throw new Error('Gemini API key not found in environment variables');
      }

      // Initialize Google Generative AI
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({
        model: this.apiConfig.model,
        generationConfig: {
          temperature: this.apiConfig.temperature,
          topK: this.apiConfig.topK,
          topP: this.apiConfig.topP,
          maxOutputTokens: this.apiConfig.maxTokens,
        },
      });

      this.isInitialized = true;
      console.log('✅ Enhanced Gemini API Service initialized successfully');

      // Log configuration
      console.log('📊 API Configuration:', {
        model: this.apiConfig.model,
        rateLimits: this.rateLimits,
        cacheEnabled: this.cacheConfig.enabled,
        cacheTTL: this.cacheConfig.ttl,
      });
    } catch (error) {
      console.error('❌ Failed to initialize Gemini API Service:', error);
      throw error;
    }
  }

  /**
   * Get API key from environment variables with fallback
   */
  getAPIKey() {
    return (
      process.env.VITE_GEMINI_API_KEY ||
      process.env.GEMINI_API_KEY ||
      process.env.REACT_APP_GEMINI_API_KEY
    );
  }

  /**
   * Generate content with comprehensive error handling, rate limiting, and caching
   */
  async generateContent(prompt, options = {}) {
    const startTime = Date.now();
    const requestId = this.generateRequestId();

    try {
      // Check if service is initialized
      if (!this.isInitialized) {
        await this.initialize();
      }

      // Check rate limits
      if (!this.checkRateLimit()) {
        this.analytics.rateLimitHits++;
        throw new Error('Rate limit exceeded. Please try again later.');
      }

      // Generate cache key
      const cacheKey = this.generateCacheKey(prompt, options);

      // Check cache first
      if (this.cacheConfig.enabled) {
        const cachedResponse = this.getFromCache(cacheKey);
        if (cachedResponse) {
          this.analytics.cacheHits++;
          console.log(`🎯 Cache hit for request ${requestId}`);
          return cachedResponse;
        }
        this.analytics.cacheMisses++;
      }

      // Track request
      this.trackRequest();

      // Generate content with retry logic
      const response = await this.generateWithRetry(prompt, options, requestId);

      // Cache the response
      if (this.cacheConfig.enabled && response) {
        this.setCache(cacheKey, response);
      }

      // Update analytics
      this.updateAnalytics(startTime, true);

      console.log(`✅ Request ${requestId} completed successfully`);
      return response;
    } catch (error) {
      this.updateAnalytics(startTime, false, error);
      console.error(`❌ Request ${requestId} failed:`, error.message);

      // Return structured error response
      return {
        success: false,
        error: this.categorizeError(error),
        message: error.message,
        requestId,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Generate content with retry logic
   */
  async generateWithRetry(prompt, options, requestId) {
    let lastError;

    for (let attempt = 1; attempt <= this.retryConfig.maxRetries; attempt++) {
      try {
        console.log(
          `🔄 Attempt ${attempt}/${this.retryConfig.maxRetries} for request ${requestId}`
        );

        const result = await this.model.generateContent(prompt);
        const response = await result.response;

        return {
          success: true,
          text: response.text(),
          requestId,
          attempt,
          timestamp: new Date().toISOString(),
          usage: {
            promptTokens: this.estimateTokens(prompt),
            responseTokens: this.estimateTokens(response.text()),
          },
        };
      } catch (error) {
        lastError = error;
        console.warn(
          `⚠️ Attempt ${attempt} failed for request ${requestId}:`,
          error.message
        );

        // Don't retry for certain error types
        if (this.isNonRetryableError(error)) {
          throw error;
        }

        // Wait before retry (exponential backoff)
        if (attempt < this.retryConfig.maxRetries) {
          const delay = Math.min(
            this.retryConfig.baseDelay *
              Math.pow(this.retryConfig.backoffMultiplier, attempt - 1),
            this.retryConfig.maxDelay
          );
          console.log(`⏳ Waiting ${delay}ms before retry...`);
          await this.sleep(delay);
        }
      }
    }

    throw lastError;
  }

  /**
   * Check rate limits
   */
  checkRateLimit() {
    const now = Date.now();

    // Clean old entries
    this.cleanRequestHistory(now);

    // Check minute limit
    if (
      this.requestHistory.minute.length >= this.rateLimits.requestsPerMinute
    ) {
      return false;
    }

    // Check hour limit
    if (this.requestHistory.hour.length >= this.rateLimits.requestsPerHour) {
      return false;
    }

    // Check day limit
    if (this.requestHistory.day.length >= this.rateLimits.requestsPerDay) {
      return false;
    }

    return true;
  }

  /**
   * Track request for rate limiting
   */
  trackRequest() {
    const now = Date.now();

    this.requestHistory.minute.push(now);
    this.requestHistory.hour.push(now);
    this.requestHistory.day.push(now);

    this.analytics.totalRequests++;
    this.analytics.lastRequestTime = now;
  }

  /**
   * Clean old entries from request history
   */
  cleanRequestHistory(now) {
    const minuteAgo = now - 60000;
    const hourAgo = now - 3600000;
    const dayAgo = now - 86400000;

    this.requestHistory.minute = this.requestHistory.minute.filter(
      time => time > minuteAgo
    );
    this.requestHistory.hour = this.requestHistory.hour.filter(
      time => time > hourAgo
    );
    this.requestHistory.day = this.requestHistory.day.filter(
      time => time > dayAgo
    );
  }

  /**
   * Generate cache key
   */
  generateCacheKey(prompt, options) {
    const keyData = {
      prompt: prompt.substring(0, 100), // Truncate for key efficiency
      model: this.apiConfig.model,
      temperature: options.temperature || this.apiConfig.temperature,
      maxTokens: options.maxTokens || this.apiConfig.maxTokens,
    };
    return btoa(JSON.stringify(keyData));
  }

  /**
   * Get response from cache
   */
  getFromCache(key) {
    if (!this.cacheConfig.enabled) return null;

    const timestamp = this.cacheTimestamps.get(key);
    if (!timestamp) return null;

    const now = Date.now();
    if (now - timestamp > this.cacheConfig.ttl * 1000) {
      this.cache.delete(key);
      this.cacheTimestamps.delete(key);
      return null;
    }

    return this.cache.get(key);
  }

  /**
   * Set response in cache
   */
  setCache(key, response) {
    if (!this.cacheConfig.enabled) return;

    // Check cache size limit
    if (this.cache.size >= this.cacheConfig.maxSize) {
      // Remove oldest entry
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
      this.cacheTimestamps.delete(oldestKey);
    }

    this.cache.set(key, response);
    this.cacheTimestamps.set(key, Date.now());
  }

  /**
   * Check if error is non-retryable
   */
  isNonRetryableError(error) {
    const nonRetryableErrors = [
      'API_KEY_INVALID',
      'PERMISSION_DENIED',
      'QUOTA_EXCEEDED',
      'INVALID_ARGUMENT',
    ];

    return nonRetryableErrors.some(
      errorType => error.message.includes(errorType) || error.code === errorType
    );
  }

  /**
   * Categorize error for better handling
   */
  categorizeError(error) {
    if (error.message.includes('API_KEY')) {
      return 'AUTHENTICATION_ERROR';
    } else if (
      error.message.includes('QUOTA') ||
      error.message.includes('RATE_LIMIT')
    ) {
      return 'QUOTA_ERROR';
    } else if (
      error.message.includes('NETWORK') ||
      error.message.includes('TIMEOUT')
    ) {
      return 'NETWORK_ERROR';
    } else if (error.message.includes('INVALID_ARGUMENT')) {
      return 'VALIDATION_ERROR';
    } else {
      return 'UNKNOWN_ERROR';
    }
  }

  /**
   * Estimate token count (rough approximation)
   */
  estimateTokens(text) {
    return Math.ceil(text.length / 4); // Rough approximation: 4 characters per token
  }

  /**
   * Update analytics
   */
  updateAnalytics(startTime, success, error = null) {
    const responseTime = Date.now() - startTime;

    if (success) {
      this.analytics.successfulRequests++;
    } else {
      this.analytics.failedRequests++;

      if (error) {
        const errorType = this.categorizeError(error);
        this.analytics.errorTypes[errorType] =
          (this.analytics.errorTypes[errorType] || 0) + 1;
      }
    }

    // Update average response time
    this.analytics.averageResponseTime =
      (this.analytics.averageResponseTime * (this.analytics.totalRequests - 1) +
        responseTime) /
      this.analytics.totalRequests;
  }

  /**
   * Generate unique request ID
   */
  generateRequestId() {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Sleep utility for delays
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get current rate limit status
   */
  getRateLimitStatus() {
    const now = Date.now();
    this.cleanRequestHistory(now);

    return {
      minute: {
        used: this.requestHistory.minute.length,
        limit: this.rateLimits.requestsPerMinute,
        remaining:
          this.rateLimits.requestsPerMinute - this.requestHistory.minute.length,
      },
      hour: {
        used: this.requestHistory.hour.length,
        limit: this.rateLimits.requestsPerHour,
        remaining:
          this.rateLimits.requestsPerHour - this.requestHistory.hour.length,
      },
      day: {
        used: this.requestHistory.day.length,
        limit: this.rateLimits.requestsPerDay,
        remaining:
          this.rateLimits.requestsPerDay - this.requestHistory.day.length,
      },
    };
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      enabled: this.cacheConfig.enabled,
      size: this.cache.size,
      maxSize: this.cacheConfig.maxSize,
      ttl: this.cacheConfig.ttl,
      hitRate:
        this.analytics.cacheHits /
          (this.analytics.cacheHits + this.analytics.cacheMisses) || 0,
    };
  }

  /**
   * Get comprehensive analytics
   */
  getAnalytics() {
    return {
      ...this.analytics,
      rateLimitStatus: this.getRateLimitStatus(),
      cacheStats: this.getCacheStats(),
      uptime: this.isInitialized
        ? Date.now() - this.analytics.lastRequestTime
        : 0,
    };
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
    this.cacheTimestamps.clear();
    console.log('🧹 Cache cleared');
  }

  /**
   * Reset analytics
   */
  resetAnalytics() {
    this.analytics = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      cacheHits: 0,
      cacheMisses: 0,
      rateLimitHits: 0,
      averageResponseTime: 0,
      errorTypes: {},
      lastRequestTime: null,
    };
    console.log('📊 Analytics reset');
  }

  /**
   * Health check
   */
  async healthCheck() {
    try {
      if (!this.isInitialized) {
        return {
          status: 'not_initialized',
          message: 'Service not initialized',
        };
      }

      // Test with a simple prompt
      const testResponse = await this.generateContent(
        'Hello, this is a health check.'
      );

      return {
        status: 'healthy',
        message: 'Service is operational',
        analytics: this.getAnalytics(),
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        message: error.message,
        error: this.categorizeError(error),
        timestamp: new Date().toISOString(),
      };
    }
  }
}

// Create singleton instance
const geminiAPIService = new GeminiAPIService();

export default geminiAPIService;
