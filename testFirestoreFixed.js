/**
 * Simple Firestore Connection Test
 * Tests the fixed Firestore data storage
 */

require('dotenv').config({ path: './firebase.env' });

const FirestoreDataStorage = require('./server/firestoreDataStorage.js');

async function testFirestoreConnection() {
  try {
    console.log('🧪 Testing Firestore Connection...\n');

    // Initialize Firestore storage
    const firestoreStorage = new FirestoreDataStorage();
    await firestoreStorage.initialize();

    // Check status
    const status = firestoreStorage.getStatus();
    console.log('📊 Firestore Status:', status);

    if (status.isInitialized) {
      console.log('✅ Firestore initialized successfully!');

      // Test storing some data
      console.log('\n📝 Testing data storage...');

      const testData = {
        test: true,
        timestamp: new Date().toISOString(),
        message: 'Test data from Cursor CLI integration',
      };

      try {
        const docId = await firestoreStorage.storeCursorCLIData(testData);
        console.log(`✅ Test data stored successfully: ${docId}`);

        // Test retrieving data
        console.log('\n📖 Testing data retrieval...');
        const data = await firestoreStorage.getData('cursor_cli_data', 5);
        console.log(`✅ Retrieved ${data.length} documents`);

        if (data.length > 0) {
          console.log('📄 Sample document:', JSON.stringify(data[0], null, 2));
        }
      } catch (storageError) {
        console.error('❌ Data storage test failed:', storageError.message);
      }
    } else {
      console.log('⚠️ Firestore not initialized - running in offline mode');
    }

    // Test storage statistics
    console.log('\n📊 Testing storage statistics...');
    try {
      const stats = await firestoreStorage.getStorageStatistics();
      console.log('📈 Storage Statistics:', stats);
    } catch (statsError) {
      console.error('❌ Storage statistics failed:', statsError.message);
    }

    console.log('\n🎉 Firestore connection test completed!');
  } catch (error) {
    console.error('💥 Test failed:', error);
  }
}

// Run the test
testFirestoreConnection()
  .then(() => {
    console.log('\n✅ All tests completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Test suite failed:', error);
    process.exit(1);
  });
