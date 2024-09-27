import { Request, Response } from 'express';
import { logError, logInfo } from '../utils/logger';
import { addDataBumbu, getAllDataBumbu, getDataBumbuById } from '../services/bumbu.service';
import { ResponseDataType } from '../types/product.type';
import { createProductValidation } from '../validations/product.validation';

export const getBumbu = async (req: Request, res: Response) => {
  const {
    params: { id },
  } = req;

  try {
    const result = id ? await getDataBumbuById(id) : await getAllDataBumbu();

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
      logError(`Failed to ${id ? 'get data bumbu by id' : 'get all data bumbu'}: ${result.message}`);
      const response: ResponseDataType = { status: false, statusCode: 404, message: result.message, data: {} };
      return res.status(404).send(response);
    }
  } catch (error) {
    if (error instanceof Error) {
      logError(`Error occurred while executing ${id ? 'getDataBumbuById' : 'getAllDataBumbu'}`, error);
      const response: ResponseDataType = { status: false, statusCode: 500, message: error.message, data: {} };
      return res.status(500).send(response);
    } else {
      logError(`Unknown error occurred while executing ${id ? 'getDataBumbuById' : 'getAllDataBumbu'}`);
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

export const addBumbu = async (req: Request, res: Response) => {
  const { name, desc, price } = req.body;

  if (!req.file) {
    logError('Failed add data bumbu: Missing image file');
    const response: ResponseDataType = {
      status: false,
      statusCode: 400,
      message: 'Missing image file',
      data: {},
    };
    return res.status(400).send(response);
  }

  const { error, value } = createProductValidation({
    name,
    desc,
    price,
    image: req.file,
  });

  if (error) {
    logError(`Validation error while creating bumbu: ${error.details[0].message}`);
    const response: ResponseDataType = {
      status: false,
      statusCode: 422,
      message: error.details[0].message,
      data: {},
    };
    return res.status(422).send(response);
  }

  try {
    const result = await addDataBumbu({ name: value.name, desc: value.desc, price: value.price, image: req.file });
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
      logError('Error occurred while executing addDataBumbu', error);
      const response: ResponseDataType = { status: false, statusCode: 500, message: error.message, data: {} };
      return res.status(500).send(response);
    } else {
      logError('Unknown error occurred while executing addDataBumbu');
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
