import {asyncWrapper} from '../middlwares/asyncWrapper';
import {NextFunction, Request, Response as ExpressResponse} from 'express';
import {CategoryRepository} from '../repositories/category.repository';
import {Category} from '@prisma/client';
import {HttpStatus} from '../utils/httpStatusText';
import {AppError} from '../utils/appError';
import {ApiResponse} from '../dto/api.response';
import {CategoryResponse} from '../dto/category.response';
import {toCategoryResponse} from '../mapper/category.mapper';
import {prisma} from '../config/dbConnection';

const categoryRepository: CategoryRepository = new CategoryRepository(prisma);

export const getAllCategories = asyncWrapper(
    async (req: Request, res: ExpressResponse, next: NextFunction) => {
        const {size, page} = req.pageInfo || {size: 8, page: 1};
        const skip: number = (page - 1) * size;
        const categories = await categoryRepository.findAllCategories(size, skip);

        const apiResponse: ApiResponse<CategoryResponse[]> = {
            status: HttpStatus.SUCCESS,
            data: categories.map(toCategoryResponse),

        };
        return res.status(200).json(apiResponse);
    }
);

export const getCategoryByName = asyncWrapper(
    async (req: Request, res: ExpressResponse, next: NextFunction) => {
        const categoryName = req.query.name;

        const category: Category | null = await categoryRepository.findCategoryByName(String(categoryName));
        if (!category) {
            const errorResponse: ApiResponse<null> = {
                status: HttpStatus.FAIL,
                message: `Category with name ${categoryName} not found`,
                data: null
            };
            const error: AppError = new AppError(errorResponse, 404);
            return next(error);
        }

        const apiResponse: ApiResponse<CategoryResponse> = {
            status: HttpStatus.SUCCESS,
            data: {
                name: category.name
            },
        };
        return res.status(200).json(apiResponse);
    }
);