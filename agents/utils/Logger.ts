/**
 * Logger.ts
 *
 * Advanced logging system with multiple levels, formatting, and output options.
 * Based on professional logging patterns from SelfOS and Open-WebUI projects.
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4
}

export interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: string;
  context?: string;
  metadata?: any;
  stack?: string;
}

export interface LoggerConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableFile: boolean;
  enableRemote: boolean;
  filePath?: string;
  remoteEndpoint?: string;
  maxFileSize?: number;
  maxFiles?: number;
  format?: 'json' | 'text' | 'compact';
}

export class Logger {
  private config: LoggerConfig;
  private context: string;
  private logBuffer: LogEntry[] = [];
  private maxBufferSize: number = 1000;

  constructor(context: string = 'Logger', config: Partial<LoggerConfig> = {}) {
    this.context = context;
    this.config = {
      level: LogLevel.INFO,
      enableConsole: true,
      enableFile: false,
      enableRemote: false,
      maxFileSize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
      format: 'compact',
      ...config
    };
  }

  /**
   * Debug level logging
   */
  debug(message: string, metadata?: any): void {
    this.log(LogLevel.DEBUG, message, metadata);
  }

  /**
   * Info level logging
   */
  info(message: string, metadata?: any): void {
    this.log(LogLevel.INFO, message, metadata);
  }

  /**
   * Warning level logging
   */
  warn(message: string, metadata?: any): void {
    this.log(LogLevel.WARN, message, metadata);
  }

  /**
   * Error level logging
   */
  error(message: string, metadata?: any): void {
    this.log(LogLevel.ERROR, message, metadata);
  }

  /**
   * Fatal level logging
   */
  fatal(message: string, metadata?: any): void {
    this.log(LogLevel.FATAL, message, metadata);
  }

  /**
   * Core logging method
   */
  private log(level: LogLevel, message: string, metadata?: any): void {
    if (level < this.config.level) {
      return;
    }

    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      context: this.context,
      metadata,
      stack: level >= LogLevel.ERROR ? this.getStackTrace() : undefined
    };

    // Add to buffer
    this.logBuffer.push(entry);
    if (this.logBuffer.length > this.maxBufferSize) {
      this.logBuffer.shift();
    }

    // Output to configured destinations
    if (this.config.enableConsole) {
      this.outputToConsole(entry);
    }

    if (this.config.enableFile) {
      this.outputToFile(entry);
    }

    if (this.config.enableRemote) {
      this.outputToRemote(entry);
    }
  }

  /**
   * Output to console
   */
  private outputToConsole(entry: LogEntry): void {
    const formatted = this.formatEntry(entry);

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(formatted);
        break;
      case LogLevel.INFO:
        console.info(formatted);
        break;
      case LogLevel.WARN:
        console.warn(formatted);
        break;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        console.error(formatted);
        break;
    }
  }

  /**
   * Output to file
   */
  private async outputToFile(entry: LogEntry): Promise<void> {
    // TODO: Implement file logging
    // This would write to a log file with rotation
  }

  /**
   * Output to remote endpoint
   */
  private async outputToRemote(entry: LogEntry): Promise<void> {
    // TODO: Implement remote logging
    // This would send logs to a remote service
  }

  /**
   * Format log entry
   */
  private formatEntry(entry: LogEntry): string {
    const timestamp = entry.timestamp.toISOString();
    const level = LogLevel[entry.level];
    const context = entry.context ? `[${entry.context}]` : '';
    const metadata = entry.metadata ? ` ${JSON.stringify(entry.metadata)}` : '';
    const stack = entry.stack ? `\n${entry.stack}` : '';

    switch (this.config.format) {
      case 'json':
        return JSON.stringify({
          timestamp,
          level,
          context: entry.context,
          message: entry.message,
          metadata: entry.metadata,
          stack: entry.stack
        });

      case 'text':
        return `${timestamp} ${level} ${context} ${entry.message}${metadata}${stack}`;

      case 'compact':
      default:
        return `${timestamp} ${level} ${context} ${entry.message}${metadata}${stack}`;
    }
  }

  /**
   * Get stack trace
   */
  private getStackTrace(): string {
    const stack = new Error().stack;
    return stack ? stack.split('\n').slice(3).join('\n') : '';
  }

  /**
   * Get log buffer
   */
  getLogBuffer(): LogEntry[] {
    return [...this.logBuffer];
  }

  /**
   * Clear log buffer
   */
  clearBuffer(): void {
    this.logBuffer = [];
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Create child logger
   */
  child(childContext: string): Logger {
    return new Logger(`${this.context}:${childContext}`, this.config);
  }

  /**
   * Get current configuration
   */
  getConfig(): LoggerConfig {
    return { ...this.config };
  }
}
