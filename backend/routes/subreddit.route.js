import express from 'express';
import { authenticateUser } from '../middlewares/auth.middleware.js';
import { catchAsyncError } from '../utils/errors/catchAsyncError.js';
import { createSubreddit } from '../controllers/subreddit.controller.js';
import { validateSubreddit } from '../middlewares/subreddit.middleware.js';

const router = express.Router();

//view a subreddit
// router.get('/:subreddit', viewSubreddit); 
//create a subreddit in server
router.post('/', 
    authenticateUser,
    validateSubreddit, 
    catchAsyncError(createSubreddit));
//delete a subreddit
// router.delete('/:subreddit', deleteSubreddit);
//update a subreddit
// router.patch('/:subreddit', updateSubreddit);
    

export default router;