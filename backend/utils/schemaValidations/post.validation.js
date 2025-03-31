import Joi from "joi";

export const postSchemaValidation = Joi.object({
    text: Joi.string().required(),
    title: Joi.string().required()
})