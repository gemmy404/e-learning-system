import type { Request, Response as ExpressResponse, NextFunction } from 'express';
import {AppError} from "../utils/appError.ts";

export const asyncWrapper = (asyncFn: any) => {
    return (req: Request, res: ExpressResponse, next: NextFunction) => {
        asyncFn(req, res, next).catch((err: AppError) => next(err));
    };
};