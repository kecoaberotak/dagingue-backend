import { db } from '../lib/firebase/init';
import { ProductType, ProductResultType } from '../types/product.type';
import { uploadImageToStorage } from '../utils/uploadImageToStorage';

export const getAllDataBumbu = async (): Promise<ProductResultType> => {
  try {
    const snapshot = await db.collection('bumbus').get();

    if (snapshot.empty) {
      return { success: false, message: 'No data bumbu found' };
    }

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      success: true,
      message: 'Success get all data bumbu',
      data: data,
    };
  } catch (error) {
    throw error;
  }
};

export const getDataBumbuById = async (id: string): Promise<ProductResultType> => {
  try {
    const snapshot = await db.collection('bumbus').doc(id).get();

    if (!snapshot.exists) {
      return { success: false, message: 'No data bumbu found for ID: ' + id };
    }

    return {
      success: true,
      message: 'Success get data bumbu for ID: ' + id,
      data: { id: snapshot.id, ...snapshot.data() },
    };
  } catch (error) {
    throw error;
  }
};

export const addDataBumbu = async (payload: ProductType): Promise<ProductResultType> => {
  const { name, desc, price, image } = payload;

  try {
    const imageLink = uploadImageToStorage(image as Express.Multer.File, 'bumbu_image');

    const newData = {
      name,
      desc,
      price,
      image: imageLink,
      createdAt: new Date(), // Tambahkan timestamp
    };
    const bumbuRef = await db.collection('bumbus').add(newData);
    return {
      success: true,
      message: 'Success upload new data bumbu to Database',
      data: { id: bumbuRef.id, ...newData },
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        message: `Error occurred while add new data potong: ${error.message}`,
      };
    } else {
      return { success: false, message: 'Unknown error occurred while add new data potong' };
    }
  }
};
