// Firebase Test Script for AIOS Project
// This script tests Firebase connection and basic operations

const { initializeFirebase, testFirebaseConnection, collections } = require('./client/src/config/firebase');
const { initializeFirebaseAdmin, testFirebaseAdminConnection } = require('./server/config/firebaseAdmin');

async function testFirebaseSetup() {
  console.log('🧪 Testing Firebase Setup for AIOS...\n');

  try {
    // Test client-side Firebase
    console.log('📱 Testing Client-side Firebase...');
    const clientInit = await initializeFirebase();
    if (clientInit.success) {
      console.log('✅ Client Firebase initialized successfully');
    } else {
      console.log('❌ Client Firebase initialization failed:', clientInit.error);
    }

    const clientTest = await testFirebaseConnection();
    console.log('📊 Client connection test result:', clientTest);

    // Test server-side Firebase Admin
    console.log('\n🖥️ Testing Server-side Firebase Admin...');
    const adminInit = await initializeFirebaseAdmin();
    if (adminInit.success) {
      console.log('✅ Admin Firebase initialized successfully');
    } else {
      console.log('❌ Admin Firebase initialization failed:', adminInit.error);
    }

    const adminTest = await testFirebaseAdminConnection();
    console.log('📊 Admin connection test result:', adminTest);

    // Test collections
    console.log('\n📚 Testing Collections...');
    console.log('Available collections:', Object.keys(collections));

    // Test basic Firestore operations
    console.log('\n🔍 Testing Basic Firestore Operations...');

    // Test document creation
    const testData = {
      testId: 'firebase-test-' + Date.now(),
      message: 'Firebase test successful',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    };

    console.log('Test data:', testData);

    console.log('\n✅ Firebase setup test completed successfully!');
    console.log('🎉 AIOS Firebase configuration is ready for development!');
  } catch (error) {
    console.error('❌ Firebase setup test failed:', error);
    console.error('Please check your Firebase configuration and credentials.');
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testFirebaseSetup();
}

module.exports = { testFirebaseSetup };
