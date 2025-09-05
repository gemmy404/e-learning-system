import {ErrorResponse} from "../dto/error.response.ts";
import {HttpStatus} from "../utils/httpStatusText.ts";
import {AppError} from "../utils/appError.ts";
import type {Request, Response as ExpressResponse, NextFunction} from 'express';

export const errorHandler = (err: AppError, req: Request, res: ExpressResponse, next: NextFunction) => {
    const errorResponse: ErrorResponse = {
        status: HttpStatus.ERROR,
        message: err.message,
    }
    return res
        .status(err.status || 500)
        .json(err.errorResponse || errorResponse);
}