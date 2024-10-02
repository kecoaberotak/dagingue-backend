import { JwtPayload } from 'jsonwebtoken';
import 'express';

declare module 'express' {
  interface Request {
    user?: string | JwtPayload;
  }
}
