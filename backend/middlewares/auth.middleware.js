import jwt from "jsonwebtoken";

import User from "../models/user.model.js";
import { userSchemaLoginValidation, userSchemaSignUpValidation } from "../utils/schemaValidations/user.validation.js";

export const authenticateUser = async(req, res, next) => {
    const token = req.cookies._kt;
    if(!token) return res.status(401).json({error: "No token"});

    const isValidToken = jwt.verify(token, process.env.JWT_SECRET);
    if(!isValidToken) return res.status(401).json({error: "No token"});

    const user = await User.findById(isValidToken.userId).select("-password")
    if(!user) return res.status(404).json({error: "User not found"});
    req.user = user;

    next();
}


export const validateuserBasedOnPath = path => {
    return (req, res, next) => {
        //TODO: refactor 
        if(path === '/signup'){
            const {error} = userSchemaSignUpValidation.validate(req.body);
            if(error){
                const errorMsg = error.details.map(e => e.message).join(', ');
                return res.status(400).json({error: errorMsg});
            }
        } else if(path === '/login'){
            const {error} = userSchemaLoginValidation.validate(req.body);
            if(error){
                const errorMsg = error.details.map(e => e.message).join(', ');
                return res.status(400).json({error: errorMsg});
            }
        }
        next(); 
    }
}