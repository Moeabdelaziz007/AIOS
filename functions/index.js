const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// Telegram webhook function
exports.telegramWebhook = functions.https.onRequest((req, res) => {
  // Set CORS headers
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  try {
    const update = req.body;
    console.log('Received Telegram update:', JSON.stringify(update, null, 2));

    // Process the Telegram update here
    // You can add your bot logic here

    res.status(200).json({ status: 'success', message: 'Update processed' });
  } catch (error) {
    console.error('Error processing Telegram update:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});
