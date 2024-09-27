import { Request, Response } from 'express';
import { logError, logInfo } from '../utils/logger';
import { addDataPotong, getAllDataPotong, getDataPotongById } from '../services/potong.service';
import { createPotongValidation } from '../validations/potong.validation';

export const getPotong = async (req: Request, res: Response) => {
  const {
    params: { id },
  } = req;

  try {
    const result = id ? await getDataPotongById(id) : await getAllDataPotong();

    if (result.success) {
      logInfo(result.message);
      return res.status(200).send({ status: true, statusCode: 200, data: result.data });
    } else {
      logError(`Failed to ${id ? 'get data potong by id' : 'get all data potong'}: ${result.message}`);
      return res.status(404).send({ status: false, statusCode: 404, message: result.message });
    }
  } catch (error) {
    if (error instanceof Error) {
      logError(`Error occurred while executing ${id ? 'getDataPotongById' : 'getAllDataPotong'}`, error);
      return res.status(500).send({ status: false, statusCode: 500, message: error.message });
    } else {
      logError(`Unknown error occurred while executing ${id ? 'getDataPotongById' : 'getAllDataPotong'}`);
      return res.status(500).send({ status: false, statusCode: 500, message: 'Unknown error occurred' });
    }
  }
};

export const addPotong = async (req: Request, res: Response) => {
  const { name, desc, price } = req.body;

  if (!req.file) {
    logError('Failed add data potong: Missing image file');
    return res.status(400).send({ status: false, statusCode: 400, message: 'Missing image file' });
  }

  // Validasi inputan user menggunakan Joi
  const { error, value } = createPotongValidation({
    name,
    desc,
    price,
    image: req.file,
  });

  if (error) {
    logError(`Validation error while creating potong: ${error.details[0].message}`);
    return res.status(422).send({
      status: false,
      statusCode: 422,
      message: error.details[0].message,
      data: {},
    });
  }

  // add to db
  try {
    const result = await addDataPotong({ name: value.name, desc: value.desc, price: value.price, image: req.file });
    if (result.success) {
      logInfo(result.message);
      return res.status(201).send({ status: true, statusCode: 201, message: result.message, data: result.data });
    } else {
      logError(result.message);
      return res.status(500).send({ status: false, statusCode: 500, message: result.message });
    }
  } catch (error) {
    if (error instanceof Error) {
      logError('Error occurred while executing addDataPotong', error);
      return res.status(500).send({ status: false, statusCode: 500, message: error.message });
    } else {
      logError('Unknown error occurred while executing addDataPotong');
      return res.status(500).send({ status: false, statusCode: 500, message: 'Unknown error occurred' });
    }
  }
};
