const https = require('https');

const BOT_TOKEN = '8310343758:AAFLtyqdQ5PE8YtyChwJ4uGfAgy4s5qMYi0';

console.log('🔍 Getting Channel ID from Telegram API...\n');

function getChannelId() {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/getUpdates`;
  
  https.get(url, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        
        if (response.ok && response.result.length > 0) {
          console.log('📨 Found updates:');
          console.log('==================');
          
          let foundChannel = false;
          response.result.forEach((update, index) => {
            if (update.channel_post) {
              const chat = update.channel_post.chat;
              console.log(`Channel Post ${index + 1}:`);
              console.log(`  Channel ID: ${chat.id}`);
              console.log(`  Channel Title: ${chat.title}`);
              console.log(`  Post: ${update.channel_post.text || 'No text'}`);
              console.log('---');
              foundChannel = true;
            }
          });
          
          if (!foundChannel) {
            console.log('📭 No channel posts found yet.');
            console.log('\n📋 To get Channel ID:');
            console.log('1. Post a message in your channel');
            console.log('2. Run this script again');
          } else {
            console.log('\n✅ Channel ID found! Copy it to your firebase.env file');
          }
          
        } else {
          console.log('📭 No updates found yet.');
          console.log('\n📋 To get Channel ID:');
          console.log('1. Post a message in your channel');
          console.log('2. Run this script again');
        }
        
      } catch (error) {
        console.error('❌ Error parsing response:', error.message);
      }
    });
    
  }).on('error', (error) => {
    console.error('❌ Error getting updates:', error.message);
  });
}

// Get updates immediately
getChannelId();

console.log('🔄 Checking for channel posts...');
console.log('⏹️  Press Ctrl+C to stop\n');
