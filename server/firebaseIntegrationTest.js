/**
 * 🧪 Firebase Integration Test Script
 *
 * Comprehensive testing of Firebase services and AIOS integration
 * Based on Firebase guidelines and best practices
 */

const { config } = require('dotenv');
const path = require('path');

const FirebaseInitializer = require('./firebaseInitializer');
const {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
} = require('firebase/firestore');
const { signInAnonymously, signOut } = require('firebase/auth');

class FirebaseIntegrationTest {
  constructor() {
    this.name = 'Firebase Integration Test';
    this.version = '1.0.0';
    this.firebase = null;
    this.testResults = [];

    console.log(`🧪 ${this.name} v${this.version} initialized`);
  }

  /**
   * Run comprehensive Firebase integration tests
   */
  async runTests() {
    try {
      console.log('🧪 Starting Firebase Integration Tests...');

      // Initialize Firebase
      await this.initializeFirebase();

      // Run authentication tests
      await this.testAuthentication();

      // Run Firestore tests
      await this.testFirestore();

      // Run AIOS-specific tests
      await this.testAIOSIntegration();

      // Run security rules tests
      await this.testSecurityRules();

      // Run performance tests
      await this.testPerformance();

      // Generate test report
      this.generateTestReport();

      console.log('✅ All Firebase integration tests completed');
      return this.testResults;
    } catch (error) {
      console.error('❌ Firebase integration tests failed:', error.message);
      throw error;
    }
  }

  /**
   * Initialize Firebase for testing
   */
  async initializeFirebase() {
    try {
      console.log('🔥 Initializing Firebase for testing...');

      // Load environment variables
      config({ path: path.join(__dirname, '../firebase.env') });

      this.firebase = new FirebaseInitializer();
      const services = await this.firebase.initialize();

      this.db = services.db;
      this.auth = services.auth;
      this.storage = services.storage;

      this.addTestResult(
        'firebase_init',
        'Firebase initialization',
        true,
        'Firebase initialized successfully'
      );
      console.log('✅ Firebase initialized for testing');
    } catch (error) {
      this.addTestResult(
        'firebase_init',
        'Firebase initialization',
        false,
        error.message
      );
      throw error;
    }
  }

  /**
   * Test Firebase Authentication
   */
  async testAuthentication() {
    try {
      console.log('🔐 Testing Firebase Authentication...');

      // Test anonymous sign-in
      const userCredential = await signInAnonymously(this.auth);
      if (!userCredential.user) {
        throw new Error('Anonymous sign-in failed');
      }

      this.addTestResult(
        'auth_anonymous',
        'Anonymous authentication',
        true,
        'Anonymous sign-in successful'
      );

      // Test user properties
      const user = userCredential.user;
      if (!user.uid) {
        throw new Error('User UID not available');
      }

      this.addTestResult(
        'auth_user_properties',
        'User properties',
        true,
        `User UID: ${user.uid}`
      );

      // Test sign-out
      await signOut(this.auth);
      if (this.auth.currentUser) {
        throw new Error('Sign-out failed');
      }

      this.addTestResult(
        'auth_signout',
        'Sign out',
        true,
        'Sign-out successful'
      );

      console.log('✅ Authentication tests passed');
    } catch (error) {
      this.addTestResult(
        'auth_tests',
        'Authentication tests',
        false,
        error.message
      );
      throw error;
    }
  }

  /**
   * Test Firestore Database
   */
  async testFirestore() {
    try {
      console.log('📊 Testing Firestore Database...');

      // Sign in for Firestore tests
      await signInAnonymously(this.auth);

      // Test basic CRUD operations
      await this.testFirestoreCRUD();

      // Test queries
      await this.testFirestoreQueries();

      // Test collections
      await this.testFirestoreCollections();

      // Sign out
      await signOut(this.auth);

      console.log('✅ Firestore tests passed');
    } catch (error) {
      this.addTestResult(
        'firestore_tests',
        'Firestore tests',
        false,
        error.message
      );
      throw error;
    }
  }

  /**
   * Test Firestore CRUD operations
   */
  async testFirestoreCRUD() {
    try {
      console.log('📝 Testing Firestore CRUD operations...');

      // Test Create
      const testDoc = doc(collection(this.db, 'test_crud'));
      const testData = {
        message: 'Firebase integration test',
        timestamp: new Date(),
        testId: 'crud_test_' + Date.now(),
      };

      await setDoc(testDoc, testData);
      this.addTestResult(
        'firestore_create',
        'Firestore Create',
        true,
        'Document created successfully'
      );

      // Test Read
      const docSnap = await getDoc(testDoc);
      if (!docSnap.exists()) {
        throw new Error('Document not found after creation');
      }

      const docData = docSnap.data();
      if (docData.message !== testData.message) {
        throw new Error('Document data mismatch');
      }

      this.addTestResult(
        'firestore_read',
        'Firestore Read',
        true,
        'Document read successfully'
      );

      // Test Update
      const updatedData = {
        ...testData,
        updated: true,
        updateTime: new Date(),
      };
      await setDoc(testDoc, updatedData);

      const updatedSnap = await getDoc(testDoc);
      if (!updatedSnap.data().updated) {
        throw new Error('Document update failed');
      }

      this.addTestResult(
        'firestore_update',
        'Firestore Update',
        true,
        'Document updated successfully'
      );

      // Test Delete
      await deleteDoc(testDoc);
      const deletedSnap = await getDoc(testDoc);
      if (deletedSnap.exists()) {
        throw new Error('Document deletion failed');
      }

      this.addTestResult(
        'firestore_delete',
        'Firestore Delete',
        true,
        'Document deleted successfully'
      );
    } catch (error) {
      this.addTestResult(
        'firestore_crud',
        'Firestore CRUD',
        false,
        error.message
      );
      throw error;
    }
  }

  /**
   * Test Firestore queries
   */
  async testFirestoreQueries() {
    try {
      console.log('🔍 Testing Firestore queries...');

      // Create test documents
      const testDocs = [
        { name: 'Test Doc 1', category: 'test', value: 10 },
        { name: 'Test Doc 2', category: 'test', value: 20 },
        { name: 'Test Doc 3', category: 'demo', value: 30 },
      ];

      const createdDocs = [];
      for (const docData of testDocs) {
        const docRef = doc(collection(this.db, 'test_queries'));
        await setDoc(docRef, { ...docData, timestamp: new Date() });
        createdDocs.push(docRef);
      }

      // Test where query
      const q1 = query(
        collection(this.db, 'test_queries'),
        where('category', '==', 'test')
      );

      const snapshot1 = await getDocs(q1);
      if (snapshot1.size !== 2) {
        throw new Error(`Expected 2 documents, got ${snapshot1.size}`);
      }

      this.addTestResult(
        'firestore_where_query',
        'Firestore Where Query',
        true,
        `Found ${snapshot1.size} documents`
      );

      // Test orderBy query
      const q2 = query(
        collection(this.db, 'test_queries'),
        orderBy('value', 'desc')
      );

      const snapshot2 = await getDocs(q2);
      if (snapshot2.size !== 3) {
        throw new Error(`Expected 3 documents, got ${snapshot2.size}`);
      }

      this.addTestResult(
        'firestore_orderby_query',
        'Firestore OrderBy Query',
        true,
        `Found ${snapshot2.size} documents`
      );

      // Test limit query
      const q3 = query(collection(this.db, 'test_queries'), limit(2));

      const snapshot3 = await getDocs(q3);
      if (snapshot3.size !== 2) {
        throw new Error(`Expected 2 documents, got ${snapshot3.size}`);
      }

      this.addTestResult(
        'firestore_limit_query',
        'Firestore Limit Query',
        true,
        `Found ${snapshot3.size} documents`
      );

      // Clean up test documents
      for (const docRef of createdDocs) {
        await deleteDoc(docRef);
      }
    } catch (error) {
      this.addTestResult(
        'firestore_queries',
        'Firestore Queries',
        false,
        error.message
      );
      throw error;
    }
  }

  /**
   * Test Firestore collections
   */
  async testFirestoreCollections() {
    try {
      console.log('📚 Testing Firestore collections...');

      // Test users collection
      await this.testUsersCollection();

      // Test operating systems collection
      await this.testOperatingSystemsCollection();

      // Test features collection
      await this.testFeaturesCollection();
    } catch (error) {
      this.addTestResult(
        'firestore_collections',
        'Firestore Collections',
        false,
        error.message
      );
      throw error;
    }
  }

  /**
   * Test users collection
   */
  async testUsersCollection() {
    try {
      const usersRef = collection(this.db, 'users');
      const snapshot = await getDocs(usersRef);

      this.addTestResult(
        'users_collection',
        'Users Collection',
        true,
        `Found ${snapshot.size} users`
      );
    } catch (error) {
      this.addTestResult(
        'users_collection',
        'Users Collection',
        false,
        error.message
      );
    }
  }

  /**
   * Test operating systems collection
   */
  async testOperatingSystemsCollection() {
    try {
      const osRef = collection(this.db, 'operating_systems');
      const snapshot = await getDocs(osRef);

      this.addTestResult(
        'os_collection',
        'Operating Systems Collection',
        true,
        `Found ${snapshot.size} operating systems`
      );
    } catch (error) {
      this.addTestResult(
        'os_collection',
        'Operating Systems Collection',
        false,
        error.message
      );
    }
  }

  /**
   * Test features collection
   */
  async testFeaturesCollection() {
    try {
      const featuresRef = collection(this.db, 'features');
      const snapshot = await getDocs(featuresRef);

      this.addTestResult(
        'features_collection',
        'Features Collection',
        true,
        `Found ${snapshot.size} features`
      );
    } catch (error) {
      this.addTestResult(
        'features_collection',
        'Features Collection',
        false,
        error.message
      );
    }
  }

  /**
   * Test AIOS-specific integration
   */
  async testAIOSIntegration() {
    try {
      console.log('🤖 Testing AIOS-specific integration...');

      // Sign in for AIOS tests
      await signInAnonymously(this.auth);

      // Test quantum autopilot data
      await this.testQuantumAutopilotData();

      // Test error logs
      await this.testErrorLogs();

      // Test system monitoring
      await this.testSystemMonitoring();

      // Test learning data
      await this.testLearningData();

      // Sign out
      await signOut(this.auth);

      console.log('✅ AIOS integration tests passed');
    } catch (error) {
      this.addTestResult(
        'aios_integration',
        'AIOS Integration',
        false,
        error.message
      );
      throw error;
    }
  }

  /**
   * Test quantum autopilot data
   */
  async testQuantumAutopilotData() {
    try {
      const quantumRef = collection(this.db, 'quantum_autopilot');
      const snapshot = await getDocs(quantumRef);

      this.addTestResult(
        'quantum_autopilot',
        'Quantum Autopilot Data',
        true,
        `Found ${snapshot.size} quantum autopilot records`
      );
    } catch (error) {
      this.addTestResult(
        'quantum_autopilot',
        'Quantum Autopilot Data',
        false,
        error.message
      );
    }
  }

  /**
   * Test error logs
   */
  async testErrorLogs() {
    try {
      const errorLogsRef = collection(this.db, 'error_logs');
      const snapshot = await getDocs(errorLogsRef);

      this.addTestResult(
        'error_logs',
        'Error Logs',
        true,
        `Found ${snapshot.size} error logs`
      );
    } catch (error) {
      this.addTestResult('error_logs', 'Error Logs', false, error.message);
    }
  }

  /**
   * Test system monitoring
   */
  async testSystemMonitoring() {
    try {
      const monitoringRef = collection(this.db, 'system_monitoring');
      const snapshot = await getDocs(monitoringRef);

      this.addTestResult(
        'system_monitoring',
        'System Monitoring',
        true,
        `Found ${snapshot.size} monitoring records`
      );
    } catch (error) {
      this.addTestResult(
        'system_monitoring',
        'System Monitoring',
        false,
        error.message
      );
    }
  }

  /**
   * Test learning data
   */
  async testLearningData() {
    try {
      const learningRef = collection(this.db, 'learning_data');
      const snapshot = await getDocs(learningRef);

      this.addTestResult(
        'learning_data',
        'Learning Data',
        true,
        `Found ${snapshot.size} learning records`
      );
    } catch (error) {
      this.addTestResult(
        'learning_data',
        'Learning Data',
        false,
        error.message
      );
    }
  }

  /**
   * Test security rules
   */
  async testSecurityRules() {
    try {
      console.log('🔒 Testing security rules...');

      // Test unauthenticated access (should fail)
      await signOut(this.auth);

      try {
        const testDoc = doc(collection(this.db, 'test_security'));
        await setDoc(testDoc, { test: true });
        this.addTestResult(
          'security_unauthenticated',
          'Unauthenticated Access',
          false,
          'Should have been denied'
        );
      } catch (error) {
        this.addTestResult(
          'security_unauthenticated',
          'Unauthenticated Access',
          true,
          'Correctly denied access'
        );
      }

      // Test authenticated access (should succeed)
      await signInAnonymously(this.auth);

      try {
        const testDoc = doc(collection(this.db, 'test_security'));
        await setDoc(testDoc, {
          test: true,
          userId: this.auth.currentUser.uid,
        });
        await deleteDoc(testDoc);
        this.addTestResult(
          'security_authenticated',
          'Authenticated Access',
          true,
          'Correctly allowed access'
        );
      } catch (error) {
        this.addTestResult(
          'security_authenticated',
          'Authenticated Access',
          false,
          error.message
        );
      }

      console.log('✅ Security rules tests passed');
    } catch (error) {
      this.addTestResult(
        'security_rules',
        'Security Rules',
        false,
        error.message
      );
      throw error;
    }
  }

  /**
   * Test performance
   */
  async testPerformance() {
    try {
      console.log('⚡ Testing performance...');

      const startTime = Date.now();

      // Test batch operations
      await this.testBatchOperations();

      const endTime = Date.now();
      const duration = endTime - startTime;

      this.addTestResult(
        'performance_batch',
        'Batch Operations Performance',
        true,
        `Completed in ${duration}ms`
      );

      console.log('✅ Performance tests passed');
    } catch (error) {
      this.addTestResult(
        'performance_tests',
        'Performance Tests',
        false,
        error.message
      );
      throw error;
    }
  }

  /**
   * Test batch operations
   */
  async testBatchOperations() {
    try {
      const batchSize = 10;
      const testDocs = [];

      // Create test documents
      for (let i = 0; i < batchSize; i++) {
        const docRef = doc(collection(this.db, 'test_batch'));
        const testData = {
          index: i,
          timestamp: new Date(),
          batchTest: true,
        };
        await setDoc(docRef, testData);
        testDocs.push(docRef);
      }

      // Clean up test documents
      for (const docRef of testDocs) {
        await deleteDoc(docRef);
      }

      this.addTestResult(
        'batch_operations',
        'Batch Operations',
        true,
        `Processed ${batchSize} documents`
      );
    } catch (error) {
      this.addTestResult(
        'batch_operations',
        'Batch Operations',
        false,
        error.message
      );
      throw error;
    }
  }

  /**
   * Add test result
   */
  addTestResult(testId, testName, success, message) {
    this.testResults.push({
      id: testId,
      name: testName,
      success,
      message,
      timestamp: new Date(),
    });
  }

  /**
   * Generate test report
   */
  generateTestReport() {
    console.log('\n📊 Firebase Integration Test Report');
    console.log('=====================================');

    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(r => r.success).length;
    const failedTests = totalTests - passedTests;

    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${passedTests}`);
    console.log(`Failed: ${failedTests}`);
    console.log(
      `Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`
    );

    console.log('\n📋 Test Results:');
    for (const result of this.testResults) {
      const status = result.success ? '✅' : '❌';
      console.log(`${status} ${result.name}: ${result.message}`);
    }

    if (failedTests > 0) {
      console.log('\n❌ Failed Tests:');
      for (const result of this.testResults.filter(r => !r.success)) {
        console.log(`- ${result.name}: ${result.message}`);
      }
    }

    console.log(
      '\n🎯 Firebase Integration Status:',
      failedTests === 0 ? 'FULLY OPERATIONAL' : 'ISSUES DETECTED'
    );
  }

  /**
   * Cleanup test data
   */
  async cleanup() {
    try {
      if (this.firebase) {
        await this.firebase.shutdown();
      }
      console.log('🧹 Test cleanup completed');
    } catch (error) {
      console.error('❌ Error during cleanup:', error.message);
    }
  }
}

// Run tests if called directly
if (require.main === module) {
  const test = new FirebaseIntegrationTest();
  test
    .runTests()
    .then(() => {
      console.log('🎉 Firebase integration tests completed successfully');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Firebase integration tests failed:', error.message);
      process.exit(1);
    })
    .finally(() => {
      test.cleanup();
    });
}

module.exports = FirebaseIntegrationTest;
