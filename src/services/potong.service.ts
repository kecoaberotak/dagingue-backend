import { db, storage } from '../lib/firebase/init';
import { ProductType, ProductResultType } from '../types/product.type';
import { extractFileNameFromUrl } from '../utils/extractFileNameFromUrl';
import { logInfo } from '../utils/logger';
import { uploadImageToStorage } from '../utils/uploadImageToStorage';

export const getAllDataPotong = async (): Promise<ProductResultType> => {
  try {
    // ambil semua data
    const snapshot = await db.collection('potongs').get();

    // Mengecek apakah ada data
    if (snapshot.empty) {
      return { success: false, message: 'No data potong found' };
    }

    // Membuat array untuk menampung data
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      success: true,
      message: 'Success get all data potong',
      data,
    };
  } catch (error) {
    throw error;
  }
};

export const getDataPotongById = async (id: string): Promise<ProductResultType> => {
  try {
    const snapshot = await db.collection('potongs').doc(id).get();

    if (!snapshot.exists) {
      return { success: false, message: 'No data potong found for ID: ' + id };
    }

    return {
      success: true,
      message: 'Success get data potong for ID: ' + id,
      data: { id: snapshot.id, ...snapshot.data() },
    };
  } catch (error) {
    throw error;
  }
};

export const addDataPotong = async (payload: ProductType): Promise<ProductResultType> => {
  const { name, desc, price, image } = payload;

  try {
    // Upload gambar ke Cloud Storage
    const imageLink = await uploadImageToStorage(image as Express.Multer.File, 'potong_image');

    // Simpan data ke Firestore
    const newData = {
      name,
      desc,
      price,
      image: imageLink,
      createdAt: new Date(), // Tambahkan timestamp
    };

    // Simpan ke dalam koleksi 'potongs'
    const potongRef = await db.collection('potongs').add(newData);
    return {
      success: true,
      message: 'Success upload new data potong to Database',
      data: { id: potongRef.id, ...newData },
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        message: `Error occurred while add new data potong: ${error.message}`,
      };
    } else {
      return { success: false, message: 'Unknown error occurred while add new data potong' };
    }
  }
};

export const deleteDataPotongById = async (id: string): Promise<ProductResultType> => {
  try {
    const potongRef = db.collection('potongs').doc(id); // referensi ke dokumen yang mau dihapus
    const snapshot = await potongRef.get();

    // check apakah dokumen ada
    if (!snapshot.exists) {
      return { success: false, message: 'No data potong found for ID: ' + id };
    }

    // Dapatkan ULR gambar dari document
    const data = snapshot.data();
    const imageUrl = data?.image;

    // Hapus file dari Cloud Storage jika ada
    if (imageUrl) {
      const fileName = extractFileNameFromUrl(imageUrl); // extract nama file dari URL
      const fileRef = storage.bucket().file(fileName);

      // Hapus file
      await fileRef.delete();
      logInfo(`File ${fileName} deleted from Cloud Storage`);
    }

    // hapus document
    await potongRef.delete();
    return { success: true, message: `Success delete data potong for ID: ${id}` };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    return { success: false, message: 'Unknown error occurred during deletion' };
  }
};

export const editDataPotongById = async (id: string, payload: ProductType) => {
  try {
    const potongRef = db.collection('potongs').doc(id);
    const snapshot = await potongRef.get();

    if (!snapshot.exists) {
      return { success: false, message: 'No potong data found for ID: ' + id };
    }

    // Cek apakah image adalah file baru atau link yang ada
    let updatedImageLink: string | undefined = payload.image as string; // Jika image adalah string (link)

    if (payload.image && typeof payload.image !== 'string') {
      // Jika image adalah file, upload ke Firebase Storage
      updatedImageLink = await uploadImageToStorage(payload.image as Express.Multer.File, 'potong_image');
    }

    const updatedData = {
      name: payload.name ?? snapshot.data()?.name,
      desc: payload.desc ?? snapshot.data()?.desc,
      price: payload.price ?? snapshot.data()?.price, // `0` akan tetap diambil dari `payload.price`
      image: updatedImageLink || snapshot.data()?.image, // Simpan link image baru atau gunakan link yang lama
      updatedAt: new Date(),
    };

    // Perbarui dokumen di Firestore
    await potongRef.update(updatedData);

    return {
      success: true,
      message: 'Success update potong data for ID: ' + id,
      data: { id: snapshot.id, ...updatedData },
    };
  } catch (error) {
    throw error;
  }
};
