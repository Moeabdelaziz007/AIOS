import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  IconButton,
  Avatar,
  Badge,
  Tooltip,
  Fade,
  Zoom,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  LinearProgress,
  CircularProgress
} from '@mui/material';
import {
  Apps,
  Dashboard,
  Settings,
  SmartToy,
  Psychology,
  AutoAwesome,
  Chat,
  Storage,
  Security,
  Analytics,
  Code,
  Storage as Database,
  Cloud,
  Memory,
  Speed,
  BugReport,
  CheckCircle,
  Error,
  Warning,
  Info,
  Refresh,
  Add,
  Close,
  PlayArrow,
  Pause,
  Stop,
  Fullscreen,
  Minimize,
  Maximize,
  Restore
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useFirebase } from '../services/FirebaseService';

const Desktop = () => {
  const { user, userProfile } = useAuth();
  const { dataAgent, loading: firebaseLoading } = useFirebase();
  const [apps, setApps] = useState([]);
  const [systemStatus, setSystemStatus] = useState(null);
  const [openApp, setOpenApp] = useState(null);
  const [taskbarApps, setTaskbarApps] = useState([]);
  const [showStartMenu, setShowStartMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Desktop Apps Configuration
  const desktopApps = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: <Dashboard />,
      color: '#4CAF50',
      description: 'System Overview',
      component: 'Dashboard',
      category: 'system'
    },
    {
      id: 'apps',
      name: 'Apps',
      icon: <Apps />,
      color: '#2196F3',
      description: 'Application Manager',
      component: 'Apps',
      category: 'system'
    },
    {
      id: 'data-agent',
      name: 'Data Agent',
      icon: <SmartToy />,
      color: '#FF9800',
      description: 'AI Data Processing',
      component: 'DataAgent',
      category: 'ai'
    },
    {
      id: 'ai-learning',
      name: 'AI Learning',
      icon: <Psychology />,
      color: '#9C27B0',
      description: 'Machine Learning',
      component: 'AILearning',
      category: 'ai'
    },
    {
      id: 'ai-rules',
      name: 'AI Rules',
      icon: <AutoAwesome />,
      color: '#E91E63',
      description: 'AI Rule Engine',
      component: 'AIRules',
      category: 'ai'
    },
    {
      id: 'live-chat',
      name: 'Live Chat',
      icon: <Chat />,
      color: '#00BCD4',
      description: 'Real-time Communication',
      component: 'LiveChat',
      category: 'communication'
    },
    {
      id: 'storage',
      name: 'Storage',
      icon: <Storage />,
      color: '#795548',
      description: 'File Management',
      component: 'Storage',
      category: 'system'
    },
    {
      id: 'security',
      name: 'Security',
      icon: <Security />,
      color: '#F44336',
      description: 'Security Center',
      component: 'Security',
      category: 'system'
    },
    {
      id: 'analytics',
      name: 'Analytics',
      icon: <Analytics />,
      color: '#607D8B',
      description: 'Data Analytics',
      component: 'Analytics',
      category: 'tools'
    },
    {
      id: 'code-editor',
      name: 'Code Editor',
      icon: <Code />,
      color: '#3F51B5',
      description: 'Development Environment',
      component: 'CodeEditor',
      category: 'development'
    },
    {
      id: 'database',
      name: 'Database',
      icon: <Database />,
      color: '#FF5722',
      description: 'Database Manager',
      component: 'Database',
      category: 'development'
    },
    {
      id: 'cloud',
      name: 'Cloud',
      icon: <Cloud />,
      color: '#00ACC1',
      description: 'Cloud Services',
      component: 'Cloud',
      category: 'services'
    }
  ];

  useEffect(() => {
    // Simulate loading system status
    setTimeout(() => {
      setSystemStatus({
        cpu: Math.floor(Math.random() * 100),
        memory: Math.floor(Math.random() * 100),
        storage: Math.floor(Math.random() * 100),
        network: Math.floor(Math.random() * 100),
        uptime: '2d 14h 32m',
        activeUsers: Math.floor(Math.random() * 50) + 10
      });
      setLoading(false);
    }, 1000);

    // Add some sample notifications
    setNotifications([
      { id: 1, title: 'System Update Available', message: 'New version 2.1.0 is ready', type: 'info', time: '2m ago' },
      { id: 2, title: 'AI Learning Complete', message: 'Model training finished successfully', type: 'success', time: '5m ago' },
      { id: 3, title: 'Storage Warning', message: 'Disk space is 85% full', type: 'warning', time: '10m ago' }
    ]);
  }, []);

  const handleAppClick = (app) => {
    setOpenApp(app);
    // Add to taskbar if not already there
    if (!taskbarApps.find(taskApp => taskApp.id === app.id)) {
      setTaskbarApps([...taskbarApps, { ...app, minimized: false }]);
    }
  };

  const handleCloseApp = (appId) => {
    setOpenApp(null);
    setTaskbarApps(taskbarApps.filter(app => app.id !== appId));
  };

  const handleMinimizeApp = (appId) => {
    setOpenApp(null);
    setTaskbarApps(taskbarApps.map(app => 
      app.id === appId ? { ...app, minimized: true } : app
    ));
  };

  const handleRestoreApp = (appId) => {
    const app = taskbarApps.find(app => app.id === appId);
    if (app) {
      setOpenApp(app);
      setTaskbarApps(taskbarApps.map(app => 
        app.id === appId ? { ...app, minimized: false } : app
      ));
    }
  };

  const getStatusColor = (value) => {
    if (value < 30) return '#4CAF50';
    if (value < 70) return '#FF9800';
    return '#F44336';
  };

  const getStatusIcon = (value) => {
    if (value < 30) return <CheckCircle />;
    if (value < 70) return <Warning />;
    return <Error />;
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} sx={{ color: 'white', mb: 2 }} />
          <Typography variant="h6" sx={{ color: 'white' }}>
            Loading AIOS Desktop...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Desktop Wallpaper Effect */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        animation: 'float 20s infinite linear',
        zIndex: 0
      }} />

      {/* Desktop Content */}
      <Box sx={{ position: 'relative', zIndex: 1, height: '100vh', display: 'flex', flexDirection: 'column' }}>
        
        {/* Top Bar */}
        <Box sx={{
          height: 40,
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255,255,255,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
              AIOS Desktop
            </Typography>
            <Chip 
              label={`Welcome, ${userProfile?.displayName || 'Guest'}`} 
              size="small" 
              sx={{ 
                background: 'rgba(255,255,255,0.2)', 
                color: 'white',
                fontWeight: 'bold'
              }} 
            />
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {systemStatus && (
              <>
                <Tooltip title={`CPU: ${systemStatus.cpu}%`}>
                  <Chip 
                    icon={getStatusIcon(systemStatus.cpu)} 
                    label={`CPU ${systemStatus.cpu}%`}
                    size="small"
                    sx={{ 
                      background: getStatusColor(systemStatus.cpu),
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                </Tooltip>
                <Tooltip title={`Memory: ${systemStatus.memory}%`}>
                  <Chip 
                    icon={getStatusIcon(systemStatus.memory)} 
                    label={`RAM ${systemStatus.memory}%`}
                    size="small"
                    sx={{ 
                      background: getStatusColor(systemStatus.memory),
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                </Tooltip>
                <Typography variant="caption" sx={{ color: 'white', ml: 1 }}>
                  Uptime: {systemStatus.uptime}
                </Typography>
              </>
            )}
          </Box>
        </Box>

        {/* Desktop Area */}
        <Box sx={{ flex: 1, p: 3, overflow: 'auto' }}>
          <Grid container spacing={3}>
            {/* Apps Grid */}
            <Grid item xs={12}>
              <Typography variant="h5" sx={{ color: 'white', mb: 2, fontWeight: 'bold' }}>
                Applications
              </Typography>
              <Grid container spacing={2}>
                {desktopApps.map((app, index) => (
                  <Grid item xs={6} sm={4} md={3} lg={2} key={app.id}>
                    <Fade in timeout={500 + index * 100}>
                      <Tooltip title={app.description}>
                        <Paper
                          onClick={() => handleAppClick(app)}
                          sx={{
                            p: 2,
                            textAlign: 'center',
                            cursor: 'pointer',
                            background: 'rgba(255,255,255,0.1)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: 3,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-4px) scale(1.05)',
                              background: 'rgba(255,255,255,0.2)',
                              boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                            }
                          }}
                        >
                          <Avatar
                            sx={{
                              width: 60,
                              height: 60,
                              background: app.color,
                              mx: 'auto',
                              mb: 1,
                              boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                            }}
                          >
                            {app.icon}
                          </Avatar>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: 'white', 
                              fontWeight: 'bold',
                              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                            }}
                          >
                            {app.name}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: 'rgba(255,255,255,0.8)',
                              fontSize: '0.7rem'
                            }}
                          >
                            {app.category}
                          </Typography>
                        </Paper>
                      </Tooltip>
                    </Fade>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {/* System Status */}
            {systemStatus && (
              <Grid item xs={12} md={6}>
                <Paper sx={{
                  p: 3,
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 3
                }}>
                  <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 'bold' }}>
                    System Status
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: 'white' }}>CPU Usage</Typography>
                      <Typography variant="body2" sx={{ color: 'white' }}>{systemStatus.cpu}%</Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={systemStatus.cpu} 
                      sx={{ 
                        height: 8, 
                        borderRadius: 4,
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: getStatusColor(systemStatus.cpu),
                          borderRadius: 4
                        }
                      }} 
                    />
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: 'white' }}>Memory Usage</Typography>
                      <Typography variant="body2" sx={{ color: 'white' }}>{systemStatus.memory}%</Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={systemStatus.memory} 
                      sx={{ 
                        height: 8, 
                        borderRadius: 4,
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: getStatusColor(systemStatus.memory),
                          borderRadius: 4
                        }
                      }} 
                    />
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: 'white' }}>Storage Usage</Typography>
                      <Typography variant="body2" sx={{ color: 'white' }}>{systemStatus.storage}%</Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={systemStatus.storage} 
                      sx={{ 
                        height: 8, 
                        borderRadius: 4,
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: getStatusColor(systemStatus.storage),
                          borderRadius: 4
                        }
                      }} 
                    />
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Typography variant="body2" sx={{ color: 'white' }}>
                      Active Users: {systemStatus.activeUsers}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'white' }}>
                      Uptime: {systemStatus.uptime}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            )}

            {/* Notifications */}
            <Grid item xs={12} md={6}>
              <Paper sx={{
                p: 3,
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 3
              }}>
                <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 'bold' }}>
                  Notifications
                </Typography>
                
                <List>
                  {notifications.map((notification, index) => (
                    <React.Fragment key={notification.id}>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon>
                          {notification.type === 'success' && <CheckCircle sx={{ color: '#4CAF50' }} />}
                          {notification.type === 'warning' && <Warning sx={{ color: '#FF9800' }} />}
                          {notification.type === 'error' && <Error sx={{ color: '#F44336' }} />}
                          {notification.type === 'info' && <Info sx={{ color: '#2196F3' }} />}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
                              {notification.title}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                              {notification.message} • {notification.time}
                            </Typography>
                          }
                        />
                      </ListItem>
                      {index < notifications.length - 1 && <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />}
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* Taskbar */}
        <Box sx={{
          height: 60,
          background: 'rgba(0,0,0,0.3)',
          backdropFilter: 'blur(10px)',
          borderTop: '1px solid rgba(255,255,255,0.2)',
          display: 'flex',
          alignItems: 'center',
          px: 2,
          gap: 1
        }}>
          <Button
            onClick={() => setShowStartMenu(!showStartMenu)}
            sx={{
              minWidth: 40,
              height: 40,
              borderRadius: 2,
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              '&:hover': {
                background: 'rgba(255,255,255,0.2)'
              }
            }}
          >
            <Apps />
          </Button>
          
          {taskbarApps.map((app) => (
            <Tooltip key={app.id} title={app.name}>
              <Button
                onClick={() => app.minimized ? handleRestoreApp(app.id) : handleMinimizeApp(app.id)}
                sx={{
                  minWidth: 40,
                  height: 40,
                  borderRadius: 2,
                  background: app.minimized ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)',
                  color: 'white',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.3)'
                  }
                }}
              >
                {app.icon}
              </Button>
            </Tooltip>
          ))}
        </Box>
      </Box>

      {/* App Window */}
      {openApp && (
        <Dialog
          open={!!openApp}
          onClose={() => handleCloseApp(openApp.id)}
          maxWidth="lg"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
            }
          }}
        >
          <DialogTitle sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: `linear-gradient(45deg, ${openApp.color}, ${openApp.color}dd)`,
            color: 'white',
            fontWeight: 'bold'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {openApp.icon}
              {openApp.name}
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton size="small" onClick={() => handleMinimizeApp(openApp.id)} sx={{ color: 'white' }}>
                <Minimize />
              </IconButton>
              <IconButton size="small" onClick={() => handleCloseApp(openApp.id)} sx={{ color: 'white' }}>
                <Close />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {openApp.description}
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              This is the {openApp.name} application. The full functionality would be implemented here.
            </Typography>
          </DialogContent>
        </Dialog>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          100% { transform: translateY(-100px); }
        }
      `}</style>
    </Box>
  );
};

export default Desktop;
