import 'dotenv/config';

const CONFIG = {
  port: process.env.PORT,
  emailUser: process.env.EMAIL_USER,
  emailPassword: process.env.EMAIL_PASS,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  apiKey: process.env.FIREBASE_API_KEY,
};

export default CONFIG;
