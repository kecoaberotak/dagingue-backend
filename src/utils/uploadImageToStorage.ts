import { v4 as uuidv4 } from 'uuid';
import { storage } from '../lib/firebase/init';
import { logger } from './logger';

export const uploadImageToStorage = async (file: Express.Multer.File): Promise<string | null> => {
  try {
    // Generate Unique file name
    const filename = `${uuidv4()}.jpg`;
    const bucket = storage.bucket();
    const fileRef = bucket.file(`potong_image/${filename}`);

    // Upload file ke Cloud Storage
    await fileRef.save(file.buffer, {
      contentType: file.mimetype,
      metadata: { cacheControl: 'public, max-age=31536000' },
    });

    // Atur file agar bisa diakses secara public
    await fileRef.makePublic();

    // Dapatkan URL public
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileRef.name}`;
    return publicUrl;
  } catch (error) {
    logger.error('Error uploading image to storage', error);
    return null; // Return null jika ada error
  }
};
