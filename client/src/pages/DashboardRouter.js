import {
  AccountCircle,
  Analytics,
  BugReport,
  CloudSync,
  Dashboard as DashboardIcon,
  ExitToApp,
  Home,
  Menu as MenuIcon,
  MonitorHeart,
  Notifications,
  Security,
  Settings,
  TrendingUp
} from '@mui/icons-material';
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Chip,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography
} from '@mui/material';
import { useState } from 'react';

// Import dashboard components
import FullStackDashboard from './FullStackDashboard';
import RealTimeAnalyticsDashboard from './RealTimeAnalyticsDashboard';
import SystemMonitoringDashboard from './SystemMonitoringDashboard';

const DashboardRouter = () => {
  const [currentDashboard, setCurrentDashboard] = useState('overview');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications] = useState([
    { id: 1, message: 'System performance is optimal', type: 'info' },
    { id: 2, message: 'New user registered', type: 'success' },
    { id: 3, message: 'High CPU usage detected', type: 'warning' }
  ]);

  const dashboardItems = [
    {
      id: 'overview',
      title: 'Overview Dashboard',
      icon: <DashboardIcon />,
      component: FullStackDashboard,
      description: 'Complete system overview with real-time metrics'
    },
    {
      id: 'analytics',
      title: 'Analytics Dashboard',
      icon: <Analytics />,
      component: RealTimeAnalyticsDashboard,
      description: 'Real-time analytics and performance trends'
    },
    {
      id: 'monitoring',
      title: 'System Monitoring',
      icon: <MonitorHeart />,
      component: SystemMonitoringDashboard,
      description: 'Advanced system monitoring and alerts'
    }
  ];

  const quickActions = [
    { id: 'settings', title: 'Settings', icon: <Settings /> },
    { id: 'security', title: 'Security', icon: <Security /> },
    { id: 'backup', title: 'Backup', icon: <CloudSync /> },
    { id: 'debug', title: 'Debug', icon: <BugReport /> }
  ];

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleDashboardChange = dashboardId => {
    setCurrentDashboard(dashboardId);
    setDrawerOpen(false);
  };

  const handleProfileMenuOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Handle logout logic
    console.log('Logging out...');
    handleProfileMenuClose();
  };

  const renderDashboard = () => {
    const dashboard = dashboardItems.find(item => item.id === currentDashboard);
    if (dashboard) {
      const DashboardComponent = dashboard.component;
      return <DashboardComponent />;
    }
    return <FullStackDashboard />;
  };

  const drawerWidth = 280;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar
        position='fixed'
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'primary.main'
        }}
      >
        <Toolbar>
          <IconButton
            color='inherit'
            aria-label='open drawer'
            edge='start'
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant='h6' noWrap component='div' sx={{ flexGrow: 1 }}>
            AIOS Full-Stack Dashboards
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Notifications */}
            <Tooltip title='Notifications'>
              <IconButton color='inherit'>
                <Badge badgeContent={notifications.length} color='error'>
                  <Notifications />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Profile Menu */}
            <Tooltip title='Account'>
              <IconButton
                size='large'
                edge='end'
                aria-label='account of current user'
                aria-controls='primary-search-account-menu'
                aria-haspopup='true'
                onClick={handleProfileMenuOpen}
                color='inherit'
              >
                <AccountCircle />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
      >
        <MenuItem onClick={handleProfileMenuClose}>
          <ListItemIcon>
            <AccountCircle fontSize='small' />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={handleProfileMenuClose}>
          <ListItemIcon>
            <Settings fontSize='small' />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <ExitToApp fontSize='small' />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {/* Drawer */}
      <Box component='nav' sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }} aria-label='dashboard folders'>
        <Drawer
          variant='temporary'
          open={drawerOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
          }}
        >
          <DrawerContent />
        </Drawer>
        <Drawer
          variant='permanent'
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
          }}
          open
        >
          <DrawerContent />
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component='main'
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: '64px'
        }}
      >
        {renderDashboard()}
      </Box>
    </Box>
  );

  function DrawerContent() {
    return (
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
          <Box display='flex' alignItems='center' mb={2}>
            <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
              <Home />
            </Avatar>
            <Box>
              <Typography variant='h6'>AIOS Dashboards</Typography>
              <Typography variant='body2' color='primary.light'>
                Full-Stack Monitoring
              </Typography>
            </Box>
          </Box>
          <Chip label='Live' color='success' size='small' sx={{ bgcolor: 'success.main', color: 'white' }} />
        </Box>

        {/* Dashboard Navigation */}
        <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
          <List>
            <ListItem disablePadding>
              <ListItemText
                primary='Dashboards'
                sx={{ px: 2, py: 1 }}
                primaryTypographyProps={{
                  variant: 'subtitle2',
                  color: 'text.secondary',
                  fontWeight: 'bold'
                }}
              />
            </ListItem>
            {dashboardItems.map(item => (
              <ListItem key={item.id} disablePadding>
                <ListItemButton
                  selected={currentDashboard === item.id}
                  onClick={() => handleDashboardChange(item.id)}
                  sx={{
                    mx: 1,
                    borderRadius: 1,
                    '&.Mui-selected': {
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'primary.dark'
                      },
                      '& .MuiListItemIcon-root': {
                        color: 'white'
                      }
                    }
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText
                    primary={item.title}
                    secondary={item.description}
                    secondaryTypographyProps={{
                      variant: 'caption',
                      sx: {
                        color: currentDashboard === item.id ? 'rgba(255,255,255,0.7)' : 'text.secondary'
                      }
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 1 }} />

          {/* Quick Actions */}
          <List>
            <ListItem disablePadding>
              <ListItemText
                primary='Quick Actions'
                sx={{ px: 2, py: 1 }}
                primaryTypographyProps={{
                  variant: 'subtitle2',
                  color: 'text.secondary',
                  fontWeight: 'bold'
                }}
              />
            </ListItem>
            {quickActions.map(action => (
              <ListItem key={action.id} disablePadding>
                <ListItemButton
                  onClick={() => console.log(`Quick action: ${action.id}`)}
                  sx={{ mx: 1, borderRadius: 1 }}
                >
                  <ListItemIcon>{action.icon}</ListItemIcon>
                  <ListItemText primary={action.title} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Footer */}
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Box display='flex' alignItems='center' mb={1}>
            <TrendingUp color='success' sx={{ mr: 1, fontSize: 20 }} />
            <Typography variant='body2' color='success.main'>
              System Status: Optimal
            </Typography>
          </Box>
          <Typography variant='caption' color='text.secondary'>
            Last updated: {new Date().toLocaleTimeString()}
          </Typography>
        </Box>
      </Box>
    );
  }
};

export default DashboardRouter;
