import express from 'express';
import { getMe, login, logout, signup } from '../controllers/auth.controller.js';
import { authenticateUser } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/me', authenticateUser, getMe);
router.post('/login', login);
router.post('/logout', logout);
router.post('/signup', signup);

export default router;