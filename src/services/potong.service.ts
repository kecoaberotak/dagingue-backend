import { db } from '../lib/firebase/init';
import { logger } from '../utils/logger';
import { uploadImageToStorage } from '../utils/uploadImageToStorage';

export const getAllDataPotong = async () => {
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

export const getDataPotongById = async (id: string) => {
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

export const addDataPotong = async (payload: any) => {
  const { name, desc, price, image } = payload;

  try {
    // Upload gambar ke Cloud Storage
    const imageUrl = await uploadImageToStorage(image);

    if (!imageUrl) {
      logger.info('Failed upload image to storage');
      return null;
    }

    // Simpan data ke Firestore
    const newData = {
      name,
      desc,
      price: parseFloat(price), // Konversi harga menjadi angka jika dikirim dalam string
      image: imageUrl, // URL gambar dari Cloud Storage
      createdAt: new Date(), // Tambahkan timestamp
    };

    // Simpan ke dalam koleksi 'potongs'
    const potongRef = await db.collection('potongs').add(newData);
    return { id: potongRef.id, ...newData };
  } catch (error) {
    logger.error(`Err: potong - add to database = ${error}`);
    return null;
  }
};
