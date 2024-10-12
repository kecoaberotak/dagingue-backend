import { db } from '../lib/firebase/init';
import { uploadImageToStorage } from '../utils/uploadImageToStorage';
import { AboutType, ContentResultType } from '../types/content.types';
import { deleteImageFromStorage } from '../utils/deleteImageFromStorage';

export const addDataAbout = async (payload: AboutType): Promise<ContentResultType> => {
  const { desc, image1, image2 } = payload;

  try {
    const imageLink1 = await uploadImageToStorage(image1 as Express.Multer.File, 'about_image');
    const imageLink2 = await uploadImageToStorage(image2 as Express.Multer.File, 'about_image');

    const newData = {
      desc,
      image1: imageLink1,
      image2: imageLink2,
      createdAt: new Date(),
    };

    const aboutRef = await db.collection('abouts').add(newData);
    return {
      success: true,
      message: 'Success upload new data content about to Database',
      data: { id: aboutRef.id, ...newData },
    };
  } catch (error) {
    throw error;
  }
};

export const getAllDataAbout = async (): Promise<ContentResultType> => {
  try {
    const snapshot = await db.collection('abouts').get();

    if (snapshot.empty) {
      return { success: false, message: 'No data content about found' };
    }

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      success: true,
      message: 'Success get data content about',
      data,
    };
  } catch (error) {
    throw error;
  }
};

export const getDataAboutById = async (id: string): Promise<ContentResultType> => {
  try {
    const snapshot = await db.collection('abouts').doc(id).get();

    if (!snapshot.exists) {
      return { success: false, message: 'No data content about found for ID: ' + id };
    }

    return {
      success: true,
      message: 'Success get data content about for ID: ' + id,
      data: { id: snapshot.id, ...snapshot.data() },
    };
  } catch (error) {
    throw error;
  }
};

export const deleteDataAboutById = async (id: string): Promise<ContentResultType> => {
  try {
    const aboutRef = db.collection('abouts').doc(id);
    const snapshot = await aboutRef.get();

    if (!snapshot.exists) {
      return { success: false, message: 'No data content about found for ID: ' + id };
    }

    const data = snapshot.data();

    const imageUrl1 = data?.image1;
    if (imageUrl1) {
      try {
        await deleteImageFromStorage(imageUrl1);
      } catch (error) {
        throw error;
      }
    } else if (!imageUrl1) {
      return { success: false, message: 'No image link found for ID: ' + id };
    }

    const imageUrl2 = data?.image2;
    if (imageUrl2) {
      try {
        await deleteImageFromStorage(imageUrl2);
      } catch (error) {
        throw error;
      }
    } else if (!imageUrl2) {
      return { success: false, message: 'No image link found for ID: ' + id };
    }

    await aboutRef.delete();
    return { success: true, message: `Success delete data content about for ID: ${id}` };
  } catch (error) {
    throw error;
  }
};

export const updateDataAboutById = async (id: string, payload: AboutType): Promise<ContentResultType> => {
  try {
    const aboutRef = db.collection('abouts').doc(id);
    const snapshot = await aboutRef.get();

    if (!snapshot.exists) {
      return { success: false, message: 'No potong data about for ID: ' + id };
    }

    let updatedImageLink1: string | undefined = payload.image1 as string;

    if (payload.image1 && typeof payload.image1 !== 'string') {
      // Jika image adalah file, upload ke Firebase Storage
      updatedImageLink1 = await uploadImageToStorage(payload.image1 as Express.Multer.File, 'about_image');
      try {
        await deleteImageFromStorage(snapshot.data()?.image1);
      } catch (error) {
        throw error;
      }
    }

    let updatedImageLink2: string | undefined = payload.image2 as string;
    if (payload.image2 && typeof payload.image2 !== 'string') {
      updatedImageLink2 = await uploadImageToStorage(payload.image2 as Express.Multer.File, 'about_image');
      try {
        await deleteImageFromStorage(snapshot.data()?.image2);
      } catch (error) {
        if (error instanceof Error) {
          return { success: false, message: `Failed to delete image for about with ID ${id}: ${error.message}` };
        }
        return { success: false, message: 'Unknown error occurred during deletion' };
      }
    }

    const updatedData = {
      desc: payload.desc ?? snapshot.data()?.desc,
      image1: updatedImageLink1 ?? snapshot.data()?.image1,
      image2: updatedImageLink2 ?? snapshot.data()?.image2,
      updatedAt: new Date(),
    };

    await aboutRef.update(updatedData);
    return {
      success: true,
      message: 'Success update data about for ID: ' + id,
      data: { id: snapshot.id, ...updatedData },
    };
  } catch (error) {
    throw error;
  }
};
