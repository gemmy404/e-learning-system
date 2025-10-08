import {ApiResponse} from "../dto/api.response.ts";

export class AppError extends Error {

    private _errorResponse: ApiResponse<null>;
    private _status: number;

    constructor(errorResponse: ApiResponse<null>, status: number) {
        super();
        this._errorResponse = errorResponse;
        this._status = status;
    }


    get errorResponse(): ApiResponse<null> {
        return this._errorResponse;
    }

    get status(): number {
        return this._status;
    }
}