import {
  AccountBalance,
  AccountCircle,
  Alarm as AlarmIcon,
  Analytics,
  Apps as AppsIcon,
  Assignment,
  AutoAwesome,
  CalendarToday,
  Chat,
  Dashboard as DashboardIcon,
  Email,
  Favorite,
  Folder,
  Lightbulb,
  Logout,
  Mic,
  Monitor,
  Note as NoteIcon,
  Notifications,
  PhoneAndroid,
  Psychology,
  School,
  Settings as SettingsIcon,
  SmartToy
} from '@mui/icons-material';
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  ThemeProvider,
  Toolbar,
  Typography
} from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import LiveChat from './components/LiveChat';
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AIAnalyticsDashboard from './pages/AIAnalyticsDashboard';
import AILearningLoop from './pages/AILearningLoop';
import AILearningRules from './pages/AILearningRules';
import AIPoweredAppsPage from './pages/AIPoweredAppsPage';
import AIPoweredDashboard from './pages/AIPoweredDashboard';
import AIPoweredLoginPage from './pages/AIPoweredLoginPage';
import AIPoweredSettingsPage from './pages/AIPoweredSettingsPage';
import AuthPage from './pages/AuthPage';
import DataAgentDashboard from './pages/DataAgentDashboard';
import MobileResponsivePage from './pages/MobileResponsivePage';
import OperatingSystemsList from './pages/OperatingSystemsList';
import PredictiveUIPage from './pages/PredictiveUIPage';
import RealTimeAgentMonitoringDashboard from './pages/RealTimeAgentMonitoringDashboard';
import SmartAlarmApp from './pages/SmartAlarmApp';
import SmartCalendarApp from './pages/SmartCalendarApp';
import SmartEmailApp from './pages/SmartEmailApp';
import SmartFileManagerApp from './pages/SmartFileManagerApp';
import SmartFinanceManagerApp from './pages/SmartFinanceManagerApp';
import SmartHealthMonitorApp from './pages/SmartHealthMonitorApp';
import SmartLearningAssistantApp from './pages/SmartLearningAssistantApp';
import SmartNotesApp from './pages/SmartNotesApp';
import SmartTaskManagerApp from './pages/SmartTaskManagerApp';
import VoiceUIPage from './pages/VoiceUIPage';
import { SocketProvider, SystemIntegrationProvider } from './services/AIOSIntegrationService';
import { FirebaseProvider } from './services/FirebaseService';
import { aiPoweredTheme } from './theme/aiPoweredTheme';

function AppContent() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const { user, userProfile, logout, isAuthenticated } = useAuth();

  const handleMenuOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleUserMenuOpen = event => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      handleUserMenuClose();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route
          path='/login'
          element={
            <PublicRoute>
              <AIPoweredLoginPage />
            </PublicRoute>
          }
        />
        <Route
          path='/auth'
          element={
            <PublicRoute>
              <AuthPage />
            </PublicRoute>
          }
        />
        <Route path='*' element={<Navigate to='/login' replace />} />
      </Routes>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
            AIOS - AI Operating System
          </Typography>

          {/* Navigation Menu */}
          <Button color='inherit' onClick={handleMenuOpen} sx={{ ml: 2 }} startIcon={<DashboardIcon />}>
            Navigation
          </Button>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={handleMenuClose}>
              <a
                href='/'
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <DashboardIcon sx={{ mr: 1 }} />
                Dashboard
              </a>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <a
                href='/apps'
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <AppsIcon sx={{ mr: 1 }} />
                Apps
              </a>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <a
                href='/live-chat'
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Chat sx={{ mr: 1 }} />
                Live Chat
              </a>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <a
                href='/data-agent'
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <SmartToy sx={{ mr: 1 }} />
                Data Agent
              </a>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <a
                href='/ai-learning'
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <AutoAwesome sx={{ mr: 1 }} />
                AI Learning Loop
              </a>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <a
                href='/ai-rules'
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Psychology sx={{ mr: 1 }} />
                AI Learning Rules
              </a>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <a
                href='/os-platform'
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <AppsIcon sx={{ mr: 1 }} />
                OS Platform
              </a>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <a
                href='/settings'
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <SettingsIcon sx={{ mr: 1 }} />
                Settings
              </a>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <a
                href='/monitoring'
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Monitor sx={{ mr: 1 }} />
                Agent Monitoring
              </a>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <a
                href='/voice'
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Mic sx={{ mr: 1 }} />
                Voice Interface
              </a>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <a
                href='/predictive'
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Lightbulb sx={{ mr: 1 }} />
                Predictive UI
              </a>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <a
                href='/mobile'
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <PhoneAndroid sx={{ mr: 1 }} />
                Mobile Interface
              </a>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <a
                href='/analytics'
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Analytics sx={{ mr: 1 }} />
                AI Analytics
              </a>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <a
                href='/smart-notes'
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <NoteIcon sx={{ mr: 1 }} />
                Smart Notes
              </a>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <a
                href='/smart-alarm'
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <AlarmIcon sx={{ mr: 1 }} />
                Smart Alarm
              </a>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <a
                href='/smart-calendar'
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <CalendarToday sx={{ mr: 1 }} />
                Smart Calendar
              </a>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <a
                href='/smart-file-manager'
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Folder sx={{ mr: 1 }} />
                Smart File Manager
              </a>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <a
                href='/smart-email'
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Email sx={{ mr: 1 }} />
                Smart Email
              </a>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <a
                href='/smart-task-manager'
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Assignment sx={{ mr: 1 }} />
                Smart Task Manager
              </a>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <a
                href='/smart-health'
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Favorite sx={{ mr: 1 }} />
                Smart Health Monitor
              </a>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <a
                href='/smart-finance'
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <AccountBalance sx={{ mr: 1 }} />
                Smart Finance Manager
              </a>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <a
                href='/smart-learning'
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <School sx={{ mr: 1 }} />
                Smart Learning Assistant
              </a>
            </MenuItem>
          </Menu>

          {/* Notifications */}
          <IconButton color='inherit' sx={{ ml: 2 }}>
            <Badge badgeContent={4} color='error'>
              <Notifications />
            </Badge>
          </IconButton>

          {/* User Menu */}
          <IconButton color='inherit' onClick={handleUserMenuOpen} sx={{ ml: 2 }}>
            <Avatar sx={{ width: 32, height: 32 }}>
              {userProfile?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </Avatar>
          </IconButton>
          <Menu anchorEl={userMenuAnchor} open={Boolean(userMenuAnchor)} onClose={handleUserMenuClose}>
            <MenuItem disabled>
              <Typography variant='body2' color='text.secondary'>
                {userProfile?.displayName || user?.email}
              </Typography>
            </MenuItem>
            <MenuItem onClick={handleUserMenuClose}>
              <AccountCircle sx={{ mr: 1 }} />
              Profile
            </MenuItem>
            <MenuItem onClick={handleUserMenuClose}>
              <SettingsIcon sx={{ mr: 1 }} />
              Settings
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <Logout sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
        <Routes>
          <Route
            path='/'
            element={
              <ProtectedRoute requiredRole='guest'>
                <AIPoweredDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path='/login'
            element={
              <PublicRoute>
                <AIPoweredLoginPage />
              </PublicRoute>
            }
          />
          <Route
            path='/auth'
            element={
              <PublicRoute>
                <AuthPage />
              </PublicRoute>
            }
          />
          <Route
            path='/apps'
            element={
              <ProtectedRoute requiredRole='guest'>
                <AIPoweredAppsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path='/live-chat'
            element={
              <ProtectedRoute requiredRole='guest'>
                <LiveChat />
              </ProtectedRoute>
            }
          />
          <Route
            path='/data-agent'
            element={
              <ProtectedRoute requiredRole='guest'>
                <DataAgentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path='/ai-learning'
            element={
              <ProtectedRoute requiredRole='guest'>
                <AILearningLoop />
              </ProtectedRoute>
            }
          />
          <Route
            path='/ai-rules'
            element={
              <ProtectedRoute requiredRole='guest'>
                <AILearningRules />
              </ProtectedRoute>
            }
          />
          <Route
            path='/os-platform'
            element={
              <ProtectedRoute requiredRole='guest'>
                <OperatingSystemsList />
              </ProtectedRoute>
            }
          />
          <Route
            path='/settings'
            element={
              <ProtectedRoute requiredRole='guest'>
                <AIPoweredSettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path='/monitoring'
            element={
              <ProtectedRoute requiredRole='guest'>
                <RealTimeAgentMonitoringDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path='/voice'
            element={
              <ProtectedRoute requiredRole='guest'>
                <VoiceUIPage />
              </ProtectedRoute>
            }
          />
          <Route
            path='/predictive'
            element={
              <ProtectedRoute requiredRole='guest'>
                <PredictiveUIPage />
              </ProtectedRoute>
            }
          />
          <Route
            path='/mobile'
            element={
              <ProtectedRoute requiredRole='guest'>
                <MobileResponsivePage />
              </ProtectedRoute>
            }
          />
          <Route
            path='/analytics'
            element={
              <ProtectedRoute requiredRole='guest'>
                <AIAnalyticsDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path='/smart-notes'
            element={
              <ProtectedRoute requiredRole='guest'>
                <SmartNotesApp />
              </ProtectedRoute>
            }
          />
          <Route
            path='/smart-alarm'
            element={
              <ProtectedRoute requiredRole='guest'>
                <SmartAlarmApp />
              </ProtectedRoute>
            }
          />
          <Route
            path='/smart-calendar'
            element={
              <ProtectedRoute requiredRole='guest'>
                <SmartCalendarApp />
              </ProtectedRoute>
            }
          />
          <Route
            path='/smart-file-manager'
            element={
              <ProtectedRoute requiredRole='guest'>
                <SmartFileManagerApp />
              </ProtectedRoute>
            }
          />
          <Route
            path='/smart-email'
            element={
              <ProtectedRoute requiredRole='guest'>
                <SmartEmailApp />
              </ProtectedRoute>
            }
          />
          <Route
            path='/smart-task-manager'
            element={
              <ProtectedRoute requiredRole='guest'>
                <SmartTaskManagerApp />
              </ProtectedRoute>
            }
          />
          <Route
            path='/smart-health'
            element={
              <ProtectedRoute requiredRole='guest'>
                <SmartHealthMonitorApp />
              </ProtectedRoute>
            }
          />
          <Route
            path='/smart-finance'
            element={
              <ProtectedRoute requiredRole='guest'>
                <SmartFinanceManagerApp />
              </ProtectedRoute>
            }
          />
          <Route
            path='/smart-learning'
            element={
              <ProtectedRoute requiredRole='guest'>
                <SmartLearningAssistantApp />
              </ProtectedRoute>
            }
          />
          <Route
            path='/auth'
            element={
              <PublicRoute>
                <AuthPage />
              </PublicRoute>
            }
          />
        </Routes>
      </Container>
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider theme={aiPoweredTheme}>
      <CssBaseline />
      <FirebaseProvider>
        <AuthProvider>
          <SocketProvider>
            <SystemIntegrationProvider>
              <AppContent />
            </SystemIntegrationProvider>
          </SocketProvider>
        </AuthProvider>
      </FirebaseProvider>
    </ThemeProvider>
  );
}

export default App;
