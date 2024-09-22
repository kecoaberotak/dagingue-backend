import { firebase } from '../lib/firebase/init';
import { Firestore } from 'firebase-admin/firestore';
import { logger } from '../utils/logger';

const db: Firestore = firebase.firestore();

export const getAllPotong = async () => {
  try {
    // ambil semua data
    const snapshot = await db.collection('potongs').get();

    // Mengecek apakah ada data
    if (snapshot.empty) {
      logger.info('No match document');
      return null;
    }

    // Membuat array untuk menampung data
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return data;
  } catch (error) {
    logger.info('Error getting data potong');
    logger.error('Error getting data potong:', error);
    return null;
  }
};

export const getDetailPotong = async (id: string) => {
  try {
    const snapshot = await db.collection('potongs').doc(id).get();

    if (!snapshot.exists) {
      logger.info('No match document');
      return null;
    }

    return {
      id: snapshot.id,
      ...snapshot.data(),
    };
  } catch (error) {
    logger.info('Error getting data potong');
    logger.error('Error getting data potong:', error);
    return null;
  }
};
