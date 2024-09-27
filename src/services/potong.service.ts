import { db } from '../lib/firebase/init';
import { ProductType, ProductResultType } from '../types/product.type';
import { uploadImageToStorage } from '../utils/uploadImageToStorage';

export const getAllDataPotong = async (): Promise<ProductResultType> => {
  try {
    // ambil semua data
    const snapshot = await db.collection('potongs').get();

    // Mengecek apakah ada data
    if (snapshot.empty) {
      return { success: false, message: 'No potong data found' };
    }

    // Membuat array untuk menampung data
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      success: true,
      message: 'Success get all data potong',
      data: data,
    };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, message: error.message };
    } else {
      return { success: false, message: 'Unknown error occurred' };
    }
  }
};

export const getDataPotongById = async (id: string): Promise<ProductResultType> => {
  try {
    const snapshot = await db.collection('potongs').doc(id).get();

    if (!snapshot.exists) {
      return { success: false, message: 'No potong data found for ID: ' + id };
    }

    return {
      success: true,
      message: 'Success get data potong for ID: ' + id,
      data: { id: snapshot.id, ...snapshot.data() },
    };
  } catch (error) {
    throw error;
  }
};

export const addDataPotong = async (payload: ProductType): Promise<ProductResultType> => {
  const { name, desc, price, image } = payload;

  try {
    // Upload gambar ke Cloud Storage
    const imageLink = await uploadImageToStorage(image as Express.Multer.File);

    // Simpan data ke Firestore
    const newData = {
      name,
      desc,
      price,
      image: imageLink,
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
      return { success: false, message: `Error occurred while executing uploadImageToStorage: ${error.message}` };
    } else {
      return { success: false, message: 'Unknown error occurred while executing uploadImageToStorage' };
    }
  }
};
