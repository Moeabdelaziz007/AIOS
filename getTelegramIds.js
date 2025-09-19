const TelegramBot = require('node-telegram-bot-api');
const { config } = require('dotenv');
const path = require('path');

// Load environment variables from firebase.env
config({ path: path.join(__dirname, 'firebase.env') });

// Check if Bot Token is available
if (!process.env.TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN === 'your_telegram_bot_token_here') {
  console.error('❌ TELEGRAM_BOT_TOKEN not found in environment variables!');
  console.log('Please check your firebase.env file and make sure TELEGRAM_BOT_TOKEN is set correctly.');
  process.exit(1);
}

console.log('✅ Bot Token loaded:', process.env.TELEGRAM_BOT_TOKEN.substring(0, 10) + '...');

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

console.log('🤖 Telegram Bot started for ID detection');
console.log('📱 Send any message to this bot to get your Chat ID');
console.log('📢 Create a channel and add this bot as admin to get Channel ID');
console.log('⏹️  Press Ctrl+C to stop\n');

// Handle all messages
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const chatType = msg.chat.type;
  const chatTitle = msg.chat.title || msg.chat.first_name || 'Unknown';
  
  console.log('📨 Message received:');
  console.log(`   Chat ID: ${chatId}`);
  console.log(`   Chat Type: ${chatType}`);
  console.log(`   Chat Title: ${chatTitle}`);
  console.log(`   Message: ${msg.text || 'No text'}`);
  console.log('---');
  
  // Send confirmation message
  bot.sendMessage(chatId, 
    `✅ **Chat ID Detected!**\n\n` +
    `**Chat ID:** \`${chatId}\`\n` +
    `**Chat Type:** ${chatType}\n` +
    `**Chat Title:** ${chatTitle}\n\n` +
    `Copy this Chat ID to your environment variables!`,
    { parse_mode: 'Markdown' }
  );
});

// Handle channel posts
bot.on('channel_post', (post) => {
  const channelId = post.chat.id;
  const channelTitle = post.chat.title;
  
  console.log('📢 Channel post detected:');
  console.log(`   Channel ID: ${channelId}`);
  console.log(`   Channel Title: ${channelTitle}`);
  console.log(`   Post: ${post.text || 'No text'}`);
  console.log('---');
  
  // Send confirmation to channel
  bot.sendMessage(channelId, 
    `✅ **Channel ID Detected!**\n\n` +
    `**Channel ID:** \`${channelId}\`\n` +
    `**Channel Title:** ${channelTitle}\n\n` +
    `Copy this Channel ID to your environment variables!`,
    { parse_mode: 'Markdown' }
  );
});

// Handle errors
bot.on('error', (error) => {
  console.error('❌ Bot error:', error);
});

bot.on('polling_error', (error) => {
  console.error('❌ Polling error:', error);
});

console.log('🔍 Bot is now listening for messages...');
console.log('📋 Instructions:');
console.log('   1. Send a message to this bot to get your Chat ID');
console.log('   2. Create a Telegram channel');
console.log('   3. Add this bot as an administrator to the channel');
console.log('   4. Post a message in the channel to get Channel ID');
console.log('   5. Copy the IDs to your .env file');
console.log('');
