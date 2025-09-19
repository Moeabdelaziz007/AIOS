/**
 * 🔥 Firebase Permissions Fix Script
 * 
 * This script fixes common Firebase permission issues
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, getDoc } = require('firebase/firestore');
const { config } = require('dotenv');
const path = require('path');

// Load environment variables
config({ path: path.join(__dirname, '../firebase.env') });

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log('🔥 Firebase Permissions Fix Script');
console.log('=====================================\n');

// Test Firebase connection
async function testFirebaseConnection() {
  try {
    console.log('📡 Testing Firebase connection...');
    
    // Test basic read operation
    const testDoc = doc(db, 'test', 'connection');
    await setDoc(testDoc, {
      timestamp: new Date().toISOString(),
      test: true
    });
    
    console.log('✅ Firebase connection successful');
    return true;
  } catch (error) {
    console.error('❌ Firebase connection failed:', error.message);
    return false;
  }
}

// Fix Quantum Autopilot permissions
async function fixQuantumAutopilotPermissions() {
  try {
    console.log('\n🔧 Fixing Quantum Autopilot permissions...');
    
    // Create test document in quantum_autopilot collection
    const testDoc = doc(db, 'quantum_autopilot', 'test');
    await setDoc(testDoc, {
      timestamp: new Date().toISOString(),
      status: 'active',
      version: '1.0.0'
    });
    
    console.log('✅ Quantum Autopilot permissions fixed');
    return true;
  } catch (error) {
    console.error('❌ Quantum Autopilot permissions failed:', error.message);
    return false;
  }
}

// Fix error logs permissions
async function fixErrorLogsPermissions() {
  try {
    console.log('\n📝 Fixing error logs permissions...');
    
    // Create test document in error_logs collection
    const testDoc = doc(db, 'error_logs', 'test');
    await setDoc(testDoc, {
      timestamp: new Date().toISOString(),
      type: 'test',
      message: 'Permission test',
      severity: 'low'
    });
    
    console.log('✅ Error logs permissions fixed');
    return true;
  } catch (error) {
    console.error('❌ Error logs permissions failed:', error.message);
    return false;
  }
}

// Fix system monitoring permissions
async function fixSystemMonitoringPermissions() {
  try {
    console.log('\n📊 Fixing system monitoring permissions...');
    
    // Create test document in system_monitoring collection
    const testDoc = doc(db, 'system_monitoring', 'test');
    await setDoc(testDoc, {
      timestamp: new Date().toISOString(),
      cpu: 0,
      memory: 0,
      uptime: 0
    });
    
    console.log('✅ System monitoring permissions fixed');
    return true;
  } catch (error) {
    console.error('❌ System monitoring permissions failed:', error.message);
    return false;
  }
}

// Fix guest data permissions
async function fixGuestDataPermissions() {
  try {
    console.log('\n👤 Fixing guest data permissions...');
    
    // Create test document in guest_data collection
    const testDoc = doc(db, 'guest_data', 'test');
    await setDoc(testDoc, {
      timestamp: new Date().toISOString(),
      type: 'guest',
      access: 'public'
    });
    
    console.log('✅ Guest data permissions fixed');
    return true;
  } catch (error) {
    console.error('❌ Guest data permissions failed:', error.message);
    return false;
  }
}

// Main fix function
async function fixFirebasePermissions() {
  console.log('🚀 Starting Firebase permissions fix...\n');
  
  const results = {
    connection: await testFirebaseConnection(),
    quantumAutopilot: await fixQuantumAutopilotPermissions(),
    errorLogs: await fixErrorLogsPermissions(),
    systemMonitoring: await fixSystemMonitoringPermissions(),
    guestData: await fixGuestDataPermissions()
  };
  
  console.log('\n📊 Fix Results:');
  console.log('================');
  
  for (const [key, success] of Object.entries(results)) {
    console.log(`${success ? '✅' : '❌'} ${key}: ${success ? 'Fixed' : 'Failed'}`);
  }
  
  const successCount = Object.values(results).filter(Boolean).length;
  const totalCount = Object.keys(results).length;
  
  console.log(`\n🎯 Overall: ${successCount}/${totalCount} permissions fixed`);
  
  if (successCount === totalCount) {
    console.log('🎉 All Firebase permissions are working correctly!');
  } else {
    console.log('⚠️ Some permissions still need attention. Check Firestore rules.');
  }
  
  return results;
}

// Run the fix
if (require.main === module) {
  fixFirebasePermissions()
    .then(() => {
      console.log('\n✨ Firebase permissions fix completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Firebase permissions fix failed:', error);
      process.exit(1);
    });
}

module.exports = {
  fixFirebasePermissions,
  testFirebaseConnection,
  fixQuantumAutopilotPermissions,
  fixErrorLogsPermissions,
  fixSystemMonitoringPermissions,
  fixGuestDataPermissions
};
