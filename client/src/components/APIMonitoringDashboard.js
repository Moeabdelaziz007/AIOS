/**
 * API Monitoring Dashboard Component
 * Real-time monitoring of Gemini API usage, rate limits, caching, and analytics
 */

import {
  Activity,
  AlertTriangle,
  Database,
  RefreshCw,
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
import { Progress } from '../components/ui/progress';

const APIMonitoringDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [rateLimitStatus, setRateLimitStatus] = useState(null);
  const [cacheStats, setCacheStats] = useState(null);
  const [healthStatus, setHealthStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Refresh data every 30 seconds
  useEffect(() => {
    const refreshData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Import services dynamically to avoid circular dependencies
        const { default: geminiAPIService } = await import(
          '../services/GeminiAPIService'
        );

        const [analyticsData, rateLimitData, cacheData, healthData] =
          await Promise.all([
            geminiAPIService.getAnalytics(),
            geminiAPIService.getRateLimitStatus(),
            geminiAPIService.getCacheStats(),
            geminiAPIService.healthCheck(),
          ]);

        setAnalytics(analyticsData);
        setRateLimitStatus(rateLimitData);
        setCacheStats(cacheData);
        setHealthStatus(healthData);
      } catch (err) {
        console.error('Failed to fetch API monitoring data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    refreshData();
    const interval = setInterval(refreshData, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleClearCache = async () => {
    try {
      const { default: geminiAPIService } = await import(
        '../services/GeminiAPIService'
      );
      geminiAPIService.clearCache();
      // Refresh cache stats
      const cacheData = geminiAPIService.getCacheStats();
      setCacheStats(cacheData);
    } catch (err) {
      console.error('Failed to clear cache:', err);
    }
  };

  const handleResetAnalytics = async () => {
    try {
      const { default: geminiAPIService } = await import(
        '../services/GeminiAPIService'
      );
      geminiAPIService.resetAnalytics();
      // Refresh analytics
      const analyticsData = geminiAPIService.getAnalytics();
      setAnalytics(analyticsData);
    } catch (err) {
      console.error('Failed to reset analytics:', err);
    }
  };

  const getStatusColor = status => {
    switch (status) {
      case 'healthy':
        return 'bg-green-500';
      case 'unhealthy':
        return 'bg-red-500';
      case 'not_initialized':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getRateLimitColor = (used, limit) => {
    const percentage = (used / limit) * 100;
    if (percentage >= 90) return 'text-red-500';
    if (percentage >= 70) return 'text-yellow-500';
    return 'text-green-500';
  };

  if (loading && !analytics) {
    return (
      <div className='flex items-center justify-center p-8'>
        <RefreshCw className='h-8 w-8 animate-spin' />
        <span className='ml-2'>Loading API monitoring data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant='destructive'>
        <AlertTriangle className='h-4 w-4' />
        <AlertDescription>
          Failed to load API monitoring data: {error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold'>API Monitoring Dashboard</h2>
          <p className='text-gray-600'>
            Real-time Gemini API usage and performance metrics
          </p>
        </div>
        <div className='flex space-x-2'>
          <Button onClick={handleClearCache} variant='outline' size='sm'>
            <Database className='h-4 w-4 mr-2' />
            Clear Cache
          </Button>
          <Button onClick={handleResetAnalytics} variant='outline' size='sm'>
            <Activity className='h-4 w-4 mr-2' />
            Reset Analytics
          </Button>
        </div>
      </div>

      {/* Health Status */}
      {healthStatus && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <div
                className={`w-3 h-3 rounded-full mr-2 ${getStatusColor(
                  healthStatus.status
                )}`}
              />
              Service Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex items-center justify-between'>
              <div>
                <p className='font-medium'>{healthStatus.message}</p>
                <p className='text-sm text-gray-600'>
                  Last checked:{' '}
                  {new Date(healthStatus.timestamp).toLocaleTimeString()}
                </p>
              </div>
              <Badge
                variant={
                  healthStatus.status === 'healthy' ? 'default' : 'destructive'
                }
              >
                {healthStatus.status.toUpperCase()}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analytics Overview */}
      {analytics && (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium flex items-center'>
                <Activity className='h-4 w-4 mr-2' />
                Total Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {analytics.totalRequests}
              </div>
              <p className='text-xs text-gray-600'>
                {analytics.successfulRequests} successful,{' '}
                {analytics.failedRequests} failed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium flex items-center'>
                <Zap className='h-4 w-4 mr-2' />
                Cache Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {analytics.cacheHits + analytics.cacheMisses > 0
                  ? Math.round(
                      (analytics.cacheHits /
                        (analytics.cacheHits + analytics.cacheMisses)) *
                        100
                    )
                  : 0}
                %
              </div>
              <p className='text-xs text-gray-600'>
                {analytics.cacheHits} hits, {analytics.cacheMisses} misses
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium'>
                Response Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {Math.round(analytics.averageResponseTime)}ms
              </div>
              <p className='text-xs text-gray-600'>Average response time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium'>
                Rate Limit Hits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-red-500'>
                {analytics.rateLimitHits}
              </div>
              <p className='text-xs text-gray-600'>
                Requests blocked by rate limits
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Rate Limiting Status */}
      {rateLimitStatus && (
        <Card>
          <CardHeader>
            <CardTitle>Rate Limiting Status</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            {Object.entries(rateLimitStatus).map(([period, data]) => (
              <div key={period} className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <span className='font-medium capitalize'>{period}</span>
                  <span
                    className={`text-sm font-medium ${getRateLimitColor(
                      data.used,
                      data.limit
                    )}`}
                  >
                    {data.used} / {data.limit}
                  </span>
                </div>
                <Progress
                  value={(data.used / data.limit) * 100}
                  className='h-2'
                />
                <p className='text-xs text-gray-600'>
                  {data.remaining} requests remaining
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Cache Statistics */}
      {cacheStats && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <Database className='h-5 w-5 mr-2' />
              Cache Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div>
                <p className='text-sm font-medium'>Status</p>
                <Badge variant={cacheStats.enabled ? 'default' : 'secondary'}>
                  {cacheStats.enabled ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
              <div>
                <p className='text-sm font-medium'>Cache Size</p>
                <p className='text-lg font-bold'>
                  {cacheStats.size} / {cacheStats.maxSize}
                </p>
              </div>
              <div>
                <p className='text-sm font-medium'>Hit Rate</p>
                <p className='text-lg font-bold'>
                  {Math.round(cacheStats.hitRate * 100)}%
                </p>
              </div>
            </div>
            <div className='mt-4'>
              <p className='text-sm font-medium'>TTL</p>
              <p className='text-sm text-gray-600'>{cacheStats.ttl} seconds</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Types */}
      {analytics &&
        analytics.errorTypes &&
        Object.keys(analytics.errorTypes).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <AlertTriangle className='h-5 w-5 mr-2' />
                Error Types
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-2'>
                {Object.entries(analytics.errorTypes).map(
                  ([errorType, count]) => (
                    <div
                      key={errorType}
                      className='flex items-center justify-between'
                    >
                      <span className='text-sm font-medium'>{errorType}</span>
                      <Badge variant='destructive'>{count}</Badge>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        )}
    </div>
  );
};

export default APIMonitoringDashboard;
