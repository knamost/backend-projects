import express from 'express';
import { signup, login, getCurrentUser, updateUser } from '../controllers/user.controller.js';
import { isAuthenticated } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', isAuthenticated, getCurrentUser);

router.post('/signup', signup);

router.post('/login', login);

router.patch('/', isAuthenticated, updateUser);


export default router;