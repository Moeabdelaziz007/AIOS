import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Button, TextField, 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Chip, Grid, Paper, List, ListItem, ListItemText, ListItemIcon,
  IconButton, Fab, Tooltip, LinearProgress, Alert, Tabs, Tab,
  Badge, Avatar, Divider, Checkbox, Slider
} from '@mui/material';
import {
  Assignment, Add, SmartToy, Schedule, TrendingUp, 
  CheckCircle, RadioButtonUnchecked, PriorityHigh,
  AccessTime, Person, Flag, Analytics
} from '@mui/icons-material';

const SmartTaskManagerApp = () => {
  const [tasks, setTasks] = useState([]);
  const [aiPriorities, setAiPriorities] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [currentTab, setCurrentTab] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiInsights, setAiInsights] = useState(null);
  const [newTask, setNewTask] = useState({
    title: '', description: '', priority: 'medium', 
    dueDate: '', estimatedTime: 60, category: 'work'
  });
  const [productivityMetrics, setProductivityMetrics] = useState(null);

  // AI-powered task prioritization
  const prioritizeTasks = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/smart-task-manager/prioritize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          tasks,
          context: getUserContext(),
          preferences: getUserPreferences()
        })
      });
      const prioritization = await response.json();
      setAiPriorities(prioritization.priorities);
      setAiInsights(prioritization.insights);
    } catch (error) {
      console.error('Task prioritization failed:', error);
    }
    setIsAnalyzing(false);
  };

  // Predictive task scheduling
  const predictOptimalSchedule = async () => {
    try {
      const response = await fetch('/api/smart-task-manager/predict-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          tasks,
          userPatterns: analyzeUserPatterns(),
          currentContext: getCurrentContext()
        })
      });
      const schedule = await response.json();
      setAiSuggestions(schedule.suggestions);
    } catch (error) {
      console.error('Schedule prediction failed:', error);
    }
  };

  // Smart dependency management
  const analyzeDependencies = async () => {
    try {
      const response = await fetch('/api/smart-task-manager/analyze-dependencies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks })
      });
      const dependencies = await response.json();
      setAiSuggestions(dependencies.suggestions);
    } catch (error) {
      console.error('Dependency analysis failed:', error);
    }
  };

  // Intelligent time estimation
  const estimateTaskTime = async (task) => {
    try {
      const response = await fetch('/api/smart-task-manager/estimate-time', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          task,
          historicalData: getHistoricalData(),
          userCapabilities: getUserCapabilities()
        })
      });
      const estimation = await response.json();
      return estimation.estimatedTime;
    } catch (error) {
      console.error('Time estimation failed:', error);
    }
  };

  // Context-aware task suggestions
  const generateContextualSuggestions = async () => {
    try {
      const response = await fetch('/api/smart-task-manager/contextual-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          currentContext: getCurrentContext(),
          userGoals: getUserGoals(),
          availableTime: getAvailableTime()
        })
      });
      const suggestions = await response.json();
      setAiSuggestions(suggestions);
    } catch (error) {
      console.error('Contextual suggestions failed:', error);
    }
  };

  const getUserContext = () => ({
    currentTime: new Date(),
    workload: calculateWorkload(),
    energyLevel: 'medium',
    focusLevel: 'high',
    recentTasks: tasks.slice(0, 5)
  });

  const getUserPreferences = () => ({
    workHours: { start: '09:00', end: '17:00' },
    breakFrequency: 2,
    taskTypes: ['work', 'personal', 'health', 'learning'],
    priorityFactors: ['deadline', 'importance', 'effort', 'impact']
  });

  const analyzeUserPatterns = () => ({
    productiveHours: ['09:00', '14:00', '16:00'],
    averageTaskDuration: 45,
    completionRate: 0.85,
    preferredTaskTypes: ['work', 'personal']
  });

  const getCurrentContext = () => ({
    timeOfDay: new Date().getHours(),
    dayOfWeek: new Date().getDay(),
    weather: 'sunny',
    mood: 'focused'
  });

  const getUserGoals = () => ({
    daily: ['Complete 3 work tasks', 'Exercise for 30 minutes'],
    weekly: ['Finish project milestone', 'Learn new skill'],
    monthly: ['Complete certification', 'Plan vacation']
  });

  const getAvailableTime = () => ({
    today: 480, // 8 hours in minutes
    thisWeek: 2400, // 40 hours in minutes
    nextWeek: 2400
  });

  const calculateWorkload = () => {
    const activeTasks = tasks.filter(task => !task.completed);
    const totalEstimatedTime = activeTasks.reduce((sum, task) => sum + (task.estimatedTime || 0), 0);
    return totalEstimatedTime > 480 ? 'high' : totalEstimatedTime > 240 ? 'medium' : 'low';
  };

  const getHistoricalData = () => ({
    completedTasks: tasks.filter(task => task.completed),
    averageCompletionTime: 45,
    productivityTrends: ['morning', 'afternoon']
  });

  const getUserCapabilities = () => ({
    coding: 'expert',
    writing: 'intermediate',
    design: 'beginner',
    analysis: 'advanced'
  });

  const handleCreateTask = async () => {
    const estimatedTime = await estimateTaskTime(newTask);
    const taskWithAI = {
      ...newTask,
      id: Date.now(),
      createdAt: new Date(),
      completed: false,
      aiEstimatedTime: estimatedTime,
      aiPriority: calculateAIPriority(newTask),
      smartReminders: generateSmartReminders(newTask)
    };
    
    setTasks([...tasks, taskWithAI]);
    setCreateOpen(false);
    setNewTask({ title: '', description: '', priority: 'medium', dueDate: '', estimatedTime: 60, category: 'work' });
    
    // Trigger AI analysis after adding task
    setTimeout(() => prioritizeTasks(), 1000);
  };

  const calculateAIPriority = (task) => {
    let score = 0;
    if (task.priority === 'high') score += 3;
    if (task.priority === 'medium') score += 2;
    if (task.priority === 'low') score += 1;
    
    if (task.dueDate) {
      const daysUntilDue = Math.ceil((new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
      if (daysUntilDue <= 1) score += 3;
      else if (daysUntilDue <= 3) score += 2;
      else if (daysUntilDue <= 7) score += 1;
    }
    
    return score >= 5 ? 'critical' : score >= 3 ? 'high' : score >= 2 ? 'medium' : 'low';
  };

  const generateSmartReminders = (task) => {
    return [
      { time: '1 day before', type: 'preparation' },
      { time: '2 hours before', type: 'focus' },
      { time: '30 minutes before', type: 'final' }
    ];
  };

  const handleTaskComplete = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed, completedAt: new Date() }
        : task
    ));
    
    // Update productivity metrics
    updateProductivityMetrics();
  };

  const updateProductivityMetrics = () => {
    const completedToday = tasks.filter(task => 
      task.completed && 
      task.completedAt && 
      task.completedAt.toDateString() === new Date().toDateString()
    ).length;
    
    const totalTasks = tasks.length;
    const completionRate = totalTasks > 0 ? (completedToday / totalTasks) * 100 : 0;
    
    setProductivityMetrics({
      completedToday,
      totalTasks,
      completionRate,
      averageTaskTime: 45,
      productivityScore: Math.min(completionRate * 1.2, 100)
    });
  };

  const applyAISuggestion = (suggestion) => {
    switch (suggestion.type) {
      case 'reschedule':
        setTasks(tasks.map(task => 
          task.id === suggestion.taskId 
            ? { ...task, suggestedTime: suggestion.newTime }
            : task
        ));
        break;
      case 'prioritize':
        setTasks(tasks.map(task => 
          task.id === suggestion.taskId 
            ? { ...task, priority: suggestion.newPriority }
            : task
        ));
        break;
      case 'break_down':
        // Break down large task into smaller ones
        const originalTask = tasks.find(t => t.id === suggestion.taskId);
        const subtasks = suggestion.subtasks.map(subtask => ({
          ...subtask,
          id: Date.now() + Math.random(),
          parentId: suggestion.taskId,
          createdAt: new Date()
        }));
        setTasks([...tasks, ...subtasks]);
        break;
    }
    
    setAiSuggestions(aiSuggestions.filter(s => s.id !== suggestion.id));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'critical': return <PriorityHigh />;
      case 'high': return <Flag />;
      case 'medium': return <AccessTime />;
      case 'low': return <CheckCircle />;
      default: return <Assignment />;
    }
  };

  useEffect(() => {
    // Load initial tasks and run AI analysis
    prioritizeTasks();
    predictOptimalSchedule();
    generateContextualSuggestions();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Assignment sx={{ mr: 2, fontSize: 40, color: 'primary.main' }} />
        <Box>
          <Typography variant="h4" component="h1">
            Smart Task Manager
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            AI-Powered Prioritization & Scheduling
          </Typography>
        </Box>
      </Box>

      {/* Productivity Metrics */}
      {productivityMetrics && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="h6">Productivity Metrics</Typography>
          <Typography>
            Completed Today: {productivityMetrics.completedToday} | 
            Total Tasks: {productivityMetrics.totalTasks} | 
            Completion Rate: {productivityMetrics.completionRate.toFixed(1)}% | 
            Productivity Score: {productivityMetrics.productivityScore.toFixed(1)}%
          </Typography>
        </Alert>
      )}

      {/* AI Insights */}
      {aiInsights && (
        <Alert severity="success" sx={{ mb: 3 }}>
          <Typography variant="h6">AI Insights</Typography>
          <Typography>{aiInsights.summary}</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Workload: {aiInsights.workload} | 
            Optimal Focus Time: {aiInsights.optimalTime} | 
            Suggested Breaks: {aiInsights.breaks}
          </Typography>
        </Alert>
      )}

      {/* Task Tabs */}
      <Card sx={{ mb: 3 }}>
        <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)}>
          <Tab icon={<Assignment />} label="All Tasks" />
          <Tab icon={<CheckCircle />} label="Completed" />
          <Tab icon={<RadioButtonUnchecked />} label="Pending" />
          <Tab icon={<TrendingUp />} label="Analytics" />
        </Tabs>
      </Card>

      <Grid container spacing={3}>
        {/* Task List */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Tasks</Typography>
                <Box>
                  <Button 
                    variant="outlined" 
                    startIcon={<SmartToy />}
                    onClick={prioritizeTasks}
                    disabled={isAnalyzing}
                    sx={{ mr: 1 }}
                  >
                    AI Prioritize
                  </Button>
                  <Button 
                    variant="outlined" 
                    startIcon={<Schedule />}
                    onClick={predictOptimalSchedule}
                  >
                    Predict Schedule
                  </Button>
                  <Button 
                    variant="outlined" 
                    onClick={analyzeDependencies}
                    sx={{ ml: 1 }}
                  >
                    Analyze Dependencies
                  </Button>
                </Box>
              </Box>
              
              {isAnalyzing && <LinearProgress sx={{ mb: 2 }} />}
              
              <List>
                {tasks.map((task) => (
                  <ListItem 
                    key={task.id} 
                    sx={{ 
                      border: '1px solid #e0e0e0', 
                      mb: 1, 
                      borderRadius: 1,
                      bgcolor: task.completed ? 'success.light' : 'transparent'
                    }}
                  >
                    <ListItemIcon>
                      <Checkbox
                        checked={task.completed}
                        onChange={() => handleTaskComplete(task.id)}
                        color="primary"
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Typography 
                            variant="h6" 
                            sx={{ textDecoration: task.completed ? 'line-through' : 'none' }}
                          >
                            {task.title}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Chip 
                              label={task.priority} 
                              color={getPriorityColor(task.priority)}
                              size="small"
                            />
                            {task.aiPriority && (
                              <Chip 
                                label={`AI: ${task.aiPriority}`} 
                                color={getPriorityColor(task.aiPriority)}
                                size="small"
                                variant="outlined"
                              />
                            )}
                            {task.suggestedTime && (
                              <Chip label="Scheduled" size="small" color="secondary" />
                            )}
                          </Box>
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {task.description}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5, gap: 2 }}>
                            {task.dueDate && (
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <AccessTime sx={{ fontSize: 16, mr: 0.5 }} />
                                <Typography variant="body2">{task.dueDate}</Typography>
                              </Box>
                            )}
                            {task.estimatedTime && (
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Schedule sx={{ fontSize: 16, mr: 0.5 }} />
                                <Typography variant="body2">{task.estimatedTime} min</Typography>
                              </Box>
                            )}
                            {task.category && (
                              <Chip label={task.category} size="small" variant="outlined" />
                            )}
                          </Box>
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
        onClick={() => setCreateOpen(true)}
      >
        <Add />
      </Fab>

      {/* Create Task Dialog */}
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Smart Task</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Task Title"
            value={newTask.title}
            onChange={(e) => setNewTask({...newTask, title: e.target.value})}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={3}
            value={newTask.description}
            onChange={(e) => setNewTask({...newTask, description: e.target.value})}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label="Due Date"
              type="date"
              value={newTask.dueDate}
              onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Estimated Time (minutes)"
              type="number"
              value={newTask.estimatedTime}
              onChange={(e) => setNewTask({...newTask, estimatedTime: parseInt(e.target.value)})}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              select
              label="Priority"
              value={newTask.priority}
              onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
              SelectProps={{ native: true }}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </TextField>
            <TextField
              select
              label="Category"
              value={newTask.category}
              onChange={(e) => setNewTask({...newTask, category: e.target.value})}
              SelectProps={{ native: true }}
            >
              <option value="work">Work</option>
              <option value="personal">Personal</option>
              <option value="health">Health</option>
              <option value="learning">Learning</option>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateTask} variant="contained">
            Create Task
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SmartTaskManagerApp;
