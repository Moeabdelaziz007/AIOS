/**
 * Comprehensive Logging System
 * Handles structured logging, log levels, and log management
 */

const fs = require('fs');
const path = require('path');
const { collection, addDoc, getDocs, query, where, orderBy, limit } = require('firebase/firestore');
const { db } = require('./firestoreDataStorage');

class LoggingSystem {
  constructor() {
    this.logLevels = {
      ERROR: 0,
      WARN: 1,
      INFO: 2,
      DEBUG: 3,
      TRACE: 4
    };

    this.currentLevel = this.logLevels.INFO;
    this.logs = [];
    this.maxLogs = 10000;
    this.logRotationSize = 10 * 1024 * 1024; // 10MB
    this.logDirectory = path.join(process.cwd(), 'logs');

    this.colors = {
      ERROR: '\x1b[31m', // Red
      WARN: '\x1b[33m', // Yellow
      INFO: '\x1b[36m', // Cyan
      DEBUG: '\x1b[35m', // Magenta
      TRACE: '\x1b[37m', // White
      RESET: '\x1b[0m' // Reset
    };

    // Store original console methods BEFORE overriding them
    this.originalConsole = {
      log: console.log,
      error: console.error,
      warn: console.warn,
      info: console.info,
      debug: console.debug
    };

    this.ensureLogDirectory();
    this.setupProcessHandlers();
  }

  /**
   * Ensure log directory exists
   */
  ensureLogDirectory() {
    if (!fs.existsSync(this.logDirectory)) {
      fs.mkdirSync(this.logDirectory, { recursive: true });
    }
  }

  /**
   * Setup process handlers
   */
  setupProcessHandlers() {
    // Override console methods
    console.log = (...args) => {
      // Prevent infinite recursion by using original console directly
      this.originalConsole.log(...args);
    };

    console.error = (...args) => {
      // Prevent infinite recursion by using original console directly
      this.originalConsole.error(...args);
    };

    console.warn = (...args) => {
      // Prevent infinite recursion by using original console directly
      this.originalConsole.warn(...args);
    };

    console.info = (...args) => {
      // Prevent infinite recursion by using original console directly
      this.originalConsole.info(...args);
    };

    console.debug = (...args) => {
      // Prevent infinite recursion by using original console directly
      this.originalConsole.debug(...args);
    };

    // Handle uncaught exceptions
    process.on('uncaughtException', error => {
      this.log('ERROR', 'Uncaught Exception:', error);
      this.storeLog('ERROR', 'Uncaught Exception', {
        error: error.message,
        stack: error.stack
      });
    });

    // Handle unhandled rejections
    process.on('unhandledRejection', (reason, promise) => {
      this.log('ERROR', 'Unhandled Rejection:', reason);
      this.storeLog('ERROR', 'Unhandled Rejection', { reason, promise });
    });
  }

  /**
   * Log message
   */
  log(level, message, ...args) {
    if (this.logLevels[level] > this.currentLevel) {
      return;
    }

    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message: typeof message === 'string' ? message : JSON.stringify(message),
      args: args.length > 0 ? args.map(arg => (typeof arg === 'string' ? arg : JSON.stringify(arg))) : [],
      pid: process.pid,
      hostname: require('os').hostname(),
      memory: process.memoryUsage(),
      uptime: process.uptime()
    };

    // Add to in-memory logs
    this.logs.push(logEntry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Write to file
    this.writeToFile(logEntry);

    // Store in Firestore
    this.storeLog(level, message, args);

    // Color console output - use original console to prevent recursion
    const color = this.colors[level] || this.colors.RESET;
    const reset = this.colors.RESET;
    const formattedMessage = `${color}[${timestamp}] ${level}: ${message}${reset}`;

    // Use original console methods to prevent infinite recursion
    const originalConsole = {
      log: console.log,
      error: console.error,
      warn: console.warn,
      info: console.info,
      debug: console.debug
    };

    if (args.length > 0) {
      originalConsole.log(formattedMessage, ...args);
    } else {
      originalConsole.log(formattedMessage);
    }
  }

  /**
   * Write log to file
   */
  writeToFile(logEntry) {
    // Prevent infinite recursion
    if (this._writingToFile) {
      return;
    }

    this._writingToFile = true;

    try {
      const logFile = path.join(this.logDirectory, `aios-${new Date().toISOString().split('T')[0]}.log`);
      const logLine = JSON.stringify(logEntry) + '\n';

      fs.appendFileSync(logFile, logLine);

      // Check file size and rotate if needed
      const stats = fs.statSync(logFile);
      if (stats.size > this.logRotationSize) {
        this.rotateLogFile(logFile);
      }
    } catch (error) {
      // Fallback to console if file writing fails
      // Use console.error directly to prevent recursion
      console.error('Failed to write to log file:', error);
    } finally {
      this._writingToFile = false;
    }
  }

  /**
   * Rotate log file
   */
  rotateLogFile(logFile) {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const rotatedFile = logFile.replace('.log', `-${timestamp}.log`);

      fs.renameSync(logFile, rotatedFile);
      console.log(`📁 Log file rotated: ${rotatedFile}`);
    } catch (error) {
      console.error('Failed to rotate log file:', error);
    }
  }

  /**
   * Store log in Firestore
   */
  async storeLog(level, message, args) {
    // Prevent infinite recursion by checking if we're already in an error state
    if (this._storingLog || !db) {
      return;
    }

    this._storingLog = true;

    try {
      const logData = {
        timestamp: new Date().toISOString(),
        level,
        message: typeof message === 'string' ? message : JSON.stringify(message),
        args: args.length > 0 ? args.map(arg => (typeof arg === 'string' ? arg : JSON.stringify(arg))) : [],
        pid: process.pid,
        hostname: require('os').hostname(),
        memory: process.memoryUsage(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
      };

      await addDoc(collection(db, 'systemLogs'), logData);
    } catch (error) {
      // Don't log Firestore errors to avoid infinite loops
      // Use console.error directly instead of this.log to prevent recursion
      console.error('Failed to store log in Firestore:', error.message);
    } finally {
      this._storingLog = false;
    }
  }

  /**
   * Set log level
   */
  setLogLevel(level) {
    if (this.logLevels.hasOwnProperty(level)) {
      this.currentLevel = this.logLevels[level];
      console.log(`📊 Log level set to: ${level}`);
    } else {
      console.warn(`⚠️ Invalid log level: ${level}`);
    }
  }

  /**
   * Get current log level
   */
  getLogLevel() {
    return Object.keys(this.logLevels).find(key => this.logLevels[key] === this.currentLevel);
  }

  /**
   * Get logs
   */
  getLogs(level = null, limit = 100) {
    let filteredLogs = this.logs;

    if (level && this.logLevels.hasOwnProperty(level)) {
      filteredLogs = this.logs.filter(log => log.level === level);
    }

    return filteredLogs.slice(-limit);
  }

  /**
   * Get logs from Firestore
   */
  async getLogsFromFirestore(level = null, limit = 100) {
    try {
      let q = query(collection(db, 'systemLogs'), orderBy('timestamp', 'desc'), limit(limit));

      if (level) {
        q = query(
          collection(db, 'systemLogs'),
          where('level', '==', level),
          orderBy('timestamp', 'desc'),
          limit(limit)
        );
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('❌ Failed to get logs from Firestore:', error);
      return [];
    }
  }

  /**
   * Clear logs
   */
  clearLogs() {
    this.logs = [];
    console.log('📊 Logs cleared');
  }

  /**
   * Get log statistics
   */
  getLogStats() {
    const stats = {
      total: this.logs.length,
      byLevel: {},
      byHour: {},
      memoryUsage: process.memoryUsage(),
      uptime: process.uptime()
    };

    // Count by level
    this.logs.forEach(log => {
      stats.byLevel[log.level] = (stats.byLevel[log.level] || 0) + 1;
    });

    // Count by hour
    this.logs.forEach(log => {
      const hour = new Date(log.timestamp).getHours();
      stats.byHour[hour] = (stats.byHour[hour] || 0) + 1;
    });

    return stats;
  }

  /**
   * Create structured log entry
   */
  createLogEntry(level, message, metadata = {}) {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      metadata: {
        ...metadata,
        pid: process.pid,
        hostname: require('os').hostname(),
        memory: process.memoryUsage(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
      }
    };
  }

  /**
   * Log with context
   */
  logWithContext(level, message, context = {}) {
    const logEntry = this.createLogEntry(level, message, context);
    this.log(level, message, context);
    return logEntry;
  }

  /**
   * Log API request
   */
  logAPIRequest(method, url, statusCode, responseTime, userAgent = null) {
    this.logWithContext('INFO', 'API Request', {
      type: 'api_request',
      method,
      url,
      statusCode,
      responseTime,
      userAgent
    });
  }

  /**
   * Log API error
   */
  logAPIError(method, url, error, statusCode = 500) {
    this.logWithContext('ERROR', 'API Error', {
      type: 'api_error',
      method,
      url,
      error: error.message,
      stack: error.stack,
      statusCode
    });
  }

  /**
   * Log user action
   */
  logUserAction(userId, action, metadata = {}) {
    this.logWithContext('INFO', 'User Action', {
      type: 'user_action',
      userId,
      action,
      ...metadata
    });
  }

  /**
   * Log system event
   */
  logSystemEvent(event, metadata = {}) {
    this.logWithContext('INFO', 'System Event', {
      type: 'system_event',
      event,
      ...metadata
    });
  }

  /**
   * Log security event
   */
  logSecurityEvent(event, severity = 'INFO', metadata = {}) {
    this.logWithContext(severity, 'Security Event', {
      type: 'security_event',
      event,
      severity,
      ...metadata
    });
  }

  /**
   * Log performance metric
   */
  logPerformanceMetric(metric, value, metadata = {}) {
    this.logWithContext('INFO', 'Performance Metric', {
      type: 'performance_metric',
      metric,
      value,
      ...metadata
    });
  }

  /**
   * Log database operation
   */
  logDatabaseOperation(operation, collection, documentId = null, metadata = {}) {
    this.logWithContext('DEBUG', 'Database Operation', {
      type: 'database_operation',
      operation,
      collection,
      documentId,
      ...metadata
    });
  }

  /**
   * Log external service call
   */
  logExternalServiceCall(service, endpoint, method, statusCode, responseTime, metadata = {}) {
    this.logWithContext('INFO', 'External Service Call', {
      type: 'external_service',
      service,
      endpoint,
      method,
      statusCode,
      responseTime,
      ...metadata
    });
  }

  /**
   * Export logs
   */
  exportLogs(format = 'json', level = null) {
    const logs = this.getLogs(level);

    switch (format.toLowerCase()) {
      case 'json':
        return JSON.stringify(logs, null, 2);
      case 'csv':
        return this.convertToCSV(logs);
      case 'txt':
        return logs.map(log => `[${log.timestamp}] ${log.level}: ${log.message} ${log.args.join(' ')}`).join('\n');
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  /**
   * Convert logs to CSV
   */
  convertToCSV(logs) {
    if (logs.length === 0) return '';

    const headers = ['timestamp', 'level', 'message', 'args', 'pid', 'hostname'];
    const csvRows = [headers.join(',')];

    logs.forEach(log => {
      const row = [
        log.timestamp,
        log.level,
        `"${log.message.replace(/"/g, '""')}"`,
        `"${log.args.join('; ').replace(/"/g, '""')}"`,
        log.pid,
        log.hostname
      ];
      csvRows.push(row.join(','));
    });

    return csvRows.join('\n');
  }

  /**
   * Get log file list
   */
  getLogFiles() {
    try {
      return fs
        .readdirSync(this.logDirectory)
        .filter(file => file.endsWith('.log'))
        .map(file => ({
          name: file,
          path: path.join(this.logDirectory, file),
          size: fs.statSync(path.join(this.logDirectory, file)).size,
          modified: fs.statSync(path.join(this.logDirectory, file)).mtime
        }));
    } catch (error) {
      console.error('❌ Failed to get log files:', error);
      return [];
    }
  }

  /**
   * Clean old log files
   */
  cleanOldLogFiles(daysOld = 7) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const logFiles = this.getLogFiles();
      let cleanedCount = 0;

      logFiles.forEach(file => {
        if (file.modified < cutoffDate) {
          fs.unlinkSync(file.path);
          cleanedCount++;
          console.log(`🗑️ Deleted old log file: ${file.name}`);
        }
      });

      console.log(`🧹 Cleaned ${cleanedCount} old log files`);
      return cleanedCount;
    } catch (error) {
      console.error('❌ Failed to clean old log files:', error);
      return 0;
    }
  }
}

module.exports = LoggingSystem;
