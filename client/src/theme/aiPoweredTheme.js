import { createTheme } from '@mui/material/styles';

// AI-Powered Design System - "Powered by AI Agents"
export const aiPoweredTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6366f1', // AI Purple - Intelligence & Innovation
      light: '#8b5cf6',
      dark: '#4f46e5',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#06b6d4', // AI Cyan - Technology & Future
      light: '#22d3ee',
      dark: '#0891b2',
      contrastText: '#ffffff',
    },
    tertiary: {
      main: '#10b981', // AI Green - Success & Growth
      light: '#34d399',
      dark: '#059669',
      contrastText: '#ffffff',
    },
    accent: {
      main: '#f59e0b', // AI Amber - Energy & Action
      light: '#fbbf24',
      dark: '#d97706',
      contrastText: '#ffffff',
    },
    neural: {
      main: '#ec4899', // Neural Pink - AI Processing
      light: '#f472b6',
      dark: '#db2777',
      contrastText: '#ffffff',
    },
    quantum: {
      main: '#8b5cf6', // Quantum Purple - Advanced AI
      light: '#a78bfa',
      dark: '#7c3aed',
      contrastText: '#ffffff',
    },
    success: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
    },
    info: {
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#2563eb',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
      neural: '#f1f5f9',
      quantum: '#f8fafc',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
      neural: '#475569',
    },
    divider: '#e2e8f0',
  },
  typography: {
    fontFamily: '"Inter", "SF Pro Display", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '3rem',
      fontWeight: 700,
      lineHeight: 1.1,
      letterSpacing: '-0.025em',
      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    h2: {
      fontSize: '2.25rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.025em',
    },
    h3: {
      fontSize: '1.875rem',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.025em',
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
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.7,
      color: '#475569',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      color: '#64748b',
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.6,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.5,
      color: '#94a3b8',
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 600,
      lineHeight: 1.5,
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
    },
  },
  shape: {
    borderRadius: 16,
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          padding: '12px 24px',
          fontSize: '0.875rem',
          boxShadow: 'none',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            boxShadow: '0 8px 25px rgba(99, 102, 241, 0.3)',
            transform: 'translateY(-2px)',
          },
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        contained: {
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
            transition: 'left 0.5s',
          },
          '&:hover::before': {
            left: '100%',
          },
        },
        outlined: {
          borderWidth: 2,
          borderColor: '#6366f1',
          color: '#6366f1',
          '&:hover': {
            borderWidth: 2,
            backgroundColor: 'rgba(99, 102, 241, 0.04)',
          },
        },
        text: {
          color: '#6366f1',
          '&:hover': {
            backgroundColor: 'rgba(99, 102, 241, 0.04)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            transform: 'translateY(-4px)',
            borderColor: 'rgba(99, 102, 241, 0.3)',
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899)',
            opacity: 0,
            transition: 'opacity 0.3s ease',
          },
          '&:hover::before': {
            opacity: 1,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          border: '1px solid rgba(226, 232, 240, 0.8)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: '#f8fafc',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#6366f1',
              borderWidth: 2,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderWidth: 2,
              borderColor: '#6366f1',
            },
            '&.Mui-focused': {
              backgroundColor: '#ffffff',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          fontWeight: 500,
          fontSize: '0.75rem',
          height: 32,
          '&.MuiChip-filled': {
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            color: '#ffffff',
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)',
          border: '2px solid rgba(99, 102, 241, 0.1)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(226, 232, 240, 0.8)',
        },
      },
    },
  },
});

// AI Agent Color Palette
export const aiAgentColors = {
  primary: '#6366f1', // AI Purple
  secondary: '#06b6d4', // AI Cyan
  tertiary: '#10b981', // AI Green
  accent: '#f59e0b', // AI Amber
  neural: '#ec4899', // Neural Pink
  quantum: '#8b5cf6', // Quantum Purple
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
};

// AI-Powered Gradients
export const aiGradients = {
  primary: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  secondary: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
  neural: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
  quantum: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
  success: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
  warning: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
  error: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)',
  rainbow: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 25%, #ec4899 50%, #f59e0b 75%, #10b981 100%)',
  glass: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
};

// AI Agent Status Colors
export const aiStatusColors = {
  active: '#10b981',
  processing: '#3b82f6',
  learning: '#8b5cf6',
  optimizing: '#f59e0b',
  error: '#ef4444',
  offline: '#64748b',
  quantum: '#8b5cf6',
  neural: '#ec4899',
};

// AI-Powered Animations
export const aiAnimations = {
  neuralPulse: {
    animation: 'neuralPulse 2s ease-in-out infinite',
    '@keyframes neuralPulse': {
      '0%, 100%': { 
        transform: 'scale(1)',
        boxShadow: '0 0 0 0 rgba(99, 102, 241, 0.4)'
      },
      '50%': { 
        transform: 'scale(1.05)',
        boxShadow: '0 0 0 10px rgba(99, 102, 241, 0)'
      },
    },
  },
  quantumFloat: {
    animation: 'quantumFloat 3s ease-in-out infinite',
    '@keyframes quantumFloat': {
      '0%, 100%': { transform: 'translateY(0px)' },
      '50%': { transform: 'translateY(-10px)' },
    },
  },
  aiGlow: {
    animation: 'aiGlow 2s ease-in-out infinite alternate',
    '@keyframes aiGlow': {
      '0%': { 
        boxShadow: '0 0 5px rgba(99, 102, 241, 0.5)',
        borderColor: 'rgba(99, 102, 241, 0.3)'
      },
      '100%': { 
        boxShadow: '0 0 20px rgba(99, 102, 241, 0.8)',
        borderColor: 'rgba(99, 102, 241, 0.6)'
      },
    },
  },
  neuralFlow: {
    animation: 'neuralFlow 4s linear infinite',
    '@keyframes neuralFlow': {
      '0%': { backgroundPosition: '0% 50%' },
      '50%': { backgroundPosition: '100% 50%' },
      '100%': { backgroundPosition: '0% 50%' },
    },
  },
  smartSlide: {
    animation: 'smartSlide 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    '@keyframes smartSlide': {
      '0%': { 
        opacity: 0,
        transform: 'translateY(20px) scale(0.95)'
      },
      '100%': { 
        opacity: 1,
        transform: 'translateY(0) scale(1)'
      },
    },
  },
  aiRotate: {
    animation: 'aiRotate 2s linear infinite',
    '@keyframes aiRotate': {
      '0%': { transform: 'rotate(0deg)' },
      '100%': { transform: 'rotate(360deg)' },
    },
  },
};

// AI-Powered Common Styles
export const aiStyles = {
  glassMorphism: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  },
  neuralBorder: {
    border: '2px solid transparent',
    background: 'linear-gradient(white, white) padding-box, linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899) border-box',
  },
  aiGradientText: {
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  quantumShadow: {
    boxShadow: '0 10px 40px rgba(99, 102, 241, 0.2), 0 0 0 1px rgba(99, 102, 241, 0.1)',
  },
  neuralGlow: {
    boxShadow: '0 0 20px rgba(99, 102, 241, 0.3), 0 0 40px rgba(99, 102, 241, 0.1)',
  },
  smartHover: {
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      transform: 'translateY(-4px) scale(1.02)',
      boxShadow: '0 20px 40px rgba(99, 102, 241, 0.2)',
    },
  },
  aiCard: {
    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: 20,
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '2px',
      background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899)',
    },
  },
  poweredByAI: {
    position: 'relative',
    '&::after': {
      content: '"Powered by AI Agents"',
      position: 'absolute',
      bottom: -20,
      right: 0,
      fontSize: '0.75rem',
      color: '#94a3b8',
      fontWeight: 500,
      letterSpacing: '0.05em',
    },
  },
};

// Dark Theme Variant
export const aiPoweredDarkTheme = createTheme({
  ...aiPoweredTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: '#8b5cf6',
      light: '#a78bfa',
      dark: '#7c3aed',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#22d3ee',
      light: '#67e8f9',
      dark: '#0891b2',
      contrastText: '#000000',
    },
    background: {
      default: '#0f172a',
      paper: '#1e293b',
      neural: '#334155',
      quantum: '#1e293b',
    },
    text: {
      primary: '#f1f5f9',
      secondary: '#cbd5e1',
      neural: '#94a3b8',
    },
    divider: '#334155',
  },
  components: {
    ...aiPoweredTheme.components,
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(51, 65, 85, 0.8)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(51, 65, 85, 0.8)',
        },
      },
    },
  },
});

export default aiPoweredTheme;


