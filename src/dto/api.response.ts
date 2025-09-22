import {HttpStatus} from "../utils/httpStatusText.ts";
import {ValidationError} from "express-validator";
import {PageResponse} from "./page.response.ts";

export interface ApiResponse<T> {
    status: HttpStatus;
    message?: string;
    validationErrors?: ValidationError[];
    data?: T;
    pageInfo?: PageResponse;
}