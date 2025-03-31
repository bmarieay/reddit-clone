import express from 'express';
import { authenticateUser } from '../middlewares/auth.middleware.js';
import { catchAsyncError } from '../utils/errors/catchAsyncError.js';
import { deleteNotification, getNotifications } from '../controllers/notification.controller.js';
import { checkParameters } from '../middlewares/subreddit.middleware.js';
import { isNotificationOwner } from '../middlewares/notification.middleware.js';
const router = express.Router();

router.get('/', authenticateUser, catchAsyncError(getNotifications));
router.delete('/:id', authenticateUser, checkParameters, isNotificationOwner, catchAsyncError(deleteNotification));
export default router;