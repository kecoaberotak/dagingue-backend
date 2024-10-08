import { Request, Response } from 'express';
import { logInfo, logError } from '../utils/logger';
import { ResponseDataType } from '../types/general.types';
import { createMediaValidation, updateMediaValidation } from '../validations/content.validation';
import { addDataMedia, getDataMedia, updateDataMedia } from '../services/media.service';

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

  const { error, value } = createMediaValidation({
    email,
    phone,
    address,
    instagram,
    shopee,
    whatsapp,
    maps,
    logo_image: files.logo_image[0],
    hero_image: files.hero_image[0],
    background_image: files.background_image[0],
    footer_image: files.footer_image[0],
  });

  if (error) {
    logError(`Validation error while creating data: ${error.details[0].message}`);
    const response: ResponseDataType = {
      status: false,
      statusCode: 422,
      message: error.details[0].message,
      data: {},
    };
    return res.status(422).send(response);
  }

  try {
    const result = await addDataMedia({
      ...value,
      logo_image: files.logo_image[0],
      hero_image: files.hero_image[0],
      background_image: files.background_image[0],
      footer_image: files.footer_image[0],
    });
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
      logError('Error occurred while executing addDataMedia', error);
      const response: ResponseDataType = { status: false, statusCode: 500, message: error.message, data: {} };
      return res.status(500).send(response);
    } else {
      logError('Unknown error occurred while executing addDataMedia');
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

export const getMedia = async (req: Request, res: Response) => {
  try {
    const result = await getDataMedia();

    if (result.success) {
      logInfo(result.message);
      const response: ResponseDataType = {
        status: true,
        statusCode: 200,
        message: result.message,
        data: result.data || {},
      };
      return res.status(200).send(response);
    } else {
      logError(result.message);
      const response: ResponseDataType = { status: false, statusCode: 404, message: result.message, data: {} };
      return res.status(404).send(response);
    }
  } catch (error) {
    if (error instanceof Error) {
      logError('Error occurred while executing getDataMedia', error);
      const response: ResponseDataType = { status: false, statusCode: 500, message: error.message, data: {} };
      return res.status(500).send(response);
    } else {
      logError('Unkniwn error occurred while executing getDataMedia');
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

export const updateMedia = async (req: Request, res: Response) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  const { error, value } = updateMediaValidation({
    ...req.body,
    logo_image: files.logo_image ? files.logo_image[0] : req.body.logo_image,
    hero_image: files.hero_image ? files.hero_image[0] : req.body.hero_image,
    background_image: files.background_image ? files.background_image[0] : req.body.background_image,
    footer_image: files.footer_image ? files.footer_image[0] : req.body.footer_image,
  });

  if (error) {
    logError(`Failed to validate data media: ${error.details[0].message}`);
    return res.status(422).send({
      status: false,
      statusCode: 422,
      message: error.details[0].message,
      data: {},
    });
  }

  try {
    const result = await updateDataMedia({
      ...value,
      logo_image: files.logo_image ? files.logo_image[0] : value.logo_image,
      hero_image: files.hero_image ? files.hero_image[0] : value.hero_image,
      background_image: files.background_image ? files.background_image[0] : value.background_image,
      footer_image: files.footer_image ? files.footer_image[0] : value.footer_image,
    });

    if (result.success) {
      logInfo(result.message);
      return res.status(200).send({ status: true, statusCode: 200, data: result.data });
    } else {
      logError(result.message);
      return res.status(404).send({ status: false, statusCode: 404, message: result.message });
    }
  } catch (error) {
    if (error instanceof Error) {
      logError('Error occurred while run updateDataMedia', error);
      return res.status(500).send({ status: false, statusCode: 500, message: error.message });
    } else {
      logError('Unknown error occurred while run updateDataMedia');
      return res.status(500).send({ status: false, statusCode: 500, message: 'Unknown error occurred' });
    }
  }
};
