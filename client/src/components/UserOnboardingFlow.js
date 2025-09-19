import {
  ArrowBack,
  ArrowForward,
  AutoAwesome,
  CheckCircle,
  Close,
  Notifications,
  Person,
  Psychology,
  Rocket,
  Security,
  Settings,
  Shield,
  Speed
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  LinearProgress,
  Radio,
  RadioGroup,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Switch,
  TextField,
  Typography
} from '@mui/material';
import { useState } from 'react';

/**
 * Comprehensive User Onboarding Flow for AIOS
 * Guides new users through system setup and feature discovery
 */
const UserOnboardingFlow = ({ isOpen, onClose, onComplete, userProfile }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [userPreferences, setUserPreferences] = useState({
    role: 'user',
    experience: 'beginner',
    interests: [],
    notifications: true,
    theme: 'light',
    language: 'en',
    goals: []
  });
  const [isLoading, setIsLoading] = useState(false);

  const steps = [
    {
      id: 'welcome',
      title: 'Welcome to AIOS',
      description: 'Your AI-powered workspace awaits',
      icon: <Rocket />,
      component: WelcomeStep
    },
    {
      id: 'profile',
      title: 'Profile Setup',
      description: 'Tell us about yourself',
      icon: <Person />,
      component: ProfileStep
    },
    {
      id: 'preferences',
      title: 'Preferences',
      description: 'Customize your experience',
      icon: <Settings />,
      component: PreferencesStep
    },
    {
      id: 'features',
      title: 'Feature Tour',
      description: 'Discover AIOS capabilities',
      icon: <AutoAwesome />,
      component: FeaturesStep
    },
    {
      id: 'security',
      title: 'Security Setup',
      description: 'Secure your account',
      icon: <Shield />,
      component: SecurityStep
    },
    {
      id: 'complete',
      title: 'All Set!',
      description: "You're ready to start",
      icon: <CheckCircle />,
      component: CompleteStep
    }
  ];

  const handleNext = () => {
    const newCompletedSteps = new Set(completedSteps);
    newCompletedSteps.add(activeStep);
    setCompletedSteps(newCompletedSteps);

    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);

    try {
      // Save user preferences
      await saveUserPreferences(userPreferences);

      // Complete onboarding
      setTimeout(() => {
        setIsLoading(false);
        onComplete(userPreferences);
      }, 2000);
    } catch (error) {
      console.error('Error completing onboarding:', error);
      setIsLoading(false);
    }
  };

  const saveUserPreferences = async preferences => {
    // Simulate saving preferences
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('User preferences saved:', preferences);
  };

  const updatePreferences = updates => {
    setUserPreferences(prev => ({ ...prev, ...updates }));
  };

  const CurrentStepComponent = steps[activeStep].component;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth='md'
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          minHeight: '600px'
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Typography variant='h5' component='div'>
            🚀 AIOS Onboarding
          </Typography>
          <IconButton onClick={onClose} size='small'>
            <Close />
          </IconButton>
        </Box>

        <Stepper activeStep={activeStep} sx={{ mt: 2 }}>
          {steps.map((step, index) => (
            <Step key={step.id} completed={completedSteps.has(index)}>
              <StepLabel>{step.title}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <CurrentStepComponent
          userPreferences={userPreferences}
          updatePreferences={updatePreferences}
          userProfile={userProfile}
          onNext={handleNext}
          onBack={handleBack}
          isLoading={isLoading}
        />
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button onClick={handleBack} disabled={activeStep === 0 || isLoading} startIcon={<ArrowBack />}>
          Back
        </Button>
        <Button
          onClick={handleNext}
          variant='contained'
          disabled={isLoading}
          endIcon={activeStep === steps.length - 1 ? <CheckCircle /> : <ArrowForward />}
        >
          {isLoading ? 'Completing...' : activeStep === steps.length - 1 ? 'Complete' : 'Next'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Welcome Step Component
const WelcomeStep = ({ userProfile, onNext }) => (
  <Box textAlign='center'>
    <Avatar
      sx={{
        width: 120,
        height: 120,
        mx: 'auto',
        mb: 3,
        bgcolor: 'primary.main',
        fontSize: '3rem'
      }}
    >
      🚀
    </Avatar>

    <Typography variant='h4' gutterBottom>
      Welcome to AIOS!
    </Typography>

    <Typography variant='h6' color='text.secondary' paragraph>
      Your AI-powered workspace is ready
    </Typography>

    <Typography variant='body1' paragraph>
      AIOS is an intelligent operating system that learns from your behavior and adapts to your needs. Let's get you set
      up with a personalized experience.
    </Typography>

    <Box mt={4}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Card variant='outlined'>
            <CardContent textAlign='center'>
              <Psychology color='primary' sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant='h6'>AI-Powered</Typography>
              <Typography variant='body2' color='text.secondary'>
                Intelligent automation and learning
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card variant='outlined'>
            <CardContent textAlign='center'>
              <Security color='primary' sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant='h6'>Secure</Typography>
              <Typography variant='body2' color='text.secondary'>
                Enterprise-grade security
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card variant='outlined'>
            <CardContent textAlign='center'>
              <Speed color='primary' sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant='h6'>Fast</Typography>
              <Typography variant='body2' color='text.secondary'>
                Lightning-fast performance
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  </Box>
);

// Profile Step Component
const ProfileStep = ({ userPreferences, updatePreferences, userProfile }) => (
  <Box>
    <Typography variant='h5' gutterBottom>
      Tell us about yourself
    </Typography>

    <Typography variant='body1' color='text.secondary' paragraph>
      Help us personalize your AIOS experience
    </Typography>

    <Stack spacing={3} sx={{ mt: 3 }}>
      <FormControl>
        <FormLabel>What's your role?</FormLabel>
        <RadioGroup value={userPreferences.role} onChange={e => updatePreferences({ role: e.target.value })}>
          <FormControlLabel value='developer' control={<Radio />} label='Developer' />
          <FormControlLabel value='designer' control={<Radio />} label='Designer' />
          <FormControlLabel value='manager' control={<Radio />} label='Manager' />
          <FormControlLabel value='student' control={<Radio />} label='Student' />
          <FormControlLabel value='other' control={<Radio />} label='Other' />
        </RadioGroup>
      </FormControl>

      <FormControl>
        <FormLabel>Experience Level</FormLabel>
        <RadioGroup
          value={userPreferences.experience}
          onChange={e => updatePreferences({ experience: e.target.value })}
        >
          <FormControlLabel value='beginner' control={<Radio />} label='Beginner' />
          <FormControlLabel value='intermediate' control={<Radio />} label='Intermediate' />
          <FormControlLabel value='advanced' control={<Radio />} label='Advanced' />
          <FormControlLabel value='expert' control={<Radio />} label='Expert' />
        </RadioGroup>
      </FormControl>

      <TextField
        fullWidth
        label='What are your main goals with AIOS?'
        multiline
        rows={3}
        placeholder='e.g., Automate repetitive tasks, improve productivity, learn AI tools...'
        value={userPreferences.goals.join(', ')}
        onChange={e => updatePreferences({ goals: e.target.value.split(', ') })}
      />
    </Stack>
  </Box>
);

// Preferences Step Component
const PreferencesStep = ({ userPreferences, updatePreferences }) => (
  <Box>
    <Typography variant='h5' gutterBottom>
      Customize your experience
    </Typography>

    <Typography variant='body1' color='text.secondary' paragraph>
      Set your preferences for the best AIOS experience
    </Typography>

    <Stack spacing={3} sx={{ mt: 3 }}>
      <Box display='flex' justifyContent='space-between' alignItems='center'>
        <Box>
          <Typography variant='h6'>Notifications</Typography>
          <Typography variant='body2' color='text.secondary'>
            Get updates about system status and important events
          </Typography>
        </Box>
        <Switch
          checked={userPreferences.notifications}
          onChange={e => updatePreferences({ notifications: e.target.checked })}
        />
      </Box>

      <FormControl>
        <FormLabel>Theme Preference</FormLabel>
        <RadioGroup value={userPreferences.theme} onChange={e => updatePreferences({ theme: e.target.value })}>
          <FormControlLabel value='light' control={<Radio />} label='Light Theme' />
          <FormControlLabel value='dark' control={<Radio />} label='Dark Theme' />
          <FormControlLabel value='auto' control={<Radio />} label='Auto (System)' />
        </RadioGroup>
      </FormControl>

      <FormControl>
        <FormLabel>Language</FormLabel>
        <RadioGroup value={userPreferences.language} onChange={e => updatePreferences({ language: e.target.value })}>
          <FormControlLabel value='en' control={<Radio />} label='English' />
          <FormControlLabel value='es' control={<Radio />} label='Español' />
          <FormControlLabel value='fr' control={<Radio />} label='Français' />
          <FormControlLabel value='de' control={<Radio />} label='Deutsch' />
        </RadioGroup>
      </FormControl>
    </Stack>
  </Box>
);

// Features Step Component
const FeaturesStep = ({ userPreferences, updatePreferences }) => {
  const features = [
    { id: 'dashboard', name: 'Smart Dashboard', description: 'AI-powered insights and analytics' },
    { id: 'automation', name: 'Task Automation', description: 'Automate repetitive workflows' },
    { id: 'ai-assistant', name: 'AI Assistant', description: 'Intelligent help and suggestions' },
    { id: 'collaboration', name: 'Team Collaboration', description: 'Work together seamlessly' },
    { id: 'analytics', name: 'Advanced Analytics', description: 'Deep insights into your work' },
    { id: 'integrations', name: 'Third-party Integrations', description: 'Connect with your favorite tools' }
  ];

  const toggleInterest = featureId => {
    const interests = userPreferences.interests || [];
    const newInterests = interests.includes(featureId)
      ? interests.filter(id => id !== featureId)
      : [...interests, featureId];
    updatePreferences({ interests: newInterests });
  };

  return (
    <Box>
      <Typography variant='h5' gutterBottom>
        Discover AIOS Features
      </Typography>

      <Typography variant='body1' color='text.secondary' paragraph>
        Select the features you're most interested in
      </Typography>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        {features.map(feature => (
          <Grid item xs={12} md={6} key={feature.id}>
            <Card
              variant='outlined'
              sx={{
                cursor: 'pointer',
                border: userPreferences.interests?.includes(feature.id) ? 2 : 1,
                borderColor: userPreferences.interests?.includes(feature.id) ? 'primary.main' : 'divider',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'action.hover'
                }
              }}
              onClick={() => toggleInterest(feature.id)}
            >
              <CardContent>
                <Box display='flex' justifyContent='space-between' alignItems='center'>
                  <Box>
                    <Typography variant='h6'>{feature.name}</Typography>
                    <Typography variant='body2' color='text.secondary'>
                      {feature.description}
                    </Typography>
                  </Box>
                  {userPreferences.interests?.includes(feature.id) && <CheckCircle color='primary' />}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

// Security Step Component
const SecurityStep = ({ userPreferences, updatePreferences }) => (
  <Box>
    <Typography variant='h5' gutterBottom>
      Security Setup
    </Typography>

    <Typography variant='body1' color='text.secondary' paragraph>
      Secure your AIOS account with these recommended settings
    </Typography>

    <Stack spacing={3} sx={{ mt: 3 }}>
      <Card variant='outlined'>
        <CardContent>
          <Box display='flex' alignItems='center' mb={2}>
            <Shield color='success' sx={{ mr: 2 }} />
            <Typography variant='h6'>Two-Factor Authentication</Typography>
          </Box>
          <Typography variant='body2' color='text.secondary' paragraph>
            Add an extra layer of security to your account
          </Typography>
          <Button variant='outlined' size='small'>
            Enable 2FA
          </Button>
        </CardContent>
      </Card>

      <Card variant='outlined'>
        <CardContent>
          <Box display='flex' alignItems='center' mb={2}>
            <Security color='info' sx={{ mr: 2 }} />
            <Typography variant='h6'>Data Privacy</Typography>
          </Box>
          <Typography variant='body2' color='text.secondary' paragraph>
            Your data is encrypted and protected with enterprise-grade security
          </Typography>
          <Chip label='Encrypted' color='success' size='small' />
        </CardContent>
      </Card>

      <Card variant='outlined'>
        <CardContent>
          <Box display='flex' alignItems='center' mb={2}>
            <Notifications color='warning' sx={{ mr: 2 }} />
            <Typography variant='h6'>Security Notifications</Typography>
          </Box>
          <Typography variant='body2' color='text.secondary' paragraph>
            Get notified about important security events
          </Typography>
          <Switch
            checked={userPreferences.notifications}
            onChange={e => updatePreferences({ notifications: e.target.checked })}
          />
        </CardContent>
      </Card>
    </Stack>
  </Box>
);

// Complete Step Component
const CompleteStep = ({ userPreferences, isLoading }) => (
  <Box textAlign='center'>
    <Avatar
      sx={{
        width: 100,
        height: 100,
        mx: 'auto',
        mb: 3,
        bgcolor: 'success.main',
        fontSize: '2.5rem'
      }}
    >
      <CheckCircle />
    </Avatar>

    <Typography variant='h4' gutterBottom>
      You're All Set! 🎉
    </Typography>

    <Typography variant='h6' color='text.secondary' paragraph>
      Welcome to your AI-powered workspace
    </Typography>

    <Typography variant='body1' paragraph>
      AIOS is now personalized for your needs. The AI will learn from your behavior and continuously improve your
      experience.
    </Typography>

    {isLoading && (
      <Box mt={3}>
        <LinearProgress />
        <Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
          Setting up your personalized workspace...
        </Typography>
      </Box>
    )}

    <Box mt={4}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Chip icon={<Person />} label={`Role: ${userPreferences.role}`} variant='outlined' />
        </Grid>
        <Grid item xs={12} md={4}>
          <Chip icon={<Settings />} label={`Theme: ${userPreferences.theme}`} variant='outlined' />
        </Grid>
        <Grid item xs={12} md={4}>
          <Chip
            icon={<AutoAwesome />}
            label={`${userPreferences.interests?.length || 0} features selected`}
            variant='outlined'
          />
        </Grid>
      </Grid>
    </Box>
  </Box>
);

export default UserOnboardingFlow;
