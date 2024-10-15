import 'dotenv/config';
import express from 'express';
import { logInfo } from './utils/logger';
import CONFIG from './config/environment';
import createServer from './utils/server';

const app = createServer();
const port = CONFIG.port;

app.use(express.json());

console.log(process.env.NODE_ENV, 'NODE_ENV');

// Hanya gunakan app.listen() jika dijalankan secara lokal
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    logInfo(`[server]: Server is running at port: ${port}`);
  });
}

// Ekspor aplikasi untuk digunakan di Vercel (atau platform serverless lainnya)
export default app;
