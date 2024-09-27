import { v4 as uuidv4 } from 'uuid';
import { storage } from '../lib/firebase/init';

export const uploadImageToStorage = async (file: Express.Multer.File): Promise<string> => {
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
    return publicUrl;
  } catch (error) {
    throw error;
  }
};
