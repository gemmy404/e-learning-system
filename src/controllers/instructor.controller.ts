import {CourseRepository} from '../repositories/course.repository';
import {CategoryRepository} from '../repositories/category.repository';
import {asyncWrapper} from '../middlwares/asyncWrapper';
import {NextFunction, Request, Response as ExpressResponse} from 'express';
import {ErrorResponse} from '../dto/error.response';
import {HttpStatus} from '../utils/httpStatusText';
import {AppError} from '../utils/appError';
import {ApiResponse} from '../dto/api.response';
import {CourseResponse} from '../dto/course.response';
import {toCourse, toCourseResponse} from '../mapper/course.mapper';
import {generateEnrollmentsCodes} from '../utils/generateCodes.ts';
import {CodeRepository} from '../repositories/code.repository';
import {CodeResponse} from '../dto/code.response';
import {toCodeResponse} from '../mapper/code.mapper';
import {prisma} from '../config/dbConnection';

const courseRepository = new CourseRepository(prisma);
const categoryRepository = new CategoryRepository(prisma);
const codeRepository = new CodeRepository(prisma);

export const createCourse = asyncWrapper(
    async (req: Request, res: ExpressResponse, next: NextFunction) => {
        let categoryId = (await categoryRepository.findCategoryByName(req.body.category))?.id;
        if (!categoryId) {
            categoryId = (await categoryRepository.createCategory(req.body.category)).id;
        }

        req.body.categoryId = categoryId;
        req.body.instructorId = JSON.parse((JSON.stringify(req.connectedUser))).id;

        const course = await courseRepository.createCourse(toCourse(req.body, req.file));
        const apiResponse: ApiResponse<{ course: CourseResponse }> = {
            status: HttpStatus.SUCCESS,
            data: {
                course: {
                    id: course.id
                }
            }
        };
        return res.status(201).json(apiResponse)
    }
);

export const getMyCreatedCourses = asyncWrapper(
    async (req: Request, res: ExpressResponse, next: NextFunction) => {
        const {size, page} = req.pageInfo || {size: 8, page: 1};
        const skip: number = (page - 1) * size;

        const connectedUser = JSON.parse((JSON.stringify(req.connectedUser)));

        const courses = await courseRepository.findAllCourses(size, skip, connectedUser.id);

        const apiResponse: ApiResponse<{ courses: CourseResponse[] }> = {
            status: HttpStatus.SUCCESS,
            data: {
                courses: courses.map(toCourseResponse)
            }
        };
        return res.status(200).json(apiResponse);
    }
);

export const updateCourse = asyncWrapper(
    async (req: Request, res: ExpressResponse, next: NextFunction) => {
        const courseId = req.params.id;

        const savedCourse = await courseRepository.findCourseById(courseId);
        if (!savedCourse) {
            const errorResponse: ErrorResponse = {
                status: HttpStatus.FAIL,
                message: `Course with id ${courseId} not found`,
                data: null
            };
            const error: AppError = new AppError(errorResponse, 404);
            return next(error);
        }

        const connectedUserId: string = JSON.parse((JSON.stringify(req.connectedUser))).id
        if (connectedUserId !== savedCourse.instructorId) {
            const errorResponse: ErrorResponse = {
                status: HttpStatus.FAIL,
                message: "You are not authorized to perform this operation",
                data: null
            };
            const error: AppError = new AppError(errorResponse, 403);
            return next(error);
        }

        const updatedCourse = await courseRepository
            .updateCourse(courseId, toCourse(req.body, req.file));

        const apiResponse: ApiResponse<{ course: CourseResponse }> = {
            status: HttpStatus.SUCCESS,
            data: {course: toCourseResponse(updatedCourse)}
        }
        return res.status(200).json(apiResponse);
    }
);

export const deleteCourse = asyncWrapper(
    async (req: Request, res: ExpressResponse, next: NextFunction) => {
        const courseId = req.params.id;

        const savedCourse = await courseRepository.findCourseById(courseId);
        if (!savedCourse) {
            const errorResponse: ErrorResponse = {
                status: HttpStatus.FAIL,
                message: `Course with id ${courseId} not found`,
                data: null
            };
            const error: AppError = new AppError(errorResponse, 404);
            return next(error);
        }

        const connectedUserId: string = JSON.parse((JSON.stringify(req.connectedUser))).id
        if (connectedUserId !== savedCourse.instructorId) {
            const errorResponse: ErrorResponse = {
                status: HttpStatus.FAIL,
                message: "You are not authorized to perform this operation",
                data: null
            };
            const error: AppError = new AppError(errorResponse, 403);
            return next(error);
        }

        await courseRepository.deleteCourse(courseId);

        const apiResponse: ApiResponse<{ course: CourseResponse }> = {
            status: HttpStatus.SUCCESS,
            data: {
                course: {
                    id: courseId
                }
            }
        };
        return res.status(200).json(apiResponse);
    }
);

export const generateEnrollmentCodes = asyncWrapper(
    async (req: Request, res: ExpressResponse, next: NextFunction) => {
        const count: number = req.body.count;
        const expireAt: string = req.body.expireAt;
        const connectedUser = JSON.parse(JSON.stringify(req.connectedUser));

        const codes = [];
        for (let i = 0; i < count; i++) {
            codes.push({
                code: generateEnrollmentsCodes(6),
                expireAt: new Date(expireAt),
                instructorId: connectedUser.id,
            });
        }

        const result = await codeRepository.createCodes(codes);

        const apiResponse: ApiResponse<{ codes: CodeResponse[] }> = {
            status: HttpStatus.SUCCESS,
            data: {
                codes: result.map(toCodeResponse)
            }
        }
        return res.status(201).json(apiResponse);
    }
);

export const getAllCodes = asyncWrapper(
    async (req: Request, res: ExpressResponse, next: NextFunction) => {
        const connectedUser = JSON.parse(JSON.stringify(req.connectedUser));

        const {size, page} = req.pageInfo || {size: 8, page: 1};
        const skip: number = (page - 1) * size;

        const codes = await codeRepository.findAllCodes(connectedUser.id, size, skip);

        const apiResponse: ApiResponse<{ codes: CodeResponse[] }> = {
            status: HttpStatus.SUCCESS,
            data: {
                codes: codes.map(toCodeResponse)
            }
        };
        return res.status(200).json(apiResponse);
    }
);

export const deactivateExpiredCodes = asyncWrapper(
    async (req: Request, res: ExpressResponse, next: NextFunction) => {
        const connectedUser = JSON.parse(JSON.stringify(req.connectedUser));

        const result = await codeRepository.deactivateCode(connectedUser.id)

        const apiResponse: ApiResponse<{ count: number }> = {
            status: HttpStatus.SUCCESS,
            data: result
        };
        return res.status(200).json(apiResponse);
    }
);