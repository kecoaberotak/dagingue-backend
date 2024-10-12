import { db } from '../lib/firebase/init';
import { ProductType, ProductResultType } from '../types/product.type';
import { deleteImageFromStorage } from '../utils/deleteImageFromStorage';
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
    const imageLink = await uploadImageToStorage(image as Express.Multer.File, 'bumbu_image');

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
    throw error;
  }
};

export const deleteDataBumbuById = async (id: string): Promise<ProductResultType> => {
  try {
    const bumbuRef = db.collection('bumbus').doc(id);
    const snapshot = await bumbuRef.get();

    if (!snapshot.exists) {
      return { success: false, message: 'No data bumbu found for ID: ' + id };
    }

    const data = snapshot.data();
    const imageUrl = data?.image;

    if (imageUrl) {
      try {
        await deleteImageFromStorage(imageUrl);
      } catch (error) {
        throw error;
      }
    }

    // hapus document
    await bumbuRef.delete();
    return { success: true, message: `Success delete data bumbu for ID: ${id}` };
  } catch (error) {
    throw error;
  }
};

export const editDataBumbuById = async (id: string, payload: ProductType) => {
  try {
    const bumbuRef = db.collection('bumbus').doc(id);
    const snapshot = await bumbuRef.get();

    if (!snapshot.exists) {
      return { success: false, message: 'No bumbu data found for ID: ' + id };
    }

    let updatedImageLink: string | undefined = payload.image as string;

    if (payload.image && typeof payload.image !== 'string') {
      updatedImageLink = await uploadImageToStorage(payload.image, 'bumbu_image');

      try {
        await deleteImageFromStorage(snapshot.data()?.image);
      } catch (error) {
        throw error;
      }
    }

    const updatedData = {
      name: payload.name ?? snapshot.data()?.name,
      desc: payload.desc ?? snapshot.data()?.desc,
      price: payload.price ?? snapshot.data()?.price,
      image: updatedImageLink || snapshot.data()?.image,
      updatedAt: new Date(),
    };

    await bumbuRef.update(updatedData);

    return {
      success: true,
      message: 'Success update bumbu data for ID: ' + id,
      data: { id: snapshot.id, ...updatedData },
    };
  } catch (error) {
    throw error;
  }
};
