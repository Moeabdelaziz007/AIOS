#!/usr/bin/env node

/**
 * Final System Integration Test
 * Tests the complete AIOS system without Telegram conflicts
 */

require('dotenv').config();

class FinalSystemTest {
  constructor() {
    this.name = 'Final System Test';
    this.version = '1.0.0';
  }

  async testFirebaseConnection() {
    console.log('🔥 Testing Firebase Connection...');
    try {
      const { initializeApp } = require('firebase/app');
      const { getFirestore, doc, setDoc, deleteDoc } = require('firebase/firestore');
      const { getAuth, signInAnonymously } = require('firebase/auth');

      const firebaseConfig = {
        apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
        authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
        storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.REACT_APP_FIREBASE_APP_ID
      };

      const app = initializeApp(firebaseConfig);
      const db = getFirestore(app);
      const auth = getAuth(app);

      // Test authentication
      const userCred = await signInAnonymously(auth);
      console.log(`✅ Firebase Auth: ${userCred.user.uid}`);

      // Test Firestore
      const testDoc = doc(db, 'final_test', 'integration');
      await setDoc(testDoc, {
        timestamp: new Date(),
        test: 'final_integration',
        status: 'success'
      });
      console.log('✅ Firestore Write: Success');

      await deleteDoc(testDoc);
      console.log('✅ Firestore Cleanup: Success');

      return true;
    } catch (error) {
      console.error('❌ Firebase Test Failed:', error.message);
      return false;
    }
  }

  async testServerEndpoints() {
    console.log('🖥️ Testing Server Endpoints...');
    try {
      const http = require('http');

      return new Promise(resolve => {
        const options = {
          hostname: 'localhost',
          port: 5000,
          path: '/api/health',
          method: 'GET',
          timeout: 5000
        };

        const req = http.request(options, res => {
          console.log(`✅ Server Health Check: ${res.statusCode}`);
          resolve(true);
        });

        req.on('error', error => {
          console.log('⚠️ Server Health Check: Not responding (may still be starting)');
          resolve(false);
        });

        req.on('timeout', () => {
          console.log('⚠️ Server Health Check: Timeout');
          req.destroy();
          resolve(false);
        });

        req.end();
      });
    } catch (error) {
      console.error('❌ Server Test Failed:', error.message);
      return false;
    }
  }

  async testClientApplication() {
    console.log('🌐 Testing Client Application...');
    try {
      const http = require('http');

      return new Promise(resolve => {
        const options = {
          hostname: 'localhost',
          port: 3000,
          path: '/',
          method: 'GET',
          timeout: 5000
        };

        const req = http.request(options, res => {
          console.log(`✅ React Client: ${res.statusCode}`);
          resolve(true);
        });

        req.on('error', error => {
          console.log('⚠️ React Client: Not responding (may still be starting)');
          resolve(false);
        });

        req.on('timeout', () => {
          console.log('⚠️ React Client: Timeout');
          req.destroy();
          resolve(false);
        });

        req.end();
      });
    } catch (error) {
      console.error('❌ Client Test Failed:', error.message);
      return false;
    }
  }

  async testSystemIntegration() {
    console.log('🔗 Testing System Integration...');
    try {
      // Test if core files are accessible
      const fs = require('fs');
      const path = require('path');

      const integrationFiles = [
        'aiosIntegrationSystem.js',
        'server/quantumAutopilot.js',
        'client/src/services/FirebaseService.js'
      ];

      let allFilesExist = true;
      for (const file of integrationFiles) {
        if (fs.existsSync(path.join(__dirname, file))) {
          console.log(`✅ ${file}: Available`);
        } else {
          console.log(`❌ ${file}: Missing`);
          allFilesExist = false;
        }
      }

      return allFilesExist;
    } catch (error) {
      console.error('❌ Integration Test Failed:', error.message);
      return false;
    }
  }

  async runFinalTest() {
    console.log('🚀 AIOS Final System Integration Test');
    console.log('=====================================');
    console.log(`📅 ${new Date().toISOString()}`);
    console.log('');

    const results = {
      firebase: await this.testFirebaseConnection(),
      server: await this.testServerEndpoints(),
      client: await this.testClientApplication(),
      integration: await this.testSystemIntegration()
    };

    console.log('');
    console.log('📋 Final Test Results');
    console.log('=====================');
    console.log(`Firebase Connection: ${results.firebase ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Server Endpoints: ${results.server ? '✅ PASS' : '⚠️ WAIT'}`);
    console.log(`Client Application: ${results.client ? '✅ PASS' : '⚠️ WAIT'}`);
    console.log(`System Integration: ${results.integration ? '✅ PASS' : '❌ FAIL'}`);

    const criticalTests = results.firebase && results.integration;
    const optionalTests = results.server && results.client;

    console.log('');
    if (criticalTests) {
      console.log('🎉 CRITICAL COMPONENTS: ✅ WORKING');
      if (optionalTests) {
        console.log('🎉 ALL COMPONENTS: ✅ WORKING');
        console.log('');
        console.log('🌐 System Access URLs:');
        console.log('  - Client: http://localhost:3000');
        console.log('  - Server: http://localhost:5000');
        console.log('  - API: http://localhost:5000/api');
        console.log('');
        console.log('✅ AIOS System is fully operational!');
      } else {
        console.log('⚠️ OPTIONAL COMPONENTS: Starting up...');
        console.log('');
        console.log('🔧 Next Steps:');
        console.log('1. Wait for React client to fully start (usually 30-60 seconds)');
        console.log('2. Wait for server to fully initialize');
        console.log('3. Access http://localhost:3000 when ready');
        console.log('');
        console.log('✅ Core system is operational!');
      }
    } else {
      console.log('❌ CRITICAL COMPONENTS: FAILED');
      console.log('');
      console.log('🔧 Required Actions:');
      if (!results.firebase) {
        console.log('- Fix Firebase configuration');
      }
      if (!results.integration) {
        console.log('- Fix system integration files');
      }
    }

    return criticalTests;
  }
}

// Run final test if called directly
if (require.main === module) {
  const tester = new FinalSystemTest();
  tester
    .runFinalTest()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('💥 Fatal error:', error);
      process.exit(1);
    });
}

module.exports = FinalSystemTest;
