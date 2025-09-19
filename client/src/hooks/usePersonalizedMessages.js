/**
 * 🧠 Personalized Messages Hook
 *
 * React hook for personalized, contextual messages in the AIOS client
 */

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const usePersonalizedMessages = () => {
  const { user, userProfile } = useAuth();
  const [messages, setMessages] = useState({
    welcome: '',
    loading: '',
    error: '',
    success: '',
    contextual: ''
  });

  // Message templates
  const messageTemplates = {
    welcome: {
      morning: [
        'Good morning, {name}! ☀️ Your Quantum Dashboard is ready for another productive day.',
        "Rise and shine, {name}! 🌅 Initializing your AI workspace for today's adventures.",
        'Morning, {name}! ☀️ Your intelligent agents are waking up and ready to assist you.'
      ],
      afternoon: [
        'Good afternoon, {name}! 🌤️ Your Quantum Dashboard is optimized for peak performance.',
        'Afternoon, {name}! 🌞 Your AI workspace is running at full capacity.',
        'Hello, {name}! 🌤️ Your intelligent systems are ready for the afternoon session.'
      ],
      evening: [
        'Good evening, {name}! 🌙 Your Quantum Dashboard is ready for evening productivity.',
        'Evening, {name}! 🌆 Your AI workspace is prepared for your night session.',
        'Hello, {name}! 🌙 Your intelligent agents are ready for evening collaboration.'
      ],
      night: [
        'Good night, {name}! 🌃 Your Quantum Dashboard is ready for late-night productivity.',
        'Night, {name}! 🌌 Your AI workspace is optimized for nocturnal creativity.',
        'Hello, {name}! 🌃 Your intelligent systems are ready for night-time innovation.'
      ]
    },
    loading: [
      'Welcome back, {name}! Initializing your Quantum Dashboard...',
      'Hello, {name}! Setting up your personalized AI workspace...',
      'Hi, {name}! Preparing your intelligent agents for today...',
      'Welcome, {name}! Loading your customized AI environment...',
      'Hey, {name}! Activating your Quantum Autopilot systems...'
    ],
    error: [
      "Oops, {name}! Something went wrong, but don't worry - we're fixing it! 🔧",
      'Hey, {name}! We hit a small bump, but your AI agents are on it! 🤖',
      "Don't worry, {name}! Our Quantum Autopilot is already working on a solution! ⚡",
      'No problem, {name}! The intelligent systems are debugging this for you! 🛠️'
    ],
    success: [
      'Excellent work, {name}! Your Quantum Dashboard is performing optimally! 🎉',
      'Fantastic, {name}! Your AI workspace is running smoothly! ✨',
      'Outstanding, {name}! Your intelligent agents are working perfectly! 🤖',
      'Amazing, {name}! Your Quantum Autopilot is at peak performance! ⚡'
    ]
  };

  // Get user name
  const getUserName = useCallback(() => {
    if (userProfile?.displayName) return userProfile.displayName;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  }, [user, userProfile]);

  // Get time of day
  const getTimeOfDay = useCallback(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
  }, []);

  // Generate personalized message
  const generateMessage = useCallback(
    (type, context = '') => {
      const name = getUserName();
      const timeOfDay = getTimeOfDay();

      let templates;
      if (type === 'welcome') {
        templates = messageTemplates.welcome[timeOfDay];
      } else {
        templates = messageTemplates[type] || messageTemplates.loading;
      }

      const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
      return randomTemplate.replace('{name}', name);
    },
    [getUserName, getTimeOfDay]
  );

  // Get contextual message
  const getContextualMessage = useCallback(
    activity => {
      const name = getUserName();

      const contextualMessages = {
        login: `Welcome back, ${name}! Your Quantum Dashboard is ready.`,
        logout: `See you later, ${name}! Your AI agents will keep everything running smoothly.`,
        dashboard: `Here's your personalized dashboard, ${name}!`,
        settings: `Customizing your experience, ${name}!`,
        apps: `Loading your smart applications, ${name}!`,
        agents: `Activating your AI agents, ${name}!`,
        quantum: `Initializing Quantum Autopilot for ${name}!`,
        error: `Don't worry, ${name}! Our AI is fixing this for you.`,
        success: `Perfect, ${name}! Everything is working smoothly.`
      };

      return contextualMessages[activity] || `Hello, ${name}! Your AIOS is ready.`;
    },
    [getUserName]
  );

  // Get system status message
  const getSystemStatusMessage = useCallback(
    status => {
      const name = getUserName();

      const statusMessages = {
        online: `All systems operational for ${name}! 🟢`,
        offline: `${name}, we're working to restore your connection! 🔧`,
        maintenance: `Scheduled maintenance for ${name}'s workspace - back soon! ⚙️`,
        error: `Troubleshooting for ${name} - our AI agents are on it! 🤖`,
        loading: `Preparing ${name}'s personalized environment... ⚡`
      };

      return statusMessages[status] || `System status for ${name}: ${status}`;
    },
    [getUserName]
  );

  // Get AI response
  const getAIResponse = useCallback(
    query => {
      const name = getUserName();

      const responses = [
        `I understand, ${name}. Let me help you with that.`,
        `Great question, ${name}! Here's what I found.`,
        `Absolutely, ${name}! I'm processing that for you.`,
        `Perfect, ${name}! Let me get that information.`,
        `Of course, ${name}! Your AI assistant is here to help.`
      ];

      return responses[Math.floor(Math.random() * responses.length)];
    },
    [getUserName]
  );

  // Update messages when user changes
  useEffect(() => {
    if (user && userProfile) {
      setMessages({
        welcome: generateMessage('welcome'),
        loading: generateMessage('loading'),
        error: generateMessage('error'),
        success: generateMessage('success'),
        contextual: getContextualMessage('dashboard')
      });
    }
  }, [user, userProfile, generateMessage, getContextualMessage]);

  return {
    messages,
    generateMessage,
    getContextualMessage,
    getSystemStatusMessage,
    getAIResponse,
    getUserName,
    getTimeOfDay
  };
};

export default usePersonalizedMessages;
