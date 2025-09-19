import {
  Psychology as AIIcon,
  Add as AddIcon,
  Business as BusinessIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Group as GroupIcon,
  Label as LabelIcon,
  Lightbulb as LightbulbIcon,
  Lock as LockIcon,
  Mic as MicIcon,
  Note as NoteIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Search as SearchIcon,
  Settings as SettingsIcon,
  Sync as SyncIcon,
  Work as WorkIcon
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
  useTheme
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useFirebase } from '../services/FirebaseService';
import { animations, commonStyles } from '../theme/aiosTheme';

const SmartNotesApp = () => {
  const { userProfile } = useAuth();
  const { db, auth } = useFirebase();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [noteContent, setNoteContent] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [noteCategory, setNoteCategory] = useState('general');
  const [noteTags, setNoteTags] = useState([]);
  const [notePriority, setNotePriority] = useState('medium');
  const [noteIsPrivate, setNoteIsPrivate] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [voiceRecording, setVoiceRecording] = useState(false);
  const [aiProcessing, setAiProcessing] = useState(false);
  const [syncStatus, setSyncStatus] = useState('synced');

  // Categories for notes
  const categories = [
    { id: 'all', name: 'All Notes', icon: <NoteIcon />, color: '#667eea' },
    { id: 'work', name: 'Work', icon: <WorkIcon />, color: '#43e97b' },
    {
      id: 'personal',
      name: 'Personal',
      icon: <PersonIcon />,
      color: '#fa709a'
    },
    { id: 'ideas', name: 'Ideas', icon: <LightbulbIcon />, color: '#f093fb' },
    { id: 'meetings', name: 'Meetings', icon: <GroupIcon />, color: '#4facfe' },
    {
      id: 'learning',
      name: 'Learning',
      icon: <SchoolIcon />,
      color: '#a8edea'
    },
    {
      id: 'projects',
      name: 'Projects',
      icon: <BusinessIcon />,
      color: '#ffd89b'
    }
  ];

  // Priority levels
  const priorities = [
    { id: 'low', name: 'Low', color: '#4caf50' },
    { id: 'medium', name: 'Medium', color: '#ff9800' },
    { id: 'high', name: 'High', color: '#f44336' },
    { id: 'urgent', name: 'Urgent', color: '#9c27b0' }
  ];

  // Initialize notes from Firebase
  const initializeNotes = useCallback(async () => {
    if (!db || !auth?.currentUser) return;

    try {
      setLoading(true);
      const notesRef = db.collection('notes').where('userId', '==', auth.currentUser.uid);
      const snapshot = await notesRef.get();

      const notesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      }));

      setNotes(notesData);
      setFilteredNotes(notesData);
    } catch (error) {
      console.error('Error loading notes:', error);
    } finally {
      setLoading(false);
    }
  }, [db, auth]);

  // Save note to Firebase
  const saveNote = useCallback(
    async noteData => {
      if (!db || !auth?.currentUser) return;

      try {
        setSyncStatus('syncing');
        const now = new Date();

        if (selectedNote) {
          // Update existing note
          await db
            .collection('notes')
            .doc(selectedNote.id)
            .update({
              ...noteData,
              updatedAt: now
            });
        } else {
          // Create new note
          await db.collection('notes').add({
            ...noteData,
            userId: auth.currentUser.uid,
            createdAt: now,
            updatedAt: now
          });
        }

        await initializeNotes();
        setSyncStatus('synced');
      } catch (error) {
        console.error('Error saving note:', error);
        setSyncStatus('error');
      }
    },
    [db, auth, selectedNote, initializeNotes]
  );

  // Delete note from Firebase
  const deleteNote = useCallback(
    async noteId => {
      if (!db) return;

      try {
        setSyncStatus('syncing');
        await db.collection('notes').doc(noteId).delete();
        await initializeNotes();
        setSyncStatus('synced');
      } catch (error) {
        console.error('Error deleting note:', error);
        setSyncStatus('error');
      }
    },
    [db, initializeNotes]
  );

  // AI-powered search and suggestions
  const generateAISuggestions = useCallback(async content => {
    if (!content.trim()) {
      setAiSuggestions([]);
      return;
    }

    try {
      setAiProcessing(true);

      // Simulate AI processing (replace with actual AI service)
      const suggestions = [
        {
          type: 'summary',
          content: `Summary: ${content.substring(0, 100)}...`,
          confidence: 95
        },
        {
          type: 'tags',
          content: 'Suggested tags: important, meeting, follow-up',
          confidence: 87
        },
        {
          type: 'action',
          content: 'Action item: Schedule follow-up meeting',
          confidence: 78
        },
        {
          type: 'category',
          content: 'Suggested category: Work',
          confidence: 92
        }
      ];

      setAiSuggestions(suggestions);
    } catch (error) {
      console.error('Error generating AI suggestions:', error);
    } finally {
      setAiProcessing(false);
    }
  }, []);

  // Voice-to-text functionality
  const startVoiceRecording = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setVoiceRecording(true);
    };

    recognition.onresult = event => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      setNoteContent(prev => prev + finalTranscript + interimTranscript);
    };

    recognition.onend = () => {
      setVoiceRecording(false);
    };

    recognition.onerror = event => {
      console.error('Speech recognition error:', event.error);
      setVoiceRecording(false);
    };

    recognition.start();
  }, []);

  // Filter and search notes
  const filterNotes = useCallback(() => {
    let filtered = notes;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(note => note.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        note =>
          note.title.toLowerCase().includes(query) ||
          note.content.toLowerCase().includes(query) ||
          note.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Sort notes
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        default:
          return 0;
      }
    });

    setFilteredNotes(filtered);
  }, [notes, selectedCategory, searchQuery, sortBy]);

  // Handle note operations
  const handleCreateNote = () => {
    setSelectedNote(null);
    setNoteTitle('');
    setNoteContent('');
    setNoteCategory('general');
    setNoteTags([]);
    setNotePriority('medium');
    setNoteIsPrivate(false);
    setNoteDialogOpen(true);
  };

  const handleEditNote = note => {
    setSelectedNote(note);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setNoteCategory(note.category);
    setNoteTags(note.tags || []);
    setNotePriority(note.priority);
    setNoteIsPrivate(note.isPrivate || false);
    setNoteDialogOpen(true);
  };

  const handleSaveNote = async () => {
    const noteData = {
      title: noteTitle,
      content: noteContent,
      category: noteCategory,
      tags: noteTags,
      priority: notePriority,
      isPrivate: noteIsPrivate
    };

    await saveNote(noteData);
    setNoteDialogOpen(false);
  };

  const handleDeleteNote = async noteId => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      await deleteNote(noteId);
    }
  };

  // Initialize app
  useEffect(() => {
    initializeNotes();
  }, [initializeNotes]);

  // Filter notes when dependencies change
  useEffect(() => {
    filterNotes();
  }, [filterNotes]);

  // Generate AI suggestions when content changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      generateAISuggestions(noteContent);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [noteContent, generateAISuggestions]);

  if (loading) {
    return (
      <Container maxWidth='lg' sx={{ ...commonStyles.centerContent, flexDirection: 'column' }}>
        <CircularProgress size={80} thickness={4} />
        <Typography variant='h5' sx={{ mt: 3, ...commonStyles.gradientText }}>
          Loading Smart Notes...
        </Typography>
        <Typography variant='body1' color='text.secondary' sx={{ mt: 1 }}>
          Syncing with AI-powered features
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
          overflow: 'hidden'
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
            animation: 'pulse 4s ease-in-out infinite'
          }}
        />

        <Box display='flex' justifyContent='space-between' alignItems='center' position='relative' zIndex={1}>
          <Box>
            <Typography
              variant='h3'
              component='h1'
              gutterBottom
              sx={{
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}
            >
              <NoteIcon sx={{ fontSize: '2.5rem' }} />
              Smart Notes
            </Typography>
            <Typography variant='h6' sx={{ opacity: 0.9, mb: 3 }}>
              AI-powered note-taking with intelligent organization and voice input
            </Typography>
            <Box display='flex' gap={1} flexWrap='wrap'>
              <Chip
                icon={<NoteIcon />}
                label={`${notes.length} Notes`}
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
              <Chip icon={<AIIcon />} label='AI-Powered' sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
              <Chip icon={<SyncIcon />} label={syncStatus} sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
            </Box>
          </Box>
          <Box display='flex' gap={1}>
            <Tooltip title='Sync Notes'>
              <IconButton
                onClick={initializeNotes}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
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
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                }}
              >
                <SettingsIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Paper>

      {/* Search and Filter Bar */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
        <Grid container spacing={2} alignItems='center'>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder='Search notes...'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
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
                <MenuItem value='date'>Date</MenuItem>
                <MenuItem value='title'>Title</MenuItem>
                <MenuItem value='priority'>Priority</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Notes List */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ borderRadius: 3 }}>
            <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
              <Box display='flex' justifyContent='space-between' alignItems='center'>
                <Typography variant='h6' sx={{ ...commonStyles.gradientText }}>
                  📝 Your Notes ({filteredNotes.length})
                </Typography>
                <Button variant='contained' startIcon={<AddIcon />} onClick={handleCreateNote} sx={{ borderRadius: 2 }}>
                  New Note
                </Button>
              </Box>
            </Box>

            <Box sx={{ p: 2 }}>
              {filteredNotes.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <NoteIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant='h6' color='text.secondary'>
                    No notes found
                  </Typography>
                  <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
                    Create your first AI-powered note
                  </Typography>
                  <Button variant='contained' startIcon={<AddIcon />} onClick={handleCreateNote}>
                    Create Note
                  </Button>
                </Box>
              ) : (
                <Grid container spacing={2}>
                  {filteredNotes.map((note, index) => (
                    <Grid item xs={12} sm={6} lg={4} key={note.id}>
                      <Zoom in timeout={300 + index * 100}>
                        <Card
                          sx={{
                            height: '100%',
                            ...commonStyles.cardHover,
                            cursor: 'pointer'
                          }}
                          onClick={() => handleEditNote(note)}
                        >
                          <CardContent>
                            <Box display='flex' justifyContent='space-between' alignItems='start' mb={2}>
                              <Typography variant='h6' sx={{ fontWeight: 600, flexGrow: 1 }}>
                                {note.title}
                              </Typography>
                              <Box display='flex' gap={1}>
                                <Chip
                                  label={note.priority}
                                  size='small'
                                  color={
                                    priorities.find(p => p.id === note.priority)?.color === '#4caf50'
                                      ? 'success'
                                      : priorities.find(p => p.id === note.priority)?.color === '#ff9800'
                                        ? 'warning'
                                        : priorities.find(p => p.id === note.priority)?.color === '#f44336'
                                          ? 'error'
                                          : 'default'
                                  }
                                />
                                {note.isPrivate && <LockIcon fontSize='small' color='action' />}
                              </Box>
                            </Box>

                            <Typography
                              variant='body2'
                              color='text.secondary'
                              sx={{
                                mb: 2,
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                              }}
                            >
                              {note.content}
                            </Typography>

                            <Box display='flex' gap={1} flexWrap='wrap' mb={2}>
                              {note.tags?.map((tag, tagIndex) => (
                                <Chip key={tagIndex} label={tag} size='small' variant='outlined' icon={<LabelIcon />} />
                              ))}
                            </Box>

                            <Box display='flex' justifyContent='space-between' alignItems='center'>
                              <Typography variant='caption' color='text.secondary'>
                                {new Date(note.updatedAt).toLocaleDateString()}
                              </Typography>
                              <Box display='flex' gap={1}>
                                <IconButton
                                  size='small'
                                  onClick={e => {
                                    e.stopPropagation();
                                    handleEditNote(note);
                                  }}
                                >
                                  <EditIcon fontSize='small' />
                                </IconButton>
                                <IconButton
                                  size='small'
                                  onClick={e => {
                                    e.stopPropagation();
                                    handleDeleteNote(note.id);
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
                  <Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
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
                            height: 32
                          }}
                        >
                          <AIIcon fontSize='small' />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText primary={suggestion.content} secondary={`${suggestion.confidence}% confidence`} />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <AIIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                  <Typography variant='body2' color='text.secondary'>
                    Start typing to get AI suggestions
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
                <ListItem button onClick={handleCreateNote}>
                  <ListItemIcon>
                    <AddIcon color='primary' />
                  </ListItemIcon>
                  <ListItemText primary='New Note' />
                </ListItem>
                <ListItem button onClick={startVoiceRecording}>
                  <ListItemIcon>
                    <MicIcon color={voiceRecording ? 'error' : 'primary'} />
                  </ListItemIcon>
                  <ListItemText primary={voiceRecording ? 'Stop Recording' : 'Voice Note'} />
                </ListItem>
                <ListItem button onClick={initializeNotes}>
                  <ListItemIcon>
                    <SyncIcon color='primary' />
                  </ListItemIcon>
                  <ListItemText primary='Sync Notes' />
                </ListItem>
              </List>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Note Dialog */}
      <Dialog
        open={noteDialogOpen}
        onClose={() => setNoteDialogOpen(false)}
        maxWidth='md'
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          <Box display='flex' justifyContent='space-between' alignItems='center'>
            <Typography variant='h6'>{selectedNote ? 'Edit Note' : 'Create New Note'}</Typography>
            <Box display='flex' gap={1}>
              <IconButton onClick={startVoiceRecording} color={voiceRecording ? 'error' : 'primary'}>
                <MicIcon />
              </IconButton>
              <IconButton onClick={() => setNoteDialogOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label='Title'
              value={noteTitle}
              onChange={e => setNoteTitle(e.target.value)}
              sx={{ mb: 3 }}
            />

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select value={noteCategory} onChange={e => setNoteCategory(e.target.value)}>
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
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select value={notePriority} onChange={e => setNotePriority(e.target.value)}>
                    {priorities.map(priority => (
                      <MenuItem key={priority.id} value={priority.id}>
                        {priority.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <TextField
              fullWidth
              label='Content'
              multiline
              rows={8}
              value={noteContent}
              onChange={e => setNoteContent(e.target.value)}
              sx={{ mb: 3 }}
            />

            <Box display='flex' gap={2} alignItems='center'>
              <FormControlLabel
                control={<Switch checked={noteIsPrivate} onChange={e => setNoteIsPrivate(e.target.checked)} />}
                label='Private Note'
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNoteDialogOpen(false)}>Cancel</Button>
          <Button variant='contained' onClick={handleSaveNote} disabled={!noteTitle.trim() || !noteContent.trim()}>
            {selectedNote ? 'Update' : 'Create'} Note
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SmartNotesApp;
