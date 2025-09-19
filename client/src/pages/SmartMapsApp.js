import {
  Psychology as AIIcon,
  Add as AddIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Home as HomeIcon,
  Label as LabelIcon,
  LocalAirport as LocalAirportIcon,
  LocalHospital as LocalHospitalIcon,
  LocalMovies as LocalMoviesIcon,
  Lock as LockIcon,
  Map as MapIcon,
  MyLocation as MyLocationIcon,
  Navigation as NavigationIcon,
  Restaurant as RestaurantIcon,
  Search as SearchIcon,
  Settings as SettingsIcon,
  Star as StarIcon,
  Store as StoreIcon,
  Sync as SyncIcon,
  Work as WorkIcon,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Switch,
  TextField,
  Tooltip,
  Typography,
  Zoom,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useFirebase } from '../services/FirebaseService';
import { animations, commonStyles } from '../theme/aiosTheme';

const SmartMapsApp = () => {
  const { userProfile } = useAuth();
  const { db, auth } = useFirebase();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('distance');
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [locationAddress, setLocationAddress] = useState('');
  const [locationCategory, setLocationCategory] = useState('general');
  const [locationTags, setLocationTags] = useState([]);
  const [locationNotes, setLocationNotes] = useState('');
  const [locationIsFavorite, setLocationIsFavorite] = useState(false);
  const [locationIsPrivate, setLocationIsPrivate] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [voiceRecording, setVoiceRecording] = useState(false);
  const [aiProcessing, setAiProcessing] = useState(false);
  const [syncStatus, setSyncStatus] = useState('synced');
  const [currentLocation, setCurrentLocation] = useState(null);
  const [navigationMode, setNavigationMode] = useState(false);
  const [routeInfo, setRouteInfo] = useState(null);
  const [trafficInfo, setTrafficInfo] = useState(null);
  const [weatherInfo, setWeatherInfo] = useState(null);

  // Location categories
  const categories = [
    { id: 'all', name: 'All Locations', icon: <MapIcon />, color: '#667eea' },
    { id: 'work', name: 'Work', icon: <WorkIcon />, color: '#43e97b' },
    { id: 'home', name: 'Home', icon: <HomeIcon />, color: '#fa709a' },
    {
      id: 'restaurant',
      name: 'Restaurants',
      icon: <RestaurantIcon />,
      color: '#f093fb',
    },
    { id: 'shopping', name: 'Shopping', icon: <StoreIcon />, color: '#4facfe' },
    {
      id: 'entertainment',
      name: 'Entertainment',
      icon: <LocalMoviesIcon />,
      color: '#a8edea',
    },
    {
      id: 'health',
      name: 'Health',
      icon: <LocalHospitalIcon />,
      color: '#ffd89b',
    },
    {
      id: 'travel',
      name: 'Travel',
      icon: <LocalAirportIcon />,
      color: '#ff9a9e',
    },
  ];

  // Initialize locations from Firebase
  const initializeLocations = useCallback(async () => {
    if (!db || !auth?.currentUser) return;

    try {
      setLoading(true);
      const locationsRef = db
        .collection('locations')
        .where('userId', '==', auth.currentUser.uid);
      const snapshot = await locationsRef.get();

      const locationsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      }));

      setLocations(locationsData);
      setFilteredLocations(locationsData);
    } catch (error) {
      console.error('Error loading locations:', error);
    } finally {
      setLoading(false);
    }
  }, [db, auth]);

  // Save location to Firebase
  const saveLocation = useCallback(
    async locationData => {
      if (!db || !auth?.currentUser) return;

      try {
        setSyncStatus('syncing');
        const now = new Date();

        if (selectedLocation) {
          // Update existing location
          await db
            .collection('locations')
            .doc(selectedLocation.id)
            .update({
              ...locationData,
              updatedAt: now,
            });
        } else {
          // Create new location
          await db.collection('locations').add({
            ...locationData,
            userId: auth.currentUser.uid,
            createdAt: now,
            updatedAt: now,
          });
        }

        await initializeLocations();
        setSyncStatus('synced');
      } catch (error) {
        console.error('Error saving location:', error);
        setSyncStatus('error');
      }
    },
    [db, auth, selectedLocation, initializeLocations]
  );

  // Delete location from Firebase
  const deleteLocation = useCallback(
    async locationId => {
      if (!db) return;

      try {
        setSyncStatus('syncing');
        await db.collection('locations').doc(locationId).delete();
        await initializeLocations();
        setSyncStatus('synced');
      } catch (error) {
        console.error('Error deleting location:', error);
        setSyncStatus('error');
      }
    },
    [db, initializeLocations]
  );

  // AI-powered location suggestions
  const generateAISuggestions = useCallback(async locationData => {
    try {
      setAiProcessing(true);

      // Simulate AI processing (replace with actual AI service)
      const suggestions = [
        {
          type: 'route',
          content: 'Optimal route found: 15 minutes via Main Street',
          confidence: 92,
        },
        {
          type: 'traffic',
          content: 'Traffic is light - no delays expected',
          confidence: 87,
        },
        {
          type: 'weather',
          content: 'Sunny weather - perfect for outdoor activities',
          confidence: 95,
        },
        {
          type: 'nearby',
          content: 'Nearby: Coffee shop (2 min walk), Parking garage (1 min)',
          confidence: 78,
        },
      ];

      setAiSuggestions(suggestions);
    } catch (error) {
      console.error('Error generating AI suggestions:', error);
    } finally {
      setAiProcessing(false);
    }
  }, []);

  // Get current location
  const getCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        error => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  // Start navigation
  const startNavigation = useCallback(destination => {
    setNavigationMode(true);
    setRouteInfo({
      destination,
      distance: '5.2 km',
      duration: '15 minutes',
      steps: [
        'Head north on Main Street',
        'Turn right onto Oak Avenue',
        'Continue for 2.3 km',
        'Turn left onto Destination Road',
      ],
    });
  }, []);

  // Filter and search locations
  const filterLocations = useCallback(() => {
    let filtered = locations;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(
        location => location.category === selectedCategory
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        location =>
          location.name.toLowerCase().includes(query) ||
          location.address.toLowerCase().includes(query) ||
          location.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Sort locations
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          return (a.distance || 0) - (b.distance || 0);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'created':
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

    setFilteredLocations(filtered);
  }, [locations, selectedCategory, searchQuery, sortBy]);

  // Handle location operations
  const handleCreateLocation = () => {
    setSelectedLocation(null);
    setLocationName('');
    setLocationAddress('');
    setLocationCategory('general');
    setLocationTags([]);
    setLocationNotes('');
    setLocationIsFavorite(false);
    setLocationIsPrivate(false);
    setLocationDialogOpen(true);
  };

  const handleEditLocation = location => {
    setSelectedLocation(location);
    setLocationName(location.name);
    setLocationAddress(location.address);
    setLocationCategory(location.category);
    setLocationTags(location.tags || []);
    setLocationNotes(location.notes || '');
    setLocationIsFavorite(location.isFavorite || false);
    setLocationIsPrivate(location.isPrivate || false);
    setLocationDialogOpen(true);
  };

  const handleSaveLocation = async () => {
    const locationData = {
      name: locationName,
      address: locationAddress,
      category: locationCategory,
      tags: locationTags,
      notes: locationNotes,
      isFavorite: locationIsFavorite,
      isPrivate: locationIsPrivate,
    };

    await saveLocation(locationData);
    setLocationDialogOpen(false);
  };

  const handleDeleteLocation = async locationId => {
    if (window.confirm('Are you sure you want to delete this location?')) {
      await deleteLocation(locationId);
    }
  };

  const handleToggleFavorite = async location => {
    const updatedLocation = { ...location, isFavorite: !location.isFavorite };
    await saveLocation(updatedLocation);
  };

  // Initialize app
  useEffect(() => {
    initializeLocations();
    getCurrentLocation();
  }, [initializeLocations, getCurrentLocation]);

  // Filter locations when dependencies change
  useEffect(() => {
    filterLocations();
  }, [filterLocations]);

  // Generate AI suggestions when location data changes
  useEffect(() => {
    if (locationName && locationAddress) {
      generateAISuggestions({ name: locationName, address: locationAddress });
    }
  }, [locationName, locationAddress, generateAISuggestions]);

  if (loading) {
    return (
      <Container
        maxWidth='lg'
        sx={{ ...commonStyles.centerContent, flexDirection: 'column' }}
      >
        <CircularProgress size={80} thickness={4} />
        <Typography variant='h5' sx={{ mt: 3, ...commonStyles.gradientText }}>
          Loading Smart Maps...
        </Typography>
        <Typography variant='body1' color='text.secondary' sx={{ mt: 1 }}>
          Syncing with AI-powered navigation
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 3,
          ...animations.fadeIn,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            animation: 'pulse 4s ease-in-out infinite',
          }}
        />

        <Box
          display='flex'
          justifyContent='space-between'
          alignItems='center'
          position='relative'
          zIndex={1}
        >
          <Box>
            <Typography
              variant='h3'
              component='h1'
              gutterBottom
              sx={{
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <MapIcon sx={{ fontSize: '2.5rem' }} />
              Smart Maps
            </Typography>
            <Typography variant='h6' sx={{ opacity: 0.9, mb: 3 }}>
              AI-powered navigation with intelligent route optimization and
              real-time updates
            </Typography>
            <Box display='flex' gap={1} flexWrap='wrap'>
              <Chip
                icon={<MapIcon />}
                label={`${locations.length} Locations`}
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
              <Chip
                icon={<AIIcon />}
                label='AI-Powered'
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
              <Chip
                icon={<SyncIcon />}
                label={syncStatus}
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
            </Box>
          </Box>
          <Box display='flex' gap={1}>
            <Tooltip title='Sync Locations'>
              <IconButton
                onClick={initializeLocations}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                }}
              >
                <SyncIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title='Settings'>
              <IconButton
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                }}
              >
                <SettingsIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Paper>

      {/* Current Location Display */}
      {currentLocation && (
        <Paper
          elevation={2}
          sx={{ p: 3, mb: 3, borderRadius: 3, textAlign: 'center' }}
        >
          <Typography variant='h6' sx={{ ...commonStyles.gradientText, mb: 1 }}>
            📍 Current Location
          </Typography>
          <Typography variant='body1' color='text.secondary'>
            Lat: {currentLocation.lat.toFixed(6)}, Lng:{' '}
            {currentLocation.lng.toFixed(6)}
          </Typography>
        </Paper>
      )}

      {/* Navigation Mode */}
      {navigationMode && (
        <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
          <Box
            display='flex'
            justifyContent='space-between'
            alignItems='center'
            mb={2}
          >
            <Typography variant='h6' sx={{ ...commonStyles.gradientText }}>
              🧭 Navigation Active
            </Typography>
            <Button variant='outlined' onClick={() => setNavigationMode(false)}>
              Stop Navigation
            </Button>
          </Box>
          {routeInfo && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Typography variant='body2' color='text.secondary'>
                  Distance: {routeInfo.distance}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant='body2' color='text.secondary'>
                  Duration: {routeInfo.duration}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant='body2' color='text.secondary'>
                  Steps: {routeInfo.steps.length}
                </Typography>
              </Grid>
            </Grid>
          )}
        </Paper>
      )}

      {/* Search and Filter Bar */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
        <Grid container spacing={2} alignItems='center'>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder='Search locations...'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <MenuItem key={category.id} value={category.id}>
                    <Box display='flex' alignItems='center' gap={1}>
                      {category.icon}
                      {category.name}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <MenuItem value='distance'>Distance</MenuItem>
                <MenuItem value='name'>Name</MenuItem>
                <MenuItem value='created'>Created</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Locations List */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ borderRadius: 3 }}>
            <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
              <Box
                display='flex'
                justifyContent='space-between'
                alignItems='center'
              >
                <Typography variant='h6' sx={{ ...commonStyles.gradientText }}>
                  🗺️ Your Locations ({filteredLocations.length})
                </Typography>
                <Button
                  variant='contained'
                  startIcon={<AddIcon />}
                  onClick={handleCreateLocation}
                  sx={{ borderRadius: 2 }}
                >
                  New Location
                </Button>
              </Box>
            </Box>

            <Box sx={{ p: 2 }}>
              {filteredLocations.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <MapIcon
                    sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }}
                  />
                  <Typography variant='h6' color='text.secondary'>
                    No locations found
                  </Typography>
                  <Typography
                    variant='body2'
                    color='text.secondary'
                    sx={{ mb: 3 }}
                  >
                    Create your first AI-powered location
                  </Typography>
                  <Button
                    variant='contained'
                    startIcon={<AddIcon />}
                    onClick={handleCreateLocation}
                  >
                    Create Location
                  </Button>
                </Box>
              ) : (
                <Grid container spacing={2}>
                  {filteredLocations.map((location, index) => (
                    <Grid item xs={12} sm={6} lg={4} key={location.id}>
                      <Zoom in timeout={300 + index * 100}>
                        <Card
                          sx={{
                            height: '100%',
                            ...commonStyles.cardHover,
                            cursor: 'pointer',
                          }}
                          onClick={() => handleEditLocation(location)}
                        >
                          <CardContent>
                            <Box
                              display='flex'
                              justifyContent='space-between'
                              alignItems='start'
                              mb={2}
                            >
                              <Typography
                                variant='h6'
                                sx={{ fontWeight: 600, flexGrow: 1 }}
                              >
                                {location.name}
                              </Typography>
                              <Box display='flex' gap={1}>
                                <IconButton
                                  size='small'
                                  onClick={e => {
                                    e.stopPropagation();
                                    handleToggleFavorite(location);
                                  }}
                                >
                                  <StarIcon
                                    fontSize='small'
                                    color={
                                      location.isFavorite ? 'warning' : 'action'
                                    }
                                  />
                                </IconButton>
                                {location.isPrivate && (
                                  <LockIcon fontSize='small' color='action' />
                                )}
                              </Box>
                            </Box>

                            <Typography
                              variant='body2'
                              color='text.secondary'
                              sx={{
                                mb: 2,
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                              }}
                            >
                              {location.address}
                            </Typography>

                            <Box display='flex' gap={1} flexWrap='wrap' mb={2}>
                              {location.tags?.map((tag, tagIndex) => (
                                <Chip
                                  key={tagIndex}
                                  label={tag}
                                  size='small'
                                  variant='outlined'
                                  icon={<LabelIcon />}
                                />
                              ))}
                            </Box>

                            <Box
                              display='flex'
                              justifyContent='space-between'
                              alignItems='center'
                            >
                              <Typography
                                variant='caption'
                                color='text.secondary'
                              >
                                {location.distance
                                  ? `${location.distance} km`
                                  : 'Unknown distance'}
                              </Typography>
                              <Box display='flex' gap={1}>
                                <IconButton
                                  size='small'
                                  onClick={e => {
                                    e.stopPropagation();
                                    startNavigation(location);
                                  }}
                                >
                                  <NavigationIcon fontSize='small' />
                                </IconButton>
                                <IconButton
                                  size='small'
                                  onClick={e => {
                                    e.stopPropagation();
                                    handleEditLocation(location);
                                  }}
                                >
                                  <EditIcon fontSize='small' />
                                </IconButton>
                                <IconButton
                                  size='small'
                                  onClick={e => {
                                    e.stopPropagation();
                                    handleDeleteLocation(location.id);
                                  }}
                                >
                                  <DeleteIcon fontSize='small' />
                                </IconButton>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      </Zoom>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* AI Suggestions Sidebar */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ borderRadius: 3, mb: 3 }}>
            <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant='h6' sx={{ ...commonStyles.gradientText }}>
                🤖 AI Suggestions
              </Typography>
            </Box>
            <Box sx={{ p: 2 }}>
              {aiProcessing ? (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <CircularProgress size={24} />
                  <Typography
                    variant='body2'
                    color='text.secondary'
                    sx={{ mt: 1 }}
                  >
                    AI is analyzing...
                  </Typography>
                </Box>
              ) : aiSuggestions.length > 0 ? (
                <List>
                  {aiSuggestions.map((suggestion, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Avatar
                          sx={{
                            bgcolor: 'primary.main',
                            width: 32,
                            height: 32,
                          }}
                        >
                          <AIIcon fontSize='small' />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={suggestion.content}
                        secondary={`${suggestion.confidence}% confidence`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <AIIcon
                    sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }}
                  />
                  <Typography variant='body2' color='text.secondary'>
                    Create a location to get AI suggestions
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>

          {/* Quick Actions */}
          <Paper elevation={2} sx={{ borderRadius: 3 }}>
            <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant='h6' sx={{ ...commonStyles.gradientText }}>
                ⚡ Quick Actions
              </Typography>
            </Box>
            <Box sx={{ p: 2 }}>
              <List>
                <ListItem button onClick={handleCreateLocation}>
                  <ListItemIcon>
                    <AddIcon color='primary' />
                  </ListItemIcon>
                  <ListItemText primary='New Location' />
                </ListItem>
                <ListItem button onClick={getCurrentLocation}>
                  <ListItemIcon>
                    <MyLocationIcon color='primary' />
                  </ListItemIcon>
                  <ListItemText primary='Get Current Location' />
                </ListItem>
                <ListItem button onClick={initializeLocations}>
                  <ListItemIcon>
                    <SyncIcon color='primary' />
                  </ListItemIcon>
                  <ListItemText primary='Sync Locations' />
                </ListItem>
              </List>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Location Dialog */}
      <Dialog
        open={locationDialogOpen}
        onClose={() => setLocationDialogOpen(false)}
        maxWidth='md'
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          <Box
            display='flex'
            justifyContent='space-between'
            alignItems='center'
          >
            <Typography variant='h6'>
              {selectedLocation ? 'Edit Location' : 'Create New Location'}
            </Typography>
            <IconButton onClick={() => setLocationDialogOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label='Location Name'
              value={locationName}
              onChange={e => setLocationName(e.target.value)}
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              label='Address'
              value={locationAddress}
              onChange={e => setLocationAddress(e.target.value)}
              sx={{ mb: 3 }}
            />

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={locationCategory}
                    onChange={e => setLocationCategory(e.target.value)}
                  >
                    {categories
                      .filter(cat => cat.id !== 'all')
                      .map(category => (
                        <MenuItem key={category.id} value={category.id}>
                          <Box display='flex' alignItems='center' gap={1}>
                            {category.icon}
                            {category.name}
                          </Box>
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <TextField
              fullWidth
              label='Notes'
              multiline
              rows={4}
              value={locationNotes}
              onChange={e => setLocationNotes(e.target.value)}
              sx={{ mb: 3 }}
            />

            <Box display='flex' gap={2} alignItems='center'>
              <FormControlLabel
                control={
                  <Switch
                    checked={locationIsFavorite}
                    onChange={e => setLocationIsFavorite(e.target.checked)}
                  />
                }
                label='Favorite Location'
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={locationIsPrivate}
                    onChange={e => setLocationIsPrivate(e.target.checked)}
                  />
                }
                label='Private Location'
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLocationDialogOpen(false)}>Cancel</Button>
          <Button
            variant='contained'
            onClick={handleSaveLocation}
            disabled={!locationName.trim() || !locationAddress.trim()}
          >
            {selectedLocation ? 'Update' : 'Create'} Location
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SmartMapsApp;
