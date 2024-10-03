import { Request, Response } from 'express';
import { loginService, registerAdminSevice } from '../services/auth.service';
import { logError, logInfo } from '../utils/logger';
import { loginValidation, registerValidation } from '../validations/auth.validation';
import { ResponseDataType } from '../types/general.types';

export const registerAdmin = async (req: Request, res: Response) => {
  const { error, value } = registerValidation(req.body);

  if (error) {
    if (error) {
      logError(`Validation error while register: ${error.details[0].message}`);
      const response: ResponseDataType = {
        status: false,
        statusCode: 422,
        message: error.details[0].message,
        data: {},
      };
      return res.status(422).send(response);
    }
  }

  try {
    const result = await registerAdminSevice(value);
    if (result.success) {
      const response: ResponseDataType = {
        status: true,
        statusCode: 201,
        message: result.message,
        data: result.data,
      };
      return res.status(201).send(response);
    }
  } catch (error) {
    if (error instanceof Error) {
      logError(`Error occurred while register admin: ${error.message}`); // Menggunakan error.message untuk menangkap pesan yang lebih spesifik dari service
      const response: ResponseDataType = {
        status: false,
        message: error.message || 'Failed to register admin', // Menggunakan pesan dari error jika ada
        statusCode: 500,
        data: {},
      };
      return res.status(500).send(response);
    } else {
      logError('Unknown error occurred while register admin');
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

export const login = async (req: Request, res: Response) => {
  const { error, value } = loginValidation(req.body);

  if (error) {
    if (error) {
      logError(`Validation error while login: ${error.details[0].message}`);
      const response: ResponseDataType = {
        status: false,
        statusCode: 422,
        message: error.details[0].message,
        data: {},
      };
      return res.status(422).send(response);
    }
  }

  try {
    const result = await loginService(value);
    logInfo(`User logged in: ${result.user.email}`);
    const response: ResponseDataType = {
      status: true,
      message: result.message,
      statusCode: 200,
      data: {
        token: result.token, // Mengirim token ke client
        user: result.user, // Mengirim detail user ke client
      },
    };
    return res.status(200).send(response);
  } catch (error: any) {
    logError(`Error in loginController: ${error.message}`);
    // Mengirim response error jika login gagal
    const response: ResponseDataType = {
      status: false,
      message: error.message || 'Failed to login',
      statusCode: 401,
      data: {},
    };
    return res.status(401).send(response);
  }
};
