import Post from "../models/post.model.js";
import Subreddit from "../models/subreddit.model.js";
import ExpressError from "../utils/errors/ExpressError.js";
import NotFoundEror from "../utils/errors/NotFoundError.js";
import { postSchemaValidation } from "../utils/schemaValidations/post.validation.js";

export const validatePost = async(req, res, next) => {
    const {error} = postSchemaValidation.validate(req.body);
    console.log(req.params);
    const {subreddit} = req.params;
    // console.log(error);
    if(error){
        const errorMsg = error.details.map(e => e.message).join(', ');
        return next(new ExpressError(errorMsg));
    }
    const foundSubreddit = await Subreddit.findOne({title: subreddit});
    if(!foundSubreddit) return next(new NotFoundEror(`Subreddit r/${subreddit} does not exist`));
    next(); 
}