import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { getAllDataPotong, getDataPotongById } from '../services/potong.service';

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

export const addPotong = async () => {};
