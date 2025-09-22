import {Request, Response as ExpressResponse, NextFunction} from 'express';

const DEFAULT_PAGE_SIZE = Number(process.env.DEFAULT_PAGE_SIZE) || 8;
const DEFAULT_PAGE_NUMBER = 1;

export const addPageInfo = (req: Request, res: ExpressResponse, next: NextFunction)=> {
    req.pageInfo = {
        size: Number(req.query.size) || DEFAULT_PAGE_SIZE,
        page: Number(req.query.page) || DEFAULT_PAGE_NUMBER,
    }
    next();
};