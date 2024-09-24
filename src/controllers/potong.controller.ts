import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { addDataPotong, getAllDataPotong, getDataPotongById } from '../services/potong.service';

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
  const image = req.file;

  try {
    // Kirim data form ke service untuk diproses
    const newPotong = await addDataPotong({ name, desc, price, image });

    if (newPotong) {
      logger.info('Success add data potong');
      return res.status(201).send({ status: true, statusCode: 201, data: newPotong });
    } else {
      logger.info('Failed to add data potong, missing or invalid fields');
      return res.status(400).send({ status: false, statusCode: 400, message: 'Invalid input data or file type' });
    }
  } catch (error) {
    logger.error('Error adding data potong', error);
    return res.status(500).send({ status: false, statusCode: 500, message: 'Internal Server Error' });
  }
};
