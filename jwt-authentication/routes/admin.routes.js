import express from 'express';
import { getAllUsers } from '../controllers/admin.controller.js';
import {requireAuth, restrictRole} from '../middleware/auth.middleware.js'

const router = express.Router();


router.get('/users', requireAuth, restrictRole('ADMIN'), getAllUsers);


export default router;