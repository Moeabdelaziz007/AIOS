import {
  Add,
  Analytics,
  Assignment,
  Book,
  PlayArrow,
  Quiz,
  School,
  SmartToy,
  TrendingUp,
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

const SmartLearningAssistantApp = () => {
  const [courses, setCourses] = useState([]);
  const [aiInsights, setAiInsights] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [addCourseOpen, setAddCourseOpen] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [currentTab, setCurrentTab] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    difficulty: 'beginner',
    duration: 60,
    category: 'programming',
  });
  const [learningProgress, setLearningProgress] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [adaptiveContent, setAdaptiveContent] = useState([]);

  // AI-powered learning analysis
  const analyzeLearning = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/smart-learning/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courses,
          progress: learningProgress,
          assessments,
          userProfile: getUserProfile(),
        }),
      });
      const analysis = await response.json();
      setAiInsights(analysis.insights);
      setAiSuggestions(analysis.suggestions);
    } catch (error) {
      console.error('Learning analysis failed:', error);
    }
    setIsAnalyzing(false);
  };

  // Personalized content curation
  const curatePersonalizedContent = async () => {
    try {
      const response = await fetch('/api/smart-learning/curate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userInterests: getUserInterests(),
          skillLevel: getSkillLevel(),
          learningStyle: getLearningStyle(),
          goals: getLearningGoals(),
        }),
      });
      const content = await response.json();
      setAdaptiveContent(content.recommendations);
    } catch (error) {
      console.error('Content curation failed:', error);
    }
  };

  // Adaptive learning paths
  const generateAdaptivePaths = async () => {
    try {
      const response = await fetch('/api/smart-learning/adaptive-paths', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentProgress: learningProgress,
          assessments,
          learningGoals: getLearningGoals(),
        }),
      });
      const paths = await response.json();
      setAiSuggestions(paths.suggestions);
    } catch (error) {
      console.error('Adaptive paths failed:', error);
    }
  };

  // Smart knowledge assessment
  const generateKnowledgeAssessment = async () => {
    try {
      const response = await fetch('/api/smart-learning/knowledge-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: selectedCourse?.id,
          userLevel: getUserLevel(),
          topics: getCourseTopics(),
        }),
      });
      const assessment = await response.json();
      setAssessments([...assessments, assessment]);
    } catch (error) {
      console.error('Knowledge assessment failed:', error);
    }
  };

  // Learning analytics
  const generateLearningAnalytics = async () => {
    try {
      const response = await fetch('/api/smart-learning/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          learningProgress,
          assessments,
          timeSpent: getTimeSpent(),
          completionRates: getCompletionRates(),
        }),
      });
      const analytics = await response.json();
      setAiInsights(analytics);
    } catch (error) {
      console.error('Learning analytics failed:', error);
    }
  };

  const getUserProfile = () => ({
    age: 30,
    experience: 'intermediate',
    interests: ['programming', 'ai', 'data-science'],
    learningStyle: 'visual',
    timeAvailability: 'moderate',
    goals: ['career_advancement', 'skill_development'],
  });

  const getUserInterests = () => [
    'artificial-intelligence',
    'machine-learning',
    'web-development',
    'data-analysis',
    'cloud-computing',
  ];

  const getSkillLevel = () => ({
    programming: 'intermediate',
    ai: 'beginner',
    'data-science': 'beginner',
    'web-development': 'advanced',
  });

  const getLearningStyle = () => ({
    primary: 'visual',
    secondary: 'kinesthetic',
    preferences: ['video', 'hands-on', 'interactive'],
  });

  const getLearningGoals = () => ({
    shortTerm: ['Complete AI course', 'Build ML project'],
    longTerm: ['AI Engineer', 'Data Scientist'],
    timeline: '6 months',
  });

  const getUserLevel = () => ({
    overall: 'intermediate',
    programming: 'intermediate',
    ai: 'beginner',
    math: 'advanced',
  });

  const getCourseTopics = () => [
    'machine-learning',
    'neural-networks',
    'deep-learning',
    'python',
    'tensorflow',
  ];

  const getTimeSpent = () => ({
    total: 120, // hours
    thisWeek: 8,
    thisMonth: 32,
    averagePerSession: 2,
  });

  const getCompletionRates = () => ({
    courses: 0.75,
    assessments: 0.85,
    projects: 0.6,
    overall: 0.73,
  });

  const handleAddCourse = async () => {
    const courseWithAI = {
      ...newCourse,
      id: Date.now(),
      createdAt: new Date(),
      aiOptimized: true,
      difficulty: calculateAIDifficulty(newCourse),
      estimatedTime: estimateCourseTime(newCourse),
      prerequisites: generatePrerequisites(newCourse),
      learningPath: generateLearningPath(newCourse),
    };

    setCourses([...courses, courseWithAI]);
    setAddCourseOpen(false);
    setNewCourse({
      title: '',
      description: '',
      difficulty: 'beginner',
      duration: 60,
      category: 'programming',
    });

    // Trigger AI analysis after adding course
    setTimeout(() => analyzeLearning(), 1000);
  };

  const calculateAIDifficulty = course => {
    let difficulty = 0;

    // Analyze title and description for complexity indicators
    const text = `${course.title} ${course.description}`.toLowerCase();

    if (text.includes('advanced') || text.includes('expert')) difficulty += 2;
    if (text.includes('intermediate')) difficulty += 1;
    if (text.includes('beginner') || text.includes('basic')) difficulty += 0;

    // Analyze duration
    if (course.duration > 120) difficulty += 1;
    if (course.duration > 240) difficulty += 1;

    return difficulty >= 3
      ? 'advanced'
      : difficulty >= 1
      ? 'intermediate'
      : 'beginner';
  };

  const estimateCourseTime = course => {
    // AI estimation based on content analysis
    const baseTime = course.duration;
    const complexityMultiplier =
      course.difficulty === 'advanced'
        ? 1.5
        : course.difficulty === 'intermediate'
        ? 1.2
        : 1.0;

    return Math.round(baseTime * complexityMultiplier);
  };

  const generatePrerequisites = course => {
    const prerequisites = [];

    if (course.category === 'programming') {
      prerequisites.push('Basic programming knowledge');
    }
    if (course.difficulty === 'advanced') {
      prerequisites.push('Intermediate experience');
    }
    if (course.title.toLowerCase().includes('ai')) {
      prerequisites.push('Mathematics fundamentals');
    }

    return prerequisites;
  };

  const generateLearningPath = course => {
    return [
      'Introduction and Overview',
      'Fundamental Concepts',
      'Hands-on Practice',
      'Advanced Topics',
      'Project Work',
      'Assessment and Review',
    ];
  };

  const handleStartCourse = courseId => {
    const course = courses.find(c => c.id === courseId);
    if (course) {
      setSelectedCourse(course);
      // Start learning session
      console.log('Starting course:', course.title);
    }
  };

  const applyAISuggestion = suggestion => {
    switch (suggestion.type) {
      case 'course_recommendation':
        // Add recommended course
        const newCourse = {
          id: Date.now(),
          title: suggestion.course.title,
          description: suggestion.course.description,
          difficulty: suggestion.course.difficulty,
          duration: suggestion.course.duration,
          category: suggestion.course.category,
          aiRecommended: true,
        };
        setCourses([...courses, newCourse]);
        break;
      case 'learning_path_adjustment':
        // Adjust learning path
        console.log('Learning path adjustment:', suggestion);
        break;
      case 'assessment_suggestion':
        // Generate assessment
        generateKnowledgeAssessment();
        break;
    }

    setAiSuggestions(aiSuggestions.filter(s => s.id !== suggestion.id));
  };

  const getDifficultyColor = difficulty => {
    switch (difficulty) {
      case 'beginner':
        return 'success';
      case 'intermediate':
        return 'warning';
      case 'advanced':
        return 'error';
      default:
        return 'default';
    }
  };

  const getCategoryIcon = category => {
    switch (category) {
      case 'programming':
        return <Book />;
      case 'ai':
        return <SmartToy />;
      case 'data-science':
        return <Analytics />;
      case 'web-development':
        return <Assignment />;
      default:
        return <School />;
    }
  };

  useEffect(() => {
    // Load initial data and run AI analysis
    analyzeLearning();
    curatePersonalizedContent();
    generateAdaptivePaths();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <School sx={{ mr: 2, fontSize: 40, color: 'primary.main' }} />
        <Box>
          <Typography variant='h4' component='h1'>
            Smart Learning Assistant
          </Typography>
          <Typography variant='subtitle1' color='text.secondary'>
            AI-Powered Personalized Learning & Tutoring
          </Typography>
        </Box>
      </Box>

      {/* AI Learning Insights */}
      {aiInsights && (
        <Alert severity='info' sx={{ mb: 3 }}>
          <Typography variant='h6'>AI Learning Insights</Typography>
          <Typography>{aiInsights.summary}</Typography>
          <Typography variant='body2' sx={{ mt: 1 }}>
            Learning Score: {aiInsights.learningScore}% | Progress Rate:{' '}
            {aiInsights.progressRate}% | Recommendations:{' '}
            {aiInsights.recommendations} | Next Steps: {aiInsights.nextSteps}
          </Typography>
        </Alert>
      )}

      {/* Learning Tabs */}
      <Card sx={{ mb: 3 }}>
        <Tabs
          value={currentTab}
          onChange={(e, newValue) => setCurrentTab(newValue)}
        >
          <Tab icon={<Book />} label='Courses' />
          <Tab icon={<TrendingUp />} label='Progress' />
          <Tab icon={<Quiz />} label='Assessments' />
          <Tab icon={<SmartToy />} label='AI Tutor' />
        </Tabs>
      </Card>

      <Grid container spacing={3}>
        {/* Courses */}
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
                <Typography variant='h6'>Learning Courses</Typography>
                <Box>
                  <Button
                    variant='outlined'
                    startIcon={<SmartToy />}
                    onClick={analyzeLearning}
                    disabled={isAnalyzing}
                    sx={{ mr: 1 }}
                  >
                    AI Analyze
                  </Button>
                  <Button
                    variant='outlined'
                    startIcon={<TrendingUp />}
                    onClick={curatePersonalizedContent}
                  >
                    Curate Content
                  </Button>
                  <Button
                    variant='outlined'
                    onClick={generateAdaptivePaths}
                    sx={{ ml: 1 }}
                  >
                    Adaptive Paths
                  </Button>
                </Box>
              </Box>

              {isAnalyzing && <LinearProgress sx={{ mb: 2 }} />}

              <List>
                {courses.map(course => (
                  <ListItem
                    key={course.id}
                    sx={{
                      border: '1px solid #e0e0e0',
                      mb: 1,
                      borderRadius: 1,
                    }}
                  >
                    <ListItemIcon>
                      {getCategoryIcon(course.category)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <Typography variant='h6'>{course.title}</Typography>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Chip
                              label={course.difficulty}
                              color={getDifficultyColor(course.difficulty)}
                              size='small'
                            />
                            <Chip
                              label={`${course.duration} min`}
                              color='info'
                              size='small'
                            />
                            {course.aiOptimized && (
                              <Chip label='AI' size='small' color='secondary' />
                            )}
                            {course.aiRecommended && (
                              <Chip
                                label='Recommended'
                                size='small'
                                color='primary'
                              />
                            )}
                          </Box>
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant='body2' color='text.secondary'>
                            {course.description}
                          </Typography>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mt: 0.5,
                              gap: 2,
                            }}
                          >
                            <Chip
                              label={course.category}
                              size='small'
                              variant='outlined'
                            />
                            {course.prerequisites &&
                              course.prerequisites.length > 0 && (
                                <Typography
                                  variant='body2'
                                  color='text.secondary'
                                >
                                  Prerequisites:{' '}
                                  {course.prerequisites.join(', ')}
                                </Typography>
                              )}
                          </Box>
                        </Box>
                      }
                    />
                    <Button
                      variant='contained'
                      startIcon={<PlayArrow />}
                      onClick={() => handleStartCourse(course.id)}
                    >
                      Start
                    </Button>
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
                AI Learning Suggestions
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
        onClick={() => setAddCourseOpen(true)}
      >
        <Add />
      </Fab>

      {/* Add Course Dialog */}
      <Dialog
        open={addCourseOpen}
        onClose={() => setAddCourseOpen(false)}
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle>Add Learning Course</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label='Course Title'
            value={newCourse.title}
            onChange={e =>
              setNewCourse({ ...newCourse, title: e.target.value })
            }
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            fullWidth
            label='Description'
            multiline
            rows={3}
            value={newCourse.description}
            onChange={e =>
              setNewCourse({ ...newCourse, description: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              select
              label='Difficulty'
              value={newCourse.difficulty}
              onChange={e =>
                setNewCourse({ ...newCourse, difficulty: e.target.value })
              }
              SelectProps={{ native: true }}
            >
              <option value='beginner'>Beginner</option>
              <option value='intermediate'>Intermediate</option>
              <option value='advanced'>Advanced</option>
            </TextField>
            <TextField
              label='Duration (minutes)'
              type='number'
              value={newCourse.duration}
              onChange={e =>
                setNewCourse({
                  ...newCourse,
                  duration: parseInt(e.target.value),
                })
              }
            />
          </Box>
          <TextField
            select
            fullWidth
            label='Category'
            value={newCourse.category}
            onChange={e =>
              setNewCourse({ ...newCourse, category: e.target.value })
            }
            SelectProps={{ native: true }}
          >
            <option value='programming'>Programming</option>
            <option value='ai'>Artificial Intelligence</option>
            <option value='data-science'>Data Science</option>
            <option value='web-development'>Web Development</option>
            <option value='design'>Design</option>
            <option value='business'>Business</option>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddCourseOpen(false)}>Cancel</Button>
          <Button onClick={handleAddCourse} variant='contained'>
            Add Course
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SmartLearningAssistantApp;
