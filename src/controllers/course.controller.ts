import {NextFunction, Response as ExpressResponse} from 'express';
import {asyncWrapper} from '../middlwares/asyncWrapper';
import {AppError} from '../utils/appError';
import {ErrorResponse} from '../dto/error.response';
import {HttpStatus} from '../utils/httpStatusText';
import {CourseRepository} from '../repositories/course.repository';
import {AuthenticatedRequest} from '../types/authenticated-request';
import {CourseResponse} from '../dto/course.response';
import {ApiResponse} from '../dto/api.response';
import {toCourseResponse} from '../mapper/course.mapper';
import {prisma} from "../config/dbConnection.ts";
import {handleValidationErrors} from "../utils/handleValidationErrors.ts";

const courseRepository = new CourseRepository(prisma);

export const getAllCourses = asyncWrapper(
    async (req: AuthenticatedRequest, res: ExpressResponse, next: NextFunction) => {
        const errors: false | AppError = handleValidationErrors(req);
        if (errors) {
            return next(errors);
        }

        const queryParams = req.query;

        const size: number = Number(queryParams.size) || 8;
        const page: number = Number(queryParams.page) || 1;
        const skip = (page - 1) * size;

        const courses = await courseRepository.findAllCourses(size, skip);

        const apiResponse: ApiResponse<{ courses: CourseResponse[] }> = {
            status: HttpStatus.SUCCESS,
            data: {
                courses: courses.map(toCourseResponse)
            },
        }
        return res.status(200).json(apiResponse);
    }
);

export const getCourseById = asyncWrapper(
    async (req: AuthenticatedRequest, res: ExpressResponse, next: NextFunction) => {
        const courseId = req.params.id;

        const course = await courseRepository.findCourseById(courseId);
        if (!course) {
            const errorResponse: ErrorResponse = {
                status: HttpStatus.FAIL,
                message: `Course with id ${courseId} not found`,
                data: null
            }
            const error: AppError = new AppError(errorResponse, 404);
            return next(error);
        }

        const apiResponse: ApiResponse<{ course: CourseResponse }> = {
            status: HttpStatus.SUCCESS,
            data: {course: toCourseResponse(course)}
        }
        return res.status(200).json(apiResponse);
    }
);

export const searchCourseByTitle = asyncWrapper(
    async (req: AuthenticatedRequest, res: ExpressResponse, next: NextFunction) => {
        const errors: false | AppError = handleValidationErrors(req);
        if (errors) {
            return next(errors);
        }

        const queryParams = req.query;

        const courseTitle = queryParams.title
        if (!courseTitle) {
            const errorResponse: ErrorResponse = {
                status: HttpStatus.FAIL,
                message: "Please enter course name",
                data: null
            };
            const error: AppError = new AppError(errorResponse, 400);
            return next(error);
        }

        const size: number = Number(queryParams.size) || 8;
        const page: number = Number(queryParams.page) || 1;
        const skip = (page - 1) * size;

        const courses = await courseRepository.findCoursesByTitle(String(courseTitle), size, skip);

        const apiResponse: ApiResponse<{ courses: CourseResponse[] }> = {
            status: HttpStatus.SUCCESS,
            data: {
                courses: courses.map(toCourseResponse)
            }
        };
        return res.status(200).json(apiResponse);
    }
);

export const filterCourseByCategory = asyncWrapper(
    async (req: AuthenticatedRequest, res: ExpressResponse, next: NextFunction) => {
        const errors: false | AppError = handleValidationErrors(req);
        if (errors) {
            return next(errors);
        }

        const queryParams = req.query;

        const category = queryParams.category
        if (!category) {
            const errorResponse: ErrorResponse = {
                status: HttpStatus.FAIL,
                message: "Please enter category name",
                data: null
            };
            const error: AppError = new AppError(errorResponse, 400);
            return next(error);
        }

        const size: number = Number(queryParams.size) || 8;
        const page: number = Number(queryParams.page) || 1;
        const skip = (page - 1) * size;

        const courses = await courseRepository.findCoursesByCategory(String(category), size, skip);

        const apiResponse: ApiResponse<{ courses: CourseResponse[] }> = {
            status: HttpStatus.SUCCESS,
            data: {
                courses: courses.map(toCourseResponse)
            }
        };
        return res.status(200).json(apiResponse);
    }
);
