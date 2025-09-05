import {ValidationError} from "express-validator";
import {HttpStatus} from "../utils/httpStatusText.ts";

export interface ErrorResponse {
    status: HttpStatus;
    message?: string;
    validationErrors?: ValidationError[];
    data?: {} | null;
}