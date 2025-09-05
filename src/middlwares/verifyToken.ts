import type {NextFunction, Response as ExpressResponse} from 'express';
import {AppError} from "../utils/appError.ts";
import {ErrorResponse} from "../dto/error.response.ts";
import {HttpStatus} from "../utils/httpStatusText.ts";
import jwt, {JwtPayload} from "jsonwebtoken";
import {AuthenticatedRequest} from "../types/authenticated-request";

export const verifyToken = (req: AuthenticatedRequest, res: ExpressResponse, next: NextFunction) => {
    const authHeader: string | string[] | undefined = req.headers.authorization || req.headers.Authorization;

    if (!authHeader) {
        const errorResponse: ErrorResponse = {
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
        const errorResponse: ErrorResponse = {
            status: HttpStatus.FAIL,
            message: err.message,
            data: null
        };
        const error: AppError = new AppError(errorResponse, 401);
        return next(error);
    }
}