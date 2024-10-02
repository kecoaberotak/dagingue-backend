import 'dotenv/config';

const CONFIG = {
  port: process.env.PORT,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  apiKey: process.env.FIREBASE_API_KEY,
};

export default CONFIG;
