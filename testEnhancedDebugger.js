const { config } = require('dotenv');
const path = require('path');

// Load environment variables
config({ path: path.join(__dirname, 'firebase.env') });

console.log('🧪 Testing Enhanced Cursor Debugger Agent...\n');

// Test environment variables
console.log('📋 Environment Variables:');
console.log(`   TELEGRAM_BOT_TOKEN: ${process.env.TELEGRAM_BOT_TOKEN ? '✅ Set' : '❌ Missing'}`);
console.log(`   TELEGRAM_CHANNEL_ID: ${process.env.TELEGRAM_CHANNEL_ID ? '✅ Set' : '❌ Missing'}`);
console.log(`   DEBUGGER_CHAT_ID: ${process.env.DEBUGGER_CHAT_ID ? '✅ Set' : '❌ Missing'}`);

console.log('\n🔧 Testing Cursor Debugger Agent Import...');

try {
  const CursorDebuggerAgent = require('./server/cursorDebuggerAgent.js');
  console.log('✅ Cursor Debugger Agent imported successfully');
  
  // Test instantiation
  const debuggerAgent = new CursorDebuggerAgent();
  console.log('✅ Cursor Debugger Agent instantiated successfully');
  
  // Test activation
  const activatedAgent = debuggerAgent.activate();
  console.log('✅ Cursor Debugger Agent activated successfully');
  
  // Test status
  const status = activatedAgent.getStatus();
  console.log('\n📊 Debugger Agent Status:');
  console.log(`   Active: ${status.isActive ? '✅ Yes' : '❌ No'}`);
  console.log(`   Patterns Stored: ${status.patternsStored}`);
  console.log(`   Workspace Root: ${status.workspaceRoot}`);
  console.log(`   Cursor Workspace: ${status.cursorWorkspace ? '✅ Enabled' : '❌ Disabled'}`);
  console.log(`   LLM Integration: ${status.llmIntegration ? '✅ Enabled' : '❌ Disabled'}`);
  
  // Test LLM debugging
  console.log('\n🧠 Testing LLM-enhanced debugging...');
  const testError = {
    type: 'firebase-permission',
    file: 'server/index.js',
    line: 327,
    message: 'FirebaseError: Missing or insufficient permissions.',
    stack: 'FirebaseError: Missing or insufficient permissions.',
    timestamp: new Date().toISOString(),
    errorCode: 'permission-denied',
    customData: { code: 'permission-denied' }
  };
  
  activatedAgent.debugErrorWithLLM(testError).then(fix => {
    if (fix) {
      console.log('✅ LLM-enhanced debugging successful');
      console.log(`   Fix Type: ${fix.type}`);
      console.log(`   Confidence: ${(fix.confidence * 100).toFixed(1)}%`);
      console.log(`   Description: ${fix.description}`);
      console.log(`   Analysis: ${fix.analysis.errorType}`);
      console.log(`   Affected Files: ${fix.analysis.affectedFiles.join(', ')}`);
      console.log(`   Suggested Fixes: ${fix.fixes.length}`);
    } else {
      console.log('❌ LLM-enhanced debugging failed');
    }
  }).catch(error => {
    console.error('❌ Error in LLM debugging:', error.message);
  });
  
} catch (error) {
  console.error('❌ Error testing Cursor Debugger Agent:', error.message);
  console.error('Stack:', error.stack);
}

console.log('\n📋 Next Steps:');
console.log('1. Check your Telegram for enhanced debugging messages');
console.log('2. The system now has full workspace context');
console.log('3. LLM integration provides intelligent fixes');
console.log('4. Cursor workspace integration enables advanced debugging');
console.log('5. The system learns from workspace structure and dependencies');
