import { createTheme } from '@mui/material/styles';

// AIOS Design System - Unified Theme
export const aiosTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f57c00',
      light: '#ffb74d',
      dark: '#e65100',
      contrastText: '#ffffff',
    },
    success: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
    },
    error: {
      main: '#f44336',
      light: '#e57373',
      dark: '#d32f2f',
    },
    warning: {
      main: '#ff9800',
      light: '#ffb74d',
      dark: '#f57c00',
    },
    info: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
  },
  shape: {
    borderRadius: 12,
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transform: 'translateY(-2px)',
          },
          transition: 'all 0.3s ease-in-out',
        },
        contained: {
          background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
            transform: 'translateY(-4px)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#1976d2',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          fontWeight: 600,
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        },
      },
    },
  },
});

// Dark theme variant
export const aiosDarkTheme = createTheme({
  ...aiosTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: '#42a5f5',
      light: '#64b5f6',
      dark: '#1976d2',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ffb74d',
      light: '#ffcc80',
      dark: '#f57c00',
      contrastText: '#000000',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
    },
  },
});

// Color palette for different app categories
export const appCategoryColors = {
  core: '#1976d2',
  communication: '#f57c00',
  data: '#7b1fa2',
  security: '#d32f2f',
  optimization: '#00796b',
  devops: '#5d4037',
  analytics: '#303f9f',
  maintenance: '#795548',
  monitoring: '#ff5722',
  finance: '#4caf50',
  content: '#9c27b0',
  ai: '#e91e63',
  quantum: '#9c27b0',
  autopilot: '#00bcd4',
};

// Status colors
export const statusColors = {
  active: '#4caf50',
  inactive: '#9e9e9e',
  error: '#f44336',
  loading: '#2196f3',
  warning: '#ff9800',
};

// Gradient backgrounds
export const gradientBackgrounds = {
  primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  success: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  warning: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  error: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  info: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
};

// Animation presets
export const animations = {
  fadeIn: {
    animation: 'fadeIn 0.5s ease-in-out',
    '@keyframes fadeIn': {
      '0%': { opacity: 0, transform: 'translateY(20px)' },
      '100%': { opacity: 1, transform: 'translateY(0)' },
    },
  },
  slideIn: {
    animation: 'slideIn 0.3s ease-out',
    '@keyframes slideIn': {
      '0%': { transform: 'translateX(-100%)' },
      '100%': { transform: 'translateX(0)' },
    },
  },
  bounce: {
    animation: 'bounce 0.6s ease-in-out',
    '@keyframes bounce': {
      '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
      '40%': { transform: 'translateY(-10px)' },
      '60%': { transform: 'translateY(-5px)' },
    },
  },
  pulse: {
    animation: 'pulse 2s infinite',
    '@keyframes pulse': {
      '0%': { transform: 'scale(1)' },
      '50%': { transform: 'scale(1.05)' },
      '100%': { transform: 'scale(1)' },
    },
  },
};

// Common styles
export const commonStyles = {
  centerContent: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
  },
  cardHover: {
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
    },
  },
  glassEffect: {
    background: 'rgba(255, 255, 255, 0.25)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
  },
  gradientText: {
    background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  shadow: {
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  },
  shadowHover: {
    boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
  },
};

export default aiosTheme;
