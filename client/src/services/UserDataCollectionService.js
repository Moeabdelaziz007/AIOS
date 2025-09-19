/**
 * Comprehensive User Data Collection Service
 * Collects and processes user data for AIOS system
 */

import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { db } from './FirebaseService';

class UserDataCollectionService {
  constructor() {
    this.collectedData = new Map();
    this.userSessions = new Map();
    this.analyticsData = [];
  }

  /**
   * Collect comprehensive user data
   */
  async collectUserData(user, additionalData = {}) {
    try {
      const userData = {
        // Basic user info
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        phoneNumber: user.phoneNumber,
        isAnonymous: user.isAnonymous,

        // Additional profile data
        fullName: additionalData.fullName || '',
        company: additionalData.company || '',
        jobTitle: additionalData.jobTitle || '',
        location: additionalData.location || '',
        interests: additionalData.interests || [],

        // System data
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        screenResolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        referrer: document.referrer,
        sessionId: this.generateSessionId(),

        // Device information
        deviceInfo: {
          vendor: navigator.vendor,
          cookieEnabled: navigator.cookieEnabled,
          onLine: navigator.onLine,
          hardwareConcurrency: navigator.hardwareConcurrency,
          maxTouchPoints: navigator.maxTouchPoints,
          deviceMemory: navigator.deviceMemory || 'unknown',
        },

        // Browser information
        browserInfo: {
          name: this.getBrowserName(),
          version: this.getBrowserVersion(),
          engine: this.getBrowserEngine(),
        },

        // Network information
        networkInfo: {
          connectionType: navigator.connection?.effectiveType || 'unknown',
          downlink: navigator.connection?.downlink || 'unknown',
          rtt: navigator.connection?.rtt || 'unknown',
        },

        // Performance data
        performanceData: {
          memoryUsage: performance.memory
            ? {
                usedJSHeapSize: performance.memory.usedJSHeapSize,
                totalJSHeapSize: performance.memory.totalJSHeapSize,
                jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
              }
            : null,
          timing: performance.timing
            ? {
                navigationStart: performance.timing.navigationStart,
                loadEventEnd: performance.timing.loadEventEnd,
                domContentLoadedEventEnd:
                  performance.timing.domContentLoadedEventEnd,
              }
            : null,
        },

        // Behavioral data
        behaviorData: {
          loginMethod: additionalData.loginMethod || 'email',
          rememberMe: additionalData.rememberMe || false,
          darkMode: additionalData.darkMode || false,
          sessionStartTime: new Date().toISOString(),
          pageViews: 1,
          interactions: [],
        },

        // Privacy and consent
        privacyConsent: {
          dataCollection: true,
          analytics: true,
          marketing: additionalData.marketingConsent || false,
          timestamp: new Date().toISOString(),
        },
      };

      // Store in local collection
      this.collectedData.set(user.uid, userData);

      // Send to Firestore
      await this.sendToFirestore(userData);

      // Send to Telegram
      await this.sendToTelegram(userData);

      console.log('📊 Comprehensive user data collected:', userData);
      return userData;
    } catch (error) {
      console.error('❌ Failed to collect user data:', error);
      return null;
    }
  }

  /**
   * Send user data to Firestore
   */
  async sendToFirestore(userData) {
    try {
      // Store in users collection
      await addDoc(collection(db, 'users'), userData);

      // Store in analytics collection
      await addDoc(collection(db, 'userAnalytics'), {
        userId: userData.uid,
        timestamp: userData.timestamp,
        event: 'user_registration',
        data: userData,
      });

      // Store in sessions collection
      await addDoc(collection(db, 'userSessions'), {
        userId: userData.uid,
        sessionId: userData.sessionId,
        startTime: userData.behaviorData.sessionStartTime,
        userAgent: userData.userAgent,
        deviceInfo: userData.deviceInfo,
        browserInfo: userData.browserInfo,
        networkInfo: userData.networkInfo,
      });

      console.log('✅ User data sent to Firestore');
    } catch (error) {
      console.error('❌ Failed to send to Firestore:', error);
    }
  }

  /**
   * Send user data to Telegram
   */
  async sendToTelegram(userData) {
    try {
      const message = `👤 **NEW USER REGISTRATION**

**🔐 Basic Info:**
• **UID:** ${userData.uid}
• **Email:** ${userData.email || 'Not provided'}
• **Name:** ${userData.displayName || userData.fullName || 'Not provided'}
• **Phone:** ${userData.phoneNumber || 'Not provided'}
• **Anonymous:** ${userData.isAnonymous ? 'Yes' : 'No'}

**🏢 Professional Info:**
• **Company:** ${userData.company || 'Not provided'}
• **Job Title:** ${userData.jobTitle || 'Not provided'}
• **Location:** ${userData.location || 'Not provided'}
• **Interests:** ${userData.interests.join(', ') || 'Not provided'}

**💻 Technical Info:**
• **Browser:** ${userData.browserInfo.name} ${userData.browserInfo.version}
• **Platform:** ${userData.platform}
• **Screen:** ${userData.screenResolution}
• **Language:** ${userData.language}
• **Timezone:** ${userData.timezone}

**📱 Device Info:**
• **Vendor:** ${userData.deviceInfo.vendor}
• **Memory:** ${userData.deviceInfo.deviceMemory}GB
• **CPU Cores:** ${userData.deviceInfo.hardwareConcurrency}
• **Touch Points:** ${userData.deviceInfo.maxTouchPoints}

**🌐 Network Info:**
• **Connection:** ${userData.networkInfo.connectionType}
• **Speed:** ${userData.networkInfo.downlink}Mbps
• **Latency:** ${userData.networkInfo.rtt}ms

**📊 Session Info:**
• **Login Method:** ${userData.behaviorData.loginMethod}
• **Session ID:** ${userData.sessionId}
• **Dark Mode:** ${userData.behaviorData.darkMode ? 'Yes' : 'No'}
• **Remember Me:** ${userData.behaviorData.rememberMe ? 'Yes' : 'No'}

**⏰ Timestamp:** ${new Date(userData.timestamp).toLocaleString()}`;

      // Send to Telegram via API
      await fetch('/api/telegram/send-user-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          userData: userData,
        }),
      });

      console.log('✅ User data sent to Telegram');
    } catch (error) {
      console.error('❌ Failed to send to Telegram:', error);
    }
  }

  /**
   * Track user behavior
   */
  async trackUserBehavior(userId, action, metadata = {}) {
    try {
      const behaviorData = {
        userId,
        action,
        timestamp: new Date().toISOString(),
        metadata: {
          ...metadata,
          pageUrl: window.location.href,
          referrer: document.referrer,
          sessionId: this.getSessionId(userId),
        },
      };

      // Store locally
      if (this.userSessions.has(userId)) {
        const session = this.userSessions.get(userId);
        session.interactions.push(behaviorData);
        this.userSessions.set(userId, session);
      }

      // Send to Firestore
      await addDoc(collection(db, 'userBehavior'), behaviorData);

      console.log('📊 User behavior tracked:', behaviorData);
    } catch (error) {
      console.error('❌ Failed to track user behavior:', error);
    }
  }

  /**
   * Update user profile data
   */
  async updateUserProfile(userId, profileData) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        ...profileData,
        lastUpdated: new Date().toISOString(),
      });

      console.log('✅ User profile updated');
    } catch (error) {
      console.error('❌ Failed to update user profile:', error);
    }
  }

  /**
   * Get comprehensive user analytics
   */
  async getUserAnalytics(userId) {
    try {
      const userData = this.collectedData.get(userId);
      const sessionData = this.userSessions.get(userId);

      return {
        userData,
        sessionData,
        totalInteractions: sessionData?.interactions.length || 0,
        sessionDuration: this.calculateSessionDuration(sessionData),
        deviceInfo: userData?.deviceInfo,
        behaviorPatterns: this.analyzeBehaviorPatterns(
          sessionData?.interactions || []
        ),
      };
    } catch (error) {
      console.error('❌ Failed to get user analytics:', error);
      return null;
    }
  }

  // Helper methods
  generateSessionId() {
    return (
      'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    );
  }

  getSessionId(userId) {
    return this.userSessions.get(userId)?.sessionId || this.generateSessionId();
  }

  getBrowserName() {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Unknown';
  }

  getBrowserVersion() {
    const userAgent = navigator.userAgent;
    const match = userAgent.match(/(Chrome|Firefox|Safari|Edge)\/(\d+\.\d+)/);
    return match ? match[2] : 'Unknown';
  }

  getBrowserEngine() {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('WebKit')) return 'WebKit';
    if (userAgent.includes('Gecko')) return 'Gecko';
    if (userAgent.includes('Blink')) return 'Blink';
    return 'Unknown';
  }

  calculateSessionDuration(sessionData) {
    if (!sessionData) return 0;
    const startTime = new Date(sessionData.startTime);
    const currentTime = new Date();
    return Math.floor((currentTime - startTime) / 1000); // seconds
  }

  analyzeBehaviorPatterns(interactions) {
    const patterns = {
      mostUsedFeatures: [],
      averageTimeBetweenActions: 0,
      totalActions: interactions.length,
      actionTypes: {},
    };

    // Analyze action types
    interactions.forEach(interaction => {
      patterns.actionTypes[interaction.action] =
        (patterns.actionTypes[interaction.action] || 0) + 1;
    });

    // Find most used features
    patterns.mostUsedFeatures = Object.entries(patterns.actionTypes)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([action]) => action);

    return patterns;
  }
}

export default UserDataCollectionService;
