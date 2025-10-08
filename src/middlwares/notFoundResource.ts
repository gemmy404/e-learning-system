import {HttpStatus} from "../utils/httpStatusText.ts";
import {NextFunction, Request, Response as ExpressResponse} from "express";
import {ApiResponse} from "../dto/api.response.ts";

export const notFoundResource = (req: Request, res: ExpressResponse, next: NextFunction) => {
    const errorResponse: ApiResponse<null> = {
        status: HttpStatus.ERROR,
        message: `This resource '${req.path}' not found`
    }
    return res.status(404).json(errorResponse)
}