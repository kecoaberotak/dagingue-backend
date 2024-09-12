import { Router } from 'express';
import { logger } from '../utils/logger';

export const ContentRoute: Router = Router();

ContentRoute.get('/', (req, res) => {
  logger.info('Route check success');
  res.status(200).send({ message: 'Content' });
});
