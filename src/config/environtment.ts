import 'dotenv/config';

const CONFIG = {
  port: process.env.PORT,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
};

export default CONFIG;
