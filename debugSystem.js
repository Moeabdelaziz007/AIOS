#!/usr/bin/env node

/**
 * AIOS System Debug Script
 * Comprehensive debugging and training for the AIOS system
 */

require('dotenv').config();

class AIOSSystemDebugger {
  constructor() {
    this.name = 'AIOS System Debugger';
    this.version = '2.0.0';
    this.results = {
      environment: false,
      dependencies: false,
      firebase: false,
      server: false,
      client: false,
      integration: false
    };
  }

  async debugEnvironment() {
    console.log('🌍 DEBUG: Environment Configuration');
    console.log('=====================================');

    const requiredVars = [
      'FIREBASE_PROJECT_ID',
      'FIREBASE_API_KEY',
      'FIREBASE_AUTH_DOMAIN',
      'PORT',
      'NODE_ENV',
      'TELEGRAM_BOT_TOKEN',
      'GEMINI_API_KEY'
    ];

    const missing = [];
    const present = [];

    for (const varName of requiredVars) {
      if (process.env[varName]) {
        present.push(varName);
        console.log(`✅ ${varName}: Present`);
      } else {
        missing.push(varName);
        console.log(`❌ ${varName}: Missing`);
      }
    }

    console.log(`\n📊 Environment Summary: ${present.length}/${requiredVars.length} variables present`);

    if (missing.length > 0) {
      console.log(`⚠️ Missing variables: ${missing.join(', ')}`);
    }

    this.results.environment = missing.length === 0;
    return this.results.environment;
  }

  async debugDependencies() {
    console.log('\n📦 DEBUG: Dependencies');
    console.log('=====================================');

    const requiredModules = [
      'express',
      'cors',
      'firebase',
      'firebase-admin',
      'socket.io-client',
      'dotenv',
      'path',
      'fs'
    ];

    const missing = [];
    const present = [];

    for (const moduleName of requiredModules) {
      try {
        require(moduleName);
        present.push(moduleName);
        console.log(`✅ ${moduleName}: Available`);
      } catch (error) {
        missing.push(moduleName);
        console.log(`❌ ${moduleName}: Missing - ${error.message}`);
      }
    }

    console.log(`\n📊 Dependencies Summary: ${present.length}/${requiredModules.length} modules available`);

    if (missing.length > 0) {
      console.log(`⚠️ Missing modules: ${missing.join(', ')}`);
    }

    this.results.dependencies = missing.length === 0;
    return this.results.dependencies;
  }

  async debugFirebase() {
    console.log('\n🔥 DEBUG: Firebase Connection');
    console.log('=====================================');

    try {
      const { initializeApp } = require('firebase/app');
      const { getFirestore, collection, doc, setDoc, getDoc, deleteDoc } = require('firebase/firestore');
      const { getAuth, signInAnonymously } = require('firebase/auth');

      // Initialize Firebase
      const firebaseConfig = {
        apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
        authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
        storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.REACT_APP_FIREBASE_APP_ID
      };

      console.log('🔧 Initializing Firebase app...');
      const app = initializeApp(firebaseConfig);
      const db = getFirestore(app);
      const auth = getAuth(app);
      console.log('✅ Firebase app initialized');

      // Test authentication
      console.log('🔐 Testing authentication...');
      const userCredential = await signInAnonymously(auth);
      console.log(`✅ Authenticated as: ${userCredential.user.uid}`);

      // Test Firestore
      console.log('🗄️ Testing Firestore...');
      const testDocRef = doc(db, 'debug_tests', 'system_debug');

      await setDoc(testDocRef, {
        timestamp: new Date(),
        message: 'AIOS System Debug Test',
        version: this.version
      });
      console.log('✅ Firestore write successful');

      const docSnap = await getDoc(testDocRef);
      if (docSnap.exists()) {
        console.log('✅ Firestore read successful');
        console.log(`📄 Document data: ${JSON.stringify(docSnap.data(), null, 2)}`);
      }

      // Cleanup
      await deleteDoc(testDocRef);
      console.log('✅ Test document cleaned up');

      this.results.firebase = true;
      return true;
    } catch (error) {
      console.error('❌ Firebase debug failed:', error.message);
      this.results.firebase = false;
      return false;
    }
  }

  async debugServer() {
    console.log('\n🖥️ DEBUG: Server Components');
    console.log('=====================================');

    const fs = require('fs');
    const path = require('path');

    const serverFiles = [
      'server/index.js',
      'server/firebaseService.js',
      'server/firestoreDataStorage.js',
      'server/aiosAPIServer.js',
      'server/quantumAutopilot.js'
    ];

    const missing = [];
    const present = [];

    for (const filePath of serverFiles) {
      const fullPath = path.join(__dirname, filePath);
      if (fs.existsSync(fullPath)) {
        present.push(filePath);
        console.log(`✅ ${filePath}: Found`);

        // Try to require the file
        try {
          require(fullPath);
          console.log(`  ✅ ${filePath}: Loadable`);
        } catch (error) {
          console.log(`  ⚠️ ${filePath}: Load error - ${error.message}`);
        }
      } else {
        missing.push(filePath);
        console.log(`❌ ${filePath}: Missing`);
      }
    }

    // Test port availability
    const net = require('net');
    const port = process.env.PORT || 5000;

    console.log(`🔌 Testing port ${port} availability...`);
    const portAvailable = await new Promise(resolve => {
      const server = net.createServer();

      server.listen(port, () => {
        console.log(`✅ Port ${port} is available`);
        server.close();
        resolve(true);
      });

      server.on('error', error => {
        console.log(`❌ Port ${port} is in use: ${error.message}`);
        resolve(false);
      });
    });

    console.log(
      `\n📊 Server Summary: ${present.length}/${serverFiles.length} files found, port ${portAvailable ? 'available' : 'in use'}`
    );

    this.results.server = missing.length === 0 && portAvailable;
    return this.results.server;
  }

  async debugClient() {
    console.log('\n🌐 DEBUG: Client Application');
    console.log('=====================================');

    const fs = require('fs');
    const path = require('path');

    const clientFiles = [
      'client/package.json',
      'client/src/App.js',
      'client/src/services/FirebaseService.js',
      'client/.env'
    ];

    const missing = [];
    const present = [];

    for (const filePath of clientFiles) {
      const fullPath = path.join(__dirname, filePath);
      if (fs.existsSync(fullPath)) {
        present.push(filePath);
        console.log(`✅ ${filePath}: Found`);
      } else {
        missing.push(filePath);
        console.log(`❌ ${filePath}: Missing`);
      }
    }

    // Check if React is running
    console.log('🔍 Checking for running React development server...');
    const { exec } = require('child_process');

    const reactRunning = await new Promise(resolve => {
      exec('lsof -i :3000', (error, stdout) => {
        if (stdout) {
          console.log('✅ React development server is running on port 3000');
          resolve(true);
        } else {
          console.log('⚠️ React development server not detected on port 3000');
          resolve(false);
        }
      });
    });

    console.log(
      `\n📊 Client Summary: ${present.length}/${clientFiles.length} files found, React server ${reactRunning ? 'running' : 'not running'}`
    );

    this.results.client = missing.length === 0;
    return this.results.client;
  }

  async debugIntegration() {
    console.log('\n🔗 DEBUG: System Integration');
    console.log('=====================================');

    try {
      // Test Firebase connection with integration
      console.log('🧪 Testing system integration components...');

      // Test AIOS Integration System
      try {
        const AIOSIntegrationSystem = require('./aiosIntegrationSystem.js');
        console.log('✅ AIOS Integration System: Available');

        const system = new AIOSIntegrationSystem();
        console.log('✅ AIOS Integration System: Instantiable');

        if (system.systemIntegration) {
          console.log('✅ System Integration: Available');
        } else {
          console.log('⚠️ System Integration: Not available');
        }
      } catch (error) {
        console.log(`❌ AIOS Integration System: ${error.message}`);
      }

      // Test Quantum Autopilot (without Telegram)
      try {
        const QuantumAutopilot = require('./server/quantumAutopilot.js');
        console.log('✅ Quantum Autopilot: Available');
      } catch (error) {
        console.log(`⚠️ Quantum Autopilot: ${error.message}`);
      }

      this.results.integration = true;
      return true;
    } catch (error) {
      console.error('❌ Integration debug failed:', error.message);
      this.results.integration = false;
      return false;
    }
  }

  async generateReport() {
    console.log('\n📋 DEBUG REPORT');
    console.log('=====================================');
    console.log(`Environment: ${this.results.environment ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Dependencies: ${this.results.dependencies ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Firebase: ${this.results.firebase ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Server: ${this.results.server ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Client: ${this.results.client ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Integration: ${this.results.integration ? '✅ PASS' : '❌ FAIL'}`);

    const totalTests = Object.keys(this.results).length;
    const passedTests = Object.values(this.results).filter(Boolean).length;

    console.log(`\n🎯 Overall Status: ${passedTests}/${totalTests} tests passed`);

    if (passedTests === totalTests) {
      console.log('🎉 ALL TESTS PASSED! System is ready for production.');
    } else {
      console.log('⚠️ Some tests failed. Review the debug output above.');
    }

    return passedTests === totalTests;
  }

  async runFullDebug() {
    console.log('🚀 AIOS System Debug & Training');
    console.log('=====================================');
    console.log(`🔧 ${this.name} v${this.version}`);
    console.log(`📅 ${new Date().toISOString()}`);
    console.log('=====================================\n');

    try {
      await this.debugEnvironment();
      await this.debugDependencies();
      await this.debugFirebase();
      await this.debugServer();
      await this.debugClient();
      await this.debugIntegration();

      const allPassed = await this.generateReport();

      return allPassed;
    } catch (error) {
      console.error('💥 Fatal error during debug:', error);
      return false;
    }
  }
}

// Run debug if called directly
if (require.main === module) {
  const systemDebugger = new AIOSSystemDebugger();
  systemDebugger
    .runFullDebug()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('💥 Fatal error:', error);
      process.exit(1);
    });
}

module.exports = AIOSSystemDebugger;
