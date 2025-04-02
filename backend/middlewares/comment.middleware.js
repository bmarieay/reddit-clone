import ExpressError from "../utils/errors/ExpressError.js";
import mongoose from "mongoose";
import NotFoundEror from "../utils/errors/NotFoundError.js";
import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";
import { commentSchemaValidation } from "../utils/schemaValidations/comment.validation.js"
import UnauthorizedError from "../utils/errors/UnauthorizedError.js";

export const validateComment = (req, res, next) => {
    const {error} = commentSchemaValidation.validate(req.body);
    if(error){
        const errorMsg = error.details.map(e => e.message).join(', ');
        // throw new ExpressError(errorMsg);
        return next(new ExpressError(errorMsg));
    }
    next(); 
}

export const validateParamsAndPost = async(req, res, next) => {
    const{id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)) return next(new NotFoundEror("Path not recognized"));
    const post = await Post.findById(id);
    if(!post) return next(new NotFoundEror('Post does not exist'));
    next();
}

export const validateParamsAndComment = async(req, res, next) => {
    const{commentId} = req.params;
    if(!mongoose.Types.ObjectId.isValid(commentId)) return next(new NotFoundEror("Path not recognized"));
    const comment = await Comment.findById(commentId);
    if(!comment) return next(new NotFoundEror('Comment does not exist'));
    next();
}

export const isCommentator = async(req, res, next) => {
    const userId = req.user._id;
    const comment = await Comment.findById(req.params.commentId);
    if(!comment.commentator.equals(userId)) return next(new UnauthorizedError());
    next();
}