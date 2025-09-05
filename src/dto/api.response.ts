import {HttpStatus} from "../utils/httpStatusText.ts";

export interface ApiResponse<T> {
    status: HttpStatus;
    data: T;
}