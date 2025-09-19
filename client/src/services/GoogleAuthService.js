import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from './FirebaseService';

/**
 * Enhanced Google Authentication Service
 * Provides improved Google OAuth with better error handling and user experience
 */
class GoogleAuthService {
  constructor() {
    this.provider = new GoogleAuthProvider();
    this.setupProvider();
    this.isInitialized = false;
    this.authStateListeners = new Set();
  }

  /**
   * Configure Google Auth Provider with enhanced settings
   */
  setupProvider() {
    // Add custom parameters for better user experience
    this.provider.addScope('email');
    this.provider.addScope('profile');
    this.provider.setCustomParameters({
      prompt: 'select_account', // Always show account selection
      access_type: 'online',
      include_granted_scopes: true
    });
  }

  /**
   * Initialize the Google Auth service
   */
  async initialize() {
    if (this.isInitialized) return;

    try {
      // Check for redirect result (if user was redirected back from Google)
      const result = await getRedirectResult(auth);
      if (result) {
        console.log('Google redirect login successful:', result.user);
        return result;
      }

      this.isInitialized = true;
      console.log('Google Auth Service initialized successfully');
    } catch (error) {
      console.error('Google Auth initialization error:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Sign in with Google using popup method
   */
  async signInWithPopup() {
    try {
      await this.initialize();
      
      console.log('Starting Google popup authentication...');
      const result = await signInWithPopup(auth, this.provider);
      
      // Extract additional user information
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const user = result.user;
      
      console.log('Google popup login successful:', {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      });

      return {
        user,
        credential,
        additionalUserInfo: result._tokenResponse,
        isNewUser: result.additionalUserInfo?.isNewUser || false
      };
    } catch (error) {
      console.error('Google popup login error:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Sign in with Google using redirect method (for mobile/limited popup support)
   */
  async signInWithRedirect() {
    try {
      await this.initialize();
      
      console.log('Starting Google redirect authentication...');
      await signInWithRedirect(auth, this.provider);
      
      // The actual result will be handled in initialize() when user returns
    } catch (error) {
      console.error('Google redirect login error:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Sign out the current user
   */
  async signOut() {
    try {
      await firebaseSignOut(auth);
      console.log('Google sign out successful');
    } catch (error) {
      console.error('Google sign out error:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Get current user information
   */
  getCurrentUser() {
    return auth.currentUser;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!auth.currentUser;
  }

  /**
   * Add auth state change listener
   */
  onAuthStateChange(callback) {
    const unsubscribe = onAuthStateChanged(auth, callback);
    this.authStateListeners.add(unsubscribe);
    return unsubscribe;
  }

  /**
   * Remove all auth state listeners
   */
  removeAllListeners() {
    this.authStateListeners.forEach(unsubscribe => unsubscribe());
    this.authStateListeners.clear();
  }

  /**
   * Enhanced error handling for Google Auth
   */
  handleAuthError(error) {
    const errorMap = {
      'auth/popup-closed-by-user': {
        code: 'POPUP_CLOSED',
        message: 'Login was cancelled. Please try again.',
        userFriendly: true
      },
      'auth/popup-blocked': {
        code: 'POPUP_BLOCKED',
        message: 'Popup was blocked by browser. Please allow popups and try again.',
        userFriendly: true
      },
      'auth/cancelled-popup-request': {
        code: 'POPUP_CANCELLED',
        message: 'Login was cancelled. Please try again.',
        userFriendly: true
      },
      'auth/account-exists-with-different-credential': {
        code: 'ACCOUNT_EXISTS',
        message: 'An account already exists with this email using a different login method.',
        userFriendly: true
      },
      'auth/email-already-in-use': {
        code: 'EMAIL_IN_USE',
        message: 'This email is already registered. Please use a different email or try signing in.',
        userFriendly: true
      },
      'auth/operation-not-allowed': {
        code: 'OPERATION_NOT_ALLOWED',
        message: 'Google sign-in is not enabled. Please contact support.',
        userFriendly: true
      },
      'auth/too-many-requests': {
        code: 'TOO_MANY_REQUESTS',
        message: 'Too many login attempts. Please wait a moment and try again.',
        userFriendly: true
      },
      'auth/network-request-failed': {
        code: 'NETWORK_ERROR',
        message: 'Network error. Please check your internet connection and try again.',
        userFriendly: true
      }
    };

    const errorInfo = errorMap[error.code] || {
      code: error.code || 'UNKNOWN_ERROR',
      message: error.message || 'An unexpected error occurred during authentication.',
      userFriendly: false
    };

    return {
      ...errorInfo,
      originalError: error,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Get user profile information from Google
   */
  async getUserProfile() {
    const user = this.getCurrentUser();
    if (!user) return null;

    try {
      // Get additional user information
      const profile = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        providerData: user.providerData,
        metadata: {
          creationTime: user.metadata.creationTime,
          lastSignInTime: user.metadata.lastSignInTime
        }
      };

      return profile;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  /**
   * Check if Google Auth is available and properly configured
   */
  async checkAvailability() {
    try {
      await this.initialize();
      return {
        available: true,
        message: 'Google authentication is ready',
        provider: 'google'
      };
    } catch (error) {
      return {
        available: false,
        message: error.message,
        error: error.code,
        provider: 'google'
      };
    }
  }

  /**
   * Get authentication status and user info
   */
  getAuthStatus() {
    const user = this.getCurrentUser();
    return {
      isAuthenticated: !!user,
      user: user ? {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      } : null,
      provider: 'google',
      timestamp: new Date().toISOString()
    };
  }
}

// Create singleton instance
const googleAuthService = new GoogleAuthService();

export default googleAuthService;
