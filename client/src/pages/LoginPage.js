import {
  AutoAwesome as AutoAwesomeIcon,
  Battery6Bar as BatteryIcon,
  CheckCircle as CheckCircleIcon,
  DarkMode as DarkModeIcon,
  Email as EmailIcon,
  Error as ErrorIcon,
  Fingerprint as FingerprintIcon,
  Google as GoogleIcon,
  Info as InfoIcon,
  LightMode as LightModeIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  Psychology as PsychologyIcon,
  Rocket as RocketIcon,
  Security as SecurityIcon,
  Shield as ShieldIcon,
  Speed as SpeedIcon,
  TrendingUp as TrendingUpIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Warning as WarningIcon,
  Wifi as WifiIcon,
} from '@mui/icons-material';
import {
  Alert,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Fade,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  LinearProgress,
  Paper,
  Stack,
  Switch,
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
import UserDataCollectionService from '../services/UserDataCollectionService';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  // Initialize data collection service
  const [dataCollectionService] = useState(
    () => new UserDataCollectionService()
  );
  const [darkMode, setDarkMode] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [rememberMe, setRememberMe] = useState(false);
  const [systemStatus, setSystemStatus] = useState({
    cpu: 0,
    memory: 0,
    network: 0,
    battery: 0,
  });
  const [features] = useState([
    {
      icon: <RocketIcon />,
      title: 'AI-Powered',
      description: 'Intelligent automation',
    },
    {
      icon: <ShieldIcon />,
      title: 'Secure',
      description: 'Enterprise-grade security',
    },
    {
      icon: <SpeedIcon />,
      title: 'Fast',
      description: 'Lightning-fast performance',
    },
    {
      icon: <AutoAwesomeIcon />,
      title: 'Smart',
      description: 'Adaptive learning',
    },
  ]);
  const navigate = useNavigate();

  // Simulate system status updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStatus({
        cpu: Math.floor(Math.random() * 100),
        memory: Math.floor(Math.random() * 100),
        network: Math.floor(Math.random() * 100),
        battery: Math.floor(Math.random() * 100),
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Password strength calculator
  const calculatePasswordStrength = password => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
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
      let user;
      if (isLogin) {
        user = await signInWithEmailAndPassword(auth, email, password);
        setSuccess('🚀 Login successful! Welcome to AIOS');
      } else {
        if (passwordStrength < 50) {
          throw new Error(
            'Password is too weak. Please use a stronger password.'
          );
        }
        user = await createUserWithEmailAndPassword(auth, email, password);
        setSuccess('🎉 Account created successfully! Welcome to AIOS');
      }

      // Collect comprehensive user data
      await dataCollectionService.collectUserData(user.user, {
        fullName,
        company,
        jobTitle,
        location,
        interests,
        phoneNumber,
        loginMethod: 'email',
        rememberMe,
        darkMode,
        marketingConsent: true, // Default to true for data collection
      });

      // Track login behavior
      await dataCollectionService.trackUserBehavior(user.user.uid, 'login', {
        method: 'email',
        timestamp: new Date().toISOString(),
      });

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
      const user = await signInWithPopup(auth, provider);
      setSuccess('🚀 Google login successful! Welcome to AIOS');

      // Collect comprehensive user data from Google
      await dataCollectionService.collectUserData(user.user, {
        fullName: user.user.displayName,
        loginMethod: 'google',
        rememberMe,
        darkMode,
        marketingConsent: true,
        googleProfile: {
          email: user.user.email,
          displayName: user.user.displayName,
          photoURL: user.user.photoURL,
        },
      });

      // Track login behavior
      await dataCollectionService.trackUserBehavior(user.user.uid, 'login', {
        method: 'google',
        timestamp: new Date().toISOString(),
      });

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
      const user = await signInAnonymously(auth);
      setSuccess('👤 Guest login successful! Welcome to AIOS');

      // Collect comprehensive user data for guest
      await dataCollectionService.collectUserData(user.user, {
        loginMethod: 'guest',
        rememberMe: false,
        darkMode,
        marketingConsent: false, // Guest users don't consent to marketing
        isGuest: true,
      });

      // Track login behavior
      await dataCollectionService.trackUserBehavior(user.user.uid, 'login', {
        method: 'guest',
        timestamp: new Date().toISOString(),
      });

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

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: darkMode
          ? 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%)'
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Enhanced animated background elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: darkMode
            ? 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.4) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.4) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(83, 52, 131, 0.2) 0%, transparent 70%)'
            : 'radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.15) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(102, 126, 234, 0.1) 0%, transparent 70%)',
          animation: 'float 8s ease-in-out infinite',
        }}
      />

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            width: 4,
            height: 4,
            borderRadius: '50%',
            background: darkMode
              ? 'rgba(255, 255, 255, 0.3)'
              : 'rgba(255, 255, 255, 0.6)',
            top: `${20 + i * 15}%`,
            left: `${10 + i * 15}%`,
            animation: `particleFloat ${3 + i * 0.5}s ease-in-out infinite`,
            animationDelay: `${i * 0.5}s`,
          }}
        />
      ))}

      {/* Enhanced System Status Bar */}
      <Paper
        elevation={0}
        sx={{
          position: 'absolute',
          top: 20,
          right: 20,
          display: 'flex',
          gap: 1,
          alignItems: 'center',
          p: 1,
          borderRadius: 3,
          background: darkMode
            ? 'rgba(0, 0, 0, 0.3)'
            : 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
          border: darkMode
            ? '1px solid rgba(255, 255, 255, 0.1)'
            : '1px solid rgba(255, 255, 255, 0.3)',
        }}
      >
        <Tooltip title='CPU Usage'>
          <Badge
            badgeContent={systemStatus.cpu > 80 ? '!' : ''}
            color='error'
            invisible={systemStatus.cpu <= 80}
          >
            <Chip
              icon={<SpeedIcon />}
              label={`${systemStatus.cpu}%`}
              size='small'
              color={
                systemStatus.cpu > 80
                  ? 'error'
                  : systemStatus.cpu > 60
                  ? 'warning'
                  : 'success'
              }
              variant='outlined'
              sx={{
                background: darkMode
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'rgba(255, 255, 255, 0.2)',
                color: darkMode ? 'white' : 'black',
              }}
            />
          </Badge>
        </Tooltip>
        <Tooltip title='Memory Usage'>
          <Badge
            badgeContent={systemStatus.memory > 80 ? '!' : ''}
            color='error'
            invisible={systemStatus.memory <= 80}
          >
            <Chip
              icon={<PsychologyIcon />}
              label={`${systemStatus.memory}%`}
              size='small'
              color={
                systemStatus.memory > 80
                  ? 'error'
                  : systemStatus.memory > 60
                  ? 'warning'
                  : 'success'
              }
              variant='outlined'
              sx={{
                background: darkMode
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'rgba(255, 255, 255, 0.2)',
                color: darkMode ? 'white' : 'black',
              }}
            />
          </Badge>
        </Tooltip>
        <Tooltip title='Network Status'>
          <Badge
            badgeContent={systemStatus.network > 80 ? '!' : ''}
            color='error'
            invisible={systemStatus.network <= 80}
          >
            <Chip
              icon={<WifiIcon />}
              label={`${systemStatus.network}%`}
              size='small'
              color={
                systemStatus.network > 80
                  ? 'error'
                  : systemStatus.network > 60
                  ? 'warning'
                  : 'success'
              }
              variant='outlined'
              sx={{
                background: darkMode
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'rgba(255, 255, 255, 0.2)',
                color: darkMode ? 'white' : 'black',
              }}
            />
          </Badge>
        </Tooltip>
        <Tooltip title='Battery Level'>
          <Badge
            badgeContent={systemStatus.battery < 20 ? '!' : ''}
            color='error'
            invisible={systemStatus.battery >= 20}
          >
            <Chip
              icon={<BatteryIcon />}
              label={`${systemStatus.battery}%`}
              size='small'
              color={
                systemStatus.battery > 80
                  ? 'success'
                  : systemStatus.battery > 20
                  ? 'warning'
                  : 'error'
              }
              variant='outlined'
              sx={{
                background: darkMode
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'rgba(255, 255, 255, 0.2)',
                color: darkMode ? 'white' : 'black',
              }}
            />
          </Badge>
        </Tooltip>
        <Divider orientation='vertical' flexItem sx={{ mx: 1 }} />
        <Tooltip
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          <IconButton
            onClick={() => setDarkMode(!darkMode)}
            sx={{
              color: darkMode ? 'white' : 'black',
              background: darkMode
                ? 'rgba(255, 255, 255, 0.1)'
                : 'rgba(255, 255, 255, 0.2)',
              '&:hover': {
                background: darkMode
                  ? 'rgba(255, 255, 255, 0.2)'
                  : 'rgba(255, 255, 255, 0.3)',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Tooltip>
      </Paper>

      <Container maxWidth='lg'>
        <Grid container spacing={4} alignItems='center'>
          {/* Features Section */}
          <Grid item xs={12} md={5}>
            <Fade in timeout={1200}>
              <Box sx={{ pr: { md: 4 } }}>
                <Typography
                  variant='h3'
                  component='h1'
                  sx={{
                    fontWeight: 'bold',
                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 2,
                    textAlign: { xs: 'center', md: 'left' },
                  }}
                >
                  Welcome to AIOS
                </Typography>
                <Typography
                  variant='h6'
                  sx={{
                    color: darkMode
                      ? 'rgba(255, 255, 255, 0.8)'
                      : 'rgba(0, 0, 0, 0.7)',
                    mb: 4,
                    textAlign: { xs: 'center', md: 'left' },
                  }}
                >
                  The Future of AI-Powered Operating Systems
                </Typography>
                <Grid container spacing={2}>
                  {features.map((feature, index) => (
                    <Grid item xs={6} key={index}>
                      <Fade in timeout={1400 + index * 200}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            textAlign: 'center',
                            background: darkMode
                              ? 'rgba(255, 255, 255, 0.05)'
                              : 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)',
                            border: darkMode
                              ? '1px solid rgba(255, 255, 255, 0.1)'
                              : '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: 2,
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: darkMode
                                ? '0 8px 25px rgba(0, 0, 0, 0.3)'
                                : '0 8px 25px rgba(0, 0, 0, 0.1)',
                            },
                            transition: 'all 0.3s ease',
                          }}
                        >
                          <Box
                            sx={{
                              color: darkMode ? 'white' : 'black',
                              mb: 1,
                            }}
                          >
                            {feature.icon}
                          </Box>
                          <Typography
                            variant='subtitle2'
                            sx={{
                              fontWeight: 'bold',
                              color: darkMode ? 'white' : 'black',
                            }}
                          >
                            {feature.title}
                          </Typography>
                          <Typography
                            variant='caption'
                            sx={{
                              color: darkMode
                                ? 'rgba(255, 255, 255, 0.7)'
                                : 'rgba(0, 0, 0, 0.6)',
                            }}
                          >
                            {feature.description}
                          </Typography>
                        </Paper>
                      </Fade>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Fade>
          </Grid>

          {/* Login Form Section */}
          <Grid item xs={12} md={7}>
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
                  {/* Enhanced Header */}
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
                            width: 70,
                            height: 70,
                            background:
                              'linear-gradient(45deg, #667eea, #764ba2)',
                            mr: 2,
                            boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                          }}
                        >
                          <RocketIcon sx={{ fontSize: 35 }} />
                        </Avatar>
                        <Typography
                          variant='h4'
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
                      </Box>
                    </Fade>

                    <Typography
                      variant='h6'
                      sx={{
                        color: darkMode
                          ? 'rgba(255, 255, 255, 0.9)'
                          : 'rgba(0, 0, 0, 0.7)',
                        mb: 1,
                        fontWeight: 500,
                      }}
                    >
                      {isLogin ? 'Welcome Back!' : 'Join AIOS Today'}
                    </Typography>

                    <Typography
                      variant='body2'
                      sx={{
                        color: darkMode
                          ? 'rgba(255, 255, 255, 0.7)'
                          : 'rgba(0, 0, 0, 0.6)',
                      }}
                    >
                      {isLogin
                        ? 'Sign in to access your AI-powered workspace'
                        : 'Create your account and unlock the future'}
                    </Typography>
                  </Box>

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
                          autoComplete: 'current-password',
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
                                sx={{
                                  color: darkMode
                                    ? 'rgba(255, 255, 255, 0.6)'
                                    : 'rgba(0, 0, 0, 0.6)',
                                }}
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
                            '&:hover': {
                              backgroundColor: darkMode
                                ? 'rgba(255, 255, 255, 0.08)'
                                : 'rgba(0, 0, 0, 0.04)',
                            },
                            '&.Mui-focused': {
                              backgroundColor: darkMode
                                ? 'rgba(255, 255, 255, 0.1)'
                                : 'rgba(0, 0, 0, 0.06)',
                            },
                          },
                        }}
                      />

                      {/* Remember Me */}
                      {isLogin && (
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <FormControlLabel
                            control={
                              <Switch
                                checked={rememberMe}
                                onChange={e => setRememberMe(e.target.checked)}
                                sx={{
                                  '& .MuiSwitch-switchBase.Mui-checked': {
                                    color: '#667eea',
                                  },
                                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track':
                                    {
                                      backgroundColor: '#667eea',
                                    },
                                }}
                              />
                            }
                            label={
                              <Typography
                                variant='body2'
                                sx={{
                                  color: darkMode
                                    ? 'rgba(255, 255, 255, 0.8)'
                                    : 'rgba(0, 0, 0, 0.7)',
                                }}
                              >
                                Remember me
                              </Typography>
                            }
                          />
                          <Button
                            variant='text'
                            size='small'
                            sx={{
                              color: darkMode
                                ? 'rgba(255, 255, 255, 0.8)'
                                : 'rgba(0, 0, 0, 0.7)',
                              textTransform: 'none',
                              '&:hover': {
                                backgroundColor: darkMode
                                  ? 'rgba(255, 255, 255, 0.1)'
                                  : 'rgba(0, 0, 0, 0.05)',
                              },
                            }}
                          >
                            Forgot password?
                          </Button>
                        </Box>
                      )}

                      {/* Enhanced Password Strength Indicator */}
                      {!isLogin && password && (
                        <Box>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mb: 1,
                            }}
                          >
                            <Typography
                              variant='body2'
                              sx={{
                                mr: 1,
                                color: darkMode
                                  ? 'rgba(255, 255, 255, 0.8)'
                                  : 'rgba(0, 0, 0, 0.7)',
                              }}
                            >
                              Password Strength:
                            </Typography>
                            <Chip
                              label={getPasswordStrengthText(passwordStrength)}
                              size='small'
                              color={getPasswordStrengthColor(passwordStrength)}
                              variant='outlined'
                              icon={
                                passwordStrength >= 75 ? (
                                  <CheckCircleIcon />
                                ) : passwordStrength >= 50 ? (
                                  <WarningIcon />
                                ) : passwordStrength >= 25 ? (
                                  <InfoIcon />
                                ) : (
                                  <ErrorIcon />
                                )
                              }
                              sx={{
                                background: darkMode
                                  ? 'rgba(255, 255, 255, 0.1)'
                                  : 'rgba(255, 255, 255, 0.2)',
                              }}
                            />
                          </Box>
                          <LinearProgress
                            variant='determinate'
                            value={passwordStrength}
                            color={getPasswordStrengthColor(passwordStrength)}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: darkMode
                                ? 'rgba(255, 255, 255, 0.1)'
                                : 'rgba(0, 0, 0, 0.1)',
                            }}
                          />
                        </Box>
                      )}

                      {/* Enhanced Submit Button */}
                      <Button
                        type='submit'
                        fullWidth
                        variant='contained'
                        size='large'
                        disabled={loading}
                        sx={{
                          py: 2,
                          borderRadius: 3,
                          background:
                            'linear-gradient(45deg, #667eea, #764ba2)',
                          fontSize: '1.1rem',
                          fontWeight: 600,
                          textTransform: 'none',
                          boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                          '&:hover': {
                            background:
                              'linear-gradient(45deg, #5a6fd8, #6a4190)',
                            transform: 'translateY(-3px)',
                            boxShadow: '0 12px 30px rgba(102, 126, 234, 0.4)',
                          },
                          '&:active': {
                            transform: 'translateY(-1px)',
                          },
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                      >
                        {loading ? (
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CircularProgress
                              size={24}
                              color='inherit'
                              sx={{ mr: 1 }}
                            />
                            {isLogin ? 'Signing In...' : 'Creating Account...'}
                          </Box>
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
                                Create Account
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
                          }}
                          sx={{
                            color: darkMode
                              ? 'rgba(255, 255, 255, 0.8)'
                              : 'rgba(0, 0, 0, 0.6)',
                            textTransform: 'none',
                          }}
                        >
                          {isLogin
                            ? "Don't have an account? Sign up"
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
                      OR
                    </Typography>
                  </Divider>

                  {/* Enhanced Social Login Buttons */}
                  <Stack spacing={2}>
                    <Button
                      fullWidth
                      variant='outlined'
                      size='large'
                      onClick={handleGoogleLogin}
                      disabled={loading}
                      startIcon={<GoogleIcon />}
                      sx={{
                        py: 1.8,
                        borderRadius: 3,
                        borderColor: darkMode
                          ? 'rgba(255, 255, 255, 0.3)'
                          : 'rgba(0, 0, 0, 0.2)',
                        color: darkMode ? 'white' : 'black',
                        fontSize: '1rem',
                        fontWeight: 500,
                        textTransform: 'none',
                        '&:hover': {
                          borderColor: darkMode
                            ? 'rgba(255, 255, 255, 0.6)'
                            : 'rgba(0, 0, 0, 0.4)',
                          backgroundColor: darkMode
                            ? 'rgba(255, 255, 255, 0.08)'
                            : 'rgba(0, 0, 0, 0.04)',
                          transform: 'translateY(-2px)',
                          boxShadow: darkMode
                            ? '0 8px 25px rgba(255, 255, 255, 0.1)'
                            : '0 8px 25px rgba(0, 0, 0, 0.1)',
                        },
                        transition: 'all 0.3s ease',
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
                        py: 1.8,
                        borderRadius: 3,
                        borderColor: darkMode
                          ? 'rgba(255, 255, 255, 0.3)'
                          : 'rgba(0, 0, 0, 0.2)',
                        color: darkMode ? 'white' : 'black',
                        fontSize: '1rem',
                        fontWeight: 500,
                        textTransform: 'none',
                        '&:hover': {
                          borderColor: darkMode
                            ? 'rgba(255, 255, 255, 0.6)'
                            : 'rgba(0, 0, 0, 0.4)',
                          backgroundColor: darkMode
                            ? 'rgba(255, 255, 255, 0.08)'
                            : 'rgba(0, 0, 0, 0.04)',
                          transform: 'translateY(-2px)',
                          boxShadow: darkMode
                            ? '0 8px 25px rgba(255, 255, 255, 0.1)'
                            : '0 8px 25px rgba(0, 0, 0, 0.1)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      Continue as Guest
                    </Button>
                  </Stack>

                  {/* Enhanced Footer */}
                  <Box sx={{ textAlign: 'center', mt: 4 }}>
                    <Typography
                      variant='body2'
                      sx={{
                        color: darkMode
                          ? 'rgba(255, 255, 255, 0.7)'
                          : 'rgba(0, 0, 0, 0.6)',
                        fontWeight: 500,
                      }}
                    >
                      Powered by Advanced AI Technology
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        mt: 1,
                        gap: 1,
                      }}
                    >
                      <Tooltip title='AI-Powered'>
                        <AutoAwesomeIcon
                          sx={{
                            fontSize: 18,
                            color: darkMode
                              ? 'rgba(255, 255, 255, 0.7)'
                              : 'rgba(0, 0, 0, 0.6)',
                          }}
                        />
                      </Tooltip>
                      <Tooltip title='Secure'>
                        <ShieldIcon
                          sx={{
                            fontSize: 18,
                            color: darkMode
                              ? 'rgba(255, 255, 255, 0.7)'
                              : 'rgba(0, 0, 0, 0.6)',
                          }}
                        />
                      </Tooltip>
                      <Tooltip title='Fast'>
                        <SpeedIcon
                          sx={{
                            fontSize: 18,
                            color: darkMode
                              ? 'rgba(255, 255, 255, 0.7)'
                              : 'rgba(0, 0, 0, 0.6)',
                          }}
                        />
                      </Tooltip>
                      <Tooltip title='Smart'>
                        <TrendingUpIcon
                          sx={{
                            fontSize: 18,
                            color: darkMode
                              ? 'rgba(255, 255, 255, 0.7)'
                              : 'rgba(0, 0, 0, 0.6)',
                          }}
                        />
                      </Tooltip>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>
        </Grid>
      </Container>

      {/* Enhanced CSS Animations */}
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

        @keyframes particleFloat {
          0%,
          100% {
            transform: translateY(0px) scale(1);
            opacity: 0.7;
          }
          50% {
            transform: translateY(-30px) scale(1.2);
            opacity: 1;
          }
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        .shimmer-effect {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
      `}</style>
    </Box>
  );
};

export default LoginPage;
