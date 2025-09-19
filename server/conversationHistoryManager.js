/**
 * Conversation History Manager
 * Handles persistent storage and retrieval of conversation history
 */

const {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  doc,
  updateDoc,
  deleteDoc,
} = require('firebase/firestore');
const { db } = require('./firestoreDataStorage');

class ConversationHistoryManager {
  constructor() {
    this.collectionName = 'conversations';
    this.maxHistoryPerUser = 100; // Maximum conversations per user
    this.maxMessagesPerConversation = 50; // Maximum messages per conversation
  }

  /**
   * Save a conversation message
   */
  async saveMessage(userId, conversationId, message, response, metadata = {}) {
    try {
      const messageData = {
        userId,
        conversationId,
        message: {
          text: message,
          timestamp: new Date().toISOString(),
          type: 'user',
        },
        response: {
          text: response.text || response,
          timestamp: new Date().toISOString(),
          type: 'assistant',
          tools: response.tools || [],
          context: response.context || null,
        },
        metadata: {
          ...metadata,
          sessionId: metadata.sessionId || this.generateSessionId(),
          deviceInfo: metadata.deviceInfo || {},
          userAgent: metadata.userAgent || 'unknown',
        },
      };

      const docRef = await addDoc(
        collection(db, this.collectionName),
        messageData
      );
      console.log(`💬 Saved conversation message: ${docRef.id}`);

      return docRef.id;
    } catch (error) {
      console.error('❌ Failed to save conversation message:', error);
      throw error;
    }
  }

  /**
   * Get conversation history for a user
   */
  async getConversationHistory(userId, conversationId = null, limitCount = 20) {
    try {
      let q;

      if (conversationId) {
        // Get specific conversation
        q = query(
          collection(db, this.collectionName),
          where('userId', '==', userId),
          where('conversationId', '==', conversationId),
          orderBy('message.timestamp', 'desc'),
          limit(limitCount)
        );
      } else {
        // Get all conversations for user
        q = query(
          collection(db, this.collectionName),
          where('userId', '==', userId),
          orderBy('message.timestamp', 'desc'),
          limit(limitCount)
        );
      }

      const snapshot = await getDocs(q);
      const conversations = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log(
        `📚 Retrieved ${conversations.length} conversation messages for user ${userId}`
      );
      return conversations;
    } catch (error) {
      console.error('❌ Failed to get conversation history:', error);
      return [];
    }
  }

  /**
   * Get conversation summaries for a user
   */
  async getConversationSummaries(userId, limitCount = 10) {
    try {
      const conversations = await this.getConversationHistory(
        userId,
        null,
        limitCount
      );

      // Group by conversationId and create summaries
      const conversationMap = new Map();

      conversations.forEach(conv => {
        const convId = conv.conversationId;
        if (!conversationMap.has(convId)) {
          conversationMap.set(convId, {
            conversationId: convId,
            userId: conv.userId,
            firstMessage: conv.message.text,
            lastMessage: conv.message.text,
            messageCount: 1,
            lastActivity: conv.message.timestamp,
            topics: this.extractTopics(conv.message.text),
            tools: conv.response.tools || [],
          });
        } else {
          const summary = conversationMap.get(convId);
          summary.messageCount++;
          summary.lastActivity = conv.message.timestamp;
          summary.topics = [
            ...new Set([
              ...summary.topics,
              ...this.extractTopics(conv.message.text),
            ]),
          ];
        }
      });

      const summaries = Array.from(conversationMap.values()).sort(
        (a, b) => new Date(b.lastActivity) - new Date(a.lastActivity)
      );

      console.log(
        `📋 Generated ${summaries.length} conversation summaries for user ${userId}`
      );
      return summaries;
    } catch (error) {
      console.error('❌ Failed to get conversation summaries:', error);
      return [];
    }
  }

  /**
   * Search conversation history
   */
  async searchConversations(userId, searchTerm, limitCount = 20) {
    try {
      const conversations = await this.getConversationHistory(
        userId,
        null,
        100
      );

      const filtered = conversations.filter(
        conv =>
          conv.message.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
          conv.response.text.toLowerCase().includes(searchTerm.toLowerCase())
      );

      console.log(
        `🔍 Found ${filtered.length} conversations matching "${searchTerm}"`
      );
      return filtered.slice(0, limitCount);
    } catch (error) {
      console.error('❌ Failed to search conversations:', error);
      return [];
    }
  }

  /**
   * Delete conversation history
   */
  async deleteConversation(userId, conversationId) {
    try {
      const conversations = await this.getConversationHistory(
        userId,
        conversationId
      );

      for (const conv of conversations) {
        await deleteDoc(doc(db, this.collectionName, conv.id));
      }

      console.log(
        `🗑️ Deleted conversation ${conversationId} for user ${userId}`
      );
      return true;
    } catch (error) {
      console.error('❌ Failed to delete conversation:', error);
      return false;
    }
  }

  /**
   * Clean up old conversations
   */
  async cleanupOldConversations(userId, daysOld = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const conversations = await this.getConversationHistory(
        userId,
        null,
        1000
      );
      const oldConversations = conversations.filter(
        conv => new Date(conv.message.timestamp) < cutoffDate
      );

      let deletedCount = 0;
      for (const conv of oldConversations) {
        await deleteDoc(doc(db, this.collectionName, conv.id));
        deletedCount++;
      }

      console.log(
        `🧹 Cleaned up ${deletedCount} old conversations for user ${userId}`
      );
      return deletedCount;
    } catch (error) {
      console.error('❌ Failed to cleanup old conversations:', error);
      return 0;
    }
  }

  /**
   * Extract topics from text
   */
  extractTopics(text) {
    const topics = [];
    const commonTopics = [
      'code',
      'programming',
      'debug',
      'error',
      'fix',
      'help',
      'data',
      'analysis',
      'chart',
      'graph',
      'visualization',
      'system',
      'performance',
      'monitor',
      'health',
      'search',
      'find',
      'query',
      'database',
      'api',
      'integration',
      'webhook',
      'service',
    ];

    const lowerText = text.toLowerCase();
    commonTopics.forEach(topic => {
      if (lowerText.includes(topic)) {
        topics.push(topic);
      }
    });

    return topics;
  }

  /**
   * Generate session ID
   */
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get conversation analytics
   */
  async getConversationAnalytics(userId, days = 30) {
    try {
      const conversations = await this.getConversationHistory(
        userId,
        null,
        1000
      );
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const recentConversations = conversations.filter(
        conv => new Date(conv.message.timestamp) >= cutoffDate
      );

      const analytics = {
        totalConversations: recentConversations.length,
        totalMessages: recentConversations.length * 2, // user + assistant
        averageMessagesPerConversation:
          recentConversations.length > 0
            ? (recentConversations.length * 2) / recentConversations.length
            : 0,
        mostUsedTools: this.getMostUsedTools(recentConversations),
        topTopics: this.getTopTopics(recentConversations),
        activityByDay: this.getActivityByDay(recentConversations),
        responseTime: this.calculateAverageResponseTime(recentConversations),
      };

      console.log(`📊 Generated conversation analytics for user ${userId}`);
      return analytics;
    } catch (error) {
      console.error('❌ Failed to get conversation analytics:', error);
      return null;
    }
  }

  /**
   * Get most used tools
   */
  getMostUsedTools(conversations) {
    const toolCounts = {};
    conversations.forEach(conv => {
      if (conv.response.tools) {
        conv.response.tools.forEach(tool => {
          toolCounts[tool] = (toolCounts[tool] || 0) + 1;
        });
      }
    });

    return Object.entries(toolCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([tool, count]) => ({ tool, count }));
  }

  /**
   * Get top topics
   */
  getTopTopics(conversations) {
    const topicCounts = {};
    conversations.forEach(conv => {
      const topics = this.extractTopics(conv.message.text);
      topics.forEach(topic => {
        topicCounts[topic] = (topicCounts[topic] || 0) + 1;
      });
    });

    return Object.entries(topicCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([topic, count]) => ({ topic, count }));
  }

  /**
   * Get activity by day
   */
  getActivityByDay(conversations) {
    const activity = {};
    conversations.forEach(conv => {
      const date = new Date(conv.message.timestamp).toDateString();
      activity[date] = (activity[date] || 0) + 1;
    });

    return activity;
  }

  /**
   * Calculate average response time
   */
  calculateAverageResponseTime(conversations) {
    let totalTime = 0;
    let validResponses = 0;

    conversations.forEach(conv => {
      const messageTime = new Date(conv.message.timestamp).getTime();
      const responseTime = new Date(conv.response.timestamp).getTime();
      const responseDelay = responseTime - messageTime;

      if (responseDelay > 0 && responseDelay < 300000) {
        // Less than 5 minutes
        totalTime += responseDelay;
        validResponses++;
      }
    });

    return validResponses > 0 ? totalTime / validResponses : 0;
  }
}

module.exports = ConversationHistoryManager;
