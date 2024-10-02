import { Router } from 'express';
import { upload } from '../middlewares/multer';
import { getAbout, updateAbout } from '../controllers/about.controller';
import { getMedia, updateMedia } from '../controllers/media.controller';

export const ContentRoute: Router = Router();

// ABOUT
ContentRoute.get('/about', getAbout);
ContentRoute.get('/about/:id', getAbout);
ContentRoute.put(
  '/about/:id',
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
  upload.fields([
    { name: 'logo_image', maxCount: 1 },
    { name: 'hero_image', maxCount: 1 },
    { name: 'background_image', maxCount: 1 },
    { name: 'footer_image', maxCount: 1 },
  ]),
  updateMedia,
);
