import 'dotenv/config';
import admin from 'firebase-admin';
import CONFIG from '../../config/environment';

const serviceAccount = {
  type: process.env.FIREBASE_ADMIN_SDK_TYPE,
  project_id: process.env.FIREBASE_ADMIN_SDK_PROJECT_ID,
  private_key_id: process.env.FIREBASE_ADMIN_SDK_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_ADMIN_SDK_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_ADMIN_SDK_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_ADMIN_SDK_CLIENT_ID,
  auth_uri: process.env.FIREBASE_ADMIN_SDK_AUTH_URI,
  token_uri: process.env.FIREBASE_ADMIN_SDK_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_ADMIN_SDK_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_ADMIN_SDK_CLIENT_X509_CERT_URL,
  universe_domain: process.env.FIREBASE_ADMIN_SDK_UNIVERSE_DOMAIN,
} as admin.ServiceAccount;

// Inisialisasi Firebase App
export const firebase = admin.apps.length
  ? admin.app()
  : admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: CONFIG.storageBucket,
    });

// Inisialisasi Firestore, Storage, Auth
export const db = admin.firestore();
export const storage = admin.storage();
export const auth = admin.auth();
