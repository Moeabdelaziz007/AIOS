/**
 * Firebase Authentication Middleware
 * Verifies Firebase ID tokens for protected routes
 */

const admin = require('firebase-admin');

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId: process.env.FIREBASE_PROJECT_ID || 'aios-97581'
    });
  } catch (error) {
    console.error('Failed to initialize Firebase Admin:', error);
  }
}

/**
 * Middleware to verify Firebase ID token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
async function verifyFirebaseToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'No valid authorization header found'
      });
    }

    const idToken = authHeader.split('Bearer ')[1];

    if (!idToken || idToken.trim() === '') {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'No token provided'
      });
    }

    // Verify the ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // Validate decoded token
    if (!decodedToken || !decodedToken.uid) {
      throw new Error('Invalid token: missing uid');
    }

    // Add user info to request object
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email || null,
      email_verified: decodedToken.email_verified || false,
      name: decodedToken.name || null,
      picture: decodedToken.picture || null
    };

    next();
  } catch (error) {
    console.error('Token verification failed:', error);

    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or expired token',
      details: error.message
    });
  }
}

/**
 * Optional middleware - doesn't fail if no token provided
 * Useful for endpoints that work with or without authentication
 */
async function optionalFirebaseToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const idToken = authHeader.split('Bearer ')[1];

      if (idToken) {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = {
          uid: decodedToken.uid,
          email: decodedToken.email || null,
          email_verified: decodedToken.email_verified || false,
          name: decodedToken.name || null,
          picture: decodedToken.picture || null
        };
      }
    }

    next();
  } catch (error) {
    // For optional auth, we don't fail on token errors
    console.warn('Optional token verification failed:', error.message);
    next();
  }
}

/**
 * Middleware to check if user has admin role
 * Must be used after verifyFirebaseToken
 */
async function requireAdmin(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required'
      });
    }

    // Check user role in Firestore
    const userDoc = await admin.firestore().collection('users').doc(req.user.uid).get();

    if (!userDoc.exists) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'User not found'
      });
    }

    const userData = userDoc.data();
    const userRole = userData.role || 'user';

    if (!['admin', 'superadmin'].includes(userRole)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Admin access required'
      });
    }

    req.user.role = userRole;
    next();
  } catch (error) {
    console.error('Admin check failed:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to verify admin status'
    });
  }
}

module.exports = {
  verifyFirebaseToken,
  optionalFirebaseToken,
  requireAdmin
};
