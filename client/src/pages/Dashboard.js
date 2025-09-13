import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  CircularProgress,
  Alert,
  Chip,
  Button
} from '@mui/material';
import { Refresh, Apps, CheckCircle, Error } from '@mui/icons-material';
import { useFirebase } from '../services/FirebaseService';
import { systemAPI, appsAPI, handleAPIError } from '../services/api';

const Dashboard = () => {
  const { loading: firebaseLoading } = useFirebase();
  const [systemStatus, setSystemStatus] = useState(null);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch system status and apps in parallel
      const [statusResponse, appsResponse] = await Promise.all([
        systemAPI.getStatus(),
        appsAPI.getAll()
      ]);
      
      setSystemStatus(statusResponse);
      setApps(appsResponse.apps);
    } catch (err) {
      const errorInfo = handleAPIError(err);
      setError(errorInfo.message);
      console.error('Dashboard data fetch error:', errorInfo);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!firebaseLoading) {
      fetchDashboardData();
    }
  }, [firebaseLoading]);

  const handleRefresh = () => {
    fetchDashboardData();
  };

  if (firebaseLoading || loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading AIOS Dashboard...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          startIcon={<Refresh />} 
          onClick={handleRefresh}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
      <Typography variant="h4" gutterBottom>
        AIOS Dashboard
      </Typography>
        <Button 
          variant="outlined" 
          startIcon={<Refresh />} 
          onClick={handleRefresh}
        >
          Refresh
        </Button>
      </Box>
      
      <Grid container spacing={3}>
        {/* Total Apps Card */}
        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Apps color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Total Apps
              </Typography>
              </Box>
              <Typography variant="h2" color="primary">
                {systemStatus?.totalApps || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {apps.length} apps available
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Active Apps Card */}
        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <CheckCircle color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Active Apps
                </Typography>
              </Box>
              <Typography variant="h2" color="success.main">
                {systemStatus?.activeApps || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Currently running
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        {/* System Status Card */}
        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <CheckCircle color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  System Status
                </Typography>
              </Box>
              <Chip 
                label={systemStatus?.status || 'Unknown'} 
                color="success" 
                variant="outlined"
                sx={{ mb: 1 }}
              />
              <Typography variant="body2" color="text.secondary">
                Last updated: {systemStatus?.timestamp ? 
                  new Date(systemStatus.timestamp).toLocaleTimeString() : 
                  'Never'
                }
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Firebase Connection Card */}
        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <CheckCircle color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Firebase Connected
                </Typography>
              </Box>
              <Chip 
                label="✓ Connected" 
                color="success" 
                variant="outlined"
                sx={{ mb: 1 }}
              />
              <Typography variant="body2" color="text.secondary">
                Database and Auth ready
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Apps */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Apps
              </Typography>
              {apps.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No apps available. Create your first app to get started.
                </Typography>
              ) : (
                <Grid container spacing={2}>
                  {apps.slice(0, 6).map((app) => (
                    <Grid item xs={12} sm={6} md={4} key={app.id}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="h6" noWrap>
                            {app.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {app.description}
                          </Typography>
                          <Box mt={1}>
                            <Chip 
                              label={app.status} 
                              size="small"
                              color={app.status === 'active' ? 'success' : 'default'}
                            />
                            <Chip 
                              label={app.category} 
                              size="small"
                              variant="outlined"
                              sx={{ ml: 1 }}
                            />
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
