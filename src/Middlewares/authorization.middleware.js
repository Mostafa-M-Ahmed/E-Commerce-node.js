import {ErrorClass} from '../Utils/index.js';

export const authorizationMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        // loggedIn role
        const { role } = req.authUser;
        // allowed role
        if (!allowedRoles.includes(role)) {
            return next(new ErrorClass("Unauthorized", 401));
        }

        next();
    };
};