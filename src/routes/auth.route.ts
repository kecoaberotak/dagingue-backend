import { Router } from 'express';
import { logInfo } from '../utils/logger';

export const AuthRoute: Router = Router();

AuthRoute.get('/', (req, res) => {
  logInfo('Route check success');
  res.status(200).send({ message: 'Auth' });
});
