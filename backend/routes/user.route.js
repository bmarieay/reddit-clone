import express from 'express';
import { catchAsyncError } from '../utils/errors/catchAsyncError.js';
import { displayPostsandComments, displaySubmittedPosts, displayUserComments } from '../controllers/user.controller.js';
import { checkIfUserExists } from '../middlewares/user.middleware.js';
const router = express.Router();

router.get('/:username',checkIfUserExists, catchAsyncError(displayPostsandComments));
router.get('/:username/submitted', checkIfUserExists, catchAsyncError(displaySubmittedPosts));
router.get('/:username/comments', checkIfUserExists, catchAsyncError(displayUserComments));

export default router;