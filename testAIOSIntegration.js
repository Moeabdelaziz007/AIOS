/**
 * Test Script for AIOS System Integration
 * Tests Learning Loop, Debug Tool, and Autopilot Systems
 */

const AIOSSystemIntegration = require('./server/aiosSystemIntegration.js');

async function testAIOSIntegration() {
  console.log('🧪 Testing AIOS System Integration...\n');

  try {
    // Initialize system integration
    const integration = new AIOSSystemIntegration();

    // Telegram configuration (you'll need to provide real values)
    const telegramConfig = {
      token: process.env.TELEGRAM_BOT_TOKEN || 'your-telegram-bot-token',
      chatId: process.env.TELEGRAM_CHAT_ID || 'your-telegram-chat-id',
    };

    console.log('🚀 Initializing AIOS System Integration...');
    const initResult = await integration.initialize(telegramConfig);
    console.log('✅ Initialization Result:', initResult);
    console.log('');

    // Test system status
    console.log('📊 Testing System Status...');
    const status = integration.getSystemStatus();
    console.log('System Status:', JSON.stringify(status, null, 2));
    console.log('');

    // Test learning insights
    console.log('🧠 Testing Learning Insights...');
    const insights = integration.getLearningInsights();
    console.log('Learning Insights:', JSON.stringify(insights, null, 2));
    console.log('');

    // Test system analysis
    console.log('🔍 Testing System Analysis...');
    const analysis = await integration.runSystemAnalysis();
    console.log('System Analysis:', JSON.stringify(analysis, null, 2));
    console.log('');

    // Test individual components
    console.log('🔧 Testing Individual Components...');

    if (integration.learningLoop) {
      console.log(
        'Learning Loop Status:',
        integration.learningLoop.getStatus()
      );
    }

    if (integration.debugTool) {
      console.log('Debug Tool Status:', integration.debugTool.getDebugStatus());
    }

    if (integration.unifiedAutopilot) {
      console.log(
        'Unified Autopilot Status:',
        integration.unifiedAutopilot.getStatus()
      );
    }

    if (integration.quantumAutopilot) {
      console.log(
        'Quantum Autopilot Status:',
        integration.quantumAutopilot.getStatus()
      );
    }

    console.log('');
    console.log('✅ All tests completed successfully!');

    // Keep system running for a few seconds to test real-time functionality
    console.log(
      '⏳ Keeping system active for 30 seconds to test real-time functionality...'
    );
    await new Promise(resolve => setTimeout(resolve, 30000));

    // Deactivate system
    console.log('🛑 Deactivating system...');
    await integration.deactivate();

    console.log('✅ Test completed successfully!');
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run the test
if (require.main === module) {
  testAIOSIntegration();
}

module.exports = testAIOSIntegration;
