import { Request, Response } from 'express';
import { logInfo, logError } from '../utils/logger';
import { ResponseDataType } from '../types/general.types';
import { updateAboutValidation, createAboutValidation } from '../validations/content.validation';
import {
  addDataAbout,
  deleteDataAboutById,
  getAllDataAbout,
  getDataAboutById,
  updateDataAboutById,
} from '../services/about.service';

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

  const { error, value } = createAboutValidation({
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

export const getAbout = async (req: Request, res: Response) => {
  const {
    params: { id },
  } = req;

  try {
    const result = id ? await getDataAboutById(id) : await getAllDataAbout();

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
      logError(`Error occurred while executing ${id ? 'getDataAboutById' : 'getAllDataAbout'}`, error);
      const response: ResponseDataType = { status: false, statusCode: 500, message: error.message, data: {} };
      return res.status(500).send(response);
    } else {
      logError(`Unknown error occurred while executing ${id ? 'getDataAboutById' : 'getAllDataAbout'}`);
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

export const deleteAbout = async (req: Request, res: Response) => {
  const {
    params: { id },
  } = req;

  try {
    const result = await deleteDataAboutById(id);
    if (result.success) {
      logInfo(result.message);
      const response: ResponseDataType = {
        status: true,
        statusCode: 200,
        message: result.message,
      };
      return res.status(200).send(response);
    } else {
      logError(result.message);
      const response: ResponseDataType = { status: false, statusCode: 400, message: result.message };
      return res.status(400).send(response);
    }
  } catch (error) {
    if (error instanceof Error) {
      logError('Error occurred while executing deleteDataAboutById', error);
      const response: ResponseDataType = { status: false, statusCode: 500, message: error.message };
      return res.status(500).send(response);
    } else {
      logError('Unknown error occurred while executing deleteDataAboutById');
      const response: ResponseDataType = { status: false, statusCode: 500, message: 'Unknown error occurred' };
      return res.status(500).send(response);
    }
  }
};

export const updateAbout = async (req: Request, res: Response) => {
  const {
    params: { id },
  } = req;

  const { desc } = req.body;
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  const { error, value } = updateAboutValidation({
    desc,
    image1: files.image1 ? files.image1[0] : req.body.image1,
    image2: files.image2 ? files.image2[0] : req.body.image2,
  });

  if (error) {
    logError(`Failed to validate data about: ${error.details[0].message}`);
    return res.status(422).send({
      status: false,
      statusCode: 422,
      message: error.details[0].message,
      data: {},
    });
  }

  try {
    const result = await updateDataAboutById(id, {
      desc: value.desc,
      image1: files.image1 ? files.image1[0] : value.image1,
      image2: files.image2 ? files.image2[0] : value.image2,
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
      logError('Error occurred while updating data about', error);
      return res.status(500).send({ status: false, statusCode: 500, message: error.message });
    } else {
      logError('Unknown error occurred while updating data about');
      return res.status(500).send({ status: false, statusCode: 500, message: 'Unknown error occurred' });
    }
  }
};
