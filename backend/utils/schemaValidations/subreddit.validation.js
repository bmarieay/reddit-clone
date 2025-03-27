import Joi from "joi";

export const subredditSchemaValidation = Joi.object({
    title: Joi.string().required().regex(/^\S+$/),
    about: Joi.string().required().min(1),
    visibility: Joi.string().required().valid('public', 'private')
})