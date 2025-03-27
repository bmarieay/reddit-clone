import express from 'express';
import { getMe, login, logout, signup } from '../controllers/auth.controller.js';
import { authenticateUser, validateuserBasedOnPath } from '../middlewares/auth.middleware.js';
import { catchAsyncError } from '../utils/errors/catchAsyncError.js';

const router = express.Router();

router.get('/me', 
    authenticateUser, 
    catchAsyncError(getMe));

router.post('/login', 
    validateuserBasedOnPath('/login'), 
    catchAsyncError(login));

router.post('/signup', 
    validateuserBasedOnPath('/signup'), 
    catchAsyncError(signup));

router.post('/logout', 
    catchAsyncError(logout));

export default router;