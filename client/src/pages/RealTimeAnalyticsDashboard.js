import {
  Analytics,
  Apps,
  Assessment,
  CheckCircle,
  Error,
  Memory,
  MonitorHeart,
  NetworkCheck,
  People,
  Refresh,
  Speed,
  Storage,
  Timeline,
  TrendingDown,
  TrendingUp
} from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  FormControlLabel,
  Grid,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  Tab,
  Tabs,
  Tooltip,
  Typography
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';

const RealTimeAnalyticsDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [realTimeData, setRealTimeData] = useState({
    metrics: {},
    trends: {},
    alerts: [],
    performance: {},
    users: {},
    apps: {}
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wsConnected, setWsConnected] = useState(false);
  const [ws, setWs] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5000);
  const intervalRef = useRef(null);

  // WebSocket connection for real-time data
  useEffect(() => {
    const connectWebSocket = () => {
      try {
        const websocket = new WebSocket('ws://localhost:3001');

        websocket.onopen = () => {
          console.log('📊 Connected to analytics WebSocket');
          setWsConnected(true);
          setWs(websocket);
        };

        websocket.onmessage = event => {
          try {
            const message = JSON.parse(event.data);
            handleWebSocketMessage(message);
          } catch (err) {
            console.error('Error parsing analytics WebSocket message:', err);
          }
        };

        websocket.onclose = () => {
          console.log('📊 Analytics WebSocket disconnected');
          setWsConnected(false);
          setWs(null);
          // Attempt to reconnect after 5 seconds
          setTimeout(connectWebSocket, 5000);
        };

        websocket.onerror = error => {
          console.error('Analytics WebSocket error:', error);
          setWsConnected(false);
        };
      } catch (error) {
        console.error('Failed to connect to analytics WebSocket:', error);
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

  const handleWebSocketMessage = message => {
    switch (message.type) {
      case 'initial_data':
        setRealTimeData(message.data);
        setLoading(false);
        break;
      case 'metrics':
        setRealTimeData(prev => ({ ...prev, metrics: message.data }));
        break;
      case 'overview':
        setRealTimeData(prev => ({ ...prev, overview: message.data }));
        break;
      case 'alert':
        setRealTimeData(prev => ({
          ...prev,
          alerts: [...message.data, ...prev.alerts].slice(0, 50)
        }));
        break;
      case 'log':
        setRealTimeData(prev => ({
          ...prev,
          logs: [...prev.logs, message.data].slice(-200)
        }));
        break;
      default:
        console.log('Unknown analytics message type:', message.type);
    }
  };

  // Auto-refresh functionality
  useEffect(() => {
    if (autoRefresh) {
      intervalRef.current = setInterval(() => {
        fetchAnalyticsData();
      }, refreshInterval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoRefresh, refreshInterval]);

  const fetchAnalyticsData = async () => {
    try {
      const endpoints = ['analytics', 'metrics', 'performance', 'users', 'apps', 'health'];

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
          newData[endpoint] = data.data;
        }
      });

      setRealTimeData(prev => ({ ...prev, ...newData }));
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Analytics data fetch error:', err);
    }
  };

  const handleRefresh = () => {
    fetchAnalyticsData();
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getTrendIcon = trend => {
    if (trend > 0) return <TrendingUp color='success' />;
    if (trend < 0) return <TrendingDown color='error' />;
    return <Timeline color='info' />;
  };

  const getTrendColor = trend => {
    if (trend > 0) return 'success';
    if (trend < 0) return 'error';
    return 'info';
  };

  const formatNumber = num => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatPercentage = num => {
    return `${num.toFixed(1)}%`;
  };

  const MetricCard = ({ title, value, trend, icon, color = 'primary', subtitle }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display='flex' alignItems='center' justifyContent='space-between' mb={2}>
          <Box display='flex' alignItems='center'>
            {icon}
            <Typography variant='h6' sx={{ ml: 1 }}>
              {title}
            </Typography>
          </Box>
          {trend !== undefined && (
            <Chip
              icon={getTrendIcon(trend)}
              label={`${trend > 0 ? '+' : ''}${trend.toFixed(1)}%`}
              color={getTrendColor(trend)}
              size='small'
            />
          )}
        </Box>
        <Typography variant='h3' color={`${color}.main`}>
          {value}
        </Typography>
        {subtitle && (
          <Typography variant='body2' color='text.secondary'>
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  const PerformanceChart = ({ data, title }) => (
    <Card>
      <CardContent>
        <Typography variant='h6' gutterBottom>
          {title}
        </Typography>
        <Box sx={{ height: 200, display: 'flex', alignItems: 'end', gap: 1 }}>
          {data.map((value, index) => (
            <Box
              key={index}
              sx={{
                flex: 1,
                height: `${value}%`,
                bgcolor: 'primary.main',
                borderRadius: '4px 4px 0 0',
                minHeight: '20px',
                display: 'flex',
                alignItems: 'end',
                justifyContent: 'center',
                color: 'white',
                fontSize: '12px',
                fontWeight: 'bold'
              }}
            >
              {value}
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );

  const TabPanel = ({ children, value, index, ...other }) => (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`analytics-tabpanel-${index}`}
      aria-labelledby={`analytics-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );

  if (loading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' minHeight='100vh'>
        <Box textAlign='center'>
          <CircularProgress size={60} />
          <Typography variant='h6' sx={{ mt: 2 }}>
            Loading Real-Time Analytics...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <Box display='flex' justifyContent='space-between' alignItems='center' mb={3}>
        <Box display='flex' alignItems='center'>
          <Analytics sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
          <Typography variant='h4' component='h1'>
            Real-Time Analytics Dashboard
          </Typography>
        </Box>
        <Box display='flex' alignItems='center' gap={2}>
          <FormControlLabel
            control={<Switch checked={autoRefresh} onChange={e => setAutoRefresh(e.target.checked)} color='primary' />}
            label='Auto Refresh'
          />
          <Chip
            icon={wsConnected ? <CheckCircle /> : <Error />}
            label={wsConnected ? 'Live' : 'Offline'}
            color={wsConnected ? 'success' : 'error'}
            variant='outlined'
          />
          <Tooltip title='Refresh Data'>
            <IconButton onClick={handleRefresh} color='primary'>
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label='analytics tabs'>
          <Tab label='Overview' icon={<Assessment />} />
          <Tab label='Performance' icon={<Speed />} />
          <Tab label='Users' icon={<People />} />
          <Tab label='Apps' icon={<Apps />} />
          <Tab label='System' icon={<MonitorHeart />} />
        </Tabs>
      </Box>

      {/* Overview Tab */}
      <TabPanel value={activeTab} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title='Total Users'
              value={formatNumber(realTimeData.users?.totalUsers || 0)}
              trend={12.5}
              icon={<People color='primary' />}
              subtitle='Active: {realTimeData.users?.activeUsers || 0}'
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title='Total Apps'
              value={formatNumber(realTimeData.apps?.totalApps || 0)}
              trend={8.3}
              icon={<Apps color='primary' />}
              subtitle='Active: {realTimeData.apps?.activeApps || 0}'
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title='Response Time'
              value={`${realTimeData.performance?.responseTime || 0}ms`}
              trend={-5.2}
              icon={<Speed color='success' />}
              subtitle='Average'
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title='System Health'
              value={`${realTimeData.health?.score || 0}%`}
              trend={2.1}
              icon={<MonitorHeart color='success' />}
              subtitle={realTimeData.health?.status || 'Unknown'}
            />
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <PerformanceChart data={[65, 72, 68, 75, 82, 78, 85, 90, 88, 92]} title='User Growth Trend' />
          </Grid>
          <Grid item xs={12} md={6}>
            <PerformanceChart data={[45, 52, 48, 55, 62, 58, 65, 70, 68, 72]} title='App Usage Trend' />
          </Grid>
        </Grid>
      </TabPanel>

      {/* Performance Tab */}
      <TabPanel value={activeTab} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant='h6' gutterBottom>
                  System Performance Metrics
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box textAlign='center'>
                      <Speed color='primary' sx={{ fontSize: 40 }} />
                      <Typography variant='h4' color='primary'>
                        {realTimeData.metrics?.cpu || 0}%
                      </Typography>
                      <Typography variant='body2'>CPU Usage</Typography>
                      <LinearProgress variant='determinate' value={realTimeData.metrics?.cpu || 0} sx={{ mt: 1 }} />
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box textAlign='center'>
                      <Memory color='primary' sx={{ fontSize: 40 }} />
                      <Typography variant='h4' color='primary'>
                        {realTimeData.metrics?.memory || 0}%
                      </Typography>
                      <Typography variant='body2'>Memory Usage</Typography>
                      <LinearProgress variant='determinate' value={realTimeData.metrics?.memory || 0} sx={{ mt: 1 }} />
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box textAlign='center'>
                      <NetworkCheck color='primary' sx={{ fontSize: 40 }} />
                      <Typography variant='h4' color='primary'>
                        {realTimeData.metrics?.network || 0}%
                      </Typography>
                      <Typography variant='body2'>Network</Typography>
                      <LinearProgress variant='determinate' value={realTimeData.metrics?.network || 0} sx={{ mt: 1 }} />
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box textAlign='center'>
                      <Storage color='primary' sx={{ fontSize: 40 }} />
                      <Typography variant='h4' color='primary'>
                        {realTimeData.metrics?.storage || 0}%
                      </Typography>
                      <Typography variant='body2'>Storage</Typography>
                      <LinearProgress variant='determinate' value={realTimeData.metrics?.storage || 0} sx={{ mt: 1 }} />
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
                  Performance Statistics
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <Speed color='primary' />
                    </ListItemIcon>
                    <ListItemText
                      primary='Response Time'
                      secondary={`${realTimeData.performance?.responseTime || 0}ms`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <TrendingUp color='success' />
                    </ListItemIcon>
                    <ListItemText
                      primary='Throughput'
                      secondary={`${realTimeData.performance?.throughput || 0} req/min`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Error color='error' />
                    </ListItemIcon>
                    <ListItemText
                      primary='Error Rate'
                      secondary={formatPercentage((realTimeData.performance?.errorRate || 0) * 100)}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle color='success' />
                    </ListItemIcon>
                    <ListItemText primary='Uptime' secondary={realTimeData.performance?.uptime || '99.9%'} />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Users Tab */}
      <TabPanel value={activeTab} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <MetricCard
              title='Total Users'
              value={formatNumber(realTimeData.users?.totalUsers || 0)}
              trend={12.5}
              icon={<People color='primary' />}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <MetricCard
              title='Active Users'
              value={formatNumber(realTimeData.users?.activeUsers || 0)}
              trend={8.3}
              icon={<CheckCircle color='success' />}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <MetricCard
              title='New Users'
              value={formatNumber(realTimeData.users?.newUsers || 0)}
              trend={15.7}
              icon={<TrendingUp color='info' />}
            />
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant='h6' gutterBottom>
                  User Activity Trends
                </Typography>
                <PerformanceChart data={[45, 52, 48, 55, 62, 58, 65, 70, 68, 72, 75, 78]} title='Daily Active Users' />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant='h6' gutterBottom>
                  User Growth Rate
                </Typography>
                <Typography variant='h3' color='success.main'>
                  {realTimeData.users?.userGrowth || '+12%'}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Month over month growth
                </Typography>
                <LinearProgress variant='determinate' value={12} sx={{ mt: 2 }} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Apps Tab */}
      <TabPanel value={activeTab} index={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <MetricCard
              title='Total Apps'
              value={formatNumber(realTimeData.apps?.totalApps || 0)}
              trend={8.3}
              icon={<Apps color='primary' />}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <MetricCard
              title='Active Apps'
              value={formatNumber(realTimeData.apps?.activeApps || 0)}
              trend={5.2}
              icon={<CheckCircle color='success' />}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <MetricCard
              title='New Apps'
              value={formatNumber(realTimeData.apps?.newApps || 0)}
              trend={12.1}
              icon={<TrendingUp color='info' />}
            />
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant='h6' gutterBottom>
                  App Categories
                </Typography>
                {realTimeData.apps?.categories ? (
                  <Grid container spacing={2}>
                    {Object.entries(realTimeData.apps.categories).map(([category, count]) => (
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
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant='h6' gutterBottom>
                  App Usage Trends
                </Typography>
                <PerformanceChart data={[35, 42, 38, 45, 52, 48, 55, 60, 58, 62, 65, 68]} title='App Usage Over Time' />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* System Tab */}
      <TabPanel value={activeTab} index={4}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant='h6' gutterBottom>
                  System Health Overview
                </Typography>
                <Box textAlign='center' mb={3}>
                  <Typography variant='h2' color='success.main'>
                    {realTimeData.health?.score || 0}%
                  </Typography>
                  <Typography variant='h6' color='text.secondary'>
                    {realTimeData.health?.status || 'Unknown'}
                  </Typography>
                </Box>
                <LinearProgress variant='determinate' value={realTimeData.health?.score || 0} sx={{ mb: 2 }} />
                {realTimeData.health?.recommendations && (
                  <Box>
                    <Typography variant='subtitle2' gutterBottom>
                      Recommendations:
                    </Typography>
                    {realTimeData.health.recommendations.map((rec, index) => (
                      <Typography key={index} variant='body2' color='text.secondary'>
                        • {rec}
                      </Typography>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant='h6' gutterBottom>
                  System Metrics
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box textAlign='center'>
                      <Speed color='primary' sx={{ fontSize: 30 }} />
                      <Typography variant='h5' color='primary'>
                        {realTimeData.metrics?.cpu || 0}%
                      </Typography>
                      <Typography variant='body2'>CPU</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box textAlign='center'>
                      <Memory color='primary' sx={{ fontSize: 30 }} />
                      <Typography variant='h5' color='primary'>
                        {realTimeData.metrics?.memory || 0}%
                      </Typography>
                      <Typography variant='body2'>Memory</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box textAlign='center'>
                      <NetworkCheck color='primary' sx={{ fontSize: 30 }} />
                      <Typography variant='h5' color='primary'>
                        {realTimeData.metrics?.network || 0}%
                      </Typography>
                      <Typography variant='body2'>Network</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box textAlign='center'>
                      <Storage color='primary' sx={{ fontSize: 30 }} />
                      <Typography variant='h5' color='primary'>
                        {realTimeData.metrics?.storage || 0}%
                      </Typography>
                      <Typography variant='body2'>Storage</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>
    </Box>
  );
};

export default RealTimeAnalyticsDashboard;
