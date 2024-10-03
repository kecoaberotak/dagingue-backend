import { Request, Response, NextFunction } from 'express';
import { auth } from '../lib/firebase/init';
import { logError } from '../utils/logger';

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer token

  if (!token) {
    return res.status(403).send({
      status: false,
      message: 'No token provided',
      statusCode: 403,
    });
  }

  try {
    // Verifying token usesign Firebase Admin SDK
    const decodedToken = await auth.verifyIdToken(token);
    const isAdmin = decodedToken.role === 'admin'; // store role in token

    if (!isAdmin) {
      return res.status(403).send({
        status: false,
        statusCode: 403,
        message: 'Unauthorized: Admin access required',
      });
    }

    req.user = decodedToken; // Masukkan decoded token ke request
    console.log(req.user, '===== REQ.USER =====');

    next();
  } catch (error) {
    logError(`Token verification failed: ${error}`);
    return res.status(401).json({
      status: false,
      message: 'Invalid token',
      statusCode: 401,
    });
  }
};

export default verifyToken;
