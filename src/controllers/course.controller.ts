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
import {EnrollmentRepository} from "../repositories/enrollment.repository.ts";
import {CodeRepository} from "../repositories/code.repository.ts";

const courseRepository = new CourseRepository(prisma);
const enrollmentRepository = new EnrollmentRepository(prisma);
const codeRepository = new CodeRepository(prisma);

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

export const enrollCourse = asyncWrapper(
    async (req: AuthenticatedRequest, res: ExpressResponse, next: NextFunction) => {
        const errors: false | AppError = handleValidationErrors(req);
        if (errors) {
            return next(errors);
        }

        const courseId = req.params.id;

        const course = await courseRepository.findCourseById(courseId);
        if (!course) {
            const errorResponse: ErrorResponse = {
                status: HttpStatus.FAIL,
                message: `Course with id ${courseId} not found`,
                data: null
            };
            const error: AppError = new AppError(errorResponse, 404);
            return next(error);
        }

        const connectUser = JSON.parse(JSON.stringify(req.connectedUser));
        if (await enrollmentRepository.findEnrolledCourseByStudentIdAndCourseId(connectUser.id, courseId)) {
            const errorResponse: ErrorResponse = {
                status: HttpStatus.FAIL,
                message: "You already enrolled this course",
                data: null
            };
            const error: AppError = new AppError(errorResponse, 400);
            return next(error);
        }

        const enrollCode = req.body.enrollCode;

        const savedCode = await codeRepository.findCode(enrollCode)
        if (!savedCode) {
            const errorResponse: ErrorResponse = {
                status: HttpStatus.FAIL,
                message: `The code ${enrollCode} that you've entered is incorrect`,
                data: null
            };
            const error: AppError = new AppError(errorResponse, 404);
            return next(error);
        }

        if (savedCode.instructorId !== course.instructorId) {
            const errorResponse: ErrorResponse = {
                status: HttpStatus.FAIL,
                message: "Invalid enrollment code for this course",
                data: null
            };
            const error: AppError = new AppError(errorResponse, 400);
            return next(error);
        }

        if (Date.now() > savedCode.expireAt.getTime() || !savedCode.isValid) {
            const errorResponse: ErrorResponse = {
                status: HttpStatus.FAIL,
                message: `Code ${enrollCode} is not valid`,
                data: null
            };
            const error: AppError = new AppError(errorResponse, 400);
            return next(error);
        }

        const enrollRequest = {
            courseId: courseId,
            userId: connectUser.id,
            enrollmentDate: new Date(),
        };

        const enrolledCourse = await enrollmentRepository.createEnrollment(enrollRequest);

        savedCode.isValid = false;
        savedCode.isUsed = true;
        savedCode.usedAt = new Date();
        savedCode.courseUsedId = course.id;
        savedCode.studentId = connectUser.id;

        await codeRepository.updateCode(savedCode);

        const apiResponse: ApiResponse<{ course: CourseResponse }> = {
            status: HttpStatus.SUCCESS,
            data: {
                course: {
                    id: enrolledCourse.courseId
                }
            }
        };
        return res.status(201).json(apiResponse);
    }
);