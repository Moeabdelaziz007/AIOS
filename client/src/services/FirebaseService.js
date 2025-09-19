import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { createContext, useContext, useEffect, useState } from 'react';
import { initializeDataAgent } from './api';

// Initialize Firebase app
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Validate required configuration
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error('Missing Firebase configuration. Please check your environment variables.');
  throw new Error('Firebase configuration is incomplete');
}

// Console log check for API key
console.log('Firebase API Key loaded:', !!firebaseConfig.apiKey);
console.log('Firebase configuration:', {
  apiKey: firebaseConfig.apiKey ? 'Present' : 'Missing',
  authDomain: firebaseConfig.authDomain ? 'Present' : 'Missing',
  projectId: firebaseConfig.projectId ? 'Present' : 'Missing',
  storageBucket: firebaseConfig.storageBucket ? 'Present' : 'Missing',
  messagingSenderId: firebaseConfig.messagingSenderId ? 'Present' : 'Missing',
  appId: firebaseConfig.appId ? 'Present' : 'Missing'
});

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

const FirebaseContext = createContext();

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

export const FirebaseProvider = ({ children }) => {
  const [firebaseApp] = useState(app);
  const [dataAgent, setDataAgent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initFirebase = async () => {
      try {
        // Validate Firebase configuration (with fallbacks)
        const apiKey = process.env.REACT_APP_FIREBASE_API_KEY || 'AIzaSyAJKY2y-r_wwx54hGGJ-FCZ_jUw59PGqK8';
        const projectId = process.env.REACT_APP_FIREBASE_PROJECT_ID || 'aios-97581';

        if (!apiKey || apiKey === 'your_api_key_here') {
          console.warn('Using fallback Firebase API Key');
        }
        if (!projectId || projectId === 'your_project_id_here') {
          console.warn('Using fallback Firebase Project ID');
        }

        console.log('Firebase configuration validated successfully');

        // Initialize Data Agent with authentication awareness
        const agent = initializeDataAgent(db, auth);
        setDataAgent(agent);

        console.log('Firebase and Data Agent initialized successfully (will wait for authentication)');
        setLoading(false);
      } catch (error) {
        console.error('Firebase initialization error:', error);
        setLoading(false);
      }
    };

    initFirebase();
  }, []);

  const value = {
    firebaseApp,
    db,
    auth,
    dataAgent,
    loading
  };

  return <FirebaseContext.Provider value={value}>{children}</FirebaseContext.Provider>;
};
