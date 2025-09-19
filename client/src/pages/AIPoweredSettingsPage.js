import {
  SmartToy as AgentIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Insights as InsightsIcon,
  AutoAwesome as MagicIcon,
  Notifications as NotificationsIcon,
  Palette as PaletteIcon,
  Speed as PerformanceIcon,
  Restore as RestoreIcon,
  Save as SaveIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Slider,
  Switch,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
  Zoom,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  animations,
  appCategoryColors,
  commonStyles,
} from '../theme/aiosTheme';

const AIPoweredSettingsPage = () => {
  const { userProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [settings, setSettings] = useState({
    // AI Agent Settings
    aiAgents: {
      quantumAutopilot: { enabled: true, performance: 95, autoOptimize: true },
      dataAgent: { enabled: true, performance: 88, autoProcess: true },
      debugAgent: { enabled: true, performance: 92, autoFix: true },
      learningAgent: { enabled: true, performance: 78, autoLearn: true },
      securityAgent: { enabled: true, performance: 96, autoMonitor: true },
      communicationAgent: { enabled: true, performance: 85, autoRespond: true },
    },
    // User Preferences
    preferences: {
      theme: 'dark',
      language: 'en',
      notifications: true,
      autoRefresh: true,
      aiInsights: true,
      voiceCommands: false,
      gestureControl: false,
      predictiveUI: true,
      smartDefaults: true,
    },
    // Performance Settings
    performance: {
      refreshInterval: 5000,
      maxConcurrentAgents: 6,
      memoryLimit: 80,
      cpuLimit: 70,
      networkOptimization: true,
      cacheSize: 100,
    },
    // Security Settings
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      dataEncryption: true,
      auditLogging: true,
      ipWhitelist: [],
      apiRateLimit: 100,
    },
    // Notification Settings
    notifications: {
      systemAlerts: true,
      agentUpdates: true,
      performanceWarnings: true,
      securityAlerts: true,
      emailNotifications: false,
      pushNotifications: true,
      soundEnabled: true,
      vibrationEnabled: false,
    },
  });
  const [aiInsights, setAiInsights] = useState([]);
  const [systemHealth] = useState({
    overall: 92,
    agents: 95,
    performance: 88,
    security: 96,
    uptime: 99.8,
  });

  // AI Agent Management Functions
  const handleAgentToggle = (agentId, setting) => {
    setSettings(prev => ({
      ...prev,
      aiAgents: {
        ...prev.aiAgents,
        [agentId]: {
          ...prev.aiAgents[agentId],
          [setting]: !prev.aiAgents[agentId][setting],
        },
      },
    }));
  };

  const handleAgentPerformanceChange = (agentId, value) => {
    setSettings(prev => ({
      ...prev,
      aiAgents: {
        ...prev.aiAgents,
        [agentId]: {
          ...prev.aiAgents[agentId],
          performance: value,
        },
      },
    }));
  };

  const handlePreferenceChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value,
      },
    }));
  };

  const generateAIInsights = () => {
    const insights = [
      {
        id: 1,
        type: 'optimization',
        title: 'AI Agent Optimization Suggestion',
        description:
          'Consider enabling auto-optimization for Quantum Autopilot to improve performance by 15%',
        priority: 'high',
        agent: 'quantum-autopilot',
        timestamp: new Date().toISOString(),
        actionable: true,
      },
      {
        id: 2,
        type: 'security',
        title: 'Security Enhancement Available',
        description: 'Enable two-factor authentication for enhanced security',
        priority: 'medium',
        agent: 'security-agent',
        timestamp: new Date().toISOString(),
        actionable: true,
      },
      {
        id: 3,
        type: 'performance',
        title: 'Performance Tuning Opportunity',
        description:
          'Reduce refresh interval to 3 seconds for better real-time updates',
        priority: 'low',
        agent: 'data-agent',
        timestamp: new Date().toISOString(),
        actionable: true,
      },
    ];
    setAiInsights(insights);
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      // Simulate saving to Firebase
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Settings saved:', settings);
      // Here you would save to Firebase Firestore
      // await updateDoc(doc(db, 'users', userProfile.uid), { settings });
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = () => {
    setSettings({
      aiAgents: {
        quantumAutopilot: {
          enabled: true,
          performance: 95,
          autoOptimize: true,
        },
        dataAgent: { enabled: true, performance: 88, autoProcess: true },
        debugAgent: { enabled: true, performance: 92, autoFix: true },
        learningAgent: { enabled: true, performance: 78, autoLearn: true },
        securityAgent: { enabled: true, performance: 96, autoMonitor: true },
        communicationAgent: {
          enabled: true,
          performance: 85,
          autoRespond: true,
        },
      },
      preferences: {
        theme: 'dark',
        language: 'en',
        notifications: true,
        autoRefresh: true,
        aiInsights: true,
        voiceCommands: false,
        gestureControl: false,
        predictiveUI: true,
        smartDefaults: true,
      },
      performance: {
        refreshInterval: 5000,
        maxConcurrentAgents: 6,
        memoryLimit: 80,
        cpuLimit: 70,
        networkOptimization: true,
        cacheSize: 100,
      },
      security: {
        twoFactorAuth: false,
        sessionTimeout: 30,
        dataEncryption: true,
        auditLogging: true,
        ipWhitelist: [],
        apiRateLimit: 100,
      },
      notifications: {
        systemAlerts: true,
        agentUpdates: true,
        performanceWarnings: true,
        securityAlerts: true,
        emailNotifications: false,
        pushNotifications: true,
        soundEnabled: true,
        vibrationEnabled: false,
      },
    });
  };

  useEffect(() => {
    generateAIInsights();
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <Container
        maxWidth='lg'
        sx={{ ...commonStyles.centerContent, flexDirection: 'column' }}
      >
        <CircularProgress size={80} thickness={4} />
        <Typography variant='h5' sx={{ mt: 3, ...commonStyles.gradientText }}>
          Loading AI Settings...
        </Typography>
        <Typography variant='body1' color='text.secondary' sx={{ mt: 1 }}>
          Please wait while we initialize your AI configuration
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
              <SettingsIcon sx={{ fontSize: '2.5rem' }} />
              AI-Powered Settings
            </Typography>
            <Typography variant='h6' sx={{ opacity: 0.9 }}>
              Configure your AI agents and system preferences intelligently
            </Typography>
            <Box mt={2} display='flex' gap={2} flexWrap='wrap'>
              <Chip
                icon={<AgentIcon />}
                label='6 AI Agents'
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
              <Chip
                icon={<MagicIcon />}
                label='Smart Defaults'
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
              <Chip
                label={userProfile?.role || 'User'}
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
            </Box>
          </Box>
          <Box display='flex' gap={1}>
            <Tooltip title='Save Settings'>
              <IconButton
                onClick={saveSettings}
                disabled={saving}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                }}
              >
                <SaveIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title='Reset to Defaults'>
              <IconButton
                onClick={resetToDefaults}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                }}
              >
                <RestoreIcon />
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
            AI Configuration Insights
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
                    {insight.actionable && (
                      <Button size='small' sx={{ mt: 1 }}>
                        Apply Suggestion
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {/* System Health Overview */}
      <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Typography
          variant='h5'
          gutterBottom
          sx={{ ...commonStyles.gradientText }}
        >
          📊 System Health Overview
        </Typography>
        <Grid container spacing={3}>
          {Object.entries(systemHealth).map(([key, value]) => (
            <Grid item xs={12} sm={6} md={2.4} key={key}>
              <Card sx={{ textAlign: 'center', ...commonStyles.cardHover }}>
                <CardContent>
                  <Typography
                    variant='h4'
                    sx={{
                      fontWeight: 700,
                      color:
                        value > 90
                          ? '#4caf50'
                          : value > 70
                          ? '#ff9800'
                          : '#f44336',
                    }}
                  >
                    {value}%
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
                    value={value}
                    sx={{ mt: 1, height: 6, borderRadius: 3 }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Tabbed Settings Interface */}
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
            icon={<PaletteIcon />}
            label='Preferences'
            iconPosition='start'
            sx={{ textTransform: 'none', fontWeight: 600 }}
          />
          <Tab
            icon={<PerformanceIcon />}
            label='Performance'
            iconPosition='start'
            sx={{ textTransform: 'none', fontWeight: 600 }}
          />
          <Tab
            icon={<SecurityIcon />}
            label='Security'
            iconPosition='start'
            sx={{ textTransform: 'none', fontWeight: 600 }}
          />
          <Tab
            icon={<NotificationsIcon />}
            label='Notifications'
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
              🤖 AI Agent Configuration
            </Typography>
            <Grid container spacing={3}>
              {Object.entries(settings.aiAgents).map(
                ([agentId, config], index) => (
                  <Grid item xs={12} md={6} lg={4} key={agentId}>
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
                              <AgentIcon />
                            </Avatar>
                            <Box>
                              <Typography
                                variant='h6'
                                sx={{
                                  fontWeight: 600,
                                  textTransform: 'capitalize',
                                }}
                              >
                                {agentId.replace(/([A-Z])/g, ' $1').trim()}
                              </Typography>
                              <Chip
                                label={config.enabled ? 'Active' : 'Inactive'}
                                size='small'
                                color={config.enabled ? 'success' : 'default'}
                              />
                            </Box>
                          </Box>

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
                                {config.performance}%
                              </Typography>
                            </Box>
                            <Slider
                              value={config.performance}
                              onChange={(e, value) =>
                                handleAgentPerformanceChange(agentId, value)
                              }
                              min={0}
                              max={100}
                              step={5}
                              sx={{ color: appCategoryColors.core }}
                            />
                          </Box>

                          <Box display='flex' flexDirection='column' gap={1}>
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={config.enabled}
                                  onChange={() =>
                                    handleAgentToggle(agentId, 'enabled')
                                  }
                                  color='primary'
                                />
                              }
                              label='Enable Agent'
                            />
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={
                                    config.autoOptimize ||
                                    config.autoProcess ||
                                    config.autoFix ||
                                    config.autoLearn ||
                                    config.autoMonitor ||
                                    config.autoRespond
                                  }
                                  onChange={() =>
                                    handleAgentToggle(
                                      agentId,
                                      Object.keys(config).find(key =>
                                        key.startsWith('auto')
                                      ) || 'autoOptimize'
                                    )
                                  }
                                  color='secondary'
                                />
                              }
                              label='Auto Mode'
                            />
                          </Box>
                        </CardContent>
                      </Card>
                    </Zoom>
                  </Grid>
                )
              )}
            </Grid>
          </Box>
        )}

        {/* Preferences Tab */}
        {activeTab === 1 && (
          <Box sx={{ p: 3 }}>
            <Typography
              variant='h5'
              gutterBottom
              sx={{ mb: 3, ...commonStyles.gradientText }}
            >
              🎨 User Preferences
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant='h6' gutterBottom>
                      Appearance & Interface
                    </Typography>
                    <Box display='flex' flexDirection='column' gap={2}>
                      <FormControl fullWidth>
                        <InputLabel>Theme</InputLabel>
                        <Select
                          value={settings.preferences.theme}
                          onChange={e =>
                            handlePreferenceChange(
                              'preferences',
                              'theme',
                              e.target.value
                            )
                          }
                        >
                          <MenuItem value='light'>Light</MenuItem>
                          <MenuItem value='dark'>Dark</MenuItem>
                          <MenuItem value='auto'>Auto</MenuItem>
                        </Select>
                      </FormControl>

                      <FormControl fullWidth>
                        <InputLabel>Language</InputLabel>
                        <Select
                          value={settings.preferences.language}
                          onChange={e =>
                            handlePreferenceChange(
                              'preferences',
                              'language',
                              e.target.value
                            )
                          }
                        >
                          <MenuItem value='en'>English</MenuItem>
                          <MenuItem value='es'>Español</MenuItem>
                          <MenuItem value='fr'>Français</MenuItem>
                          <MenuItem value='de'>Deutsch</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant='h6' gutterBottom>
                      AI Features
                    </Typography>
                    <Box display='flex' flexDirection='column' gap={1}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.preferences.aiInsights}
                            onChange={e =>
                              handlePreferenceChange(
                                'preferences',
                                'aiInsights',
                                e.target.checked
                              )
                            }
                          />
                        }
                        label='AI Insights'
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.preferences.predictiveUI}
                            onChange={e =>
                              handlePreferenceChange(
                                'preferences',
                                'predictiveUI',
                                e.target.checked
                              )
                            }
                          />
                        }
                        label='Predictive UI'
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.preferences.voiceCommands}
                            onChange={e =>
                              handlePreferenceChange(
                                'preferences',
                                'voiceCommands',
                                e.target.checked
                              )
                            }
                          />
                        }
                        label='Voice Commands'
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.preferences.gestureControl}
                            onChange={e =>
                              handlePreferenceChange(
                                'preferences',
                                'gestureControl',
                                e.target.checked
                              )
                            }
                          />
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

        {/* Performance Tab */}
        {activeTab === 2 && (
          <Box sx={{ p: 3 }}>
            <Typography
              variant='h5'
              gutterBottom
              sx={{ mb: 3, ...commonStyles.gradientText }}
            >
              ⚡ Performance Settings
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant='h6' gutterBottom>
                      System Limits
                    </Typography>
                    <Box display='flex' flexDirection='column' gap={3}>
                      <Box>
                        <Typography variant='body2' gutterBottom>
                          Refresh Interval:{' '}
                          {settings.performance.refreshInterval}ms
                        </Typography>
                        <Slider
                          value={settings.performance.refreshInterval}
                          onChange={(e, value) =>
                            handlePreferenceChange(
                              'performance',
                              'refreshInterval',
                              value
                            )
                          }
                          min={1000}
                          max={10000}
                          step={500}
                          marks={[
                            { value: 1000, label: '1s' },
                            { value: 5000, label: '5s' },
                            { value: 10000, label: '10s' },
                          ]}
                        />
                      </Box>

                      <Box>
                        <Typography variant='body2' gutterBottom>
                          Memory Limit: {settings.performance.memoryLimit}%
                        </Typography>
                        <Slider
                          value={settings.performance.memoryLimit}
                          onChange={(e, value) =>
                            handlePreferenceChange(
                              'performance',
                              'memoryLimit',
                              value
                            )
                          }
                          min={50}
                          max={100}
                          step={5}
                        />
                      </Box>

                      <Box>
                        <Typography variant='body2' gutterBottom>
                          CPU Limit: {settings.performance.cpuLimit}%
                        </Typography>
                        <Slider
                          value={settings.performance.cpuLimit}
                          onChange={(e, value) =>
                            handlePreferenceChange(
                              'performance',
                              'cpuLimit',
                              value
                            )
                          }
                          min={50}
                          max={100}
                          step={5}
                        />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant='h6' gutterBottom>
                      Optimization
                    </Typography>
                    <Box display='flex' flexDirection='column' gap={1}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.performance.networkOptimization}
                            onChange={e =>
                              handlePreferenceChange(
                                'performance',
                                'networkOptimization',
                                e.target.checked
                              )
                            }
                          />
                        }
                        label='Network Optimization'
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.preferences.autoRefresh}
                            onChange={e =>
                              handlePreferenceChange(
                                'preferences',
                                'autoRefresh',
                                e.target.checked
                              )
                            }
                          />
                        }
                        label='Auto Refresh'
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.preferences.smartDefaults}
                            onChange={e =>
                              handlePreferenceChange(
                                'preferences',
                                'smartDefaults',
                                e.target.checked
                              )
                            }
                          />
                        }
                        label='Smart Defaults'
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Security Tab */}
        {activeTab === 3 && (
          <Box sx={{ p: 3 }}>
            <Typography
              variant='h5'
              gutterBottom
              sx={{ mb: 3, ...commonStyles.gradientText }}
            >
              🔒 Security Settings
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant='h6' gutterBottom>
                      Authentication
                    </Typography>
                    <Box display='flex' flexDirection='column' gap={1}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.security.twoFactorAuth}
                            onChange={e =>
                              handlePreferenceChange(
                                'security',
                                'twoFactorAuth',
                                e.target.checked
                              )
                            }
                          />
                        }
                        label='Two-Factor Authentication'
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.security.dataEncryption}
                            onChange={e =>
                              handlePreferenceChange(
                                'security',
                                'dataEncryption',
                                e.target.checked
                              )
                            }
                          />
                        }
                        label='Data Encryption'
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.security.auditLogging}
                            onChange={e =>
                              handlePreferenceChange(
                                'security',
                                'auditLogging',
                                e.target.checked
                              )
                            }
                          />
                        }
                        label='Audit Logging'
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant='h6' gutterBottom>
                      Session Management
                    </Typography>
                    <Box display='flex' flexDirection='column' gap={2}>
                      <TextField
                        label='Session Timeout (minutes)'
                        type='number'
                        value={settings.security.sessionTimeout}
                        onChange={e =>
                          handlePreferenceChange(
                            'security',
                            'sessionTimeout',
                            parseInt(e.target.value)
                          )
                        }
                        fullWidth
                      />
                      <TextField
                        label='API Rate Limit (requests/min)'
                        type='number'
                        value={settings.security.apiRateLimit}
                        onChange={e =>
                          handlePreferenceChange(
                            'security',
                            'apiRateLimit',
                            parseInt(e.target.value)
                          )
                        }
                        fullWidth
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Notifications Tab */}
        {activeTab === 4 && (
          <Box sx={{ p: 3 }}>
            <Typography
              variant='h5'
              gutterBottom
              sx={{ mb: 3, ...commonStyles.gradientText }}
            >
              🔔 Notification Settings
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant='h6' gutterBottom>
                      System Notifications
                    </Typography>
                    <Box display='flex' flexDirection='column' gap={1}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.notifications.systemAlerts}
                            onChange={e =>
                              handlePreferenceChange(
                                'notifications',
                                'systemAlerts',
                                e.target.checked
                              )
                            }
                          />
                        }
                        label='System Alerts'
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.notifications.agentUpdates}
                            onChange={e =>
                              handlePreferenceChange(
                                'notifications',
                                'agentUpdates',
                                e.target.checked
                              )
                            }
                          />
                        }
                        label='Agent Updates'
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.notifications.performanceWarnings}
                            onChange={e =>
                              handlePreferenceChange(
                                'notifications',
                                'performanceWarnings',
                                e.target.checked
                              )
                            }
                          />
                        }
                        label='Performance Warnings'
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.notifications.securityAlerts}
                            onChange={e =>
                              handlePreferenceChange(
                                'notifications',
                                'securityAlerts',
                                e.target.checked
                              )
                            }
                          />
                        }
                        label='Security Alerts'
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant='h6' gutterBottom>
                      Delivery Methods
                    </Typography>
                    <Box display='flex' flexDirection='column' gap={1}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.notifications.pushNotifications}
                            onChange={e =>
                              handlePreferenceChange(
                                'notifications',
                                'pushNotifications',
                                e.target.checked
                              )
                            }
                          />
                        }
                        label='Push Notifications'
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.notifications.emailNotifications}
                            onChange={e =>
                              handlePreferenceChange(
                                'notifications',
                                'emailNotifications',
                                e.target.checked
                              )
                            }
                          />
                        }
                        label='Email Notifications'
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.notifications.soundEnabled}
                            onChange={e =>
                              handlePreferenceChange(
                                'notifications',
                                'soundEnabled',
                                e.target.checked
                              )
                            }
                          />
                        }
                        label='Sound Enabled'
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.notifications.vibrationEnabled}
                            onChange={e =>
                              handlePreferenceChange(
                                'notifications',
                                'vibrationEnabled',
                                e.target.checked
                              )
                            }
                          />
                        }
                        label='Vibration Enabled'
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>

      {/* Save Actions */}
      <Box mt={4} display='flex' justifyContent='center' gap={2}>
        <Button
          variant='contained'
          size='large'
          onClick={saveSettings}
          disabled={saving}
          startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
          sx={{ minWidth: 200 }}
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
        <Button
          variant='outlined'
          size='large'
          onClick={resetToDefaults}
          startIcon={<RestoreIcon />}
          sx={{ minWidth: 200 }}
        >
          Reset to Defaults
        </Button>
      </Box>

      <Box mt={4} textAlign='center'>
        <Typography variant='body2' color='text.secondary'>
          AI-Powered Settings • User: {userProfile?.role || 'Unknown'} • Last
          Updated: {new Date().toLocaleString()}
        </Typography>
      </Box>
    </Container>
  );
};

export default AIPoweredSettingsPage;
