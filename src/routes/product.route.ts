import { Router } from 'express';
import { upload } from '../middlewares/multer';
import { addPotong, getPotong } from '../controllers/potong.controller';
import { getBumbu } from '../controllers/bumbu.controller';

export const ProductRoute: Router = Router();

ProductRoute.get('/potong', getPotong);
ProductRoute.get('/potong/:id', getPotong);
ProductRoute.post('/potong', upload.single('image'), addPotong);

ProductRoute.get('/bumbu', getBumbu);
