/**
 * 🧠 Personalized Smart Messages Service
 *
 * This service provides personalized, contextual messages for the AIOS system
 * with user-specific greetings and dynamic content based on user profile data.
 */

class PersonalizedMessageService {
  constructor() {
    this.userProfiles = new Map();
    this.messageTemplates = {
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
      loading: {
        personalized: [
          'Welcome back, {name}! Initializing your Quantum Dashboard...',
          'Hello, {name}! Setting up your personalized AI workspace...',
          'Hi, {name}! Preparing your intelligent agents for today...',
          'Welcome, {name}! Loading your customized AI environment...',
          'Hey, {name}! Activating your Quantum Autopilot systems...'
        ],
        contextual: [
          'Loading your {role} workspace, {name}...',
          'Preparing your {department} dashboard, {name}...',
          'Setting up your {preference} environment, {name}...',
          'Initializing your {theme} interface, {name}...'
        ]
      },
      error: {
        friendly: [
          "Oops, {name}! Something went wrong, but don't worry - we're fixing it! 🔧",
          'Hey, {name}! We hit a small bump, but your AI agents are on it! 🤖',
          "Don't worry, {name}! Our Quantum Autopilot is already working on a solution! ⚡",
          'No problem, {name}! The intelligent systems are debugging this for you! 🛠️'
        ],
        encouraging: [
          'Keep going, {name}! Every error is a step closer to perfection! 💪',
          "You've got this, {name}! The AI is learning from this experience! 🧠",
          'Stay strong, {name}! Your Quantum Dashboard is getting smarter! ⚡',
          'Almost there, {name}! The intelligent agents are optimizing everything! 🚀'
        ]
      },
      success: {
        achievement: [
          'Excellent work, {name}! Your Quantum Dashboard is performing optimally! 🎉',
          'Fantastic, {name}! Your AI workspace is running smoothly! ✨',
          'Outstanding, {name}! Your intelligent agents are working perfectly! 🤖',
          'Amazing, {name}! Your Quantum Autopilot is at peak performance! ⚡'
        ],
        completion: [
          'All set, {name}! Your personalized AI environment is ready! 🚀',
          'Perfect, {name}! Your Quantum Dashboard is fully operational! ✨',
          'Complete, {name}! Your intelligent workspace is active! 🎯',
          'Ready, {name}! Your AI agents are standing by! 🤖'
        ]
      }
    };
  }

  /**
   * Get personalized welcome message based on time and user profile
   */
  getWelcomeMessage(userProfile) {
    const name = userProfile?.displayName || userProfile?.email?.split('@')[0] || 'User';
    const hour = new Date().getHours();
    const timeOfDay = this.getTimeOfDay(hour);

    const templates = this.messageTemplates.welcome[timeOfDay];
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];

    return randomTemplate.replace('{name}', name);
  }

  /**
   * Get personalized loading message
   */
  getLoadingMessage(userProfile, context = '') {
    const name = userProfile?.displayName || userProfile?.email?.split('@')[0] || 'User';
    const role = userProfile?.role || 'user';
    const department = userProfile?.department || 'general';
    const preference = userProfile?.theme || 'default';

    let templates;
    if (context) {
      templates = this.messageTemplates.loading.contextual;
      const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
      return randomTemplate
        .replace('{name}', name)
        .replace('{role}', role)
        .replace('{department}', department)
        .replace('{preference}', preference);
    } else {
      templates = this.messageTemplates.loading.personalized;
      const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
      return randomTemplate.replace('{name}', name);
    }
  }

  /**
   * Get personalized error message
   */
  getErrorMessage(userProfile, errorType = 'friendly') {
    const name = userProfile?.displayName || userProfile?.email?.split('@')[0] || 'User';
    const templates = this.messageTemplates.error[errorType];
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];

    return randomTemplate.replace('{name}', name);
  }

  /**
   * Get personalized success message
   */
  getSuccessMessage(userProfile, successType = 'achievement') {
    const name = userProfile?.displayName || userProfile?.email?.split('@')[0] || 'User';
    const templates = this.messageTemplates.success[successType];
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];

    return randomTemplate.replace('{name}', name);
  }

  /**
   * Get contextual message based on user activity
   */
  getContextualMessage(userProfile, activity) {
    const name = userProfile?.displayName || userProfile?.email?.split('@')[0] || 'User';

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
  }

  /**
   * Get time of day based on hour
   */
  getTimeOfDay(hour) {
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
  }

  /**
   * Get personalized system status message
   */
  getSystemStatusMessage(userProfile, status) {
    const name = userProfile?.displayName || userProfile?.email?.split('@')[0] || 'User';

    const statusMessages = {
      online: `All systems operational for ${name}! 🟢`,
      offline: `${name}, we're working to restore your connection! 🔧`,
      maintenance: `Scheduled maintenance for ${name}'s workspace - back soon! ⚙️`,
      error: `Troubleshooting for ${name} - our AI agents are on it! 🤖`,
      loading: `Preparing ${name}'s personalized environment... ⚡`
    };

    return statusMessages[status] || `System status for ${name}: ${status}`;
  }

  /**
   * Get personalized notification message
   */
  getNotificationMessage(userProfile, notification) {
    const name = userProfile?.displayName || userProfile?.email?.split('@')[0] || 'User';

    return `${name}, ${notification}`;
  }

  /**
   * Update user profile for better personalization
   */
  updateUserProfile(userId, profile) {
    this.userProfiles.set(userId, {
      ...this.userProfiles.get(userId),
      ...profile,
      lastSeen: new Date(),
      messageCount: (this.userProfiles.get(userId)?.messageCount || 0) + 1
    });
  }

  /**
   * Get user profile
   */
  getUserProfile(userId) {
    return this.userProfiles.get(userId) || {};
  }

  /**
   * Get personalized AI response
   */
  getAIResponse(userProfile, query) {
    const name = userProfile?.displayName || userProfile?.email?.split('@')[0] || 'User';

    const responses = [
      `I understand, ${name}. Let me help you with that.`,
      `Great question, ${name}! Here's what I found.`,
      `Absolutely, ${name}! I'm processing that for you.`,
      `Perfect, ${name}! Let me get that information.`,
      `Of course, ${name}! Your AI assistant is here to help.`
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  }
}

// Export singleton instance
const personalizedMessageService = new PersonalizedMessageService();
module.exports = personalizedMessageService;
