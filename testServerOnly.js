#!/usr/bin/env node

/**
 * Server-Only Test - Tests server components without Telegram
 * This avoids the Telegram bot conflicts
 */

require('dotenv').config();

class ServerOnlyTest {
  constructor() {
    this.name = 'Server-Only Test';
    this.version = '1.0.0';
  }

  async testEnvironment() {
    console.log('🌍 Testing Environment Configuration...');

    const requiredVars = ['FIREBASE_PROJECT_ID', 'FIREBASE_API_KEY', 'FIREBASE_AUTH_DOMAIN', 'PORT', 'NODE_ENV'];

    const missing = [];
    const present = [];

    for (const varName of requiredVars) {
      if (process.env[varName]) {
        present.push(varName);
      } else {
        missing.push(varName);
      }
    }

    console.log(`✅ Present variables: ${present.join(', ')}`);
    if (missing.length > 0) {
      console.log(`⚠️ Missing variables: ${missing.join(', ')}`);
    }

    return missing.length === 0;
  }

  async testDependencies() {
    console.log('📦 Testing Dependencies...');

    const requiredModules = ['express', 'cors', 'firebase', 'firebase-admin', 'socket.io-client', 'dotenv'];

    const missing = [];
    const present = [];

    for (const moduleName of requiredModules) {
      try {
        if (moduleName === 'firebase') {
          // Firebase v9+ uses different import structure
          require('firebase/app');
          require('firebase/firestore');
          require('firebase/auth');
        } else {
          require(moduleName);
        }
        present.push(moduleName);
      } catch (error) {
        missing.push(moduleName);
      }
    }

    console.log(`✅ Present modules: ${present.join(', ')}`);
    if (missing.length > 0) {
      console.log(`❌ Missing modules: ${missing.join(', ')}`);
    }

    return missing.length === 0;
  }

  async testFirebaseConfig() {
    console.log('🔥 Testing Firebase Configuration...');

    try {
      const { initializeApp } = require('firebase/app');

      const firebaseConfig = {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID
      };

      const app = initializeApp(firebaseConfig);
      console.log('✅ Firebase configuration valid');

      return true;
    } catch (error) {
      console.error('❌ Firebase configuration error:', error.message);
      return false;
    }
  }

  async testServerFiles() {
    console.log('📁 Testing Server Files...');

    const fs = require('fs');
    const path = require('path');

    const serverFiles = [
      'server/index.js',
      'server/firebaseService.js',
      'server/firestoreDataStorage.js',
      'server/aiosAPIServer.js'
    ];

    const missing = [];
    const present = [];

    for (const filePath of serverFiles) {
      const fullPath = path.join(__dirname, filePath);
      if (fs.existsSync(fullPath)) {
        present.push(filePath);
      } else {
        missing.push(filePath);
      }
    }

    console.log(`✅ Present files: ${present.join(', ')}`);
    if (missing.length > 0) {
      console.log(`⚠️ Missing files: ${missing.join(', ')}`);
    }

    return missing.length === 0;
  }

  async testPortAvailability() {
    console.log('🔌 Testing Port Availability...');

    const net = require('net');
    const port = process.env.PORT || 5000;

    return new Promise(resolve => {
      const server = net.createServer();

      server.listen(port, () => {
        console.log(`✅ Port ${port} is available`);
        server.close();
        resolve(true);
      });

      server.on('error', error => {
        console.log(`⚠️ Port ${port} is in use or unavailable: ${error.message}`);
        resolve(false);
      });
    });
  }

  async runTests() {
    console.log('🚀 Starting Server-Only Tests...');
    console.log('=====================================');

    const envTest = await this.testEnvironment();
    const depsTest = await this.testDependencies();
    const firebaseTest = await this.testFirebaseConfig();
    const filesTest = await this.testServerFiles();
    const portTest = await this.testPortAvailability();

    console.log('=====================================');
    console.log('📋 Server-Only Test Summary:');
    console.log(`  - Environment: ${envTest ? '✅ Success' : '❌ Failed'}`);
    console.log(`  - Dependencies: ${depsTest ? '✅ Success' : '❌ Failed'}`);
    console.log(`  - Firebase Config: ${firebaseTest ? '✅ Success' : '❌ Failed'}`);
    console.log(`  - Server Files: ${filesTest ? '✅ Success' : '❌ Failed'}`);
    console.log(`  - Port Availability: ${portTest ? '✅ Success' : '❌ Failed'}`);

    const allPassed = envTest && depsTest && firebaseTest && filesTest && portTest;

    if (allPassed) {
      console.log('🎉 All server tests passed!');
      console.log('✅ Server is ready to start');
    } else {
      console.log('⚠️ Some server tests failed');
    }

    return allPassed;
  }
}

// Run tests if called directly
if (require.main === module) {
  const tester = new ServerOnlyTest();
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

module.exports = ServerOnlyTest;
