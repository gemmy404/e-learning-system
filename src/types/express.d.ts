import {JwtPayload} from 'jsonwebtoken';
import 'express';

declare module 'express' {
    interface Request {
        connectedUser?: string | JwtPayload;
        pageInfo?: {
            size: number,
            page: number,
        };
    }
}
