import {
  Psychology as AIIcon,
  SmartToy as AgentIcon,
  CheckCircle as CheckCircleIcon,
  Hearing as HearingIcon,
  Insights as InsightsIcon,
  AutoAwesome as MagicIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  PlayArrow as PlayIcon,
  Settings as SettingsIcon,
  Timeline as TimelineIcon,
  VolumeOff as VolumeOffIcon,
  VolumeUp as VolumeUpIcon,
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
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Slider,
  Tab,
  Tabs,
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
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  animations,
  appCategoryColors,
  commonStyles,
} from '../theme/aiosTheme';

const VoiceUIComponent = () => {
  const { userProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [voiceCommands, setVoiceCommands] = useState([]);
  const [voiceHistory, setVoiceHistory] = useState([]);
  const [voiceSettings, setVoiceSettings] = useState({
    language: 'en-US',
    rate: 1.0,
    pitch: 1.0,
    volume: 1.0,
    voice: null,
  });
  const [availableVoices, setAvailableVoices] = useState([]);
  const [aiResponse, setAiResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const recognitionRef = useRef(null);
  const synthesisRef = useRef(null);

  // Voice Commands Configuration
  const defaultCommands = [
    {
      id: 'nav-dashboard',
      phrase: 'go to dashboard',
      description: 'Navigate to the main dashboard',
      category: 'navigation',
      icon: <AgentIcon />,
      action: () => (window.location.href = '/dashboard'),
    },
    {
      id: 'nav-apps',
      phrase: 'go to apps',
      description: 'Navigate to the apps page',
      category: 'navigation',
      icon: <AgentIcon />,
      action: () => (window.location.href = '/apps'),
    },
    {
      id: 'nav-settings',
      phrase: 'go to settings',
      description: 'Navigate to the settings page',
      category: 'navigation',
      icon: <SettingsIcon />,
      action: () => (window.location.href = '/settings'),
    },
    {
      id: 'nav-monitoring',
      phrase: 'go to monitoring',
      description: 'Navigate to the monitoring dashboard',
      category: 'navigation',
      icon: <TimelineIcon />,
      action: () => (window.location.href = '/monitoring'),
    },
    {
      id: 'ai-help',
      phrase: 'help',
      description: 'Get help with available voice commands',
      category: 'assistance',
      icon: <AIIcon />,
      action: () =>
        speak(
          'I can help you navigate the AIOS system. Try saying "go to dashboard", "go to apps", or "ask AI" followed by your question.'
        ),
    },
    {
      id: 'ai-query',
      phrase: 'ask AI',
      description: 'Ask a question to the AI system',
      category: 'ai-interaction',
      icon: <MagicIcon />,
      action: transcript => {
        const question = transcript.replace(/ask AI/i, '').trim();
        if (question) {
          processAIQuery(question);
        }
      },
    },
    {
      id: 'voice-start',
      phrase: 'start listening',
      description: 'Start voice recognition',
      category: 'voice-control',
      icon: <MicIcon />,
      action: () => startListening(),
    },
    {
      id: 'voice-stop',
      phrase: 'stop listening',
      description: 'Stop voice recognition',
      category: 'voice-control',
      icon: <MicOffIcon />,
      action: () => stopListening(),
    },
  ];

  // Initialize Voice Features
  const initializeVoice = useCallback(async () => {
    try {
      // Check browser support
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const speechSynthesis = window.speechSynthesis;

      if (!SpeechRecognition || !speechSynthesis) {
        setVoiceSupported(false);
        setLoading(false);
        return;
      }

      setVoiceSupported(true);

      // Initialize Speech Recognition
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = voiceSettings.language;
      recognitionRef.current.maxAlternatives = 1;

      // Set up recognition event handlers
      recognitionRef.current.onstart = () => {
        setIsListening(true);
        console.log('🎤 Voice recognition started');
      };

      recognitionRef.current.onresult = event => {
        const results = Array.from(event.results);
        const transcript = results
          .map(result => result[0].transcript)
          .join('')
          .trim();

        setCurrentTranscript(transcript);

        if (event.results[event.results.length - 1].isFinal) {
          console.log('🎤 Voice recognition result:', transcript);
          processVoiceCommand(transcript);
          addToHistory(transcript, 'user');
        }
      };

      recognitionRef.current.onerror = event => {
        console.error('❌ Voice recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        console.log('🎤 Voice recognition ended');
      };

      // Initialize Speech Synthesis
      synthesisRef.current = speechSynthesis;

      // Load available voices
      const loadVoices = () => {
        const voices = synthesisRef.current.getVoices();
        setAvailableVoices(
          voices.map(voice => ({
            name: voice.name,
            lang: voice.lang,
            gender: voice.gender || 'unknown',
            localService: voice.localService,
            default: voice.default,
          }))
        );
      };

      // Load voices when they become available
      if (synthesisRef.current.getVoices().length > 0) {
        loadVoices();
      } else {
        synthesisRef.current.addEventListener('voiceschanged', loadVoices);
      }

      setVoiceCommands(defaultCommands);
      setLoading(false);
    } catch (error) {
      console.error('❌ Failed to initialize voice features:', error);
      setVoiceSupported(false);
      setLoading(false);
    }
  }, [voiceSettings.language]);

  // Voice Control Functions
  const startListening = useCallback(() => {
    if (!recognitionRef.current || isListening) return;

    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error('❌ Failed to start listening:', error);
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current || !isListening) return;

    try {
      recognitionRef.current.stop();
    } catch (error) {
      console.error('❌ Failed to stop listening:', error);
    }
  }, [isListening]);

  const speak = useCallback(
    async (text, options = {}) => {
      if (!synthesisRef.current) return;

      if (isSpeaking) {
        synthesisRef.current.cancel();
      }

      return new Promise((resolve, reject) => {
        try {
          const utterance = new SpeechSynthesisUtterance(text);

          utterance.rate = options.rate || voiceSettings.rate;
          utterance.pitch = options.pitch || voiceSettings.pitch;
          utterance.volume = options.volume || voiceSettings.volume;
          utterance.lang = options.lang || voiceSettings.language;

          if (options.voice || voiceSettings.voice) {
            utterance.voice = options.voice || voiceSettings.voice;
          }

          utterance.onstart = () => {
            setIsSpeaking(true);
            console.log('🔊 Speech started:', text.substring(0, 50) + '...');
          };

          utterance.onend = () => {
            setIsSpeaking(false);
            console.log('🔊 Speech ended');
            resolve();
          };

          utterance.onerror = event => {
            setIsSpeaking(false);
            console.error('❌ Speech error:', event.error);
            reject(event.error);
          };

          synthesisRef.current.speak(utterance);
        } catch (error) {
          console.error('❌ Failed to speak:', error);
          reject(error);
        }
      });
    },
    [isSpeaking, voiceSettings]
  );

  const stopSpeaking = useCallback(() => {
    if (synthesisRef.current && isSpeaking) {
      synthesisRef.current.cancel();
      setIsSpeaking(false);
      console.log('🔊 Speech stopped');
    }
  }, [isSpeaking]);

  // Process Voice Commands
  const processVoiceCommand = useCallback(
    transcript => {
      const lowerTranscript = transcript.toLowerCase();

      for (const command of voiceCommands) {
        if (lowerTranscript.includes(command.phrase.toLowerCase())) {
          console.log('🎤 Voice command matched:', command.phrase);
          try {
            command.action(transcript);
            addToHistory(transcript, 'command', command.description);
            return true;
          } catch (error) {
            console.error('❌ Voice command error:', error);
          }
        }
      }

      return false;
    },
    [voiceCommands]
  );

  // Process AI Query
  const processAIQuery = useCallback(
    async question => {
      setIsProcessing(true);
      try {
        // Simulate AI processing
        await new Promise(resolve => setTimeout(resolve, 1000));

        const responses = [
          `I understand you're asking about "${question}". Let me help you with that.`,
          `That's an interesting question about "${question}". Here's what I can tell you.`,
          `Regarding "${question}", I can provide some insights based on the current system data.`,
          `I've processed your question about "${question}". Let me give you a comprehensive answer.`,
        ];

        const response =
          responses[Math.floor(Math.random() * responses.length)];
        setAiResponse(response);
        await speak(response);
        addToHistory(question, 'ai-query', response);
      } catch (error) {
        console.error('❌ AI query error:', error);
        const errorResponse =
          'Sorry, I encountered an error processing your request.';
        setAiResponse(errorResponse);
        await speak(errorResponse);
      } finally {
        setIsProcessing(false);
      }
    },
    [speak]
  );

  // Add to Voice History
  const addToHistory = useCallback((text, type, details = '') => {
    const historyItem = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      text,
      type,
      details,
    };

    setVoiceHistory(prev => [historyItem, ...prev.slice(0, 49)]);
  }, []);

  // Update Voice Settings
  const updateVoiceSettings = useCallback(newSettings => {
    setVoiceSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  useEffect(() => {
    initializeVoice();
  }, [initializeVoice]);

  if (loading) {
    return (
      <Container
        maxWidth='lg'
        sx={{ ...commonStyles.centerContent, flexDirection: 'column' }}
      >
        <CircularProgress size={80} thickness={4} />
        <Typography variant='h5' sx={{ mt: 3, ...commonStyles.gradientText }}>
          Initializing Voice UI...
        </Typography>
        <Typography variant='body1' color='text.secondary' sx={{ mt: 1 }}>
          Please wait while we set up voice recognition and synthesis
        </Typography>
      </Container>
    );
  }

  if (!voiceSupported) {
    return (
      <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
        <Alert severity='warning' sx={{ mb: 3 }}>
          Voice features are not supported in your browser. Please use Chrome,
          Edge, or Safari for the best experience.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
      {/* Voice UI Header */}
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
        {/* Voice Animation */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            animation: isListening ? 'pulse 1s ease-in-out infinite' : 'none',
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
              <MicIcon sx={{ fontSize: '2.5rem' }} />
              AI-Powered Voice Interface
            </Typography>
            <Typography variant='h6' sx={{ opacity: 0.9 }}>
              Control your AIOS system with natural voice commands and AI
              interactions
            </Typography>
            <Box mt={2} display='flex' gap={2} flexWrap='wrap'>
              <Chip
                icon={<MicIcon />}
                label={isListening ? 'Listening...' : 'Ready'}
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                color={isListening ? 'success' : 'default'}
              />
              <Chip
                icon={<VolumeUpIcon />}
                label={isSpeaking ? 'Speaking...' : 'Silent'}
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                color={isSpeaking ? 'info' : 'default'}
              />
              <Chip
                label={`${voiceCommands.length} Commands Available`}
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
            </Box>
          </Box>
          <Box display='flex' gap={1}>
            <Tooltip title={isListening ? 'Stop Listening' : 'Start Listening'}>
              <IconButton
                onClick={isListening ? stopListening : startListening}
                sx={{
                  bgcolor: isListening
                    ? 'rgba(76, 175, 80, 0.3)'
                    : 'rgba(255,255,255,0.2)',
                  color: 'white',
                  '&:hover': {
                    bgcolor: isListening
                      ? 'rgba(76, 175, 80, 0.5)'
                      : 'rgba(255,255,255,0.3)',
                  },
                }}
              >
                {isListening ? <MicOffIcon /> : <MicIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip title={isSpeaking ? 'Stop Speaking' : 'Test Voice'}>
              <IconButton
                onClick={
                  isSpeaking
                    ? stopSpeaking
                    : () =>
                        speak(
                          'Voice interface is ready. You can now use voice commands.'
                        )
                }
                sx={{
                  bgcolor: isSpeaking
                    ? 'rgba(33, 150, 243, 0.3)'
                    : 'rgba(255,255,255,0.2)',
                  color: 'white',
                  '&:hover': {
                    bgcolor: isSpeaking
                      ? 'rgba(33, 150, 243, 0.5)'
                      : 'rgba(255,255,255,0.3)',
                  },
                }}
              >
                {isSpeaking ? <VolumeOffIcon /> : <VolumeUpIcon />}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Paper>

      {/* Current Transcript */}
      {currentTranscript && (
        <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
          <Typography
            variant='h6'
            gutterBottom
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <HearingIcon />
            Current Transcript
          </Typography>
          <Typography
            variant='body1'
            sx={{ fontStyle: 'italic', color: 'text.secondary' }}
          >
            "{currentTranscript}"
          </Typography>
        </Paper>
      )}

      {/* AI Response */}
      {aiResponse && (
        <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
          <Typography
            variant='h6'
            gutterBottom
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <AIIcon />
            AI Response
            {isProcessing && <CircularProgress size={20} sx={{ ml: 1 }} />}
          </Typography>
          <Typography variant='body1'>{aiResponse}</Typography>
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
            icon={<MicIcon />}
            label='Voice Commands'
            iconPosition='start'
            sx={{ textTransform: 'none', fontWeight: 600 }}
          />
          <Tab
            icon={<TimelineIcon />}
            label='Voice History'
            iconPosition='start'
            sx={{ textTransform: 'none', fontWeight: 600 }}
          />
          <Tab
            icon={<SettingsIcon />}
            label='Voice Settings'
            iconPosition='start'
            sx={{ textTransform: 'none', fontWeight: 600 }}
          />
          <Tab
            icon={<InsightsIcon />}
            label='Analytics'
            iconPosition='start'
            sx={{ textTransform: 'none', fontWeight: 600 }}
          />
        </Tabs>

        {/* Voice Commands Tab */}
        {activeTab === 0 && (
          <Box sx={{ p: 3 }}>
            <Typography
              variant='h5'
              gutterBottom
              sx={{ mb: 3, ...commonStyles.gradientText }}
            >
              🎤 Available Voice Commands
            </Typography>
            <Grid container spacing={3}>
              {voiceCommands.map((command, index) => (
                <Grid item xs={12} md={6} lg={4} key={command.id}>
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
                            {command.icon}
                          </Avatar>
                          <Box>
                            <Typography variant='h6' sx={{ fontWeight: 600 }}>
                              {command.phrase}
                            </Typography>
                            <Chip
                              label={command.category}
                              size='small'
                              color='primary'
                            />
                          </Box>
                        </Box>

                        <Typography variant='body2' color='text.secondary'>
                          {command.description}
                        </Typography>
                      </CardContent>

                      <CardActions>
                        <Button
                          size='small'
                          onClick={() => speak(`Say "${command.phrase}"`)}
                          startIcon={<VolumeUpIcon />}
                        >
                          Test
                        </Button>
                        <Button
                          size='small'
                          onClick={() => command.action()}
                          startIcon={<PlayIcon />}
                        >
                          Execute
                        </Button>
                      </CardActions>
                    </Card>
                  </Zoom>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Voice History Tab */}
        {activeTab === 1 && (
          <Box sx={{ p: 3 }}>
            <Typography
              variant='h5'
              gutterBottom
              sx={{ mb: 3, ...commonStyles.gradientText }}
            >
              📋 Voice Interaction History
            </Typography>
            <Paper sx={{ maxHeight: 600, overflow: 'auto' }}>
              <Timeline>
                {voiceHistory.map((item, index) => (
                  <TimelineItem key={item.id}>
                    <TimelineOppositeContent color='text.secondary'>
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                      <TimelineDot
                        color={
                          item.type === 'command'
                            ? 'success'
                            : item.type === 'ai-query'
                            ? 'info'
                            : 'primary'
                        }
                      >
                        {item.type === 'command' ? (
                          <CheckCircleIcon />
                        ) : item.type === 'ai-query' ? (
                          <AIIcon />
                        ) : (
                          <MicIcon />
                        )}
                      </TimelineDot>
                      {index < voiceHistory.length - 1 && <TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent>
                      <Card sx={{ mb: 2 }}>
                        <CardContent>
                          <Typography
                            variant='subtitle2'
                            sx={{ fontWeight: 600 }}
                          >
                            {item.type === 'command'
                              ? 'Voice Command'
                              : item.type === 'ai-query'
                              ? 'AI Query'
                              : 'Voice Input'}
                          </Typography>
                          <Typography variant='body2' sx={{ mt: 1 }}>
                            "{item.text}"
                          </Typography>
                          {item.details && (
                            <Typography
                              variant='caption'
                              color='text.secondary'
                              sx={{ mt: 1, display: 'block' }}
                            >
                              {item.details}
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            </Paper>
          </Box>
        )}

        {/* Voice Settings Tab */}
        {activeTab === 2 && (
          <Box sx={{ p: 3 }}>
            <Typography
              variant='h5'
              gutterBottom
              sx={{ mb: 3, ...commonStyles.gradientText }}
            >
              ⚙️ Voice Settings
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant='h6' gutterBottom>
                      Speech Recognition
                    </Typography>
                    <Box display='flex' flexDirection='column' gap={2}>
                      <FormControl fullWidth>
                        <InputLabel>Language</InputLabel>
                        <Select
                          value={voiceSettings.language}
                          onChange={e =>
                            updateVoiceSettings({ language: e.target.value })
                          }
                        >
                          <MenuItem value='en-US'>English (US)</MenuItem>
                          <MenuItem value='en-GB'>English (UK)</MenuItem>
                          <MenuItem value='es-ES'>Spanish</MenuItem>
                          <MenuItem value='fr-FR'>French</MenuItem>
                          <MenuItem value='de-DE'>German</MenuItem>
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
                      Speech Synthesis
                    </Typography>
                    <Box display='flex' flexDirection='column' gap={3}>
                      <Box>
                        <Typography variant='body2' gutterBottom>
                          Speech Rate: {voiceSettings.rate}x
                        </Typography>
                        <Slider
                          value={voiceSettings.rate}
                          onChange={(e, value) =>
                            updateVoiceSettings({ rate: value })
                          }
                          min={0.5}
                          max={2.0}
                          step={0.1}
                          marks={[
                            { value: 0.5, label: '0.5x' },
                            { value: 1.0, label: '1.0x' },
                            { value: 2.0, label: '2.0x' },
                          ]}
                        />
                      </Box>

                      <Box>
                        <Typography variant='body2' gutterBottom>
                          Pitch: {voiceSettings.pitch}
                        </Typography>
                        <Slider
                          value={voiceSettings.pitch}
                          onChange={(e, value) =>
                            updateVoiceSettings({ pitch: value })
                          }
                          min={0.5}
                          max={2.0}
                          step={0.1}
                        />
                      </Box>

                      <Box>
                        <Typography variant='body2' gutterBottom>
                          Volume: {Math.round(voiceSettings.volume * 100)}%
                        </Typography>
                        <Slider
                          value={voiceSettings.volume}
                          onChange={(e, value) =>
                            updateVoiceSettings({ volume: value })
                          }
                          min={0}
                          max={1}
                          step={0.1}
                        />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Analytics Tab */}
        {activeTab === 3 && (
          <Box sx={{ p: 3 }}>
            <Typography
              variant='h5'
              gutterBottom
              sx={{ mb: 3, ...commonStyles.gradientText }}
            >
              📊 Voice Analytics
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant='h6' gutterBottom>
                      Usage Statistics
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemIcon>
                          <MicIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary='Total Voice Commands'
                          secondary={
                            voiceHistory.filter(item => item.type === 'command')
                              .length
                          }
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <AIIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary='AI Queries'
                          secondary={
                            voiceHistory.filter(
                              item => item.type === 'ai-query'
                            ).length
                          }
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <TimelineIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary='Total Interactions'
                          secondary={voiceHistory.length}
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant='h6' gutterBottom>
                      Voice Status
                    </Typography>
                    <Box mt={2}>
                      <Box
                        display='flex'
                        justifyContent='space-between'
                        alignItems='center'
                        mb={1}
                      >
                        <Typography variant='body2'>
                          Recognition Status
                        </Typography>
                        <Chip
                          label={isListening ? 'Active' : 'Inactive'}
                          color={isListening ? 'success' : 'default'}
                          size='small'
                        />
                      </Box>
                      <Box
                        display='flex'
                        justifyContent='space-between'
                        alignItems='center'
                        mb={1}
                      >
                        <Typography variant='body2'>
                          Synthesis Status
                        </Typography>
                        <Chip
                          label={isSpeaking ? 'Speaking' : 'Ready'}
                          color={isSpeaking ? 'info' : 'default'}
                          size='small'
                        />
                      </Box>
                      <Box
                        display='flex'
                        justifyContent='space-between'
                        alignItems='center'
                        mb={1}
                      >
                        <Typography variant='body2'>Language</Typography>
                        <Typography variant='body2' sx={{ fontWeight: 600 }}>
                          {voiceSettings.language}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>

      <Box mt={4} textAlign='center'>
        <Typography variant='body2' color='text.secondary'>
          AI-Powered Voice Interface • User: {userProfile?.role || 'Unknown'} •
          Last Updated: {new Date().toLocaleString()}
        </Typography>
      </Box>
    </Container>
  );
};

export default VoiceUIComponent;
