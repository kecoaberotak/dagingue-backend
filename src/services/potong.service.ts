import { db } from '../lib/firebase/init';
import { PotongType, UploadPotongResult } from '../types/potong.type';
import { logger } from '../utils/logger';
import { uploadImageToStorage } from '../utils/uploadImageToStorage';

export const getAllDataPotong = async (): Promise<UploadPotongResult> => {
  try {
    // ambil semua data
    const snapshot = await db.collection('potongs').get();

    // Mengecek apakah ada data
    if (snapshot.empty) {
      logger.info('No potong data found');
      return { success: false, message: 'No potong data found' };
    }

    // Membuat array untuk menampung data
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      success: true,
      message: 'Success upload new data potong to Database',
      data: data,
    };
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Err: potong - get all data = ${error.message}`);
      return { success: false, message: error.message };
    } else {
      logger.error('Err: potong - get all data = Unknown error');
      return { success: false, message: 'Unknown error occurred' };
    }
  }
};

export const getDataPotongById = async (id: string): Promise<UploadPotongResult> => {
  try {
    const snapshot = await db.collection('potongs').doc(id).get();

    if (!snapshot.exists) {
      logger.info('No potong data found for ID: ' + id);
      return { success: false, message: 'No potong data found for ID: ' + id };
    }

    return {
      success: true,
      message: 'Success upload new data potong to Database',
      data: { id: snapshot.id, ...snapshot.data() },
    };
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Err: potong - get data by id = ${error.message}`);
      return { success: false, message: error.message };
    } else {
      logger.error('Err: potong - get data by id = Unknown error');
      return { success: false, message: 'Unknown error occurred' };
    }
  }
};

export const addDataPotong = async (payload: PotongType): Promise<UploadPotongResult> => {
  const { name, desc, price, image } = payload;

  try {
    // Upload gambar ke Cloud Storage
    const result = await uploadImageToStorage(image as Express.Multer.File);

    if (!result.success) {
      logger.info(`Upload image failed: ${result.message}`);
      return { success: false, message: 'Upload image failed to Storage' };
    }

    // Simpan data ke Firestore
    const newData = {
      name,
      desc,
      price, // Konversi harga menjadi angka jika dikirim dalam string
      image: result.imageLink, // URL gambar dari Cloud Storage
      createdAt: new Date(), // Tambahkan timestamp
    };

    // Simpan ke dalam koleksi 'potongs'
    const potongRef = await db.collection('potongs').add(newData);
    return {
      success: true,
      message: 'Success upload new data potong to Database',
      data: { id: potongRef.id, ...newData },
    };
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Err: potong - add data to database = ${error.message}`);
      return { success: false, message: error.message };
    } else {
      logger.error('Err: potong - add data to database = Unknown error');
      return { success: false, message: 'Unknown error occurred' };
    }
  }
};
