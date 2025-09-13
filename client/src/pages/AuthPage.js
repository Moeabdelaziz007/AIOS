import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Container,
  Card,
  CardContent,
  Divider,
  Link
} from '@mui/material';
import {
  Login,
  PersonAdd,
  SmartToy,
  AutoAwesome
} from '@mui/icons-material';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { auth } from '../services/FirebaseService';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
      } else {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      displayName: ''
    });
  };

    return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" gap={2} mb={2}>
          <SmartToy sx={{ fontSize: 48, color: 'primary.main' }} />
          <Typography variant="h3" component="h1" color="primary">
            AIOS
          </Typography>
        </Box>
        <Typography variant="h5" gutterBottom>
          AI Operating System
            </Typography>
        <Typography variant="body1" color="text.secondary">
          Join the live AI system and collaborate with others
            </Typography>
      </Box>

      <Card>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h4" gutterBottom>
              {isLogin ? 'Welcome Back' : 'Join AIOS'}
          </Typography>
            <Typography variant="body2" color="text.secondary">
              {isLogin 
                ? 'Sign in to access the live AI system' 
                : 'Create your account to start collaborating'
              }
          </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <TextField
                fullWidth
                label="Display Name"
                name="displayName"
                value={formData.displayName}
                onChange={handleInputChange}
                margin="normal"
                required={!isLogin}
              />
            )}
            
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              margin="normal"
              required
            />

            {!isLogin && (
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                margin="normal"
                required={!isLogin}
              />
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <Login />}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
            </Button>
          </form>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              OR
            </Typography>
          </Divider>

          <Button
            fullWidth
            variant="outlined"
            size="large"
            onClick={handleGoogleSignIn}
            disabled={loading}
            startIcon={<AutoAwesome />}
            sx={{ mb: 3 }}
          >
            Continue with Google
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <Link
                component="button"
                variant="body2"
                onClick={toggleMode}
                sx={{ textDecoration: 'none' }}
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="body2" color="text.secondary">
          By joining AIOS, you agree to our Terms of Service and Privacy Policy
        </Typography>
    </Box>
    </Container>
  );
};

export default AuthPage;