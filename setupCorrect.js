#!/usr/bin/env node

/**
 * AIOS Correct Setup Script
 * Simple, focused setup without complex dependencies
 */

require('dotenv').config();

console.log('🚀 AIOS System Setup');
console.log('===================');

// Step 1: Environment Check
console.log('\n1️⃣ Environment Configuration');
const requiredEnvVars = ['FIREBASE_PROJECT_ID', 'FIREBASE_API_KEY', 'FIREBASE_AUTH_DOMAIN', 'PORT'];

let envOk = true;
requiredEnvVars.forEach(varName => {
  if (process.env[varName]) {
    console.log(`✅ ${varName}: OK`);
  } else {
    console.log(`❌ ${varName}: Missing`);
    envOk = false;
  }
});

// Step 2: Dependencies Check
console.log('\n2️⃣ Dependencies Check');
const requiredModules = ['express', 'firebase', 'dotenv'];
let depsOk = true;

requiredModules.forEach(moduleName => {
  try {
    if (moduleName === 'firebase') {
      // Firebase v9+ uses different import structure
      require('firebase/app');
      require('firebase/firestore');
      require('firebase/auth');
    } else {
      require(moduleName);
    }
    console.log(`✅ ${moduleName}: Available`);
  } catch (error) {
    console.log(`❌ ${moduleName}: Missing - ${error.message}`);
    depsOk = false;
  }
});

// Step 3: Firebase Test
console.log('\n3️⃣ Firebase Connection Test');
async function testFirebase() {
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

    console.log('✅ Firebase initialized');

    // Test auth
    const userCred = await signInAnonymously(auth);
    console.log(`✅ Authenticated: ${userCred.user.uid}`);

    // Test Firestore
    const testDoc = doc(db, 'setup_test', 'test');
    await setDoc(testDoc, { test: true, timestamp: new Date() });
    console.log('✅ Firestore write OK');

    await deleteDoc(testDoc);
    console.log('✅ Firestore cleanup OK');

    return true;
  } catch (error) {
    console.log(`❌ Firebase test failed: ${error.message}`);
    return false;
  }
}

// Step 4: File Structure Check
console.log('\n4️⃣ File Structure Check');
const fs = require('fs');
const path = require('path');

const requiredFiles = ['package.json', 'firebase.json', 'firestore.rules', 'client/package.json', 'server/index.js'];

let filesOk = true;
requiredFiles.forEach(filePath => {
  if (fs.existsSync(path.join(__dirname, filePath))) {
    console.log(`✅ ${filePath}: Found`);
  } else {
    console.log(`❌ ${filePath}: Missing`);
    filesOk = false;
  }
});

// Run Firebase test
console.log('\n5️⃣ Running Firebase Test...');
testFirebase()
  .then(firebaseOk => {
    console.log('\n📋 Setup Summary');
    console.log('================');
    console.log(`Environment: ${envOk ? '✅' : '❌'}`);
    console.log(`Dependencies: ${depsOk ? '✅' : '❌'}`);
    console.log(`Files: ${filesOk ? '✅' : '❌'}`);
    console.log(`Firebase: ${firebaseOk ? '✅' : '❌'}`);

    const allOk = envOk && depsOk && filesOk && firebaseOk;

    if (allOk) {
      console.log('\n🎉 Setup Complete! System is ready.');
      console.log('\nNext steps:');
      console.log('1. Start client: cd client && npm start');
      console.log('2. Start server: npm start');
      console.log('3. Access: http://localhost:3000');
    } else {
      console.log('\n⚠️ Setup incomplete. Please fix the issues above.');
    }

    process.exit(allOk ? 0 : 1);
  })
  .catch(error => {
    console.error('💥 Setup failed:', error);
    process.exit(1);
  });
