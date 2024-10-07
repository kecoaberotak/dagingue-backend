import { Request, Response } from 'express';
import {
  deleteUserService,
  getDataUserById,
  getDataUsers,
  loginService,
  registerAdminSevice,
} from '../services/auth.service';
import { logError, logInfo } from '../utils/logger';
import { loginValidation, registerValidation } from '../validations/auth.validation';
import { ResponseDataType } from '../types/general.types';
import { JwtPayload } from 'jsonwebtoken';

export const registerAdmin = async (req: Request, res: Response) => {
  const { error, value } = registerValidation(req.body);

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
    logError(`Validation error while login: ${error.details[0].message}`);
    const response: ResponseDataType = {
      status: false,
      statusCode: 422,
      message: error.details[0].message,
      data: {},
    };
    return res.status(422).send(response);
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

export const getUser = async (req: Request, res: Response) => {
  const {
    params: { uid },
  } = req;
  try {
    const result = uid ? await getDataUserById(uid) : await getDataUsers();
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
      logError(`Error occurred while executing ${uid ? 'getDataUserById' : 'getDataUsers'}`, error);
      const response: ResponseDataType = { status: false, statusCode: 500, message: error.message, data: {} };
      return res.status(500).send(response);
    } else {
      logError(`Unknown error occurred while executing ${uid ? 'getDataUserById' : 'getDataUsers'}`);
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

export const deleteUser = async (req: Request, res: Response) => {
  // Ambil uid dari param jika tersedia, jika tidak gunakan dari token yang didecode di req.user
  const uid = req.params.uid || (req.user as JwtPayload)?.uid;

  if (!uid) {
    const response: ResponseDataType = {
      status: false,
      statusCode: 403,
      message: 'Unauthorized access',
      data: {},
    };
    return res.status(403).send(response);
  }

  try {
    const result = await deleteUserService(uid);

    if (result.success) {
      const response: ResponseDataType = {
        status: true,
        statusCode: 200,
        message: result.message,
        data: {},
      };
      return res.status(200).send(response);
    }
  } catch (error: any) {
    logError(`Error deleting user: ${error.message}`);
    const response: ResponseDataType = {
      status: false,
      statusCode: 500,
      message: error.message || 'Failed to delete user',
      data: {},
    };
    return res.status(500).send(response);
  }
};
