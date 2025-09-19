import {
  Add as AddIcon,
  Analytics as AnalyticsIcon,
  Backup as BackupIcon,
  Chat as ChatIcon,
  Article as ContentIcon,
  Dashboard as DashboardIcon,
  Storage as DatabaseIcon,
  CloudUpload as DeploymentIcon,
  Favorite as FavoriteIcon,
  Launch as LaunchIcon,
  Monitor as MonitoringIcon,
  Speed as PerformanceIcon,
  Refresh as RefreshIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon,
  Star as StarIcon,
  TrendingUp as TradingIcon,
} from '@mui/icons-material';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Fade,
  Grid,
  IconButton,
  Paper,
  Tooltip,
  Typography,
  Zoom,
} from '@mui/material';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAIOSIntegration } from '../services/AIOSIntegrationService';
import {
  animations,
  appCategoryColors,
  commonStyles,
} from '../theme/aiosTheme';

const AppsPage = () => {
  const { user, userProfile } = useAuth();
  const { apps, loading, error, refreshAll } = useAIOSIntegration();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [agentDialogOpen, setAgentDialogOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [agentStatus, setAgentStatus] = useState({});
  const [aiInsights, setAiInsights] = useState([]);

  // AI Agents Configuration
  const aiAgents = [
    {
      id: 'quantum-autopilot',
      name: 'Quantum Autopilot',
      description: 'Advanced AI system for automated task management and optimization',
      status: 'active',
      performance: 95,
      tasksCompleted: 1247,
      icon: <MagicIcon />,
      color: '#667eea',
      capabilities: ['Task Automation', 'Performance Optimization', 'Error Detection', 'Predictive Analysis'],
      lastActivity: '2 minutes ago'
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
      capabilities: ['Data Processing', 'Pattern Recognition', 'Predictive Analytics', 'Real-time Analysis'],
      lastActivity: '5 minutes ago'
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
      capabilities: ['Error Detection', 'Auto-fix Suggestions', 'Code Analysis', 'Performance Monitoring'],
      lastActivity: '1 minute ago'
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
      capabilities: ['Pattern Learning', 'Behavior Adaptation', 'Knowledge Building', 'Continuous Improvement'],
      lastActivity: '3 minutes ago'
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
      capabilities: ['Threat Detection', 'Security Analysis', 'Access Control', 'Risk Assessment'],
      lastActivity: '30 seconds ago'
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
      capabilities: ['Message Processing', 'Context Understanding', 'Response Generation', 'Collaboration'],
      lastActivity: '1 minute ago'
    }
  ];

  const defaultApps = [
    {
      id: 'dashboard',
      name: 'لوحة التحكم',
      description: 'نظرة عامة على النظام والإحصائيات',
      icon: <DashboardIcon />,
      color: appCategoryColors.core,
      category: 'core',
      status: 'active',
      featured: true,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
      id: 'settings',
      name: 'الإعدادات',
      description: 'إعدادات النظام والمستخدم',
      icon: <SettingsIcon />,
      color: appCategoryColors.core,
      category: 'core',
      status: 'active',
      featured: false,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
    {
      id: 'chat',
      name: 'الدردشة المباشرة',
      description: 'التواصل المباشر مع المستخدمين',
      icon: <ChatIcon />,
      color: appCategoryColors.communication,
      category: 'communication',
      status: 'active',
      featured: true,
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    },
    {
      id: 'database',
      name: 'قاعدة البيانات',
      description: 'إدارة البيانات والمعلومات',
      icon: <DatabaseIcon />,
      color: appCategoryColors.data,
      category: 'data',
      status: 'active',
      featured: false,
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    },
    {
      id: 'security',
      name: 'الأمان',
      description: 'مراقبة الأمان وحماية النظام',
      icon: <SecurityIcon />,
      color: appCategoryColors.security,
      category: 'security',
      status: 'active',
      featured: true,
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    },
    {
      id: 'performance',
      name: 'الأداء',
      description: 'تحسين أداء النظام',
      icon: <PerformanceIcon />,
      color: appCategoryColors.optimization,
      category: 'optimization',
      status: 'active',
      featured: false,
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    },
    {
      id: 'deployment',
      name: 'النشر',
      description: 'نشر التطبيقات والخدمات',
      icon: <DeploymentIcon />,
      color: appCategoryColors.devops,
      category: 'devops',
      status: 'active',
      featured: false,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
      id: 'analytics',
      name: 'التحليلات',
      description: 'تحليل البيانات والإحصائيات',
      icon: <AnalyticsIcon />,
      color: appCategoryColors.analytics,
      category: 'analytics',
      status: 'active',
      featured: true,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
    {
      id: 'backup',
      name: 'النسخ الاحتياطي',
      description: 'نسخ احتياطي للبيانات',
      icon: <BackupIcon />,
      color: appCategoryColors.maintenance,
      category: 'maintenance',
      status: 'active',
      featured: false,
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    },
    {
      id: 'monitoring',
      name: 'المراقبة',
      description: 'مراقبة النظام والأداء',
      icon: <MonitoringIcon />,
      color: appCategoryColors.monitoring,
      category: 'monitoring',
      status: 'active',
      featured: true,
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    },
    {
      id: 'trading',
      name: 'التداول',
      description: 'نظام التداول المالي',
      icon: <TradingIcon />,
      color: appCategoryColors.finance,
      category: 'finance',
      status: 'active',
      featured: false,
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    },
    {
      id: 'content',
      name: 'إدارة المحتوى',
      description: 'إنشاء وإدارة المحتوى',
      icon: <ContentIcon />,
      color: appCategoryColors.content,
      category: 'content',
      status: 'active',
      featured: false,
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    },
  ];

  // AI Agent Management Functions
  const handleAgentControl = (agentId, action) => {
    console.log(`Agent ${agentId} ${action} requested`);
    // Simulate agent control
    setAgentStatus(prev => ({
      ...prev,
      [agentId]: { ...prev[agentId], status: action === 'start' ? 'active' : action === 'stop' ? 'inactive' : prev[agentId]?.status }
    }));
  };

  const handleAgentDialog = (agent) => {
    setSelectedAgent(agent);
    setAgentDialogOpen(true);
  };

  const generateAIInsights = () => {
    const insights = [
      {
        id: 1,
        type: 'optimization',
        title: 'Performance Optimization Opportunity',
        description: 'Quantum Autopilot suggests optimizing memory usage for 15% performance improvement',
        priority: 'high',
        agent: 'quantum-autopilot',
        timestamp: new Date().toISOString()
      },
      {
        id: 2,
        type: 'security',
        title: 'Security Enhancement Detected',
        description: 'Security Guardian recommends updating authentication protocols',
        priority: 'medium',
        agent: 'security-agent',
        timestamp: new Date().toISOString()
      },
      {
        id: 3,
        type: 'learning',
        title: 'Pattern Recognition Update',
        description: 'Learning Loop Agent identified new user behavior patterns',
        priority: 'low',
        agent: 'learning-agent',
        timestamp: new Date().toISOString()
      }
    ];
    setAiInsights(insights);
  };

  useEffect(() => {
    generateAIInsights();
    // Simulate real-time agent status updates
    const interval = setInterval(() => {
      setAgentStatus(prev => {
        const newStatus = { ...prev };
        aiAgents.forEach(agent => {
          if (!newStatus[agent.id]) {
            newStatus[agent.id] = {
              status: agent.status,
              performance: agent.performance,
              tasksCompleted: agent.tasksCompleted,
              lastActivity: agent.lastActivity
            };
          }
        });
        return newStatus;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshAll();
      generateAIInsights(); // Refresh AI insights
    } catch (error) {
      console.error('Error refreshing apps:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleAppClick = appId => {
    // Navigate to specific app or open in modal
    console.log(`Opening app: ${appId}`);
    // You can implement navigation logic here
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
        return 'نشط';
      case 'inactive':
        return 'غير نشط';
      case 'error':
        return 'خطأ';
      case 'loading':
        return 'جاري التحميل';
      default:
        return 'غير معروف';
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
          جاري تحميل التطبيقات...
        </Typography>
        <Typography variant='body1' color='text.secondary' sx={{ mt: 1 }}>
          يرجى الانتظار قليلاً
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
      {/* Header Section */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 3,
          ...animations.fadeIn,
        }}
      >
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Box>
            <Typography
              variant='h3'
              component='h1'
              gutterBottom
              sx={{ fontWeight: 700 }}
            >
              🚀 تطبيقات AIOS
            </Typography>
            <Typography variant='h6' sx={{ opacity: 0.9 }}>
              مرحباً {userProfile?.displayName || 'المستخدم'}، اختر التطبيق الذي
              تريد استخدامه
            </Typography>
            <Box mt={2} display='flex' gap={2}>
              <Chip
                label={`${defaultApps.length} تطبيق`}
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
              <Chip
                label={userProfile?.role || 'مستخدم'}
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
            </Box>
          </Box>
          <Box display='flex' gap={1}>
            <Tooltip title='تحديث التطبيقات'>
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
            <Tooltip title='إضافة تطبيق جديد'>
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

      {error && (
        <Alert severity='error' sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Featured Apps Section */}
      <Typography
        variant='h5'
        gutterBottom
        sx={{ mb: 3, ...commonStyles.gradientText }}
      >
        ⭐ التطبيقات المميزة
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {defaultApps
          .filter(app => app.featured)
          .map((app, index) => (
            <Grid item xs={12} sm={6} md={4} key={app.id}>
              <Zoom in timeout={300 + index * 100}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    background: app.gradient,
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden',
                    ...commonStyles.cardHover,
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(10px)',
                    },
                  }}
                >
                  <CardContent
                    sx={{ flexGrow: 1, position: 'relative', zIndex: 1 }}
                  >
                    <Box display='flex' alignItems='center' mb={2}>
                      <Avatar
                        sx={{
                          bgcolor: 'rgba(255,255,255,0.2)',
                          mr: 2,
                          width: 56,
                          height: 56,
                          backdropFilter: 'blur(10px)',
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
                        <Box display='flex' gap={1} mt={1}>
                          <Chip
                            label={getStatusText(app.status)}
                            size='small'
                            sx={{
                              bgcolor: 'rgba(255,255,255,0.2)',
                              color: 'white',
                              fontSize: '0.7rem',
                            }}
                          />
                          <Chip
                            icon={<StarIcon />}
                            label='مميز'
                            size='small'
                            sx={{
                              bgcolor: 'rgba(255,255,255,0.2)',
                              color: 'white',
                              fontSize: '0.7rem',
                            }}
                          />
                        </Box>
                      </Box>
                    </Box>
                    <Typography variant='body2' sx={{ opacity: 0.9 }}>
                      {app.description}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ position: 'relative', zIndex: 1 }}>
                    <Button
                      size='small'
                      onClick={() => handleAppClick(app.id)}
                      disabled={
                        app.status === 'inactive' || app.status === 'error'
                      }
                      sx={{
                        color: 'white',
                        borderColor: 'rgba(255,255,255,0.3)',
                        '&:hover': { borderColor: 'white' },
                      }}
                      startIcon={<LaunchIcon />}
                    >
                      فتح
                    </Button>
                    <Button
                      size='small'
                      sx={{ color: 'white' }}
                      startIcon={<FavoriteIcon />}
                    >
                      مفضل
                    </Button>
                  </CardActions>
                </Card>
              </Zoom>
            </Grid>
          ))}
      </Grid>

      {/* All Apps Section */}
      <Typography
        variant='h5'
        gutterBottom
        sx={{ mb: 3, ...commonStyles.gradientText }}
      >
        📱 جميع التطبيقات
      </Typography>
      <Grid container spacing={3}>
        {defaultApps.map((app, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={app.id}>
            <Fade in timeout={500 + index * 100}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  ...commonStyles.cardHover,
                  ...commonStyles.shadow,
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display='flex' alignItems='center' mb={2}>
                    <Avatar
                      sx={{
                        bgcolor: app.color,
                        mr: 2,
                        width: 48,
                        height: 48,
                        ...commonStyles.shadow,
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
                        label='مميز'
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
                    فتح
                  </Button>
                  <Button size='small' color='secondary'>
                    إعدادات
                  </Button>
                </CardActions>
              </Card>
            </Fade>
          </Grid>
        ))}
      </Grid>

      <Box mt={4} textAlign='center'>
        <Typography variant='body2' color='text.secondary'>
          إجمالي التطبيقات: {defaultApps.length} | المستخدم:{' '}
          {userProfile?.role || 'غير محدد'}
        </Typography>
      </Box>
    </Container>
  );
};

export default AppsPage;
