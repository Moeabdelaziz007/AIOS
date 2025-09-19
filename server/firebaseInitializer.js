/**
 * 🔥 Firebase Initialization Script
 *
 * Comprehensive Firebase setup with proper error handling and validation
 * Based on Firebase guidelines and best practices
 */

const { initializeApp } = require('firebase/app');
const {
  getFirestore,
  connectFirestoreEmulator,
} = require('firebase/firestore');
const { getAuth, connectAuthEmulator } = require('firebase/auth');
const { getStorage, connectStorageEmulator } = require('firebase/storage');
const { getAnalytics } = require('firebase/analytics');
const { getPerformance } = require('firebase/performance');

class FirebaseInitializer {
  constructor() {
    this.name = 'Firebase Initializer';
    this.version = '2.0.0';
    this.isInitialized = false;
    this.app = null;
    this.db = null;
    this.auth = null;
    this.storage = null;
    this.analytics = null;
    this.performance = null;

    console.log(`🔥 ${this.name} v${this.version} initialized`);
  }

  /**
   * Initialize Firebase with comprehensive configuration
   */
  async initialize(config = {}) {
    try {
      console.log('🔥 Initializing Firebase...');

      // Load configuration
      const firebaseConfig = await this.loadConfiguration(config);

      // Validate configuration
      this.validateConfiguration(firebaseConfig);

      // Initialize Firebase app
      this.app = initializeApp(firebaseConfig);
      console.log('✅ Firebase app initialized');

      // Initialize services
      await this.initializeServices();

      // Setup emulators if in development
      if (process.env.NODE_ENV === 'development') {
        await this.setupEmulators();
      }

      // Test connections
      await this.testConnections();

      this.isInitialized = true;
      console.log('✅ Firebase initialization completed successfully');

      return {
        app: this.app,
        db: this.db,
        auth: this.auth,
        storage: this.storage,
        analytics: this.analytics,
        performance: this.performance,
      };
    } catch (error) {
      console.error('❌ Firebase initialization failed:', error.message);
      throw error;
    }
  }

  /**
   * Load Firebase configuration from environment variables
   */
  async loadConfiguration(config) {
    const firebaseConfig = {
      apiKey:
        config.apiKey ||
        process.env.VITE_FIREBASE_API_KEY ||
        process.env.FIREBASE_API_KEY,
      authDomain:
        config.authDomain ||
        process.env.VITE_FIREBASE_AUTH_DOMAIN ||
        process.env.FIREBASE_AUTH_DOMAIN,
      projectId:
        config.projectId ||
        process.env.VITE_FIREBASE_PROJECT_ID ||
        process.env.FIREBASE_PROJECT_ID,
      storageBucket:
        config.storageBucket ||
        process.env.VITE_FIREBASE_STORAGE_BUCKET ||
        process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId:
        config.messagingSenderId ||
        process.env.VITE_FIREBASE_MESSAGING_SENDER_ID ||
        process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId:
        config.appId ||
        process.env.VITE_FIREBASE_APP_ID ||
        process.env.FIREBASE_APP_ID,
      measurementId:
        config.measurementId ||
        process.env.VITE_FIREBASE_MEASUREMENT_ID ||
        process.env.FIREBASE_MEASUREMENT_ID,
    };

    // Remove undefined values
    Object.keys(firebaseConfig).forEach(key => {
      if (firebaseConfig[key] === undefined) {
        delete firebaseConfig[key];
      }
    });

    return firebaseConfig;
  }

  /**
   * Validate Firebase configuration
   */
  validateConfiguration(config) {
    const required = ['apiKey', 'authDomain', 'projectId'];
    const missing = required.filter(field => !config[field]);

    if (missing.length > 0) {
      throw new Error(
        `Missing required Firebase configuration: ${missing.join(', ')}`
      );
    }

    console.log('✅ Firebase configuration validated');
  }

  /**
   * Initialize Firebase services
   */
  async initializeServices() {
    try {
      // Initialize Firestore
      this.db = getFirestore(this.app);
      console.log('✅ Firestore initialized');

      // Initialize Authentication
      this.auth = getAuth(this.app);
      console.log('✅ Authentication initialized');

      // Initialize Storage
      this.storage = getStorage(this.app);
      console.log('✅ Storage initialized');

      // Initialize Analytics (if available)
      if (
        typeof window !== 'undefined' &&
        process.env.VITE_FIREBASE_MEASUREMENT_ID
      ) {
        this.analytics = getAnalytics(this.app);
        console.log('✅ Analytics initialized');
      }

      // Initialize Performance (if available)
      if (typeof window !== 'undefined') {
        this.performance = getPerformance(this.app);
        console.log('✅ Performance initialized');
      }
    } catch (error) {
      console.error('❌ Error initializing Firebase services:', error.message);
      throw error;
    }
  }

  /**
   * Setup Firebase emulators for development
   */
  async setupEmulators() {
    try {
      console.log('🔧 Setting up Firebase emulators...');

      // Firestore emulator
      if (process.env.FIRESTORE_EMULATOR_HOST) {
        connectFirestoreEmulator(this.db, 'localhost', 8080);
        console.log('✅ Firestore emulator connected');
      }

      // Auth emulator
      if (process.env.FIREBASE_AUTH_EMULATOR_HOST) {
        connectAuthEmulator(this.auth, 'http://localhost:9099');
        console.log('✅ Auth emulator connected');
      }

      // Storage emulator
      if (process.env.FIREBASE_STORAGE_EMULATOR_HOST) {
        connectStorageEmulator(this.storage, 'localhost', 9199);
        console.log('✅ Storage emulator connected');
      }
    } catch (error) {
      console.warn(
        '⚠️ Emulator setup failed (this is normal if emulators are not running):',
        error.message
      );
    }
  }

  /**
   * Test Firebase connections
   */
  async testConnections() {
    try {
      console.log('🧪 Testing Firebase connections...');

      // Test Firestore connection
      await this.testFirestoreConnection();

      // Test Auth connection
      await this.testAuthConnection();

      console.log('✅ All Firebase connections tested successfully');
    } catch (error) {
      console.error('❌ Firebase connection test failed:', error.message);
      throw error;
    }
  }

  /**
   * Test Firestore connection
   */
  async testFirestoreConnection() {
    try {
      const { doc, setDoc, getDoc, deleteDoc } = require('firebase/firestore');

      // Create test document
      const testDoc = doc(this.db, 'test', 'connection');
      await setDoc(testDoc, {
        timestamp: new Date(),
        test: true,
      });

      // Read test document
      const docSnap = await getDoc(testDoc);
      if (!docSnap.exists()) {
        throw new Error('Test document not found');
      }

      // Clean up test document
      await deleteDoc(testDoc);

      console.log('✅ Firestore connection test passed');
    } catch (error) {
      console.error('❌ Firestore connection test failed:', error.message);
      throw error;
    }
  }

  /**
   * Test Auth connection
   */
  async testAuthConnection() {
    try {
      const { signInAnonymously } = require('firebase/auth');

      // Test anonymous sign-in
      const userCredential = await signInAnonymously(this.auth);
      if (!userCredential.user) {
        throw new Error('Anonymous sign-in failed');
      }

      console.log('✅ Auth connection test passed');
    } catch (error) {
      console.error('❌ Auth connection test failed:', error.message);
      throw error;
    }
  }

  /**
   * Initialize collections with sample data
   */
  async initializeCollections() {
    try {
      console.log('📚 Initializing Firestore collections...');

      const {
        collection,
        doc,
        setDoc,
        getDocs,
      } = require('firebase/firestore');

      // Initialize users collection
      await this.initializeUsersCollection();

      // Initialize operating systems collection
      await this.initializeOperatingSystemsCollection();

      // Initialize features collection
      await this.initializeFeaturesCollection();

      // Initialize system logs collection
      await this.initializeSystemLogsCollection();

      console.log('✅ Collections initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing collections:', error.message);
      throw error;
    }
  }

  /**
   * Initialize users collection
   */
  async initializeUsersCollection() {
    const { collection, doc, setDoc, getDocs } = require('firebase/firestore');

    const usersRef = collection(this.db, 'users');
    const snapshot = await getDocs(usersRef);

    if (snapshot.empty) {
      console.log('📝 Creating sample users...');

      const sampleUsers = [
        {
          uid: 'admin_user',
          username: 'admin',
          email: 'admin@aios.com',
          displayName: 'System Administrator',
          role: 'superadmin',
          preferences: {
            theme: 'dark',
            notifications: true,
            language: 'en',
            timezone: 'UTC',
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          uid: 'demo_user',
          username: 'demo',
          email: 'demo@aios.com',
          displayName: 'Demo User',
          role: 'user',
          preferences: {
            theme: 'light',
            notifications: false,
            language: 'en',
            timezone: 'UTC',
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      for (const user of sampleUsers) {
        await setDoc(doc(this.db, 'users', user.uid), user);
      }

      console.log('✅ Sample users created');
    }
  }

  /**
   * Initialize operating systems collection
   */
  async initializeOperatingSystemsCollection() {
    const { collection, doc, setDoc, getDocs } = require('firebase/firestore');

    const osRef = collection(this.db, 'operating_systems');
    const snapshot = await getDocs(osRef);

    if (snapshot.empty) {
      console.log('📝 Creating sample operating systems...');

      const sampleOSs = [
        {
          name: 'AIOS Quantum',
          slug: 'aios-quantum',
          developer: 'AIOS Team',
          releaseDate: new Date(),
          version: '2.0.0',
          architecture: ['x64', 'ARM'],
          license: 'Open Source',
          description:
            'Advanced Intelligent Operating System with Quantum capabilities',
          shortDescription: 'Next-generation AI-powered operating system',
          categories: ['Desktop', 'Server'],
          tags: ['ai', 'quantum', 'intelligent', 'autopilot'],
          pricing: {
            isFree: true,
            price: 0,
            currency: 'USD',
            licenseType: 'MIT',
          },
          stats: {
            totalReviews: 0,
            averageRating: 0,
            totalFavorites: 0,
            viewCount: 0,
            downloadCount: 0,
          },
          status: 'active',
          isVerified: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Windows 11',
          slug: 'windows-11',
          developer: 'Microsoft',
          releaseDate: new Date('2021-10-05'),
          version: '22H2',
          architecture: ['x64', 'ARM'],
          license: 'Commercial',
          description: 'Latest Windows operating system with modern features',
          shortDescription: "Microsoft's latest desktop OS",
          categories: ['Desktop'],
          tags: ['windows', 'microsoft', 'desktop'],
          pricing: {
            isFree: false,
            price: 139,
            currency: 'USD',
            licenseType: 'Commercial',
          },
          stats: {
            totalReviews: 0,
            averageRating: 0,
            totalFavorites: 0,
            viewCount: 0,
            downloadCount: 0,
          },
          status: 'active',
          isVerified: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      for (const os of sampleOSs) {
        const docRef = doc(osRef);
        await setDoc(docRef, { ...os, id: docRef.id });
      }

      console.log('✅ Sample operating systems created');
    }
  }

  /**
   * Initialize features collection
   */
  async initializeFeaturesCollection() {
    const { collection, doc, setDoc, getDocs } = require('firebase/firestore');

    const featuresRef = collection(this.db, 'features');
    const snapshot = await getDocs(featuresRef);

    if (snapshot.empty) {
      console.log('📝 Creating sample features...');

      const sampleFeatures = [
        {
          name: 'Quantum Autopilot',
          slug: 'quantum-autopilot',
          description:
            'AI-powered system automation and self-healing capabilities',
          category: 'AI',
          icon: '🤖',
          isActive: true,
          usage: {
            totalOSs: 1,
            popularity: 95,
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Multi-Agent System',
          slug: 'multi-agent-system',
          description: 'Distributed AI agents working together',
          category: 'AI',
          icon: '🧠',
          isActive: true,
          usage: {
            totalOSs: 1,
            popularity: 90,
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Real-time Monitoring',
          slug: 'real-time-monitoring',
          description: 'Continuous system health monitoring and alerting',
          category: 'Monitoring',
          icon: '📊',
          isActive: true,
          usage: {
            totalOSs: 1,
            popularity: 85,
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      for (const feature of sampleFeatures) {
        const docRef = doc(featuresRef);
        await setDoc(docRef, { ...feature, id: docRef.id });
      }

      console.log('✅ Sample features created');
    }
  }

  /**
   * Initialize system logs collection
   */
  async initializeSystemLogsCollection() {
    const { collection, doc, setDoc } = require('firebase/firestore');

    console.log('📝 Creating initial system log...');

    const logRef = doc(collection(this.db, 'system_logs'));
    await setDoc(logRef, {
      level: 'info',
      message: 'Firebase initialization completed successfully',
      timestamp: new Date(),
      action: 'firebase_init',
      resource: 'firebase',
      metadata: {
        version: this.version,
        environment: process.env.NODE_ENV || 'development',
      },
      context: {
        component: 'FirebaseInitializer',
        function: 'initialize',
        line: 1,
      },
    });

    console.log('✅ Initial system log created');
  }

  /**
   * Get Firebase services
   */
  getServices() {
    if (!this.isInitialized) {
      throw new Error('Firebase not initialized');
    }

    return {
      app: this.app,
      db: this.db,
      auth: this.auth,
      storage: this.storage,
      analytics: this.analytics,
      performance: this.performance,
    };
  }

  /**
   * Get Firestore instance
   */
  getFirestore() {
    if (!this.isInitialized || !this.db) {
      throw new Error('Firestore not initialized');
    }
    return this.db;
  }

  /**
   * Get Auth instance
   */
  getAuth() {
    if (!this.isInitialized || !this.auth) {
      throw new Error('Auth not initialized');
    }
    return this.auth;
  }

  /**
   * Get Storage instance
   */
  getStorage() {
    if (!this.isInitialized || !this.storage) {
      throw new Error('Storage not initialized');
    }
    return this.storage;
  }

  /**
   * Check if Firebase is initialized
   */
  isReady() {
    return this.isInitialized;
  }

  /**
   * Shutdown Firebase (cleanup)
   */
  async shutdown() {
    try {
      console.log('🛑 Shutting down Firebase...');

      // Sign out current user
      if (this.auth && this.auth.currentUser) {
        await this.auth.signOut();
      }

      this.isInitialized = false;
      this.app = null;
      this.db = null;
      this.auth = null;
      this.storage = null;
      this.analytics = null;
      this.performance = null;

      console.log('✅ Firebase shutdown completed');
    } catch (error) {
      console.error('❌ Error during Firebase shutdown:', error.message);
    }
  }
}

module.exports = FirebaseInitializer;
