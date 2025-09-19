/**
 * AIOS Chat Demo - Bubble Smart Design
 * Interactive chat interface with AI assistant
 */

import {
  AutoFixHigh,
  Insights,
  Maximize,
  Minimize,
  Person,
  Psychology,
  Send,
  Settings,
  SmartToy,
  TrendingUp,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Container,
  Fade,
  Grid,
  Grow,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
  Zoom,
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';

const AIOSChatDemo = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AIOS assistant. How can I help you today?",
      sender: 'ai',
      timestamp: new Date(),
      type: 'welcome',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatStats, setChatStats] = useState({
    totalMessages: 1,
    aiResponses: 1,
    userMessages: 0,
    averageResponseTime: 1.2,
  });
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        text: generateAIResponse(inputText),
        sender: 'ai',
        timestamp: new Date(),
        type: 'response',
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
      setChatStats(prev => ({
        ...prev,
        totalMessages: prev.totalMessages + 2,
        aiResponses: prev.aiResponses + 1,
        userMessages: prev.userMessages + 1,
      }));
    }, 1500);
  };

  const generateAIResponse = userInput => {
    const responses = [
      "That's an interesting question! Let me analyze that for you...",
      "I understand what you're asking. Here's my perspective on that:",
      'Great question! Based on my analysis, I would suggest:',
      'I can help you with that. Let me break it down:',
      "That's a complex topic. Here's what I think:",
      "I see what you mean. Here's my recommendation:",
    ];

    const randomResponse =
      responses[Math.floor(Math.random() * responses.length)];
    return `${randomResponse} ${
      userInput.toLowerCase().includes('aios')
        ? 'The AIOS system is designed to provide intelligent automation and learning capabilities.'
        : 'The AIOS platform offers advanced features for development and automation.'
    }`;
  };

  const handleKeyPress = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getMessageBubbleStyle = sender => {
    if (sender === 'ai') {
      return {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        marginLeft: 0,
        marginRight: 'auto',
        maxWidth: '80%',
      };
    } else {
      return {
        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        color: 'white',
        marginLeft: 'auto',
        marginRight: 0,
        maxWidth: '80%',
      };
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.3) 0%, transparent 50%)
          `,
          animation: 'bubbleFloat 20s ease-in-out infinite',
        },
      }}
    >
      {/* Floating Bubbles */}
      <Box
        sx={{
          position: 'absolute',
          top: '15%',
          left: '5%',
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          animation: 'bubbleFloat 15s ease-in-out infinite',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '25%',
          right: '10%',
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.08)',
          animation: 'bubbleFloat 12s ease-in-out infinite reverse',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '25%',
          left: '15%',
          width: 70,
          height: 70,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.06)',
          animation: 'bubbleFloat 18s ease-in-out infinite',
        }}
      />

      <Container maxWidth='lg' sx={{ position: 'relative', zIndex: 1, py: 4 }}>
        {/* Header */}
        <Fade in timeout={1000}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant='h3'
              sx={{
                fontWeight: 'bold',
                color: 'white',
                mb: 2,
                textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                background: 'linear-gradient(45deg, #fff, #e3f2fd)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              AIOS Chat Assistant
            </Typography>
            <Typography
              variant='h6'
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                maxWidth: 600,
                mx: 'auto',
                textShadow: '0 2px 10px rgba(0,0,0,0.2)',
              }}
            >
              Experience intelligent conversation with our AI-powered assistant
            </Typography>
          </Box>
        </Fade>

        <Grid container spacing={3}>
          {/* Chat Interface */}
          <Grid item xs={12} md={8}>
            <Grow in timeout={1200}>
              <Paper
                sx={{
                  height: isMinimized ? 200 : 600,
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 4,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'height 0.3s ease',
                }}
              >
                {/* Chat Header */}
                <Box
                  sx={{
                    p: 2,
                    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      sx={{
                        background:
                          'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        mr: 2,
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                      }}
                    >
                      <SmartToy />
                    </Avatar>
                    <Box>
                      <Typography
                        variant='h6'
                        sx={{ color: 'white', fontWeight: 'bold' }}
                      >
                        AIOS Assistant
                      </Typography>
                      <Typography
                        variant='body2'
                        sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                      >
                        Online • Ready to help
                      </Typography>
                    </Box>
                  </Box>
                  <Box>
                    <IconButton
                      onClick={() => setIsMinimized(!isMinimized)}
                      sx={{ color: 'white' }}
                    >
                      {isMinimized ? <Maximize /> : <Minimize />}
                    </IconButton>
                    <IconButton sx={{ color: 'white' }}>
                      <Settings />
                    </IconButton>
                  </Box>
                </Box>

                {/* Messages */}
                <Box
                  sx={{
                    flex: 1,
                    p: 2,
                    overflowY: 'auto',
                    '&::-webkit-scrollbar': {
                      width: '6px',
                    },
                    '&::-webkit-scrollbar-track': {
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '3px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: 'rgba(255, 255, 255, 0.3)',
                      borderRadius: '3px',
                    },
                  }}
                >
                  {messages.map(message => (
                    <Zoom in key={message.id} timeout={500}>
                      <Box sx={{ mb: 2 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent:
                              message.sender === 'user'
                                ? 'flex-end'
                                : 'flex-start',
                            mb: 1,
                          }}
                        >
                          {message.sender === 'ai' && (
                            <Avatar
                              sx={{
                                background:
                                  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                width: 32,
                                height: 32,
                                mr: 1,
                                mt: 0.5,
                              }}
                            >
                              <SmartToy sx={{ fontSize: 18 }} />
                            </Avatar>
                          )}
                          <Paper
                            sx={{
                              p: 2,
                              borderRadius: 3,
                              ...getMessageBubbleStyle(message.sender),
                              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                              position: 'relative',
                              '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 10,
                                [message.sender === 'ai' ? 'left' : 'right']:
                                  -8,
                                width: 0,
                                height: 0,
                                borderTop: '8px solid transparent',
                                borderBottom: '8px solid transparent',
                                [message.sender === 'ai'
                                  ? 'borderRight'
                                  : 'borderLeft']: `8px solid ${
                                  message.sender === 'ai'
                                    ? '#667eea'
                                    : '#4facfe'
                                }`,
                              },
                            }}
                          >
                            <Typography variant='body1'>
                              {message.text}
                            </Typography>
                            <Typography
                              variant='caption'
                              sx={{
                                display: 'block',
                                mt: 1,
                                opacity: 0.7,
                                fontSize: '0.7rem',
                              }}
                            >
                              {message.timestamp.toLocaleTimeString()}
                            </Typography>
                          </Paper>
                          {message.sender === 'user' && (
                            <Avatar
                              sx={{
                                background:
                                  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                                width: 32,
                                height: 32,
                                ml: 1,
                                mt: 0.5,
                              }}
                            >
                              <Person sx={{ fontSize: 18 }} />
                            </Avatar>
                          )}
                        </Box>
                      </Box>
                    </Zoom>
                  ))}

                  {isTyping && (
                    <Fade in>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', mb: 2 }}
                      >
                        <Avatar
                          sx={{
                            background:
                              'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            width: 32,
                            height: 32,
                            mr: 1,
                          }}
                        >
                          <SmartToy sx={{ fontSize: 18 }} />
                        </Avatar>
                        <Paper
                          sx={{
                            p: 2,
                            borderRadius: 3,
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: 'white',
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant='body2' sx={{ mr: 1 }}>
                              AI is typing
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                              <Box
                                sx={{
                                  width: 4,
                                  height: 4,
                                  borderRadius: '50%',
                                  background: 'white',
                                  animation: 'typing 1.4s infinite ease-in-out',
                                }}
                              />
                              <Box
                                sx={{
                                  width: 4,
                                  height: 4,
                                  borderRadius: '50%',
                                  background: 'white',
                                  animation:
                                    'typing 1.4s infinite ease-in-out 0.2s',
                                }}
                              />
                              <Box
                                sx={{
                                  width: 4,
                                  height: 4,
                                  borderRadius: '50%',
                                  background: 'white',
                                  animation:
                                    'typing 1.4s infinite ease-in-out 0.4s',
                                }}
                              />
                            </Box>
                          </Box>
                        </Paper>
                      </Box>
                    </Fade>
                  )}
                  <div ref={messagesEndRef} />
                </Box>

                {/* Input Area */}
                <Box
                  sx={{
                    p: 2,
                    borderTop: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth
                      multiline
                      maxRows={3}
                      placeholder='Type your message...'
                      value={inputText}
                      onChange={e => setInputText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: 3,
                          '& fieldset': {
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                          },
                          '&:hover fieldset': {
                            border: '1px solid rgba(255, 255, 255, 0.5)',
                          },
                          '&.Mui-focused fieldset': {
                            border: '1px solid rgba(255, 255, 255, 0.7)',
                          },
                        },
                        '& .MuiInputBase-input': {
                          color: 'white',
                          '&::placeholder': {
                            color: 'rgba(255, 255, 255, 0.7)',
                          },
                        },
                      }}
                    />
                    <Button
                      variant='contained'
                      onClick={handleSendMessage}
                      disabled={!inputText.trim()}
                      sx={{
                        background:
                          'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                        borderRadius: 3,
                        px: 3,
                        '&:hover': {
                          background:
                            'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                          opacity: 0.9,
                        },
                        '&:disabled': {
                          background: 'rgba(255, 255, 255, 0.2)',
                        },
                      }}
                    >
                      <Send />
                    </Button>
                  </Box>
                </Box>
              </Paper>
            </Grow>
          </Grid>

          {/* Chat Statistics */}
          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              {/* Chat Stats */}
              <Zoom in timeout={1400}>
                <Paper
                  sx={{
                    p: 3,
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: 4,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <Typography
                    variant='h6'
                    sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}
                  >
                    Chat Statistics
                  </Typography>
                  <Stack spacing={2}>
                    <Box
                      sx={{ display: 'flex', justifyContent: 'space-between' }}
                    >
                      <Typography
                        variant='body2'
                        sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                      >
                        Total Messages
                      </Typography>
                      <Typography
                        variant='body2'
                        sx={{ color: 'white', fontWeight: 'bold' }}
                      >
                        {chatStats.totalMessages}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: 'flex', justifyContent: 'space-between' }}
                    >
                      <Typography
                        variant='body2'
                        sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                      >
                        AI Responses
                      </Typography>
                      <Typography
                        variant='body2'
                        sx={{ color: 'white', fontWeight: 'bold' }}
                      >
                        {chatStats.aiResponses}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: 'flex', justifyContent: 'space-between' }}
                    >
                      <Typography
                        variant='body2'
                        sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                      >
                        User Messages
                      </Typography>
                      <Typography
                        variant='body2'
                        sx={{ color: 'white', fontWeight: 'bold' }}
                      >
                        {chatStats.userMessages}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: 'flex', justifyContent: 'space-between' }}
                    >
                      <Typography
                        variant='body2'
                        sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                      >
                        Avg Response Time
                      </Typography>
                      <Typography
                        variant='body2'
                        sx={{ color: 'white', fontWeight: 'bold' }}
                      >
                        {chatStats.averageResponseTime}s
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Zoom>

              {/* AI Capabilities */}
              <Zoom in timeout={1600}>
                <Paper
                  sx={{
                    p: 3,
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: 4,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <Typography
                    variant='h6'
                    sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}
                  >
                    AI Capabilities
                  </Typography>
                  <Stack spacing={1}>
                    {[
                      {
                        icon: <Psychology />,
                        text: 'Natural Language Processing',
                      },
                      { icon: <AutoFixHigh />, text: 'Code Analysis & Fixes' },
                      { icon: <Insights />, text: 'Intelligent Insights' },
                      {
                        icon: <TrendingUp />,
                        text: 'Performance Optimization',
                      },
                    ].map((capability, idx) => (
                      <Box
                        key={idx}
                        sx={{ display: 'flex', alignItems: 'center' }}
                      >
                        <Avatar
                          sx={{
                            background: 'rgba(255, 255, 255, 0.2)',
                            width: 32,
                            height: 32,
                            mr: 2,
                          }}
                        >
                          {capability.icon}
                        </Avatar>
                        <Typography
                          variant='body2'
                          sx={{ color: 'rgba(255, 255, 255, 0.9)' }}
                        >
                          {capability.text}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Paper>
              </Zoom>
            </Stack>
          </Grid>
        </Grid>
      </Container>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes bubbleFloat {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-20px) rotate(2deg);
          }
          66% {
            transform: translateY(-10px) rotate(-1deg);
          }
        }

        @keyframes typing {
          0%,
          60%,
          100% {
            transform: translateY(0);
            opacity: 0.4;
          }
          30% {
            transform: translateY(-10px);
            opacity: 1;
          }
        }
      `}</style>
    </Box>
  );
};

export default AIOSChatDemo;
