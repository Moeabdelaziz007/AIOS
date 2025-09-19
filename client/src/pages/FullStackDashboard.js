import {
  Analytics,
  Apps,
  CheckCircle,
  CloudSync,
  Dashboard as DashboardIcon,
  Error,
  Memory,
  MonitorHeart,
  NetworkCheck,
  Notifications,
  People,
  Refresh,
  Settings,
  Speed,
  Storage,
  TrendingUp,
  Warning
} from '@mui/icons-material';
import {
  Alert,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography
} from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';

const FullStackDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    overview: null,
    analytics: null,
    metrics: null,
    alerts: [],
    logs: [],
    health: null,
    dataAgent: null,
    performance: null,
    users: null,
    apps: null
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wsConnected, setWsConnected] = useState(false);
  const [ws, setWs] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [metricDialogOpen, setMetricDialogOpen] = useState(false);

  // WebSocket connection
  useEffect(() => {
    const connectWebSocket = () => {
      try {
        const websocket = new WebSocket('ws://localhost:3001');

        websocket.onopen = () => {
          console.log('📡 Connected to dashboard WebSocket');
          setWsConnected(true);
          setWs(websocket);
        };

        websocket.onmessage = event => {
          try {
            const message = JSON.parse(event.data);
            handleWebSocketMessage(message);
          } catch (err) {
            console.error('Error parsing WebSocket message:', err);
          }
        };

        websocket.onclose = () => {
          console.log('📡 WebSocket disconnected');
          setWsConnected(false);
          setWs(null);
          // Attempt to reconnect after 5 seconds
          setTimeout(connectWebSocket, 5000);
        };

        websocket.onerror = error => {
          console.error('WebSocket error:', error);
          setWsConnected(false);
        };
      } catch (error) {
        console.error('Failed to connect to WebSocket:', error);
        setWsConnected(false);
      }
    };

    connectWebSocket();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  const handleWebSocketMessage = useCallback(message => {
    switch (message.type) {
      case 'initial_data':
        setDashboardData(message.data);
        setLoading(false);
        break;
      case 'overview':
        setDashboardData(prev => ({ ...prev, overview: message.data }));
        break;
      case 'metrics':
        setDashboardData(prev => ({ ...prev, metrics: message.data }));
        break;
      case 'alert':
        setDashboardData(prev => ({
          ...prev,
          alerts: [...message.data, ...prev.alerts].slice(0, 20)
        }));
        break;
      case 'log':
        setDashboardData(prev => ({
          ...prev,
          logs: [...prev.logs, message.data].slice(-100)
        }));
        break;
      default:
        console.log('Unknown message type:', message.type);
    }
  }, []);

  // Fetch initial data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const endpoints = [
          'overview',
          'analytics',
          'metrics',
          'alerts',
          'logs',
          'health',
          'data-agent',
          'performance',
          'users',
          'apps'
        ];

        const promises = endpoints.map(endpoint =>
          fetch(`http://localhost:3001/api/dashboard/${endpoint}`)
            .then(res => res.json())
            .then(data => ({ endpoint, data }))
            .catch(err => ({ endpoint, error: err.message }))
        );

        const results = await Promise.all(promises);

        const newData = {};
        results.forEach(({ endpoint, data, error }) => {
          if (error) {
            console.error(`Error fetching ${endpoint}:`, error);
          } else {
            newData[endpoint.replace('-', '')] = data.data;
          }
        });

        setDashboardData(prev => ({ ...prev, ...newData }));
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Dashboard data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleMetricClick = metric => {
    setSelectedMetric(metric);
    setMetricDialogOpen(true);
  };

  const getHealthColor = status => {
    switch (status) {
      case 'excellent':
        return 'success';
      case 'good':
        return 'info';
      case 'fair':
        return 'warning';
      case 'poor':
        return 'error';
      default:
        return 'default';
    }
  };

  const getAlertColor = type => {
    switch (type) {
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'default';
    }
  };

  const getLogColor = level => {
    switch (level) {
      case 'error':
        return 'error';
      case 'warn':
        return 'warning';
      case 'info':
        return 'info';
      case 'debug':
        return 'default';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' minHeight='100vh'>
        <Box textAlign='center'>
          <CircularProgress size={60} />
          <Typography variant='h6' sx={{ mt: 2 }}>
            Loading Full-Stack Dashboard...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity='error' sx={{ mb: 2 }}>
          Error loading dashboard: {error}
        </Alert>
        <Button variant='contained' onClick={handleRefresh}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <Box display='flex' justifyContent='space-between' alignItems='center' mb={3}>
        <Box display='flex' alignItems='center'>
          <DashboardIcon sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
          <Typography variant='h4' component='h1'>
            AIOS Full-Stack Dashboard
          </Typography>
        </Box>
        <Box display='flex' alignItems='center' gap={2}>
          <Chip
            icon={wsConnected ? <CheckCircle /> : <Error />}
            label={wsConnected ? 'Connected' : 'Disconnected'}
            color={wsConnected ? 'success' : 'error'}
            variant='outlined'
          />
          <Tooltip title='Refresh Dashboard'>
            <IconButton onClick={handleRefresh} color='primary'>
              <Refresh />
            </IconButton>
          </Tooltip>
          <Tooltip title='Settings'>
            <IconButton color='primary'>
              <Settings />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* System Overview Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display='flex' alignItems='center' mb={2}>
                <Apps color='primary' sx={{ mr: 1 }} />
                <Typography variant='h6'>Total Apps</Typography>
              </Box>
              <Typography variant='h3' color='primary'>
                {dashboardData.overview?.totalApps || 0}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Active: {dashboardData.overview?.activeApps || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display='flex' alignItems='center' mb={2}>
                <People color='primary' sx={{ mr: 1 }} />
                <Typography variant='h6'>Total Users</Typography>
              </Box>
              <Typography variant='h3' color='primary'>
                {dashboardData.overview?.totalUsers || 0}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Growth: +12%
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display='flex' alignItems='center' mb={2}>
                <MonitorHeart color='primary' sx={{ mr: 1 }} />
                <Typography variant='h6'>System Health</Typography>
              </Box>
              <Typography variant='h3' color={getHealthColor(dashboardData.health?.status)}>
                {dashboardData.health?.score || 0}%
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Status: {dashboardData.health?.status || 'Unknown'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display='flex' alignItems='center' mb={2}>
                <CloudSync color='primary' sx={{ mr: 1 }} />
                <Typography variant='h6'>Uptime</Typography>
              </Box>
              <Typography variant='h3' color='success.main'>
                {dashboardData.overview?.systemUptime || '99.9%'}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Last 30 days
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Real-time Metrics */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                Real-time System Metrics
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box textAlign='center' onClick={() => handleMetricClick('cpu')} sx={{ cursor: 'pointer' }}>
                    <Speed color='primary' sx={{ fontSize: 40 }} />
                    <Typography variant='h4' color='primary'>
                      {dashboardData.metrics?.cpu || 0}%
                    </Typography>
                    <Typography variant='body2'>CPU Usage</Typography>
                    <LinearProgress variant='determinate' value={dashboardData.metrics?.cpu || 0} sx={{ mt: 1 }} />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign='center' onClick={() => handleMetricClick('memory')} sx={{ cursor: 'pointer' }}>
                    <Memory color='primary' sx={{ fontSize: 40 }} />
                    <Typography variant='h4' color='primary'>
                      {dashboardData.metrics?.memory || 0}%
                    </Typography>
                    <Typography variant='body2'>Memory Usage</Typography>
                    <LinearProgress variant='determinate' value={dashboardData.metrics?.memory || 0} sx={{ mt: 1 }} />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign='center' onClick={() => handleMetricClick('network')} sx={{ cursor: 'pointer' }}>
                    <NetworkCheck color='primary' sx={{ fontSize: 40 }} />
                    <Typography variant='h4' color='primary'>
                      {dashboardData.metrics?.network || 0}%
                    </Typography>
                    <Typography variant='body2'>Network</Typography>
                    <LinearProgress variant='determinate' value={dashboardData.metrics?.network || 0} sx={{ mt: 1 }} />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign='center' onClick={() => handleMetricClick('storage')} sx={{ cursor: 'pointer' }}>
                    <Storage color='primary' sx={{ fontSize: 40 }} />
                    <Typography variant='h4' color='primary'>
                      {dashboardData.metrics?.storage || 0}%
                    </Typography>
                    <Typography variant='body2'>Storage</Typography>
                    <LinearProgress variant='determinate' value={dashboardData.metrics?.storage || 0} sx={{ mt: 1 }} />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                Performance Metrics
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Speed color='primary' />
                  </ListItemIcon>
                  <ListItemText
                    primary='Response Time'
                    secondary={`${dashboardData.performance?.responseTime || 0}ms`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <TrendingUp color='success' />
                  </ListItemIcon>
                  <ListItemText
                    primary='Throughput'
                    secondary={`${dashboardData.performance?.throughput || 0} req/min`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Error color='error' />
                  </ListItemIcon>
                  <ListItemText
                    primary='Error Rate'
                    secondary={`${((dashboardData.performance?.errorRate || 0) * 100).toFixed(2)}%`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color='success' />
                  </ListItemIcon>
                  <ListItemText primary='Uptime' secondary={dashboardData.performance?.uptime || '99.9%'} />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Alerts and Logs */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display='flex' alignItems='center' mb={2}>
                <Notifications color='primary' sx={{ mr: 1 }} />
                <Typography variant='h6'>Recent Alerts</Typography>
                <Badge badgeContent={dashboardData.alerts?.length || 0} color='error' sx={{ ml: 2 }}>
                  <Warning />
                </Badge>
              </Box>
              {dashboardData.alerts?.length > 0 ? (
                <List dense>
                  {dashboardData.alerts.slice(0, 5).map((alert, index) => (
                    <React.Fragment key={alert.id || index}>
                      <ListItem>
                        <ListItemIcon>
                          <Warning color={getAlertColor(alert.type)} />
                        </ListItemIcon>
                        <ListItemText primary={alert.title} secondary={alert.message} />
                        <Chip label={alert.type} color={getAlertColor(alert.type)} size='small' />
                      </ListItem>
                      {index < dashboardData.alerts.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography variant='body2' color='text.secondary'>
                  No recent alerts
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                Recent Logs
              </Typography>
              {dashboardData.logs?.length > 0 ? (
                <List dense>
                  {dashboardData.logs.slice(-5).map((log, index) => (
                    <React.Fragment key={log.id || index}>
                      <ListItem>
                        <ListItemIcon>
                          <Chip label={log.level} color={getLogColor(log.level)} size='small' />
                        </ListItemIcon>
                        <ListItemText primary={log.message} secondary={new Date(log.timestamp).toLocaleString()} />
                      </ListItem>
                      {index < dashboardData.logs.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography variant='body2' color='text.secondary'>
                  No recent logs
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Data Agent Status */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                Data Agent Status
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color='success' />
                  </ListItemIcon>
                  <ListItemText primary='Status' secondary={dashboardData.dataAgent?.status || 'Unknown'} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Memory color='primary' />
                  </ListItemIcon>
                  <ListItemText
                    primary='Cache Entries'
                    secondary={dashboardData.dataAgent?.cacheStats?.totalEntries || 0}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Analytics color='primary' />
                  </ListItemIcon>
                  <ListItemText
                    primary='Cache Hit Rate'
                    secondary={`${((dashboardData.dataAgent?.cacheStats?.hitRate || 0) * 100).toFixed(1)}%`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Apps color='primary' />
                  </ListItemIcon>
                  <ListItemText
                    primary='Active Processors'
                    secondary={dashboardData.dataAgent?.processors?.join(', ') || 'None'}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                App Categories
              </Typography>
              {dashboardData.apps?.categories ? (
                <Grid container spacing={2}>
                  {Object.entries(dashboardData.apps.categories).map(([category, count]) => (
                    <Grid item xs={6} key={category}>
                      <Box textAlign='center'>
                        <Typography variant='h4' color='primary'>
                          {count}
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography variant='body2' color='text.secondary'>
                  No category data available
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Metric Detail Dialog */}
      <Dialog open={metricDialogOpen} onClose={() => setMetricDialogOpen(false)} maxWidth='sm' fullWidth>
        <DialogTitle>{selectedMetric ? `${selectedMetric.toUpperCase()} Details` : 'Metric Details'}</DialogTitle>
        <DialogContent>
          {selectedMetric && dashboardData.metrics && (
            <Box>
              <Typography variant='h4' color='primary' gutterBottom>
                {dashboardData.metrics[selectedMetric]}%
              </Typography>
              <Typography variant='body1' paragraph>
                Current {selectedMetric} usage is at {dashboardData.metrics[selectedMetric]}%.
              </Typography>
              <LinearProgress variant='determinate' value={dashboardData.metrics[selectedMetric]} sx={{ mb: 2 }} />
              <Typography variant='body2' color='text.secondary'>
                Last updated: {new Date(dashboardData.metrics.lastUpdate).toLocaleString()}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMetricDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FullStackDashboard;
