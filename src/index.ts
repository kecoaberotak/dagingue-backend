import express from 'express';
import { logInfo } from './utils/logger';
import CONFIG from './config/environment';
import createServer from './utils/server';

const app = createServer();
const port = CONFIG.port;

app.use(express.json());

logInfo(`Server is running in ${CONFIG.node_env} environment`);

// Hanya gunakan app.listen() jika dijalankan secara lokal
if (CONFIG.node_env !== 'production') {
  app.listen(port, () => {
    logInfo(`[server]: Server is running at port: ${port}`);
  });
}

// Ekspor aplikasi untuk digunakan di Vercel (atau platform serverless lainnya)
export default app;
