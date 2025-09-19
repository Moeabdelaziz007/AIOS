const https = require('https');

const BOT_TOKEN = '8310343758:AAFLtyqdQ5PE8YtyChwJ4uGfAgy4s5qMYi0';

console.log('🔍 Monitoring for Channel ID...');
console.log('📢 Please post a message in your channel now!\n');

function checkForChannelId() {
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
          let foundChannel = false;
          response.result.forEach((update) => {
            if (update.channel_post) {
              const chat = update.channel_post.chat;
              console.log('🎉 Channel ID Found!');
              console.log('==================');
              console.log(`Channel ID: ${chat.id}`);
              console.log(`Channel Title: ${chat.title}`);
              console.log(`Post: ${update.channel_post.text || 'No text'}`);
              console.log('\n✅ Copy this Channel ID to your firebase.env file:');
              console.log(`TELEGRAM_CHANNEL_ID=${chat.id}`);
              console.log('\n🚀 Then run: npm start');
              foundChannel = true;
              process.exit(0);
            }
          });
          
          if (!foundChannel) {
            console.log('⏳ Still waiting for channel post...');
          }
          
        } else {
          console.log('⏳ No updates yet...');
        }
        
      } catch (error) {
        console.error('❌ Error:', error.message);
      }
    });
    
  }).on('error', (error) => {
    console.error('❌ Error:', error.message);
  });
}

// Check every 3 seconds
setInterval(checkForChannelId, 3000);

// Initial check
checkForChannelId();

console.log('🔄 Checking every 3 seconds...');
console.log('⏹️  Press Ctrl+C to stop\n');
