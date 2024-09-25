import express from 'express';
import { signup, signinController } from '../../controller/user/user_auth';

const AuthRoutes = express.Router();

AuthRoutes.post('/signup', signup);
AuthRoutes.post('/signin', signinController);

export default AuthRoutes;
