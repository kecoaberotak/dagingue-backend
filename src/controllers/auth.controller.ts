import { Request, Response } from 'express';
import { loginService, registerAdminSevice } from '../services/auth.service';
import { logError, logInfo } from '../utils/logger';

export const registerAdmin = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  if (!email || !password || !username) {
    return res.status(400).send({
      status: false,
      message: 'All fields (email, password, username) are required',
      statusCode: 400,
    });
  }

  try {
    const result = await registerAdminSevice({ username, email, password });
    if (result.success) {
      return res.status(201).send({
        status: true,
        statusCode: 201,
        message: result.message,
        data: result.data,
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      logError(`Error occurred while register admin: ${error.message}`); // Menggunakan error.message untuk menangkap pesan yang lebih spesifik dari service
      return res.status(500).send({
        status: false,
        message: error.message || 'Failed to register admin', // Menggunakan pesan dari error jika ada
        statusCode: 500,
        data: {},
      });
    } else {
      logError('Unknown error occurred while register admin');
      return res.status(500).send({ status: false, statusCode: 500, message: 'Unknown error occurred', data: {} });
    }
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = await loginService(req.body);
    logInfo(`User logged in: ${result.user.email}`);

    return res.status(200).json({
      status: true,
      message: result.message,
      token: result.token, // Mengirim token ke client
      user: result.user, // Mengirim detail user ke client
    });
  } catch (error: any) {
    logError(`Error in loginController: ${error.message}`);

    // Mengirim response error jika login gagal
    return res.status(401).json({
      status: false,
      message: error.message || 'Failed to login',
      statusCode: 401,
      data: {},
    });
  }
};
