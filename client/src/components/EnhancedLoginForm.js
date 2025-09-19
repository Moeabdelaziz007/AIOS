import { Email, Google as GoogleIcon, Lock, Security, Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import googleAuthService from '../services/GoogleAuthService';

const EnhancedLoginForm = () => {
  const { loginWithGoogle, loading, user, userProfile } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);

  // Check Google Auth availability
  useEffect(() => {
    const checkGoogleAuth = async () => {
      try {
        const status = await googleAuthService.checkAvailability();
        if (!status.available) {
          console.warn('Google Auth not available:', status.message);
        }
      } catch (error) {
        console.error('Error checking Google Auth:', error);
      }
    };
    checkGoogleAuth();
  }, []);

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await loginWithGoogle();

      if (result) {
        setSuccess('🎉 Google login successful! Welcome to AIOS');

        // Get additional user profile information
        const profile = await googleAuthService.getUserProfile();
        console.log('User profile:', profile);

        // Navigate to dashboard after successful login
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1500);
      }
    } catch (error) {
      console.error('Google login error:', error);

      // Handle different types of errors
      if (error.code === 'POPUP_CLOSED') {
        setError('Login was cancelled. Please try again.');
      } else if (error.code === 'POPUP_BLOCKED') {
        setError('Popup was blocked by browser. Please allow popups and try again.');
      } else if (error.code === 'NETWORK_ERROR') {
        setError('Network error. Please check your internet connection and try again.');
      } else {
        setError(error.message || 'An error occurred during Google login. Please try again.');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleEmailLogin = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // This would typically use Firebase Auth
      setError('Email/password login is not yet implemented. Please use Google login.');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Card sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <CardContent sx={{ p: 4 }}>
        <Box textAlign='center' mb={3}>
          <Typography variant='h4' component='h1' gutterBottom>
            🚀 AIOS Login
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Sign in to access your AI-powered workspace
          </Typography>
        </Box>

        {error && (
          <Alert severity='error' sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity='success' sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {/* Google Login Button */}
        <Button
          fullWidth
          variant='contained'
          size='large'
          onClick={handleGoogleLogin}
          disabled={googleLoading || loading}
          startIcon={googleLoading ? <CircularProgress size={20} /> : <GoogleIcon />}
          sx={{
            mb: 3,
            py: 1.5,
            backgroundColor: '#4285f4',
            '&:hover': {
              backgroundColor: '#357ae8'
            },
            '&:disabled': {
              backgroundColor: '#e0e0e0'
            }
          }}
        >
          {googleLoading ? 'Signing in...' : 'Continue with Google'}
        </Button>

        <Divider sx={{ my: 3 }}>
          <Typography variant='body2' color='text.secondary'>
            OR
          </Typography>
        </Divider>

        {/* Email/Password Form */}
        <Box component='form' onSubmit={handleEmailLogin}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              label='Email Address'
              type='email'
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              inputProps={{
                autoComplete: 'email'
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Email color='action' />
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
              inputProps={{
                autoComplete: 'current-password'
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Lock color='action' />
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

            <Button
              type='submit'
              fullWidth
              variant='outlined'
              size='large'
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <Security />}
              sx={{ py: 1.5 }}
            >
              {loading ? 'Signing in...' : 'Sign In with Email'}
            </Button>
          </Stack>
        </Box>

        {/* User Profile Debug Info */}
        {userProfile && (
          <Box mt={3} p={2} sx={{ backgroundColor: 'grey.100', borderRadius: 1 }}>
            <Typography variant='caption' display='block' gutterBottom>
              Debug Info:
            </Typography>
            <Typography variant='caption' display='block'>
              User: {userProfile.displayName || 'Unknown'}
            </Typography>
            <Typography variant='caption' display='block'>
              Role: {userProfile.role || 'Unknown'}
            </Typography>
            <Typography variant='caption' display='block'>
              Email: {userProfile.email || 'Unknown'}
            </Typography>
          </Box>
        )}

        {/* Security Notice */}
        <Box mt={3} textAlign='center'>
          <Typography variant='caption' color='text.secondary'>
            🔒 Your data is protected with enterprise-grade security
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default EnhancedLoginForm;
