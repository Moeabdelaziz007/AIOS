/**
 * User Preferences Manager
 * Handles user preferences, settings, and personalization
 */

const {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  setDoc,
} = require('firebase/firestore');
const { db } = require('./firestoreDataStorage');

class UserPreferencesManager {
  constructor() {
    this.collectionName = 'userPreferences';
    this.defaultPreferences = {
      // UI Preferences
      theme: 'auto', // 'light', 'dark', 'auto'
      language: 'en', // Language code
      fontSize: 'medium', // 'small', 'medium', 'large'
      animations: true,
      soundEffects: true,

      // AI Preferences
      aiPersonality: 'helpful', // 'helpful', 'professional', 'casual', 'technical'
      responseLength: 'detailed', // 'brief', 'detailed', 'comprehensive'
      autoSuggestions: true,
      learningEnabled: true,

      // Notification Preferences
      emailNotifications: true,
      pushNotifications: true,
      telegramNotifications: true,
      notificationFrequency: 'normal', // 'low', 'normal', 'high'
      quietHours: {
        enabled: false,
        start: '22:00',
        end: '08:00',
      },

      // Privacy Preferences
      dataCollection: true,
      analyticsSharing: true,
      conversationHistory: true,
      personalizedAds: false,

      // Accessibility
      highContrast: false,
      screenReader: false,
      keyboardNavigation: false,
      voiceCommands: false,

      // Advanced Features
      betaFeatures: false,
      experimentalAI: false,
      debugMode: false,
      performanceMode: 'balanced', // 'power', 'balanced', 'battery'
    };
  }

  /**
   * Get user preferences
   */
  async getUserPreferences(userId) {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('userId', '==', userId)
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        // Create default preferences for new user
        return await this.createDefaultPreferences(userId);
      }

      const preferences = snapshot.docs[0].data();
      console.log(`👤 Retrieved preferences for user ${userId}`);
      return preferences;
    } catch (error) {
      console.error('❌ Failed to get user preferences:', error);
      return this.defaultPreferences;
    }
  }

  /**
   * Update user preferences
   */
  async updateUserPreferences(userId, preferences) {
    try {
      const preferencesData = {
        userId,
        ...this.defaultPreferences,
        ...preferences,
        lastUpdated: new Date().toISOString(),
        version: '1.0',
      };

      const docRef = doc(db, this.collectionName, userId);
      await setDoc(docRef, preferencesData);

      console.log(`✅ Updated preferences for user ${userId}`);
      return preferencesData;
    } catch (error) {
      console.error('❌ Failed to update user preferences:', error);
      throw error;
    }
  }

  /**
   * Create default preferences for new user
   */
  async createDefaultPreferences(userId) {
    try {
      const defaultPrefs = {
        userId,
        ...this.defaultPreferences,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        version: '1.0',
      };

      const docRef = doc(db, this.collectionName, userId);
      await setDoc(docRef, defaultPrefs);

      console.log(`🆕 Created default preferences for user ${userId}`);
      return defaultPrefs;
    } catch (error) {
      console.error('❌ Failed to create default preferences:', error);
      return this.defaultPreferences;
    }
  }

  /**
   * Update specific preference category
   */
  async updatePreferenceCategory(userId, category, preferences) {
    try {
      const currentPrefs = await this.getUserPreferences(userId);
      const updatedPrefs = {
        ...currentPrefs,
        [category]: {
          ...currentPrefs[category],
          ...preferences,
        },
        lastUpdated: new Date().toISOString(),
      };

      return await this.updateUserPreferences(userId, updatedPrefs);
    } catch (error) {
      console.error(`❌ Failed to update ${category} preferences:`, error);
      throw error;
    }
  }

  /**
   * Reset preferences to default
   */
  async resetPreferences(userId) {
    try {
      return await this.createDefaultPreferences(userId);
    } catch (error) {
      console.error('❌ Failed to reset preferences:', error);
      throw error;
    }
  }

  /**
   * Get theme preferences
   */
  async getThemePreferences(userId) {
    try {
      const preferences = await this.getUserPreferences(userId);
      return {
        theme: preferences.theme,
        fontSize: preferences.fontSize,
        animations: preferences.animations,
        highContrast: preferences.highContrast,
      };
    } catch (error) {
      console.error('❌ Failed to get theme preferences:', error);
      return {
        theme: 'auto',
        fontSize: 'medium',
        animations: true,
        highContrast: false,
      };
    }
  }

  /**
   * Get AI preferences
   */
  async getAIPreferences(userId) {
    try {
      const preferences = await this.getUserPreferences(userId);
      return {
        personality: preferences.aiPersonality,
        responseLength: preferences.responseLength,
        autoSuggestions: preferences.autoSuggestions,
        learningEnabled: preferences.learningEnabled,
        experimentalAI: preferences.experimentalAI,
      };
    } catch (error) {
      console.error('❌ Failed to get AI preferences:', error);
      return {
        personality: 'helpful',
        responseLength: 'detailed',
        autoSuggestions: true,
        learningEnabled: true,
        experimentalAI: false,
      };
    }
  }

  /**
   * Get notification preferences
   */
  async getNotificationPreferences(userId) {
    try {
      const preferences = await this.getUserPreferences(userId);
      return {
        email: preferences.emailNotifications,
        push: preferences.pushNotifications,
        telegram: preferences.telegramNotifications,
        frequency: preferences.notificationFrequency,
        quietHours: preferences.quietHours,
      };
    } catch (error) {
      console.error('❌ Failed to get notification preferences:', error);
      return {
        email: true,
        push: true,
        telegram: true,
        frequency: 'normal',
        quietHours: { enabled: false, start: '22:00', end: '08:00' },
      };
    }
  }

  /**
   * Get privacy preferences
   */
  async getPrivacyPreferences(userId) {
    try {
      const preferences = await this.getUserPreferences(userId);
      return {
        dataCollection: preferences.dataCollection,
        analyticsSharing: preferences.analyticsSharing,
        conversationHistory: preferences.conversationHistory,
        personalizedAds: preferences.personalizedAds,
      };
    } catch (error) {
      console.error('❌ Failed to get privacy preferences:', error);
      return {
        dataCollection: true,
        analyticsSharing: true,
        conversationHistory: true,
        personalizedAds: false,
      };
    }
  }

  /**
   * Get accessibility preferences
   */
  async getAccessibilityPreferences(userId) {
    try {
      const preferences = await this.getUserPreferences(userId);
      return {
        highContrast: preferences.highContrast,
        screenReader: preferences.screenReader,
        keyboardNavigation: preferences.keyboardNavigation,
        voiceCommands: preferences.voiceCommands,
      };
    } catch (error) {
      console.error('❌ Failed to get accessibility preferences:', error);
      return {
        highContrast: false,
        screenReader: false,
        keyboardNavigation: false,
        voiceCommands: false,
      };
    }
  }

  /**
   * Check if user has enabled a specific feature
   */
  async isFeatureEnabled(userId, feature) {
    try {
      const preferences = await this.getUserPreferences(userId);
      return preferences[feature] === true;
    } catch (error) {
      console.error(`❌ Failed to check feature ${feature}:`, error);
      return false;
    }
  }

  /**
   * Get user's preferred language
   */
  async getUserLanguage(userId) {
    try {
      const preferences = await this.getUserPreferences(userId);
      return preferences.language || 'en';
    } catch (error) {
      console.error('❌ Failed to get user language:', error);
      return 'en';
    }
  }

  /**
   * Update user language
   */
  async updateUserLanguage(userId, language) {
    try {
      return await this.updatePreferenceCategory(userId, 'language', {
        language,
      });
    } catch (error) {
      console.error('❌ Failed to update user language:', error);
      throw error;
    }
  }

  /**
   * Get preferences for analytics
   */
  async getPreferencesAnalytics(userId) {
    try {
      const preferences = await this.getUserPreferences(userId);
      return {
        theme: preferences.theme,
        language: preferences.language,
        aiPersonality: preferences.aiPersonality,
        responseLength: preferences.responseLength,
        notificationFrequency: preferences.notificationFrequency,
        dataCollection: preferences.dataCollection,
        betaFeatures: preferences.betaFeatures,
        experimentalAI: preferences.experimentalAI,
      };
    } catch (error) {
      console.error('❌ Failed to get preferences analytics:', error);
      return null;
    }
  }

  /**
   * Export user preferences
   */
  async exportPreferences(userId) {
    try {
      const preferences = await this.getUserPreferences(userId);
      return {
        userId,
        preferences,
        exportedAt: new Date().toISOString(),
        version: '1.0',
      };
    } catch (error) {
      console.error('❌ Failed to export preferences:', error);
      throw error;
    }
  }

  /**
   * Import user preferences
   */
  async importPreferences(userId, preferencesData) {
    try {
      if (preferencesData.version !== '1.0') {
        throw new Error('Unsupported preferences version');
      }

      return await this.updateUserPreferences(
        userId,
        preferencesData.preferences
      );
    } catch (error) {
      console.error('❌ Failed to import preferences:', error);
      throw error;
    }
  }
}

module.exports = UserPreferencesManager;
