import express from 'express';
import { logger } from './utils/logger';
import CONFIG from './config/environtment';
import createServer from './utils/server';

const app = createServer();
const port = CONFIG.port;

app.use(express.json());

app.listen(port, () => {
  logger.info(`[server]: Server is running at port: ${port}`);
});
