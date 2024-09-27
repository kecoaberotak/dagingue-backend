import { Request, Response } from 'express';
import { logError, logInfo } from '../utils/logger';
import { getAllDataBumbu } from '../services/bumbu.service';
import { ResponseDataType } from '../types/product.type';

export const getBumbu = async (req: Request, res: Response) => {
  const {
    params: { id },
  } = req;

  try {
    const result = await getAllDataBumbu();

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
