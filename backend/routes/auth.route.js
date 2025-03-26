import express from 'express';
import { getMe, login, logout, signup } from '../controllers/auth.controller.js';
import { authenticateUser, validateuserBasedOnPath } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/me', authenticateUser, getMe);
router.post('/login', validateuserBasedOnPath('/login'), login);
router.post('/signup', validateuserBasedOnPath('/signup'), signup);
router.post('/logout', logout);

export default router;