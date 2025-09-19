import {
  Psychology as AIIcon,
  Add as AddIcon,
  SmartToy as AgentIcon,
  Chat as ChatIcon,
  Dashboard as DashboardIcon,
  Storage as DatabaseIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Insights as InsightsIcon,
  Launch as LaunchIcon,
  AutoAwesome as MagicIcon,
  Memory as MemoryIcon,
  Speed as PerformanceIcon,
  PlayArrow as PlayIcon,
  Refresh as RefreshIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon,
  Star as StarIcon,
  Stop as StopIcon,
  Timeline as TimelineIcon,
  Tune as TuneIcon,
  Visibility as ViewIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fade,
  Grid,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Tab,
  Tabs,
  Tooltip,
  Typography,
  Zoom,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAIOSIntegration } from '../services/AIOSIntegrationService';
import {
  animations,
  appCategoryColors,
  commonStyles,
} from '../theme/aiosTheme';

const AIPoweredAppsPage = () => {
  const { userProfile } = useAuth();
  const { loading, refreshAll } = useAIOSIntegration();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [agentDialogOpen, setAgentDialogOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [agentStatus, setAgentStatus] = useState({});
  const [aiInsights, setAiInsights] = useState([]);

  // AI Agents Configuration using useMemo to prevent re-creation
  const aiAgents = useMemo(
    () => [
      {
        id: 'quantum-autopilot',
        name: 'Quantum Autopilot',
        description:
          'Advanced AI system for automated task management and optimization',
        status: 'active',
        performance: 95,
        tasksCompleted: 1247,
        icon: <MagicIcon />,
        color: '#667eea',
        capabilities: [
          'Task Automation',
          'Performance Optimization',
          'Error Detection',
          'Predictive Analysis',
        ],
        lastActivity: '2 minutes ago',
      },
      {
        id: 'data-agent',
        name: 'Data Intelligence Agent',
        description: 'AI-powered data processing and analysis system',
        status: 'active',
        performance: 88,
        tasksCompleted: 892,
        icon: <DatabaseIcon />,
        color: '#43e97b',
        capabilities: [
          'Data Processing',
          'Pattern Recognition',
          'Predictive Analytics',
          'Real-time Analysis',
        ],
        lastActivity: '5 minutes ago',
      },
      {
        id: 'debug-agent',
        name: 'Intelligent Debugger',
        description: 'AI-powered debugging and error resolution system',
        status: 'active',
        performance: 92,
        tasksCompleted: 156,
        icon: <TuneIcon />,
        color: '#fa709a',
        capabilities: [
          'Error Detection',
          'Auto-fix Suggestions',
          'Code Analysis',
          'Performance Monitoring',
        ],
        lastActivity: '1 minute ago',
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
        capabilities: [
          'Pattern Learning',
          'Behavior Adaptation',
          'Knowledge Building',
          'Continuous Improvement',
        ],
        lastActivity: '3 minutes ago',
      },
      {
        id: 'security-agent',
        name: 'Security Guardian',
        description: 'AI-powered security monitoring and threat detection',
        status: 'active',
        performance: 96,
        tasksCompleted: 445,
        icon: <SecurityIcon />,
        color: '#4facfe',
        capabilities: [
          'Threat Detection',
          'Security Analysis',
          'Access Control',
          'Risk Assessment',
        ],
        lastActivity: '30 seconds ago',
      },
      {
        id: 'communication-agent',
        name: 'Communication Coordinator',
        description: 'AI-powered communication and collaboration system',
        status: 'active',
        performance: 85,
        tasksCompleted: 678,
        icon: <ChatIcon />,
        color: '#a8edea',
        capabilities: [
          'Message Processing',
          'Context Understanding',
          'Response Generation',
          'Collaboration',
        ],
        lastActivity: '1 minute ago',
      },
    ],
    []
  );

  const defaultApps = useMemo(
    () => [
      {
        id: 'dashboard',
        name: 'AI Dashboard',
        description: 'Comprehensive AI-powered system overview and analytics',
        icon: <DashboardIcon />,
        color: appCategoryColors.core,
        category: 'core',
        status: 'active',
        featured: true,
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      },
      {
        id: 'settings',
        name: 'AI Settings',
        description: 'Intelligent system configuration and preferences',
        icon: <SettingsIcon />,
        color: appCategoryColors.core,
        category: 'core',
        status: 'active',
        featured: false,
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      },
      {
        id: 'chat',
        name: 'AI Chat',
        description: 'Advanced AI-powered communication system',
        icon: <ChatIcon />,
        color: appCategoryColors.communication,
        category: 'communication',
        status: 'active',
        featured: true,
        gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      },
      {
        id: 'database',
        name: 'AI Database',
        description: 'Intelligent data management and processing',
        icon: <DatabaseIcon />,
        color: appCategoryColors.data,
        category: 'data',
        status: 'active',
        featured: false,
        gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      },
      {
        id: 'security',
        name: 'AI Security',
        description: 'Advanced AI-powered security monitoring',
        icon: <SecurityIcon />,
        color: appCategoryColors.security,
        category: 'security',
        status: 'active',
        featured: true,
        gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      },
      {
        id: 'performance',
        name: 'AI Performance',
        description: 'Intelligent performance optimization',
        icon: <PerformanceIcon />,
        color: appCategoryColors.optimization,
        category: 'optimization',
        status: 'active',
        featured: false,
        gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      },
    ],
    []
  );

  // AI Agent Management Functions
  const handleAgentControl = (agentId, action) => {
    console.log(`Agent ${agentId} ${action} requested`);
    setAgentStatus(prev => ({
      ...prev,
      [agentId]: {
        ...prev[agentId],
        status:
          action === 'start'
            ? 'active'
            : action === 'stop'
            ? 'inactive'
            : prev[agentId]?.status,
      },
    }));
  };

  const handleAgentDialog = agent => {
    setSelectedAgent(agent);
    setAgentDialogOpen(true);
  };

  const generateAIInsights = () => {
    const insights = [
      {
        id: 1,
        type: 'optimization',
        title: 'Performance Optimization Opportunity',
        description:
          'Quantum Autopilot suggests optimizing memory usage for 15% performance improvement',
        priority: 'high',
        agent: 'quantum-autopilot',
        timestamp: new Date().toISOString(),
      },
      {
        id: 2,
        type: 'security',
        title: 'Security Enhancement Detected',
        description:
          'Security Guardian recommends updating authentication protocols',
        priority: 'medium',
        agent: 'security-agent',
        timestamp: new Date().toISOString(),
      },
      {
        id: 3,
        type: 'learning',
        title: 'Pattern Recognition Update',
        description:
          'Learning Loop Agent identified new user behavior patterns',
        priority: 'low',
        agent: 'learning-agent',
        timestamp: new Date().toISOString(),
      },
    ];
    setAiInsights(insights);
  };

  useEffect(() => {
    generateAIInsights();
    const interval = setInterval(() => {
      setAgentStatus(prev => {
        const newStatus = { ...prev };
        aiAgents.forEach(agent => {
          if (!newStatus[agent.id]) {
            newStatus[agent.id] = {
              status: agent.status,
              performance: agent.performance,
              tasksCompleted: agent.tasksCompleted,
              lastActivity: agent.lastActivity,
            };
          }
        });
        return newStatus;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [aiAgents]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshAll();
      generateAIInsights();
    } catch (error) {
      console.error('Error refreshing apps:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleAppClick = appId => {
    console.log(`Opening app: ${appId}`);
  };

  const getStatusColor = status => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'default';
      case 'error':
        return 'error';
      case 'loading':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusText = status => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'inactive':
        return 'Inactive';
      case 'error':
        return 'Error';
      case 'loading':
        return 'Loading';
      default:
        return 'Unknown';
    }
  };

  if (loading) {
    return (
      <Container
        maxWidth='lg'
        sx={{ ...commonStyles.centerContent, flexDirection: 'column' }}
      >
        <CircularProgress size={80} thickness={4} />
        <Typography variant='h5' sx={{ mt: 3, ...commonStyles.gradientText }}>
          Loading AI Systems...
        </Typography>
        <Typography variant='body1' color='text.secondary' sx={{ mt: 1 }}>
          Please wait while we initialize the AI agents
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
      {/* AI-Powered Header Section */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 3,
          ...animations.fadeIn,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* AI Background Animation */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            animation: 'pulse 4s ease-in-out infinite',
          }}
        />

        <Box
          display='flex'
          justifyContent='space-between'
          alignItems='center'
          position='relative'
          zIndex={1}
        >
          <Box>
            <Typography
              variant='h3'
              component='h1'
              gutterBottom
              sx={{
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <AIIcon sx={{ fontSize: '2.5rem' }} />
              AI-Powered Applications
            </Typography>
            <Typography variant='h6' sx={{ opacity: 0.9 }}>
              Welcome {userProfile?.displayName || 'User'}, manage your AI
              agents and applications
            </Typography>
            <Box mt={2} display='flex' gap={2} flexWrap='wrap'>
              <Chip
                icon={<AgentIcon />}
                label={`${aiAgents.length} AI Agents`}
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
              <Chip
                icon={<MagicIcon />}
                label={`${defaultApps.length} Applications`}
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
              <Chip
                label={userProfile?.role || 'User'}
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
            </Box>
          </Box>
          <Box display='flex' gap={1}>
            <Tooltip title='Refresh AI Systems'>
              <IconButton
                onClick={handleRefresh}
                disabled={refreshing}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title='Add New AI Agent'>
              <IconButton
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                }}
              >
                <AddIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Paper>

      {/* AI Insights Section */}
      {aiInsights.length > 0 && (
        <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
          <Typography
            variant='h5'
            gutterBottom
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              ...commonStyles.gradientText,
            }}
          >
            <InsightsIcon />
            AI Insights & Recommendations
          </Typography>
          <Grid container spacing={2}>
            {aiInsights.map((insight, index) => (
              <Grid item xs={12} md={4} key={insight.id}>
                <Card sx={{ height: '100%', ...commonStyles.cardHover }}>
                  <CardContent>
                    <Box display='flex' alignItems='center' mb={2}>
                      <Avatar
                        sx={{
                          bgcolor:
                            insight.priority === 'high'
                              ? '#f44336'
                              : insight.priority === 'medium'
                              ? '#ff9800'
                              : '#4caf50',
                          mr: 2,
                        }}
                      >
                        {insight.priority === 'high' ? (
                          <ErrorIcon />
                        ) : insight.priority === 'medium' ? (
                          <WarningIcon />
                        ) : (
                          <InfoIcon />
                        )}
                      </Avatar>
                      <Box>
                        <Typography
                          variant='subtitle2'
                          sx={{ fontWeight: 600 }}
                        >
                          {insight.title}
                        </Typography>
                        <Chip
                          label={insight.priority}
                          size='small'
                          color={
                            insight.priority === 'high'
                              ? 'error'
                              : insight.priority === 'medium'
                              ? 'warning'
                              : 'success'
                          }
                        />
                      </Box>
                    </Box>
                    <Typography variant='body2' color='text.secondary'>
                      {insight.description}
                    </Typography>
                    <Typography
                      variant='caption'
                      color='text.secondary'
                      sx={{ mt: 1, display: 'block' }}
                    >
                      Agent: {insight.agent} •{' '}
                      {new Date(insight.timestamp).toLocaleTimeString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {/* Tabbed Interface */}
      <Paper elevation={2} sx={{ borderRadius: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab
            icon={<AgentIcon />}
            label='AI Agents'
            iconPosition='start'
            sx={{ textTransform: 'none', fontWeight: 600 }}
          />
          <Tab
            icon={<DashboardIcon />}
            label='Applications'
            iconPosition='start'
            sx={{ textTransform: 'none', fontWeight: 600 }}
          />
          <Tab
            icon={<TimelineIcon />}
            label='Analytics'
            iconPosition='start'
            sx={{ textTransform: 'none', fontWeight: 600 }}
          />
        </Tabs>

        {/* AI Agents Tab */}
        {activeTab === 0 && (
          <Box sx={{ p: 3 }}>
            <Typography
              variant='h5'
              gutterBottom
              sx={{ mb: 3, ...commonStyles.gradientText }}
            >
              🤖 AI Agent Management
            </Typography>
            <Grid container spacing={3}>
              {aiAgents.map((agent, index) => {
                const currentStatus = agentStatus[agent.id] || agent;
                return (
                  <Grid item xs={12} md={6} lg={4} key={agent.id}>
                    <Zoom in timeout={300 + index * 100}>
                      <Card sx={{ height: '100%', ...commonStyles.cardHover }}>
                        <CardContent>
                          <Box display='flex' alignItems='center' mb={2}>
                            <Avatar
                              sx={{
                                bgcolor: agent.color,
                                mr: 2,
                                width: 56,
                                height: 56,
                              }}
                            >
                              {agent.icon}
                            </Avatar>
                            <Box flexGrow={1}>
                              <Typography variant='h6' sx={{ fontWeight: 600 }}>
                                {agent.name}
                              </Typography>
                              <Box display='flex' alignItems='center' gap={1}>
                                <Chip
                                  label={currentStatus.status}
                                  size='small'
                                  color={
                                    currentStatus.status === 'active'
                                      ? 'success'
                                      : 'default'
                                  }
                                />
                                <Typography
                                  variant='caption'
                                  color='text.secondary'
                                >
                                  {currentStatus.lastActivity}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>

                          <Typography
                            variant='body2'
                            color='text.secondary'
                            sx={{ mb: 2 }}
                          >
                            {agent.description}
                          </Typography>

                          <Box mb={2}>
                            <Box
                              display='flex'
                              justifyContent='space-between'
                              alignItems='center'
                              mb={1}
                            >
                              <Typography variant='body2'>
                                Performance
                              </Typography>
                              <Typography
                                variant='body2'
                                sx={{ fontWeight: 600 }}
                              >
                                {currentStatus.performance}%
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant='determinate'
                              value={currentStatus.performance}
                              sx={{ height: 8, borderRadius: 4 }}
                            />
                          </Box>

                          <Box
                            display='flex'
                            justifyContent='space-between'
                            alignItems='center'
                            mb={2}
                          >
                            <Typography variant='body2' color='text.secondary'>
                              Tasks Completed: {currentStatus.tasksCompleted}
                            </Typography>
                            <Badge
                              badgeContent={agent.capabilities.length}
                              color='primary'
                            >
                              <Tooltip title='Capabilities'>
                                <IconButton size='small'>
                                  <ViewIcon />
                                </IconButton>
                              </Tooltip>
                            </Badge>
                          </Box>

                          <Box display='flex' gap={1} flexWrap='wrap'>
                            {agent.capabilities
                              .slice(0, 2)
                              .map((capability, idx) => (
                                <Chip
                                  key={idx}
                                  label={capability}
                                  size='small'
                                  sx={{ fontSize: '0.7rem', height: 24 }}
                                />
                              ))}
                            {agent.capabilities.length > 2 && (
                              <Chip
                                label={`+${agent.capabilities.length - 2}`}
                                size='small'
                                sx={{ fontSize: '0.7rem', height: 24 }}
                              />
                            )}
                          </Box>
                        </CardContent>

                        <CardActions>
                          <Button
                            size='small'
                            onClick={() => handleAgentDialog(agent)}
                            startIcon={<ViewIcon />}
                          >
                            Details
                          </Button>
                          <Button
                            size='small'
                            onClick={() =>
                              handleAgentControl(agent.id, 'start')
                            }
                            startIcon={<PlayIcon />}
                            color='success'
                          >
                            Start
                          </Button>
                          <Button
                            size='small'
                            onClick={() => handleAgentControl(agent.id, 'stop')}
                            startIcon={<StopIcon />}
                            color='error'
                          >
                            Stop
                          </Button>
                        </CardActions>
                      </Card>
                    </Zoom>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        )}

        {/* Applications Tab */}
        {activeTab === 1 && (
          <Box sx={{ p: 3 }}>
            <Typography
              variant='h5'
              gutterBottom
              sx={{ mb: 3, ...commonStyles.gradientText }}
            >
              📱 Applications
            </Typography>
            <Grid container spacing={3}>
              {defaultApps.map((app, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={app.id}>
                  <Fade in timeout={500 + index * 100}>
                    <Card sx={{ height: '100%', ...commonStyles.cardHover }}>
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box display='flex' alignItems='center' mb={2}>
                          <Avatar
                            sx={{
                              bgcolor: app.color,
                              mr: 2,
                              width: 48,
                              height: 48,
                            }}
                          >
                            {app.icon}
                          </Avatar>
                          <Box>
                            <Typography
                              variant='h6'
                              component='h2'
                              sx={{ fontWeight: 600 }}
                            >
                              {app.name}
                            </Typography>
                            <Chip
                              label={getStatusText(app.status)}
                              color={getStatusColor(app.status)}
                              size='small'
                              sx={{ mt: 0.5 }}
                            />
                          </Box>
                        </Box>
                        <Typography
                          variant='body2'
                          color='text.secondary'
                          sx={{ mb: 2 }}
                        >
                          {app.description}
                        </Typography>
                        <Box display='flex' gap={1}>
                          <Chip
                            label={app.category}
                            size='small'
                            sx={{
                              bgcolor: app.color,
                              color: 'white',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                            }}
                          />
                          {app.featured && (
                            <Chip
                              icon={<StarIcon />}
                              label='Featured'
                              size='small'
                              color='warning'
                              sx={{ fontSize: '0.75rem' }}
                            />
                          )}
                        </Box>
                      </CardContent>
                      <CardActions>
                        <Button
                          size='small'
                          onClick={() => handleAppClick(app.id)}
                          disabled={
                            app.status === 'inactive' || app.status === 'error'
                          }
                          startIcon={<LaunchIcon />}
                        >
                          Launch
                        </Button>
                        <Button size='small' color='secondary'>
                          Settings
                        </Button>
                      </CardActions>
                    </Card>
                  </Fade>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Analytics Tab */}
        {activeTab === 2 && (
          <Box sx={{ p: 3 }}>
            <Typography
              variant='h5'
              gutterBottom
              sx={{ mb: 3, ...commonStyles.gradientText }}
            >
              📊 AI Analytics Dashboard
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant='h6' gutterBottom>
                      Agent Performance Overview
                    </Typography>
                    <List>
                      {aiAgents.map(agent => {
                        const currentStatus = agentStatus[agent.id] || agent;
                        return (
                          <ListItem key={agent.id}>
                            <ListItemIcon>
                              <Avatar
                                sx={{
                                  bgcolor: agent.color,
                                  width: 32,
                                  height: 32,
                                }}
                              >
                                {agent.icon}
                              </Avatar>
                            </ListItemIcon>
                            <ListItemText
                              primary={agent.name}
                              secondary={
                                <Box>
                                  <Typography
                                    variant='body2'
                                    color='text.secondary'
                                  >
                                    Performance: {currentStatus.performance}% |
                                    Tasks: {currentStatus.tasksCompleted}
                                  </Typography>
                                  <LinearProgress
                                    variant='determinate'
                                    value={currentStatus.performance}
                                    sx={{ mt: 1, height: 4 }}
                                  />
                                </Box>
                              }
                            />
                          </ListItem>
                        );
                      })}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant='h6' gutterBottom>
                      System Health Status
                    </Typography>
                    <Box mt={2}>
                      <Box
                        display='flex'
                        justifyContent='space-between'
                        alignItems='center'
                        mb={1}
                      >
                        <Typography variant='body2'>
                          Overall System Health
                        </Typography>
                        <Typography variant='body2' sx={{ fontWeight: 600 }}>
                          92%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant='determinate'
                        value={92}
                        sx={{ height: 8, borderRadius: 4, mb: 3 }}
                      />

                      <Box
                        display='flex'
                        justifyContent='space-between'
                        alignItems='center'
                        mb={1}
                      >
                        <Typography variant='body2'>AI Agent Uptime</Typography>
                        <Typography variant='body2' sx={{ fontWeight: 600 }}>
                          99.8%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant='determinate'
                        value={99.8}
                        sx={{ height: 8, borderRadius: 4, mb: 3 }}
                      />

                      <Box
                        display='flex'
                        justifyContent='space-between'
                        alignItems='center'
                        mb={1}
                      >
                        <Typography variant='body2'>
                          Task Success Rate
                        </Typography>
                        <Typography variant='body2' sx={{ fontWeight: 600 }}>
                          96.5%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant='determinate'
                        value={96.5}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>

      {/* Agent Details Dialog */}
      <Dialog
        open={agentDialogOpen}
        onClose={() => setAgentDialogOpen(false)}
        maxWidth='md'
        fullWidth
      >
        <DialogTitle>
          <Box display='flex' alignItems='center' gap={2}>
            <Avatar sx={{ bgcolor: selectedAgent?.color }}>
              {selectedAgent?.icon}
            </Avatar>
            <Box>
              <Typography variant='h6'>{selectedAgent?.name}</Typography>
              <Typography variant='body2' color='text.secondary'>
                {selectedAgent?.description}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedAgent && (
            <Box>
              <Typography variant='h6' gutterBottom>
                Capabilities
              </Typography>
              <Box display='flex' gap={1} flexWrap='wrap' mb={3}>
                {selectedAgent.capabilities.map((capability, index) => (
                  <Chip key={index} label={capability} color='primary' />
                ))}
              </Box>

              <Typography variant='h6' gutterBottom>
                Performance Metrics
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box
                    textAlign='center'
                    p={2}
                    sx={{ bgcolor: 'grey.50', borderRadius: 2 }}
                  >
                    <Typography variant='h4' color='primary'>
                      {selectedAgent.performance}%
                    </Typography>
                    <Typography variant='body2'>Performance</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box
                    textAlign='center'
                    p={2}
                    sx={{ bgcolor: 'grey.50', borderRadius: 2 }}
                  >
                    <Typography variant='h4' color='secondary'>
                      {selectedAgent.tasksCompleted}
                    </Typography>
                    <Typography variant='body2'>Tasks Completed</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAgentDialogOpen(false)}>Close</Button>
          <Button
            variant='contained'
            onClick={() => handleAgentControl(selectedAgent?.id, 'restart')}
          >
            Restart Agent
          </Button>
        </DialogActions>
      </Dialog>

      <Box mt={4} textAlign='center'>
        <Typography variant='body2' color='text.secondary'>
          Total Applications: {defaultApps.length} | AI Agents:{' '}
          {aiAgents.length} | User: {userProfile?.role || 'Unknown'}
        </Typography>
      </Box>
    </Container>
  );
};

export default AIPoweredAppsPage;
