/**
 * 🛠️ Quantum Utils Module
 * 
 * Utility functions for the Quantum Autopilot System
 */

class QuantumUtils {
  constructor() {
    this.name = 'Quantum Utils';
    this.version = '1.0.0';
    
    console.log(`🛠️ ${this.name} v${this.version} initialized`);
  }

  /**
   * Generate a unique session ID
   */
  generateSessionId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `session_${timestamp}_${random}`;
  }

  /**
   * Generate a unique task ID
   */
  generateTaskId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `task_${timestamp}_${random}`;
  }

  /**
   * Generate a unique ID with prefix
   */
  generateId(prefix = 'id') {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `${prefix}_${timestamp}_${random}`;
  }

  /**
   * Format duration in milliseconds to human readable format
   */
  formatDuration(ms) {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    if (ms < 3600000) return `${(ms / 60000).toFixed(1)}m`;
    return `${(ms / 3600000).toFixed(1)}h`;
  }

  /**
   * Format bytes to human readable format
   */
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Format percentage
   */
  formatPercentage(value, decimals = 1) {
    return `${(value * 100).toFixed(decimals)}%`;
  }

  /**
   * Deep clone an object
   */
  deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => this.deepClone(item));
    if (typeof obj === 'object') {
      const clonedObj = {};
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          clonedObj[key] = this.deepClone(obj[key]);
        }
      }
      return clonedObj;
    }
  }

  /**
   * Merge objects deeply
   */
  deepMerge(target, source) {
    const result = this.deepClone(target);
    
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
          result[key] = this.deepMerge(result[key] || {}, source[key]);
        } else {
          result[key] = source[key];
        }
      }
    }
    
    return result;
  }

  /**
   * Sleep for specified milliseconds
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Retry a function with exponential backoff
   */
  async retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
    let lastError;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        
        if (i === maxRetries - 1) {
          throw lastError;
        }
        
        const delay = baseDelay * Math.pow(2, i);
        console.log(`⏳ Retry ${i + 1}/${maxRetries} after ${delay}ms delay`);
        await this.sleep(delay);
      }
    }
  }

  /**
   * Debounce a function
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Throttle a function
   */
  throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  /**
   * Generate a random string
   */
  randomString(length = 10) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Generate a UUID v4
   */
  generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * Validate email format
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate URL format
   */
  isValidURL(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Sanitize string for safe display
   */
  sanitizeString(str) {
    if (typeof str !== 'string') return str;
    
    return str
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/['"]/g, '') // Remove quotes
      .trim();
  }

  /**
   * Truncate string to specified length
   */
  truncateString(str, length = 100, suffix = '...') {
    if (typeof str !== 'string') return str;
    if (str.length <= length) return str;
    
    return str.substring(0, length - suffix.length) + suffix;
  }

  /**
   * Capitalize first letter of string
   */
  capitalize(str) {
    if (typeof str !== 'string') return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Convert string to camelCase
   */
  toCamelCase(str) {
    if (typeof str !== 'string') return str;
    
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
      })
      .replace(/\s+/g, '');
  }

  /**
   * Convert string to kebab-case
   */
  toKebabCase(str) {
    if (typeof str !== 'string') return str;
    
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[\s_]+/g, '-')
      .toLowerCase();
  }

  /**
   * Convert string to snake_case
   */
  toSnakeCase(str) {
    if (typeof str !== 'string') return str;
    
    return str
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .replace(/[\s-]+/g, '_')
      .toLowerCase();
  }

  /**
   * Get current timestamp
   */
  getTimestamp() {
    return Date.now();
  }

  /**
   * Get current date as ISO string
   */
  getISODate() {
    return new Date().toISOString();
  }

  /**
   * Format date to readable string
   */
  formatDate(date = new Date(), format = 'YYYY-MM-DD HH:mm:ss') {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    
    return format
      .replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds);
  }

  /**
   * Calculate time difference in milliseconds
   */
  timeDiff(startTime, endTime = Date.now()) {
    return endTime - startTime;
  }

  /**
   * Check if value is empty
   */
  isEmpty(value) {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim().length === 0;
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
  }

  /**
   * Check if value is not empty
   */
  isNotEmpty(value) {
    return !this.isEmpty(value);
  }

  /**
   * Check if value is a number
   */
  isNumber(value) {
    return typeof value === 'number' && !isNaN(value);
  }

  /**
   * Check if value is a string
   */
  isString(value) {
    return typeof value === 'string';
  }

  /**
   * Check if value is an object
   */
  isObject(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }

  /**
   * Check if value is an array
   */
  isArray(value) {
    return Array.isArray(value);
  }

  /**
   * Check if value is a function
   */
  isFunction(value) {
    return typeof value === 'function';
  }

  /**
   * Get nested object property safely
   */
  getNestedProperty(obj, path, defaultValue = undefined) {
    const keys = path.split('.');
    let current = obj;
    
    for (const key of keys) {
      if (current === null || current === undefined || !current.hasOwnProperty(key)) {
        return defaultValue;
      }
      current = current[key];
    }
    
    return current;
  }

  /**
   * Set nested object property safely
   */
  setNestedProperty(obj, path, value) {
    const keys = path.split('.');
    let current = obj;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!current[key] || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key];
    }
    
    current[keys[keys.length - 1]] = value;
    return obj;
  }

  /**
   * Remove nested object property safely
   */
  removeNestedProperty(obj, path) {
    const keys = path.split('.');
    let current = obj;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!current[key] || typeof current[key] !== 'object') {
        return false;
      }
      current = current[key];
    }
    
    const lastKey = keys[keys.length - 1];
    if (current.hasOwnProperty(lastKey)) {
      delete current[lastKey];
      return true;
    }
    
    return false;
  }

  /**
   * Flatten nested object
   */
  flattenObject(obj, prefix = '') {
    const flattened = {};
    
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const newKey = prefix ? `${prefix}.${key}` : key;
        
        if (this.isObject(obj[key]) && !Array.isArray(obj[key])) {
          Object.assign(flattened, this.flattenObject(obj[key], newKey));
        } else {
          flattened[newKey] = obj[key];
        }
      }
    }
    
    return flattened;
  }

  /**
   * Unflatten object
   */
  unflattenObject(obj) {
    const unflattened = {};
    
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        this.setNestedProperty(unflattened, key, obj[key]);
      }
    }
    
    return unflattened;
  }

  /**
   * Pick specific properties from object
   */
  pick(obj, keys) {
    const result = {};
    for (const key of keys) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        result[key] = obj[key];
      }
    }
    return result;
  }

  /**
   * Omit specific properties from object
   */
  omit(obj, keys) {
    const result = { ...obj };
    for (const key of keys) {
      delete result[key];
    }
    return result;
  }

  /**
   * Create a hash from string
   */
  hashString(str) {
    let hash = 0;
    if (str.length === 0) return hash;
    
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return hash;
  }

  /**
   * Generate a simple checksum
   */
  checksum(data) {
    const str = typeof data === 'string' ? data : JSON.stringify(data);
    return this.hashString(str).toString(16);
  }

  /**
   * Log with timestamp
   */
  log(message, level = 'info') {
    const timestamp = this.formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss');
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    console.log(`${prefix} ${message}`);
  }

  /**
   * Create a promise that resolves after specified time
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Create a promise that rejects after specified time
   */
  timeout(ms, message = 'Operation timed out') {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error(message)), ms);
    });
  }

  /**
   * Race between promise and timeout
   */
  async withTimeout(promise, ms, message = 'Operation timed out') {
    return Promise.race([
      promise,
      this.timeout(ms, message)
    ]);
  }

  /**
   * Retry operation with custom retry logic
   */
  async retry(fn, options = {}) {
    const {
      maxRetries = 3,
      baseDelay = 1000,
      maxDelay = 10000,
      backoffFactor = 2,
      retryCondition = () => true
    } = options;
    
    let lastError;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        
        if (i === maxRetries - 1 || !retryCondition(error)) {
          throw lastError;
        }
        
        const delay = Math.min(baseDelay * Math.pow(backoffFactor, i), maxDelay);
        console.log(`⏳ Retry ${i + 1}/${maxRetries} after ${delay}ms delay`);
        await this.sleep(delay);
      }
    }
  }
}

module.exports = QuantumUtils;
