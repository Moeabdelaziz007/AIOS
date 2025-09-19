// Firebase Configuration for AIOS Project
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";
import { getMessaging } from "firebase/messaging";

// Conditionally import analytics only in browser environment
let analytics = null;
if (typeof window !== 'undefined') {
  try {
    const { getAnalytics } = await import("firebase/analytics");
    analytics = getAnalytics;
  } catch (error) {
    console.warn('Analytics not available in this environment:', error.message);
  }
}

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyApDku-geNVplwIgRBz2U0rs46aAVo-_mE",
  authDomain: "aios-97581.firebaseapp.com",
  projectId: "aios-97581",
  storageBucket: "aios-97581.firebasestorage.app",
  messagingSenderId: "307575156824",
  appId: "1:307575156824:web:00924bd384df1f29909a2d",
  measurementId: "G-JQN1FBR0F4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);
export const messaging = getMessaging(app);

// Initialize analytics only in browser environment
if (typeof window !== 'undefined' && analytics) {
  try {
    analytics = analytics(app);
  } catch (error) {
    console.warn('Analytics initialization failed:', error.message);
    analytics = null;
  }
}

export { analytics };

// Export the app instance
export default app;

// Firebase service configurations
export const firebaseServices = {
  app,
  analytics,
  db,
  auth,
  storage,
  functions,
  messaging
};

// Collection references for AIOS
export const collections = {
  users: 'users',
  agents: 'agents',
  workflows: 'workflows',
  conversations: 'conversations',
  learningData: 'learningData',
  systemLogs: 'systemLogs',
  automationData: 'automationData',
  growthMetrics: 'growthMetrics',
  predictiveData: 'predictiveData',
  resourceMetrics: 'resourceMetrics'
};

// Firebase security rules helper
export const securityRules = {
  users: {
    read: 'request.auth != null && request.auth.uid == resource.id',
    write: 'request.auth != null && request.auth.uid == resource.id'
  },
  agents: {
    read: 'request.auth != null',
    write: 'request.auth != null'
  },
  workflows: {
    read: 'request.auth != null',
    write: 'request.auth != null'
  },
  conversations: {
    read: 'request.auth != null',
    write: 'request.auth != null'
  },
  learningData: {
    read: 'request.auth != null',
    write: 'request.auth != null'
  },
  systemLogs: {
    read: 'request.auth != null',
    write: 'request.auth != null'
  }
};

// Firebase initialization helper
export const initializeFirebase = async () => {
  try {
    console.log('🔥 Firebase initialized successfully');
    console.log('📊 Analytics:', analytics ? 'Available' : 'Not available');
    console.log('🗄️ Firestore:', db);
    console.log('🔐 Auth:', auth);
    console.log('📁 Storage:', storage);
    console.log('⚡ Functions:', functions);
    console.log('📱 Messaging:', messaging);
    
    return {
      success: true,
      services: firebaseServices
    };
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Firebase connection test
export const testFirebaseConnection = async () => {
  try {
    // Test Firestore connection
    const testDoc = await db.collection('test').doc('connection').get();
    console.log('✅ Firestore connection successful');
    
    // Test Auth connection
    const currentUser = auth.currentUser;
    console.log('✅ Auth connection successful');
    
    return {
      firestore: true,
      auth: true,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('❌ Firebase connection test failed:', error);
    return {
      firestore: false,
      auth: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
};