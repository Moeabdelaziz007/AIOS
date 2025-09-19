import {
  Computer as DesktopIcon,
  PhoneAndroid as MobileIcon,
  TabletAndroid as TabletIcon,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import MobileResponsiveAIComponent from '../components/MobileResponsiveAIComponent';

const MobileResponsivePage = () => {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* Mobile Detection Alert */}
      <Box sx={{ p: 2 }}>
        <Alert
          severity='info'
          sx={{
            borderRadius: 2,
            '& .MuiAlert-message': {
              width: '100%',
            },
          }}
        >
          <Box
            display='flex'
            alignItems='center'
            justifyContent='space-between'
            width='100%'
          >
            <Box display='flex' alignItems='center' gap={2}>
              <MobileIcon color='primary' />
              <Typography variant='body2'>
                This interface automatically adapts to your device for optimal
                experience
              </Typography>
            </Box>
            <Chip
              label='Responsive'
              size='small'
              color='primary'
              variant='outlined'
            />
          </Box>
        </Alert>
      </Box>

      {/* Device-Specific Features */}
      <Container maxWidth='lg' sx={{ mb: 4 }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: 3,
          }}
        >
          <Typography
            variant='h4'
            component='h1'
            gutterBottom
            sx={{ fontWeight: 700 }}
          >
            📱 Mobile-Responsive AI Interface
          </Typography>
          <Typography variant='h6' sx={{ opacity: 0.9, mb: 3 }}>
            Experience AIOS optimized for your device with touch-friendly
            controls and gesture support
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Card sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <MobileIcon sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant='h6'>Mobile</Typography>
                  <Typography variant='body2' sx={{ opacity: 0.8 }}>
                    Touch-optimized interface with bottom navigation
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <TabletIcon sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant='h6'>Tablet</Typography>
                  <Typography variant='body2' sx={{ opacity: 0.8 }}>
                    Balanced layout with enhanced touch targets
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <DesktopIcon sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant='h6'>Desktop</Typography>
                  <Typography variant='body2' sx={{ opacity: 0.8 }}>
                    Full-featured interface with advanced controls
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      {/* Main Component */}
      <MobileResponsiveAIComponent />
    </Box>
  );
};

export default MobileResponsivePage;
