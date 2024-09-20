import admin from 'firebase-admin';

const serviceAccount = require('../../../dagingue-dc5c9-firebase-adminsdk-6g8zo-4eb1a9ba3a.json');

const config = {
  credential: admin.credential.cert(serviceAccount),
};

export const firebase = admin.apps.length ? admin.app() : admin.initializeApp(config);
