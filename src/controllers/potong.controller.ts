import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { addDataPotong, getAllDataPotong, getDataPotongById } from '../services/potong.service';
import { createPotongValidation } from '../validations/potong.validation';

export const getPotong = async (req: Request, res: Response) => {
  const {
    params: { id },
  } = req;

  try {
    const result = id ? await getDataPotongById(id) : await getAllDataPotong();

    if (result.success) {
      logger.info(`Success get data ${id ? 'detail ' : ''}potong`);
      return res.status(200).send({ status: true, statusCode: 200, data: result.data });
    } else {
      logger.info('Data not found');
      return res.status(404).send({ status: false, statusCode: 404, message: result.message });
    }
  } catch (error) {
    logger.error(`Err: potong - get = ${error}`);
    return res.status(500).send({ status: false, statusCode: 500, message: 'Internal Server Error' });
  }
};

export const addPotong = async (req: Request, res: Response) => {
  const { name, desc, price } = req.body;

  if (!req.file) {
    logger.info('Missing image file');
    return res.status(400).send({ message: 'Missing image file' });
  }

  // Validasi inputan user menggunakan Joi
  const { error, value } = createPotongValidation({
    name,
    desc,
    price,
    image: req.file,
  });

  if (error) {
    logger.error(`Err: potong - create = ${error.details[0].message}`);
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
      logger.info('Success add data potong');
      return res.status(201).send({ status: true, statusCode: 201, message: result.message, data: result.data });
    } else {
      logger.info(result.message);
      return res.status(400).send({ status: false, statusCode: 400, message: result.message });
    }
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Err: potong - create data potong = ${error.message}`, { stack: error.stack });
      return res.status(500).send({ status: false, statusCode: 500, message: error.message });
    } else {
      logger.error('Err: potong - create data potong = Unknown error');
      return res.status(500).send({ status: false, statusCode: 500, message: 'Unknown error occurred' });
    }
  }
};
