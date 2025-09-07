import {AuthenticatedRequest} from "../types/authenticated-request";
import {validationResult} from "express-validator";
import {ErrorResponse} from "../dto/error.response.ts";
import {HttpStatus} from "./httpStatusText.ts";
import {AppError} from "./appError.ts";

export const handleValidationErrors = (req: AuthenticatedRequest) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorResponse: ErrorResponse = {
            status: HttpStatus.FAIL,
            validationErrors: errors.array(),
            data: null
        };

        return new AppError(errorResponse, 400);
    }
    return false;
};