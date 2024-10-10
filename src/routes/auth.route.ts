import { Router } from 'express';
import verifyToken from '../middlewares/verifyToken';
import { deleteUser, editUser, getUser, login, registerAdmin } from '../controllers/auth.controller';

export const AuthRoute: Router = Router();

AuthRoute.post('/login', login);
AuthRoute.post('/register', verifyToken, registerAdmin);
AuthRoute.get('/user', verifyToken, getUser);
AuthRoute.get('/user/:uid', verifyToken, getUser);
AuthRoute.put('/user/:uid', verifyToken, editUser);
AuthRoute.delete('/user', verifyToken, deleteUser);
AuthRoute.delete('/user/:uid', verifyToken, deleteUser);
