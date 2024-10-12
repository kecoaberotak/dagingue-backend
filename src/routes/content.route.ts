import { Router } from 'express';
import { upload } from '../middlewares/multer';
import { getAbout, updateAbout } from '../controllers/about.controller';
import { getMedia, updateMedia } from '../controllers/media.controller';
import verifyToken from '../middlewares/verifyToken';

export const ContentRoute: Router = Router();

// ABOUT
ContentRoute.get('/about', getAbout);
ContentRoute.get('/about/:id', getAbout);
ContentRoute.put(
  '/about/:id',
  verifyToken,
  upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
  ]),
  updateAbout,
);

// MEDIA
ContentRoute.get('/media', getMedia);
ContentRoute.put(
  '/media',
  verifyToken,
  upload.fields([
    { name: 'logo_image', maxCount: 1 },
    { name: 'hero_image', maxCount: 1 },
    { name: 'background_image', maxCount: 1 },
    { name: 'footer_image', maxCount: 1 },
  ]),
  updateMedia,
);
