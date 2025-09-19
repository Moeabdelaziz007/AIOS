/**
 * 🧪 Test Script for Quantum Autopilot System
 * 
 * This script tests the complete multi-agent system
 */

const QuantumAutopilotSystem = require('./server/quantumAutopilotSystem');

console.log('🧪 Starting Quantum Autopilot System Test...\n');

// Initialize the system
const system = new QuantumAutopilotSystem();

// Wait for system to initialize
setTimeout(() => {
  console.log('\n📊 System Statistics:');
  console.log(JSON.stringify(system.getSystemStats(), null, 2));
  
  console.log('\n🧪 Injecting test errors...');
  
  // Test 1: Firebase Permission Error
  system.autopilotAgent.captureError({
    type: 'firebase-error',
    message: 'FirebaseError: Missing or insufficient permissions',
    stack: 'FirebaseError: Missing or insufficient permissions\n    at Firestore.get',
    file: 'firebaseService.js',
    line: '42',
    timestamp: new Date().toISOString(),
    severity: 'high'
  });
  
  // Test 2: Network Error
  system.autopilotAgent.captureError({
    type: 'network-error',
    message: 'Network error - please check your connection',
    stack: 'Error: Network error\n    at fetch',
    file: 'api.js',
    line: '15',
    timestamp: new Date().toISOString(),
    severity: 'medium'
  });
  
  // Test 3: Syntax Error
  system.autopilotAgent.captureError({
    type: 'syntax-error',
    message: 'SyntaxError: Unexpected token }',
    stack: 'SyntaxError: Unexpected token }\n    at parse',
    file: 'component.jsx',
    line: '25',
    timestamp: new Date().toISOString(),
    severity: 'high'
  });
  
  console.log('\n⏳ Waiting for queue processing...');
  
  // Wait for queue processing
  setTimeout(() => {
    console.log('\n📊 Final System Statistics:');
    console.log(JSON.stringify(system.getSystemStats(), null, 2));
    
    console.log('\n🎯 Improvement Recommendations:');
    const recommendations = system.learnerAgent.getImprovementRecommendations();
    recommendations.forEach((rec, index) => {
      console.log(`${index + 1}. ${rec.type}: ${rec.recommendation}`);
    });
    
    console.log('\n✅ Test completed successfully!');
    process.exit(0);
  }, 70000); // Wait 70 seconds for queue processing
  
}, 2000); // Wait 2 seconds for initialization
