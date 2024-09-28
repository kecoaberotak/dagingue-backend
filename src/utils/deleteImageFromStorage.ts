import { extractFileNameFromUrl } from './extractFileNameFromUrl';
import { storage } from '../lib/firebase/init';
import { logError, logInfo } from './logger';

export const deleteImageFromStorage = async (imageUrl: string) => {
  try {
    const fileName = extractFileNameFromUrl(imageUrl); // extract nama file dari URL
    const fileRef = storage.bucket().file(fileName);

    // Hapus file
    await fileRef.delete();
    logInfo(`File ${fileName} deleted from Cloud Storage`);
  } catch (error) {
    throw error;
  }
};
