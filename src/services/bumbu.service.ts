import { db } from '../lib/firebase/init';
import { ProductType, ProductResultType } from '../types/product.type';

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
