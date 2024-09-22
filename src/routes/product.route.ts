import { Router } from 'express';
import { logger } from '../utils/logger';
import { getPotong } from '../controllers/potong.controller';

export const ProductRoute: Router = Router();

ProductRoute.get('/potong', getPotong);
ProductRoute.get('/potong/:id', getPotong);

ProductRoute.get('/bumbu', (req, res) => {
  logger.info('Route check success');
  res.status(200).send({ message: 'Product Bumbu' });
});
