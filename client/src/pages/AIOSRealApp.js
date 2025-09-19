/**
 * AIOS Real Application - Smart Agent Integration
 * Real application with AI agent capabilities
 */

import {
  Analytics,
  AutoFixHigh,
  BarChart,
  Build,
  Code,
  Extension,
  NetworkCheck,
  Person,
  Psychology,
  Search,
  Security,
  Send,
  SmartToy,
  Speed,
  Storage,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Fade,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Typography,
  Zoom,
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import AIOSSmartAgent from '../services/AIOSSmartAgent';
import UserDataCollectionService from '../services/UserDataCollectionService';

const AIOSRealApp = () => {
  const [agent, setAgent] = useState(null);
  const [dataCollection, setDataCollection] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [agentStatus, setAgentStatus] = useState('initializing');
  const [availableTools, setAvailableTools] = useState([]);
  const [availablePlugins, setAvailablePlugins] = useState([]);
  const [userData, setUserData] = useState(null);
  const [systemMetrics, setSystemMetrics] = useState(null);
  const [showTools, setShowTools] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    initializeAgent();
    initializeDataCollection();
    loadUserData();
    startSystemMonitoring();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeAgent = async () => {
    try {
      setAgentStatus('initializing');
      const smartAgent = new AIOSSmartAgent();
      await smartAgent.initialize();
      setAgent(smartAgent);
      setAvailableTools(smartAgent.getAvailableTools());
      setAvailablePlugins(smartAgent.getAvailablePlugins());
      setAgentStatus('ready');

      // Add welcome message
      addMessage({
        type: 'agent',
        text: '🤖 AIOS Smart Agent initialized! I have access to your data, system monitoring, and powerful tools. How can I assist you today?',
        timestamp: new Date().toISOString(),
        tools: [],
      });
    } catch (error) {
      console.error('Failed to initialize agent:', error);
      setAgentStatus('error');
      addMessage({
        type: 'error',
        text: 'Failed to initialize AI agent. Please check your configuration.',
        timestamp: new Date().toISOString(),
      });
    }
  };

  const initializeDataCollection = () => {
    const dataService = new UserDataCollectionService();
    setDataCollection(dataService);
  };

  const loadUserData = async () => {
    // Load user data from localStorage or Firebase
    const savedUserData = localStorage.getItem('aios_user_data');
    if (savedUserData) {
      setUserData(JSON.parse(savedUserData));
    }
  };

  const startSystemMonitoring = () => {
    const updateMetrics = () => {
      setSystemMetrics({
        memory: process.memoryUsage ? process.memoryUsage() : null,
        uptime: Date.now(),
        timestamp: new Date().toISOString(),
      });
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 5000);
    return () => clearInterval(interval);
  };

  const addMessage = message => {
    setMessages(prev => [...prev, message]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !agent) return;

    const userMessage = {
      type: 'user',
      text: inputValue,
      timestamp: new Date().toISOString(),
    };

    addMessage(userMessage);
    setInputValue('');
    setLoading(true);

    try {
      // Track user behavior
      if (dataCollection && userData) {
        await dataCollection.trackUserBehavior(userData.uid, 'chat_message', {
          message: inputValue,
          timestamp: new Date().toISOString(),
        });
      }

      // Process query with agent
      const response = await agent.processQuery(inputValue, userData?.uid);

      addMessage({
        type: 'agent',
        text: response.text,
        timestamp: new Date().toISOString(),
        tools: response.tools || [],
        context: response.context,
      });
    } catch (error) {
      console.error('Error processing message:', error);
      addMessage({
        type: 'error',
        text: 'Sorry, I encountered an error processing your request.',
        timestamp: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getToolIcon = toolName => {
    const iconMap = {
      user_data_access: <Person />,
      firestore_search: <Search />,
      system_monitoring: <Speed />,
      web_search: <Search />,
      code_analysis: <Code />,
      data_visualization: <BarChart />,
      file_operations: <Storage />,
      api_integration: <NetworkCheck />,
    };
    return iconMap[toolName] || <Build />;
  };

  const getPluginIcon = pluginName => {
    const iconMap = {
      learning_plugin: <Psychology />,
      analytics_plugin: <Analytics />,
      automation_plugin: <AutoFixHigh />,
      security_plugin: <Security />,
    };
    return iconMap[pluginName] || <Extension />;
  };

  return (
    <Container maxWidth='xl' sx={{ py: 4 }}>
      {/* Header */}
      <Fade in timeout={1000}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant='h3' sx={{ fontWeight: 'bold', mb: 2 }}>
            🤖 AIOS Smart Agent
          </Typography>
          <Typography variant='h6' sx={{ color: 'text.secondary', mb: 3 }}>
            Your Personal AI Assistant with Data Access & Smart Tools
          </Typography>

          {/* Status Indicators */}
          <Stack
            direction='row'
            spacing={2}
            justifyContent='center'
            sx={{ mb: 3 }}
          >
            <Chip
              icon={<SmartToy />}
              label={`Agent: ${agentStatus}`}
              color={
                agentStatus === 'ready'
                  ? 'success'
                  : agentStatus === 'error'
                  ? 'error'
                  : 'warning'
              }
              variant='outlined'
            />
            <Chip
              icon={<Build />}
              label={`${availableTools.length} Tools`}
              color='primary'
              variant='outlined'
            />
            <Chip
              icon={<Extension />}
              label={`${availablePlugins.length} Plugins`}
              color='secondary'
              variant='outlined'
            />
          </Stack>
        </Box>
      </Fade>

      <Grid container spacing={3}>
        {/* Main Chat Interface */}
        <Grid item xs={12} md={8}>
          <Fade in timeout={1200}>
            <Paper
              elevation={8}
              sx={{
                height: '70vh',
                display: 'flex',
                flexDirection: 'column',
                background:
                  'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 3,
                overflow: 'hidden',
              }}
            >
              {/* Messages */}
              <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                {messages.map((message, index) => (
                  <Zoom in timeout={300} key={index}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent:
                          message.type === 'user' ? 'flex-end' : 'flex-start',
                        mb: 2,
                      }}
                    >
                      <Paper
                        elevation={3}
                        sx={{
                          p: 2,
                          maxWidth: '70%',
                          background:
                            message.type === 'user'
                              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                              : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                          color: 'white',
                          borderRadius: 2,
                        }}
                      >
                        <Typography variant='body1' sx={{ mb: 1 }}>
                          {message.text}
                        </Typography>

                        {/* Tools used */}
                        {message.tools && message.tools.length > 0 && (
                          <Box sx={{ mt: 1 }}>
                            <Typography variant='caption' sx={{ opacity: 0.8 }}>
                              Tools used:
                            </Typography>
                            <Stack
                              direction='row'
                              spacing={0.5}
                              sx={{ mt: 0.5 }}
                            >
                              {message.tools.map((tool, i) => (
                                <Chip
                                  key={i}
                                  icon={getToolIcon(tool)}
                                  label={tool.replace('_', ' ')}
                                  size='small'
                                  sx={{
                                    background: 'rgba(255,255,255,0.2)',
                                    color: 'white',
                                    fontSize: '0.7rem',
                                  }}
                                />
                              ))}
                            </Stack>
                          </Box>
                        )}

                        <Typography
                          variant='caption'
                          sx={{ opacity: 0.7, display: 'block', mt: 1 }}
                        >
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </Typography>
                      </Paper>
                    </Box>
                  </Zoom>
                ))}

                {loading && (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-start',
                      mb: 2,
                    }}
                  >
                    <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
                      <Stack direction='row' spacing={1} alignItems='center'>
                        <CircularProgress size={20} />
                        <Typography variant='body2'>
                          AI Agent is thinking...
                        </Typography>
                      </Stack>
                    </Paper>
                  </Box>
                )}

                <div ref={messagesEndRef} />
              </Box>

              {/* Input */}
              <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <Stack direction='row' spacing={1}>
                  <TextField
                    fullWidth
                    multiline
                    maxRows={3}
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder='Ask me anything... I have access to your data, system monitoring, and powerful tools!'
                    disabled={loading}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        background: 'rgba(255,255,255,0.1)',
                        '& fieldset': {
                          borderColor: 'rgba(255,255,255,0.2)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255,255,255,0.3)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'rgba(255,255,255,0.5)',
                        },
                      },
                    }}
                  />
                  <Button
                    variant='contained'
                    onClick={handleSendMessage}
                    disabled={loading || !inputValue.trim()}
                    sx={{
                      borderRadius: 2,
                      background:
                        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      '&:hover': {
                        background:
                          'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                      },
                    }}
                  >
                    <Send />
                  </Button>
                </Stack>
              </Box>
            </Paper>
          </Fade>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            {/* Tools Panel */}
            <Fade in timeout={1400}>
              <Paper
                elevation={6}
                sx={{
                  p: 3,
                  background:
                    'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 3,
                }}
              >
                <Typography variant='h6' sx={{ mb: 2, fontWeight: 'bold' }}>
                  🔧 Available Tools
                </Typography>
                <List dense>
                  {availableTools.map((tool, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon>{getToolIcon(tool)}</ListItemIcon>
                      <ListItemText
                        primary={tool
                          .replace('_', ' ')
                          .replace(/\b\w/g, l => l.toUpperCase())}
                        secondary='Ready to use'
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Fade>

            {/* Plugins Panel */}
            <Fade in timeout={1600}>
              <Paper
                elevation={6}
                sx={{
                  p: 3,
                  background:
                    'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 3,
                }}
              >
                <Typography variant='h6' sx={{ mb: 2, fontWeight: 'bold' }}>
                  🔌 Smart Plugins
                </Typography>
                <List dense>
                  {availablePlugins.map((plugin, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon>{getPluginIcon(plugin)}</ListItemIcon>
                      <ListItemText
                        primary={plugin
                          .replace('_', ' ')
                          .replace(/\b\w/g, l => l.toUpperCase())}
                        secondary='Active'
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Fade>

            {/* System Metrics */}
            <Fade in timeout={1800}>
              <Paper
                elevation={6}
                sx={{
                  p: 3,
                  background:
                    'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 3,
                }}
              >
                <Typography variant='h6' sx={{ mb: 2, fontWeight: 'bold' }}>
                  📊 System Metrics
                </Typography>
                {systemMetrics && (
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant='body2' color='text.secondary'>
                        Memory Usage
                      </Typography>
                      <LinearProgress
                        variant='determinate'
                        value={
                          systemMetrics.memory
                            ? (systemMetrics.memory.heapUsed /
                                systemMetrics.memory.heapTotal) *
                              100
                            : 0
                        }
                        sx={{ mt: 1 }}
                      />
                    </Box>
                    <Box>
                      <Typography variant='body2' color='text.secondary'>
                        Agent Status
                      </Typography>
                      <Chip
                        label={agentStatus}
                        color={agentStatus === 'ready' ? 'success' : 'warning'}
                        size='small'
                        sx={{ mt: 1 }}
                      />
                    </Box>
                  </Stack>
                )}
              </Paper>
            </Fade>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AIOSRealApp;
