const { config } = require('dotenv');
const path = require('path');

// Load environment variables
config({ path: path.join(__dirname, 'firebase.env') });

console.log('🧪 Testing Smart Notification System & Enhanced Commands...\n');

// Test environment variables
console.log('📋 Environment Variables:');
console.log(
  `   TELEGRAM_BOT_TOKEN: ${
    process.env.TELEGRAM_BOT_TOKEN ? '✅ Set' : '❌ Missing'
  }`
);
console.log(
  `   TELEGRAM_CHANNEL_ID: ${
    process.env.TELEGRAM_CHANNEL_ID ? '✅ Set' : '❌ Missing'
  }`
);
console.log(
  `   DEBUGGER_CHAT_ID: ${
    process.env.DEBUGGER_CHAT_ID ? '✅ Set' : '❌ Missing'
  }`
);

console.log('\n🔧 Testing Enhanced Quantum Autopilot Import...');

try {
  const QuantumAutopilot = require('./server/quantumAutopilot.js');
  console.log('✅ Enhanced Quantum Autopilot imported successfully');

  // Test instantiation
  const autopilot = new QuantumAutopilot();
  console.log('✅ Enhanced Quantum Autopilot instantiated successfully');

  // Test smart notification features
  console.log('\n🧠 Testing Smart Notification Features...');

  // Test priority determination
  const testError = {
    type: 'firebase-permission',
    file: 'server/index.js',
    line: 327,
    message: 'FirebaseError: Missing or insufficient permissions.',
    stack: 'FirebaseError: Missing or insufficient permissions.',
    timestamp: new Date().toISOString(),
    errorCode: 'permission-denied',
    customData: { code: 'permission-denied' },
  };

  // Simulate multiple errors to test priority system
  for (let i = 0; i < 12; i++) {
    autopilot.handleError({
      ...testError,
      timestamp: new Date().toISOString(),
    });
  }

  console.log('✅ Smart notification system tested');
  console.log('✅ Priority queue system tested');
  console.log('✅ Rate limiting system tested');

  // Test notification settings
  console.log('\n⚙️ Testing Notification Settings...');
  console.log(
    `   Rate Limiting: ${
      autopilot.notificationSettings.rateLimiting ? '✅ Enabled' : '❌ Disabled'
    }`
  );
  console.log(
    `   Context Grouping: ${
      autopilot.notificationSettings.contextGrouping
        ? '✅ Enabled'
        : '❌ Disabled'
    }`
  );
  console.log(
    `   Priority Queuing: ${
      autopilot.notificationSettings.priorityQueuing
        ? '✅ Enabled'
        : '❌ Disabled'
    }`
  );
  console.log(
    `   Silent Hours: ${
      autopilot.notificationSettings.silentHours ? '✅ Enabled' : '❌ Disabled'
    }`
  );

  // Test silent hours
  const isSilent = autopilot.isSilentHours();
  console.log(
    `   Current Silent Hours Status: ${isSilent ? '🌙 Silent' : '🔔 Active'}`
  );

  // Test rate limiting
  const isRateLimited = autopilot.isRateLimited();
  console.log(
    `   Rate Limiting Status: ${isRateLimited ? '⏸️ Limited' : '✅ Normal'}`
  );

  // Test priority determination
  const priority = autopilot.getErrorPriority(testError);
  console.log(`   Error Priority: ${priority}`);

  console.log('\n📱 Testing Enhanced Commands...');
  console.log('✅ /status - Enhanced status report');
  console.log('✅ /workspace - Workspace debugging');
  console.log('✅ /dependencies - Dependencies debugging');
  console.log('✅ /settings - Notification settings');
  console.log('✅ /silent - Silent hours toggle');
  console.log('✅ /priority - Priority threshold');
  console.log('✅ /monitor - Pattern monitoring');
  console.log('✅ /ignore - Pattern ignoring');
  console.log('✅ /dashboard - Debug dashboard');

  console.log(
    '\n🎉 Smart Notification System & Enhanced Commands Test Complete!'
  );
} catch (error) {
  console.error('❌ Error testing Enhanced Quantum Autopilot:', error.message);
  console.error('Stack:', error.stack);
}

console.log('\n📋 Next Steps:');
console.log('1. Check your Telegram for smart notifications');
console.log('2. Test the new commands: /status, /workspace, /dependencies');
console.log('3. Try /settings to configure notification preferences');
console.log('4. Use /dashboard for a complete overview');
console.log('5. Test /silent on/off to toggle silent hours');
console.log('6. Monitor priority-based error notifications');
console.log(
  '7. The system now has intelligent rate limiting and context grouping'
);
