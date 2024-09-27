import express from 'express';
import { logInfo } from './utils/logger';
import CONFIG from './config/environtment';
import createServer from './utils/server';

const app = createServer();
const port = CONFIG.port;

app.use(express.json());

app.listen(port, () => {
  logInfo(`[server]: Server is running at port: ${port}`);
});
