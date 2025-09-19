import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Button, TextField, 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Chip, Grid, Paper, List, ListItem, ListItemText, ListItemIcon,
  IconButton, Fab, Tooltip, LinearProgress, Alert, Tabs, Tab,
  Badge, Avatar, Divider
} from '@mui/material';
import {
  Email, Send, Reply, ReplyAll, Forward, SmartToy, 
  Drafts, Inbox, Send as Sent, Star, Delete, Archive, Label,
  AttachFile, Schedule, PriorityHigh, Person
} from '@mui/icons-material';

const SmartEmailApp = () => {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [currentTab, setCurrentTab] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiInsights, setAiInsights] = useState(null);
  const [newEmail, setNewEmail] = useState({
    to: '', subject: '', body: '', priority: 'normal', attachments: []
  });
  const [aiResponse, setAiResponse] = useState('');

  // AI-powered email classification
  const classifyEmails = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/smart-email/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emails })
      });
      const classification = await response.json();
      setEmails(classification.emails);
      setAiInsights(classification.insights);
    } catch (error) {
      console.error('Email classification failed:', error);
    }
    setIsAnalyzing(false);
  };

  // AI-powered response generation
  const generateAIResponse = async (originalEmail) => {
    try {
      const response = await fetch('/api/smart-email/generate-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          originalEmail,
          context: getUserContext(),
          preferences: getUserPreferences()
        })
      });
      const aiResponse = await response.json();
      setAiResponse(aiResponse.response);
      return aiResponse.response;
    } catch (error) {
      console.error('AI response generation failed:', error);
    }
  };

  // Smart email drafting
  const generateEmailDraft = async (prompt) => {
    try {
      const response = await fetch('/api/smart-email/generate-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt,
          context: getUserContext(),
          tone: getUserPreferences().tone
        })
      });
      const draft = await response.json();
      setNewEmail(prev => ({
        ...prev,
        subject: draft.subject,
        body: draft.body
      }));
    } catch (error) {
      console.error('Email draft generation failed:', error);
    }
  };

  // Meeting extraction
  const extractMeetings = async () => {
    try {
      const response = await fetch('/api/smart-email/extract-meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emails })
      });
      const meetings = await response.json();
      setAiSuggestions(meetings);
    } catch (error) {
      console.error('Meeting extraction failed:', error);
    }
  };

  // Sentiment analysis
  const analyzeSentiment = async (email) => {
    try {
      const response = await fetch('/api/smart-email/sentiment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const sentiment = await response.json();
      return sentiment;
    } catch (error) {
      console.error('Sentiment analysis failed:', error);
    }
  };

  const getUserContext = () => ({
    currentTime: new Date(),
    workload: 'medium',
    recentEmails: emails.slice(0, 5),
    calendarEvents: []
  });

  const getUserPreferences = () => ({
    tone: 'professional',
    responseStyle: 'concise',
    autoReply: false,
    priorityKeywords: ['urgent', 'asap', 'important']
  });

  const handleSendEmail = async () => {
    const emailWithAI = {
      ...newEmail,
      id: Date.now(),
      timestamp: new Date(),
      aiGenerated: true,
      sentiment: await analyzeSentiment(newEmail),
      priority: calculatePriority(newEmail)
    };
    
    setEmails([emailWithAI, ...emails]);
    setComposeOpen(false);
    setNewEmail({ to: '', subject: '', body: '', priority: 'normal', attachments: [] });
    
    // Trigger AI analysis after sending
    setTimeout(() => classifyEmails(), 1000);
  };

  const calculatePriority = (email) => {
    const urgentKeywords = ['urgent', 'asap', 'emergency', 'critical'];
    const hasUrgentKeyword = urgentKeywords.some(keyword => 
      email.subject.toLowerCase().includes(keyword) || 
      email.body.toLowerCase().includes(keyword)
    );
    return hasUrgentKeyword ? 'high' : 'normal';
  };

  const handleReply = async (email) => {
    const response = await generateAIResponse(email);
    setNewEmail({
      to: email.from,
      subject: `Re: ${email.subject}`,
      body: response,
      priority: 'normal',
      attachments: []
    });
    setComposeOpen(true);
  };

  const applyAISuggestion = (suggestion) => {
    switch (suggestion.type) {
      case 'schedule_meeting':
        // Add meeting to calendar
        console.log('Scheduling meeting:', suggestion.meeting);
        break;
      case 'priority_update':
        // Update email priority
        setEmails(emails.map(email => 
          email.id === suggestion.emailId 
            ? { ...email, priority: suggestion.newPriority }
            : email
        ));
        break;
      case 'auto_reply':
        // Send auto-reply
        handleReply(suggestion.email);
        break;
    }
    
    setAiSuggestions(aiSuggestions.filter(s => s.id !== suggestion.id));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'success';
      case 'negative': return 'error';
      case 'neutral': return 'default';
      default: return 'default';
    }
  };

  useEffect(() => {
    // Load initial emails and run AI analysis
    classifyEmails();
    extractMeetings();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Email sx={{ mr: 2, fontSize: 40, color: 'primary.main' }} />
        <Box>
          <Typography variant="h4" component="h1">
            Smart Email
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            AI-Powered Communication & Responses
          </Typography>
        </Box>
      </Box>

      {/* AI Insights Panel */}
      {aiInsights && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="h6">AI Email Insights</Typography>
          <Typography>{aiInsights.summary}</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Unread: {aiInsights.unread} | High Priority: {aiInsights.highPriority} | 
            Sentiment: {aiInsights.avgSentiment} | AI Suggestions: {aiInsights.suggestions}
          </Typography>
        </Alert>
      )}

      {/* Email Tabs */}
      <Card sx={{ mb: 3 }}>
        <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)}>
          <Tab icon={<Inbox />} label="Inbox" />
          <Tab icon={<Sent />} label="Sent" />
          <Tab icon={<Drafts />} label="Drafts" />
          <Tab icon={<Star />} label="Starred" />
        </Tabs>
      </Card>

      <Grid container spacing={3}>
        {/* Email List */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Emails</Typography>
                <Box>
                  <Button 
                    variant="outlined" 
                    startIcon={<SmartToy />}
                    onClick={classifyEmails}
                    disabled={isAnalyzing}
                    sx={{ mr: 1 }}
                  >
                    AI Analyze
                  </Button>
                  <Button 
                    variant="outlined" 
                    startIcon={<Schedule />}
                    onClick={extractMeetings}
                  >
                    Extract Meetings
                  </Button>
                </Box>
              </Box>
              
              {isAnalyzing && <LinearProgress sx={{ mb: 2 }} />}
              
              <List>
                {emails.map((email) => (
                  <ListItem 
                    key={email.id} 
                    sx={{ 
                      border: '1px solid #e0e0e0', 
                      mb: 1, 
                      borderRadius: 1,
                      cursor: 'pointer',
                      bgcolor: selectedEmail?.id === email.id ? 'primary.light' : 'transparent'
                    }}
                    onClick={() => setSelectedEmail(email)}
                  >
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {email.from?.charAt(0).toUpperCase()}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Typography variant="h6">{email.from}</Typography>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Chip 
                              label={email.priority} 
                              color={getPriorityColor(email.priority)}
                              size="small"
                            />
                            {email.sentiment && (
                              <Chip 
                                label={email.sentiment} 
                                color={getSentimentColor(email.sentiment)}
                                size="small"
                              />
                            )}
                            {email.aiGenerated && (
                              <Chip label="AI" size="small" color="secondary" />
                            )}
                          </Box>
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {email.subject}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {email.timestamp?.toLocaleDateString()} • {email.body?.substring(0, 100)}...
                          </Typography>
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
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Email Actions */}
      {selectedEmail && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Button 
                startIcon={<Reply />}
                onClick={() => handleReply(selectedEmail)}
              >
                Reply
              </Button>
              <Button 
                startIcon={<ReplyAll />}
                onClick={() => {/* Handle reply all */}}
              >
                Reply All
              </Button>
              <Button 
                startIcon={<Forward />}
                onClick={() => {/* Handle forward */}}
              >
                Forward
              </Button>
              <Button 
                startIcon={<SmartToy />}
                onClick={() => generateAIResponse(selectedEmail)}
              >
                AI Response
              </Button>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="h6" sx={{ mb: 1 }}>
              {selectedEmail.subject}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              From: {selectedEmail.from} • {selectedEmail.timestamp?.toLocaleString()}
            </Typography>
            <Typography variant="body1">
              {selectedEmail.body}
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Floating Action Button */}
      <Fab 
        color="primary" 
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => setComposeOpen(true)}
      >
        <Send />
      </Fab>

      {/* Compose Email Dialog */}
      <Dialog open={composeOpen} onClose={() => setComposeOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Compose Smart Email</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="To"
            value={newEmail.to}
            onChange={(e) => setNewEmail({...newEmail, to: e.target.value})}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            fullWidth
            label="Subject"
            value={newEmail.subject}
            onChange={(e) => setNewEmail({...newEmail, subject: e.target.value})}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Email Body"
            multiline
            rows={8}
            value={newEmail.body}
            onChange={(e) => setNewEmail({...newEmail, body: e.target.value})}
            sx={{ mb: 2 }}
          />
          
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Button 
              startIcon={<SmartToy />}
              onClick={() => generateEmailDraft('Write a professional email about ' + newEmail.subject)}
            >
              AI Draft
            </Button>
            <Button 
              startIcon={<AttachFile />}
              onClick={() => {/* Handle attachments */}}
            >
              Attach File
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setComposeOpen(false)}>Cancel</Button>
          <Button onClick={handleSendEmail} variant="contained" startIcon={<Send />}>
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SmartEmailApp;
