import { db } from '../lib/firebase/init';
import { uploadImageToStorage } from '../utils/uploadImageToStorage';
import { ContentType, ContentResultType } from '../types/content.types';

export const addDataAbout = async (payload: ContentType): Promise<ContentResultType> => {
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
    if (error instanceof Error) {
      return {
        success: false,
        message: `Error occurred while add new data content about: ${error.message}`,
      };
    } else {
      return { success: false, message: 'Unknown error occurred while add new data content about' };
    }
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
