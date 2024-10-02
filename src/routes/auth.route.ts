import { Router } from 'express';
import verifyToken from '../middlewares/verifyToken';
import { registerAdmin } from '../controllers/auth.controller';

export const AuthRoute: Router = Router();

AuthRoute.get('/register', registerAdmin);
