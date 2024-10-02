import { Router } from 'express';
import { upload } from '../middlewares/multer';
import { addAbout, deleteAbout, getAbout, updateAbout } from '../controllers/about.controller';
import { addMedia, getMedia, updateMedia } from '../controllers/media.controller';

export const ContentRoute: Router = Router();

// ABOUT
// ContentRoute.post(
//   '/about',
//   upload.fields([
//     { name: 'image1', maxCount: 1 },
//     { name: 'image2', maxCount: 1 },
//   ]),
//   addAbout,
// );
ContentRoute.get('/about', getAbout);
ContentRoute.get('/about/:id', getAbout);
// ContentRoute.delete('/about/:id', deleteAbout);
ContentRoute.put(
  '/about/:id',
  upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
  ]),
  updateAbout,
);

// MEDIA
// ContentRoute.post(
//   '/media',
//   upload.fields([
//     { name: 'logo_image', maxCount: 1 },
//     { name: 'hero_image', maxCount: 1 },
//     { name: 'background_image', maxCount: 1 },
//     { name: 'footer_image', maxCount: 1 },
//   ]),
//   addMedia,
// );
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
