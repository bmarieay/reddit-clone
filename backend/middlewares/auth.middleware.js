import jwt from "jsonwebtoken";

import User from "../models/user.model.js";
import { userSchemaLoginValidation, userSchemaSignUpValidation } from "../utils/schemaValidations/user.validation.js";
import ExpressError from "../utils/errors/ExpressError.js";
import NotFoundEror from "../utils/errors/NotFoundError.js";
import UnauthorizedError from "../utils/errors/UnauthorizedError.js";


//protects the routes
export const authenticateUser = async(req, res, next) => {
    const token = req.cookies._kt;
    if(!token) return next(new UnauthorizedError("No valid token"));

    const isValidToken = jwt.verify(token, process.env.JWT_SECRET);
    if(!isValidToken) return next(new UnauthorizedError("No valid token"));

    const user = await User.findById(isValidToken.userId).select("-password")
    if(!user) return next(new NotFoundEror("User can't be found"));
    req.user = user;

    next();
}


export const validateuserBasedOnPath = path => {
    return (req, res, next) => {
        let error = {}; 
        if(path === '/signup'){
            ;({error} = userSchemaSignUpValidation.validate(req.body))
        } else if(path === '/login'){
            ;({error} = userSchemaSignUpValidation.validate(req.body))
        }
 
        if(error){
            const errorMsg = error.details.map(e => e.message).join(', ');
            throw new ExpressError(errorMsg);
        }
        next(); 
    }
}