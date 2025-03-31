import mongoose from "mongoose";
import { subredditSchemaValidation } from "../utils/schemaValidations/subreddit.validation.js"
import ExpressError from "../utils/errors/ExpressError.js";
import NotFoundEror from "../utils/errors/NotFoundError.js";
import Subreddit from "../models/subreddit.model.js";
import UnauthorizedError from "../utils/errors/UnauthorizedError.js";

export const validateSubreddit = (req, res, next) => {
    const{error} = subredditSchemaValidation.validate(req.body);
    //TODO: refactor validations to be centralized
    if(error){
        const errorMsg = error.details.map(e => e.message).join(', ');
        throw new ExpressError(errorMsg);
    }
    next(); 
}

export const checkParameters = (req, res, next) => {
    const {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)) throw new NotFoundEror("Path not recognized");
    next();
}

export const isSubredditAuthor = async(req, res, next) => {
    const {id} = req.params;
    const subreddit = await Subreddit.findById(id);
    if(!subreddit) return next(new NotFoundEror("Can not find that subreddit"));
    !subreddit.author.equals(req.user._id) ? 
        next(new UnauthorizedError()) : next();
}

