import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Button, TextField, 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Chip, Grid, Paper, List, ListItem, ListItemText,
  IconButton, Fab, Tooltip, LinearProgress, Alert
} from '@mui/material';
import {
  CalendarToday, Add, Schedule, SmartToy, 
  Event, Notifications, LocationOn, People
} from '@mui/icons-material';

const SmartCalendarApp = () => {
  const [events, setEvents] = useState([]);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [openDialog, setOpenDialog] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '', description: '', startTime: '', endTime: '',
    location: '', attendees: '', priority: 'medium'
  });
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // AI-powered scheduling optimization
  const optimizeSchedule = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/smart-calendar/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events, preferences: getUserPreferences() })
      });
      const optimization = await response.json();
      setAiSuggestions(optimization.suggestions);
      setAiAnalysis(optimization.analysis);
    } catch (error) {
      console.error('AI optimization failed:', error);
    }
    setIsLoading(false);
  };

  // Smart conflict resolution
  const resolveConflicts = async () => {
    const conflicts = detectConflicts(events);
    if (conflicts.length > 0) {
      const response = await fetch('/api/smart-calendar/resolve-conflicts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conflicts })
      });
      const resolutions = await response.json();
      setAiSuggestions(resolutions);
    }
  };

  // Predictive scheduling
  const generatePredictiveSuggestions = async () => {
    const response = await fetch('/api/smart-calendar/predictive', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        userPatterns: analyzeUserPatterns(events),
        currentContext: getCurrentContext()
      })
    });
    const predictions = await response.json();
    setAiSuggestions(predictions.suggestions);
  };

  const getUserPreferences = () => ({
    workingHours: { start: '09:00', end: '17:00' },
    breakDuration: 15,
    meetingTypes: ['work', 'personal', 'health'],
    priorities: ['urgent', 'important', 'routine']
  });

  const detectConflicts = (events) => {
    return events.filter((event, index) => 
      events.some((otherEvent, otherIndex) => 
        index !== otherIndex && 
        isTimeOverlap(event.startTime, event.endTime, otherEvent.startTime, otherEvent.endTime)
      )
    );
  };

  const isTimeOverlap = (start1, end1, start2, end2) => {
    return start1 < end2 && start2 < end1;
  };

  const analyzeUserPatterns = (events) => {
    return {
      preferredTimes: ['09:00', '14:00', '16:00'],
      meetingDuration: 60,
      breakFrequency: 2,
      productivityPeaks: ['morning', 'afternoon']
    };
  };

  const getCurrentContext = () => ({
    timeOfDay: new Date().getHours(),
    dayOfWeek: new Date().getDay(),
    weather: 'sunny',
    workload: 'medium'
  });

  const handleCreateEvent = async () => {
    const eventWithAI = {
      ...newEvent,
      id: Date.now(),
      aiOptimized: true,
      smartReminders: generateSmartReminders(newEvent),
      contextAware: true
    };
    
    setEvents([...events, eventWithAI]);
    setOpenDialog(false);
    setNewEvent({ title: '', description: '', startTime: '', endTime: '', location: '', attendees: '', priority: 'medium' });
    
    // Trigger AI optimization after adding event
    await optimizeSchedule();
  };

  const generateSmartReminders = (event) => {
    return [
      { time: '1 hour before', type: 'preparation' },
      { time: '15 minutes before', type: 'departure' },
      { time: '5 minutes before', type: 'final' }
    ];
  };

  const applyAISuggestion = (suggestion) => {
    setEvents(events.map(event => 
      event.id === suggestion.eventId 
        ? { ...event, ...suggestion.changes }
        : event
    ));
    setAiSuggestions(aiSuggestions.filter(s => s.id !== suggestion.id));
  };

  useEffect(() => {
    // Load initial events and run AI analysis
    optimizeSchedule();
    generatePredictiveSuggestions();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <CalendarToday sx={{ mr: 2, fontSize: 40, color: 'primary.main' }} />
        <Box>
          <Typography variant="h4" component="h1">
            Smart Calendar
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            AI-Powered Scheduling & Optimization
          </Typography>
        </Box>
      </Box>

      {/* AI Analysis Panel */}
      {aiAnalysis && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="h6">AI Analysis</Typography>
          <Typography>{aiAnalysis.summary}</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Efficiency: {aiAnalysis.efficiency}% | Conflicts: {aiAnalysis.conflicts} | 
            Optimization Potential: {aiAnalysis.optimizationPotential}%
          </Typography>
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Calendar View */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Today's Schedule</Typography>
                <Box>
                  <Button 
                    variant="outlined" 
                    startIcon={<SmartToy />}
                    onClick={optimizeSchedule}
                    disabled={isLoading}
                    sx={{ mr: 1 }}
                  >
                    AI Optimize
                  </Button>
                  <Button 
                    variant="outlined" 
                    startIcon={<Schedule />}
                    onClick={resolveConflicts}
                  >
                    Resolve Conflicts
                  </Button>
                </Box>
              </Box>
              
              {isLoading && <LinearProgress sx={{ mb: 2 }} />}
              
              <List>
                {events.map((event) => (
                  <ListItem key={event.id} sx={{ border: '1px solid #e0e0e0', mb: 1, borderRadius: 1 }}>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Typography variant="h6">{event.title}</Typography>
                          <Chip 
                            label={event.priority} 
                            color={event.priority === 'high' ? 'error' : event.priority === 'medium' ? 'warning' : 'success'}
                            size="small"
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {event.startTime} - {event.endTime}
                          </Typography>
                          {event.location && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                              <LocationOn sx={{ fontSize: 16, mr: 0.5 }} />
                              <Typography variant="body2">{event.location}</Typography>
                            </Box>
                          )}
                          {event.attendees && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                              <People sx={{ fontSize: 16, mr: 0.5 }} />
                              <Typography variant="body2">{event.attendees}</Typography>
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
              <Typography variant="h6" sx={{ mb: 2 }}>
                AI Suggestions
              </Typography>
              
              {aiSuggestions.map((suggestion) => (
                <Paper key={suggestion.id} sx={{ p: 2, mb: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    {suggestion.type}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {suggestion.description}
                  </Typography>
                  <Button 
                    size="small" 
                    variant="contained" 
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
        color="primary" 
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => setOpenDialog(true)}
      >
        <Add />
      </Fab>

      {/* Create Event Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Smart Event</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Event Title"
            value={newEvent.title}
            onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={3}
            value={newEvent.description}
            onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label="Start Time"
              type="time"
              value={newEvent.startTime}
              onChange={(e) => setNewEvent({...newEvent, startTime: e.target.value})}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="End Time"
              type="time"
              value={newEvent.endTime}
              onChange={(e) => setNewEvent({...newEvent, endTime: e.target.value})}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
          <TextField
            fullWidth
            label="Location"
            value={newEvent.location}
            onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Attendees"
            value={newEvent.attendees}
            onChange={(e) => setNewEvent({...newEvent, attendees: e.target.value})}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateEvent} variant="contained">
            Create Event
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SmartCalendarApp;
