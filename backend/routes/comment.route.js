import express from 'express';
import { authenticateUser } from '../middlewares/auth.middleware.js';
import { catchAsyncError } from '../utils/errors/catchAsyncError.js';
import { createComment, deleteComment, replyToComment, updateComment, upvoteDownVoteComment, viewComment } from '../controllers/comment.controller.js';
import { isCommentator, validateComment, validateParamsAndComment, validateParamsAndPost } from '../middlewares/comment.middleware.js';
const router = express.Router({mergeParams: true});

//create a comment
router.post(('/'), 
    authenticateUser,
    validateParamsAndPost, 
    validateComment, 
    catchAsyncError(createComment));

router.route('/:commentId')
//view comment
.get(authenticateUser, 
    validateParamsAndComment,
    catchAsyncError(viewComment))
//reply to a comment
.post(authenticateUser, 
    validateParamsAndPost,
    validateParamsAndComment, 
    validateComment, 
    catchAsyncError(replyToComment))
//update a comment
.patch(authenticateUser,
    validateParamsAndPost,
    validateParamsAndComment,
    validateComment,
    isCommentator,
    catchAsyncError(updateComment))
//delete a comment
.delete(authenticateUser,
    validateParamsAndPost,
    validateParamsAndComment,
    isCommentator,
    catchAsyncError(deleteComment));

//upvote/downvote
router.post('/:commentId/vote', 
    authenticateUser, 
    validateParamsAndPost, 
    validateParamsAndComment,
    catchAsyncError(upvoteDownVoteComment));

export default router;