import mongoose from "mongoose";
import Post from "../models/post.model.js";
import Subreddit from "../models/subreddit.model.js";
import ExpressError from "../utils/errors/ExpressError.js";
import NotFoundEror from "../utils/errors/NotFoundError.js";
import { postSchemaValidation } from "../utils/schemaValidations/post.validation.js";
import UnauthorizedError from "../utils/errors/UnauthorizedError.js";

export const validatePost = async(req, res, next) => {
    const {error} = postSchemaValidation.validate(req.body);
    const {subreddit} = req.params;
    if(error){
        const errorMsg = error.details.map(e => e.message).join(', ');
        return next(new ExpressError(errorMsg));
    }
    const foundSubreddit = await Subreddit.findOne({title: subreddit});
    if(!foundSubreddit) return next(new NotFoundEror(`Subreddit r/${subreddit} does not exist`));
    next(); 
}

export const validateParameterAndPostLinkage = async(req, res, next) => {
    const{subreddit, id} = req.params;
    const foundSubreddit = await Subreddit.findOne({title: subreddit});
    if(!foundSubreddit) return next(new NotFoundEror(`Subreddit r/${subreddit} does not exist`));
    if(!mongoose.Types.ObjectId.isValid(id)) return next(new NotFoundEror("Path not recognized"));
    const foundPost = await Post.findById(id);
    if(!foundPost || !foundPost.subreddit.equals(foundSubreddit._id)) return next(new NotFoundEror('Post does not exist'));
    next();
}

export const isPostAuthor = async(req, res, next) => {
    const post = await Post.findById(req.params.id);
    if(!post.createdBy.equals(req.user._id)) return next(new UnauthorizedError());
    next();
}