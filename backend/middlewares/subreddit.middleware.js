import { subredditSchemaValidation } from "../utils/schemaValidations/subreddit.validation.js"
import ExpressError from "../utils/errors/ExpressError.js";

export const validateSubreddit = (req, res, next) => {
    const{error} = subredditSchemaValidation.validate(req.body);
    //TODO: refactor validations to be centralized
    if(error){
        const errorMsg = error.details.map(e => e.message).join(', ');
        throw new ExpressError(errorMsg);
    }
    next(); 
}