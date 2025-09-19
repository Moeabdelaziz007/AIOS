import {
  Psychology as AIIcon,
  Add as AddIcon,
  Alarm as AlarmIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  FitnessCenter as FitnessCenterIcon,
  Group as GroupIcon,
  MusicNote as MusicNoteIcon,
  Nature as NatureIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Radio as RadioIcon,
  Search as SearchIcon,
  Settings as SettingsIcon,
  Sync as SyncIcon,
  VolumeUp as VolumeUpIcon,
  Work as WorkIcon
} from '@mui/icons-material';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
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
  Switch,
  TextField,
  Tooltip,
  Typography,
  Zoom,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useFirebase } from '../services/FirebaseService';
import { animations, commonStyles } from '../theme/aiosTheme';

const SmartAlarmApp = () => {
  const { userProfile } = useAuth();
  const { db, auth } = useFirebase();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [alarms, setAlarms] = useState([]);
  const [filteredAlarms, setFilteredAlarms] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('time');
  const [alarmDialogOpen, setAlarmDialogOpen] = useState(false);
  const [selectedAlarm, setSelectedAlarm] = useState(null);
  const [alarmName, setAlarmName] = useState('');
  const [alarmTime, setAlarmTime] = useState('');
  const [alarmDays, setAlarmDays] = useState([]);
  const [alarmSound, setAlarmSound] = useState('default');
  const [alarmVolume, setAlarmVolume] = useState(80);
  const [alarmSnooze, setAlarmSnooze] = useState(5);
  const [alarmIsActive, setAlarmIsActive] = useState(true);
  const [alarmIsSmart, setAlarmIsSmart] = useState(false);
  const [alarmWeather, setAlarmWeather] = useState(false);
  const [alarmTraffic, setAlarmTraffic] = useState(false);
  const [alarmCalendar, setAlarmCalendar] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [voiceRecording, setVoiceRecording] = useState(false);
  const [aiProcessing, setAiProcessing] = useState(false);
  const [syncStatus, setSyncStatus] = useState('synced');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeAlarms, setActiveAlarms] = useState([]);

  // Days of the week
  const daysOfWeek = [
    { id: 'monday', name: 'Monday', short: 'Mon' },
    { id: 'tuesday', name: 'Tuesday', short: 'Tue' },
    { id: 'wednesday', name: 'Wednesday', short: 'Wed' },
    { id: 'thursday', name: 'Thursday', short: 'Thu' },
    { id: 'friday', name: 'Friday', short: 'Fri' },
    { id: 'saturday', name: 'Saturday', short: 'Sat' },
    { id: 'sunday', name: 'Sunday', short: 'Sun' }
  ];

  // Alarm categories
  const categories = [
    { id: 'all', name: 'All Alarms', icon: <AlarmIcon />, color: '#667eea' },
    { id: 'work', name: 'Work', icon: <WorkIcon />, color: '#43e97b' },
    {
      id: 'personal',
      name: 'Personal',
      icon: <PersonIcon />,
      color: '#fa709a'
    },
    {
      id: 'exercise',
      name: 'Exercise',
      icon: <FitnessCenterIcon />,
      color: '#f093fb'
    },
    { id: 'meetings', name: 'Meetings', icon: <GroupIcon />, color: '#4facfe' },
    {
      id: 'reminders',
      name: 'Reminders',
      icon: <NotificationsIcon />,
      color: '#a8edea'
    }
  ];

  // Alarm sounds
  const alarmSounds = [
    { id: 'default', name: 'Default', icon: <AlarmIcon /> },
    { id: 'gentle', name: 'Gentle Wake', icon: <MusicNoteIcon /> },
    { id: 'nature', name: 'Nature Sounds', icon: <NatureIcon /> },
    { id: 'classical', name: 'Classical', icon: <RadioIcon /> },
    { id: 'upbeat', name: 'Upbeat', icon: <VolumeUpIcon /> }
  ];

  // Initialize alarms from Firebase
  const initializeAlarms = useCallback(async () => {
    if (!db || !auth?.currentUser) return;

    try {
      setLoading(true);
      const alarmsRef = db.collection('alarms').where('userId', '==', auth.currentUser.uid);
      const snapshot = await alarmsRef.get();

      const alarmsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      }));

      setAlarms(alarmsData);
      setFilteredAlarms(alarmsData);
    } catch (error) {
      console.error('Error loading alarms:', error);
    } finally {
      setLoading(false);
    }
  }, [db, auth]);

  // Save alarm to Firebase
  const saveAlarm = useCallback(
    async alarmData => {
      if (!db || !auth?.currentUser) return;

      try {
        setSyncStatus('syncing');
        const now = new Date();

        if (selectedAlarm) {
          // Update existing alarm
          await db
            .collection('alarms')
            .doc(selectedAlarm.id)
            .update({
              ...alarmData,
              updatedAt: now
            });
        } else {
          // Create new alarm
          await db.collection('alarms').add({
            ...alarmData,
            userId: auth.currentUser.uid,
            createdAt: now,
            updatedAt: now
          });
        }

        await initializeAlarms();
        setSyncStatus('synced');
      } catch (error) {
        console.error('Error saving alarm:', error);
        setSyncStatus('error');
      }
    },
    [db, auth, selectedAlarm, initializeAlarms]
  );

  // Delete alarm from Firebase
  const deleteAlarm = useCallback(
    async alarmId => {
      if (!db) return;

      try {
        setSyncStatus('syncing');
        await db.collection('alarms').doc(alarmId).delete();
        await initializeAlarms();
        setSyncStatus('synced');
      } catch (error) {
        console.error('Error deleting alarm:', error);
        setSyncStatus('error');
      }
    },
    [db, initializeAlarms]
  );

  // AI-powered alarm suggestions
  const generateAISuggestions = useCallback(async alarmData => {
    try {
      setAiProcessing(true);

      // Simulate AI processing (replace with actual AI service)
      const suggestions = [
        {
          type: 'optimization',
          content: 'Consider setting alarm 15 minutes earlier for better sleep cycle',
          confidence: 87
        },
        {
          type: 'weather',
          content: 'Weather forecast shows rain tomorrow - consider indoor activities',
          confidence: 92
        },
        {
          type: 'traffic',
          content: 'Traffic patterns suggest leaving 10 minutes earlier',
          confidence: 78
        },
        {
          type: 'calendar',
          content: 'You have a meeting at 9 AM - consider setting a reminder alarm',
          confidence: 95
        }
      ];

      setAiSuggestions(suggestions);
    } catch (error) {
      console.error('Error generating AI suggestions:', error);
    } finally {
      setAiProcessing(false);
    }
  }, []);

  // Check for active alarms
  const checkActiveAlarms = useCallback(() => {
    const now = new Date();
    const currentTimeStr = now.toTimeString().slice(0, 5);
    const currentDay = daysOfWeek[now.getDay() === 0 ? 6 : now.getDay() - 1].id;

    const active = alarms.filter(alarm => {
      if (!alarm.isActive) return false;
      if (alarm.time !== currentTimeStr) return false;
      if (!alarm.days.includes(currentDay)) return false;
      return true;
    });

    setActiveAlarms(active);
  }, [alarms]);

  // Filter and search alarms
  const filterAlarms = useCallback(() => {
    let filtered = alarms;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(alarm => alarm.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(alarm => alarm.name.toLowerCase().includes(query) || alarm.time.includes(query));
    }

    // Sort alarms
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'time':
          return a.time.localeCompare(b.time);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'created':
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

    setFilteredAlarms(filtered);
  }, [alarms, selectedCategory, searchQuery, sortBy]);

  // Handle alarm operations
  const handleCreateAlarm = () => {
    setSelectedAlarm(null);
    setAlarmName('');
    setAlarmTime('');
    setAlarmDays([]);
    setAlarmSound('default');
    setAlarmVolume(80);
    setAlarmSnooze(5);
    setAlarmIsActive(true);
    setAlarmIsSmart(false);
    setAlarmWeather(false);
    setAlarmTraffic(false);
    setAlarmCalendar(false);
    setAlarmDialogOpen(true);
  };

  const handleEditAlarm = alarm => {
    setSelectedAlarm(alarm);
    setAlarmName(alarm.name);
    setAlarmTime(alarm.time);
    setAlarmDays(alarm.days || []);
    setAlarmSound(alarm.sound || 'default');
    setAlarmVolume(alarm.volume || 80);
    setAlarmSnooze(alarm.snooze || 5);
    setAlarmIsActive(alarm.isActive);
    setAlarmIsSmart(alarm.isSmart || false);
    setAlarmWeather(alarm.weather || false);
    setAlarmTraffic(alarm.traffic || false);
    setAlarmCalendar(alarm.calendar || false);
    setAlarmDialogOpen(true);
  };

  const handleSaveAlarm = async () => {
    const alarmData = {
      name: alarmName,
      time: alarmTime,
      days: alarmDays,
      sound: alarmSound,
      volume: alarmVolume,
      snooze: alarmSnooze,
      isActive: alarmIsActive,
      isSmart: alarmIsSmart,
      weather: alarmWeather,
      traffic: alarmTraffic,
      calendar: alarmCalendar,
      category: selectedCategory !== 'all' ? selectedCategory : 'personal'
    };

    await saveAlarm(alarmData);
    setAlarmDialogOpen(false);
  };

  const handleDeleteAlarm = async alarmId => {
    if (window.confirm('Are you sure you want to delete this alarm?')) {
      await deleteAlarm(alarmId);
    }
  };

  const handleToggleAlarm = async alarm => {
    const updatedAlarm = { ...alarm, isActive: !alarm.isActive };
    await saveAlarm(updatedAlarm);
  };

  // Initialize app
  useEffect(() => {
    initializeAlarms();
  }, [initializeAlarms]);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Check for active alarms every minute
  useEffect(() => {
    const timer = setInterval(checkActiveAlarms, 60000);
    checkActiveAlarms(); // Check immediately

    return () => clearInterval(timer);
  }, [checkActiveAlarms]);

  // Filter alarms when dependencies change
  useEffect(() => {
    filterAlarms();
  }, [filterAlarms]);

  // Generate AI suggestions when alarm data changes
  useEffect(() => {
    if (alarmName && alarmTime) {
      generateAISuggestions({ name: alarmName, time: alarmTime });
    }
  }, [alarmName, alarmTime, generateAISuggestions]);

  if (loading) {
    return (
      <Container maxWidth='lg' sx={{ ...commonStyles.centerContent, flexDirection: 'column' }}>
        <CircularProgress size={80} thickness={4} />
        <Typography variant='h5' sx={{ mt: 3, ...commonStyles.gradientText }}>
          Loading Smart Alarms...
        </Typography>
        <Typography variant='body1' color='text.secondary' sx={{ mt: 1 }}>
          Syncing with AI-powered features
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
              <AlarmIcon sx={{ fontSize: '2.5rem' }} />
              Smart Alarms
            </Typography>
            <Typography variant='h6' sx={{ opacity: 0.9, mb: 3 }}>
              AI-powered alarm system with intelligent scheduling and weather integration
            </Typography>
            <Box display='flex' gap={1} flexWrap='wrap'>
              <Chip
                icon={<AlarmIcon />}
                label={`${alarms.length} Alarms`}
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
              <Chip icon={<AIIcon />} label='AI-Powered' sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
              <Chip icon={<SyncIcon />} label={syncStatus} sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
            </Box>
          </Box>
          <Box display='flex' gap={1}>
            <Tooltip title='Sync Alarms'>
              <IconButton
                onClick={initializeAlarms}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                }}
              >
                <SyncIcon />
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
        </Box>
      </Paper>

      {/* Current Time Display */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 3, textAlign: 'center' }}>
        <Typography variant='h4' sx={{ ...commonStyles.gradientText, mb: 1 }}>
          {currentTime.toLocaleTimeString()}
        </Typography>
        <Typography variant='h6' color='text.secondary'>
          {currentTime.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </Typography>
        {activeAlarms.length > 0 && (
          <Alert severity='warning' sx={{ mt: 2 }}>
            <Typography variant='body2'>{activeAlarms.length} alarm(s) are currently active!</Typography>
          </Alert>
        )}
      </Paper>

      {/* Search and Filter Bar */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
        <Grid container spacing={2} alignItems='center'>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder='Search alarms...'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
                {categories.map(category => (
                  <MenuItem key={category.id} value={category.id}>
                    <Box display='flex' alignItems='center' gap={1}>
                      {category.icon}
                      {category.name}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <MenuItem value='time'>Time</MenuItem>
                <MenuItem value='name'>Name</MenuItem>
                <MenuItem value='created'>Created</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Alarms List */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ borderRadius: 3 }}>
            <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
              <Box display='flex' justifyContent='space-between' alignItems='center'>
                <Typography variant='h6' sx={{ ...commonStyles.gradientText }}>
                  ⏰ Your Alarms ({filteredAlarms.length})
                </Typography>
                <Button
                  variant='contained'
                  startIcon={<AddIcon />}
                  onClick={handleCreateAlarm}
                  sx={{ borderRadius: 2 }}
                >
                  New Alarm
                </Button>
              </Box>
            </Box>

            <Box sx={{ p: 2 }}>
              {filteredAlarms.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <AlarmIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant='h6' color='text.secondary'>
                    No alarms found
                  </Typography>
                  <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
                    Create your first AI-powered alarm
                  </Typography>
                  <Button variant='contained' startIcon={<AddIcon />} onClick={handleCreateAlarm}>
                    Create Alarm
                  </Button>
                </Box>
              ) : (
                <Grid container spacing={2}>
                  {filteredAlarms.map((alarm, index) => (
                    <Grid item xs={12} sm={6} lg={4} key={alarm.id}>
                      <Zoom in timeout={300 + index * 100}>
                        <Card
                          sx={{
                            height: '100%',
                            ...commonStyles.cardHover,
                            cursor: 'pointer'
                          }}
                          onClick={() => handleEditAlarm(alarm)}
                        >
                          <CardContent>
                            <Box display='flex' justifyContent='space-between' alignItems='start' mb={2}>
                              <Typography variant='h6' sx={{ fontWeight: 600, flexGrow: 1 }}>
                                {alarm.name}
                              </Typography>
                              <Box display='flex' gap={1}>
                                <Switch
                                  checked={alarm.isActive}
                                  onChange={e => {
                                    e.stopPropagation();
                                    handleToggleAlarm(alarm);
                                  }}
                                  size='small'
                                />
                                {alarm.isSmart && <AIIcon fontSize='small' color='primary' />}
                              </Box>
                            </Box>

                            <Typography
                              variant='h4'
                              sx={{
                                fontWeight: 700,
                                color: 'primary.main',
                                mb: 2,
                                textAlign: 'center'
                              }}
                            >
                              {alarm.time}
                            </Typography>

                            <Box display='flex' gap={1} flexWrap='wrap' mb={2}>
                              {alarm.days?.map((day, dayIndex) => (
                                <Chip
                                  key={dayIndex}
                                  label={daysOfWeek.find(d => d.id === day)?.short}
                                  size='small'
                                  variant='outlined'
                                />
                              ))}
                            </Box>

                            <Box display='flex' justifyContent='space-between' alignItems='center'>
                              <Typography variant='caption' color='text.secondary'>
                                {alarm.sound}
                              </Typography>
                              <Box display='flex' gap={1}>
                                <IconButton
                                  size='small'
                                  onClick={e => {
                                    e.stopPropagation();
                                    handleEditAlarm(alarm);
                                  }}
                                >
                                  <EditIcon fontSize='small' />
                                </IconButton>
                                <IconButton
                                  size='small'
                                  onClick={e => {
                                    e.stopPropagation();
                                    handleDeleteAlarm(alarm.id);
                                  }}
                                >
                                  <DeleteIcon fontSize='small' />
                                </IconButton>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      </Zoom>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* AI Suggestions Sidebar */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ borderRadius: 3, mb: 3 }}>
            <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant='h6' sx={{ ...commonStyles.gradientText }}>
                🤖 AI Suggestions
              </Typography>
            </Box>
            <Box sx={{ p: 2 }}>
              {aiProcessing ? (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <CircularProgress size={24} />
                  <Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
                    AI is analyzing...
                  </Typography>
                </Box>
              ) : aiSuggestions.length > 0 ? (
                <List>
                  {aiSuggestions.map((suggestion, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Avatar
                          sx={{
                            bgcolor: 'primary.main',
                            width: 32,
                            height: 32
                          }}
                        >
                          <AIIcon fontSize='small' />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText primary={suggestion.content} secondary={`${suggestion.confidence}% confidence`} />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <AIIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                  <Typography variant='body2' color='text.secondary'>
                    Create an alarm to get AI suggestions
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>

          {/* Quick Actions */}
          <Paper elevation={2} sx={{ borderRadius: 3 }}>
            <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant='h6' sx={{ ...commonStyles.gradientText }}>
                ⚡ Quick Actions
              </Typography>
            </Box>
            <Box sx={{ p: 2 }}>
              <List>
                <ListItem button onClick={handleCreateAlarm}>
                  <ListItemIcon>
                    <AddIcon color='primary' />
                  </ListItemIcon>
                  <ListItemText primary='New Alarm' />
                </ListItem>
                <ListItem button onClick={initializeAlarms}>
                  <ListItemIcon>
                    <SyncIcon color='primary' />
                  </ListItemIcon>
                  <ListItemText primary='Sync Alarms' />
                </ListItem>
                <ListItem button>
                  <ListItemIcon>
                    <SettingsIcon color='primary' />
                  </ListItemIcon>
                  <ListItemText primary='Alarm Settings' />
                </ListItem>
              </List>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Alarm Dialog */}
      <Dialog
        open={alarmDialogOpen}
        onClose={() => setAlarmDialogOpen(false)}
        maxWidth='md'
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          <Box display='flex' justifyContent='space-between' alignItems='center'>
            <Typography variant='h6'>{selectedAlarm ? 'Edit Alarm' : 'Create New Alarm'}</Typography>
            <IconButton onClick={() => setAlarmDialogOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label='Alarm Name'
              value={alarmName}
              onChange={e => setAlarmName(e.target.value)}
              sx={{ mb: 3 }}
            />

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label='Time'
                  type='time'
                  value={alarmTime}
                  onChange={e => setAlarmTime(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Sound</InputLabel>
                  <Select value={alarmSound} onChange={e => setAlarmSound(e.target.value)}>
                    {alarmSounds.map(sound => (
                      <MenuItem key={sound.id} value={sound.id}>
                        <Box display='flex' alignItems='center' gap={1}>
                          {sound.icon}
                          {sound.name}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Typography variant='h6' gutterBottom>
              Repeat Days
            </Typography>
            <FormGroup row>
              {daysOfWeek.map(day => (
                <FormControlLabel
                  key={day.id}
                  control={
                    <Checkbox
                      checked={alarmDays.includes(day.id)}
                      onChange={e => {
                        if (e.target.checked) {
                          setAlarmDays([...alarmDays, day.id]);
                        } else {
                          setAlarmDays(alarmDays.filter(d => d !== day.id));
                        }
                      }}
                    />
                  }
                  label={day.short}
                />
              ))}
            </FormGroup>

            <Box sx={{ mt: 3 }}>
              <Typography variant='h6' gutterBottom>
                Smart Features
              </Typography>
              <FormControlLabel
                control={<Switch checked={alarmIsSmart} onChange={e => setAlarmIsSmart(e.target.checked)} />}
                label='Enable AI Smart Features'
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={alarmWeather}
                    onChange={e => setAlarmWeather(e.target.checked)}
                    disabled={!alarmIsSmart}
                  />
                }
                label='Weather Integration'
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={alarmTraffic}
                    onChange={e => setAlarmTraffic(e.target.checked)}
                    disabled={!alarmIsSmart}
                  />
                }
                label='Traffic Integration'
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={alarmCalendar}
                    onChange={e => setAlarmCalendar(e.target.checked)}
                    disabled={!alarmIsSmart}
                  />
                }
                label='Calendar Integration'
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAlarmDialogOpen(false)}>Cancel</Button>
          <Button variant='contained' onClick={handleSaveAlarm} disabled={!alarmName.trim() || !alarmTime}>
            {selectedAlarm ? 'Update' : 'Create'} Alarm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SmartAlarmApp;
