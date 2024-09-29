import { Router } from 'express';
import { upload } from '../middlewares/multer';
import { addAbout } from '../controllers/about.controller';

export const ContentRoute: Router = Router();

ContentRoute.post(
  '/about',
  upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
  ]),
  addAbout,
);
