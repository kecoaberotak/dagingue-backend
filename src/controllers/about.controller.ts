import { Request, Response } from 'express';
import { logInfo, logError } from '../utils/logger';
import { ResponseDataType } from '../types/general.types';
import { createContentValidation } from '../validations/content.validation';

export const addAbout = (req: Request, res: Response) => {
  const { desc } = req.body;

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  if (!files.image1?.length || !files.image2?.length) {
    logError('Failed add data about: Missing image files');
    const response: ResponseDataType = {
      status: false,
      statusCode: 400,
      message: 'File gambar wajib diunggah',
      data: {},
    };
    res.status(400).send(response);
  }

  const { error, value } = createContentValidation({
    desc,
    image1: files.image1[0],
    image2: files.image2[0],
  });

  if (error) {
    logError(`Validation error while creating content about: ${error.details[0].message}`);
    const response: ResponseDataType = {
      status: false,
      statusCode: 422,
      message: error.details[0].message,
      data: {},
    };
    return res.status(422).send(response);
  }
};
