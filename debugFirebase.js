#!/usr/bin/env node

/**
 * Firebase Debug Script - Tests Firebase without Telegram conflicts
 * This script focuses on Firebase connectivity and basic functionality
 */

const admin = require('firebase-admin');
require('dotenv').config();

class FirebaseDebugger {
  constructor() {
    this.name = 'Firebase Debugger';
    this.version = '1.0.0';
    this.isInitialized = false;
    this.db = null;
    this.auth = null;
  }

  async initialize() {
    try {
      console.log('🔥 Initializing Firebase Debugger...');
      console.log('📋 Environment Check:');
      console.log(`  - Project ID: ${process.env.FIREBASE_PROJECT_ID || 'Missing'}`);
      console.log(`  - API Key: ${process.env.FIREBASE_API_KEY ? 'Present' : 'Missing'}`);
      console.log(`  - Auth Domain: ${process.env.FIREBASE_AUTH_DOMAIN || 'Missing'}`);

      // Initialize Firebase Admin SDK
      if (!admin.apps.length) {
        // Try with environment variables first
        if (process.env.FIREBASE_ADMIN_PRIVATE_KEY && process.env.FIREBASE_ADMIN_CLIENT_EMAIL) {
          console.log('🔑 Using environment credentials...');
          admin.initializeApp({
            credential: admin.credential.cert({
              projectId: process.env.FIREBASE_PROJECT_ID,
              privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
              clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL
            })
          });
        } else {
          console.log('🔑 Using default credentials...');
          admin.initializeApp({
            projectId: process.env.FIREBASE_PROJECT_ID || 'aios-97581'
          });
        }
      }

      this.db = admin.firestore();
      this.auth = admin.auth();
      this.isInitialized = true;

      console.log('✅ Firebase Admin SDK initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Firebase initialization failed:', error.message);
      return false;
    }
  }

  async testConnection() {
    if (!this.isInitialized) {
      console.log('⚠️ Firebase not initialized');
      return false;
    }

    try {
      console.log('🧪 Testing Firebase connection...');

      // Test Firestore connection
      const testDoc = await this.db.collection('test_collections').doc('debug_test').set({
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        message: 'Debug test from Firebase Debugger',
        version: this.version
      });

      console.log('✅ Firestore write test successful');

      // Test read
      const doc = await this.db.collection('test_collections').doc('debug_test').get();
      if (doc.exists) {
        console.log('✅ Firestore read test successful');
        console.log('📄 Test document data:', doc.data());
      }

      // Clean up test document
      await this.db.collection('test_collections').doc('debug_test').delete();
      console.log('✅ Test document cleaned up');

      return true;
    } catch (error) {
      console.error('❌ Firebase connection test failed:', error.message);
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
        'fix_patterns'
      ];

      for (const collection of collections) {
        try {
          const snapshot = await this.db.collection(collection).limit(1).get();
          console.log(`✅ Collection '${collection}': ${snapshot.size} documents (accessible)`);
        } catch (error) {
          console.log(`⚠️ Collection '${collection}': ${error.message}`);
        }
      }

      return true;
    } catch (error) {
      console.error('❌ Collections test failed:', error.message);
      return false;
    }
  }

  async runDiagnostics() {
    console.log('🚀 Starting Firebase Diagnostics...');
    console.log('=====================================');

    const initialized = await this.initialize();
    if (!initialized) {
      console.log('❌ Diagnostics failed - Firebase not initialized');
      return false;
    }

    const connectionTest = await this.testConnection();
    const collectionsTest = await this.testCollections();

    console.log('=====================================');
    console.log('📋 Firebase Diagnostics Summary:');
    console.log(`  - Initialization: ${initialized ? '✅ Success' : '❌ Failed'}`);
    console.log(`  - Connection Test: ${connectionTest ? '✅ Success' : '❌ Failed'}`);
    console.log(`  - Collections Test: ${collectionsTest ? '✅ Success' : '❌ Failed'}`);

    if (initialized && connectionTest && collectionsTest) {
      console.log('🎉 All Firebase diagnostics passed!');
      return true;
    } else {
      console.log('⚠️ Some Firebase diagnostics failed');
      return false;
    }
  }
}

// Run diagnostics if called directly
if (require.main === module) {
  const firebaseDebugger = new FirebaseDebugger();
  firebaseDebugger
    .runDiagnostics()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('💥 Fatal error:', error);
      process.exit(1);
    });
}

module.exports = FirebaseDebugger;
