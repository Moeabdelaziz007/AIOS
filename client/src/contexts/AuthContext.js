import { onAuthStateChanged, signOut } from 'firebase/auth';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { auth } from '../services/FirebaseService';
import googleAuthService from '../services/GoogleAuthService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  const getUserProfile = useCallback(
    async uid => {
      // This would typically fetch from Firestore
      // For now, return a mock profile
      return {
        uid,
        email: user?.email,
        displayName: user?.displayName || user?.email?.split('@')[0] || 'Guest User',
        role: user?.isAnonymous ? 'guest' : 'user',
        createdAt: new Date(),
        preferences: {
          theme: 'light',
          notifications: true,
          language: 'en'
        }
      };
    },
    [user]
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      setUser(user);

      if (user) {
        // Load user profile from Firestore
        try {
          const userProfile = await getUserProfile(user.uid);
          setUserProfile(userProfile);
        } catch (error) {
          console.error('Error loading user profile:', error);
          setUserProfile({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || user.email?.split('@')[0] || 'User',
            role: user?.isAnonymous ? 'guest' : 'user',
            createdAt: new Date(),
            preferences: {
              theme: 'light',
              notifications: true,
              language: 'en'
            }
          });
        }
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [getUserProfile]);

  const login = async (email, password) => {
    // This would typically use Firebase Auth
    // For now, return a mock implementation
    throw new Error('Email/password login not implemented yet');
  };

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      const result = await googleAuthService.signInWithPopup();

      // The user will be automatically updated via onAuthStateChanged
      return result;
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUserProfile(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const updateUserProfile = async updates => {
    try {
      // This would typically update Firestore
      setUserProfile(prev => ({ ...prev, ...updates }));
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  };

  const hasRole = requiredRole => {
    if (!userProfile) {
      console.log('hasRole: No userProfile available');
      return false;
    }

    const roleHierarchy = {
      guest: 0,
      user: 1,
      admin: 2,
      superadmin: 3
    };

    const userRoleLevel = roleHierarchy[userProfile.role] || -1;
    const requiredRoleLevel = roleHierarchy[requiredRole] || -1;

    console.log(
      `hasRole: userRole=${userProfile.role}(${userRoleLevel}), required=${requiredRole}(${requiredRoleLevel}), result=${userRoleLevel >= requiredRoleLevel}`
    );

    return userRoleLevel >= requiredRoleLevel;
  };

  const hasPermission = permission => {
    if (!userProfile) return false;

    const permissions = {
      guest: ['read:apps', 'read:dashboard', 'read:settings'], // Basic read permissions for guests
      user: ['read:apps', 'create:apps', 'update:own:apps', 'delete:own:apps'],
      admin: ['read:all', 'create:all', 'update:all', 'delete:all', 'manage:users', 'view:system'],
      superadmin: ['*'] // All permissions
    };

    const userPermissions = permissions[userProfile.role] || [];
    return userPermissions.includes('*') || userPermissions.includes(permission);
  };

  const value = {
    user,
    userProfile,
    loading,
    login,
    loginWithGoogle,
    logout,
    updateUserProfile,
    hasRole,
    hasPermission,
    isAuthenticated: !!user,
    isAdmin: hasRole('admin'),
    isSuperAdmin: hasRole('superadmin')
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
