/**
 * Firebase Permission Test Script
 * This script tests the Firebase permissions after the DataAgent fixes
 */

import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import DataAgent from './DataAgent';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || 'AIzaSyAJKY2y-r_wwx54hGGJ-FCZ_jUw59PGqK8',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'aios-97581.firebaseapp.com',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'aios-97581',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || 'aios-97581.appspot.com',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.REACT_APP_FIREBASE_APP_ID || '1:123456789:web:abcdef'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Enhanced test function with comprehensive testing
async function testFirebasePermissions() {
  console.log('🧪 Starting Enhanced Firebase Permission Test...');

  const testResults = {
    passed: 0,
    failed: 0,
    tests: []
  };

  const addTestResult = (name, passed, details) => {
    testResults.tests.push({ name, passed, details });
    if (passed) testResults.passed++;
    else testResults.failed++;
  };

  // Initialize DataAgent
  const dataAgent = new DataAgent(db, auth);

  // Test 1: Check initial state (should be mock mode)
  console.log('📊 Test 1: Initial DataAgent state');
  const initialState = dataAgent.getAuthStatus();
  addTestResult(
    'Initial Mock Mode',
    initialState.mockMode && !initialState.authenticated,
    `Mock mode: ${initialState.mockMode}, Auth ready: ${initialState.authStateReady}`
  );

  // Test 2: Try to fetch data without authentication (should use mock data)
  console.log('📊 Test 2: Mock data fetch');
  try {
    const apps = await dataAgent.fetchData('apps', { limit: 5 });
    addTestResult('Mock Data Fetch', Array.isArray(apps) && apps.length > 0, `Retrieved ${apps.length} mock apps`);
  } catch (error) {
    addTestResult('Mock Data Fetch', false, error.message);
  }

  // Test 3: Test retry mechanism
  console.log('📊 Test 3: Retry mechanism');
  try {
    const retryTest = await dataAgent.retryOperation(
      async () => {
        throw new Error('Test error');
      },
      2,
      100
    );
    addTestResult('Retry Mechanism', false, 'Should have failed');
  } catch (error) {
    addTestResult('Retry Mechanism', true, 'Correctly failed after retries');
  }

  // Test 4: Test analytics tracking
  console.log('📊 Test 4: Analytics tracking');
  const analytics = dataAgent.analytics;
  addTestResult(
    'Analytics Tracking',
    typeof analytics === 'object' && analytics.hasOwnProperty('cacheHits'),
    `Analytics object has ${Object.keys(analytics).length} properties`
  );

  // Test 5: Wait for authentication state change
  return new Promise(resolve => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      if (user) {
        console.log('🔐 User authenticated:', user.uid);

        // Test 6: Try to fetch real data after authentication
        console.log('📊 Test 6: Real data fetch after auth');
        try {
          const apps = await dataAgent.fetchData('apps', { limit: 5 });
          addTestResult('Real Data Fetch', Array.isArray(apps), `Retrieved ${apps.length} real apps`);
        } catch (error) {
          addTestResult('Real Data Fetch', false, error.message);
        }

        // Test 7: Check authentication status
        console.log('📊 Test 7: Authentication status');
        const authStatus = dataAgent.getAuthStatus();
        addTestResult(
          'Authentication Status',
          authStatus.authenticated && !authStatus.mockMode,
          `Authenticated: ${authStatus.authenticated}, Mock mode: ${authStatus.mockMode}`
        );

        // Test 8: Test event emission
        console.log('📊 Test 8: Event emission');
        let eventReceived = false;
        const eventHandler = () => {
          eventReceived = true;
        };
        window.addEventListener('dataAgentAuth', eventHandler);

        // Trigger auth event
        dataAgent.emitAuthEvent('test', user);

        setTimeout(() => {
          window.removeEventListener('dataAgentAuth', eventHandler);
          addTestResult('Event Emission', eventReceived, 'Custom event was emitted');
        }, 100);

        // Test 9: Final comprehensive check
        console.log('📊 Test 9: Final state check');
        const finalState = dataAgent.getAuthStatus();
        addTestResult(
          'Final State Check',
          finalState.authenticated && finalState.authStateReady && !finalState.mockMode,
          `Final state: ${JSON.stringify(finalState)}`
        );

        // Print test results
        console.log('\n🏁 Test Results Summary:');
        console.log(`✅ Passed: ${testResults.passed}`);
        console.log(`❌ Failed: ${testResults.failed}`);
        console.log(`📊 Total: ${testResults.tests.length}`);

        testResults.tests.forEach(test => {
          console.log(`${test.passed ? '✅' : '❌'} ${test.name}: ${test.details}`);
        });

        unsubscribe();
        resolve(testResults);
      } else {
        console.log('🔓 No user authenticated');
        resolve(testResults);
      }
    });
  });
}

// Run the test
if (typeof window !== 'undefined') {
  // Browser environment
  testFirebasePermissions()
    .then(() => {
      console.log('🏁 Firebase Permission Test completed');
    })
    .catch(error => {
      console.error('💥 Test failed:', error);
    });
} else {
  // Node.js environment
  console.log('This test should be run in a browser environment');
}

export default testFirebasePermissions;
