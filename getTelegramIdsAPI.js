const https = require('https');

const BOT_TOKEN = '8310343758:AAFLtyqdQ5PE8YtyChwJ4uGfAgy4s5qMYi0';

console.log('🔍 Getting Telegram Updates to find Chat IDs...\n');

function getUpdates() {
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
          console.log('📨 Found messages:');
          console.log('==================');
          
          response.result.forEach((update, index) => {
            if (update.message) {
              const chat = update.message.chat;
              console.log(`Message ${index + 1}:`);
              console.log(`  Chat ID: ${chat.id}`);
              console.log(`  Chat Type: ${chat.type}`);
              console.log(`  Chat Title: ${chat.title || chat.first_name || 'Unknown'}`);
              console.log(`  Message: ${update.message.text || 'No text'}`);
              console.log('---');
            }
            
            if (update.channel_post) {
              const chat = update.channel_post.chat;
              console.log(`Channel Post ${index + 1}:`);
              console.log(`  Channel ID: ${chat.id}`);
              console.log(`  Channel Title: ${chat.title}`);
              console.log(`  Post: ${update.channel_post.text || 'No text'}`);
              console.log('---');
            }
          });
          
          console.log('\n📋 Instructions:');
          console.log('1. Send a message to your bot to get your Chat ID');
          console.log('2. Create a channel and add the bot as admin');
          console.log('3. Post a message in the channel');
          console.log('4. Run this script again to see the new IDs');
          console.log('5. Copy the IDs to your firebase.env file');
          
        } else {
          console.log('📭 No messages found yet.');
          console.log('\n📋 To get Chat IDs:');
          console.log('1. Send a message to your bot (@your_bot_name)');
          console.log('2. Create a channel and add the bot as admin');
          console.log('3. Post a message in the channel');
          console.log('4. Run this script again');
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
getUpdates();

// Get updates every 10 seconds
setInterval(getUpdates, 10000);

console.log('🔄 Checking for updates every 10 seconds...');
console.log('⏹️  Press Ctrl+C to stop\n');
