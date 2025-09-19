/**
 * Firebase Service Account Configuration
 * This file contains the service account configuration for Firebase Admin SDK
 */

const firebaseServiceAccount = {
  type: 'service_account',
  project_id: 'aios-97581',
  private_key_id: 'your_private_key_id_here',
  private_key: '-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n',
  client_email: 'firebase-adminsdk-xxxxx@aios-97581.iam.gserviceaccount.com',
  client_id: 'your_client_id_here',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url:
    'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40aios-97581.iam.gserviceaccount.com'
};

// For development, we'll use the Firebase project ID and let it use default credentials
const firebaseConfig = {
  projectId: 'aios-97581'
  // In production, you would use the service account credentials
  // credential: admin.credential.cert(firebaseServiceAccount)
};

module.exports = {
  firebaseServiceAccount,
  firebaseConfig
};
