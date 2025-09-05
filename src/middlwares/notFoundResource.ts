import {ErrorResponse} from "../dto/error.response.ts";
import {HttpStatus} from "../utils/httpStatusText.ts";
import {Request, Response as ExpressResponse, NextFunction} from "express";

export const notFoundResource = (req: Request, res: ExpressResponse, next: NextFunction) => {
    const errorResponse: ErrorResponse = {
        status: HttpStatus.ERROR,
        message: `This resource '${req.path}' not found`
    }
    return res.status(404).json(errorResponse)
}