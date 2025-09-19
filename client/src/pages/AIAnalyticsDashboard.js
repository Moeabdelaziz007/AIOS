import {
  SmartToy as AgentIcon,
  Analytics as AnalyticsIcon,
  Assessment as AssessmentIcon,
  BarChart as BarChartIcon,
  Dashboard as DashboardIcon,
  Download as DownloadIcon,
  Error as ErrorIcon,
  Group as GroupIcon,
  Info as InfoIcon,
  Insights as InsightsIcon,
  Refresh as RefreshIcon,
  ShowChart as ShowChartIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
// Timeline components - using custom implementation instead of @mui/lab
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Tab,
  Tabs,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  Zoom,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator
} from '../components/CustomTimeline';
import { useAuth } from '../contexts/AuthContext';
import { animations, appCategoryColors, commonStyles } from '../theme/aiosTheme';

const AIAnalyticsDashboard = () => {
  const { userProfile } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('performance');
  const [analyticsData, setAnalyticsData] = useState({});
  const [systemMetrics, setSystemMetrics] = useState({});
  const [userBehavior, setUserBehavior] = useState({});
  const [aiInsights, setAiInsights] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [errorRates, setErrorRates] = useState([]);
  const [usagePatterns, setUsagePatterns] = useState([]);
  const [predictiveAnalytics, setPredictiveAnalytics] = useState({});

  // Initialize Analytics Data
  const initializeAnalytics = useCallback(() => {
    const analytics = {
      overview: {
        totalUsers: 1247,
        activeAgents: 6,
        systemUptime: 99.8,
        avgResponseTime: 245,
        errorRate: 0.2,
        satisfaction: 4.7
      },
      performance: {
        cpu: 68,
        memory: 72,
        storage: 45,
        network: 34,
        aiProcessing: 89,
        responseTime: 245
      },
      trends: {
        users: { current: 1247, previous: 1189, change: 4.9 },
        performance: { current: 89, previous: 85, change: 4.7 },
        errors: { current: 0.2, previous: 0.8, change: -75.0 },
        satisfaction: { current: 4.7, previous: 4.3, change: 9.3 }
      }
    };

    setAnalyticsData(analytics);
  }, []);

  // Initialize System Metrics
  const initializeSystemMetrics = useCallback(() => {
    const metrics = {
      overall: 92,
      agents: 95,
      performance: 88,
      security: 96,
      uptime: 99.8,
      mobileOptimization: 85,
      touchResponsiveness: 90,
      gestureRecognition: 78,
      aiAccuracy: 94,
      responseTime: 245,
      throughput: 1200,
      errorRate: 0.2
    };

    setSystemMetrics(metrics);
  }, []);

  // Initialize User Behavior Data
  const initializeUserBehavior = useCallback(() => {
    const behavior = {
      peakHours: ['09:00', '14:00', '19:00'],
      popularFeatures: [
        { name: 'AI Agents', usage: 45 },
        { name: 'Voice Interface', usage: 32 },
        { name: 'Predictive UI', usage: 28 },
        { name: 'Mobile Interface', usage: 25 },
        { name: 'Settings', usage: 18 }
      ],
      userJourney: [
        { step: 'Login', completion: 100 },
        { step: 'Dashboard', completion: 95 },
        { step: 'AI Agents', completion: 78 },
        { step: 'Voice Interface', completion: 65 },
        { step: 'Settings', completion: 45 }
      ],
      deviceUsage: {
        mobile: 45,
        tablet: 25,
        desktop: 30
      }
    };

    setUserBehavior(behavior);
  }, []);

  // Initialize AI Insights
  const initializeAIInsights = useCallback(() => {
    const insights = [
      {
        id: 1,
        type: 'optimization',
        title: 'Performance Optimization Opportunity',
        description: 'AI agents are running at 89% efficiency. Consider scaling resources for peak hours.',
        impact: 'high',
        confidence: 94,
        action: 'Scale AI processing resources',
        estimatedImprovement: '15% performance boost'
      },
      {
        id: 2,
        type: 'prediction',
        title: 'User Growth Prediction',
        description: 'Based on current trends, expect 12% user growth in the next 30 days.',
        impact: 'medium',
        confidence: 87,
        action: 'Prepare infrastructure scaling',
        estimatedImprovement: 'Better user experience'
      },
      {
        id: 3,
        type: 'anomaly',
        title: 'Unusual Error Pattern Detected',
        description: 'Error rate spiked during 14:00-15:00. Investigating potential causes.',
        impact: 'high',
        confidence: 92,
        action: 'Investigate error logs',
        estimatedImprovement: 'Reduce error rate by 60%'
      },
      {
        id: 4,
        type: 'recommendation',
        title: 'Feature Usage Optimization',
        description: 'Voice Interface usage increased 25%. Consider promoting this feature.',
        impact: 'medium',
        confidence: 78,
        action: 'Promote voice features',
        estimatedImprovement: 'Increase user engagement'
      }
    ];

    setAiInsights(insights);
  }, []);

  // Initialize Performance Data
  const initializePerformanceData = useCallback(() => {
    const performance = [
      { time: '00:00', cpu: 45, memory: 52, response: 180 },
      { time: '04:00', cpu: 38, memory: 48, response: 165 },
      { time: '08:00', cpu: 65, memory: 68, response: 220 },
      { time: '12:00', cpu: 78, memory: 72, response: 245 },
      { time: '16:00', cpu: 82, memory: 75, response: 260 },
      { time: '20:00', cpu: 68, memory: 62, response: 210 },
      { time: '24:00', cpu: 45, memory: 52, response: 180 }
    ];

    setPerformanceData(performance);
  }, []);

  // Initialize Error Rates
  const initializeErrorRates = useCallback(() => {
    const errors = [
      { time: '00:00', rate: 0.1, count: 2 },
      { time: '04:00', rate: 0.05, count: 1 },
      { time: '08:00', rate: 0.3, count: 6 },
      { time: '12:00', rate: 0.2, count: 4 },
      { time: '16:00', rate: 0.4, count: 8 },
      { time: '20:00', rate: 0.15, count: 3 },
      { time: '24:00', rate: 0.1, count: 2 }
    ];

    setErrorRates(errors);
  }, []);

  // Initialize Usage Patterns
  const initializeUsagePatterns = useCallback(() => {
    const patterns = [
      { feature: 'AI Agents', usage: 45, trend: 'up', change: 12 },
      { feature: 'Voice Interface', usage: 32, trend: 'up', change: 25 },
      { feature: 'Predictive UI', usage: 28, trend: 'up', change: 8 },
      { feature: 'Mobile Interface', usage: 25, trend: 'up', change: 15 },
      { feature: 'Settings', usage: 18, trend: 'down', change: -5 },
      { feature: 'Monitoring', usage: 15, trend: 'up', change: 20 }
    ];

    setUsagePatterns(patterns);
  }, []);

  // Initialize Predictive Analytics
  const initializePredictiveAnalytics = useCallback(() => {
    const predictive = {
      userGrowth: {
        current: 1247,
        predicted: 1400,
        confidence: 87,
        timeframe: '30 days'
      },
      performance: {
        current: 89,
        predicted: 92,
        confidence: 94,
        timeframe: '7 days'
      },
      errors: {
        current: 0.2,
        predicted: 0.15,
        confidence: 78,
        timeframe: '14 days'
      },
      satisfaction: {
        current: 4.7,
        predicted: 4.8,
        confidence: 82,
        timeframe: '21 days'
      }
    };

    setPredictiveAnalytics(predictive);
  }, []);

  useEffect(() => {
    setLoading(false);
    initializeAnalytics();
    initializeSystemMetrics();
    initializeUserBehavior();
    initializeAIInsights();
    initializePerformanceData();
    initializeErrorRates();
    initializeUsagePatterns();
    initializePredictiveAnalytics();
  }, [
    initializeAnalytics,
    initializeSystemMetrics,
    initializeUserBehavior,
    initializeAIInsights,
    initializePerformanceData,
    initializeErrorRates,
    initializeUsagePatterns,
    initializePredictiveAnalytics
  ]);

  // Get Trend Icon
  const getTrendIcon = change => {
    if (change > 0) return <TrendingUpIcon color='success' />;
    if (change < 0) return <TrendingDownIcon color='error' />;
    return <TrendingFlatIcon color='info' />;
  };

  // Get Impact Color
  const getImpactColor = impact => {
    switch (impact) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

  // Get Impact Icon
  const getImpactIcon = impact => {
    switch (impact) {
      case 'high':
        return <ErrorIcon />;
      case 'medium':
        return <WarningIcon />;
      case 'low':
        return <InfoIcon />;
      default:
        return <InfoIcon />;
    }
  };

  if (loading) {
    return (
      <Container maxWidth='lg' sx={{ ...commonStyles.centerContent, flexDirection: 'column' }}>
        <CircularProgress size={80} thickness={4} />
        <Typography variant='h5' sx={{ mt: 3, ...commonStyles.gradientText }}>
          Loading AI Analytics...
        </Typography>
        <Typography variant='body1' color='text.secondary' sx={{ mt: 1 }}>
          Analyzing system performance and user behavior
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
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
          overflow: 'hidden'
        }}
      >
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
              variant='h3'
              component='h1'
              gutterBottom
              sx={{
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}
            >
              <AnalyticsIcon sx={{ fontSize: '2.5rem' }} />
              AI Analytics Dashboard
            </Typography>
            <Typography variant='h6' sx={{ opacity: 0.9, mb: 3 }}>
              Comprehensive insights into AI system performance and user behavior
            </Typography>
            <Box display='flex' gap={1} flexWrap='wrap'>
              <Chip
                icon={<AssessmentIcon />}
                label={`${analyticsData.overview?.totalUsers || 0} Users`}
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
              <Chip
                icon={<AgentIcon />}
                label={`${analyticsData.overview?.activeAgents || 0} AI Agents`}
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
              <Chip
                icon={<TrendingUpIcon />}
                label={`${analyticsData.overview?.systemUptime || 0}% Uptime`}
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
            </Box>
          </Box>
          <Box display='flex' gap={1}>
            <Tooltip title='Refresh Analytics'>
              <IconButton
                onClick={() => console.log('Refresh analytics')}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
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
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                }}
              >
                <DownloadIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Paper>

      {/* Time Range Selector */}
      <Paper elevation={2} sx={{ p: 2, mb: 3, borderRadius: 3 }}>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Typography variant='h6' sx={{ ...commonStyles.gradientText }}>
            📊 Analytics Time Range
          </Typography>
          <ToggleButtonGroup
            value={timeRange}
            exclusive
            onChange={(e, newValue) => newValue && setTimeRange(newValue)}
            size='small'
          >
            <ToggleButton value='1d'>1 Day</ToggleButton>
            <ToggleButton value='7d'>7 Days</ToggleButton>
            <ToggleButton value='30d'>30 Days</ToggleButton>
            <ToggleButton value='90d'>90 Days</ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Paper>

      {/* Tabbed Interface */}
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
            label={isMobile ? '' : 'Overview'}
            iconPosition={isMobile ? 'top' : 'start'}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          />
          <Tab
            icon={<BarChartIcon />}
            label={isMobile ? '' : 'Performance'}
            iconPosition={isMobile ? 'top' : 'start'}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          />
          <Tab
            icon={<InsightsIcon />}
            label={isMobile ? '' : 'AI Insights'}
            iconPosition={isMobile ? 'top' : 'start'}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          />
          <Tab
            icon={<ShowChartIcon />}
            label={isMobile ? '' : 'Predictions'}
            iconPosition={isMobile ? 'top' : 'start'}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          />
          <Tab
            icon={<GroupIcon />}
            label={isMobile ? '' : 'User Behavior'}
            iconPosition={isMobile ? 'top' : 'start'}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          />
        </Tabs>

        {/* Overview Tab */}
        {activeTab === 0 && (
          <Box sx={{ p: 3 }}>
            <Typography variant='h5' gutterBottom sx={{ mb: 3, ...commonStyles.gradientText }}>
              📈 System Overview
            </Typography>

            {/* Key Metrics */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {Object.entries(analyticsData.overview || {}).map(([key, value]) => (
                <Grid item xs={12} sm={6} md={4} lg={2.4} key={key}>
                  <Card sx={{ textAlign: 'center', ...commonStyles.cardHover }}>
                    <CardContent sx={{ p: 2 }}>
                      <Typography
                        variant='h4'
                        sx={{
                          fontWeight: 700,
                          color:
                            key === 'errorRate'
                              ? '#f44336'
                              : key === 'satisfaction'
                                ? '#4caf50'
                                : key === 'systemUptime'
                                  ? '#2196f3'
                                  : 'primary.main'
                        }}
                      >
                        {typeof value === 'number'
                          ? key === 'errorRate'
                            ? `${value}%`
                            : key === 'satisfaction'
                              ? value.toFixed(1)
                              : key === 'avgResponseTime'
                                ? `${value}ms`
                                : value
                          : value}
                      </Typography>
                      <Typography variant='body2' color='text.secondary' sx={{ textTransform: 'capitalize', mt: 1 }}>
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Trends */}
            <Typography variant='h6' gutterBottom sx={{ mb: 2 }}>
              📊 Key Trends
            </Typography>
            <Grid container spacing={3}>
              {Object.entries(analyticsData.trends || {}).map(([key, trend]) => (
                <Grid item xs={12} sm={6} md={3} key={key}>
                  <Card sx={{ ...commonStyles.cardHover }}>
                    <CardContent>
                      <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
                        <Typography variant='h6' sx={{ textTransform: 'capitalize' }}>
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </Typography>
                        {getTrendIcon(trend.change)}
                      </Box>
                      <Typography variant='h4' sx={{ fontWeight: 700, mb: 1 }}>
                        {typeof trend.current === 'number'
                          ? key === 'satisfaction'
                            ? trend.current.toFixed(1)
                            : key === 'errors'
                              ? `${trend.current}%`
                              : trend.current
                          : trend.current}
                      </Typography>
                      <Typography
                        variant='body2'
                        color={trend.change > 0 ? 'success.main' : 'error.main'}
                        sx={{ fontWeight: 600 }}
                      >
                        {trend.change > 0 ? '+' : ''}
                        {trend.change}% vs previous period
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Performance Tab */}
        {activeTab === 1 && (
          <Box sx={{ p: 3 }}>
            <Typography variant='h5' gutterBottom sx={{ mb: 3, ...commonStyles.gradientText }}>
              ⚡ Performance Metrics
            </Typography>

            {/* System Performance */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {Object.entries(systemMetrics).map(([key, value]) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={key}>
                  <Card sx={{ ...commonStyles.cardHover }}>
                    <CardContent>
                      <Typography variant='h6' gutterBottom sx={{ textTransform: 'capitalize' }}>
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </Typography>
                      <Typography
                        variant='h4'
                        sx={{
                          fontWeight: 700,
                          color: value > 90 ? '#4caf50' : value > 70 ? '#ff9800' : '#f44336',
                          mb: 2
                        }}
                      >
                        {typeof value === 'number'
                          ? key === 'responseTime'
                            ? `${value}ms`
                            : key === 'throughput'
                              ? `${value}/s`
                              : key === 'errorRate'
                                ? `${value}%`
                                : `${value}%`
                          : value}
                      </Typography>
                      <LinearProgress
                        variant='determinate'
                        value={typeof value === 'number' ? Math.min(value, 100) : 0}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Performance Chart */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant='h6' gutterBottom>
                  📈 Performance Over Time
                </Typography>
                <Box
                  sx={{
                    height: 300,
                    display: 'flex',
                    alignItems: 'end',
                    gap: 1,
                    p: 2
                  }}
                >
                  {performanceData.map((data, index) => (
                    <Box
                      key={index}
                      sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                      }}
                    >
                      <Box
                        sx={{
                          width: '100%',
                          backgroundColor: 'primary.main',
                          borderRadius: '4px 4px 0 0',
                          minHeight: 20,
                          height: `${(data.cpu / 100) * 200}px`,
                          mb: 1
                        }}
                      />
                      <Typography variant='caption' sx={{ fontSize: '0.7rem' }}>
                        {data.time}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Box>
        )}

        {/* AI Insights Tab */}
        {activeTab === 2 && (
          <Box sx={{ p: 3 }}>
            <Typography variant='h5' gutterBottom sx={{ mb: 3, ...commonStyles.gradientText }}>
              🤖 AI-Powered Insights
            </Typography>

            <Grid container spacing={3}>
              {aiInsights.map((insight, index) => (
                <Grid item xs={12} md={6} key={insight.id}>
                  <Zoom in timeout={300 + index * 100}>
                    <Card sx={{ ...commonStyles.cardHover }}>
                      <CardContent>
                        <Box display='flex' alignItems='center' mb={2}>
                          <Avatar
                            sx={{
                              bgcolor:
                                getImpactColor(insight.impact) === 'error'
                                  ? '#f44336'
                                  : getImpactColor(insight.impact) === 'warning'
                                    ? '#ff9800'
                                    : '#2196f3',
                              mr: 2
                            }}
                          >
                            {getImpactIcon(insight.impact)}
                          </Avatar>
                          <Box flexGrow={1}>
                            <Typography variant='h6' sx={{ fontWeight: 600 }}>
                              {insight.title}
                            </Typography>
                            <Box display='flex' gap={1} mt={1}>
                              <Chip label={insight.impact} size='small' color={getImpactColor(insight.impact)} />
                              <Chip label={`${insight.confidence}% confidence`} size='small' variant='outlined' />
                            </Box>
                          </Box>
                        </Box>

                        <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
                          {insight.description}
                        </Typography>

                        <Box sx={{ mb: 2 }}>
                          <Typography variant='body2' sx={{ fontWeight: 600, mb: 1 }}>
                            Recommended Action:
                          </Typography>
                          <Typography variant='body2' color='text.secondary'>
                            {insight.action}
                          </Typography>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                          <Typography variant='body2' sx={{ fontWeight: 600, mb: 1 }}>
                            Expected Improvement:
                          </Typography>
                          <Typography variant='body2' color='text.secondary'>
                            {insight.estimatedImprovement}
                          </Typography>
                        </Box>

                        <Button
                          variant='contained'
                          size='small'
                          onClick={() => console.log('Apply insight:', insight.id)}
                        >
                          Apply Insight
                        </Button>
                      </CardContent>
                    </Card>
                  </Zoom>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Predictions Tab */}
        {activeTab === 3 && (
          <Box sx={{ p: 3 }}>
            <Typography variant='h5' gutterBottom sx={{ mb: 3, ...commonStyles.gradientText }}>
              🔮 Predictive Analytics
            </Typography>

            <Grid container spacing={3}>
              {Object.entries(predictiveAnalytics).map(([key, prediction]) => (
                <Grid item xs={12} sm={6} md={3} key={key}>
                  <Card sx={{ ...commonStyles.cardHover }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant='h6' gutterBottom sx={{ textTransform: 'capitalize' }}>
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </Typography>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant='h4' sx={{ fontWeight: 700, color: 'primary.main' }}>
                          {typeof prediction.current === 'number'
                            ? key === 'satisfaction'
                              ? prediction.current.toFixed(1)
                              : key === 'errors'
                                ? `${prediction.current}%`
                                : prediction.current
                            : prediction.current}
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                          Current
                        </Typography>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant='h5' sx={{ fontWeight: 600, color: 'success.main' }}>
                          {typeof prediction.predicted === 'number'
                            ? key === 'satisfaction'
                              ? prediction.predicted.toFixed(1)
                              : key === 'errors'
                                ? `${prediction.predicted}%`
                                : prediction.predicted
                            : prediction.predicted}
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                          Predicted
                        </Typography>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant='body2' sx={{ fontWeight: 600 }}>
                          {prediction.confidence}% Confidence
                        </Typography>
                        <LinearProgress
                          variant='determinate'
                          value={prediction.confidence}
                          sx={{ height: 6, borderRadius: 3, mt: 1 }}
                        />
                      </Box>

                      <Typography variant='caption' color='text.secondary'>
                        {prediction.timeframe}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* User Behavior Tab */}
        {activeTab === 4 && (
          <Box sx={{ p: 3 }}>
            <Typography variant='h5' gutterBottom sx={{ mb: 3, ...commonStyles.gradientText }}>
              👥 User Behavior Analysis
            </Typography>

            <Grid container spacing={3}>
              {/* Popular Features */}
              <Grid item xs={12} md={6}>
                <Card sx={{ ...commonStyles.cardHover }}>
                  <CardContent>
                    <Typography variant='h6' gutterBottom>
                      🔥 Popular Features
                    </Typography>
                    <List>
                      {userBehavior.popularFeatures?.map((feature, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <Avatar
                              sx={{
                                bgcolor: appCategoryColors[index % appCategoryColors.length]
                              }}
                            >
                              {index + 1}
                            </Avatar>
                          </ListItemIcon>
                          <ListItemText primary={feature.name} secondary={`${feature.usage}% usage`} />
                          <ListItemSecondaryAction>
                            <LinearProgress
                              variant='determinate'
                              value={feature.usage}
                              sx={{ width: 100, height: 8, borderRadius: 4 }}
                            />
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              {/* Device Usage */}
              <Grid item xs={12} md={6}>
                <Card sx={{ ...commonStyles.cardHover }}>
                  <CardContent>
                    <Typography variant='h6' gutterBottom>
                      📱 Device Usage
                    </Typography>
                    <Box sx={{ p: 2 }}>
                      {Object.entries(userBehavior.deviceUsage || {}).map(([device, usage]) => (
                        <Box key={device} sx={{ mb: 2 }}>
                          <Box display='flex' justifyContent='space-between' alignItems='center' mb={1}>
                            <Typography variant='body2' sx={{ textTransform: 'capitalize' }}>
                              {device}
                            </Typography>
                            <Typography variant='body2' sx={{ fontWeight: 600 }}>
                              {usage}%
                            </Typography>
                          </Box>
                          <LinearProgress variant='determinate' value={usage} sx={{ height: 8, borderRadius: 4 }} />
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* User Journey */}
              <Grid item xs={12}>
                <Card sx={{ ...commonStyles.cardHover }}>
                  <CardContent>
                    <Typography variant='h6' gutterBottom>
                      🛤️ User Journey
                    </Typography>
                    <Timeline>
                      {userBehavior.userJourney?.map((step, index) => (
                        <TimelineItem key={index}>
                          <TimelineSeparator>
                            <TimelineDot color='primary' />
                            {index < userBehavior.userJourney.length - 1 && <TimelineConnector />}
                          </TimelineSeparator>
                          <TimelineContent>
                            <Typography variant='h6' component='span'>
                              {step.step}
                            </Typography>
                            <Typography variant='body2' color='text.secondary'>
                              {step.completion}% completion rate
                            </Typography>
                            <LinearProgress
                              variant='determinate'
                              value={step.completion}
                              sx={{ mt: 1, height: 6, borderRadius: 3 }}
                            />
                          </TimelineContent>
                        </TimelineItem>
                      ))}
                    </Timeline>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default AIAnalyticsDashboard;
