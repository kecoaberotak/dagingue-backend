import { Router } from 'express';
import { upload } from '../middlewares/multer';
import { addPotong, deletePotong, getPotong, updatePotong } from '../controllers/potong.controller';
import { addBumbu, deleteBumbu, getBumbu } from '../controllers/bumbu.controller';

export const ProductRoute: Router = Router();

ProductRoute.get('/potong', getPotong);
ProductRoute.get('/potong/:id', getPotong);
ProductRoute.post('/potong', upload.single('image'), addPotong);
ProductRoute.delete('/potong/:id', deletePotong);
ProductRoute.put('/potong/:id', updatePotong);

ProductRoute.get('/bumbu', getBumbu);
ProductRoute.get('/bumbu/:id', getBumbu);
ProductRoute.post('/bumbu', upload.single('image'), addBumbu);
ProductRoute.delete('/bumbu/:id', deleteBumbu);
