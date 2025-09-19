// Firebase Service Configuration for Smart Apps
const admin = require('firebase-admin');

class FirebaseService {
  constructor() {
    this.initialized = false;
    this.db = null;
    this.auth = null;
    this.storage = null;
  }

  async initialize() {
    try {
      // Check if Firebase is already initialized
      if (admin.apps.length > 0) {
        this.db = admin.firestore();
        this.auth = admin.auth();
        this.storage = admin.storage();
        this.initialized = true;
        console.log('✅ Firebase Admin SDK already initialized');
        return;
      }

      // Initialize Firebase Admin SDK
      const serviceAccount = require('./firebase-service-account.json');

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      });

      this.db = admin.firestore();
      this.auth = admin.auth();
      this.storage = admin.storage();
      this.initialized = true;

      console.log('✅ Firebase Admin SDK initialized successfully');
    } catch (error) {
      console.error('❌ Firebase initialization error:', error);
      throw error;
    }
  }

  // Smart Notes Collection Operations
  async createNote(userId, noteData) {
    if (!this.initialized) throw new Error('Firebase not initialized');

    const note = {
      ...noteData,
      userId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await this.db.collection('notes').add(note);
    return { id: docRef.id, ...note };
  }

  async getNotes(userId, filters = {}) {
    if (!this.initialized) throw new Error('Firebase not initialized');

    let query = this.db.collection('notes').where('userId', '==', userId);

    if (filters.category && filters.category !== 'all') {
      query = query.where('category', '==', filters.category);
    }

    if (filters.isPrivate !== undefined) {
      query = query.where('isPrivate', '==', filters.isPrivate);
    }

    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    }));
  }

  async updateNote(noteId, updateData) {
    if (!this.initialized) throw new Error('Firebase not initialized');

    const update = {
      ...updateData,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await this.db.collection('notes').doc(noteId).update(update);
    const doc = await this.db.collection('notes').doc(noteId).get();

    return {
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    };
  }

  async deleteNote(noteId) {
    if (!this.initialized) throw new Error('Firebase not initialized');

    await this.db.collection('notes').doc(noteId).delete();
    return { success: true };
  }

  // Smart Alarms Collection Operations
  async createAlarm(userId, alarmData) {
    if (!this.initialized) throw new Error('Firebase not initialized');

    const alarm = {
      ...alarmData,
      userId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await this.db.collection('alarms').add(alarm);
    return { id: docRef.id, ...alarm };
  }

  async getAlarms(userId, filters = {}) {
    if (!this.initialized) throw new Error('Firebase not initialized');

    let query = this.db.collection('alarms').where('userId', '==', userId);

    if (filters.category && filters.category !== 'all') {
      query = query.where('category', '==', filters.category);
    }

    if (filters.isActive !== undefined) {
      query = query.where('isActive', '==', filters.isActive);
    }

    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    }));
  }

  async updateAlarm(alarmId, updateData) {
    if (!this.initialized) throw new Error('Firebase not initialized');

    const update = {
      ...updateData,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await this.db.collection('alarms').doc(alarmId).update(update);
    const doc = await this.db.collection('alarms').doc(alarmId).get();

    return {
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    };
  }

  async deleteAlarm(alarmId) {
    if (!this.initialized) throw new Error('Firebase not initialized');

    await this.db.collection('alarms').doc(alarmId).delete();
    return { success: true };
  }

  // Smart Maps Collection Operations
  async createLocation(userId, locationData) {
    if (!this.initialized) throw new Error('Firebase not initialized');

    const location = {
      ...locationData,
      userId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await this.db.collection('locations').add(location);
    return { id: docRef.id, ...location };
  }

  async getLocations(userId, filters = {}) {
    if (!this.initialized) throw new Error('Firebase not initialized');

    let query = this.db.collection('locations').where('userId', '==', userId);

    if (filters.category && filters.category !== 'all') {
      query = query.where('category', '==', filters.category);
    }

    if (filters.isPrivate !== undefined) {
      query = query.where('isPrivate', '==', filters.isPrivate);
    }

    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    }));
  }

  async updateLocation(locationId, updateData) {
    if (!this.initialized) throw new Error('Firebase not initialized');

    const update = {
      ...updateData,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await this.db.collection('locations').doc(locationId).update(update);
    const doc = await this.db.collection('locations').doc(locationId).get();

    return {
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    };
  }

  async deleteLocation(locationId) {
    if (!this.initialized) throw new Error('Firebase not initialized');

    await this.db.collection('locations').doc(locationId).delete();
    return { success: true };
  }

  // User Management Operations
  async createUser(userData) {
    if (!this.initialized) throw new Error('Firebase not initialized');

    const user = {
      ...userData,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await this.db.collection('users').add(user);
    return { id: docRef.id, ...user };
  }

  async getUser(userId) {
    if (!this.initialized) throw new Error('Firebase not initialized');

    const doc = await this.db.collection('users').doc(userId).get();
    if (!doc.exists) return null;

    return {
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    };
  }

  async updateUser(userId, updateData) {
    if (!this.initialized) throw new Error('Firebase not initialized');

    const update = {
      ...updateData,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await this.db.collection('users').doc(userId).update(update);
    const doc = await this.db.collection('users').doc(userId).get();

    return {
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    };
  }

  // Analytics and Statistics
  async getUserStats(userId) {
    if (!this.initialized) throw new Error('Firebase not initialized');

    const [notesSnapshot, alarmsSnapshot, locationsSnapshot] =
      await Promise.all([
        this.db.collection('notes').where('userId', '==', userId).get(),
        this.db.collection('alarms').where('userId', '==', userId).get(),
        this.db.collection('locations').where('userId', '==', userId).get(),
      ]);

    return {
      notes: {
        total: notesSnapshot.size,
        categories: this.groupByCategory(notesSnapshot.docs, 'category'),
        recent: this.getRecentItems(notesSnapshot.docs, 7),
      },
      alarms: {
        total: alarmsSnapshot.size,
        active: alarmsSnapshot.docs.filter(doc => doc.data().isActive).length,
        categories: this.groupByCategory(alarmsSnapshot.docs, 'category'),
      },
      locations: {
        total: locationsSnapshot.size,
        categories: this.groupByCategory(locationsSnapshot.docs, 'category'),
        favorites: locationsSnapshot.docs.filter(doc => doc.data().isFavorite)
          .length,
      },
    };
  }

  // Helper methods
  groupByCategory(docs, field) {
    const groups = {};
    docs.forEach(doc => {
      const category = doc.data()[field] || 'uncategorized';
      groups[category] = (groups[category] || 0) + 1;
    });
    return groups;
  }

  getRecentItems(docs, days) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return docs.filter(doc => {
      const createdAt = doc.data().createdAt?.toDate();
      return createdAt && createdAt >= cutoffDate;
    }).length;
  }

  // Batch operations
  async batchCreate(items, collection) {
    if (!this.initialized) throw new Error('Firebase not initialized');

    const batch = this.db.batch();
    const results = [];

    items.forEach(item => {
      const docRef = this.db.collection(collection).doc();
      batch.set(docRef, {
        ...item,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      results.push({ id: docRef.id, ...item });
    });

    await batch.commit();
    return results;
  }

  async batchUpdate(updates, collection) {
    if (!this.initialized) throw new Error('Firebase not initialized');

    const batch = this.db.batch();

    updates.forEach(({ id, data }) => {
      const docRef = this.db.collection(collection).doc(id);
      batch.update(docRef, {
        ...data,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });

    await batch.commit();
    return { success: true };
  }

  async batchDelete(ids, collection) {
    if (!this.initialized) throw new Error('Firebase not initialized');

    const batch = this.db.batch();

    ids.forEach(id => {
      const docRef = this.db.collection(collection).doc(id);
      batch.delete(docRef);
    });

    await batch.commit();
    return { success: true };
  }
}

module.exports = FirebaseService;
