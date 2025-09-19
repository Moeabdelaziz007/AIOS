/**
 * AIOS System Monitor Demo
 * Real-time system performance monitoring and analytics
 */

import {
  Analytics as AnalyticsIcon,
  BugReport as BugReportIcon,
  CheckCircle as CheckCircleIcon,
  Cloud as CloudIcon,
  Computer as ComputerIcon,
  Error as ErrorIcon,
  Memory as MemoryIcon,
  NetworkCheck as NetworkIcon,
  Refresh as RefreshIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Storage as StorageIcon,
  TrendingDown as TrendingDownIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';

const AIOSSystemMonitorDemo = () => {
  const [systemMetrics, setSystemMetrics] = useState({
    cpu: { usage: 0, cores: 8, temperature: 0 },
    memory: { used: 0, total: 16, available: 0 },
    network: { upload: 0, download: 0, latency: 0 },
    storage: { used: 0, total: 1000, iops: 0 },
    processes: [],
    alerts: [],
  });

  const [isMonitoring, setIsMonitoring] = useState(true);
  const [refreshRate, setRefreshRate] = useState(1000);

  // Simulate real-time system metrics
  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(() => {
      setSystemMetrics(prev => ({
        cpu: {
          usage: Math.min(
            100,
            Math.max(0, prev.cpu.usage + (Math.random() - 0.5) * 10)
          ),
          cores: 8,
          temperature: Math.min(
            100,
            Math.max(30, prev.cpu.temperature + (Math.random() - 0.5) * 5)
          ),
        },
        memory: {
          used: Math.min(
            16,
            Math.max(0, prev.memory.used + (Math.random() - 0.5) * 2)
          ),
          total: 16,
          available:
            16 -
            Math.min(
              16,
              Math.max(0, prev.memory.used + (Math.random() - 0.5) * 2)
            ),
        },
        network: {
          upload: Math.max(0, prev.network.upload + (Math.random() - 0.5) * 10),
          download: Math.max(
            0,
            prev.network.download + (Math.random() - 0.5) * 15
          ),
          latency: Math.max(
            0,
            prev.network.latency + (Math.random() - 0.5) * 5
          ),
        },
        storage: {
          used: Math.min(
            1000,
            Math.max(0, prev.storage.used + (Math.random() - 0.5) * 5)
          ),
          total: 1000,
          iops: Math.max(0, prev.storage.iops + (Math.random() - 0.5) * 100),
        },
        processes: generateRandomProcesses(),
        alerts: generateRandomAlerts(),
      }));
    }, refreshRate);

    return () => clearInterval(interval);
  }, [isMonitoring, refreshRate]);

  const generateRandomProcesses = () => {
    const processNames = [
      'aios-core',
      'quantum-autopilot',
      'learning-loop',
      'debug-tool',
      'telegram-bot',
      'firebase-sync',
      'data-processor',
      'security-scanner',
      'performance-optimizer',
      'system-monitor',
      'ai-chat',
      'code-analyzer',
    ];

    return processNames
      .slice(0, Math.floor(Math.random() * 8) + 4)
      .map((name, index) => ({
        id: index,
        name,
        cpu: Math.random() * 20,
        memory: Math.random() * 500,
        status: Math.random() > 0.1 ? 'running' : 'warning',
      }));
  };

  const generateRandomAlerts = () => {
    const alertTypes = [
      {
        type: 'warning',
        message: 'High CPU usage detected',
        icon: <WarningIcon />,
      },
      {
        type: 'info',
        message: 'Memory optimization completed',
        icon: <CheckCircleIcon />,
      },
      {
        type: 'error',
        message: 'Network connection unstable',
        icon: <ErrorIcon />,
      },
      {
        type: 'success',
        message: 'Security scan completed',
        icon: <CheckCircleIcon />,
      },
    ];

    return alertTypes.slice(0, Math.floor(Math.random() * 3) + 1);
  };

  const getStatusColor = status => {
    switch (status) {
      case 'running':
        return 'success';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'default';
    }
  };

  const getAlertColor = type => {
    switch (type) {
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      case 'success':
        return 'success';
      case 'info':
        return 'info';
      default:
        return 'default';
    }
  };

  const formatBytes = bytes => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Box>
          <Typography variant='h4' component='h1' gutterBottom>
            📊 AIOS System Monitor
          </Typography>
          <Typography variant='subtitle1' color='text.secondary'>
            Real-time system performance monitoring and analytics
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip
            label={isMonitoring ? 'Monitoring' : 'Paused'}
            color={isMonitoring ? 'success' : 'default'}
            icon={isMonitoring ? <CheckCircleIcon /> : <WarningIcon />}
          />
          <IconButton onClick={() => setIsMonitoring(!isMonitoring)}>
            <RefreshIcon />
          </IconButton>
        </Box>
      </Box>

      {/* System Overview */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <SpeedIcon />
                </Avatar>
                <Box>
                  <Typography variant='h6'>CPU Usage</Typography>
                  <Typography variant='h4'>
                    {systemMetrics.cpu.usage.toFixed(1)}%
                  </Typography>
                </Box>
              </Box>
              <LinearProgress
                variant='determinate'
                value={systemMetrics.cpu.usage}
                color={
                  systemMetrics.cpu.usage > 80
                    ? 'error'
                    : systemMetrics.cpu.usage > 60
                    ? 'warning'
                    : 'primary'
                }
                sx={{ mb: 1 }}
              />
              <Typography variant='body2' color='text.secondary'>
                {systemMetrics.cpu.cores} cores •{' '}
                {systemMetrics.cpu.temperature.toFixed(1)}°C
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                  <MemoryIcon />
                </Avatar>
                <Box>
                  <Typography variant='h6'>Memory</Typography>
                  <Typography variant='h4'>
                    {systemMetrics.memory.used.toFixed(1)}GB
                  </Typography>
                </Box>
              </Box>
              <LinearProgress
                variant='determinate'
                value={
                  (systemMetrics.memory.used / systemMetrics.memory.total) * 100
                }
                color={
                  systemMetrics.memory.used / systemMetrics.memory.total > 0.8
                    ? 'error'
                    : 'secondary'
                }
                sx={{ mb: 1 }}
              />
              <Typography variant='body2' color='text.secondary'>
                {systemMetrics.memory.available.toFixed(1)}GB available
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <NetworkIcon />
                </Avatar>
                <Box>
                  <Typography variant='h6'>Network</Typography>
                  <Typography variant='h4'>
                    {systemMetrics.network.download.toFixed(1)}
                  </Typography>
                </Box>
              </Box>
              <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
                ↓ {systemMetrics.network.download.toFixed(1)} Mbps
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                ↑ {systemMetrics.network.upload.toFixed(1)} Mbps •{' '}
                {systemMetrics.network.latency.toFixed(1)}ms
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                  <StorageIcon />
                </Avatar>
                <Box>
                  <Typography variant='h6'>Storage</Typography>
                  <Typography variant='h4'>
                    {systemMetrics.storage.used.toFixed(1)}GB
                  </Typography>
                </Box>
              </Box>
              <LinearProgress
                variant='determinate'
                value={
                  (systemMetrics.storage.used / systemMetrics.storage.total) *
                  100
                }
                color={
                  systemMetrics.storage.used / systemMetrics.storage.total > 0.8
                    ? 'error'
                    : 'warning'
                }
                sx={{ mb: 1 }}
              />
              <Typography variant='body2' color='text.secondary'>
                {systemMetrics.storage.iops.toFixed(0)} IOPS
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Active Processes */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                🔄 Active Processes
              </Typography>
              <List>
                {systemMetrics.processes.map(process => (
                  <ListItem key={process.id}>
                    <ListItemIcon>
                      <ComputerIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={process.name}
                      secondary={
                        <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                          <Chip
                            label={`CPU: ${process.cpu.toFixed(1)}%`}
                            size='small'
                            color={process.cpu > 15 ? 'error' : 'default'}
                          />
                          <Chip
                            label={`Memory: ${formatBytes(
                              process.memory * 1024 * 1024
                            )}`}
                            size='small'
                            color={process.memory > 300 ? 'warning' : 'default'}
                          />
                          <Chip
                            label={process.status}
                            size='small'
                            color={getStatusColor(process.status)}
                          />
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* System Alerts */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                🚨 System Alerts
              </Typography>
              <List>
                {systemMetrics.alerts.map((alert, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <Avatar
                        sx={{
                          bgcolor: `${getAlertColor(alert.type)}.main`,
                          width: 32,
                          height: 32,
                        }}
                      >
                        {alert.icon}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={alert.message}
                      secondary={new Date().toLocaleTimeString()}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Performance Trends */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                📈 Performance Trends
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <TrendingUpIcon
                      color='success'
                      sx={{ fontSize: 32, mb: 1 }}
                    />
                    <Typography variant='h6' color='success.main'>
                      +12%
                    </Typography>
                    <Typography variant='body2'>CPU Efficiency</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <TrendingDownIcon
                      color='error'
                      sx={{ fontSize: 32, mb: 1 }}
                    />
                    <Typography variant='h6' color='error.main'>
                      -5%
                    </Typography>
                    <Typography variant='body2'>Memory Usage</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <TrendingUpIcon
                      color='primary'
                      sx={{ fontSize: 32, mb: 1 }}
                    />
                    <Typography variant='h6' color='primary.main'>
                      +8%
                    </Typography>
                    <Typography variant='body2'>Network Speed</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <CheckCircleIcon
                      color='success'
                      sx={{ fontSize: 32, mb: 1 }}
                    />
                    <Typography variant='h6' color='success.main'>
                      99.9%
                    </Typography>
                    <Typography variant='body2'>Uptime</Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* AIOS Capabilities */}
      <Paper
        sx={{
          p: 3,
          mt: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
        }}
      >
        <Typography variant='h6' gutterBottom>
          🌟 AIOS Monitoring Capabilities
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <AnalyticsIcon sx={{ fontSize: 32, mb: 1 }} />
              <Typography variant='body2'>Real-time Analytics</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <SecurityIcon sx={{ fontSize: 32, mb: 1 }} />
              <Typography variant='body2'>Security Monitoring</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <CloudIcon sx={{ fontSize: 32, mb: 1 }} />
              <Typography variant='body2'>Cloud Integration</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <BugReportIcon sx={{ fontSize: 32, mb: 1 }} />
              <Typography variant='body2'>Predictive Alerts</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default AIOSSystemMonitorDemo;
