import { Router } from 'express';
import { upload } from '../middlewares/multer';
import { addPotong, deletePotong, getPotong, updatePotong } from '../controllers/potong.controller';
import { addBumbu, deleteBumbu, getBumbu, updateBumbu } from '../controllers/bumbu.controller';
import verifyToken from '../middlewares/verifyToken';

export const ProductRoute: Router = Router();

ProductRoute.get('/potong', getPotong);
ProductRoute.get('/potong/:id', getPotong);
ProductRoute.post('/potong', verifyToken, upload.single('image'), addPotong);
ProductRoute.delete('/potong/:id', verifyToken, deletePotong);
ProductRoute.put('/potong/:id', verifyToken, upload.single('image'), updatePotong);

ProductRoute.get('/bumbu', getBumbu);
ProductRoute.get('/bumbu/:id', getBumbu);
ProductRoute.post('/bumbu', verifyToken, upload.single('image'), addBumbu);
ProductRoute.delete('/bumbu/:id', verifyToken, deleteBumbu);
ProductRoute.put('/bumbu/:id', verifyToken, upload.single('image'), updateBumbu);
