import admin from 'firebase-admin';
const serviceAccount = require('../../../dagingue-dc5c9-firebase-adminsdk-6g8zo-4eb1a9ba3a.json');
import CONFIG from '../../config/environtment';

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
