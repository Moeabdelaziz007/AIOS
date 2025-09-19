import {
  Psychology as AIIcon,
  Analytics as AnalyticsIcon,
  Apps as AppsIcon,
  CheckCircle as CheckCircleIcon,
  Dashboard as DashboardIcon,
  Info as InfoIcon,
  Lightbulb as LightbulbIcon,
  AutoAwesome as MagicIcon,
  Refresh as RefreshIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  TrendingUp as TrendingUpIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import {
  Avatar,
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
  Tooltip,
  Typography,
  Zoom,
} from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  animations,
  appCategoryColors,
  commonStyles,
} from '../theme/aiosTheme';

const PredictiveUIComponent = () => {
  const { userProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [predictions, setPredictions] = useState([]);
  const [userBehavior, setUserBehavior] = useState({});
  const [smartSuggestions, setSmartSuggestions] = useState([]);
  const [contextualHelp, setContextualHelp] = useState([]);
  const [predictionAccuracy, setPredictionAccuracy] = useState(0);
  const [isLearning, setIsLearning] = useState(false);
  const [suggestionDialogOpen, setSuggestionDialogOpen] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);

  // User Behavior Patterns
  const behaviorPatterns = useMemo(
    () => ({
      navigation: {
        mostVisited: ['dashboard', 'apps', 'monitoring', 'settings'],
        timeSpent: { dashboard: 45, apps: 30, monitoring: 20, settings: 5 },
        frequency: { dashboard: 85, apps: 70, monitoring: 40, settings: 15 },
      },
      preferences: {
        theme: 'dark',
        language: 'en',
        notifications: true,
        autoRefresh: true,
        aiInsights: true,
      },
      patterns: {
        peakHours: [9, 10, 11, 14, 15, 16],
        commonActions: ['refresh', 'navigate', 'search', 'filter'],
        sessionDuration: 25,
        averageTasksPerSession: 8,
      },
    }),
    []
  );

  // Smart Suggestions Configuration
  const suggestionTypes = {
    navigation: {
      icon: <AppsIcon />,
      color: '#667eea',
      description: 'Suggested navigation based on your usage patterns',
    },
    performance: {
      icon: <SpeedIcon />,
      color: '#43e97b',
      description: 'Performance optimization recommendations',
    },
    security: {
      icon: <SecurityIcon />,
      color: '#fa709a',
      description: 'Security enhancements and best practices',
    },
    productivity: {
      icon: <TrendingUpIcon />,
      color: '#4facfe',
      description: 'Productivity tips and workflow improvements',
    },
    ai: {
      icon: <AIIcon />,
      color: '#f093fb',
      description: 'AI-powered insights and automation opportunities',
    },
  };

  // Generate Smart Suggestions
  const generateSmartSuggestions = useCallback(() => {
    const suggestions = [
      {
        id: 1,
        type: 'navigation',
        title: 'Quick Access to Monitoring',
        description:
          'You frequently check the monitoring dashboard. Would you like to add it to your favorites?',
        confidence: 92,
        action: 'add_to_favorites',
        data: { page: 'monitoring' },
        timestamp: new Date().toISOString(),
        priority: 'high',
      },
      {
        id: 2,
        type: 'performance',
        title: 'Optimize Agent Performance',
        description:
          'Your Quantum Autopilot agent could benefit from memory optimization. This could improve performance by 15%.',
        confidence: 88,
        action: 'optimize_agent',
        data: { agent: 'quantum-autopilot', optimization: 'memory' },
        timestamp: new Date().toISOString(),
        priority: 'medium',
      },
      {
        id: 3,
        type: 'security',
        title: 'Enable Two-Factor Authentication',
        description:
          'Based on your usage patterns, enabling 2FA would enhance your account security.',
        confidence: 95,
        action: 'enable_2fa',
        data: {},
        timestamp: new Date().toISOString(),
        priority: 'high',
      },
      {
        id: 4,
        type: 'productivity',
        title: 'Set Up Voice Commands',
        description:
          'You spend significant time navigating. Voice commands could speed up your workflow.',
        confidence: 78,
        action: 'setup_voice',
        data: {},
        timestamp: new Date().toISOString(),
        priority: 'medium',
      },
      {
        id: 5,
        type: 'ai',
        title: 'AI Learning Enhancement',
        description:
          'The Learning Loop Agent has identified new patterns. Would you like to review the insights?',
        confidence: 85,
        action: 'review_ai_insights',
        data: { agent: 'learning-agent' },
        timestamp: new Date().toISOString(),
        priority: 'low',
      },
    ];

    setSmartSuggestions(suggestions);
  }, []);

  // Generate Contextual Help
  const generateContextualHelp = useCallback(() => {
    const helpItems = [
      {
        id: 1,
        context: 'dashboard',
        title: 'Dashboard Overview',
        description:
          'Your dashboard shows real-time system status and AI agent performance.',
        tips: [
          'Click on any metric card to see detailed analytics',
          'Use the refresh button to get the latest data',
          'Hover over charts for more information',
        ],
        relatedActions: ['view_analytics', 'refresh_data', 'export_report'],
      },
      {
        id: 2,
        context: 'apps',
        title: 'App Management',
        description:
          'Manage your AI-powered applications and agents from this page.',
        tips: [
          'Use the search bar to quickly find specific apps',
          'Click on agent cards to see detailed information',
          'Use the filter options to organize your view',
        ],
        relatedActions: ['search_apps', 'filter_apps', 'manage_agents'],
      },
      {
        id: 3,
        context: 'monitoring',
        title: 'Real-time Monitoring',
        description:
          'Monitor your AI agents and system performance in real-time.',
        tips: [
          'Watch the activity timeline for live updates',
          'Use the controls tab to manage agents',
          'Check the analytics tab for performance trends',
        ],
        relatedActions: ['monitor_agents', 'control_agents', 'view_analytics'],
      },
      {
        id: 4,
        context: 'settings',
        title: 'System Settings',
        description:
          'Configure your AIOS system preferences and AI agent settings.',
        tips: [
          'Adjust AI agent performance settings',
          'Configure notification preferences',
          'Set up security options',
        ],
        relatedActions: [
          'configure_agents',
          'set_notifications',
          'security_settings',
        ],
      },
    ];

    setContextualHelp(helpItems);
  }, []);

  // Generate Predictions
  const generatePredictions = useCallback(() => {
    const predictions = [
      {
        id: 1,
        type: 'next_action',
        prediction: 'You will likely visit the monitoring dashboard next',
        confidence: 87,
        reasoning:
          'Based on your usage pattern of checking monitoring every 15 minutes',
        timestamp: new Date().toISOString(),
        category: 'navigation',
      },
      {
        id: 2,
        type: 'performance_issue',
        prediction: 'System performance may decrease in the next 30 minutes',
        confidence: 73,
        reasoning: 'Memory usage is trending upward and CPU load is increasing',
        timestamp: new Date().toISOString(),
        category: 'performance',
      },
      {
        id: 3,
        type: 'security_alert',
        prediction: 'Potential security scan recommended',
        confidence: 91,
        reasoning: 'It has been 24 hours since the last security scan',
        timestamp: new Date().toISOString(),
        category: 'security',
      },
      {
        id: 4,
        type: 'ai_optimization',
        prediction: 'AI agents could benefit from learning update',
        confidence: 82,
        reasoning:
          'New data patterns detected that could improve AI performance',
        timestamp: new Date().toISOString(),
        category: 'ai',
      },
    ];

    setPredictions(predictions);
  }, []);

  // Process Suggestion Action
  const processSuggestionAction = useCallback(async suggestion => {
    console.log('Processing suggestion:', suggestion);

    switch (suggestion.action) {
      case 'add_to_favorites':
        // Simulate adding to favorites
        console.log('Added to favorites:', suggestion.data.page);
        break;
      case 'optimize_agent':
        // Simulate agent optimization
        console.log('Optimizing agent:', suggestion.data.agent);
        break;
      case 'enable_2fa':
        // Simulate 2FA setup
        console.log('Setting up 2FA');
        break;
      case 'setup_voice':
        // Simulate voice setup
        console.log('Setting up voice commands');
        break;
      case 'review_ai_insights':
        // Simulate AI insights review
        console.log('Reviewing AI insights:', suggestion.data.agent);
        break;
      default:
        console.log('Unknown action:', suggestion.action);
    }

    // Remove the suggestion after processing
    setSmartSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
    setSuggestionDialogOpen(false);
  }, []);

  // Calculate Prediction Accuracy
  const calculatePredictionAccuracy = useCallback(() => {
    // Simulate accuracy calculation based on historical data
    const accuracy = Math.floor(Math.random() * 20) + 80; // 80-100%
    setPredictionAccuracy(accuracy);
  }, []);

  // Simulate Learning Process
  const simulateLearning = useCallback(() => {
    setIsLearning(true);
    setTimeout(() => {
      setIsLearning(false);
      generateSmartSuggestions();
      generateContextualHelp();
      generatePredictions();
      calculatePredictionAccuracy();
    }, 2000);
  }, [
    generateSmartSuggestions,
    generateContextualHelp,
    generatePredictions,
    calculatePredictionAccuracy,
  ]);

  useEffect(() => {
    setLoading(false);
    generateSmartSuggestions();
    generateContextualHelp();
    generatePredictions();
    calculatePredictionAccuracy();
  }, [
    generateSmartSuggestions,
    generateContextualHelp,
    generatePredictions,
    calculatePredictionAccuracy,
  ]);

  const getPriorityColor = priority => {
    switch (priority) {
      case 'high':
        return '#f44336';
      case 'medium':
        return '#ff9800';
      case 'low':
        return '#4caf50';
      default:
        return '#9e9e9e';
    }
  };

  const getConfidenceColor = confidence => {
    if (confidence >= 90) return '#4caf50';
    if (confidence >= 75) return '#ff9800';
    return '#f44336';
  };

  if (loading) {
    return (
      <Container
        maxWidth='lg'
        sx={{ ...commonStyles.centerContent, flexDirection: 'column' }}
      >
        <CircularProgress size={80} thickness={4} />
        <Typography variant='h5' sx={{ mt: 3, ...commonStyles.gradientText }}>
          Analyzing User Patterns...
        </Typography>
        <Typography variant='body1' color='text.secondary' sx={{ mt: 1 }}>
          Please wait while we learn your preferences and generate smart
          suggestions
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
      {/* Predictive UI Header */}
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
        {/* AI Animation */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            animation: isLearning ? 'pulse 2s ease-in-out infinite' : 'none',
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
              <LightbulbIcon sx={{ fontSize: '2.5rem' }} />
              Predictive UI & Smart Suggestions
            </Typography>
            <Typography variant='h6' sx={{ opacity: 0.9 }}>
              AI-powered predictions and intelligent suggestions based on your
              usage patterns
            </Typography>
            <Box mt={2} display='flex' gap={2} flexWrap='wrap'>
              <Chip
                icon={<TrendingUpIcon />}
                label={`${predictionAccuracy}% Accuracy`}
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
              <Chip
                icon={<LightbulbIcon />}
                label={`${smartSuggestions.length} Suggestions`}
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
              <Chip
                icon={<AIIcon />}
                label={isLearning ? 'Learning...' : 'Ready'}
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
            </Box>
          </Box>
          <Box display='flex' gap={1}>
            <Tooltip title='Refresh Predictions'>
              <IconButton
                onClick={simulateLearning}
                disabled={isLearning}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title='AI Learning Status'>
              <IconButton
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                }}
              >
                {isLearning ? (
                  <CircularProgress size={24} color='inherit' />
                ) : (
                  <AIIcon />
                )}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Paper>

      {/* Quick Suggestions Bar */}
      <Paper elevation={2} sx={{ p: 2, mb: 4, borderRadius: 3 }}>
        <Typography
          variant='h6'
          gutterBottom
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <MagicIcon />
          Quick Suggestions
        </Typography>
        <Box display='flex' gap={2} flexWrap='wrap'>
          {smartSuggestions.slice(0, 3).map(suggestion => (
            <Chip
              key={suggestion.id}
              label={suggestion.title}
              onClick={() => {
                setSelectedSuggestion(suggestion);
                setSuggestionDialogOpen(true);
              }}
              sx={{
                bgcolor: suggestionTypes[suggestion.type].color,
                color: 'white',
                cursor: 'pointer',
                '&:hover': { opacity: 0.8 },
              }}
              icon={suggestionTypes[suggestion.type].icon}
            />
          ))}
        </Box>
      </Paper>

      {/* Tabbed Interface */}
      <Paper elevation={2} sx={{ borderRadius: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab
            icon={<LightbulbIcon />}
            label='Smart Suggestions'
            iconPosition='start'
            sx={{ textTransform: 'none', fontWeight: 600 }}
          />
          <Tab
            icon={<TrendingUpIcon />}
            label='Predictions'
            iconPosition='start'
            sx={{ textTransform: 'none', fontWeight: 600 }}
          />
          <Tab
            icon={<InfoIcon />}
            label='Contextual Help'
            iconPosition='start'
            sx={{ textTransform: 'none', fontWeight: 600 }}
          />
          <Tab
            icon={<AnalyticsIcon />}
            label='Behavior Analysis'
            iconPosition='start'
            sx={{ textTransform: 'none', fontWeight: 600 }}
          />
        </Tabs>

        {/* Smart Suggestions Tab */}
        {activeTab === 0 && (
          <Box sx={{ p: 3 }}>
            <Typography
              variant='h5'
              gutterBottom
              sx={{ mb: 3, ...commonStyles.gradientText }}
            >
              💡 Smart Suggestions
            </Typography>
            <Grid container spacing={3}>
              {smartSuggestions.map((suggestion, index) => (
                <Grid item xs={12} md={6} lg={4} key={suggestion.id}>
                  <Zoom in timeout={300 + index * 100}>
                    <Card sx={{ height: '100%', ...commonStyles.cardHover }}>
                      <CardContent>
                        <Box display='flex' alignItems='center' mb={2}>
                          <Avatar
                            sx={{
                              bgcolor: suggestionTypes[suggestion.type].color,
                              mr: 2,
                              width: 48,
                              height: 48,
                            }}
                          >
                            {suggestionTypes[suggestion.type].icon}
                          </Avatar>
                          <Box flexGrow={1}>
                            <Typography variant='h6' sx={{ fontWeight: 600 }}>
                              {suggestion.title}
                            </Typography>
                            <Box display='flex' gap={1}>
                              <Chip
                                label={suggestion.priority}
                                size='small'
                                sx={{
                                  bgcolor: getPriorityColor(
                                    suggestion.priority
                                  ),
                                  color: 'white',
                                }}
                              />
                              <Chip
                                label={`${suggestion.confidence}% confidence`}
                                size='small'
                                sx={{
                                  bgcolor: getConfidenceColor(
                                    suggestion.confidence
                                  ),
                                  color: 'white',
                                }}
                              />
                            </Box>
                          </Box>
                        </Box>

                        <Typography
                          variant='body2'
                          color='text.secondary'
                          sx={{ mb: 2 }}
                        >
                          {suggestion.description}
                        </Typography>

                        <Typography variant='caption' color='text.secondary'>
                          {suggestionTypes[suggestion.type].description}
                        </Typography>
                      </CardContent>

                      <CardActions>
                        <Button
                          size='small'
                          onClick={() => processSuggestionAction(suggestion)}
                          startIcon={<CheckCircleIcon />}
                          color='success'
                        >
                          Apply
                        </Button>
                        <Button
                          size='small'
                          onClick={() => {
                            setSelectedSuggestion(suggestion);
                            setSuggestionDialogOpen(true);
                          }}
                          startIcon={<ViewIcon />}
                        >
                          Details
                        </Button>
                      </CardActions>
                    </Card>
                  </Zoom>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Predictions Tab */}
        {activeTab === 1 && (
          <Box sx={{ p: 3 }}>
            <Typography
              variant='h5'
              gutterBottom
              sx={{ mb: 3, ...commonStyles.gradientText }}
            >
              🔮 AI Predictions
            </Typography>
            <Grid container spacing={3}>
              {predictions.map((prediction, index) => (
                <Grid item xs={12} md={6} key={prediction.id}>
                  <Zoom in timeout={300 + index * 100}>
                    <Card sx={{ height: '100%', ...commonStyles.cardHover }}>
                      <CardContent>
                        <Box display='flex' alignItems='center' mb={2}>
                          <Avatar
                            sx={{
                              bgcolor: appCategoryColors.core,
                              mr: 2,
                              width: 48,
                              height: 48,
                            }}
                          >
                            <TrendingUpIcon />
                          </Avatar>
                          <Box flexGrow={1}>
                            <Typography variant='h6' sx={{ fontWeight: 600 }}>
                              {prediction.prediction}
                            </Typography>
                            <Chip
                              label={`${prediction.confidence}% confidence`}
                              size='small'
                              sx={{
                                bgcolor: getConfidenceColor(
                                  prediction.confidence
                                ),
                                color: 'white',
                              }}
                            />
                          </Box>
                        </Box>

                        <Typography
                          variant='body2'
                          color='text.secondary'
                          sx={{ mb: 2 }}
                        >
                          {prediction.reasoning}
                        </Typography>

                        <Typography variant='caption' color='text.secondary'>
                          Category: {prediction.category} •{' '}
                          {new Date(prediction.timestamp).toLocaleString()}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Zoom>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Contextual Help Tab */}
        {activeTab === 2 && (
          <Box sx={{ p: 3 }}>
            <Typography
              variant='h5'
              gutterBottom
              sx={{ mb: 3, ...commonStyles.gradientText }}
            >
              ℹ️ Contextual Help
            </Typography>
            <Grid container spacing={3}>
              {contextualHelp.map((help, index) => (
                <Grid item xs={12} md={6} key={help.id}>
                  <Zoom in timeout={300 + index * 100}>
                    <Card sx={{ height: '100%', ...commonStyles.cardHover }}>
                      <CardContent>
                        <Typography
                          variant='h6'
                          gutterBottom
                          sx={{ fontWeight: 600 }}
                        >
                          {help.title}
                        </Typography>
                        <Typography
                          variant='body2'
                          color='text.secondary'
                          sx={{ mb: 2 }}
                        >
                          {help.description}
                        </Typography>

                        <Typography variant='subtitle2' gutterBottom>
                          Tips:
                        </Typography>
                        <List dense>
                          {help.tips.map((tip, tipIndex) => (
                            <ListItem key={tipIndex} sx={{ py: 0 }}>
                              <ListItemIcon sx={{ minWidth: 32 }}>
                                <CheckCircleIcon
                                  fontSize='small'
                                  color='success'
                                />
                              </ListItemIcon>
                              <ListItemText primary={tip} />
                            </ListItem>
                          ))}
                        </List>
                      </CardContent>
                    </Card>
                  </Zoom>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Behavior Analysis Tab */}
        {activeTab === 3 && (
          <Box sx={{ p: 3 }}>
            <Typography
              variant='h5'
              gutterBottom
              sx={{ mb: 3, ...commonStyles.gradientText }}
            >
              📊 Behavior Analysis
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant='h6' gutterBottom>
                      Navigation Patterns
                    </Typography>
                    <List>
                      {Object.entries(
                        behaviorPatterns.navigation.mostVisited
                      ).map(([page, visits]) => (
                        <ListItem key={page}>
                          <ListItemIcon>
                            <DashboardIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              page.charAt(0).toUpperCase() + page.slice(1)
                            }
                            secondary={`${visits} visits`}
                          />
                          <ListItemSecondaryAction>
                            <Typography variant='body2' color='text.secondary'>
                              {behaviorPatterns.navigation.frequency[page]}%
                            </Typography>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant='h6' gutterBottom>
                      Usage Statistics
                    </Typography>
                    <Box mt={2}>
                      <Box
                        display='flex'
                        justifyContent='space-between'
                        alignItems='center'
                        mb={1}
                      >
                        <Typography variant='body2'>
                          Session Duration
                        </Typography>
                        <Typography variant='body2' sx={{ fontWeight: 600 }}>
                          {behaviorPatterns.patterns.sessionDuration} min
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant='determinate'
                        value={behaviorPatterns.patterns.sessionDuration}
                        sx={{ height: 8, borderRadius: 4, mb: 3 }}
                      />

                      <Box
                        display='flex'
                        justifyContent='space-between'
                        alignItems='center'
                        mb={1}
                      >
                        <Typography variant='body2'>
                          Tasks per Session
                        </Typography>
                        <Typography variant='body2' sx={{ fontWeight: 600 }}>
                          {behaviorPatterns.patterns.averageTasksPerSession}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant='determinate'
                        value={
                          behaviorPatterns.patterns.averageTasksPerSession * 10
                        }
                        sx={{ height: 8, borderRadius: 4, mb: 3 }}
                      />

                      <Box
                        display='flex'
                        justifyContent='space-between'
                        alignItems='center'
                        mb={1}
                      >
                        <Typography variant='body2'>
                          Prediction Accuracy
                        </Typography>
                        <Typography variant='body2' sx={{ fontWeight: 600 }}>
                          {predictionAccuracy}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant='determinate'
                        value={predictionAccuracy}
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

      {/* Suggestion Details Dialog */}
      <Dialog
        open={suggestionDialogOpen}
        onClose={() => setSuggestionDialogOpen(false)}
        maxWidth='md'
        fullWidth
      >
        <DialogTitle>
          <Box display='flex' alignItems='center' gap={2}>
            <Avatar
              sx={{
                bgcolor: selectedSuggestion
                  ? suggestionTypes[selectedSuggestion.type].color
                  : 'primary',
              }}
            >
              {selectedSuggestion ? (
                suggestionTypes[selectedSuggestion.type].icon
              ) : (
                <LightbulbIcon />
              )}
            </Avatar>
            <Box>
              <Typography variant='h6'>{selectedSuggestion?.title}</Typography>
              <Typography variant='body2' color='text.secondary'>
                {selectedSuggestion?.type} suggestion
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedSuggestion && (
            <Box>
              <Typography variant='body1' sx={{ mb: 2 }}>
                {selectedSuggestion.description}
              </Typography>

              <Box display='flex' gap={2} mb={2}>
                <Chip
                  label={`${selectedSuggestion.confidence}% confidence`}
                  sx={{
                    bgcolor: getConfidenceColor(selectedSuggestion.confidence),
                    color: 'white',
                  }}
                />
                <Chip
                  label={selectedSuggestion.priority}
                  sx={{
                    bgcolor: getPriorityColor(selectedSuggestion.priority),
                    color: 'white',
                  }}
                />
              </Box>

              <Typography variant='body2' color='text.secondary'>
                This suggestion is based on your usage patterns and system
                analysis.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSuggestionDialogOpen(false)}>Close</Button>
          <Button
            variant='contained'
            onClick={() =>
              selectedSuggestion && processSuggestionAction(selectedSuggestion)
            }
          >
            Apply Suggestion
          </Button>
        </DialogActions>
      </Dialog>

      <Box mt={4} textAlign='center'>
        <Typography variant='body2' color='text.secondary'>
          Predictive UI • User: {userProfile?.role || 'Unknown'} • Accuracy:{' '}
          {predictionAccuracy}% • Last Updated: {new Date().toLocaleString()}
        </Typography>
      </Box>
    </Container>
  );
};

export default PredictiveUIComponent;
