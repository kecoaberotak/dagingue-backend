import { db } from '../lib/firebase/init';
import { ContentResultType, MediaType } from '../types/content.types';
import { uploadImageToStorage } from '../utils/uploadImageToStorage';

export const addDataMedia = async (payload: MediaType): Promise<ContentResultType> => {
  const {
    email,
    phone,
    address,
    logo_image,
    hero_image,
    background_image,
    footer_image,
    instagram,
    shopee,
    whatsapp,
    maps,
  } = payload;

  try {
    const logoImageLink = await uploadImageToStorage(logo_image as Express.Multer.File, 'media_image');
    const heroImageLink = await uploadImageToStorage(hero_image as Express.Multer.File, 'media_image');
    const backgroundImageLink = await uploadImageToStorage(background_image as Express.Multer.File, 'media_image');
    const footerImageLink = await uploadImageToStorage(footer_image as Express.Multer.File, 'media_image');

    const newData = {
      email,
      phone,
      address,
      instagram,
      shopee,
      whatsapp,
      maps,
      logo_image: logoImageLink,
      hero_image: heroImageLink,
      background_image: backgroundImageLink,
      footer_image: footerImageLink,
      createdAt: new Date(),
    };

    const mediaRef = await db.collection('medias').add(newData);
    return {
      success: true,
      message: 'Success upload new data media to Database',
      data: { id: mediaRef.id, ...newData },
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        message: `Error occurred while add new data media about: ${error.message}`,
      };
    } else {
      return { success: false, message: 'Unknown error occurred while add new data media' };
    }
  }
};

export const getDataMedia = async (): Promise<ContentResultType> => {
  try {
    const snapshot = await db.collection('medias').get();

    if (snapshot.empty) {
      return { success: false, message: 'No data media found' };
    }

    return {
      success: true,
      message: 'Success get data media',
      data: { id: snapshot.docs[0].id, ...snapshot.docs[0].data() },
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        message: `Unknown error occurred during get data media: ${error.message}`,
      };
    }
    return { success: false, message: 'Unknown error occurred during get data media' };
  }
};
