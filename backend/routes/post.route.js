import express from 'express';
import { authenticateUser } from '../middlewares/auth.middleware.js';
import { catchAsyncError } from '../utils/errors/catchAsyncError.js';
import { validatePost } from '../middlewares/post.middleware.js';
import { createPost } from '../controllers/post.controller.js';

const router = express.Router({mergeParams: true});

router.post('/new', authenticateUser, validatePost, catchAsyncError(createPost));

export default router;