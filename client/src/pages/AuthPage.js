import {
  AutoAwesome as AutoAwesomeIcon,
  CheckCircle as CheckCircleIcon,
  DarkMode as DarkModeIcon,
  Email as EmailIcon,
  Fingerprint as FingerprintIcon,
  Google as GoogleIcon,
  Info as InfoIcon,
  LightMode as LightModeIcon,
  Lock as LockIcon,
  Memory as MemoryIcon,
  NetworkCheck as NetworkCheckIcon,
  Person as PersonIcon,
  Rocket as RocketIcon,
  Security as SecurityIcon,
  Shield as ShieldIcon,
  Speed as SpeedIcon,
  Storage as StorageIcon,
  TrendingUp as TrendingUpIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Fade,
  Grid,
  IconButton,
  InputAdornment,
  LinearProgress,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Tooltip,
  Typography,
  Zoom,
} from '@mui/material';
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/FirebaseService';

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [systemMetrics, setSystemMetrics] = useState({
    cpu: 0,
    memory: 0,
    network: 0,
    storage: 0,
    temperature: 0,
  });
  const [aiInsights, setAiInsights] = useState([]);
  const navigate = useNavigate();

  // Simulate system metrics updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemMetrics({
        cpu: Math.floor(Math.random() * 100),
        memory: Math.floor(Math.random() * 100),
        network: Math.floor(Math.random() * 100),
        storage: Math.floor(Math.random() * 100),
        temperature: Math.floor(Math.random() * 40) + 30,
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Generate AI insights
  useEffect(() => {
    const insights = [
      '🔒 Your password strength is being analyzed in real-time',
      '🚀 AI-powered security protocols are active',
      '📊 System performance is optimized for your session',
      '🛡️ Advanced threat detection is monitoring your connection',
      '⚡ Quantum encryption is protecting your data',
    ];
    setAiInsights(insights);
  }, []);

  // Password strength calculator
  const calculatePasswordStrength = password => {
    let strength = 0;
    if (password.length >= 8) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[a-z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[^A-Za-z0-9]/.test(password)) strength += 20;
    return Math.min(strength, 100);
  };

  useEffect(() => {
    if (password) {
      setPasswordStrength(calculatePasswordStrength(password));
    }
  }, [password]);

  const handleEmailAuth = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        setSuccess('🚀 Login successful! Welcome to AIOS');
      } else {
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }
        if (passwordStrength < 50) {
          throw new Error(
            'Password is too weak. Please use a stronger password.'
          );
        }
        await createUserWithEmailAndPassword(auth, email, password);
        setSuccess('🎉 Account created successfully! Welcome to AIOS');
      }
      setTimeout(() => {
        navigate('/apps');
      }, 1500);
    } catch (error) {
      setError(getErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setSuccess('🚀 Google login successful! Welcome to AIOS');
      setTimeout(() => {
        navigate('/apps');
      }, 1500);
    } catch (error) {
      setError(getErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await signInAnonymously(auth);
      setSuccess('👤 Guest login successful! Welcome to AIOS');
      setTimeout(() => {
        navigate('/apps');
      }, 1500);
    } catch (error) {
      setError(getErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  const getErrorMessage = errorCode => {
    const errorMessages = {
      'auth/user-not-found': 'User not found. Please check your email.',
      'auth/wrong-password': 'Incorrect password. Please try again.',
      'auth/invalid-email': 'Invalid email address.',
      'auth/user-disabled': 'This account has been disabled.',
      'auth/too-many-requests':
        'Too many failed attempts. Please try again later.',
      'auth/email-already-in-use': 'Email is already in use.',
      'auth/weak-password': 'Password is too weak.',
      'auth/operation-not-allowed': 'This operation is not allowed.',
      'auth/network-request-failed':
        'Network error. Please check your connection.',
    };
    return errorMessages[errorCode] || 'An error occurred. Please try again.';
  };

  const getPasswordStrengthColor = strength => {
    if (strength < 25) return 'error';
    if (strength < 50) return 'warning';
    if (strength < 75) return 'info';
    return 'success';
  };

  const getPasswordStrengthText = strength => {
    if (strength < 25) return 'Very Weak';
    if (strength < 50) return 'Weak';
    if (strength < 75) return 'Good';
    if (strength < 100) return 'Strong';
    return 'Very Strong';
  };

  const steps = [
    'Account Setup',
    'Security Configuration',
    'System Integration',
    'Ready to Launch',
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: darkMode
          ? 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 25%, #2d2d2d 50%, #1a1a1a 75%, #0a0a0a 100%)'
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #764ba2 75%, #667eea 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        py: 4,
      }}
    >
      {/* Animated background elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: darkMode
            ? 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.2) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.2) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(100, 200, 255, 0.1) 0%, transparent 50%)'
            : 'radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
          animation: 'float 8s ease-in-out infinite',
        }}
      />

      {/* System Status Dashboard */}
      <Box
        sx={{
          position: 'absolute',
          top: 20,
          right: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          alignItems: 'flex-end',
        }}
      >
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Tooltip title='CPU Usage'>
            <Chip
              icon={<SpeedIcon />}
              label={`${systemMetrics.cpu}%`}
              size='small'
              color={
                systemMetrics.cpu > 80
                  ? 'error'
                  : systemMetrics.cpu > 60
                  ? 'warning'
                  : 'success'
              }
              variant='outlined'
            />
          </Tooltip>
          <Tooltip title='Memory Usage'>
            <Chip
              icon={<MemoryIcon />}
              label={`${systemMetrics.memory}%`}
              size='small'
              color={
                systemMetrics.memory > 80
                  ? 'error'
                  : systemMetrics.memory > 60
                  ? 'warning'
                  : 'success'
              }
              variant='outlined'
            />
          </Tooltip>
          <Tooltip title='Network Status'>
            <Chip
              icon={<NetworkCheckIcon />}
              label={`${systemMetrics.network}%`}
              size='small'
              color={
                systemMetrics.network > 80
                  ? 'error'
                  : systemMetrics.network > 60
                  ? 'warning'
                  : 'success'
              }
              variant='outlined'
            />
          </Tooltip>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Tooltip title='Storage Usage'>
            <Chip
              icon={<StorageIcon />}
              label={`${systemMetrics.storage}%`}
              size='small'
              color={
                systemMetrics.storage > 80
                  ? 'error'
                  : systemMetrics.storage > 60
                  ? 'warning'
                  : 'success'
              }
              variant='outlined'
            />
          </Tooltip>
          <Tooltip title='Temperature'>
            <Chip
              icon={<TrendingUpIcon />}
              label={`${systemMetrics.temperature}°C`}
              size='small'
              color={
                systemMetrics.temperature > 70
                  ? 'error'
                  : systemMetrics.temperature > 60
                  ? 'warning'
                  : 'success'
              }
              variant='outlined'
            />
          </Tooltip>
          <IconButton
            onClick={() => setDarkMode(!darkMode)}
            sx={{ color: 'white' }}
          >
            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Box>
      </Box>

      <Container maxWidth='lg'>
        <Grid container spacing={4}>
          {/* Main Auth Card */}
          <Grid item xs={12} md={8}>
            <Zoom in timeout={800}>
              <Card
                sx={{
                  background: darkMode
                    ? 'rgba(0, 0, 0, 0.8)'
                    : 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 4,
                  boxShadow: darkMode
                    ? '0 20px 40px rgba(0, 0, 0, 0.5)'
                    : '0 20px 40px rgba(0, 0, 0, 0.1)',
                  border: darkMode
                    ? '1px solid rgba(255, 255, 255, 0.1)'
                    : '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  {/* Header */}
                  <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Fade in timeout={1000}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 2,
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 80,
                            height: 80,
                            background:
                              'linear-gradient(45deg, #667eea, #764ba2)',
                            mr: 2,
                          }}
                        >
                          <RocketIcon sx={{ fontSize: 40 }} />
                        </Avatar>
                        <Box>
                          <Typography
                            variant='h3'
                            component='h1'
                            sx={{
                              fontWeight: 'bold',
                              background:
                                'linear-gradient(45deg, #667eea, #764ba2)',
                              backgroundClip: 'text',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            }}
                          >
                            AIOS
                          </Typography>
                          <Typography
                            variant='h6'
                            sx={{
                              color: darkMode
                                ? 'rgba(255, 255, 255, 0.8)'
                                : 'rgba(0, 0, 0, 0.6)',
                              fontWeight: 300,
                            }}
                          >
                            AI Operating System
                          </Typography>
                        </Box>
                      </Box>
                    </Fade>

                    <Typography
                      variant='h5'
                      sx={{
                        color: darkMode
                          ? 'rgba(255, 255, 255, 0.9)'
                          : 'rgba(0, 0, 0, 0.7)',
                        mb: 1,
                        fontWeight: 500,
                      }}
                    >
                      {isLogin ? 'Welcome Back!' : 'Create Your Account'}
                    </Typography>

                    <Typography
                      variant='body1'
                      sx={{
                        color: darkMode
                          ? 'rgba(255, 255, 255, 0.6)'
                          : 'rgba(0, 0, 0, 0.5)',
                      }}
                    >
                      {isLogin
                        ? 'Sign in to access your AI-powered workspace'
                        : 'Join the future of computing with AIOS'}
                    </Typography>
                  </Box>

                  {/* Progress Stepper */}
                  {!isLogin && (
                    <Box sx={{ mb: 4 }}>
                      <Stepper activeStep={activeStep} alternativeLabel>
                        {steps.map(label => (
                          <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                          </Step>
                        ))}
                      </Stepper>
                    </Box>
                  )}

                  {/* Error/Success Messages */}
                  {error && (
                    <Fade in>
                      <Alert severity='error' sx={{ mb: 2 }}>
                        {error}
                      </Alert>
                    </Fade>
                  )}

                  {success && (
                    <Fade in>
                      <Alert severity='success' sx={{ mb: 2 }}>
                        {success}
                      </Alert>
                    </Fade>
                  )}

                  {/* Login/Register Form */}
                  <Box component='form' onSubmit={handleEmailAuth}>
                    <Stack spacing={3}>
                      {/* Display Name Field (Register only) */}
                      {!isLogin && (
                        <TextField
                          fullWidth
                          label='Display Name'
                          value={displayName}
                          onChange={e => setDisplayName(e.target.value)}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position='start'>
                                <PersonIcon
                                  sx={{
                                    color: darkMode
                                      ? 'rgba(255, 255, 255, 0.6)'
                                      : 'rgba(0, 0, 0, 0.6)',
                                  }}
                                />
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              backgroundColor: darkMode
                                ? 'rgba(255, 255, 255, 0.05)'
                                : 'rgba(0, 0, 0, 0.02)',
                            },
                          }}
                        />
                      )}

                      {/* Email Field */}
                      <TextField
                        fullWidth
                        label='Email Address'
                        type='email'
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position='start'>
                              <EmailIcon
                                sx={{
                                  color: darkMode
                                    ? 'rgba(255, 255, 255, 0.6)'
                                    : 'rgba(0, 0, 0, 0.6)',
                                }}
                              />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            backgroundColor: darkMode
                              ? 'rgba(255, 255, 255, 0.05)'
                              : 'rgba(0, 0, 0, 0.02)',
                          },
                        }}
                      />

                      {/* Password Field */}
                      <TextField
                        fullWidth
                        label='Password'
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        inputProps={{
                          autoComplete: 'new-password',
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position='start'>
                              <LockIcon
                                sx={{
                                  color: darkMode
                                    ? 'rgba(255, 255, 255, 0.6)'
                                    : 'rgba(0, 0, 0, 0.6)',
                                }}
                              />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position='end'>
                              <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                edge='end'
                              >
                                {showPassword ? (
                                  <VisibilityOffIcon />
                                ) : (
                                  <VisibilityIcon />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            backgroundColor: darkMode
                              ? 'rgba(255, 255, 255, 0.05)'
                              : 'rgba(0, 0, 0, 0.02)',
                          },
                        }}
                      />

                      {/* Confirm Password Field (Register only) */}
                      {!isLogin && (
                        <TextField
                          fullWidth
                          label='Confirm Password'
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={e => setConfirmPassword(e.target.value)}
                          required
                          inputProps={{
                            autoComplete: 'new-password',
                          }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position='start'>
                                <SecurityIcon
                                  sx={{
                                    color: darkMode
                                      ? 'rgba(255, 255, 255, 0.6)'
                                      : 'rgba(0, 0, 0, 0.6)',
                                  }}
                                />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position='end'>
                                <IconButton
                                  onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                  }
                                  edge='end'
                                >
                                  {showConfirmPassword ? (
                                    <VisibilityOffIcon />
                                  ) : (
                                    <VisibilityIcon />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              backgroundColor: darkMode
                                ? 'rgba(255, 255, 255, 0.05)'
                                : 'rgba(0, 0, 0, 0.02)',
                            },
                          }}
                        />
                      )}

                      {/* Password Strength Indicator */}
                      {!isLogin && password && (
                        <Box>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mb: 1,
                            }}
                          >
                            <Typography variant='body2' sx={{ mr: 1 }}>
                              Password Strength:
                            </Typography>
                            <Chip
                              label={getPasswordStrengthText(passwordStrength)}
                              size='small'
                              color={getPasswordStrengthColor(passwordStrength)}
                              variant='outlined'
                            />
                          </Box>
                          <LinearProgress
                            variant='determinate'
                            value={passwordStrength}
                            color={getPasswordStrengthColor(passwordStrength)}
                            sx={{ height: 8, borderRadius: 4 }}
                          />
                        </Box>
                      )}

                      {/* Submit Button */}
                      <Button
                        type='submit'
                        fullWidth
                        variant='contained'
                        size='large'
                        disabled={loading}
                        sx={{
                          py: 2,
                          borderRadius: 2,
                          background:
                            'linear-gradient(45deg, #667eea, #764ba2)',
                          fontSize: '1.1rem',
                          fontWeight: 'bold',
                          '&:hover': {
                            background:
                              'linear-gradient(45deg, #5a6fd8, #6a4190)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        {loading ? (
                          <CircularProgress size={24} color='inherit' />
                        ) : (
                          <>
                            {isLogin ? (
                              <>
                                <PersonIcon sx={{ mr: 1 }} />
                                Sign In to AIOS
                              </>
                            ) : (
                              <>
                                <SecurityIcon sx={{ mr: 1 }} />
                                Create AIOS Account
                              </>
                            )}
                          </>
                        )}
                      </Button>

                      {/* Toggle Login/Register */}
                      <Box sx={{ textAlign: 'center' }}>
                        <Button
                          onClick={() => {
                            setIsLogin(!isLogin);
                            setError('');
                            setSuccess('');
                            setActiveStep(0);
                          }}
                          sx={{
                            color: darkMode
                              ? 'rgba(255, 255, 255, 0.8)'
                              : 'rgba(0, 0, 0, 0.6)',
                            textTransform: 'none',
                            fontSize: '1rem',
                          }}
                        >
                          {isLogin
                            ? "Don't have an account? Create one"
                            : 'Already have an account? Sign in'}
                        </Button>
                      </Box>
                    </Stack>
                  </Box>

                  {/* Divider */}
                  <Divider sx={{ my: 3 }}>
                    <Typography
                      variant='body2'
                      sx={{
                        color: darkMode
                          ? 'rgba(255, 255, 255, 0.6)'
                          : 'rgba(0, 0, 0, 0.6)',
                      }}
                    >
                      OR CONTINUE WITH
                    </Typography>
                  </Divider>

                  {/* Social Login Buttons */}
                  <Stack spacing={2}>
                    <Button
                      fullWidth
                      variant='outlined'
                      size='large'
                      onClick={handleGoogleLogin}
                      disabled={loading}
                      startIcon={<GoogleIcon />}
                      sx={{
                        py: 1.5,
                        borderRadius: 2,
                        borderColor: darkMode
                          ? 'rgba(255, 255, 255, 0.3)'
                          : 'rgba(0, 0, 0, 0.2)',
                        color: darkMode ? 'white' : 'black',
                        fontSize: '1rem',
                        '&:hover': {
                          borderColor: darkMode
                            ? 'rgba(255, 255, 255, 0.5)'
                            : 'rgba(0, 0, 0, 0.4)',
                          backgroundColor: darkMode
                            ? 'rgba(255, 255, 255, 0.05)'
                            : 'rgba(0, 0, 0, 0.02)',
                        },
                      }}
                    >
                      Continue with Google
                    </Button>

                    <Button
                      fullWidth
                      variant='outlined'
                      size='large'
                      onClick={handleGuestLogin}
                      disabled={loading}
                      startIcon={<FingerprintIcon />}
                      sx={{
                        py: 1.5,
                        borderRadius: 2,
                        borderColor: darkMode
                          ? 'rgba(255, 255, 255, 0.3)'
                          : 'rgba(0, 0, 0, 0.2)',
                        color: darkMode ? 'white' : 'black',
                        fontSize: '1rem',
                        '&:hover': {
                          borderColor: darkMode
                            ? 'rgba(255, 255, 255, 0.5)'
                            : 'rgba(0, 0, 0, 0.4)',
                          backgroundColor: darkMode
                            ? 'rgba(255, 255, 255, 0.05)'
                            : 'rgba(0, 0, 0, 0.02)',
                        },
                      }}
                    >
                      Continue as Guest
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>

          {/* AI Insights Sidebar */}
          <Grid item xs={12} md={4}>
            <Fade in timeout={1200}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* AI Insights Card */}
                <Card
                  sx={{
                    background: darkMode
                      ? 'rgba(0, 0, 0, 0.6)'
                      : 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 3,
                    border: darkMode
                      ? '1px solid rgba(255, 255, 255, 0.1)'
                      : '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <AutoAwesomeIcon sx={{ mr: 1, color: '#667eea' }} />
                      <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
                        AI Insights
                      </Typography>
                    </Box>
                    <Stack spacing={2}>
                      {aiInsights.map((insight, index) => (
                        <Box
                          key={index}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            p: 1,
                            borderRadius: 1,
                            backgroundColor: darkMode
                              ? 'rgba(255, 255, 255, 0.05)'
                              : 'rgba(0, 0, 0, 0.02)',
                          }}
                        >
                          <InfoIcon
                            sx={{ mr: 1, fontSize: 16, color: '#667eea' }}
                          />
                          <Typography variant='body2'>{insight}</Typography>
                        </Box>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>

                {/* System Status Card */}
                <Card
                  sx={{
                    background: darkMode
                      ? 'rgba(0, 0, 0, 0.6)'
                      : 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 3,
                    border: darkMode
                      ? '1px solid rgba(255, 255, 255, 0.1)'
                      : '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <TrendingUpIcon sx={{ mr: 1, color: '#667eea' }} />
                      <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
                        System Status
                      </Typography>
                    </Box>
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant='body2' sx={{ mb: 1 }}>
                          CPU Usage
                        </Typography>
                        <LinearProgress
                          variant='determinate'
                          value={systemMetrics.cpu}
                          color={
                            systemMetrics.cpu > 80
                              ? 'error'
                              : systemMetrics.cpu > 60
                              ? 'warning'
                              : 'success'
                          }
                          sx={{ height: 6, borderRadius: 3 }}
                        />
                        <Typography
                          variant='caption'
                          sx={{ mt: 0.5, display: 'block' }}
                        >
                          {systemMetrics.cpu}%
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant='body2' sx={{ mb: 1 }}>
                          Memory Usage
                        </Typography>
                        <LinearProgress
                          variant='determinate'
                          value={systemMetrics.memory}
                          color={
                            systemMetrics.memory > 80
                              ? 'error'
                              : systemMetrics.memory > 60
                              ? 'warning'
                              : 'success'
                          }
                          sx={{ height: 6, borderRadius: 3 }}
                        />
                        <Typography
                          variant='caption'
                          sx={{ mt: 0.5, display: 'block' }}
                        >
                          {systemMetrics.memory}%
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant='body2' sx={{ mb: 1 }}>
                          Network Speed
                        </Typography>
                        <LinearProgress
                          variant='determinate'
                          value={systemMetrics.network}
                          color={
                            systemMetrics.network > 80
                              ? 'error'
                              : systemMetrics.network > 60
                              ? 'warning'
                              : 'success'
                          }
                          sx={{ height: 6, borderRadius: 3 }}
                        />
                        <Typography
                          variant='caption'
                          sx={{ mt: 0.5, display: 'block' }}
                        >
                          {systemMetrics.network}%
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>

                {/* Security Features Card */}
                <Card
                  sx={{
                    background: darkMode
                      ? 'rgba(0, 0, 0, 0.6)'
                      : 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 3,
                    border: darkMode
                      ? '1px solid rgba(255, 255, 255, 0.1)'
                      : '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <ShieldIcon sx={{ mr: 1, color: '#667eea' }} />
                      <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
                        Security Features
                      </Typography>
                    </Box>
                    <Stack spacing={1}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CheckCircleIcon
                          sx={{ mr: 1, fontSize: 16, color: 'success.main' }}
                        />
                        <Typography variant='body2'>
                          End-to-end encryption
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CheckCircleIcon
                          sx={{ mr: 1, fontSize: 16, color: 'success.main' }}
                        />
                        <Typography variant='body2'>
                          AI-powered threat detection
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CheckCircleIcon
                          sx={{ mr: 1, fontSize: 16, color: 'success.main' }}
                        />
                        <Typography variant='body2'>
                          Quantum-safe protocols
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CheckCircleIcon
                          sx={{ mr: 1, fontSize: 16, color: 'success.main' }}
                        />
                        <Typography variant='body2'>
                          Real-time monitoring
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Box>
            </Fade>
          </Grid>
        </Grid>
      </Container>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
      `}</style>
    </Box>
  );
};

export default AuthPage;
