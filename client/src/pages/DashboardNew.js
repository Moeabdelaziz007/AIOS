import {
  Apps as AppsIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Memory as MemoryIcon,
  Notifications as NotificationsIcon,
  People as PeopleIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Storage as StorageIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import {
  Alert,
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material';
import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAIOSIntegration } from '../services/AIOSIntegrationService';
import { useFirebase } from '../services/FirebaseService';

const Dashboard = () => {
  const { loading: firebaseLoading } = useFirebase();
  const { user, userProfile } = useAuth();

  // Use the integration hook for all data
  const {
    apps,
    systemStatus,
    loading,
    error,
    isConnected,
    onlineUsers,
    notifications: liveNotifications,
    refreshAll,
    handleError: handleIntegrationError,
  } = useAIOSIntegration();

  // Refresh data on component mount
  useEffect(() => {
    if (user && userProfile && !firebaseLoading) {
      refreshAll();
    }
  }, [user, userProfile, firebaseLoading, refreshAll]);

  if (firebaseLoading || loading) {
    return (
      <Container maxWidth='lg' sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant='h6' sx={{ mt: 2 }}>
          جاري تحميل لوحة التحكم...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth='lg' sx={{ mt: 4 }}>
        <Alert severity='error' sx={{ mb: 3 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  const getStatusColor = status => {
    switch (status) {
      case 'active':
        return 'success';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = status => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon />;
      case 'warning':
        return <WarningIcon />;
      case 'error':
        return <ErrorIcon />;
      default:
        return <CheckCircleIcon />;
    }
  };

  return (
    <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant='h4' component='h1' gutterBottom>
          🚀 لوحة التحكم - AIOS
        </Typography>
        <Typography variant='subtitle1' color='text.secondary'>
          مرحباً {userProfile?.displayName || 'المستخدم'}، إليك نظرة عامة على
          النظام
        </Typography>
        <Box mt={2} display='flex' gap={2}>
          <Chip
            label={isConnected ? 'متصل' : 'غير متصل'}
            color={isConnected ? 'success' : 'error'}
            icon={isConnected ? <CheckCircleIcon /> : <ErrorIcon />}
          />
          <Chip
            label={`${apps?.length || 0} تطبيق`}
            color='primary'
            icon={<AppsIcon />}
          />
          <Chip
            label={`${onlineUsers?.length || 0} مستخدم`}
            color='info'
            icon={<PeopleIcon />}
          />
        </Box>
      </Box>

      {/* System Status Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display='flex' alignItems='center'>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <SpeedIcon />
                </Avatar>
                <Box>
                  <Typography variant='h6'>الأداء</Typography>
                  <Chip
                    label={systemStatus?.performance || 'جيد'}
                    color={getStatusColor(systemStatus?.performance)}
                    size='small'
                    icon={getStatusIcon(systemStatus?.performance)}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display='flex' alignItems='center'>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <MemoryIcon />
                </Avatar>
                <Box>
                  <Typography variant='h6'>الذاكرة</Typography>
                  <Chip
                    label={systemStatus?.memory || 'مستقر'}
                    color={getStatusColor(systemStatus?.memory)}
                    size='small'
                    icon={getStatusIcon(systemStatus?.memory)}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display='flex' alignItems='center'>
                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                  <StorageIcon />
                </Avatar>
                <Box>
                  <Typography variant='h6'>التخزين</Typography>
                  <Chip
                    label={systemStatus?.storage || 'متاح'}
                    color={getStatusColor(systemStatus?.storage)}
                    size='small'
                    icon={getStatusIcon(systemStatus?.storage)}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display='flex' alignItems='center'>
                <Avatar sx={{ bgcolor: 'error.main', mr: 2 }}>
                  <SecurityIcon />
                </Avatar>
                <Box>
                  <Typography variant='h6'>الأمان</Typography>
                  <Chip
                    label={systemStatus?.security || 'آمن'}
                    color={getStatusColor(systemStatus?.security)}
                    size='small'
                    icon={getStatusIcon(systemStatus?.security)}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Apps and Notifications */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                📱 التطبيقات المتاحة
              </Typography>
              <List>
                {apps?.slice(0, 5).map((app, index) => (
                  <React.Fragment key={app.id || index}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: app.color || 'primary.main' }}>
                          {app.icon || <AppsIcon />}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={app.name || `تطبيق ${index + 1}`}
                        secondary={app.description || 'وصف التطبيق'}
                      />
                      <Chip
                        label={app.status || 'نشط'}
                        color={getStatusColor(app.status)}
                        size='small'
                      />
                    </ListItem>
                    {index < 4 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                🔔 الإشعارات المباشرة
              </Typography>
              <List>
                {liveNotifications?.slice(0, 5).map((notification, index) => (
                  <React.Fragment key={notification.id || index}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'info.main' }}>
                          <NotificationsIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={notification.message || 'إشعار جديد'}
                        secondary={
                          notification.timestamp
                            ? new Date(notification.timestamp).toLocaleString()
                            : 'الآن'
                        }
                      />
                    </ListItem>
                    {index < 4 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Online Users */}
      {onlineUsers && onlineUsers.length > 0 && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant='h6' gutterBottom>
              👥 المستخدمون المتصلون
            </Typography>
            <Box display='flex' flexWrap='wrap' gap={1}>
              {onlineUsers.map((user, index) => (
                <Chip
                  key={user.id || index}
                  label={user.displayName || user.email || 'مستخدم'}
                  avatar={<Avatar>{user.displayName?.charAt(0) || 'U'}</Avatar>}
                  color='primary'
                  variant='outlined'
                />
              ))}
            </Box>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default Dashboard;
