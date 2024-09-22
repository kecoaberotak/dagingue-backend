import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { getAllPotong } from '../services/potong.service';

export const getPotong = async (req: Request, res: Response) => {
  const dataPotong = await getAllPotong();

  if (dataPotong) {
    logger.info('Success get data potong');
    return res.status(200).send({ status: true, statusCode: 200, data: dataPotong });
  } else {
    logger.info('Data not found');
    return res.status(404).send({ status: false, statusCode: 404, data: [] });
  }
};
