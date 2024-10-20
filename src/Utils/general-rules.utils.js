import Joi from "joi"
import mongoose from "mongoose"

const objectIdValidation = (value, helper) => {
    const isValid = mongoose.isValidObjectId(value)
    if (!isValid) {
        return helper.message("Invalid Object Id")
    }
    return value
}

export const generalRules = {
    // _id: Joi.string().custom(objectIdValidation)
    _id: Joi.custom(objectIdValidation)
}