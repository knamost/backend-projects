import express from 'express';
import { signup, login, getCurrentUser, updateUser } from '../controllers/user.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', requireAuth, getCurrentUser);

router.post('/signup', signup);

router.post('/login', login);

router.patch('/', requireAuth, updateUser);


export default router;