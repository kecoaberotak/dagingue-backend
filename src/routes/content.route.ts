import { Router } from 'express';
import { logInfo } from '../utils/logger';

export const ContentRoute: Router = Router();

ContentRoute.get('/', (req, res) => {
  logInfo('Route check success');
  res.status(200).send({ message: 'Content' });
});
