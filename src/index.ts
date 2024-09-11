import express, { Application, Request, Response } from 'express';
import { logger } from './utils/logger';
import CONFIG from './config/environtment';

const app: Application = express();
const port = CONFIG.port;

app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
  res.status(200).send({ status: true, statusCode: 200, message: 'Server is running' });
});

app.listen(port, () => {
  logger.info(`[server]: Server is running at port: ${port}`);
});
