import { v4 as uuidv4 } from 'uuid';
import { firebase } from '../lib/firebase/init';

const bucket = firebase.storage().bucket(); // Cloud Storage Bucket

const uploadImageToStorage = async (file: Express.Multer.File) => {
  const fileName = `${uuidv4()}.jpg`; // generate unique name
  const fileRef = bucket.file(`potong_image/${fileName}`);

  await fileRef.save(file.buffer, {
    contentType: file.mimetype,
    metadata: { cacheControl: 'public, max-age=31536000' },
  });

  // URL dari gambar yg di-upload
  const publicUrl = fileRef.publicUrl();
  return publicUrl;
};

export default uploadImageToStorage;
