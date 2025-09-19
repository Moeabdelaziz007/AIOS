import {
  Add,
  Bedtime,
  Favorite,
  FitnessCenter,
  LocalHospital,
  Medication,
  MonitorHeart,
  SmartToy,
  TrendingUp,
  WaterDrop,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';

const SmartHealthMonitorApp = () => {
  const [healthData, setHealthData] = useState([]);
  const [aiInsights, setAiInsights] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [addDataOpen, setAddDataOpen] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [currentTab, setCurrentTab] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [newData, setNewData] = useState({
    type: 'heartRate',
    value: '',
    timestamp: new Date(),
    notes: '',
  });
  const [healthGoals, setHealthGoals] = useState([]);
  const [predictiveAlerts, setPredictiveAlerts] = useState([]);

  // AI-powered health analysis
  const analyzeHealthData = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/smart-health/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          healthData,
          userProfile: getUserProfile(),
          goals: healthGoals,
        }),
      });
      const analysis = await response.json();
      setAiInsights(analysis.insights);
      setAiSuggestions(analysis.suggestions);
    } catch (error) {
      console.error('Health analysis failed:', error);
    }
    setIsAnalyzing(false);
  };

  // Predictive health alerts
  const generatePredictiveAlerts = async () => {
    try {
      const response = await fetch('/api/smart-health/predictive-alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          healthData,
          patterns: analyzeHealthPatterns(),
          riskFactors: getRiskFactors(),
        }),
      });
      const alerts = await response.json();
      setPredictiveAlerts(alerts);
    } catch (error) {
      console.error('Predictive alerts failed:', error);
    }
  };

  // Smart medication reminders
  const generateMedicationReminders = async () => {
    try {
      const response = await fetch('/api/smart-health/medication-reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          medications: getMedications(),
          schedule: getMedicationSchedule(),
          context: getCurrentContext(),
        }),
      });
      const reminders = await response.json();
      setAiSuggestions(reminders);
    } catch (error) {
      console.error('Medication reminders failed:', error);
    }
  };

  // Health goal optimization
  const optimizeHealthGoals = async () => {
    try {
      const response = await fetch('/api/smart-health/optimize-goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentGoals: healthGoals,
          healthData,
          userCapabilities: getUserCapabilities(),
        }),
      });
      const optimization = await response.json();
      setHealthGoals(optimization.optimizedGoals);
      setAiSuggestions(optimization.suggestions);
    } catch (error) {
      console.error('Goal optimization failed:', error);
    }
  };

  // Wearable device integration
  const syncWearableData = async () => {
    try {
      const response = await fetch('/api/smart-health/sync-wearables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          devices: getConnectedDevices(),
          lastSync: getLastSyncTime(),
        }),
      });
      const syncData = await response.json();
      setHealthData([...healthData, ...syncData.newData]);
    } catch (error) {
      console.error('Wearable sync failed:', error);
    }
  };

  const getUserProfile = () => ({
    age: 30,
    gender: 'male',
    height: 175,
    weight: 70,
    activityLevel: 'moderate',
    medicalHistory: ['none'],
    allergies: ['none'],
  });

  const analyzeHealthPatterns = () => ({
    sleepPattern: { average: 7.5, quality: 'good' },
    exercisePattern: { frequency: 4, intensity: 'moderate' },
    nutritionPattern: { calories: 2000, balance: 'good' },
    stressPattern: { level: 'low', triggers: ['work'] },
  });

  const getRiskFactors = () => ({
    familyHistory: ['diabetes'],
    lifestyle: ['sedentary'],
    environmental: ['pollution'],
    age: 'low',
  });

  const getMedications = () => [
    { name: 'Vitamin D', dosage: '1000 IU', frequency: 'daily' },
    { name: 'Omega-3', dosage: '1000mg', frequency: 'daily' },
  ];

  const getMedicationSchedule = () => ({
    morning: ['Vitamin D'],
    evening: ['Omega-3'],
    reminders: true,
  });

  const getCurrentContext = () => ({
    timeOfDay: new Date().getHours(),
    location: 'home',
    activity: 'resting',
    mood: 'calm',
  });

  const getConnectedDevices = () => [
    { type: 'fitness_tracker', name: 'Fitbit', connected: true },
    { type: 'smart_scale', name: 'Withings', connected: true },
    { type: 'blood_pressure', name: 'Omron', connected: false },
  ];

  const getLastSyncTime = () => new Date(Date.now() - 3600000); // 1 hour ago

  const getUserCapabilities = () => ({
    exercise: 'intermediate',
    cooking: 'beginner',
    meditation: 'advanced',
    timeAvailability: 'moderate',
  });

  const handleAddHealthData = async () => {
    const dataWithAI = {
      ...newData,
      id: Date.now(),
      aiAnalyzed: true,
      trends: calculateTrends(newData),
      recommendations: generateRecommendations(newData),
    };

    setHealthData([...healthData, dataWithAI]);
    setAddDataOpen(false);
    setNewData({
      type: 'heartRate',
      value: '',
      timestamp: new Date(),
      notes: '',
    });

    // Trigger AI analysis after adding data
    setTimeout(() => analyzeHealthData(), 1000);
  };

  const calculateTrends = data => {
    const recentData = healthData.filter(d => d.type === data.type).slice(-10);
    if (recentData.length < 3) return 'insufficient_data';

    const values = recentData.map(d => parseFloat(d.value));
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
    const current = parseFloat(data.value);

    if (current > avg * 1.1) return 'increasing';
    if (current < avg * 0.9) return 'decreasing';
    return 'stable';
  };

  const generateRecommendations = data => {
    const recommendations = [];

    switch (data.type) {
      case 'heartRate':
        if (parseFloat(data.value) > 100) {
          recommendations.push('Consider relaxation techniques');
        }
        break;
      case 'bloodPressure':
        if (parseFloat(data.value) > 140) {
          recommendations.push('Consult with healthcare provider');
        }
        break;
      case 'weight':
        const trend = calculateTrends(data);
        if (trend === 'increasing') {
          recommendations.push('Consider dietary adjustments');
        }
        break;
    }

    return recommendations;
  };

  const applyAISuggestion = suggestion => {
    switch (suggestion.type) {
      case 'goal_adjustment':
        setHealthGoals(
          healthGoals.map(goal =>
            goal.id === suggestion.goalId
              ? { ...goal, ...suggestion.adjustments }
              : goal
          )
        );
        break;
      case 'medication_reminder':
        // Handle medication reminder
        console.log('Medication reminder:', suggestion);
        break;
      case 'exercise_suggestion':
        // Add exercise suggestion to goals
        const newGoal = {
          id: Date.now(),
          type: 'exercise',
          description: suggestion.exercise,
          target: suggestion.target,
          deadline: suggestion.deadline,
        };
        setHealthGoals([...healthGoals, newGoal]);
        break;
    }

    setAiSuggestions(aiSuggestions.filter(s => s.id !== suggestion.id));
  };

  const getMetricIcon = type => {
    switch (type) {
      case 'heartRate':
        return <MonitorHeart />;
      case 'bloodPressure':
        return <LocalHospital />;
      case 'weight':
        return <FitnessCenter />;
      case 'sleep':
        return <Bedtime />;
      case 'hydration':
        return <WaterDrop />;
      case 'medication':
        return <Medication />;
      default:
        return <Favorite />;
    }
  };

  const getMetricColor = (type, value) => {
    switch (type) {
      case 'heartRate':
        return parseFloat(value) > 100
          ? 'error'
          : parseFloat(value) < 60
          ? 'warning'
          : 'success';
      case 'bloodPressure':
        return parseFloat(value) > 140
          ? 'error'
          : parseFloat(value) < 90
          ? 'warning'
          : 'success';
      case 'weight':
        return 'info';
      default:
        return 'primary';
    }
  };

  useEffect(() => {
    // Load initial health data and run AI analysis
    analyzeHealthData();
    generatePredictiveAlerts();
    generateMedicationReminders();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Favorite sx={{ mr: 2, fontSize: 40, color: 'primary.main' }} />
        <Box>
          <Typography variant='h4' component='h1'>
            Smart Health Monitor
          </Typography>
          <Typography variant='subtitle1' color='text.secondary'>
            AI-Powered Health Insights & Monitoring
          </Typography>
        </Box>
      </Box>

      {/* AI Health Insights */}
      {aiInsights && (
        <Alert severity='info' sx={{ mb: 3 }}>
          <Typography variant='h6'>AI Health Insights</Typography>
          <Typography>{aiInsights.summary}</Typography>
          <Typography variant='body2' sx={{ mt: 1 }}>
            Overall Health Score: {aiInsights.healthScore}% | Risk Level:{' '}
            {aiInsights.riskLevel} | Recommendations:{' '}
            {aiInsights.recommendations}
          </Typography>
        </Alert>
      )}

      {/* Predictive Alerts */}
      {predictiveAlerts.length > 0 && (
        <Alert severity='warning' sx={{ mb: 3 }}>
          <Typography variant='h6'>Predictive Health Alerts</Typography>
          {predictiveAlerts.map((alert, index) => (
            <Typography key={index} variant='body2'>
              • {alert.message}
            </Typography>
          ))}
        </Alert>
      )}

      {/* Health Tabs */}
      <Card sx={{ mb: 3 }}>
        <Tabs
          value={currentTab}
          onChange={(e, newValue) => setCurrentTab(newValue)}
        >
          <Tab icon={<TrendingUp />} label='Metrics' />
          <Tab icon={<FitnessCenter />} label='Goals' />
          <Tab icon={<Medication />} label='Medications' />
          <Tab icon={<SmartToy />} label='AI Insights' />
        </Tabs>
      </Card>

      <Grid container spacing={3}>
        {/* Health Data */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography variant='h6'>Health Metrics</Typography>
                <Box>
                  <Button
                    variant='outlined'
                    startIcon={<SmartToy />}
                    onClick={analyzeHealthData}
                    disabled={isAnalyzing}
                    sx={{ mr: 1 }}
                  >
                    AI Analyze
                  </Button>
                  <Button
                    variant='outlined'
                    startIcon={<TrendingUp />}
                    onClick={generatePredictiveAlerts}
                  >
                    Predict Alerts
                  </Button>
                  <Button
                    variant='outlined'
                    onClick={syncWearableData}
                    sx={{ ml: 1 }}
                  >
                    Sync Devices
                  </Button>
                </Box>
              </Box>

              {isAnalyzing && <LinearProgress sx={{ mb: 2 }} />}

              <List>
                {healthData.map(data => (
                  <ListItem
                    key={data.id}
                    sx={{
                      border: '1px solid #e0e0e0',
                      mb: 1,
                      borderRadius: 1,
                    }}
                  >
                    <ListItemIcon>{getMetricIcon(data.type)}</ListItemIcon>
                    <ListItemText
                      primary={
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <Typography variant='h6'>
                            {data.type.charAt(0).toUpperCase() +
                              data.type.slice(1)}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Chip
                              label={data.value}
                              color={getMetricColor(data.type, data.value)}
                              size='small'
                            />
                            {data.trends && (
                              <Chip
                                label={data.trends}
                                color={
                                  data.trends === 'increasing'
                                    ? 'error'
                                    : data.trends === 'decreasing'
                                    ? 'success'
                                    : 'info'
                                }
                                size='small'
                                variant='outlined'
                              />
                            )}
                            {data.aiAnalyzed && (
                              <Chip label='AI' size='small' color='secondary' />
                            )}
                          </Box>
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant='body2' color='text.secondary'>
                            {data.timestamp?.toLocaleString()} • {data.notes}
                          </Typography>
                          {data.recommendations &&
                            data.recommendations.length > 0 && (
                              <Box sx={{ mt: 1 }}>
                                {data.recommendations.map((rec, index) => (
                                  <Chip
                                    key={index}
                                    label={rec}
                                    size='small'
                                    color='primary'
                                    sx={{ mr: 1 }}
                                  />
                                ))}
                              </Box>
                            )}
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* AI Suggestions Panel */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant='h6' sx={{ mb: 2 }}>
                AI Health Suggestions
              </Typography>

              {aiSuggestions.map(suggestion => (
                <Paper
                  key={suggestion.id}
                  sx={{
                    p: 2,
                    mb: 2,
                    bgcolor: 'primary.light',
                    color: 'primary.contrastText',
                  }}
                >
                  <Typography variant='subtitle2' sx={{ mb: 1 }}>
                    {suggestion.type}
                  </Typography>
                  <Typography variant='body2' sx={{ mb: 2 }}>
                    {suggestion.description}
                  </Typography>
                  <Button
                    size='small'
                    variant='contained'
                    onClick={() => applyAISuggestion(suggestion)}
                    sx={{ bgcolor: 'white', color: 'primary.main' }}
                  >
                    Apply
                  </Button>
                </Paper>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Floating Action Button */}
      <Fab
        color='primary'
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => setAddDataOpen(true)}
      >
        <Add />
      </Fab>

      {/* Add Health Data Dialog */}
      <Dialog
        open={addDataOpen}
        onClose={() => setAddDataOpen(false)}
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle>Add Health Data</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            label='Metric Type'
            value={newData.type}
            onChange={e => setNewData({ ...newData, type: e.target.value })}
            SelectProps={{ native: true }}
            sx={{ mb: 2, mt: 1 }}
          >
            <option value='heartRate'>Heart Rate</option>
            <option value='bloodPressure'>Blood Pressure</option>
            <option value='weight'>Weight</option>
            <option value='sleep'>Sleep Hours</option>
            <option value='hydration'>Water Intake</option>
            <option value='steps'>Steps</option>
          </TextField>
          <TextField
            fullWidth
            label='Value'
            value={newData.value}
            onChange={e => setNewData({ ...newData, value: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label='Notes'
            multiline
            rows={3}
            value={newData.notes}
            onChange={e => setNewData({ ...newData, notes: e.target.value })}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDataOpen(false)}>Cancel</Button>
          <Button onClick={handleAddHealthData} variant='contained'>
            Add Data
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SmartHealthMonitorApp;
