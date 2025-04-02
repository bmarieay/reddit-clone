import Joi from "joi";

export const commentSchemaValidation = Joi.object({
    text: Joi.string().required()
})