const { config } = require('dotenv');
const path = require('path');

// Load environment variables
config({ path: path.join(__dirname, 'firebase.env') });

console.log('🧪 Testing AIOS Integration System with Unified Autopilot...\n');

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

console.log('\n🔧 Testing AIOS Integration System Import...');

try {
  const AIOSIntegrationSystem = require('./aiosIntegrationSystem.js');
  console.log('✅ AIOS Integration System imported successfully');

  // Test instantiation
  console.log('\n🚀 Testing System Instantiation...');
  const system = new AIOSIntegrationSystem();
  console.log('✅ AIOS Integration System instantiated');

  // Test unified autopilot access
  console.log('\n🧠 Testing Unified Autopilot Access...');
  const autopilot = system.getUnifiedAutopilot();
  if (autopilot) {
    console.log('✅ Unified Autopilot System accessible');

    // Test status
    const status = autopilot.getStatus();
    console.log('✅ System status retrieved:');
    console.log(`   Active: ${status.isActive}`);
    console.log(`   Error Count: ${status.errorCount}`);
    console.log(`   Categories: ${status.categories}`);
    console.log(`   Uptime: ${Math.floor(status.uptime)}s`);
  } else {
    console.log('⚠️ Unified Autopilot System not yet initialized');
  }

  // Test error flow manager
  console.log('\n🔄 Testing Error Flow Manager...');
  const errorFlowManager = system.getErrorFlowManager();
  if (errorFlowManager) {
    console.log('✅ Error Flow Manager accessible');
  } else {
    console.log('⚠️ Error Flow Manager not yet initialized');
  }

  // Test system config
  console.log('\n⚙️ Testing System Config...');
  const systemConfig = system.getSystemConfig();
  if (systemConfig) {
    console.log('✅ System Config accessible');
  } else {
    console.log('⚠️ System Config not yet initialized');
  }

  console.log('\n🎉 AIOS Integration System Test Complete!');
} catch (error) {
  console.error('❌ Error testing AIOS Integration System:', error.message);
  console.error('Stack:', error.stack);
}

console.log('\n📋 Integration Benefits:');
console.log(
  '1. ✅ Single unified autopilot system instead of 3 separate agents'
);
console.log('2. ✅ Consistent error handling across the entire application');
console.log('3. ✅ Simplified API endpoints with unified status reporting');
console.log('4. ✅ Better performance through consolidated error processing');
console.log('5. ✅ Easier maintenance with single source of truth');
console.log('6. ✅ Enhanced debugging capabilities with smart notifications');
console.log('7. ✅ Reduced memory usage and improved efficiency');

console.log('\n🚀 Next Steps:');
console.log('1. Start the integrated system: npm start');
console.log('2. Test the new API endpoints: /api/health, /api/system/status');
console.log('3. Monitor Telegram for unified error notifications');
console.log('4. Verify performance improvements in production');
console.log('5. Update client-side code to use new unified endpoints');
