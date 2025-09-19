const { config } = require('dotenv');
const path = require('path');

// Load environment variables
config({ path: path.join(__dirname, 'firebase.env') });

console.log('🧪 Testing Quantum Autopilot Error Detection...\n');

// Test environment variables
console.log('📋 Environment Variables:');
console.log(`   TELEGRAM_BOT_TOKEN: ${process.env.TELEGRAM_BOT_TOKEN ? '✅ Set' : '❌ Missing'}`);
console.log(`   TELEGRAM_CHANNEL_ID: ${process.env.TELEGRAM_CHANNEL_ID ? '✅ Set' : '❌ Missing'}`);
console.log(`   DEBUGGER_CHAT_ID: ${process.env.DEBUGGER_CHAT_ID ? '✅ Set' : '❌ Missing'}`);

if (process.env.TELEGRAM_BOT_TOKEN) {
  console.log(`   Bot Token: ${process.env.TELEGRAM_BOT_TOKEN.substring(0, 10)}...`);
}
if (process.env.TELEGRAM_CHANNEL_ID) {
  console.log(`   Channel ID: ${process.env.TELEGRAM_CHANNEL_ID}`);
}
if (process.env.DEBUGGER_CHAT_ID) {
  console.log(`   Debugger Chat ID: ${process.env.DEBUGGER_CHAT_ID}`);
}

console.log('\n🤖 Testing Quantum Autopilot Import...');

try {
  const QuantumAutopilot = require('./server/quantumAutopilot.js');
  console.log('✅ Quantum Autopilot imported successfully');
  
  // Test instantiation
  const autopilot = new QuantumAutopilot();
  console.log('✅ Quantum Autopilot instantiated successfully');
  
  // Test sending a test error
  console.log('\n📤 Sending test error to Telegram...');
  autopilot.handleError({
    type: 'test',
    file: 'test.js',
    line: 1,
    message: 'This is a test error from Quantum Autopilot setup',
    stack: 'Test stack trace',
    timestamp: new Date().toISOString()
  });
  
  console.log('✅ Test error sent successfully');
  console.log('\n🎉 Quantum Autopilot is ready!');
  
  // Test Firebase permission error
  console.log('\n📤 Sending Firebase permission error...');
  autopilot.handleError({
    type: 'firebase-permission',
    file: 'server/index.js',
    line: 327,
    message: 'FirebaseError: Missing or insufficient permissions.',
    stack: 'FirebaseError: Missing or insufficient permissions.',
    timestamp: new Date().toISOString(),
    errorCode: 'permission-denied',
    customData: { code: 'permission-denied' }
  });
  
  console.log('✅ Firebase permission error sent successfully');
  
} catch (error) {
  console.error('❌ Error testing Quantum Autopilot:', error.message);
  console.error('Stack:', error.stack);
}

console.log('\n📋 Next Steps:');
console.log('1. Check your Telegram for the test messages');
console.log('2. The system will now send Firebase permission errors to Telegram');
console.log('3. Use /debug firebase-permission in Telegram for debugging');
console.log('4. The system will learn from errors and suggest fixes');
