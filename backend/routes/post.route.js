import express from 'express';
import { authenticateUser } from '../middlewares/auth.middleware.js';
import { catchAsyncError } from '../utils/errors/catchAsyncError.js';
import { isPostAuthor, validateParameterAndPostLinkage, validatePost } from '../middlewares/post.middleware.js';
import { createPost, deletePost, editPost, upvoteDownvotePost, viewPost } from '../controllers/post.controller.js';

const router = express.Router({mergeParams: true});

//create a post under a subreddit
router.post('/new', 
    authenticateUser, 
    validatePost, 
    catchAsyncError(createPost));

router.route('/comments/:id')
    //view a single post
    .get(validateParameterAndPostLinkage, 
        catchAsyncError(viewPost))
    //update post
    .patch(authenticateUser, 
        validateParameterAndPostLinkage, 
        isPostAuthor, 
        catchAsyncError(editPost))
    //delete post
    .delete(authenticateUser, 
        validateParameterAndPostLinkage, 
        isPostAuthor, 
        catchAsyncError(deletePost));

//downvote/upvote a post
router.post('/comments/:id/vote', 
    authenticateUser, 
    validateParameterAndPostLinkage, 
    catchAsyncError(upvoteDownvotePost));

export default router;