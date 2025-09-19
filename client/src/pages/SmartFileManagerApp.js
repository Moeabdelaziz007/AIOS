import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Button, TextField, 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Chip, Grid, Paper, List, ListItem, ListItemText, ListItemIcon,
  IconButton, Fab, Tooltip, LinearProgress, Alert, Breadcrumbs, Link
} from '@mui/material';
import {
  Folder, InsertDriveFile, Search, SmartToy, 
  CreateNewFolder, Upload, Download, Delete, 
  FolderOpen, Image, Description, VideoFile, AudioFile
} from '@mui/icons-material';

const SmartFileManagerApp = () => {
  const [files, setFiles] = useState([]);
  const [aiTags, setAiTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPath, setCurrentPath] = useState('/');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [duplicates, setDuplicates] = useState([]);
  const [aiInsights, setAiInsights] = useState(null);

  // AI-powered file organization
  const analyzeFiles = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/smart-file-manager/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ files, path: currentPath })
      });
      const analysis = await response.json();
      setAiTags(analysis.tags);
      setAiSuggestions(analysis.suggestions);
      setAiInsights(analysis.insights);
    } catch (error) {
      console.error('AI analysis failed:', error);
    }
    setIsAnalyzing(false);
  };

  // Intelligent search with semantic understanding
  const performSmartSearch = async (query) => {
    if (!query.trim()) return;
    
    try {
      const response = await fetch('/api/smart-file-manager/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query, 
          files, 
          context: { path: currentPath, userPreferences: getUserPreferences() }
        })
      });
      const results = await response.json();
      setFiles(results.files);
      setAiSuggestions(results.suggestions);
    } catch (error) {
      console.error('Smart search failed:', error);
    }
  };

  // Smart duplicate detection
  const findDuplicates = async () => {
    try {
      const response = await fetch('/api/smart-file-manager/duplicates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ files })
      });
      const duplicates = await response.json();
      setDuplicates(duplicates);
    } catch (error) {
      console.error('Duplicate detection failed:', error);
    }
  };

  // Content-based grouping
  const groupRelatedFiles = async () => {
    try {
      const response = await fetch('/api/smart-file-manager/group', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ files })
      });
      const groups = await response.json();
      setAiSuggestions(groups);
    } catch (error) {
      console.error('File grouping failed:', error);
    }
  };

  const getUserPreferences = () => ({
    organizationStyle: 'project-based',
    autoTagging: true,
    duplicateHandling: 'smart',
    searchPreferences: ['content', 'metadata', 'tags']
  });

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'image': return <Image />;
      case 'video': return <VideoFile />;
      case 'audio': return <AudioFile />;
      case 'document': return <Description />;
      default: return <InsertDriveFile />;
    }
  };

  const handleFileUpload = async (event) => {
    const uploadedFiles = Array.from(event.target.files);
    const newFiles = uploadedFiles.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      path: currentPath,
      uploadDate: new Date(),
      aiAnalyzed: false
    }));
    
    setFiles([...files, ...newFiles]);
    
    // Trigger AI analysis for new files
    setTimeout(() => analyzeFiles(), 1000);
  };

  const handleCreateFolder = async (folderName) => {
    const newFolder = {
      id: Date.now(),
      name: folderName,
      type: 'folder',
      path: currentPath,
      createdDate: new Date(),
      aiOptimized: true
    };
    
    setFiles([...files, newFolder]);
  };

  const applyAISuggestion = (suggestion) => {
    switch (suggestion.type) {
      case 'organize':
        // Apply AI organization suggestion
        setFiles(files.map(file => 
          suggestion.fileIds.includes(file.id) 
            ? { ...file, suggestedPath: suggestion.newPath }
            : file
        ));
        break;
      case 'tag':
        // Apply AI tagging suggestion
        setFiles(files.map(file => 
          suggestion.fileIds.includes(file.id) 
            ? { ...file, aiTags: [...(file.aiTags || []), ...suggestion.tags] }
            : file
        ));
        break;
      case 'delete_duplicate':
        // Remove duplicate files
        setFiles(files.filter(file => !suggestion.fileIds.includes(file.id)));
        break;
    }
    
    setAiSuggestions(aiSuggestions.filter(s => s.id !== suggestion.id));
  };

  const handleSmartSearch = (query) => {
    setSearchQuery(query);
    performSmartSearch(query);
  };

  useEffect(() => {
    // Load initial files and run AI analysis
    analyzeFiles();
    findDuplicates();
  }, [currentPath]);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Folder sx={{ mr: 2, fontSize: 40, color: 'primary.main' }} />
        <Box>
          <Typography variant="h4" component="h1">
            Smart File Manager
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            AI-Powered Organization & Search
          </Typography>
        </Box>
      </Box>

      {/* AI Insights Panel */}
      {aiInsights && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="h6">AI Insights</Typography>
          <Typography>{aiInsights.summary}</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Organization Score: {aiInsights.organizationScore}% | 
            Duplicates Found: {aiInsights.duplicates} | 
            Optimization Potential: {aiInsights.optimizationPotential}%
          </Typography>
        </Alert>
      )}

      {/* Navigation and Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Breadcrumbs>
              <Link color="inherit" href="#" onClick={() => setCurrentPath('/')}>
                Home
              </Link>
              <Typography color="text.primary">{currentPath}</Typography>
            </Breadcrumbs>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                variant="outlined" 
                startIcon={<SmartToy />}
                onClick={analyzeFiles}
                disabled={isAnalyzing}
              >
                AI Analyze
              </Button>
              <Button 
                variant="outlined" 
                startIcon={<Search />}
                onClick={() => findDuplicates()}
              >
                Find Duplicates
              </Button>
              <Button 
                variant="outlined" 
                onClick={groupRelatedFiles}
              >
                Group Files
              </Button>
            </Box>
          </Box>
          
          <TextField
            fullWidth
            placeholder="Smart search with AI understanding..."
            value={searchQuery}
            onChange={(e) => handleSmartSearch(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
            }}
          />
          
          {isAnalyzing && <LinearProgress sx={{ mt: 2 }} />}
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* File List */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Files & Folders</Typography>
                <Box>
                  <input
                    accept="*/*"
                    style={{ display: 'none' }}
                    id="file-upload"
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                  />
                  <label htmlFor="file-upload">
                    <Button component="span" startIcon={<Upload />} sx={{ mr: 1 }}>
                      Upload
                    </Button>
                  </label>
                  <Button 
                    startIcon={<CreateNewFolder />}
                    onClick={() => handleCreateFolder('New Folder')}
                  >
                    New Folder
                  </Button>
                </Box>
              </Box>
              
              <List>
                {files.map((file) => (
                  <ListItem 
                    key={file.id} 
                    sx={{ 
                      border: '1px solid #e0e0e0', 
                      mb: 1, 
                      borderRadius: 1,
                      bgcolor: selectedFiles.includes(file.id) ? 'primary.light' : 'transparent'
                    }}
                    onClick={() => {
                      if (file.type === 'folder') {
                        setCurrentPath(`${currentPath}${file.name}/`);
                      } else {
                        setSelectedFiles(prev => 
                          prev.includes(file.id) 
                            ? prev.filter(id => id !== file.id)
                            : [...prev, file.id]
                        );
                      }
                    }}
                  >
                    <ListItemIcon>
                      {file.type === 'folder' ? <FolderOpen /> : getFileIcon(file.type)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Typography variant="h6">{file.name}</Typography>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            {file.aiTags && file.aiTags.map(tag => (
                              <Chip key={tag} label={tag} size="small" color="primary" />
                            ))}
                            {file.suggestedPath && (
                              <Chip label="AI Suggested" size="small" color="secondary" />
                            )}
                          </Box>
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {file.size ? `${(file.size / 1024).toFixed(1)} KB` : 'Folder'} • 
                            {file.uploadDate ? file.uploadDate.toLocaleDateString() : file.createdDate.toLocaleDateString()}
                          </Typography>
                          {file.suggestedPath && (
                            <Typography variant="body2" color="secondary.main">
                              Suggested: {file.suggestedPath}
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* AI Suggestions Panel */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                AI Suggestions
              </Typography>
              
              {aiSuggestions.map((suggestion) => (
                <Paper key={suggestion.id} sx={{ p: 2, mb: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    {suggestion.type}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {suggestion.description}
                  </Typography>
                  <Button 
                    size="small" 
                    variant="contained" 
                    onClick={() => applyAISuggestion(suggestion)}
                    sx={{ bgcolor: 'white', color: 'primary.main' }}
                  >
                    Apply
                  </Button>
                </Paper>
              ))}
              
              {/* Duplicates Section */}
              {duplicates.length > 0 && (
                <Paper sx={{ p: 2, mt: 2, bgcolor: 'warning.light' }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Duplicate Files Found
                  </Typography>
                  {duplicates.map((duplicate, index) => (
                    <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                      {duplicate.files.length} copies of "{duplicate.name}"
                    </Typography>
                  ))}
                  <Button 
                    size="small" 
                    variant="contained" 
                    onClick={() => {/* Handle duplicate removal */}}
                    sx={{ bgcolor: 'white', color: 'warning.main' }}
                  >
                    Clean Up
                  </Button>
                </Paper>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SmartFileManagerApp;
