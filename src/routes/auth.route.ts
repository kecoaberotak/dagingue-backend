import { Router } from 'express';
import verifyToken from '../middlewares/verifyToken';
import { login, registerAdmin } from '../controllers/auth.controller';

export const AuthRoute: Router = Router();

AuthRoute.post('/login', login);
AuthRoute.post('/register', verifyToken, registerAdmin);
