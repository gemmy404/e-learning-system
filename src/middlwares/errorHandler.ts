import {HttpStatus} from "../utils/httpStatusText.ts";
import {AppError} from "../utils/appError.ts";
import type {NextFunction, Request, Response as ExpressResponse} from 'express';
import {ApiResponse} from "../dto/api.response.ts";

export const errorHandler = (err: AppError, req: Request, res: ExpressResponse, next: NextFunction) => {
    const errorResponse: ApiResponse<null> = {
        status: HttpStatus.ERROR,
        message: err.message,
    }
    return res
        .status(err.status || 500)
        .json(err.errorResponse || errorResponse);
}