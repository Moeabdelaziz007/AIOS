// Firebase Admin Configuration for AIOS Server
const admin = require('firebase-admin');

// Firebase Admin SDK configuration
const firebaseAdminConfig = {
  projectId: 'aios-97581'
  // Note: In production, use service account key file
  // credential: admin.credential.cert(serviceAccount),
  // For development, you can use Application Default Credentials
  // or set GOOGLE_APPLICATION_CREDENTIALS environment variable
};

// Initialize Firebase Admin SDK
let adminApp;
try {
  adminApp = admin.initializeApp(firebaseAdminConfig);
  console.log('🔥 Firebase Admin SDK initialized successfully');
} catch (error) {
  console.error('❌ Firebase Admin SDK initialization failed:', error);
}

// Export Firebase Admin services
const adminDb = admin.firestore();
const adminAuth = admin.auth();
const adminStorage = admin.storage();
const adminMessaging = admin.messaging();

// Collection references for AIOS
const collections = {
  users: 'users',
  agents: 'agents',
  workflows: 'workflows',
  conversations: 'conversations',
  learningData: 'learningData',
  systemLogs: 'systemLogs',
  automationData: 'automationData',
  growthMetrics: 'growthMetrics',
  predictiveData: 'predictiveData',
  resourceMetrics: 'resourceMetrics'
};

// Firebase Admin service configurations
const firebaseAdminServices = {
  app: adminApp,
  db: adminDb,
  auth: adminAuth,
  storage: adminStorage,
  messaging: adminMessaging
};

// Firebase Admin initialization helper
const initializeFirebaseAdmin = async () => {
  try {
    console.log('🔥 Firebase Admin SDK initialized successfully');
    console.log('🗄️ Firestore Admin:', adminDb);
    console.log('🔐 Auth Admin:', adminAuth);
    console.log('📁 Storage Admin:', adminStorage);
    console.log('📱 Messaging Admin:', adminMessaging);

    return {
      success: true,
      services: firebaseAdminServices
    };
  } catch (error) {
    console.error('❌ Firebase Admin initialization failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Firebase Admin connection test
const testFirebaseAdminConnection = async () => {
  try {
    // Test Firestore Admin connection
    const testDoc = await adminDb.collection('test').doc('admin-connection').get();
    console.log('✅ Firestore Admin connection successful');

    // Test Auth Admin connection
    const listUsersResult = await adminAuth.listUsers(1);
    console.log('✅ Auth Admin connection successful');

    return {
      firestore: true,
      auth: true,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('❌ Firebase Admin connection test failed:', error);
    return {
      firestore: false,
      auth: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

// Export everything
module.exports = {
  admin,
  adminApp,
  adminDb,
  adminAuth,
  adminStorage,
  adminMessaging,
  collections,
  firebaseAdminServices,
  initializeFirebaseAdmin,
  testFirebaseAdminConnection
};
