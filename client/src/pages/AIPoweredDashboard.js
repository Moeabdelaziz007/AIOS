import {
  BugReport,
  CheckCircle,
  Memory,
  Notifications,
  Psychology,
  Refresh,
  Speed,
  TrendingDown,
  TrendingUp,
  Warning,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Grow,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Tooltip,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import {
  AIAgentGrid,
  AIAgentPerformanceChart,
  AIPoweredBadge,
  AIProcessingIndicator,
} from '../components/AIAgentComponents';
import { useAuth } from '../contexts/AuthContext';
import { useAIOSIntegration } from '../services/AIOSIntegrationService';
import { useFirebase } from '../services/FirebaseService';
import {
  aiAgentColors,
  aiAnimations,
  aiGradients,
  aiStyles,
} from '../theme/aiPoweredTheme';

const AIPoweredDashboard = () => {
  const {} = useAuth();
  const {} = useFirebase();
  const { refreshAll } = useAIOSIntegration();

  const [isProcessing, setIsProcessing] = useState(false);

  // AI Agents Data
  const aiAgents = [
    {
      id: 1,
      name: 'Quantum Autopilot',
      description:
        'Advanced AI system managing all operations with quantum-enhanced processing',
      status: 'active',
      capabilities: ['Error Detection', 'Auto-Fix', 'Learning', 'Optimization'],
      performance: 95,
      lastActive: '2 minutes ago',
    },
    {
      id: 2,
      name: 'Debugger Agent',
      description:
        'Intelligent debugging system with pattern recognition and automated fixes',
      status: 'processing',
      capabilities: [
        'Code Analysis',
        'Bug Detection',
        'Fix Generation',
        'Pattern Learning',
      ],
      performance: 88,
      lastActive: '1 minute ago',
    },
    {
      id: 3,
      name: 'Data Agent',
      description:
        'Smart data processing and analysis with real-time insights generation',
      status: 'learning',
      capabilities: [
        'Data Analysis',
        'Insights',
        'Predictions',
        'Optimization',
      ],
      performance: 92,
      lastActive: '30 seconds ago',
    },
    {
      id: 4,
      name: 'Security Agent',
      description:
        'Advanced security monitoring with threat detection and prevention',
      status: 'active',
      capabilities: [
        'Threat Detection',
        'Access Control',
        'Audit Logs',
        'Encryption',
      ],
      performance: 98,
      lastActive: '5 minutes ago',
    },
    {
      id: 5,
      name: 'Performance Agent',
      description: 'System performance optimization with predictive analytics',
      status: 'optimizing',
      capabilities: [
        'Performance Monitoring',
        'Resource Optimization',
        'Predictive Analysis',
      ],
      performance: 85,
      lastActive: '3 minutes ago',
    },
    {
      id: 6,
      name: 'Learning Agent',
      description:
        'Continuous learning system improving AI capabilities over time',
      status: 'learning',
      capabilities: [
        'Pattern Recognition',
        'Model Training',
        'Knowledge Base',
        'Adaptation',
      ],
      performance: 90,
      lastActive: '1 minute ago',
    },
  ];

  // Performance Data
  const performanceData = [
    { name: 'Quantum Autopilot', value: 95 },
    { name: 'Debugger Agent', value: 88 },
    { name: 'Data Agent', value: 92 },
    { name: 'Security Agent', value: 98 },
    { name: 'Performance Agent', value: 85 },
    { name: 'Learning Agent', value: 90 },
  ];

  // System Metrics
  const systemMetrics = [
    {
      title: 'AI Processing Power',
      value: '98.5%',
      trend: 'up',
      icon: <Psychology />,
      color: aiAgentColors.neural,
    },
    {
      title: 'Learning Efficiency',
      value: '94.2%',
      trend: 'up',
      icon: <Memory />,
      color: aiAgentColors.quantum,
    },
    {
      title: 'Error Resolution',
      value: '96.8%',
      trend: 'up',
      icon: <BugReport />,
      color: aiAgentColors.success,
    },
    {
      title: 'System Optimization',
      value: '91.3%',
      trend: 'up',
      icon: <Speed />,
      color: aiAgentColors.accent,
    },
  ];

  useEffect(() => {
    // Simulate AI processing
    const interval = setInterval(() => {
      setIsProcessing(Math.random() > 0.7);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleAgentClick = agent => {
    setIsProcessing(true);
    setTimeout(() => setIsProcessing(false), 2000);
  };

  const handleRefresh = () => {
    setIsProcessing(true);
    refreshAll();
    setTimeout(() => setIsProcessing(false), 1500);
  };

  return (
    <Container maxWidth='xl' sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2,
          }}
        >
          <Box>
            <Typography
              variant='h3'
              sx={{
                ...aiStyles.aiGradientText,
                mb: 1,
                animation: aiAnimations.neuralFlow.animation,
              }}
            >
              AIOS Dashboard
            </Typography>
            <Typography
              variant='h6'
              sx={{ color: 'text.secondary', fontWeight: 400 }}
            >
              Powered by Advanced AI Agents
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <AIPoweredBadge variant='neural' />
            <Tooltip title='Refresh System'>
              <IconButton
                onClick={handleRefresh}
                sx={{
                  background: aiGradients.primary,
                  color: 'white',
                  '&:hover': {
                    background: aiGradients.neural,
                    transform: 'rotate(180deg)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <Refresh />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>

      {/* System Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {systemMetrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Grow in timeout={600 + index * 100}>
              <Card
                sx={{
                  ...aiStyles.aiCard,
                  ...aiStyles.smartHover,
                  background: `linear-gradient(135deg, ${metric.color}10, ${metric.color}05)`,
                  border: `1px solid ${metric.color}30`,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box>
                      <Typography variant='h4' sx={{ fontWeight: 700, mb: 1 }}>
                        {metric.value}
                      </Typography>
                      <Typography
                        variant='body2'
                        sx={{ color: 'text.secondary', mb: 1 }}
                      >
                        {metric.title}
                      </Typography>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                      >
                        {metric.trend === 'up' ? (
                          <TrendingUp
                            sx={{ color: aiAgentColors.success, fontSize: 16 }}
                          />
                        ) : (
                          <TrendingDown
                            sx={{ color: aiAgentColors.error, fontSize: 16 }}
                          />
                        )}
                        <Typography
                          variant='caption'
                          sx={{ color: 'text.secondary' }}
                        >
                          +2.3% from last week
                        </Typography>
                      </Box>
                    </Box>
                    <Avatar
                      sx={{
                        width: 56,
                        height: 56,
                        background: aiGradients.primary,
                        animation: aiAnimations.neuralPulse.animation,
                      }}
                    >
                      {metric.icon}
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grow>
          </Grid>
        ))}
      </Grid>

      {/* AI Agents Section */}
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 3,
          }}
        >
          <Typography variant='h4' sx={{ fontWeight: 600 }}>
            AI Agents Status
          </Typography>
          <Chip
            label={`${
              aiAgents.filter(a => a.status === 'active').length
            } Active`}
            sx={{
              background: aiGradients.success,
              color: 'white',
              fontWeight: 600,
            }}
          />
        </Box>
        <AIAgentGrid agents={aiAgents} onAgentClick={handleAgentClick} />
      </Box>

      {/* Performance Chart */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <AIAgentPerformanceChart
            data={performanceData}
            title='Agent Performance Overview'
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ ...aiStyles.aiCard, height: '100%' }}>
            <CardContent>
              <Typography variant='h6' sx={{ mb: 3, fontWeight: 600 }}>
                System Health
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CheckCircle sx={{ color: aiAgentColors.success }} />
                  <Typography variant='body2'>
                    All systems operational
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Warning sx={{ color: aiAgentColors.warning }} />
                  <Typography variant='body2'>
                    2 minor optimizations pending
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Notifications sx={{ color: aiAgentColors.info }} />
                  <Typography variant='body2'>
                    15 new insights generated
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Card sx={{ ...aiStyles.aiCard }}>
        <CardContent>
          <Typography variant='h6' sx={{ mb: 3, fontWeight: 600 }}>
            Recent AI Activity
          </Typography>
          <List>
            {[
              {
                agent: 'Quantum Autopilot',
                action: 'Resolved 3 critical errors',
                time: '2 min ago',
                status: 'success',
              },
              {
                agent: 'Debugger Agent',
                action: 'Generated fix for syntax error',
                time: '5 min ago',
                status: 'success',
              },
              {
                agent: 'Data Agent',
                action: 'Completed data analysis',
                time: '8 min ago',
                status: 'success',
              },
              {
                agent: 'Security Agent',
                action: 'Blocked suspicious activity',
                time: '12 min ago',
                status: 'warning',
              },
              {
                agent: 'Learning Agent',
                action: 'Updated knowledge base',
                time: '15 min ago',
                status: 'success',
              },
            ].map((activity, index) => (
              <ListItem key={index} sx={{ px: 0 }}>
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      background: aiGradients.primary,
                      width: 32,
                      height: 32,
                    }}
                  >
                    <Psychology sx={{ fontSize: 16 }} />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={activity.action}
                  secondary={`${activity.agent} • ${activity.time}`}
                />
                <ListItemSecondaryAction>
                  <Chip
                    label={activity.status}
                    size='small'
                    sx={{
                      backgroundColor:
                        activity.status === 'success'
                          ? aiAgentColors.success
                          : aiAgentColors.warning,
                      color: 'white',
                      textTransform: 'capitalize',
                    }}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* AI Processing Indicator */}
      <AIProcessingIndicator
        isProcessing={isProcessing}
        message='AI agents are processing your request...'
      />
    </Container>
  );
};

export default AIPoweredDashboard;
