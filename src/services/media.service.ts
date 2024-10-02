import { db } from '../lib/firebase/init';
import { ContentResultType, MediaType } from '../types/content.types';
import { deleteImageFromStorage } from '../utils/deleteImageFromStorage';
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

export const updateDataMedia = async (payload: MediaType): Promise<ContentResultType> => {
  try {
    const snapshot = await db.collection('medias').get();
    const mediaRef = db.collection('medias').doc(snapshot.docs[0].id);

    if (snapshot.empty) {
      return { success: false, message: 'No data media found' };
    }

    let logo_image_update: string | undefined = payload.logo_image as string;
    if (payload.logo_image && typeof payload.logo_image !== 'string') {
      logo_image_update = await uploadImageToStorage(payload.logo_image as Express.Multer.File, 'media_image');
      try {
        await deleteImageFromStorage(snapshot.docs[0].data().logo_image);
      } catch (error) {
        if (error instanceof Error) {
          return {
            success: false,
            message: `Failed to delete image for update data media : ${error.message}`,
          };
        }
        return { success: false, message: 'Unknown error occurred during deletion image for update data media' };
      }
    }

    let hero_image_update: string | undefined = payload.hero_image as string;
    if (payload.hero_image && typeof payload.hero_image !== 'string') {
      hero_image_update = await uploadImageToStorage(payload.hero_image as Express.Multer.File, 'media_image');
      try {
        await deleteImageFromStorage(snapshot.docs[0].data().hero_image);
      } catch (error) {
        if (error instanceof Error) {
          return {
            success: false,
            message: `Failed to delete image for update data media : ${error.message}`,
          };
        }
        return { success: false, message: 'Unknown error occurred during deletion image for update data media' };
      }
    }

    let background_image_update: string | undefined = payload.background_image as string;
    if (payload.background_image && typeof payload.background_image !== 'string') {
      background_image_update = await uploadImageToStorage(
        payload.background_image as Express.Multer.File,
        'media_image',
      );
      try {
        await deleteImageFromStorage(snapshot.docs[0].data().background_image);
      } catch (error) {
        if (error instanceof Error) {
          return {
            success: false,
            message: `Failed to delete image for update data media : ${error.message}`,
          };
        }
        return { success: false, message: 'Unknown error occurred during deletion image for update data media' };
      }
    }

    let footer_image_update: string | undefined = payload.footer_image as string;
    if (payload.footer_image && typeof payload.footer_image !== 'string') {
      footer_image_update = await uploadImageToStorage(payload.footer_image as Express.Multer.File, 'media_image');
      try {
        await deleteImageFromStorage(snapshot.docs[0].data().footer_image);
      } catch (error) {
        if (error instanceof Error) {
          return {
            success: false,
            message: `Failed to delete image for update data media : ${error.message}`,
          };
        }
        return { success: false, message: 'Unknown error occurred during deletion image for update data media' };
      }
    }

    const updatedData = {
      email: payload.email ?? snapshot.docs[0].data().email,
      phone: payload.phone ?? snapshot.docs[0].data().phone,
      address: payload.address ?? snapshot.docs[0].data().address,
      instagram: payload.instagram ?? snapshot.docs[0].data().instagram,
      shopee: payload.shopee ?? snapshot.docs[0].data().shopee,
      whatsapp: payload.whatsapp ?? snapshot.docs[0].data().whatsapp,
      maps: payload.maps ?? snapshot.docs[0].data().maps,
      logo_image: logo_image_update ?? snapshot.docs[0].data().logo_image,
      hero_image: hero_image_update ?? snapshot.docs[0].data().hero_image,
      background_image: background_image_update ?? snapshot.docs[0].data().background_image,
      footer_image: footer_image_update ?? snapshot.docs[0].data().footer_image,
      updatedAt: new Date(),
    };

    await mediaRef.update(updatedData);
    return {
      success: true,
      message: 'Success update data media',
      data: { id: snapshot.docs[0].id, ...updatedData },
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        message: `Unknown error occurred during updating data media: ${error.message}`,
      };
    }
    return { success: false, message: 'Unknown error occurred during updating data media' };
  }
};
