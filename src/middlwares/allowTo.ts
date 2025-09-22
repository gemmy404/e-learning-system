import {Request, NextFunction, Response as ExpressResponse} from 'express';
import {ErrorResponse} from "../dto/error.response.ts";
import {HttpStatus} from "../utils/httpStatusText.ts";
import {AppError} from "../utils/appError.ts";

export const allowTo = (...roles: string[]) => {
    return (req: Request, res: ExpressResponse, next: NextFunction) => {
        const userRole: string = JSON.parse((JSON.stringify(req.connectedUser))).role;
        if (!roles.includes(userRole)) {
            const errorResponse: ErrorResponse = {
                status: HttpStatus.FAIL,
                message: "You don't have permission to access this resource",
                data: null
            };
            const error: AppError = new AppError(errorResponse, 403);
            return next(error);
        }
        next();
    }
};