import {ErrorResponse} from "../dto/error.response.ts";

export class AppError extends Error {

    private _errorResponse: ErrorResponse;
    private _status: number;

    constructor(errorResponse: ErrorResponse, status: number) {
        super();
        this._errorResponse = errorResponse;
        this._status = status;
    }


    get errorResponse(): ErrorResponse {
        return this._errorResponse;
    }

    get status(): number {
        return this._status;
    }
}