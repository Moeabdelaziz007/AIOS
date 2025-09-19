// Firebase Environment Configuration
// This file contains environment-specific Firebase configuration

const firebaseConfig = {
  // Development Environment
  development: {
    apiKey: 'AIzaSyApDku-geNVplwIgRBz2U0rs46aAVo-_mE',
    authDomain: 'aios-97581.firebaseapp.com',
    projectId: 'aios-97581',
    storageBucket: 'aios-97581.firebasestorage.app',
    messagingSenderId: '307575156824',
    appId: '1:307575156824:web:00924bd384df1f29909a2d',
    measurementId: 'G-JQN1FBR0F4'
  },

  // Production Environment (replace with your production config)
  production: {
    apiKey: 'AIzaSyApDku-geNVplwIgRBz2U0rs46aAVo-_mE',
    authDomain: 'aios-97581.firebaseapp.com',
    projectId: 'aios-97581',
    storageBucket: 'aios-97581.firebasestorage.app',
    messagingSenderId: '307575156824',
    appId: '1:307575156824:web:00924bd384df1f29909a2d',
    measurementId: 'G-JQN1FBR0F4'
  },

  // Staging Environment (replace with your staging config)
  staging: {
    apiKey: 'AIzaSyApDku-geNVplwIgRBz2U0rs46aAVo-_mE',
    authDomain: 'aios-97581.firebaseapp.com',
    projectId: 'aios-97581',
    storageBucket: 'aios-97581.firebasestorage.app',
    messagingSenderId: '307575156824',
    appId: '1:307575156824:web:00924bd384df1f29909a2d',
    measurementId: 'G-JQN1FBR0F4'
  }
};

// Get current environment
const getCurrentEnvironment = () => {
  return process.env.NODE_ENV || 'development';
};

// Get Firebase config for current environment
const getFirebaseConfig = () => {
  const env = getCurrentEnvironment();
  return firebaseConfig[env] || firebaseConfig.development;
};

// Firebase project information
const firebaseProjectInfo = {
  projectId: 'aios-97581',
  projectName: 'AIOS - Advanced Intelligent Operating System',
  description: 'AI-powered operating system with automation and smart growing capabilities',
  version: '1.0.0',
  environments: {
    development: 'Development environment for AIOS',
    staging: 'Staging environment for AIOS',
    production: 'Production environment for AIOS'
  }
};

// Firebase service URLs
const firebaseServiceUrls = {
  firestore: `https://firestore.googleapis.com/v1/projects/${firebaseProjectInfo.projectId}/databases/(default)/documents`,
  auth: `https://identitytoolkit.googleapis.com/v1/projects/${firebaseProjectInfo.projectId}`,
  storage: `https://storage.googleapis.com/v1/b/${firebaseProjectInfo.projectId}.appspot.com`,
  functions: `https://us-central1-${firebaseProjectInfo.projectId}.cloudfunctions.net`,
  analytics: `https://analytics.google.com/analytics/web/#/p${firebaseProjectInfo.projectId}`
};

// Export configuration
module.exports = {
  firebaseConfig,
  getCurrentEnvironment,
  getFirebaseConfig,
  firebaseProjectInfo,
  firebaseServiceUrls
};
