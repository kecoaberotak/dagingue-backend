import { Request, Response } from 'express';
import { registerAdminSevice } from '../services/auth.service';
import { logError } from '../utils/logger';

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
