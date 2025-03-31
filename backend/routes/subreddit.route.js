import express from 'express';
import { authenticateUser } from '../middlewares/auth.middleware.js';
import { catchAsyncError } from '../utils/errors/catchAsyncError.js';
import { checkParameters, isSubredditAuthor, validateSubreddit } from '../middlewares/subreddit.middleware.js';
import {    createSubreddit, 
            deleteSubreddit, 
            joinUnjoinSubreddit, 
            updateSubreddit, 
            viewSubreddit
        } from '../controllers/subreddit.controller.js';

const router = express.Router();

router.route('/:subreddit')
    //create a subreddit in server
    .get(catchAsyncError(viewSubreddit))
    //join or unjoin a subreddit
    .post(authenticateUser, catchAsyncError(joinUnjoinSubreddit));

//create a subreddit in server
router.post('/', 
    authenticateUser,
    validateSubreddit, 
    catchAsyncError(createSubreddit));

router.route('/:id')
    //delete a subreddit
    .delete(authenticateUser, checkParameters, isSubredditAuthor, catchAsyncError(deleteSubreddit))
    //update a subreddit
    .patch(authenticateUser, isSubredditAuthor, validateSubreddit, checkParameters, catchAsyncError(updateSubreddit));

export default router;