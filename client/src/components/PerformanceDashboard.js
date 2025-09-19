/**
 * Performance Dashboard Component
 * Real-time performance monitoring and analytics dashboard
 */

import {
  Activity,
  AlertTriangle,
  BarChart3,
  Clock,
  Cpu,
  HardDrive,
  RefreshCw,
  TrendingUp,
  Zap,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';

const PerformanceDashboard = () => {
  const [performanceStats, setPerformanceStats] = useState(null);
  const [recentMetrics, setRecentMetrics] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('1h'); // 1 hour default

  // Refresh data every 10 seconds
  useEffect(() => {
    const refreshData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Import performance monitoring system dynamically
        const { default: performanceMonitoring } = await import(
          '../services/PerformanceMonitoringSystem'
        );

        const [stats, metrics, alertsData] = await Promise.all([
          performanceMonitoring.getStats(),
          performanceMonitoring.getRecentMetrics(),
          performanceMonitoring.getMetrics(
            'execution_time',
            getTimeRangeMs(timeRange)
          ),
        ]);

        setPerformanceStats(stats);
        setRecentMetrics(metrics);
        setAlerts(alertsData);
      } catch (err) {
        console.error('Failed to fetch performance data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    refreshData();
    const interval = setInterval(refreshData, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, [timeRange]);

  const getTimeRangeMs = range => {
    switch (range) {
      case '5m':
        return 5 * 60 * 1000;
      case '1h':
        return 60 * 60 * 1000;
      case '6h':
        return 6 * 60 * 60 * 1000;
      case '24h':
        return 24 * 60 * 60 * 1000;
      default:
        return 60 * 60 * 1000;
    }
  };

  const getSeverityColor = severity => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatBytes = bytes => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = ms => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const getPerformanceTrend = (current, previous) => {
    if (!previous) return 'stable';
    const change = ((current - previous) / previous) * 100;
    if (change > 5) return 'up';
    if (change < -5) return 'down';
    return 'stable';
  };

  if (loading && !performanceStats) {
    return (
      <div className='flex items-center justify-center p-8'>
        <RefreshCw className='h-8 w-8 animate-spin' />
        <span className='ml-2'>Loading performance data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant='destructive'>
        <AlertTriangle className='h-4 w-4' />
        <AlertDescription>
          Failed to load performance data: {error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold'>Performance Dashboard</h2>
          <p className='text-gray-600'>
            Real-time system performance monitoring and analytics
          </p>
        </div>
        <div className='flex items-center space-x-2'>
          <select
            value={timeRange}
            onChange={e => setTimeRange(e.target.value)}
            className='px-3 py-1 border rounded-md text-sm'
          >
            <option value='5m'>Last 5 minutes</option>
            <option value='1h'>Last hour</option>
            <option value='6h'>Last 6 hours</option>
            <option value='24h'>Last 24 hours</option>
          </select>
          <Button
            onClick={() => window.location.reload()}
            variant='outline'
            size='sm'
          >
            <RefreshCw className='h-4 w-4 mr-2' />
            Refresh
          </Button>
        </div>
      </div>

      {/* Performance Overview Cards */}
      {performanceStats && (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium flex items-center'>
                <Clock className='h-4 w-4 mr-2' />
                Response Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {formatDuration(performanceStats.averageResponseTime)}
              </div>
              <p className='text-xs text-gray-600'>
                P95: {formatDuration(performanceStats.p95ResponseTime)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium flex items-center'>
                <Activity className='h-4 w-4 mr-2' />
                Throughput
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {performanceStats.totalRequests}
              </div>
              <p className='text-xs text-gray-600'>Total requests</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium flex items-center'>
                <HardDrive className='h-4 w-4 mr-2' />
                Memory Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {formatBytes(performanceStats.memoryPeak)}
              </div>
              <p className='text-xs text-gray-600'>Peak usage</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium flex items-center'>
                <Zap className='h-4 w-4 mr-2' />
                Cache Hit Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {Math.round(performanceStats.cacheHitRate * 100)}%
              </div>
              <p className='text-xs text-gray-600'>Cache performance</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Performance Charts */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Response Time Chart */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <BarChart3 className='h-5 w-5 mr-2' />
              Response Time Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='h-64 flex items-center justify-center text-gray-500'>
              <div className='text-center'>
                <BarChart3 className='h-12 w-12 mx-auto mb-2' />
                <p>Response time chart would be rendered here</p>
                <p className='text-sm'>
                  Integration with charting library needed
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Memory Usage Chart */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <Cpu className='h-5 w-5 mr-2' />
              Memory Usage Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='h-64 flex items-center justify-center text-gray-500'>
              <div className='text-center'>
                <Cpu className='h-12 w-12 mx-auto mb-2' />
                <p>Memory usage chart would be rendered here</p>
                <p className='text-sm'>
                  Integration with charting library needed
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center'>
            <Activity className='h-5 w-5 mr-2' />
            Recent Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-2'>
            {recentMetrics.slice(0, 10).map((metric, index) => (
              <div
                key={index}
                className='flex items-center justify-between p-2 bg-gray-50 rounded'
              >
                <div className='flex items-center space-x-2'>
                  <div
                    className={`w-2 h-2 rounded-full ${
                      metric.name === 'execution_error'
                        ? 'bg-red-500'
                        : 'bg-green-500'
                    }`}
                  />
                  <span className='text-sm font-medium'>{metric.name}</span>
                </div>
                <div className='text-sm text-gray-600'>
                  {metric.name.includes('time')
                    ? formatDuration(metric.value)
                    : metric.value}
                </div>
                <div className='text-xs text-gray-500'>
                  {new Date(metric.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Alerts */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <AlertTriangle className='h-5 w-5 mr-2' />
              Performance Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-2'>
              {alerts.slice(0, 5).map((alert, index) => (
                <Alert
                  key={index}
                  variant={
                    alert.severity === 'critical' ? 'destructive' : 'default'
                  }
                >
                  <div
                    className={`w-2 h-2 rounded-full mr-2 ${getSeverityColor(
                      alert.severity
                    )}`}
                  />
                  <AlertDescription>
                    <div className='flex items-center justify-between'>
                      <div>
                        <span className='font-medium'>{alert.metric}</span>
                        <span className='ml-2 text-sm'>
                          Value: {alert.value} (Threshold: {alert.threshold})
                        </span>
                      </div>
                      <Badge
                        variant={
                          alert.severity === 'critical'
                            ? 'destructive'
                            : 'secondary'
                        }
                      >
                        {alert.severity}
                      </Badge>
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Recommendations */}
      {performanceStats && performanceStats.recommendations && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <TrendingUp className='h-5 w-5 mr-2' />
              Performance Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-2'>
              {performanceStats.recommendations.map((rec, index) => (
                <div key={index} className='p-3 bg-blue-50 rounded-lg'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='font-medium text-blue-900'>{rec.message}</p>
                      <p className='text-sm text-blue-700'>
                        {rec.type} • Priority: {rec.priority}
                      </p>
                    </div>
                    <Badge variant='outline'>{rec.priority}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PerformanceDashboard;
