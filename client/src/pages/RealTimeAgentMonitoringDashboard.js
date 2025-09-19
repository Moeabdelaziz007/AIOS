import {
  SmartToy as AgentIcon,
  Chat as ChatIcon,
  CheckCircle as CheckCircleIcon,
  Storage as DatabaseIcon,
  Download as DownloadIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Insights as InsightsIcon,
  AutoAwesome as MagicIcon,
  Memory as MemoryIcon,
  Monitor as MonitorIcon,
  PlayArrow as PlayIcon,
  Refresh as RefreshIcon,
  RestartAlt as RestartIcon,
  Search as SearchIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon,
  Stop as StopIcon,
  Timeline as TimelineIcon,
  TrendingUp as TrendingUpIcon,
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
  FormControl,
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
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
  Zoom,
} from '@mui/material';
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from '@mui/lab';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { animations, commonStyles } from '../theme/aiosTheme';

const RealTimeAgentMonitoringDashboard = () => {
  const { userProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [agentDetailsOpen, setAgentDetailsOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [realTimeData, setRealTimeData] = useState({});

  // AI Agents Configuration with real-time data
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
        tasksInProgress: 3,
        icon: <MagicIcon />,
        color: '#667eea',
        capabilities: [
          'Task Automation',
          'Performance Optimization',
          'Error Detection',
          'Predictive Analysis',
        ],
        lastActivity: '2 minutes ago',
        uptime: '99.8%',
        memoryUsage: 78,
        cpuUsage: 65,
        networkLatency: 12,
        errorRate: 0.2,
        responseTime: 45,
        throughput: 156,
      },
      {
        id: 'data-agent',
        name: 'Data Intelligence Agent',
        description: 'AI-powered data processing and analysis system',
        status: 'active',
        performance: 88,
        tasksCompleted: 892,
        tasksInProgress: 5,
        icon: <DatabaseIcon />,
        color: '#43e97b',
        capabilities: [
          'Data Processing',
          'Pattern Recognition',
          'Predictive Analytics',
          'Real-time Analysis',
        ],
        lastActivity: '5 minutes ago',
        uptime: '99.5%',
        memoryUsage: 85,
        cpuUsage: 72,
        networkLatency: 8,
        errorRate: 0.1,
        responseTime: 32,
        throughput: 234,
      },
      {
        id: 'debug-agent',
        name: 'Intelligent Debugger',
        description: 'AI-powered debugging and error resolution system',
        status: 'active',
        performance: 92,
        tasksCompleted: 156,
        tasksInProgress: 1,
        icon: <TuneIcon />,
        color: '#fa709a',
        capabilities: [
          'Error Detection',
          'Auto-fix Suggestions',
          'Code Analysis',
          'Performance Monitoring',
        ],
        lastActivity: '1 minute ago',
        uptime: '99.9%',
        memoryUsage: 62,
        cpuUsage: 58,
        networkLatency: 5,
        errorRate: 0.05,
        responseTime: 28,
        throughput: 89,
      },
      {
        id: 'learning-agent',
        name: 'Learning Loop Agent',
        description: 'Continuous learning and adaptation system',
        status: 'active',
        performance: 78,
        tasksCompleted: 2341,
        tasksInProgress: 8,
        icon: <MemoryIcon />,
        color: '#f093fb',
        capabilities: [
          'Pattern Learning',
          'Behavior Adaptation',
          'Knowledge Building',
          'Continuous Improvement',
        ],
        lastActivity: '3 minutes ago',
        uptime: '98.7%',
        memoryUsage: 92,
        cpuUsage: 88,
        networkLatency: 15,
        errorRate: 0.8,
        responseTime: 67,
        throughput: 445,
      },
      {
        id: 'security-agent',
        name: 'Security Guardian',
        description: 'AI-powered security monitoring and threat detection',
        status: 'active',
        performance: 96,
        tasksCompleted: 445,
        tasksInProgress: 2,
        icon: <SecurityIcon />,
        color: '#4facfe',
        capabilities: [
          'Threat Detection',
          'Security Analysis',
          'Access Control',
          'Risk Assessment',
        ],
        lastActivity: '30 seconds ago',
        uptime: '99.95%',
        memoryUsage: 45,
        cpuUsage: 38,
        networkLatency: 3,
        errorRate: 0.01,
        responseTime: 15,
        throughput: 78,
      },
      {
        id: 'communication-agent',
        name: 'Communication Coordinator',
        description: 'AI-powered communication and collaboration system',
        status: 'active',
        performance: 85,
        tasksCompleted: 678,
        tasksInProgress: 4,
        icon: <ChatIcon />,
        color: '#a8edea',
        capabilities: [
          'Message Processing',
          'Context Understanding',
          'Response Generation',
          'Collaboration',
        ],
        lastActivity: '1 minute ago',
        uptime: '99.2%',
        memoryUsage: 68,
        cpuUsage: 55,
        networkLatency: 7,
        errorRate: 0.3,
        responseTime: 38,
        throughput: 123,
      },
    ],
    []
  );

  // Real-time activity logs
  const [activityLogs, setActivityLogs] = useState([
    {
      id: 1,
      timestamp: new Date().toISOString(),
      agent: 'quantum-autopilot',
      action: 'Task Completed',
      details: 'Successfully optimized memory allocation for process #1234',
      status: 'success',
      duration: 245,
    },
    {
      id: 2,
      timestamp: new Date(Date.now() - 30000).toISOString(),
      agent: 'data-agent',
      action: 'Data Processing',
      details: 'Processed 1,234 records in batch operation',
      status: 'success',
      duration: 1200,
    },
    {
      id: 3,
      timestamp: new Date(Date.now() - 60000).toISOString(),
      agent: 'debug-agent',
      action: 'Error Fixed',
      details: 'Automatically resolved null pointer exception in user service',
      status: 'success',
      duration: 89,
    },
    {
      id: 4,
      timestamp: new Date(Date.now() - 90000).toISOString(),
      agent: 'security-agent',
      action: 'Threat Detected',
      details: 'Blocked suspicious login attempt from IP 192.168.1.100',
      status: 'warning',
      duration: 12,
    },
    {
      id: 5,
      timestamp: new Date(Date.now() - 120000).toISOString(),
      agent: 'learning-agent',
      action: 'Pattern Learned',
      details: 'Identified new user behavior pattern for recommendation engine',
      status: 'info',
      duration: 567,
    },
  ]);

  // System metrics
  const [systemMetrics] = useState({
    totalAgents: 6,
    activeAgents: 6,
    totalTasks: 5559,
    completedTasks: 5551,
    failedTasks: 8,
    averageResponseTime: 38,
    systemUptime: 99.7,
    memoryUsage: 72,
    cpuUsage: 63,
    networkThroughput: 1125,
    errorRate: 0.14,
  });

  // Agent Management Functions
  const handleAgentControl = (agentId, action) => {
    console.log(`Agent ${agentId} ${action} requested`);
    // Simulate agent control
    setRealTimeData(prev => ({
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

  const handleAgentDetails = agent => {
    setSelectedAgent(agent);
    setAgentDetailsOpen(true);
  };

  const generateRealTimeData = () => {
    const newData = {};
    aiAgents.forEach(agent => {
      newData[agent.id] = {
        ...agent,
        performance: Math.max(
          0,
          Math.min(100, agent.performance + (Math.random() - 0.5) * 10)
        ),
        memoryUsage: Math.max(
          0,
          Math.min(100, agent.memoryUsage + (Math.random() - 0.5) * 5)
        ),
        cpuUsage: Math.max(
          0,
          Math.min(100, agent.cpuUsage + (Math.random() - 0.5) * 5)
        ),
        responseTime: Math.max(
          10,
          agent.responseTime + (Math.random() - 0.5) * 20
        ),
        throughput: Math.max(0, agent.throughput + (Math.random() - 0.5) * 50),
        lastActivity: 'Just now',
      };
    });
    setRealTimeData(newData);
  };

  const addActivityLog = () => {
    const newLog = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      agent: aiAgents[Math.floor(Math.random() * aiAgents.length)].id,
      action: [
        'Task Completed',
        'Data Processing',
        'Error Fixed',
        'Threat Detected',
        'Pattern Learned',
      ][Math.floor(Math.random() * 5)],
      details: `Real-time activity update #${Date.now()}`,
      status: ['success', 'warning', 'info', 'error'][
        Math.floor(Math.random() * 4)
      ],
      duration: Math.floor(Math.random() * 1000),
    };
    setActivityLogs(prev => [newLog, ...prev.slice(0, 49)]);
  };

  useEffect(() => {
    setLoading(false);
    generateRealTimeData();

    // Simulate real-time updates
    const interval = setInterval(() => {
      generateRealTimeData();
      addActivityLog();
    }, 3000);

    return () => clearInterval(interval);
  }, [aiAgents, generateRealTimeData, addActivityLog]);

  const filteredAgents = useMemo(() => {
    let filtered = aiAgents;

    if (filterStatus !== 'all') {
      filtered = filtered.filter(agent => agent.status === filterStatus);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        agent =>
          agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          agent.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [aiAgents, filterStatus, searchQuery]);

  const getStatusColor = status => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'default';
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

  const getStatusIcon = status => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon />;
      case 'warning':
        return <WarningIcon />;
      case 'error':
        return <ErrorIcon />;
      case 'info':
        return <InfoIcon />;
      default:
        return <InfoIcon />;
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
          Initializing Real-time Monitoring...
        </Typography>
        <Typography variant='body1' color='text.secondary' sx={{ mt: 1 }}>
          Please wait while we connect to AI agents
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
      {/* Real-time Monitoring Header */}
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
        {/* Real-time Animation */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            animation: 'pulse 2s ease-in-out infinite',
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
              <MonitorIcon sx={{ fontSize: '2.5rem' }} />
              Real-time Agent Monitoring
            </Typography>
            <Typography variant='h6' sx={{ opacity: 0.9 }}>
              Live monitoring and control of AI agents with real-time analytics
            </Typography>
            <Box mt={2} display='flex' gap={2} flexWrap='wrap'>
              <Chip
                icon={<AgentIcon />}
                label={`${systemMetrics.activeAgents}/${systemMetrics.totalAgents} Agents Active`}
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
              <Chip
                icon={<TrendingUpIcon />}
                label={`${systemMetrics.systemUptime}% Uptime`}
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
              <Chip
                label={`${systemMetrics.completedTasks} Tasks Completed`}
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
            </Box>
          </Box>
          <Box display='flex' gap={1}>
            <Tooltip title='Refresh Data'>
              <IconButton
                onClick={generateRealTimeData}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title='Export Data'>
              <IconButton
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                }}
              >
                <DownloadIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Paper>

      {/* System Overview Metrics */}
      <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Typography
          variant='h5'
          gutterBottom
          sx={{ ...commonStyles.gradientText }}
        >
          📊 System Overview
        </Typography>
        <Grid container spacing={3}>
          {Object.entries(systemMetrics).map(([key, value]) => (
            <Grid item xs={12} sm={6} md={2.4} key={key}>
              <Card sx={{ textAlign: 'center', ...commonStyles.cardHover }}>
                <CardContent>
                  <Typography
                    variant='h4'
                    sx={{
                      fontWeight: 700,
                      color:
                        key.includes('Usage') || key.includes('Rate')
                          ? value > 80
                            ? '#f44336'
                            : value > 60
                            ? '#ff9800'
                            : '#4caf50'
                          : value > 90
                          ? '#4caf50'
                          : value > 70
                          ? '#ff9800'
                          : '#f44336',
                    }}
                  >
                    {typeof value === 'number' ? value.toFixed(1) : value}
                    {key.includes('Usage') ||
                    key.includes('Uptime') ||
                    key.includes('Rate')
                      ? '%'
                      : ''}
                  </Typography>
                  <Typography
                    variant='body2'
                    color='text.secondary'
                    sx={{ textTransform: 'capitalize' }}
                  >
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </Typography>
                  <LinearProgress
                    variant='determinate'
                    value={typeof value === 'number' ? value : 0}
                    sx={{ mt: 1, height: 6, borderRadius: 3 }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Tabbed Interface */}
      <Paper elevation={2} sx={{ borderRadius: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab
            icon={<AgentIcon />}
            label='Agent Status'
            iconPosition='start'
            sx={{ textTransform: 'none', fontWeight: 600 }}
          />
          <Tab
            icon={<TimelineIcon />}
            label='Activity Logs'
            iconPosition='start'
            sx={{ textTransform: 'none', fontWeight: 600 }}
          />
          <Tab
            icon={<InsightsIcon />}
            label='Analytics'
            iconPosition='start'
            sx={{ textTransform: 'none', fontWeight: 600 }}
          />
          <Tab
            icon={<SettingsIcon />}
            label='Controls'
            iconPosition='start'
            sx={{ textTransform: 'none', fontWeight: 600 }}
          />
        </Tabs>

        {/* Agent Status Tab */}
        {activeTab === 0 && (
          <Box sx={{ p: 3 }}>
            <Box
              display='flex'
              justifyContent='space-between'
              alignItems='center'
              mb={3}
            >
              <Typography variant='h5' sx={{ ...commonStyles.gradientText }}>
                🤖 Agent Status Dashboard
              </Typography>
              <Box display='flex' gap={2}>
                <FormControl size='small' sx={{ minWidth: 120 }}>
                  <InputLabel>Filter</InputLabel>
                  <Select
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value)}
                  >
                    <MenuItem value='all'>All</MenuItem>
                    <MenuItem value='active'>Active</MenuItem>
                    <MenuItem value='inactive'>Inactive</MenuItem>
                    <MenuItem value='error'>Error</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  size='small'
                  placeholder='Search agents...'
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    ),
                  }}
                />
              </Box>
            </Box>

            <Grid container spacing={3}>
              {filteredAgents.map((agent, index) => {
                const currentData = realTimeData[agent.id] || agent;
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
                                  label={currentData.status}
                                  size='small'
                                  color={getStatusColor(currentData.status)}
                                />
                                <Typography
                                  variant='caption'
                                  color='text.secondary'
                                >
                                  {currentData.lastActivity}
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

                          {/* Performance Metrics */}
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
                                {currentData.performance}%
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant='determinate'
                              value={currentData.performance}
                              sx={{ height: 8, borderRadius: 4 }}
                            />
                          </Box>

                          {/* Resource Usage */}
                          <Box mb={2}>
                            <Grid container spacing={1}>
                              <Grid item xs={6}>
                                <Typography
                                  variant='caption'
                                  color='text.secondary'
                                >
                                  Memory
                                </Typography>
                                <Typography
                                  variant='body2'
                                  sx={{ fontWeight: 600 }}
                                >
                                  {currentData.memoryUsage}%
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography
                                  variant='caption'
                                  color='text.secondary'
                                >
                                  CPU
                                </Typography>
                                <Typography
                                  variant='body2'
                                  sx={{ fontWeight: 600 }}
                                >
                                  {currentData.cpuUsage}%
                                </Typography>
                              </Grid>
                            </Grid>
                          </Box>

                          {/* Task Stats */}
                          <Box
                            display='flex'
                            justifyContent='space-between'
                            alignItems='center'
                            mb={2}
                          >
                            <Typography variant='body2' color='text.secondary'>
                              Tasks: {currentData.tasksCompleted} completed,{' '}
                              {currentData.tasksInProgress} in progress
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

                          {/* Response Time & Throughput */}
                          <Box
                            display='flex'
                            justifyContent='space-between'
                            alignItems='center'
                          >
                            <Typography
                              variant='caption'
                              color='text.secondary'
                            >
                              Response: {currentData.responseTime}ms
                            </Typography>
                            <Typography
                              variant='caption'
                              color='text.secondary'
                            >
                              Throughput: {currentData.throughput}/min
                            </Typography>
                          </Box>
                        </CardContent>

                        <CardActions>
                          <Button
                            size='small'
                            onClick={() => handleAgentDetails(agent)}
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

        {/* Activity Logs Tab */}
        {activeTab === 1 && (
          <Box sx={{ p: 3 }}>
            <Typography
              variant='h5'
              gutterBottom
              sx={{ mb: 3, ...commonStyles.gradientText }}
            >
              📋 Real-time Activity Logs
            </Typography>
            <Paper sx={{ maxHeight: 600, overflow: 'auto' }}>
              <Timeline>
                {activityLogs.map((log, index) => (
                  <TimelineItem key={log.id}>
                    <TimelineOppositeContent color='text.secondary'>
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                      <TimelineDot color={getStatusColor(log.status)}>
                        {getStatusIcon(log.status)}
                      </TimelineDot>
                      {index < activityLogs.length - 1 && <TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent>
                      <Card sx={{ mb: 2 }}>
                        <CardContent>
                          <Box
                            display='flex'
                            justifyContent='space-between'
                            alignItems='center'
                            mb={1}
                          >
                            <Typography
                              variant='subtitle2'
                              sx={{ fontWeight: 600 }}
                            >
                              {log.action}
                            </Typography>
                            <Chip
                              label={log.status}
                              size='small'
                              color={getStatusColor(log.status)}
                            />
                          </Box>
                          <Typography
                            variant='body2'
                            color='text.secondary'
                            gutterBottom
                          >
                            {log.details}
                          </Typography>
                          <Typography variant='caption' color='text.secondary'>
                            Agent: {log.agent} • Duration: {log.duration}ms
                          </Typography>
                        </CardContent>
                      </Card>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            </Paper>
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
              📈 Performance Analytics
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant='h6' gutterBottom>
                      Agent Performance Trends
                    </Typography>
                    <List>
                      {aiAgents.map(agent => {
                        const currentData = realTimeData[agent.id] || agent;
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
                                    Performance: {currentData.performance}% |
                                    Tasks: {currentData.tasksCompleted}
                                  </Typography>
                                  <LinearProgress
                                    variant='determinate'
                                    value={currentData.performance}
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
                      System Health Metrics
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
                          {systemMetrics.systemUptime}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant='determinate'
                        value={systemMetrics.systemUptime}
                        sx={{ height: 8, borderRadius: 4, mb: 3 }}
                      />

                      <Box
                        display='flex'
                        justifyContent='space-between'
                        alignItems='center'
                        mb={1}
                      >
                        <Typography variant='body2'>Memory Usage</Typography>
                        <Typography variant='body2' sx={{ fontWeight: 600 }}>
                          {systemMetrics.memoryUsage}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant='determinate'
                        value={systemMetrics.memoryUsage}
                        sx={{ height: 8, borderRadius: 4, mb: 3 }}
                      />

                      <Box
                        display='flex'
                        justifyContent='space-between'
                        alignItems='center'
                        mb={1}
                      >
                        <Typography variant='body2'>CPU Usage</Typography>
                        <Typography variant='body2' sx={{ fontWeight: 600 }}>
                          {systemMetrics.cpuUsage}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant='determinate'
                        value={systemMetrics.cpuUsage}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Controls Tab */}
        {activeTab === 3 && (
          <Box sx={{ p: 3 }}>
            <Typography
              variant='h5'
              gutterBottom
              sx={{ mb: 3, ...commonStyles.gradientText }}
            >
              🎛️ Agent Controls
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant='h6' gutterBottom>
                      Global Controls
                    </Typography>
                    <Box display='flex' flexDirection='column' gap={2}>
                      <Button
                        variant='contained'
                        color='success'
                        startIcon={<PlayIcon />}
                        onClick={() => console.log('Start all agents')}
                      >
                        Start All Agents
                      </Button>
                      <Button
                        variant='contained'
                        color='error'
                        startIcon={<StopIcon />}
                        onClick={() => console.log('Stop all agents')}
                      >
                        Stop All Agents
                      </Button>
                      <Button
                        variant='outlined'
                        startIcon={<RestartIcon />}
                        onClick={() => console.log('Restart all agents')}
                      >
                        Restart All Agents
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant='h6' gutterBottom>
                      System Actions
                    </Typography>
                    <Box display='flex' flexDirection='column' gap={2}>
                      <Button
                        variant='outlined'
                        startIcon={<RefreshIcon />}
                        onClick={generateRealTimeData}
                      >
                        Refresh Data
                      </Button>
                      <Button
                        variant='outlined'
                        startIcon={<DownloadIcon />}
                        onClick={() => console.log('Export data')}
                      >
                        Export Data
                      </Button>
                      <Button
                        variant='outlined'
                        startIcon={<SettingsIcon />}
                        onClick={() => console.log('Open settings')}
                      >
                        Open Settings
                      </Button>
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
        open={agentDetailsOpen}
        onClose={() => setAgentDetailsOpen(false)}
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
          <Button onClick={() => setAgentDetailsOpen(false)}>Close</Button>
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
          Real-time Monitoring • User: {userProfile?.role || 'Unknown'} • Last
          Updated: {new Date().toLocaleString()}
        </Typography>
      </Box>
    </Container>
  );
};

export default RealTimeAgentMonitoringDashboard;
