import { Request, Response } from 'express';
import { logInfo, logError } from '../utils/logger';
import { ResponseDataType } from '../types/general.types';

export const addMedia = async (req: Request, res: Response) => {
  const { email, phone, address, instagram, shopee, whatsapp, maps } = req.body;

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const condition =
    !files ||
    !files.logo_image ||
    !files.logo_image[0] ||
    !files.hero_image ||
    !files.hero_image[0] ||
    !files.background_image ||
    !files.background_image[0] ||
    !files.footer_image ||
    !files.footer_image[0];

  if (condition) {
    logError('Failed add data media: Missing image files');
    const response: ResponseDataType = {
      status: false,
      statusCode: 400,
      message: 'File gambar wajib diunggah',
      data: {},
    };
    return res.status(400).send(response);
  }

  logInfo('Success add data media');
  const response: ResponseDataType = {
    status: true,
    statusCode: 200,
    message: 'Success add data media',
    data: {},
  };
  return res.status(200).send(response);
};
