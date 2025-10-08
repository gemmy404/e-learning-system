import {NextFunction, Request, Response as ExpressResponse} from 'express';
import {validationResult} from "express-validator";
import {HttpStatus} from "../utils/httpStatusText.ts";
import {AppError} from "../utils/appError.ts";
import {ApiResponse} from "../dto/api.response.ts";

export const checkValidationErrors = (req: Request, res: ExpressResponse, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorResponse: ApiResponse<null> = {
            status: HttpStatus.FAIL,
            validationErrors: errors.array(),
            data: null,
        };

        return next(new AppError(errorResponse, 400));
    }
    next();
};