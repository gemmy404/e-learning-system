import {NextFunction, Request, Response as ExpressResponse} from 'express';
import {HttpStatus} from "../utils/httpStatusText.ts";
import {AppError} from "../utils/appError.ts";
import {ApiResponse} from "../dto/api.response.ts";

export const allowTo = (...roles: string[]) => {
    return (req: Request, res: ExpressResponse, next: NextFunction) => {
        const userRole: string = JSON.parse((JSON.stringify(req.connectedUser))).role;
        if (!roles.includes(userRole)) {
            const errorResponse: ApiResponse<null> = {
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