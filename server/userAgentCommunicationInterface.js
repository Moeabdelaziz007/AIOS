/**
 * 💬 User-Agent Communication Interface
 *
 * Advanced communication system between users and AIOS agents
 */

class UserAgentCommunicationInterface {
  constructor() {
    this.conversations = new Map();
    this.userProfiles = new Map();
    this.agentCapabilities = new Map();
    this.communicationHistory = new Map();
    this.activeSessions = new Map();

    this.initializeAgentCapabilities();
    this.setupCommunicationProtocols();
  }

  /**
   * Initialize agent capabilities
   */
  initializeAgentCapabilities() {
    this.agentCapabilities.set('smart_agent', {
      name: 'Smart Agent',
      capabilities: [
        'natural_language_processing',
        'code_analysis',
        'web_search',
        'data_analysis',
        'problem_solving',
        'creative_writing',
        'translation',
        'summarization',
      ],
      personality: 'helpful',
      responseStyle: 'detailed',
      expertise: ['programming', 'data_science', 'general_knowledge'],
    });

    this.agentCapabilities.set('data_agent', {
      name: 'Data Agent',
      capabilities: [
        'data_collection',
        'data_analysis',
        'statistical_analysis',
        'data_visualization',
        'pattern_recognition',
        'predictive_modeling',
        'report_generation',
        'data_cleaning',
      ],
      personality: 'analytical',
      responseStyle: 'data_driven',
      expertise: ['statistics', 'machine_learning', 'data_engineering'],
    });

    this.agentCapabilities.set('debug_agent', {
      name: 'Debug Agent',
      capabilities: [
        'error_detection',
        'performance_analysis',
        'log_analysis',
        'system_diagnostics',
        'troubleshooting',
        'optimization',
        'security_scanning',
        'health_monitoring',
      ],
      personality: 'methodical',
      responseStyle: 'technical',
      expertise: [
        'system_administration',
        'debugging',
        'performance_optimization',
      ],
    });

    this.agentCapabilities.set('learning_agent', {
      name: 'Learning Agent',
      capabilities: [
        'pattern_recognition',
        'system_learning',
        'behavior_analysis',
        'optimization',
        'prediction',
        'recommendation',
        'adaptive_learning',
        'knowledge_extraction',
      ],
      personality: 'curious',
      responseStyle: 'insightful',
      expertise: [
        'machine_learning',
        'artificial_intelligence',
        'cognitive_science',
      ],
    });
  }

  /**
   * Setup communication protocols
   */
  setupCommunicationProtocols() {
    // Protocol handlers for different communication types
    this.protocols = {
      text: this.handleTextCommunication.bind(this),
      command: this.handleCommandCommunication.bind(this),
      query: this.handleQueryCommunication.bind(this),
      request: this.handleRequestCommunication.bind(this),
      feedback: this.handleFeedbackCommunication.bind(this),
    };
  }

  /**
   * Start communication session
   */
  async startSession(userId, agentId, context = {}) {
    const sessionId = `${userId}_${agentId}_${Date.now()}`;

    const session = {
      id: sessionId,
      userId,
      agentId,
      startTime: new Date(),
      lastActivity: new Date(),
      context,
      messages: [],
      status: 'active',
      preferences: this.getUserPreferences(userId),
    };

    this.activeSessions.set(sessionId, session);

    // Initialize conversation if not exists
    if (!this.conversations.has(userId)) {
      this.conversations.set(userId, new Map());
    }

    this.conversations.get(userId).set(agentId, sessionId);

    console.log(`💬 Communication session started: ${sessionId}`);
    return sessionId;
  }

  /**
   * Process user message
   */
  async processMessage(sessionId, message, messageType = 'text') {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const agentCapability = this.agentCapabilities.get(session.agentId);
    if (!agentCapability) {
      throw new Error(`Agent ${session.agentId} not found`);
    }

    // Update session activity
    session.lastActivity = new Date();

    // Add message to session
    const userMessage = {
      id: `msg_${Date.now()}`,
      type: messageType,
      content: message,
      timestamp: new Date(),
      sender: 'user',
      sessionId,
    };

    session.messages.push(userMessage);

    // Process message based on type
    const protocol = this.protocols[messageType];
    if (!protocol) {
      throw new Error(`Unknown message type: ${messageType}`);
    }

    const response = await protocol(session, userMessage, agentCapability);

    // Add agent response to session
    const agentMessage = {
      id: `msg_${Date.now()}_agent`,
      type: 'response',
      content: response.content,
      timestamp: new Date(),
      sender: 'agent',
      sessionId,
      metadata: response.metadata,
    };

    session.messages.push(agentMessage);

    // Log communication
    this.logCommunication(sessionId, userMessage, agentMessage);

    return {
      sessionId,
      response: agentMessage,
      context: session.context,
    };
  }

  /**
   * Handle text communication
   */
  async handleTextCommunication(session, message, agentCapability) {
    const { content } = message;

    // Analyze message intent
    const intent = await this.analyzeIntent(content, agentCapability);

    // Generate appropriate response
    const response = await this.generateResponse(
      content,
      intent,
      agentCapability,
      session
    );

    return {
      content: response.text,
      metadata: {
        intent,
        confidence: response.confidence,
        agent: agentCapability.name,
        capabilities: agentCapability.capabilities,
      },
    };
  }

  /**
   * Handle command communication
   */
  async handleCommandCommunication(session, message, agentCapability) {
    const { content } = message;

    // Parse command
    const command = this.parseCommand(content);

    // Execute command
    const result = await this.executeCommand(command, session, agentCapability);

    return {
      content: result.message,
      metadata: {
        command: command.name,
        parameters: command.parameters,
        result: result.data,
        agent: agentCapability.name,
      },
    };
  }

  /**
   * Handle query communication
   */
  async handleQueryCommunication(session, message, agentCapability) {
    const { content } = message;

    // Process query
    const queryResult = await this.processQuery(
      content,
      agentCapability,
      session
    );

    return {
      content: queryResult.answer,
      metadata: {
        query: content,
        sources: queryResult.sources,
        confidence: queryResult.confidence,
        agent: agentCapability.name,
      },
    };
  }

  /**
   * Handle request communication
   */
  async handleRequestCommunication(session, message, agentCapability) {
    const { content } = message;

    // Process request
    const requestResult = await this.processRequest(
      content,
      agentCapability,
      session
    );

    return {
      content: requestResult.response,
      metadata: {
        request: content,
        status: requestResult.status,
        data: requestResult.data,
        agent: agentCapability.name,
      },
    };
  }

  /**
   * Handle feedback communication
   */
  async handleFeedbackCommunication(session, message, agentCapability) {
    const { content } = message;

    // Process feedback
    const feedbackResult = await this.processFeedback(
      content,
      session,
      agentCapability
    );

    return {
      content: feedbackResult.acknowledgment,
      metadata: {
        feedback: content,
        processed: feedbackResult.processed,
        improvements: feedbackResult.improvements,
        agent: agentCapability.name,
      },
    };
  }

  /**
   * Analyze message intent
   */
  async analyzeIntent(message, agentCapability) {
    // Simple intent analysis (in real implementation, use NLP)
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('help') || lowerMessage.includes('how')) {
      return { type: 'help', confidence: 0.9 };
    }

    if (lowerMessage.includes('analyze') || lowerMessage.includes('check')) {
      return { type: 'analysis', confidence: 0.8 };
    }

    if (lowerMessage.includes('error') || lowerMessage.includes('problem')) {
      return { type: 'troubleshooting', confidence: 0.9 };
    }

    if (lowerMessage.includes('data') || lowerMessage.includes('statistics')) {
      return { type: 'data_request', confidence: 0.8 };
    }

    if (lowerMessage.includes('learn') || lowerMessage.includes('pattern')) {
      return { type: 'learning', confidence: 0.7 };
    }

    return { type: 'general', confidence: 0.6 };
  }

  /**
   * Generate response
   */
  async generateResponse(message, intent, agentCapability, session) {
    const responses = {
      help: `I'm the ${agentCapability.name}. I can help you with: ${agentCapability.capabilities.join(', ')}. What would you like to know?`,
      analysis: `I'll analyze that for you. As a ${agentCapability.name}, I specialize in ${agentCapability.expertise.join(', ')}.`,
      troubleshooting: `Let me help you troubleshoot this issue. I'll check the system and provide a solution.`,
      data_request: `I can help you with data analysis. I have expertise in ${agentCapability.expertise.join(', ')}.`,
      learning: `I'm designed to learn and adapt. Let me analyze the patterns and provide insights.`,
      general: `I understand you're asking about: "${message}". As the ${agentCapability.name}, I can help with ${agentCapability.capabilities.join(', ')}.`,
    };

    return {
      text: responses[intent.type] || responses.general,
      confidence: intent.confidence,
    };
  }

  /**
   * Parse command
   */
  parseCommand(message) {
    const parts = message.split(' ');
    return {
      name: parts[0],
      parameters: parts.slice(1),
      original: message,
    };
  }

  /**
   * Execute command
   */
  async executeCommand(command, session, agentCapability) {
    // Mock command execution
    return {
      message: `Executed command: ${command.name} with parameters: ${command.parameters.join(', ')}`,
      data: {
        command: command.name,
        parameters: command.parameters,
        executed: true,
        timestamp: new Date(),
      },
    };
  }

  /**
   * Process query
   */
  async processQuery(query, agentCapability, session) {
    // Mock query processing
    return {
      answer: `Based on your query "${query}", here's what I found using my ${agentCapability.expertise.join(', ')} expertise.`,
      sources: ['AIOS Knowledge Base', 'System Logs', 'User Data'],
      confidence: 0.85,
    };
  }

  /**
   * Process request
   */
  async processRequest(request, agentCapability, session) {
    // Mock request processing
    return {
      response: `I've processed your request: "${request}". As the ${agentCapability.name}, I can handle this using my ${agentCapability.capabilities.join(', ')} capabilities.`,
      status: 'completed',
      data: {
        request,
        processed: true,
        timestamp: new Date(),
      },
    };
  }

  /**
   * Process feedback
   */
  async processFeedback(feedback, session, agentCapability) {
    // Mock feedback processing
    return {
      acknowledgment: `Thank you for your feedback: "${feedback}". I'll use this to improve my responses.`,
      processed: true,
      improvements: ['Response accuracy', 'Response time', 'User satisfaction'],
    };
  }

  /**
   * Get user preferences
   */
  getUserPreferences(userId) {
    if (!this.userProfiles.has(userId)) {
      this.userProfiles.set(userId, {
        userId,
        preferences: {
          responseStyle: 'detailed',
          notificationLevel: 'medium',
          language: 'en',
          timezone: 'UTC',
        },
        communicationHistory: [],
        createdAt: new Date(),
      });
    }

    return this.userProfiles.get(userId).preferences;
  }

  /**
   * Log communication
   */
  logCommunication(sessionId, userMessage, agentMessage) {
    if (!this.communicationHistory.has(sessionId)) {
      this.communicationHistory.set(sessionId, []);
    }

    this.communicationHistory.get(sessionId).push({
      userMessage,
      agentMessage,
      timestamp: new Date(),
    });
  }

  /**
   * Get session history
   */
  getSessionHistory(sessionId, limit = 50) {
    const history = this.communicationHistory.get(sessionId) || [];
    return history.slice(-limit);
  }

  /**
   * Get active sessions
   */
  getActiveSessions(userId = null) {
    if (userId) {
      return Array.from(this.activeSessions.values()).filter(
        session => session.userId === userId && session.status === 'active'
      );
    }

    return Array.from(this.activeSessions.values()).filter(
      session => session.status === 'active'
    );
  }

  /**
   * End session
   */
  endSession(sessionId) {
    const session = this.activeSessions.get(sessionId);
    if (session) {
      session.status = 'ended';
      session.endTime = new Date();

      // Remove from active sessions
      this.activeSessions.delete(sessionId);

      console.log(`💬 Communication session ended: ${sessionId}`);
      return true;
    }

    return false;
  }

  /**
   * Get agent recommendations
   */
  getAgentRecommendations(userId, query) {
    const userPreferences = this.getUserPreferences(userId);
    const recommendations = [];

    for (const [agentId, capability] of this.agentCapabilities) {
      const score = this.calculateAgentScore(
        query,
        capability,
        userPreferences
      );
      if (score > 0.5) {
        recommendations.push({
          agentId,
          agent: capability.name,
          score,
          reason: `Best match for ${capability.expertise.join(', ')}`,
        });
      }
    }

    return recommendations.sort((a, b) => b.score - a.score);
  }

  /**
   * Calculate agent score
   */
  calculateAgentScore(query, capability, preferences) {
    let score = 0;
    const lowerQuery = query.toLowerCase();

    // Check expertise match
    capability.expertise.forEach(expertise => {
      if (lowerQuery.includes(expertise.toLowerCase())) {
        score += 0.3;
      }
    });

    // Check capability match
    capability.capabilities.forEach(capability => {
      if (lowerQuery.includes(capability.toLowerCase())) {
        score += 0.2;
      }
    });

    // Check personality match
    if (preferences.responseStyle === capability.responseStyle) {
      score += 0.1;
    }

    return Math.min(1, score);
  }

  /**
   * Get communication statistics
   */
  getCommunicationStats(userId = null) {
    const sessions = userId
      ? Array.from(this.activeSessions.values()).filter(
          s => s.userId === userId
        )
      : Array.from(this.activeSessions.values());

    const totalMessages = sessions.reduce(
      (total, session) => total + session.messages.length,
      0
    );
    const activeSessions = sessions.filter(s => s.status === 'active').length;

    return {
      totalSessions: sessions.length,
      activeSessions,
      totalMessages,
      averageMessagesPerSession:
        sessions.length > 0 ? totalMessages / sessions.length : 0,
      mostUsedAgent: this.getMostUsedAgent(sessions),
      averageSessionDuration: this.getAverageSessionDuration(sessions),
    };
  }

  /**
   * Get most used agent
   */
  getMostUsedAgent(sessions) {
    const agentCounts = {};
    sessions.forEach(session => {
      agentCounts[session.agentId] = (agentCounts[session.agentId] || 0) + 1;
    });

    return Object.keys(agentCounts).reduce(
      (a, b) => (agentCounts[a] > agentCounts[b] ? a : b),
      'smart_agent'
    );
  }

  /**
   * Get average session duration
   */
  getAverageSessionDuration(sessions) {
    const durations = sessions
      .filter(s => s.endTime)
      .map(s => s.endTime - s.startTime);

    return durations.length > 0
      ? durations.reduce((a, b) => a + b, 0) / durations.length
      : 0;
  }
}

module.exports = UserAgentCommunicationInterface;
