import {
  CheckCircle,
  DataUsage,
  Error,
  Memory,
  MonitorHeart,
  NetworkCheck,
  Notifications,
  Refresh,
  Settings,
  Speed,
  Storage,
  Timeline,
  Warning
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  Slider,
  Switch,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tooltip,
  Typography
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';

const SystemMonitoringDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [systemData, setSystemData] = useState({
    metrics: {},
    health: {},
    alerts: [],
    logs: [],
    performance: {},
    security: {},
    updates: {}
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wsConnected, setWsConnected] = useState(false);
  const [ws, setWs] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(3000);
  const [alertThresholds, setAlertThresholds] = useState({
    cpu: 80,
    memory: 85,
    storage: 90,
    network: 75
  });
  const intervalRef = useRef(null);

  // WebSocket connection for real-time monitoring
  useEffect(() => {
    const connectWebSocket = () => {
      try {
        const websocket = new WebSocket('ws://localhost:3001');

        websocket.onopen = () => {
          console.log('🔍 Connected to system monitoring WebSocket');
          setWsConnected(true);
          setWs(websocket);
        };

        websocket.onmessage = event => {
          try {
            const message = JSON.parse(event.data);
            handleWebSocketMessage(message);
          } catch (err) {
            console.error('Error parsing monitoring WebSocket message:', err);
          }
        };

        websocket.onclose = () => {
          console.log('🔍 System monitoring WebSocket disconnected');
          setWsConnected(false);
          setWs(null);
          setTimeout(connectWebSocket, 5000);
        };

        websocket.onerror = error => {
          console.error('System monitoring WebSocket error:', error);
          setWsConnected(false);
        };
      } catch (error) {
        console.error('Failed to connect to system monitoring WebSocket:', error);
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
        setSystemData(message.data);
        setLoading(false);
        break;
      case 'metrics':
        setSystemData(prev => ({ ...prev, metrics: message.data }));
        checkThresholds(message.data);
        break;
      case 'alert':
        setSystemData(prev => ({
          ...prev,
          alerts: [...message.data, ...prev.alerts].slice(0, 100)
        }));
        break;
      case 'log':
        setSystemData(prev => ({
          ...prev,
          logs: [...prev.logs, message.data].slice(-500)
        }));
        break;
      default:
        console.log('Unknown monitoring message type:', message.type);
    }
  };

  const checkThresholds = metrics => {
    const newAlerts = [];

    if (metrics.cpu > alertThresholds.cpu) {
      newAlerts.push({
        id: Date.now(),
        type: 'warning',
        title: 'High CPU Usage',
        message: `CPU usage is at ${metrics.cpu}% (threshold: ${alertThresholds.cpu}%)`,
        timestamp: new Date(),
        metric: 'cpu',
        value: metrics.cpu
      });
    }

    if (metrics.memory > alertThresholds.memory) {
      newAlerts.push({
        id: Date.now(),
        type: 'error',
        title: 'High Memory Usage',
        message: `Memory usage is at ${metrics.memory}% (threshold: ${alertThresholds.memory}%)`,
        timestamp: new Date(),
        metric: 'memory',
        value: metrics.memory
      });
    }

    if (metrics.storage > alertThresholds.storage) {
      newAlerts.push({
        id: Date.now(),
        type: 'error',
        title: 'High Storage Usage',
        message: `Storage usage is at ${metrics.storage}% (threshold: ${alertThresholds.storage}%)`,
        timestamp: new Date(),
        metric: 'storage',
        value: metrics.storage
      });
    }

    if (metrics.network > alertThresholds.network) {
      newAlerts.push({
        id: Date.now(),
        type: 'warning',
        title: 'High Network Usage',
        message: `Network usage is at ${metrics.network}% (threshold: ${alertThresholds.network}%)`,
        timestamp: new Date(),
        metric: 'network',
        value: metrics.network
      });
    }

    if (newAlerts.length > 0) {
      setSystemData(prev => ({
        ...prev,
        alerts: [...newAlerts, ...prev.alerts].slice(0, 100)
      }));
    }
  };

  // Auto-refresh functionality
  useEffect(() => {
    if (autoRefresh) {
      intervalRef.current = setInterval(() => {
        fetchSystemData();
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

  const fetchSystemData = async () => {
    try {
      const endpoints = ['metrics', 'health', 'alerts', 'logs', 'performance'];

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

      setSystemData(prev => ({ ...prev, ...newData }));
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('System data fetch error:', err);
    }
  };

  const handleRefresh = () => {
    fetchSystemData();
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleThresholdChange = (metric, value) => {
    setAlertThresholds(prev => ({
      ...prev,
      [metric]: value
    }));
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

  const MetricCard = ({ title, value, icon, color = 'primary', subtitle, threshold }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display='flex' alignItems='center' justifyContent='space-between' mb={2}>
          <Box display='flex' alignItems='center'>
            {icon}
            <Typography variant='h6' sx={{ ml: 1 }}>
              {title}
            </Typography>
          </Box>
          {threshold && (
            <Chip label={`Threshold: ${threshold}%`} color={value > threshold ? 'error' : 'default'} size='small' />
          )}
        </Box>
        <Typography variant='h3' color={`${color}.main`}>
          {value}%
        </Typography>
        {subtitle && (
          <Typography variant='body2' color='text.secondary'>
            {subtitle}
          </Typography>
        )}
        <LinearProgress
          variant='determinate'
          value={value}
          color={value > (threshold || 80) ? 'error' : 'primary'}
          sx={{ mt: 1 }}
        />
      </CardContent>
    </Card>
  );

  const TabPanel = ({ children, value, index, ...other }) => (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`monitoring-tabpanel-${index}`}
      aria-labelledby={`monitoring-tab-${index}`}
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
            Loading System Monitoring Dashboard...
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
          <MonitorHeart sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
          <Typography variant='h4' component='h1'>
            System Monitoring Dashboard
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

      {/* System Health Overview */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display='flex' alignItems='center' mb={2}>
                <MonitorHeart color='primary' sx={{ mr: 1 }} />
                <Typography variant='h6'>System Health</Typography>
              </Box>
              <Typography variant='h3' color={getHealthColor(systemData.health?.status)}>
                {systemData.health?.score || 0}%
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Status: {systemData.health?.status || 'Unknown'}
              </Typography>
              <LinearProgress variant='determinate' value={systemData.health?.score || 0} sx={{ mt: 1 }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display='flex' alignItems='center' mb={2}>
                <Notifications color='primary' sx={{ mr: 1 }} />
                <Typography variant='h6'>Active Alerts</Typography>
              </Box>
              <Typography variant='h3' color='error.main'>
                {systemData.alerts?.length || 0}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Critical: {systemData.alerts?.filter(a => a.type === 'error').length || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display='flex' alignItems='center' mb={2}>
                <Timeline color='primary' sx={{ mr: 1 }} />
                <Typography variant='h6'>Uptime</Typography>
              </Box>
              <Typography variant='h3' color='success.main'>
                {systemData.performance?.uptime || '99.9%'}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Last 30 days
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display='flex' alignItems='center' mb={2}>
                <Speed color='primary' sx={{ mr: 1 }} />
                <Typography variant='h6'>Response Time</Typography>
              </Box>
              <Typography variant='h3' color='info.main'>
                {systemData.performance?.responseTime || 0}ms
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Average
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label='monitoring tabs'>
          <Tab label='Metrics' icon={<DataUsage />} />
          <Tab label='Alerts' icon={<Warning />} />
          <Tab label='Logs' icon={<Timeline />} />
          <Tab label='Settings' icon={<Settings />} />
        </Tabs>
      </Box>

      {/* Metrics Tab */}
      <TabPanel value={activeTab} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title='CPU Usage'
              value={systemData.metrics?.cpu || 0}
              icon={<Speed color='primary' />}
              threshold={alertThresholds.cpu}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title='Memory Usage'
              value={systemData.metrics?.memory || 0}
              icon={<Memory color='primary' />}
              threshold={alertThresholds.memory}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title='Storage Usage'
              value={systemData.metrics?.storage || 0}
              icon={<Storage color='primary' />}
              threshold={alertThresholds.storage}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title='Network Usage'
              value={systemData.metrics?.network || 0}
              icon={<NetworkCheck color='primary' />}
              threshold={alertThresholds.network}
            />
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant='h6' gutterBottom>
                  Performance Trends
                </Typography>
                <Box sx={{ height: 300, display: 'flex', alignItems: 'end', gap: 1 }}>
                  {[65, 72, 68, 75, 82, 78, 85, 90, 88, 92, 95, 98].map((value, index) => (
                    <Box
                      key={index}
                      sx={{
                        flex: 1,
                        height: `${value}%`,
                        bgcolor: value > 80 ? 'error.main' : value > 60 ? 'warning.main' : 'success.main',
                        borderRadius: '4px 4px 0 0',
                        minHeight: '20px',
                        display: 'flex',
                        alignItems: 'end',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '10px',
                        fontWeight: 'bold'
                      }}
                    >
                      {value}
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant='h6' gutterBottom>
                  System Status
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle color='success' />
                    </ListItemIcon>
                    <ListItemText primary='Database' secondary='Connected' />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle color='success' />
                    </ListItemIcon>
                    <ListItemText primary='API Server' secondary='Running' />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle color='success' />
                    </ListItemIcon>
                    <ListItemText primary='WebSocket' secondary='Active' />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle color='success' />
                    </ListItemIcon>
                    <ListItemText primary='Cache' secondary='Operational' />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Alerts Tab */}
      <TabPanel value={activeTab} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant='h6' gutterBottom>
                  System Alerts
                </Typography>
                {systemData.alerts?.length > 0 ? (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Type</TableCell>
                          <TableCell>Title</TableCell>
                          <TableCell>Message</TableCell>
                          <TableCell>Metric</TableCell>
                          <TableCell>Value</TableCell>
                          <TableCell>Timestamp</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {systemData.alerts.slice(0, 20).map((alert, index) => (
                          <TableRow key={alert.id || index}>
                            <TableCell>
                              <Chip label={alert.type} color={getAlertColor(alert.type)} size='small' />
                            </TableCell>
                            <TableCell>{alert.title}</TableCell>
                            <TableCell>{alert.message}</TableCell>
                            <TableCell>{alert.metric || 'N/A'}</TableCell>
                            <TableCell>{alert.value || 'N/A'}</TableCell>
                            <TableCell>{new Date(alert.timestamp).toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography variant='body2' color='text.secondary'>
                    No active alerts
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Logs Tab */}
      <TabPanel value={activeTab} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant='h6' gutterBottom>
                  System Logs
                </Typography>
                {systemData.logs?.length > 0 ? (
                  <List dense>
                    {systemData.logs.slice(-20).map((log, index) => (
                      <React.Fragment key={log.id || index}>
                        <ListItem>
                          <ListItemIcon>
                            <Chip label={log.level} color={getLogColor(log.level)} size='small' />
                          </ListItemIcon>
                          <ListItemText
                            primary={log.message}
                            secondary={`${log.source} - ${new Date(log.timestamp).toLocaleString()}`}
                          />
                        </ListItem>
                        {index < systemData.logs.length - 1 && <Divider />}
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
      </TabPanel>

      {/* Settings Tab */}
      <TabPanel value={activeTab} index={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant='h6' gutterBottom>
                  Alert Thresholds
                </Typography>
                <Box sx={{ p: 2 }}>
                  <Typography gutterBottom>CPU Usage Threshold</Typography>
                  <Slider
                    value={alertThresholds.cpu}
                    onChange={(e, value) => handleThresholdChange('cpu', value)}
                    min={50}
                    max={100}
                    step={5}
                    marks={[
                      { value: 50, label: '50%' },
                      { value: 75, label: '75%' },
                      { value: 100, label: '100%' }
                    ]}
                    valueLabelDisplay='auto'
                  />
                </Box>
                <Box sx={{ p: 2 }}>
                  <Typography gutterBottom>Memory Usage Threshold</Typography>
                  <Slider
                    value={alertThresholds.memory}
                    onChange={(e, value) => handleThresholdChange('memory', value)}
                    min={50}
                    max={100}
                    step={5}
                    marks={[
                      { value: 50, label: '50%' },
                      { value: 75, label: '75%' },
                      { value: 100, label: '100%' }
                    ]}
                    valueLabelDisplay='auto'
                  />
                </Box>
                <Box sx={{ p: 2 }}>
                  <Typography gutterBottom>Storage Usage Threshold</Typography>
                  <Slider
                    value={alertThresholds.storage}
                    onChange={(e, value) => handleThresholdChange('storage', value)}
                    min={50}
                    max={100}
                    step={5}
                    marks={[
                      { value: 50, label: '50%' },
                      { value: 75, label: '75%' },
                      { value: 100, label: '100%' }
                    ]}
                    valueLabelDisplay='auto'
                  />
                </Box>
                <Box sx={{ p: 2 }}>
                  <Typography gutterBottom>Network Usage Threshold</Typography>
                  <Slider
                    value={alertThresholds.network}
                    onChange={(e, value) => handleThresholdChange('network', value)}
                    min={50}
                    max={100}
                    step={5}
                    marks={[
                      { value: 50, label: '50%' },
                      { value: 75, label: '75%' },
                      { value: 100, label: '100%' }
                    ]}
                    valueLabelDisplay='auto'
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant='h6' gutterBottom>
                  Monitoring Settings
                </Typography>
                <Box sx={{ p: 2 }}>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Refresh Interval</InputLabel>
                    <Select
                      value={refreshInterval}
                      onChange={e => setRefreshInterval(e.target.value)}
                      label='Refresh Interval'
                    >
                      <MenuItem value={1000}>1 second</MenuItem>
                      <MenuItem value={3000}>3 seconds</MenuItem>
                      <MenuItem value={5000}>5 seconds</MenuItem>
                      <MenuItem value={10000}>10 seconds</MenuItem>
                      <MenuItem value={30000}>30 seconds</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControlLabel
                    control={
                      <Switch checked={autoRefresh} onChange={e => setAutoRefresh(e.target.checked)} color='primary' />
                    }
                    label='Auto Refresh'
                  />

                  <Box sx={{ mt: 2 }}>
                    <Button variant='contained' color='primary' onClick={handleRefresh} startIcon={<Refresh />}>
                      Refresh Now
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>
    </Box>
  );
};

export default SystemMonitoringDashboard;
