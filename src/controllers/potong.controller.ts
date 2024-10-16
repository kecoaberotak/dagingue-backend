import { Request, Response } from 'express';
import { logError, logInfo } from '../utils/logger';
import {
  addDataPotong,
  deleteDataPotongById,
  editDataPotongById,
  getAllDataPotong,
  getDataPotongById,
} from '../services/potong.service';
import { createProductValidation, updateProductValidation } from '../validations/product.validation';
import { ResponseDataType } from '../types/general.types';

export const getPotong = async (req: Request, res: Response) => {
  const {
    params: { id },
  } = req;

  try {
    const result = id ? await getDataPotongById(id) : await getAllDataPotong();

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
      logError(`Error occurred while executing ${id ? 'getDataPotongById' : 'getAllDataPotong'}`, error);
      const response: ResponseDataType = { status: false, statusCode: 500, message: error.message, data: {} };
      return res.status(500).send(response);
    } else {
      logError(`Unknown error occurred while executing ${id ? 'getDataPotongById' : 'getAllDataPotong'}`);
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

export const addPotong = async (req: Request, res: Response) => {
  const { name, desc, price } = req.body;

  if (!req.file) {
    logError('Failed add data potong: Missing image file');
    const response: ResponseDataType = {
      status: false,
      statusCode: 400,
      message: 'File gambar wajib diunggah',
      data: {},
    };
    return res.status(400).send(response);
  }

  // Validasi inputan user menggunakan Joi
  const { error, value } = createProductValidation({
    name,
    desc,
    price,
    image: req.file,
  });

  if (error) {
    logError(`Validation error while creating potong: ${error.details[0].message}`);
    const response: ResponseDataType = {
      status: false,
      statusCode: 422,
      message: error.details[0].message,
      data: {},
    };
    return res.status(422).send(response);
  }

  // add to db
  try {
    const result = await addDataPotong({ name: value.name, desc: value.desc, price: value.price, image: req.file });
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
      logError('Error occurred while executing addDataPotong', error);
      const response: ResponseDataType = { status: false, statusCode: 500, message: error.message, data: {} };
      return res.status(500).send(response);
    } else {
      logError('Unknown error occurred while executing addDataPotong');
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

export const deletePotong = async (req: Request, res: Response) => {
  const {
    params: { id },
  } = req;

  try {
    const result = await deleteDataPotongById(id);

    if (result.success) {
      logInfo(result.message);
      const response: ResponseDataType = {
        status: true,
        statusCode: 204,
        message: result.message,
      };
      return res.status(204).send(response);
    } else {
      logError(result.message);
      const response: ResponseDataType = { status: false, statusCode: 404, message: result.message };
      return res.status(404).send(response);
    }
  } catch (error) {
    if (error instanceof Error) {
      logError('Error occurred while executing deleteDataPotongById', error);
      const response: ResponseDataType = { status: false, statusCode: 500, message: error.message };
      return res.status(500).send(response);
    } else {
      logError('Unknown error occurred while executing deleteDataPotongById');
      const response: ResponseDataType = {
        status: false,
        statusCode: 500,
        message: 'Unknown error occurred',
      };
      return res.status(500).send(response);
    }
  }
};

export const updatePotong = async (req: Request, res: Response) => {
  const {
    params: { id },
  } = req;

  const { name, desc, price } = req.body;

  const { error, value } = updateProductValidation({
    name,
    desc,
    price,
    image: req.file ? req.file : req.body.image,
  });

  if (error) {
    logError(`Failed to validate update potong: ${error.details[0].message}`);
    return res.status(422).send({
      status: false,
      statusCode: 422,
      message: error.details[0].message,
      data: {},
    });
  }

  try {
    const result = await editDataPotongById(id, { ...value, image: req.file || value.image });

    if (result.success) {
      logInfo(result.message);
      return res.status(200).send({ status: true, statusCode: 200, data: result.data });
    } else {
      logError(result.message);
      return res.status(404).send({ status: false, statusCode: 404, message: result.message });
    }
  } catch (error) {
    if (error instanceof Error) {
      logError('Error occurred while updating potong data', error);
      return res.status(500).send({ status: false, statusCode: 500, message: error.message });
    } else {
      logError('Unknown error occurred while updating potong data');
      return res.status(500).send({ status: false, statusCode: 500, message: 'Unknown error occurred' });
    }
  }
};
