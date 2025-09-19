/**
 * Metrics.ts
 *
 * Comprehensive metrics collection and monitoring system.
 * Provides performance tracking, resource monitoring, and analytics.
 */

import { Logger } from './Logger';

export interface MetricData {
  timestamp: Date;
  value: number;
  metadata?: any;
}

export interface MetricConfig {
  collectionInterval: number;
  retentionPeriod: number;
  enableRealTime: boolean;
  enableAggregation: boolean;
  aggregationWindow: number;
}

export interface ResourceMetrics {
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  cpu: {
    usage: number;
    load: number[];
  };
  disk: {
    used: number;
    total: number;
    percentage: number;
  };
  network: {
    bytesIn: number;
    bytesOut: number;
    packetsIn: number;
    packetsOut: number;
  };
}

export interface PerformanceMetrics {
  responseTime: number;
  throughput: number;
  errorRate: number;
  successRate: number;
  activeConnections: number;
}

export class MetricsCollector {
  private readonly logger: Logger;
  private config: MetricConfig;
  private metrics: Map<string, MetricData[]> = new Map();
  private isCollecting: boolean = false;
  private collectionInterval?: NodeJS.Timeout;
  private agentId: string;

  constructor(config: Partial<MetricConfig> = {}) {
    this.config = {
      collectionInterval: 5000, // 5 seconds
      retentionPeriod: 3600000, // 1 hour
      enableRealTime: true,
      enableAggregation: true,
      aggregationWindow: 60000, // 1 minute
      ...config
    };

    this.logger = new Logger('MetricsCollector');
    this.agentId = '';
  }

  /**
   * Start metrics collection for an agent
   */
  async start(agentId: string): Promise<void> {
    try {
      this.agentId = agentId;
      this.logger.info(`Starting metrics collection for agent: ${agentId}`);

      if (this.config.enableRealTime) {
        this.startRealTimeCollection();
      }

      this.isCollecting = true;
      this.logger.info('Metrics collection started successfully');
    } catch (error) {
      this.logger.error('Failed to start metrics collection', error);
      throw error;
    }
  }

  /**
   * Stop metrics collection
   */
  async stop(): Promise<void> {
    try {
      this.logger.info('Stopping metrics collection');

      if (this.collectionInterval) {
        clearInterval(this.collectionInterval);
        this.collectionInterval = undefined;
      }

      this.isCollecting = false;
      this.logger.info('Metrics collection stopped successfully');
    } catch (error) {
      this.logger.error('Failed to stop metrics collection', error);
      throw error;
    }
  }

  /**
   * Record a metric value
   */
  recordMetric(metricName: string, value: number, metadata?: any): void {
    if (!this.isCollecting) {
      return;
    }

    const metricData: MetricData = {
      timestamp: new Date(),
      value,
      metadata
    };

    if (!this.metrics.has(metricName)) {
      this.metrics.set(metricName, []);
    }

    const metricArray = this.metrics.get(metricName)!;
    metricArray.push(metricData);

    // Maintain retention period
    this.cleanupOldMetrics(metricName);

    this.logger.debug(`Recorded metric: ${metricName} = ${value}`);
  }

  /**
   * Record multiple metrics at once
   */
  recordMetrics(metrics: Record<string, number>, metadata?: any): void {
    Object.entries(metrics).forEach(([name, value]) => {
      this.recordMetric(name, value, metadata);
    });
  }

  /**
   * Record resource metrics
   */
  recordResourceMetrics(): void {
    try {
      const resourceMetrics = this.getCurrentResourceMetrics();

      this.recordMetric('memory_used', resourceMetrics.memory.used);
      this.recordMetric('memory_percentage', resourceMetrics.memory.percentage);
      this.recordMetric('cpu_usage', resourceMetrics.cpu.usage);
      this.recordMetric('disk_used', resourceMetrics.disk.used);
      this.recordMetric('disk_percentage', resourceMetrics.disk.percentage);
      this.recordMetric('network_bytes_in', resourceMetrics.network.bytesIn);
      this.recordMetric('network_bytes_out', resourceMetrics.network.bytesOut);
    } catch (error) {
      this.logger.error('Failed to record resource metrics', error);
    }
  }

  /**
   * Record performance metrics
   */
  recordPerformanceMetrics(metrics: Partial<PerformanceMetrics>): void {
    if (metrics.responseTime !== undefined) {
      this.recordMetric('response_time', metrics.responseTime);
    }
    if (metrics.throughput !== undefined) {
      this.recordMetric('throughput', metrics.throughput);
    }
    if (metrics.errorRate !== undefined) {
      this.recordMetric('error_rate', metrics.errorRate);
    }
    if (metrics.successRate !== undefined) {
      this.recordMetric('success_rate', metrics.successRate);
    }
    if (metrics.activeConnections !== undefined) {
      this.recordMetric('active_connections', metrics.activeConnections);
    }
  }

  /**
   * Get metric data for a specific metric
   */
  getMetric(metricName: string, timeRange?: { start: Date; end: Date }): MetricData[] {
    const metricData = this.metrics.get(metricName) || [];

    if (!timeRange) {
      return [...metricData];
    }

    return metricData.filter(data => data.timestamp >= timeRange.start && data.timestamp <= timeRange.end);
  }

  /**
   * Get aggregated metrics
   */
  getAggregatedMetrics(metricName: string, aggregationType: 'avg' | 'sum' | 'min' | 'max' | 'count'): number {
    const metricData = this.metrics.get(metricName) || [];

    if (metricData.length === 0) {
      return 0;
    }

    const values = metricData.map(data => data.value);

    switch (aggregationType) {
      case 'avg':
        return values.reduce((sum, val) => sum + val, 0) / values.length;
      case 'sum':
        return values.reduce((sum, val) => sum + val, 0);
      case 'min':
        return Math.min(...values);
      case 'max':
        return Math.max(...values);
      case 'count':
        return values.length;
      default:
        return 0;
    }
  }

  /**
   * Get all metrics summary
   */
  getMetricsSummary(): Record<string, any> {
    const summary: Record<string, any> = {};

    for (const [metricName, metricData] of this.metrics.entries()) {
      if (metricData.length > 0) {
        const values = metricData.map(data => data.value);
        summary[metricName] = {
          count: values.length,
          average: values.reduce((sum, val) => sum + val, 0) / values.length,
          min: Math.min(...values),
          max: Math.max(...values),
          latest: values[values.length - 1],
          lastUpdated: metricData[metricData.length - 1].timestamp
        };
      }
    }

    return summary;
  }

  /**
   * Get current resource metrics
   */
  getCurrentResourceMetrics(): ResourceMetrics {
    const memUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();

    return {
      memory: {
        used: memUsage.heapUsed,
        total: memUsage.heapTotal,
        percentage: (memUsage.heapUsed / memUsage.heapTotal) * 100
      },
      cpu: {
        usage: (cpuUsage.user + cpuUsage.system) / 1000000, // Convert to seconds
        load: process.platform === 'win32' ? [0, 0, 0] : require('os').loadavg()
      },
      disk: {
        used: 0, // TODO: Implement disk usage monitoring
        total: 0,
        percentage: 0
      },
      network: {
        bytesIn: 0, // TODO: Implement network monitoring
        bytesOut: 0,
        packetsIn: 0,
        packetsOut: 0
      }
    };
  }

  /**
   * Export metrics data
   */
  exportMetrics(format: 'json' | 'csv' = 'json'): string {
    const allMetrics: Record<string, MetricData[]> = {};

    for (const [name, data] of this.metrics.entries()) {
      allMetrics[name] = data;
    }

    if (format === 'json') {
      return JSON.stringify(allMetrics, null, 2);
    } else {
      // CSV format
      const csvLines = ['metric_name,timestamp,value,metadata'];

      for (const [name, data] of this.metrics.entries()) {
        data.forEach(metric => {
          csvLines.push(
            `${name},${metric.timestamp.toISOString()},${metric.value},"${JSON.stringify(metric.metadata || {})}"`
          );
        });
      }

      return csvLines.join('\n');
    }
  }

  /**
   * Clear all metrics
   */
  clearMetrics(): void {
    this.metrics.clear();
    this.logger.info('All metrics cleared');
  }

  /**
   * Clear metrics for a specific metric name
   */
  clearMetric(metricName: string): void {
    this.metrics.delete(metricName);
    this.logger.info(`Cleared metrics for: ${metricName}`);
  }

  /**
   * Start real-time collection
   */
  private startRealTimeCollection(): void {
    this.collectionInterval = setInterval(() => {
      try {
        this.recordResourceMetrics();
      } catch (error) {
        this.logger.error('Error in real-time metrics collection', error);
      }
    }, this.config.collectionInterval);
  }

  /**
   * Cleanup old metrics based on retention period
   */
  private cleanupOldMetrics(metricName: string): void {
    const metricData = this.metrics.get(metricName);
    if (!metricData) {
      return;
    }

    const cutoffTime = new Date(Date.now() - this.config.retentionPeriod);
    const filteredData = metricData.filter(data => data.timestamp > cutoffTime);

    this.metrics.set(metricName, filteredData);
  }

  /**
   * Get configuration
   */
  getConfig(): MetricConfig {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<MetricConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.logger.info('Metrics configuration updated');
  }
}
