const { config } = require('dotenv');
const path = require('path');

// Load environment variables
config({ path: path.join(__dirname, 'firebase.env') });

console.log('🔍 AIOS Error Monitor');
console.log('====================\n');

console.log('📊 Current System Status:');
console.log(`   Server: ${process.env.AIOS_API_URL || 'http://localhost:5000/api'}`);
console.log(`   WebSocket: ${process.env.AIOS_WS_URL || 'http://localhost:5000'}`);
console.log(`   Firebase Project: ${process.env.FIREBASE_PROJECT_ID || 'Not set'}`);

console.log('\n🤖 Quantum Autopilot Status:');
console.log(`   Bot Token: ${process.env.TELEGRAM_BOT_TOKEN ? '✅ Configured' : '❌ Missing'}`);
console.log(`   Channel ID: ${process.env.TELEGRAM_CHANNEL_ID || 'Not set'}`);
console.log(`   Debugger Chat ID: ${process.env.DEBUGGER_CHAT_ID || 'Not set'}`);

console.log('\n📱 Telegram Integration:');
console.log(`   Your Chat ID: ${process.env.DEBUGGER_CHAT_ID}`);
console.log(`   Bot will send errors to: ${process.env.TELEGRAM_CHANNEL_ID}`);

console.log('\n🚨 Known Issues:');
console.log('   - Firebase permission errors (periodic system status updates)');
console.log('   - These will be automatically detected and sent to Telegram');
console.log('   - Quantum Autopilot will attempt to fix them');

console.log('\n📋 What to expect:');
console.log('   1. Firebase permission errors will be sent to your Telegram');
console.log('   2. Quantum Autopilot will analyze and suggest fixes');
console.log('   3. System will learn from previous fixes');
console.log('   4. Auto-healing will improve over time');

console.log('\n🎯 Next Steps:');
console.log('   1. Check your Telegram for error notifications');
console.log('   2. Monitor the console for Quantum Autopilot activity');
console.log('   3. The system will automatically handle Firebase permission issues');
console.log('   4. You can send commands to the bot for manual debugging');

console.log('\n✨ Quantum Autopilot is now active and monitoring your system!');
