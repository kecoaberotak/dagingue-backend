import { Router } from 'express';
import { logger } from '../utils/logger';

export const ProductRoute: Router = Router();

ProductRoute.get('/potong', (req, res) => {
  res.status(200).send({ message: 'Product Potong' });
});

ProductRoute.get('/bumbu', (req, res) => {
  logger.info('Route check success');
  res.status(200).send({ message: 'Product Bumbu' });
});
