import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { addDataPotong, getAllDataPotong, getDataPotongById } from '../services/potong.service';
import { createPotongValidation } from '../validations/potong.validation';

export const getPotong = async (req: Request, res: Response) => {
  const {
    params: { id },
  } = req;

  try {
    const data = id ? await getDataPotongById(id) : await getAllDataPotong();

    if (data) {
      logger.info(`Success get data ${id ? 'detail ' : ''}potong`);
      return res.status(200).send({ status: true, statusCode: 200, data });
    } else {
      logger.info('Data not found');
      return res.status(404).send({ status: false, statusCode: 404, message: 'Data not found' });
    }
  } catch (error) {
    logger.error('Error fetching data potong', error);
    return res.status(500).send({ status: false, statusCode: 500, message: 'Internal Server Error' });
  }
};

export const addPotong = async (req: Request, res: Response) => {
  const { name, desc, price } = req.body;

  if (req.file) {
    const fileType = ['image/jpeg', 'image/jpg', 'image/png'];

    // validasi tipe file
    if (!fileType.includes(req.file.mimetype)) {
      logger.info('Format file tidak valid');
      return res.status(400).send({ message: 'Format file tidak valid' });
    }

    // Jika file valid, lanjutkan ke proses berikutnya
    const image = req.file;

    // Validasi inputan user menggunakan Joi
    const { error, value } = createPotongValidation({
      name,
      desc,
      price,
      image: image.originalname,
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
      const newPotong = await addDataPotong({ name: value.name, desc: value.desc, price: value.price, image });
      if (newPotong) {
        logger.info('Success add data potong');
        return res.status(201).send({ status: true, statusCode: 201, data: newPotong });
      } else {
        logger.info('Failed to add data potong, missing or invalid fields');
        return res.status(400).send({ status: false, statusCode: 400, message: 'Invalid input data or file type' });
      }
    } catch (error) {
      logger.error(`Err: potong - create = ${error}`);
      return res.status(422).send({
        status: false,
        statusCode: 422,
        message: error,
      });
    }
  } else {
    logger.info('Missing image file');
    return res.status(400).send({ message: 'Missing image file' });
  }
};
