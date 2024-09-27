import { v4 as uuidv4 } from 'uuid';
import { storage } from '../lib/firebase/init';
import { logger } from './logger';
import UploadImageResult from '../types/utils.type';

export const uploadImageToStorage = async (file: Express.Multer.File): Promise<UploadImageResult> => {
  try {
    // Generate Unique file name
    const fileExtension = file.mimetype.split('/')[1];
    const filename = `${uuidv4()}.${fileExtension}`;
    const bucket = storage.bucket();
    const fileRef = bucket.file(`potong_image/${filename}`);

    // Upload file ke Cloud Storage
    await fileRef.save(file.buffer, {
      contentType: file.mimetype,
      // meningkatkan performa, gambar akan ada di cache browser selama setahun
      metadata: { cacheControl: 'public, max-age=31536000' },
    });

    // Atur file agar bisa diakses secara public
    await fileRef.makePublic();

    // Dapatkan URL public
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileRef.name}`;
    return { success: true, message: 'Success upload file to Storage', imageLink: publicUrl };
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Err: potong - upload image to storage = ${error.message}`);
      return { success: false, message: error.message };
    } else {
      logger.error('Err: potong - upload image to storage = Unknown error');
      return { success: false, message: 'Unknown error occurred' };
    }
  }
};
