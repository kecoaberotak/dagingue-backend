import { Request, Response } from 'express';
import { logInfo, logError } from '../utils/logger';
import { ResponseDataType } from '../types/general.types';
import { createContentValidation } from '../validations/content.validation';
import { addDataAbout } from '../services/about.service';

export const addAbout = async (req: Request, res: Response) => {
  const { desc } = req.body;

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  if (!files || !files.image1 || !files.image1[0] || !files.image2 || !files.image2[0]) {
    logError('Failed add data about: Missing image files');
    const response: ResponseDataType = {
      status: false,
      statusCode: 400,
      message: 'File gambar wajib diunggah',
      data: {},
    };
    return res.status(400).send(response);
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

  try {
    const result = await addDataAbout({ desc: value.desc, image1: files.image1[0], image2: files.image2[0] });
    if (result.success) {
      logInfo(result.message);
      const response: ResponseDataType = {
        status: true,
        statusCode: 201,
        message: result.message,
        data: result.data || {},
      };
      return res.status(201).send(response);
    } else {
      logError(result.message);
      const response: ResponseDataType = { status: false, statusCode: 500, message: result.message, data: {} };
      return res.status(500).send(response);
    }
  } catch (error) {
    if (error instanceof Error) {
      logError('Error occurred while executing addDataAbout', error);
      const response: ResponseDataType = { status: false, statusCode: 500, message: error.message, data: {} };
      return res.status(500).send(response);
    } else {
      logError('Unknown error occurred while executing addDataAbout');
      const response: ResponseDataType = {
        status: false,
        statusCode: 500,
        message: 'Unknown error occurred',
        data: {},
      };
      return res.status(500).send(response);
    }
  }
};
