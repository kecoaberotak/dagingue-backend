import { Router } from 'express';
import { logger } from '../utils/logger';

export const AuthRoute: Router = Router();

AuthRoute.get('/', (req, res) => {
  logger.info('Route check success');
  res.status(200).send({ message: 'Auth' });
});
