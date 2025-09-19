import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  ExpandMore as ExpandMoreIcon,
  Info as InfoIcon,
  Memory as MemoryIcon,
  Person as PersonIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useFirebase } from '../services/FirebaseService';

const DataAgentStatus = () => {
  const { dataAgent } = useFirebase();
  const [status, setStatus] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    if (!dataAgent) return;

    const updateStatus = () => {
      setStatus(dataAgent.getAuthStatus());
      setAnalytics(dataAgent.analytics);
    };

    // Initial update
    updateStatus();

    // Listen for auth state changes
    const handleAuthChange = () => {
      updateStatus();
    };

    window.addEventListener('dataAgentAuth', handleAuthChange);

    // Update every 5 seconds
    const interval = setInterval(updateStatus, 5000);

    return () => {
      window.removeEventListener('dataAgentAuth', handleAuthChange);
      clearInterval(interval);
    };
  }, [dataAgent]);

  if (!dataAgent || !status) {
    return (
      <Card>
        <CardContent>
          <Typography variant='h6'>DataAgent Status</Typography>
          <Typography color='text.secondary'>Loading...</Typography>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = () => {
    if (status.authenticated) return 'success';
    if (status.mockMode) return 'warning';
    return 'error';
  };

  const getStatusIcon = () => {
    if (status.authenticated) return <CheckCircleIcon />;
    if (status.mockMode) return <WarningIcon />;
    return <ErrorIcon />;
  };

  return (
    <Card>
      <CardContent>
        <Box display='flex' alignItems='center' mb={2}>
          <Typography variant='h6' component='h2' sx={{ flexGrow: 1 }}>
            DataAgent Status
          </Typography>
          <Chip
            icon={getStatusIcon()}
            label={status.authenticated ? 'Authenticated' : status.mockMode ? 'Mock Mode' : 'Error'}
            color={getStatusColor()}
            variant='outlined'
          />
        </Box>

        {/* Authentication Status */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box display='flex' alignItems='center'>
              <SecurityIcon sx={{ mr: 1 }} />
              <Typography>Authentication Status</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary='User ID' secondary={status.currentUser?.uid || 'Not authenticated'} />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <InfoIcon />
                </ListItemIcon>
                <ListItemText primary='Auth State Ready' secondary={status.authStateReady ? 'Yes' : 'No'} />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <WarningIcon />
                </ListItemIcon>
                <ListItemText primary='Permission Errors' secondary={status.permissionErrors || 0} />
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>

        {/* Performance Analytics */}
        {analytics && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box display='flex' alignItems='center'>
                <SpeedIcon sx={{ mr: 1 }} />
                <Typography>Performance Analytics</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box mb={2}>
                <Typography variant='subtitle2' gutterBottom>
                  Cache Performance
                </Typography>
                <Box display='flex' alignItems='center' mb={1}>
                  <Typography variant='body2' sx={{ minWidth: 100 }}>
                    Cache Hits: {analytics.cacheHits}
                  </Typography>
                  <LinearProgress
                    variant='determinate'
                    value={(analytics.cacheHits / (analytics.cacheHits + analytics.cacheMisses)) * 100}
                    sx={{ flexGrow: 1, ml: 2 }}
                  />
                </Box>
                <Typography variant='body2' color='text.secondary'>
                  Hit Rate:{' '}
                  {analytics.cacheHits + analytics.cacheMisses > 0
                    ? Math.round((analytics.cacheHits / (analytics.cacheHits + analytics.cacheMisses)) * 100)
                    : 0}
                  %
                </Typography>
              </Box>

              <List dense>
                <ListItem>
                  <ListItemText primary='API Calls' secondary={analytics.apiCalls} />
                </ListItem>
                <ListItem>
                  <ListItemText primary='Data Processed' secondary={analytics.dataProcessed} />
                </ListItem>
                <ListItem>
                  <ListItemText primary='AI Insights Generated' secondary={analytics.insightsGenerated} />
                </ListItem>
                <ListItem>
                  <ListItemText primary='Auth State Changes' secondary={analytics.authStateChanges} />
                </ListItem>
                <ListItem>
                  <ListItemText primary='Mock Mode Activations' secondary={analytics.mockModeActivations} />
                </ListItem>
                <ListItem>
                  <ListItemText primary='Retry Attempts' secondary={analytics.retryAttempts} />
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>
        )}

        {/* Cache Status */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box display='flex' alignItems='center'>
              <MemoryIcon sx={{ mr: 1 }} />
              <Typography>Cache Status</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant='body2' color='text.secondary'>
              Cache Size: {dataAgent.cache.size} entries
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Subscriptions: {dataAgent.subscriptions.size} active
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Cache Timeout: {dataAgent.cacheTimeout / 1000}s
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* Error Information */}
        {status.lastError && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box display='flex' alignItems='center'>
                <ErrorIcon sx={{ mr: 1 }} />
                <Typography>Last Error</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant='body2' color='error'>
                {status.lastError.message || 'Unknown error'}
              </Typography>
              {status.lastError.code && (
                <Typography variant='caption' color='text.secondary'>
                  Code: {status.lastError.code}
                </Typography>
              )}
            </AccordionDetails>
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
};

export default DataAgentStatus;
