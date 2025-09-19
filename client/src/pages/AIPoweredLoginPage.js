import {
  Apps,
  AutoAwesome,
  Dashboard,
  Google,
  Groups,
  Memory,
  Psychology,
  Rocket,
  Security,
  SmartToy,
  Speed,
  Stars,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Fade,
  Grid,
  Grow,
  IconButton,
  InputAdornment,
  LinearProgress,
  TextField,
  Typography,
  Zoom
} from '@mui/material';
import { useEffect, useState } from 'react';
import { AIPoweredBadge, AIProcessingIndicator } from '../components/AIAgentComponents';
import { useAuth } from '../contexts/AuthContext';
import usePersonalizedMessages from '../hooks/usePersonalizedMessages';
import { useFirebase } from '../services/FirebaseService';
import { aiAgentColors, aiAnimations, aiGradients, aiStyles } from '../theme/aiPoweredTheme';

const AIPoweredLoginPage = () => {
  const { login, loginWithGoogle, loading, error } = useAuth();
  const {} = useFirebase();
  const { generateMessage, getUserName } = usePersonalizedMessages();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showLoadingPage, setShowLoadingPage] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loginStep, setLoginStep] = useState(0);
  const [showSkipButton, setShowSkipButton] = useState(false);

  const aiFeatures = [
    {
      icon: <Psychology />,
      title: 'Quantum Autopilot',
      description: 'Advanced AI system managing all operations',
      color: aiAgentColors.neural
    },
    {
      icon: <Security />,
      title: 'Security Agent',
      description: 'Intelligent threat detection and prevention',
      color: aiAgentColors.success
    },
    {
      icon: <Speed />,
      title: 'Performance Agent',
      description: 'Real-time optimization and monitoring',
      color: aiAgentColors.accent
    },
    {
      icon: <Memory />,
      title: 'Learning Agent',
      description: 'Continuous improvement and adaptation',
      color: aiAgentColors.quantum
    }
  ];

  const handleEmailLogin = async e => {
    e.preventDefault();
    setIsProcessing(true);
    setShowLoadingPage(true);
    setLoginStep(1);

    try {
      // Simulate AI processing steps
      const steps = [
        'Authenticating with AI security protocols...',
        'Initializing quantum autopilot systems...',
        'Loading intelligent agents...',
        'Preparing your AI workspace...'
      ];

      for (let i = 0; i < steps.length; i++) {
        setLoginStep(i + 1);
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      await login(email, password);
      setLoginSuccess(true);
      setLoginStep(5);

      // Navigate to apps and agents after success
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);
    } catch (error) {
      setLoginStep(0);
      setShowLoadingPage(false);
    } finally {
      setTimeout(() => setIsProcessing(false), 2000);
    }
  };

  const handleGoogleLogin = async () => {
    setIsProcessing(true);
    setShowLoadingPage(true);
    setLoginStep(1);

    try {
      // Simulate AI processing steps
      const steps = [
        'Connecting to Google AI services...',
        'Authenticating with quantum security...',
        'Synchronizing intelligent agents...',
        'Preparing your AI ecosystem...'
      ];

      for (let i = 0; i < steps.length; i++) {
        setLoginStep(i + 1);
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      await loginWithGoogle();
      setLoginSuccess(true);
      setLoginStep(5);

      // Navigate to apps and agents after success
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);
    } catch (error) {
      setLoginStep(0);
      setShowLoadingPage(false);
    } finally {
      setTimeout(() => setIsProcessing(false), 2000);
    }
  };

  useEffect(() => {
    // Simulate AI processing animation
    const interval = setInterval(() => {
      if (isProcessing && loginStep === 1) {
        setLoginStep(prev => (prev === 1 ? 1.5 : 1));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isProcessing, loginStep]);

  // Show skip button after 2 seconds
  useEffect(() => {
    if (showLoadingPage) {
      const timer = setTimeout(() => {
        setShowSkipButton(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showLoadingPage]);

  const handleSkipLoading = () => {
    setShowLoadingPage(false);
    setLoginSuccess(true);
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 1000);
  };

  // Loading Page Component
  if (showLoadingPage) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: aiGradients.background,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Animated Background */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 20% 80%, ${aiAgentColors.primary}22 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, ${aiAgentColors.secondary}22 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, ${aiAgentColors.accent}22 0%, transparent 50%)
            `,
            animation: aiAnimations.quantumFloat.animation
          }}
        />

        {/* Main Loading Content */}
        <Box sx={{ textAlign: 'center', zIndex: 1, maxWidth: 600, px: 3 }}>
          {/* AI Logo */}
          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: aiGradients.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 4,
              animation: aiAnimations.neuralPulse.animation,
              boxShadow: `0 0 40px ${aiAgentColors.primary}44`
            }}
          >
            <AutoAwesome sx={{ fontSize: 60, color: 'white' }} />
          </Box>

          {/* Loading Steps */}
          <Typography
            variant='h4'
            sx={{
              fontWeight: 700,
              mb: 2,
              background: aiGradients.text,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            {loginSuccess ? generateMessage('success') : generateMessage('loading')}
          </Typography>

          {/* Progress Steps */}
          <Box sx={{ mb: 4 }}>
            {[
              `Authenticating ${getUserName()} with AI security protocols...`,
              `Initializing ${getUserName()}'s quantum autopilot systems...`,
              `Loading ${getUserName()}'s intelligent agents...`,
              `Preparing ${getUserName()}'s personalized AI workspace...`,
              `${getUserName()}, you're ready to launch!`
            ].map((step, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 2,
                  opacity: loginStep > index ? 1 : 0.3,
                  transform: loginStep > index ? 'translateX(0)' : 'translateX(-20px)',
                  transition: 'all 0.5s ease'
                }}
              >
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: loginStep > index ? aiGradients.primary : 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2
                  }}
                >
                  {loginStep > index ? (
                    <Stars sx={{ fontSize: 16, color: 'white' }} />
                  ) : (
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: 'white', opacity: 0.5 }} />
                  )}
                </Box>
                <Typography
                  variant='body1'
                  sx={{
                    color: loginStep > index ? 'white' : 'rgba(255,255,255,0.6)',
                    fontWeight: loginStep > index ? 600 : 400
                  }}
                >
                  {step}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Progress Bar */}
          <LinearProgress
            variant='determinate'
            value={(loginStep / 5) * 100}
            sx={{
              height: 8,
              borderRadius: 4,
              mb: 3,
              background: 'rgba(255,255,255,0.1)',
              '& .MuiLinearProgress-bar': {
                background: aiGradients.primary,
                borderRadius: 4
              }
            }}
          />

          {/* Navigation Preview */}
          {loginSuccess && (
            <Box sx={{ mt: 4 }}>
              <Typography variant='h6' sx={{ mb: 3, color: 'white', fontWeight: 600 }}>
                🚀 Taking {getUserName()} to your AI workspace...
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Dashboard sx={{ fontSize: 40, color: aiAgentColors.primary, mb: 1 }} />
                  <Typography variant='caption' sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Dashboard
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Apps sx={{ fontSize: 40, color: aiAgentColors.secondary, mb: 1 }} />
                  <Typography variant='caption' sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Smart Apps
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Groups sx={{ fontSize: 40, color: aiAgentColors.accent, mb: 1 }} />
                  <Typography variant='caption' sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    AI Agents
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </Box>

        {/* Floating AI Elements */}
        <Box
          sx={{
            position: 'absolute',
            top: '20%',
            left: '10%',
            animation: aiAnimations.quantumFloat.animation,
            animationDelay: '0.5s'
          }}
        >
          <SmartToy sx={{ fontSize: 40, color: aiAgentColors.primary, opacity: 0.3 }} />
        </Box>
        <Box
          sx={{
            position: 'absolute',
            top: '30%',
            right: '15%',
            animation: aiAnimations.quantumFloat.animation,
            animationDelay: '1s'
          }}
        >
          <Memory sx={{ fontSize: 35, color: aiAgentColors.secondary, opacity: 0.3 }} />
        </Box>
        <Box
          sx={{
            position: 'absolute',
            bottom: '20%',
            left: '20%',
            animation: aiAnimations.quantumFloat.animation,
            animationDelay: '1.5s'
          }}
        >
          <Psychology sx={{ fontSize: 45, color: aiAgentColors.accent, opacity: 0.3 }} />
        </Box>

        {/* Skip Button */}
        {showSkipButton && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 30,
              right: 30,
              zIndex: 10
            }}
          >
            <Button
              onClick={handleSkipLoading}
              variant='outlined'
              sx={{
                color: 'white',
                borderColor: 'rgba(255,255,255,0.3)',
                backgroundColor: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: 3,
                px: 3,
                py: 1,
                textTransform: 'none',
                fontWeight: 500,
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  borderColor: 'rgba(255,255,255,0.5)',
                  transform: 'translateY(-2px)'
                },
                animation: 'fadeInUp 0.5s ease'
              }}
            >
              Skip Loading
            </Button>
          </Box>
        )}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${aiAgentColors.primary}10 0%, ${aiAgentColors.secondary}10 50%, ${aiAgentColors.neural}10 100%)`,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background AI Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 20%, ${aiAgentColors.primary}05 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, ${aiAgentColors.secondary}05 0%, transparent 50%),
            radial-gradient(circle at 40% 60%, ${aiAgentColors.neural}05 0%, transparent 50%)
          `,
          animation: aiAnimations.neuralFlow.animation
        }}
      />

      <Container maxWidth='lg' sx={{ py: 4 }}>
        <Grid container spacing={4} alignItems='center' sx={{ minHeight: '100vh' }}>
          {/* Left Side - AI Features */}
          <Grid item xs={12} md={6}>
            <Box sx={{ pr: { md: 4 } }}>
              <Fade in timeout={800}>
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant='h2'
                    sx={{
                      ...aiStyles.aiGradientText,
                      mb: 2,
                      fontSize: { xs: '2.5rem', md: '3.5rem' }
                    }}
                  >
                    AIOS
                  </Typography>
                  <Typography variant='h4' sx={{ mb: 2, fontWeight: 600 }}>
                    AI Operating System
                  </Typography>
                  <Typography variant='h6' sx={{ color: 'text.secondary', mb: 3 }}>
                    Powered by Advanced AI Agents
                  </Typography>

                  {/* Quick Preview */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant='body1' sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
                      🚀 What's Inside:
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Dashboard sx={{ color: aiAgentColors.primary, fontSize: 18 }} />
                        <Typography variant='body2'>AI-Powered Dashboard</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Apps sx={{ color: aiAgentColors.secondary, fontSize: 18 }} />
                        <Typography variant='body2'>Smart Applications</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Groups sx={{ color: aiAgentColors.accent, fontSize: 18 }} />
                        <Typography variant='body2'>Intelligent Agents</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Rocket sx={{ color: aiAgentColors.neural, fontSize: 18 }} />
                        <Typography variant='body2'>Quantum Autopilot</Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, mb: 4 }}>
                    <AIPoweredBadge variant='neural' />
                    <AIPoweredBadge variant='quantum' />
                    <AIPoweredBadge variant='default' />
                  </Box>
                </Box>
              </Fade>

              <Grid container spacing={2}>
                {aiFeatures.map((feature, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Grow in timeout={1000 + index * 200}>
                      <Card
                        sx={{
                          ...aiStyles.aiCard,
                          ...aiStyles.smartHover,
                          background: `linear-gradient(135deg, ${feature.color}10, ${feature.color}05)`,
                          border: `1px solid ${feature.color}30`
                        }}
                      >
                        <CardContent sx={{ p: 2 }}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 2
                            }}
                          >
                            <Avatar
                              sx={{
                                background: aiGradients.primary,
                                width: 40,
                                height: 40,
                                animation: aiAnimations.neuralPulse.animation
                              }}
                            >
                              {feature.icon}
                            </Avatar>
                            <Box>
                              <Typography variant='subtitle2' sx={{ fontWeight: 600 }}>
                                {feature.title}
                              </Typography>
                              <Typography variant='caption' sx={{ color: 'text.secondary' }}>
                                {feature.description}
                              </Typography>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grow>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>

          {/* Right Side - Login Form */}
          <Grid item xs={12} md={6}>
            <Zoom in timeout={1000}>
              <Card
                sx={{
                  ...aiStyles.glassMorphism,
                  borderRadius: 4,
                  overflow: 'hidden',
                  position: 'relative'
                }}
              >
                <Box
                  sx={{
                    height: 4,
                    background: aiGradients.rainbow
                  }}
                />
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        background: aiGradients.primary,
                        mx: 'auto',
                        mb: 2,
                        animation: aiAnimations.quantumFloat.animation
                      }}
                    >
                      <SmartToy sx={{ fontSize: 40 }} />
                    </Avatar>
                    <Typography variant='h4' sx={{ fontWeight: 600, mb: 1 }}>
                      Welcome Back
                    </Typography>
                    <Typography variant='body1' sx={{ color: 'text.secondary' }}>
                      Sign in to access your AI-powered workspace
                    </Typography>
                  </Box>

                  {error && (
                    <Alert severity='error' sx={{ mb: 3 }}>
                      {error}
                    </Alert>
                  )}

                  <Box component='form' onSubmit={handleEmailLogin}>
                    <TextField
                      fullWidth
                      label='Email Address'
                      type='email'
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      sx={{ mb: 2 }}
                      inputProps={{
                        autoComplete: 'email'
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <AutoAwesome sx={{ color: aiAgentColors.primary }} />
                          </InputAdornment>
                        )
                      }}
                    />

                    <TextField
                      fullWidth
                      label='Password'
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      sx={{ mb: 3 }}
                      inputProps={{
                        autoComplete: 'current-password'
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <Security sx={{ color: aiAgentColors.primary }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge='end'>
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />

                    {isProcessing && loginStep === 1 && (
                      <Box sx={{ mb: 2 }}>
                        <LinearProgress
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: 'rgba(99, 102, 241, 0.1)',
                            '& .MuiLinearProgress-bar': {
                              background: aiGradients.primary,
                              borderRadius: 3
                            }
                          }}
                        />
                        <Typography
                          variant='caption'
                          sx={{
                            color: 'text.secondary',
                            mt: 1,
                            display: 'block'
                          }}
                        >
                          AI agents are authenticating...
                        </Typography>
                      </Box>
                    )}

                    <Button
                      type='submit'
                      fullWidth
                      variant='contained'
                      size='large'
                      disabled={loading || isProcessing}
                      sx={{
                        mb: 2,
                        py: 1.5,
                        fontSize: '1rem',
                        fontWeight: 600
                      }}
                    >
                      {isProcessing ? 'Processing...' : 'Sign In'}
                    </Button>
                  </Box>

                  <Divider sx={{ my: 3 }}>
                    <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                      OR
                    </Typography>
                  </Divider>

                  <Button
                    fullWidth
                    variant='outlined'
                    size='large'
                    onClick={handleGoogleLogin}
                    disabled={loading || isProcessing}
                    startIcon={<Google />}
                    sx={{
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 600
                    }}
                  >
                    Continue with Google
                  </Button>

                  <Box sx={{ textAlign: 'center', mt: 3 }}>
                    <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                      By signing in, you agree to our AI-powered terms of service
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>
        </Grid>
      </Container>

      {/* AI Processing Indicator */}
      <AIProcessingIndicator isProcessing={isProcessing} message='AI agents are processing your authentication...' />

      {/* Footer */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        <Typography variant='caption' sx={{ color: 'text.secondary' }}>
          Powered by AI Agents
        </Typography>
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: aiGradients.primary,
            animation: aiAnimations.neuralPulse.animation
          }}
        />
      </Box>
    </Box>
  );
};

export default AIPoweredLoginPage;
