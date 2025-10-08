import type {NextFunction, Request, Response as ExpressResponse} from 'express';
import {AppError} from "../utils/appError.ts";
import {HttpStatus} from "../utils/httpStatusText.ts";
import jwt, {JwtPayload} from "jsonwebtoken";
import {ApiResponse} from "../dto/api.response.ts";

export const verifyToken = (req: Request, res: ExpressResponse, next: NextFunction) => {
    const authHeader: string | string[] | undefined = req.headers.authorization || req.headers.Authorization;

    if (!authHeader) {
        const errorResponse: ApiResponse<null> = {
            status: HttpStatus.FAIL,
            message: "Token is required",
            data: null
        };
        const error: AppError = new AppError(errorResponse, 401);
        return next(error);
    }
    let token: string = '';
    if (typeof authHeader === "string") {
        token = authHeader.split(" ")[1];
    }
    try {
        const connectedUser: string | JwtPayload = jwt.verify(token, process.env.JWT_SECRET_KEY!);
        req.connectedUser = connectedUser;
        return next();
    } catch (err: any) {
        const errorResponse: ApiResponse<null> = {
            status: HttpStatus.FAIL,
            message: err.message,
            data: null
        };
        const error: AppError = new AppError(errorResponse, 401);
        return next(error);
    }
}