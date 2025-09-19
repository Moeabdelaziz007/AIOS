import {
  SmartToy as AgentIcon,
  Chat as ChatIcon,
  Close as CloseIcon,
  Dashboard as DashboardIcon,
  Storage as DatabaseIcon,
  Computer as DesktopIcon,
  Gesture as GestureIcon,
  AutoAwesome as MagicIcon,
  Memory as MemoryIcon,
  Menu as MenuIcon,
  PhoneAndroid as MobileIcon,
  Monitor as MonitorIcon,
  Notifications as NotificationsIcon,
  PlayArrow as PlayIcon,
  Refresh as RefreshIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon,
  TabletAndroid as TabletIcon,
  TouchApp as TouchIcon,
  Tune as TuneIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import {
  AppBar,
  Avatar,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  CircularProgress,
  Container,
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
  Paper,
  Select,
  SwipeableDrawer,
  Switch,
  Tab,
  Tabs,
  Toolbar,
  Tooltip,
  Typography,
  Zoom,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { animations, commonStyles } from '../theme/aiosTheme';

const MobileResponsiveAIComponent = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [deviceType, setDeviceType] = useState('desktop');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bottomNavValue, setBottomNavValue] = useState(0);
  const [gestureEnabled, setGestureEnabled] = useState(false);
  const [touchOptimized, setTouchOptimized] = useState(true);
  const [aiAgents, setAiAgents] = useState([]);
  const [systemMetrics, setSystemMetrics] = useState({});

  // Detect Device Type
  useEffect(() => {
    if (isMobile) {
      setDeviceType('mobile');
    } else if (isTablet) {
      setDeviceType('tablet');
    } else {
      setDeviceType('desktop');
    }
  }, [isMobile, isTablet]);

  // AI Agents Configuration
  const initializeAgents = useCallback(() => {
    const agents = [
      {
        id: 'quantum-autopilot',
        name: 'Quantum Autopilot',
        description: 'Advanced AI system for automated task management',
        status: 'active',
        performance: 95,
        tasksCompleted: 1247,
        icon: <MagicIcon />,
        color: '#667eea',
        mobileOptimized: true,
        touchFriendly: true
      },
      {
        id: 'data-agent',
        name: 'Data Intelligence Agent',
        description: 'AI-powered data processing and analysis',
        status: 'active',
        performance: 88,
        tasksCompleted: 892,
        icon: <DatabaseIcon />,
        color: '#43e97b',
        mobileOptimized: true,
        touchFriendly: true
      },
      {
        id: 'debug-agent',
        name: 'Intelligent Debugger',
        description: 'AI-powered debugging and error resolution',
        status: 'active',
        performance: 92,
        tasksCompleted: 156,
        icon: <TuneIcon />,
        color: '#fa709a',
        mobileOptimized: false,
        touchFriendly: false
      },
      {
        id: 'learning-agent',
        name: 'Learning Loop Agent',
        description: 'Continuous learning and adaptation system',
        status: 'active',
        performance: 78,
        tasksCompleted: 2341,
        icon: <MemoryIcon />,
        color: '#f093fb',
        mobileOptimized: true,
        touchFriendly: true
      },
      {
        id: 'security-agent',
        name: 'Security Guardian',
        description: 'AI-powered security monitoring',
        status: 'active',
        performance: 96,
        tasksCompleted: 445,
        icon: <SecurityIcon />,
        color: '#4facfe',
        mobileOptimized: true,
        touchFriendly: true
      },
      {
        id: 'communication-agent',
        name: 'Communication Coordinator',
        description: 'AI-powered communication system',
        status: 'active',
        performance: 85,
        tasksCompleted: 678,
        icon: <ChatIcon />,
        color: '#a8edea',
        mobileOptimized: true,
        touchFriendly: true
      }
    ];

    setAiAgents(agents);
  }, []);

  // System Metrics
  const initializeMetrics = useCallback(() => {
    const metrics = {
      overall: 92,
      agents: 95,
      performance: 88,
      security: 96,
      uptime: 99.8,
      mobileOptimization: 85,
      touchResponsiveness: 90,
      gestureRecognition: 78
    };

    setSystemMetrics(metrics);
  }, []);

  // Touch Optimization
  const optimizeForTouch = useCallback(() => {
    if (touchOptimized) {
      // Increase touch targets
      document.body.style.setProperty('--touch-target-size', '44px');
      // Add haptic feedback simulation
      console.log('Touch optimization enabled');
    }
  }, [touchOptimized]);

  useEffect(() => {
    setLoading(false);
    initializeAgents();
    initializeMetrics();
    optimizeForTouch();
  }, [initializeAgents, initializeMetrics, optimizeForTouch]);

  // Mobile Navigation Component
  const MobileNavigation = () => (
    <BottomNavigation
      value={bottomNavValue}
      onChange={(event, newValue) => {
        setBottomNavValue(newValue);
        setActiveTab(newValue);
      }}
      showLabels
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: 'background.paper',
        borderTop: 1,
        borderColor: 'divider'
      }}
    >
      <BottomNavigationAction label='Dashboard' icon={<DashboardIcon />} sx={{ minWidth: 'auto' }} />
      <BottomNavigationAction label='Agents' icon={<AgentIcon />} sx={{ minWidth: 'auto' }} />
      <BottomNavigationAction label='Monitoring' icon={<MonitorIcon />} sx={{ minWidth: 'auto' }} />
      <BottomNavigationAction label='Settings' icon={<SettingsIcon />} sx={{ minWidth: 'auto' }} />
    </BottomNavigation>
  );

  // Mobile Header Component
  const MobileHeader = () => (
    <AppBar position='sticky' sx={{ backgroundColor: 'background.paper', color: 'text.primary' }}>
      <Toolbar>
        <IconButton edge='start' color='inherit' onClick={() => setMobileMenuOpen(true)} sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>
        <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
          AIOS Mobile
        </Typography>
        <IconButton color='inherit'>
          <NotificationsIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );

  // Mobile Drawer Component
  const MobileDrawer = () => (
    <SwipeableDrawer
      anchor='left'
      open={mobileMenuOpen}
      onClose={() => setMobileMenuOpen(false)}
      onOpen={() => setMobileMenuOpen(true)}
      sx={{
        '& .MuiDrawer-paper': {
          width: 280,
          backgroundColor: 'background.paper'
        }
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
          <Typography variant='h6'>AIOS Menu</Typography>
          <IconButton onClick={() => setMobileMenuOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        <List>
          <ListItem
            button
            onClick={() => {
              setActiveTab(0);
              setMobileMenuOpen(false);
            }}
          >
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary='Dashboard' />
          </ListItem>
          <ListItem
            button
            onClick={() => {
              setActiveTab(1);
              setMobileMenuOpen(false);
            }}
          >
            <ListItemIcon>
              <AgentIcon />
            </ListItemIcon>
            <ListItemText primary='AI Agents' />
          </ListItem>
          <ListItem
            button
            onClick={() => {
              setActiveTab(2);
              setMobileMenuOpen(false);
            }}
          >
            <ListItemIcon>
              <MonitorIcon />
            </ListItemIcon>
            <ListItemText primary='Monitoring' />
          </ListItem>
          <ListItem
            button
            onClick={() => {
              setActiveTab(3);
              setMobileMenuOpen(false);
            }}
          >
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary='Settings' />
          </ListItem>
        </List>

        <Divider sx={{ my: 2 }} />

        <Typography variant='subtitle2' gutterBottom>
          Mobile Features
        </Typography>
        <List dense>
          <ListItem>
            <ListItemIcon>
              <TouchIcon />
            </ListItemIcon>
            <ListItemText primary='Touch Optimized' />
            <Switch checked={touchOptimized} onChange={e => setTouchOptimized(e.target.checked)} size='small' />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <GestureIcon />
            </ListItemIcon>
            <ListItemText primary='Gesture Control' />
            <Switch checked={gestureEnabled} onChange={e => setGestureEnabled(e.target.checked)} size='small' />
          </ListItem>
        </List>
      </Box>
    </SwipeableDrawer>
  );

  // Responsive Agent Card Component
  const ResponsiveAgentCard = ({ agent, index }) => {
    const isMobileOptimized = agent.mobileOptimized;
    const isTouchFriendly = agent.touchFriendly;

    return (
      <Grid item xs={12} sm={6} md={4} lg={3} key={agent.id}>
        <Zoom in timeout={300 + index * 100}>
          <Card
            sx={{
              height: '100%',
              ...commonStyles.cardHover,
              // Mobile-specific styling
              ...(isMobile && {
                minHeight: '120px',
                '& .MuiCardContent-root': {
                  padding: 2
                }
              }),
              // Touch-friendly styling
              ...(isTouchFriendly && {
                '& .MuiButton-root': {
                  minHeight: '44px',
                  minWidth: '44px'
                }
              })
            }}
          >
            <CardContent>
              <Box display='flex' alignItems='center' mb={2}>
                <Avatar
                  sx={{
                    bgcolor: agent.color,
                    mr: 2,
                    width: isMobile ? 40 : 48,
                    height: isMobile ? 40 : 48
                  }}
                >
                  {agent.icon}
                </Avatar>
                <Box flexGrow={1}>
                  <Typography variant={isMobile ? 'subtitle1' : 'h6'} sx={{ fontWeight: 600 }}>
                    {agent.name}
                  </Typography>
                  <Box display='flex' gap={1} flexWrap='wrap'>
                    <Chip label={agent.status} size='small' color={agent.status === 'active' ? 'success' : 'default'} />
                    {isMobileOptimized && <Chip icon={<MobileIcon />} label='Mobile' size='small' color='info' />}
                    {isTouchFriendly && <Chip icon={<TouchIcon />} label='Touch' size='small' color='secondary' />}
                  </Box>
                </Box>
              </Box>

              <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
                {agent.description}
              </Typography>

              <Box mb={2}>
                <Box display='flex' justifyContent='space-between' alignItems='center' mb={1}>
                  <Typography variant='body2'>Performance</Typography>
                  <Typography variant='body2' sx={{ fontWeight: 600 }}>
                    {agent.performance}%
                  </Typography>
                </Box>
                <LinearProgress variant='determinate' value={agent.performance} sx={{ height: 8, borderRadius: 4 }} />
              </Box>

              <Typography variant='body2' color='text.secondary'>
                Tasks: {agent.tasksCompleted}
              </Typography>
            </CardContent>

            <CardActions sx={{ justifyContent: 'space-between' }}>
              <Button
                size={isMobile ? 'medium' : 'small'}
                onClick={() => console.log('View details:', agent.id)}
                startIcon={<ViewIcon />}
                sx={{ minWidth: isMobile ? '44px' : 'auto' }}
              >
                Details
              </Button>
              <Button
                size={isMobile ? 'medium' : 'small'}
                onClick={() => console.log('Control agent:', agent.id)}
                startIcon={<PlayIcon />}
                color='success'
                sx={{ minWidth: isMobile ? '44px' : 'auto' }}
              >
                Control
              </Button>
            </CardActions>
          </Card>
        </Zoom>
      </Grid>
    );
  };

  if (loading) {
    return (
      <Container maxWidth='lg' sx={{ ...commonStyles.centerContent, flexDirection: 'column' }}>
        <CircularProgress size={80} thickness={4} />
        <Typography variant='h5' sx={{ mt: 3, ...commonStyles.gradientText }}>
          Optimizing for {deviceType}...
        </Typography>
        <Typography variant='body1' color='text.secondary' sx={{ mt: 1 }}>
          Please wait while we adapt the interface for your device
        </Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ pb: isMobile ? 7 : 0 }}>
      {/* Mobile Header */}
      {isMobile && <MobileHeader />}

      {/* Mobile Drawer */}
      {isMobile && <MobileDrawer />}

      <Container maxWidth='lg' sx={{ mt: isMobile ? 2 : 4, mb: 4 }}>
        {/* Responsive Header */}
        <Paper
          elevation={0}
          sx={{
            p: isMobile ? 2 : 4,
            mb: 4,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: 3,
            ...animations.fadeIn,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Device-specific Animation */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
              animation: 'pulse 4s ease-in-out infinite'
            }}
          />

          <Box display='flex' justifyContent='space-between' alignItems='center' position='relative' zIndex={1}>
            <Box>
              <Typography
                variant={isMobile ? 'h4' : 'h3'}
                component='h1'
                gutterBottom
                sx={{
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}
              >
                {deviceType === 'mobile' ? (
                  <MobileIcon sx={{ fontSize: '2rem' }} />
                ) : deviceType === 'tablet' ? (
                  <TabletIcon sx={{ fontSize: '2rem' }} />
                ) : (
                  <DesktopIcon sx={{ fontSize: '2rem' }} />
                )}
                AIOS {deviceType.charAt(0).toUpperCase() + deviceType.slice(1)}
              </Typography>
              <Typography variant={isMobile ? 'body1' : 'h6'} sx={{ opacity: 0.9 }}>
                Responsive AI interface optimized for {deviceType} devices
              </Typography>
              <Box mt={2} display='flex' gap={1} flexWrap='wrap'>
                <Chip
                  icon={<AgentIcon />}
                  label={`${aiAgents.length} AI Agents`}
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                  size={isMobile ? 'small' : 'medium'}
                />
                <Chip
                  icon={<TouchIcon />}
                  label={touchOptimized ? 'Touch Optimized' : 'Touch Disabled'}
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                  size={isMobile ? 'small' : 'medium'}
                />
                <Chip
                  icon={<GestureIcon />}
                  label={gestureEnabled ? 'Gestures Enabled' : 'Gestures Disabled'}
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                  size={isMobile ? 'small' : 'medium'}
                />
              </Box>
            </Box>
            {!isMobile && (
              <Box display='flex' gap={1}>
                <Tooltip title='Refresh Data'>
                  <IconButton
                    onClick={() => console.log('Refresh data')}
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                    }}
                  >
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title='Settings'>
                  <IconButton
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                    }}
                  >
                    <SettingsIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          </Box>
        </Paper>

        {/* Device-Specific Metrics */}
        <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
          <Typography variant='h5' gutterBottom sx={{ ...commonStyles.gradientText }}>
            📱 {deviceType.charAt(0).toUpperCase() + deviceType.slice(1)} Optimization
          </Typography>
          <Grid container spacing={3}>
            {Object.entries(systemMetrics).map(([key, value]) => (
              <Grid item xs={6} sm={4} md={2.4} key={key}>
                <Card sx={{ textAlign: 'center', ...commonStyles.cardHover }}>
                  <CardContent sx={{ p: isMobile ? 1 : 2 }}>
                    <Typography
                      variant={isMobile ? 'h5' : 'h4'}
                      sx={{
                        fontWeight: 700,
                        color: value > 90 ? '#4caf50' : value > 70 ? '#ff9800' : '#f44336'
                      }}
                    >
                      {value}%
                    </Typography>
                    <Typography
                      variant={isMobile ? 'caption' : 'body2'}
                      color='text.secondary'
                      sx={{ textTransform: 'capitalize' }}
                    >
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </Typography>
                    <LinearProgress variant='determinate' value={value} sx={{ mt: 1, height: 4, borderRadius: 2 }} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Responsive Tabbed Interface */}
        <Paper elevation={2} sx={{ borderRadius: 3 }}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{ borderBottom: 1, borderColor: 'divider' }}
            variant={isMobile ? 'scrollable' : 'standard'}
            scrollButtons={isMobile ? 'auto' : false}
          >
            <Tab
              icon={<DashboardIcon />}
              label={isMobile ? '' : 'Dashboard'}
              iconPosition={isMobile ? 'top' : 'start'}
              sx={{ textTransform: 'none', fontWeight: 600 }}
            />
            <Tab
              icon={<AgentIcon />}
              label={isMobile ? '' : 'AI Agents'}
              iconPosition={isMobile ? 'top' : 'start'}
              sx={{ textTransform: 'none', fontWeight: 600 }}
            />
            <Tab
              icon={<MonitorIcon />}
              label={isMobile ? '' : 'Monitoring'}
              iconPosition={isMobile ? 'top' : 'start'}
              sx={{ textTransform: 'none', fontWeight: 600 }}
            />
            <Tab
              icon={<SettingsIcon />}
              label={isMobile ? '' : 'Settings'}
              iconPosition={isMobile ? 'top' : 'start'}
              sx={{ textTransform: 'none', fontWeight: 600 }}
            />
          </Tabs>

          {/* Dashboard Tab */}
          {activeTab === 0 && (
            <Box sx={{ p: isMobile ? 2 : 3 }}>
              <Typography variant='h5' gutterBottom sx={{ mb: 3, ...commonStyles.gradientText }}>
                📊 System Overview
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant='h6' gutterBottom>
                        Device Information
                      </Typography>
                      <List dense>
                        <ListItem>
                          <ListItemIcon>
                            <MobileIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary='Device Type'
                            secondary={deviceType.charAt(0).toUpperCase() + deviceType.slice(1)}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <TouchIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary='Touch Optimization'
                            secondary={touchOptimized ? 'Enabled' : 'Disabled'}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <GestureIcon />
                          </ListItemIcon>
                          <ListItemText primary='Gesture Control' secondary={gestureEnabled ? 'Enabled' : 'Disabled'} />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant='h6' gutterBottom>
                        Mobile Features
                      </Typography>
                      <Box display='flex' flexDirection='column' gap={2}>
                        <FormControlLabel
                          control={
                            <Switch checked={touchOptimized} onChange={e => setTouchOptimized(e.target.checked)} />
                          }
                          label='Touch Optimization'
                        />
                        <FormControlLabel
                          control={
                            <Switch checked={gestureEnabled} onChange={e => setGestureEnabled(e.target.checked)} />
                          }
                          label='Gesture Control'
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* AI Agents Tab */}
          {activeTab === 1 && (
            <Box sx={{ p: isMobile ? 2 : 3 }}>
              <Typography variant='h5' gutterBottom sx={{ mb: 3, ...commonStyles.gradientText }}>
                🤖 AI Agents
              </Typography>
              <Grid container spacing={3}>
                {aiAgents.map((agent, index) => (
                  <ResponsiveAgentCard key={agent.id} agent={agent} index={index} />
                ))}
              </Grid>
            </Box>
          )}

          {/* Monitoring Tab */}
          {activeTab === 2 && (
            <Box sx={{ p: isMobile ? 2 : 3 }}>
              <Typography variant='h5' gutterBottom sx={{ mb: 3, ...commonStyles.gradientText }}>
                📈 Real-time Monitoring
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant='h6' gutterBottom>
                        System Performance
                      </Typography>
                      <Box mt={2}>
                        {Object.entries(systemMetrics).map(([key, value]) => (
                          <Box key={key} mb={2}>
                            <Box display='flex' justifyContent='space-between' alignItems='center' mb={1}>
                              <Typography variant='body2'>{key.replace(/([A-Z])/g, ' $1').trim()}</Typography>
                              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                                {value}%
                              </Typography>
                            </Box>
                            <LinearProgress variant='determinate' value={value} sx={{ height: 8, borderRadius: 4 }} />
                          </Box>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Settings Tab */}
          {activeTab === 3 && (
            <Box sx={{ p: isMobile ? 2 : 3 }}>
              <Typography variant='h5' gutterBottom sx={{ mb: 3, ...commonStyles.gradientText }}>
                ⚙️ Mobile Settings
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant='h6' gutterBottom>
                        Touch & Gesture Settings
                      </Typography>
                      <Box display='flex' flexDirection='column' gap={2}>
                        <FormControlLabel
                          control={
                            <Switch checked={touchOptimized} onChange={e => setTouchOptimized(e.target.checked)} />
                          }
                          label='Touch Optimization'
                        />
                        <FormControlLabel
                          control={
                            <Switch checked={gestureEnabled} onChange={e => setGestureEnabled(e.target.checked)} />
                          }
                          label='Gesture Control'
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant='h6' gutterBottom>
                        Mobile Preferences
                      </Typography>
                      <Box display='flex' flexDirection='column' gap={2}>
                        <FormControl fullWidth>
                          <InputLabel>Theme</InputLabel>
                          <Select value='dark' disabled>
                            <MenuItem value='dark'>Dark</MenuItem>
                            <MenuItem value='light'>Light</MenuItem>
                          </Select>
                        </FormControl>
                        <FormControl fullWidth>
                          <InputLabel>Language</InputLabel>
                          <Select value='en' disabled>
                            <MenuItem value='en'>English</MenuItem>
                            <MenuItem value='es'>Spanish</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}
        </Paper>

        {/* Mobile Bottom Navigation */}
        {isMobile && <MobileNavigation />}
      </Container>
    </Box>
  );
};

export default MobileResponsiveAIComponent;
