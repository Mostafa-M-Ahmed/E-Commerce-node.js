import { ErrorClass } from "../Utils/index.js";

const reqKeys = ["body", "query", "params", "headers", "authUser"];

export const validationMiddleware = (schema) => {
  return async (req, res, next) => {
    try {
      // Initialize validation errors array
      const validationErrors = [];

      for (const key of reqKeys) {
        const validationResult = schema[key]?.validate(req[key], {
          abortEarly: false,
        });

        if (validationResult?.error) {
          validationErrors.push(...validationResult.error.details);
        }
      }

      // If there are validation errors, return the error response with the validation errors
      if (validationErrors.length) {
        return next(new ErrorClass("Validation Error", 400, validationErrors));
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};
