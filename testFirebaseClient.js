#!/usr/bin/env node

/**
 * Client-side Firebase Test - Uses Firebase client SDK
 * This bypasses the Admin SDK credential issues
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc, getDoc, deleteDoc, getDocs } = require('firebase/firestore');
const { getAuth, signInAnonymously } = require('firebase/auth');
require('dotenv').config();

class FirebaseClientTest {
  constructor() {
    this.name = 'Firebase Client Test';
    this.version = '1.0.0';
    this.app = null;
    this.db = null;
    this.auth = null;
    this.isInitialized = false;
  }

  async initialize() {
    try {
      console.log('🔥 Initializing Firebase Client...');

      // Check environment variables
      console.log('📋 Environment Check:');
      console.log(`  - API Key: ${process.env.REACT_APP_FIREBASE_API_KEY ? 'Present' : 'Missing'}`);
      console.log(`  - Project ID: ${process.env.REACT_APP_FIREBASE_PROJECT_ID || 'Missing'}`);
      console.log(`  - Auth Domain: ${process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'Missing'}`);

      // Initialize Firebase app
      const firebaseConfig = {
        apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
        authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
        storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.REACT_APP_FIREBASE_APP_ID
      };

      this.app = initializeApp(firebaseConfig);
      this.db = getFirestore(this.app);
      this.auth = getAuth(this.app);

      console.log('✅ Firebase client initialized successfully');
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('❌ Firebase client initialization failed:', error.message);
      return false;
    }
  }

  async testAuthentication() {
    if (!this.isInitialized) {
      console.log('⚠️ Firebase not initialized');
      return false;
    }

    try {
      console.log('🔐 Testing authentication...');

      // Sign in anonymously
      const userCredential = await signInAnonymously(this.auth);
      const user = userCredential.user;

      console.log('✅ Anonymous authentication successful');
      console.log(`👤 User ID: ${user.uid}`);

      return true;
    } catch (error) {
      console.error('❌ Authentication test failed:', error.message);
      return false;
    }
  }

  async testFirestore() {
    if (!this.isInitialized) {
      console.log('⚠️ Firebase not initialized');
      return false;
    }

    try {
      console.log('🗄️ Testing Firestore operations...');

      const testDocRef = doc(this.db, 'test_collections', 'client_test');

      // Test write
      await setDoc(testDocRef, {
        timestamp: new Date(),
        message: 'Test from Firebase Client',
        version: this.version,
        userId: this.auth.currentUser?.uid || 'anonymous'
      });
      console.log('✅ Firestore write test successful');

      // Test read
      const docSnap = await getDoc(testDocRef);
      if (docSnap.exists()) {
        console.log('✅ Firestore read test successful');
        console.log('📄 Document data:', docSnap.data());
      }

      // Clean up
      await deleteDoc(testDocRef);
      console.log('✅ Test document cleaned up');

      return true;
    } catch (error) {
      console.error('❌ Firestore test failed:', error.message);
      return false;
    }
  }

  async testCollections() {
    if (!this.isInitialized) {
      console.log('⚠️ Firebase not initialized');
      return false;
    }

    try {
      console.log('📊 Testing Firestore collections...');

      const collections = [
        'users',
        'operating_systems',
        'features',
        'reviews',
        'system_logs',
        'quantum_autopilot',
        'error_logs',
        'fix_patterns',
        'public_data',
        'guest_data'
      ];

      for (const collectionName of collections) {
        try {
          const collectionRef = collection(this.db, collectionName);
          const snapshot = await getDocs(collectionRef);
          console.log(`✅ Collection '${collectionName}': ${snapshot.size} documents (accessible)`);
        } catch (error) {
          console.log(`⚠️ Collection '${collectionName}': ${error.message}`);
        }
      }

      return true;
    } catch (error) {
      console.error('❌ Collections test failed:', error.message);
      return false;
    }
  }

  async runTests() {
    console.log('🚀 Starting Firebase Client Tests...');
    console.log('=====================================');

    const initialized = await this.initialize();
    if (!initialized) {
      console.log('❌ Tests failed - Firebase not initialized');
      return false;
    }

    const authTest = await this.testAuthentication();
    const firestoreTest = await this.testFirestore();
    const collectionsTest = await this.testCollections();

    console.log('=====================================');
    console.log('📋 Firebase Client Test Summary:');
    console.log(`  - Initialization: ${initialized ? '✅ Success' : '❌ Failed'}`);
    console.log(`  - Authentication: ${authTest ? '✅ Success' : '❌ Failed'}`);
    console.log(`  - Firestore: ${firestoreTest ? '✅ Success' : '❌ Failed'}`);
    console.log(`  - Collections: ${collectionsTest ? '✅ Success' : '❌ Failed'}`);

    if (initialized && authTest && firestoreTest && collectionsTest) {
      console.log('🎉 All Firebase client tests passed!');
      return true;
    } else {
      console.log('⚠️ Some Firebase client tests failed');
      return false;
    }
  }
}

// Run tests if called directly
if (require.main === module) {
  const tester = new FirebaseClientTest();
  tester
    .runTests()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('💥 Fatal error:', error);
      process.exit(1);
    });
}

module.exports = FirebaseClientTest;
