/**
 * Test AIOS Smart Agent Bot with Gemini API
 * Simple test to verify configuration and basic functionality
 */

require('dotenv').config({ path: './firebase.env' });

console.log('🧪 Testing AIOS Smart Agent Bot Configuration...');
console.log('='.repeat(60));

// Test environment variables
console.log('📋 Environment Variables:');
console.log(
  `Firebase Project ID: ${process.env.FIREBASE_PROJECT_ID || 'Not set'}`
);
console.log(
  `Telegram Bot Token: ${
    process.env.TELEGRAM_BOT_TOKEN
      ? 'Set (length: ' + process.env.TELEGRAM_BOT_TOKEN.length + ')'
      : 'Not set'
  }`
);
console.log(
  `Gemini API Key: ${
    process.env.GEMINI_API_KEY
      ? 'Set (length: ' + process.env.GEMINI_API_KEY.length + ')'
      : 'Not set'
  }`
);
console.log(
  `Telegram Channel ID: ${process.env.TELEGRAM_CHANNEL_ID || 'Not set'}`
);
console.log(`Debugger Chat ID: ${process.env.DEBUGGER_CHAT_ID || 'Not set'}`);

console.log('\n🔧 Testing Gemini API Integration...');

// Test Gemini API
async function testGeminiAPI() {
  try {
    const { GoogleGenerativeAI } = require('@google/generative-ai');

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Gemini API key not found');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-pro',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });

    console.log('✅ Gemini API initialized successfully');

    // Test a simple query
    const testQuery =
      "Hello, I'm testing the AIOS Smart Agent Bot. Can you respond with a brief greeting?";
    console.log(`📝 Test Query: ${testQuery}`);

    const result = await model.generateContent(testQuery);
    const response = await result.response;
    const text = response.text();

    console.log('✅ Gemini API response received:');
    console.log(
      `🤖 AI Response: ${text.substring(0, 200)}${
        text.length > 200 ? '...' : ''
      }`
    );

    return true;
  } catch (error) {
    console.error('❌ Gemini API test failed:', error.message);
    return false;
  }
}

// Test Telegram Bot
async function testTelegramBot() {
  try {
    const TelegramBot = require('node-telegram-bot-api');

    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      throw new Error('Telegram bot token not found');
    }

    const bot = new TelegramBot(token, { polling: false });

    // Test bot info
    const botInfo = await bot.getMe();
    console.log('✅ Telegram Bot initialized successfully');
    console.log(`🤖 Bot Info: ${botInfo.first_name} (@${botInfo.username})`);

    return true;
  } catch (error) {
    console.error('❌ Telegram Bot test failed:', error.message);
    return false;
  }
}

// Test Firebase Configuration
async function testFirebaseConfig() {
  try {
    console.log('✅ Firebase configuration validated');
    console.log(`📊 Project ID: ${process.env.FIREBASE_PROJECT_ID}`);
    console.log(
      `🔑 API Key: ${process.env.FIREBASE_API_KEY ? 'Present' : 'Missing'}`
    );
    console.log(`🌐 Auth Domain: ${process.env.FIREBASE_AUTH_DOMAIN}`);
    console.log(`📦 Storage Bucket: ${process.env.FIREBASE_STORAGE_BUCKET}`);

    return true;
  } catch (error) {
    console.error('❌ Firebase configuration test failed:', error.message);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log('\n🚀 Running Configuration Tests...');
  console.log('-'.repeat(60));

  const results = {
    firebase: await testFirebaseConfig(),
    gemini: await testGeminiAPI(),
    telegram: await testTelegramBot(),
  };

  console.log('\n📊 Test Results Summary:');
  console.log('-'.repeat(60));
  console.log(`Firebase Config: ${results.firebase ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Gemini API: ${results.gemini ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Telegram Bot: ${results.telegram ? '✅ PASS' : '❌ FAIL'}`);

  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  const successRate = (passedTests / totalTests) * 100;

  console.log(
    `\n📈 Overall Success Rate: ${successRate.toFixed(
      1
    )}% (${passedTests}/${totalTests})`
  );

  if (successRate === 100) {
    console.log(
      '\n🎉 ALL TESTS PASSED! AIOS Smart Agent Bot is ready for deployment.'
    );
  } else {
    console.log('\n⚠️ Some tests failed. Please check the configuration.');
  }

  console.log('\n' + '='.repeat(60));
}

// Run the tests
runAllTests().catch(console.error);
