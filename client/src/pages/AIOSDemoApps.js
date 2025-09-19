/**
 * AIOS Demo Applications - Bubble Smart Design
 * Showcases the capabilities of the AI Operating System with modern bubble UI
 */

import {
  Analytics,
  AutoFixHigh,
  BugReport,
  CheckCircle,
  Close,
  CloudSync,
  Code,
  Insights,
  PlayArrow,
  Psychology,
  Security,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fade,
  Grid,
  Grow,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  Typography,
  Zoom,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

const AIOSDemoApps = () => {
  const [selectedApp, setSelectedApp] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [systemStatus, setSystemStatus] = useState(null);
  const [learningInsights, setLearningInsights] = useState(null);
  const [debugStatus, setDebugStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoveredApp, setHoveredApp] = useState(null);

  // AIOS Applications with bubble-style design
  const aiosApps = [
    {
      id: 'learning-loop',
      name: 'Learning Loop',
      description: 'Intelligent pattern recognition and continuous improvement',
      icon: <Psychology />,
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      status: 'active',
      performance: 95,
      features: ['Pattern Recognition', 'Self-Improvement', 'Meta-Learning'],
      category: 'AI Core',
    },
    {
      id: 'debug-tool',
      name: 'Debug Tool',
      description: 'Advanced debugging with AI-powered error resolution',
      icon: <BugReport />,
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      status: 'active',
      performance: 88,
      features: ['Error Detection', 'Auto-Fix', 'Pattern Analysis'],
      category: 'Development',
    },
    {
      id: 'cursor-cli',
      name: 'Cursor CLI',
      description: 'Command-line integration with intelligent automation',
      icon: <Code />,
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      status: 'active',
      performance: 92,
      features: ['File Monitoring', 'Auto-Fix', 'Code Analysis'],
      category: 'Development',
    },
    {
      id: 'quantum-autopilot',
      name: 'Quantum Autopilot',
      description: 'Smart notification system with priority management',
      icon: <AutoFixHigh />,
      color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      status: 'active',
      performance: 90,
      features: ['Smart Notifications', 'Priority Queue', 'Rate Limiting'],
      category: 'Automation',
    },
    {
      id: 'system-monitor',
      name: 'System Monitor',
      description: 'Real-time performance monitoring and analytics',
      icon: <Analytics />,
      color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      status: 'active',
      performance: 87,
      features: ['Performance Metrics', 'Resource Monitoring', 'Health Checks'],
      category: 'Monitoring',
    },
    {
      id: 'data-analytics',
      name: 'Data Analytics',
      description: 'Comprehensive data analysis and reporting',
      icon: <Insights />,
      color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      status: 'active',
      performance: 93,
      features: ['Data Processing', 'Trend Analysis', 'Reporting'],
      category: 'Analytics',
    },
    {
      id: 'telegram-integration',
      name: 'Telegram Integration',
      description: 'Smart bot with interactive commands and notifications',
      icon: <CloudSync />,
      color: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
      status: 'active',
      performance: 89,
      features: ['Bot Commands', 'Notifications', 'Interactive Control'],
      category: 'Integration',
    },
    {
      id: 'security-monitor',
      name: 'Security Monitor',
      description: 'Advanced security monitoring and threat detection',
      icon: <Security />,
      color: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      status: 'active',
      performance: 91,
      features: ['Threat Detection', 'Security Analysis', 'Risk Assessment'],
      category: 'Security',
    },
  ];

  useEffect(() => {
    fetchSystemData();
    const interval = setInterval(fetchSystemData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchSystemData = async () => {
    try {
      setLoading(true);

      // Create mock data structure that matches the expected format
      const mockSystemStatus = {
        totalDataPoints: 1250,
        activeComponents: 8,
        systemHealth: 'Excellent',
        uptime: '2d 14h 32m',
        memoryUsage: '45%',
        cpuUsage: '23%',
        lastUpdate: new Date().toISOString(),
      };

      const mockLearningInsights = {
        totalPatterns: 156,
        learningRate: 0.85,
        accuracy: 92.3,
        lastTraining: new Date().toISOString(),
        categories: {
          'Error Patterns': 45,
          'Code Patterns': 67,
          'Performance Patterns': 23,
          'User Behavior': 21,
        },
      };

      const mockDebugStatus = {
        totalErrors: 12,
        resolvedErrors: 11,
        resolutionRate: 91.7,
        averageResolutionTime: '2.3s',
        activeDebuggers: 3,
        lastError: new Date().toISOString(),
      };

      // Try to fetch real data, fallback to mock data
      try {
        const [status, insights, debug] = await Promise.all([
          api.get('/system/status').catch(() => ({ data: mockSystemStatus })),
          api
            .get('/learning/insights')
            .catch(() => ({ data: mockLearningInsights })),
          api.get('/debug/status').catch(() => ({ data: mockDebugStatus })),
        ]);

        setSystemStatus(status.data || mockSystemStatus);
        setLearningInsights(insights.data || mockLearningInsights);
        setDebugStatus(debug.data || mockDebugStatus);
      } catch (error) {
        console.warn('API calls failed, using mock data:', error);
        setSystemStatus(mockSystemStatus);
        setLearningInsights(mockLearningInsights);
        setDebugStatus(mockDebugStatus);
      }
    } catch (error) {
      console.error('Failed to fetch system data:', error);
      // Set fallback data
      setSystemStatus({
        totalDataPoints: 0,
        activeComponents: 0,
        systemHealth: 'Unknown',
        uptime: '0h 0m',
        memoryUsage: '0%',
        cpuUsage: '0%',
        lastUpdate: new Date().toISOString(),
      });
      setLearningInsights({
        totalPatterns: 0,
        learningRate: 0,
        accuracy: 0,
        lastTraining: new Date().toISOString(),
        categories: {},
      });
      setDebugStatus({
        totalErrors: 0,
        resolvedErrors: 0,
        resolutionRate: 0,
        averageResolutionTime: '0s',
        activeDebuggers: 0,
        lastError: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAppClick = app => {
    setSelectedApp(app);
  };

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const getStatusColor = status => {
    switch (status) {
      case 'active':
        return '#4caf50';
      case 'inactive':
        return '#f44336';
      case 'warning':
        return '#ff9800';
      default:
        return '#9e9e9e';
    }
  };

  const getPerformanceColor = performance => {
    if (performance >= 90) return '#4caf50';
    if (performance >= 80) return '#ff9800';
    return '#f44336';
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.3) 0%, transparent 50%)
          `,
          animation: 'bubbleFloat 20s ease-in-out infinite',
        },
      }}
    >
      {/* Floating Bubbles */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          animation: 'bubbleFloat 15s ease-in-out infinite',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '20%',
          right: '15%',
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.08)',
          animation: 'bubbleFloat 12s ease-in-out infinite reverse',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '20%',
          left: '20%',
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.06)',
          animation: 'bubbleFloat 18s ease-in-out infinite',
        }}
      />

      <Container maxWidth='xl' sx={{ position: 'relative', zIndex: 1, py: 4 }}>
        {/* Header */}
        <Fade in timeout={1000}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant='h2'
              sx={{
                fontWeight: 'bold',
                color: 'white',
                mb: 2,
                textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                background: 'linear-gradient(45deg, #fff, #e3f2fd)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              AIOS Smart Applications
            </Typography>
            <Typography
              variant='h6'
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                maxWidth: 600,
                mx: 'auto',
                textShadow: '0 2px 10px rgba(0,0,0,0.2)',
              }}
            >
              Experience the future of intelligent automation with our
              bubble-powered AI ecosystem
            </Typography>
          </Box>
        </Fade>

        {/* System Overview */}
        <Grow in timeout={1200}>
          <Paper
            sx={{
              p: 3,
              mb: 4,
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: 4,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Stack
              direction='row'
              spacing={3}
              alignItems='center'
              justifyContent='center'
            >
              <Box sx={{ textAlign: 'center' }}>
                <Typography
                  variant='h4'
                  sx={{ color: 'white', fontWeight: 'bold' }}
                >
                  {systemStatus?.totalDataPoints || 0}
                </Typography>
                <Typography
                  variant='body2'
                  sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                >
                  Data Points
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography
                  variant='h4'
                  sx={{ color: 'white', fontWeight: 'bold' }}
                >
                  {systemStatus?.activeComponents || 0}
                </Typography>
                <Typography
                  variant='body2'
                  sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                >
                  Active Components
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography
                  variant='h4'
                  sx={{ color: 'white', fontWeight: 'bold' }}
                >
                  {systemStatus?.systemHealth || 'Good'}
                </Typography>
                <Typography
                  variant='body2'
                  sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                >
                  System Health
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grow>

        {/* Applications Grid */}
        <Grid container spacing={3}>
          {aiosApps.map((app, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={app.id}>
              <Zoom in timeout={1000 + index * 100}>
                <Card
                  sx={{
                    height: '100%',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: 4,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      transform: 'translateY(-8px) scale(1.02)',
                      boxShadow: '0 16px 48px rgba(0, 0, 0, 0.2)',
                      '& .app-icon': {
                        transform: 'scale(1.2) rotate(10deg)',
                      },
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: app.color,
                      opacity: 0.1,
                      transition: 'opacity 0.3s ease',
                    },
                    '&:hover::before': {
                      opacity: 0.2,
                    },
                  }}
                  onClick={() => handleAppClick(app)}
                  onMouseEnter={() => setHoveredApp(app.id)}
                  onMouseLeave={() => setHoveredApp(null)}
                >
                  <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        className='app-icon'
                        sx={{
                          background: app.color,
                          width: 48,
                          height: 48,
                          mr: 2,
                          transition: 'all 0.3s ease',
                          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                        }}
                      >
                        {app.icon}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant='h6'
                          sx={{ color: 'white', fontWeight: 'bold' }}
                        >
                          {app.name}
                        </Typography>
                        <Chip
                          label={app.category}
                          size='small'
                          sx={{
                            background: 'rgba(255, 255, 255, 0.2)',
                            color: 'white',
                            fontSize: '0.7rem',
                          }}
                        />
                      </Box>
                    </Box>

                    <Typography
                      variant='body2'
                      sx={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        mb: 2,
                        minHeight: 40,
                      }}
                    >
                      {app.description}
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          mb: 1,
                        }}
                      >
                        <Typography
                          variant='body2'
                          sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                        >
                          Performance
                        </Typography>
                        <Typography
                          variant='body2'
                          sx={{ color: getPerformanceColor(app.performance) }}
                        >
                          {app.performance}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant='determinate'
                        value={app.performance}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: 'rgba(255, 255, 255, 0.2)',
                          '& .MuiLinearProgress-bar': {
                            background: app.color,
                            borderRadius: 3,
                          },
                        }}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {app.features.slice(0, 2).map((feature, idx) => (
                        <Chip
                          key={idx}
                          label={feature}
                          size='small'
                          sx={{
                            background: 'rgba(255, 255, 255, 0.15)',
                            color: 'white',
                            fontSize: '0.65rem',
                            height: 20,
                          }}
                        />
                      ))}
                      {app.features.length > 2 && (
                        <Chip
                          label={`+${app.features.length - 2}`}
                          size='small'
                          sx={{
                            background: 'rgba(255, 255, 255, 0.15)',
                            color: 'white',
                            fontSize: '0.65rem',
                            height: 20,
                          }}
                        />
                      )}
                    </Box>
                  </CardContent>

                  <CardActions sx={{ position: 'relative', zIndex: 1 }}>
                    <Button
                      size='small'
                      startIcon={<PlayArrow />}
                      sx={{
                        color: 'white',
                        background: 'rgba(255, 255, 255, 0.1)',
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.2)',
                        },
                      }}
                    >
                      Launch
                    </Button>
                    <Box sx={{ flex: 1 }} />
                    <Chip
                      icon={<CheckCircle />}
                      label={app.status}
                      size='small'
                      sx={{
                        background: getStatusColor(app.status),
                        color: 'white',
                        fontSize: '0.7rem',
                      }}
                    />
                  </CardActions>
                </Card>
              </Zoom>
            </Grid>
          ))}
        </Grid>

        {/* App Details Dialog */}
        <Dialog
          open={!!selectedApp}
          onClose={() => setSelectedApp(null)}
          maxWidth='md'
          fullWidth
          PaperProps={{
            sx: {
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: 4,
              boxShadow: '0 16px 64px rgba(0, 0, 0, 0.2)',
            },
          }}
        >
          {selectedApp && (
            <>
              <DialogTitle sx={{ color: 'white', pb: 1 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      sx={{
                        background: selectedApp.color,
                        width: 48,
                        height: 48,
                        mr: 2,
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                      }}
                    >
                      {selectedApp.icon}
                    </Avatar>
                    <Box>
                      <Typography variant='h5' sx={{ fontWeight: 'bold' }}>
                        {selectedApp.name}
                      </Typography>
                      <Typography
                        variant='body2'
                        sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                      >
                        {selectedApp.category}
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton
                    onClick={() => setSelectedApp(null)}
                    sx={{ color: 'white' }}
                  >
                    <Close />
                  </IconButton>
                </Box>
              </DialogTitle>

              <DialogContent sx={{ color: 'white' }}>
                <Typography
                  variant='body1'
                  sx={{ mb: 3, color: 'rgba(255, 255, 255, 0.9)' }}
                >
                  {selectedApp.description}
                </Typography>

                <Typography variant='h6' sx={{ mb: 2, fontWeight: 'bold' }}>
                  Features
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                  {selectedApp.features.map((feature, idx) => (
                    <Chip
                      key={idx}
                      label={feature}
                      sx={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                      }}
                    />
                  ))}
                </Box>

                <Typography variant='h6' sx={{ mb: 2, fontWeight: 'bold' }}>
                  Performance Metrics
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 1,
                    }}
                  >
                    <Typography variant='body2'>Overall Performance</Typography>
                    <Typography
                      variant='body2'
                      sx={{
                        color: getPerformanceColor(selectedApp.performance),
                      }}
                    >
                      {selectedApp.performance}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant='determinate'
                    value={selectedApp.performance}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      '& .MuiLinearProgress-bar': {
                        background: selectedApp.color,
                        borderRadius: 4,
                      },
                    }}
                  />
                </Box>
              </DialogContent>

              <DialogActions sx={{ p: 3 }}>
                <Button
                  onClick={() => setSelectedApp(null)}
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  Close
                </Button>
                <Button
                  variant='contained'
                  startIcon={<PlayArrow />}
                  onClick={handleStartStop}
                  sx={{
                    background: selectedApp.color,
                    '&:hover': {
                      background: selectedApp.color,
                      opacity: 0.9,
                    },
                  }}
                >
                  {isRunning ? 'Stop' : 'Launch'}
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Container>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes bubbleFloat {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-20px) rotate(2deg);
          }
          66% {
            transform: translateY(-10px) rotate(-1deg);
          }
        }
      `}</style>
    </Box>
  );
};

export default AIOSDemoApps;
