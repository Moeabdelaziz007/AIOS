/**
 * Centralized Logging System for AIOS
 * Replaces console.log statements with structured logging
 */

const { createLogger, format, transports } = require('winston');
const path = require('path');

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white'
};

// Create the logger
const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  levels,
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    format.colorize({ all: true }),
    format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [
    // Console transport
    new transports.Console(),
    // File transport for errors
    new transports.File({
      filename: path.join(__dirname, '../../logs/error.log'),
      level: 'error',
      format: format.combine(format.timestamp(), format.json())
    }),
    // File transport for all logs
    new transports.File({
      filename: path.join(__dirname, '../../logs/combined.log'),
      format: format.combine(format.timestamp(), format.json())
    })
  ]
});

// Add colors to winston
require('winston').addColors(colors);

// Create logs directory if it doesn't exist
const fs = require('fs');
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Helper functions for structured logging
const logHelpers = {
  // Log API requests
  apiRequest: (method, url, statusCode, responseTime) => {
    logger.http(`${method} ${url} - ${statusCode} - ${responseTime}ms`);
  },

  // Log authentication events
  authEvent: (event, userId, details = {}) => {
    logger.info(`Auth: ${event}`, { userId, ...details });
  },

  // Log database operations
  dbOperation: (operation, collection, documentId, success) => {
    const level = success ? 'info' : 'error';
    logger[level](`DB: ${operation} ${collection}/${documentId}`, { success });
  },

  // Log system events
  systemEvent: (event, details = {}) => {
    logger.info(`System: ${event}`, details);
  },

  // Log AI operations
  aiOperation: (operation, model, success, details = {}) => {
    const level = success ? 'info' : 'error';
    logger[level](`AI: ${operation} using ${model}`, { success, ...details });
  },

  // Log performance metrics
  performance: (metric, value, unit = 'ms') => {
    logger.info(`Performance: ${metric} = ${value}${unit}`);
  }
};

// Override console methods in development
if (process.env.NODE_ENV === 'development') {
  const originalConsole = {
    log: console.log,
    warn: console.warn,
    error: console.error,
    info: console.info
  };

  console.log = (...args) => logger.debug(args.join(' '));
  console.warn = (...args) => logger.warn(args.join(' '));
  console.error = (...args) => logger.error(args.join(' '));
  console.info = (...args) => logger.info(args.join(' '));
}

module.exports = {
  logger,
  ...logHelpers
};
