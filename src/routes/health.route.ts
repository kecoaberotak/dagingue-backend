import { Router, Request, Response, NextFunction } from 'express';
import { logInfo } from '../utils/logger';

export const HealthRouter: Router = Router();

HealthRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  logInfo('Health check success');
  res.status(200).send({ status: true, statusCode: 200 });
});
