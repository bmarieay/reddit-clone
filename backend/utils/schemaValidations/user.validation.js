import Joi from "joi";

//todo: escape html for other fields for security
export const userSchemaSignUpValidation  = Joi.object({
    username: Joi.string().required().min(5).max(10),
    password: Joi.string().min(6).max(30),
    email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .messages({
        "string.pattern.base": "Invalid email",
    })
})

export const userSchemaLoginValidation  = Joi.object({
    username: Joi.string().required().min(5).max(10),
    password: Joi.string().min(6).max(30)  
})