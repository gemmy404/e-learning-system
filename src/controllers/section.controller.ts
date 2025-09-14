import {CourseRepository} from '../repositories/course.repository';
import {AuthenticatedRequest} from '../types/authenticated-request';
import {asyncWrapper} from '../middlwares/asyncWrapper';
import {NextFunction, Response as ExpressResponse} from 'express';
import {SectionRepository} from '../repositories/section.repository';
import {ErrorResponse} from "../dto/error.response.ts";
import {HttpStatus} from "../utils/httpStatusText.ts";
import {AppError} from "../utils/appError.ts";
import {ApiResponse} from "../dto/api.response.ts";
import {SectionResponse} from "../dto/section.response.ts";
import {toSectionResponse} from "../mapper/section.mapper.ts";
import {handleValidationErrors} from "../utils/handleValidationErrors.ts";
import {prisma} from "../config/dbConnection.ts";

const courseRepository = new CourseRepository(prisma);
const sectionRepository = new SectionRepository(prisma);

export const createSection = asyncWrapper(
    async (req: AuthenticatedRequest, res: ExpressResponse, next: NextFunction) => {
        const error: false | AppError = handleValidationErrors(req);
        if (error) {
            return next(error);
        }

        const courseId = req.params.id;
        const {sectionName, orderIndex} = req.body;

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

        const connectedUser = JSON.parse(JSON.stringify(req.connectedUser));
        if (connectedUser.id !== savedCourse.instructorId) {
            const errorResponse: ErrorResponse = {
                status: HttpStatus.FAIL,
                message: "You are not authorized to perform this operation",
                data: null
            };
            const error: AppError = new AppError(errorResponse, 403);
            return next(error);
        }

        const sectionRequest = {
            sectionName: sectionName,
            orderIndex: orderIndex,
            courseId: courseId
        };

        const createdSection = await sectionRepository.createSection(sectionRequest);

        const apiResponse: ApiResponse<{ section: SectionResponse }> = {
            status: HttpStatus.SUCCESS,
            data: {
                section: toSectionResponse(createdSection)
            }
        };
        return res.status(201).json(apiResponse);
    }
);

export const getAllSections = asyncWrapper(
    async (req: AuthenticatedRequest, res: ExpressResponse, next: NextFunction) => {
        const error: false | AppError = handleValidationErrors(req);
        if (error) {
            return next(error);
        }

        const queryParams = req.query;

        const size: number = Number(queryParams.size) || 8;
        const page: number = Number(queryParams.page) || 1;
        const skip = (page - 1) * size;

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

        const connectedUser = JSON.parse(JSON.stringify(req.connectedUser));
        if (connectedUser.id !== savedCourse.instructorId) {
            const errorResponse: ErrorResponse = {
                status: HttpStatus.FAIL,
                message: "You are not authorized to perform this operation",
                data: null
            };
            const error: AppError = new AppError(errorResponse, 403);
            return next(error);
        }

        const sections = await sectionRepository.findAllSectionsByCourseId(size, skip, courseId);

        const apiResponse: ApiResponse<{ sections: SectionResponse[] }> = {
            status: HttpStatus.SUCCESS,
            data: {
                sections: sections.map(toSectionResponse)
            }
        };
        return res.status(200).json(apiResponse);
    }
);

export const updateSection = asyncWrapper(
    async (req: AuthenticatedRequest, res: ExpressResponse, next: NextFunction) => {
        const error: false | AppError = handleValidationErrors(req);
        if (error) {
            return next(error);
        }

        const sectionId = req.params.id;

        const savedSection = await sectionRepository.findSectionById(sectionId);
        if (!savedSection) {
            const errorResponse: ErrorResponse = {
                status: HttpStatus.FAIL,
                message: `Section with id ${sectionId} not found`,
                data: null
            }
            const error: AppError = new AppError(errorResponse, 404);
            return next(error);
        }

        const connectedUser = JSON.parse(JSON.stringify(req.connectedUser));
        if (connectedUser.id !== savedSection.course.instructorId) {
            const errorResponse: ErrorResponse = {
                status: HttpStatus.FAIL,
                message: "You are not authorized to perform this operation",
                data: null
            };
            const error: AppError = new AppError(errorResponse, 403);
            return next(error);
        }

        const section = {
            id: sectionId,
            ...req.body
        };

        const updatedSection = await sectionRepository.updateSection(section);

        const apiResponse: ApiResponse<{ section: SectionResponse }> = {
            status: HttpStatus.SUCCESS,
            data: {
                section: toSectionResponse(updatedSection)
            }
        };
        return res.status(200).json(apiResponse);
    }
);

export const deleteSection = asyncWrapper(
    async (req: AuthenticatedRequest, res: ExpressResponse, next: NextFunction) => {
        const sectionId = req.params.id;

        const savedSection = await sectionRepository.findSectionById(sectionId);
        if (!savedSection) {
            const errorResponse: ErrorResponse = {
                status: HttpStatus.FAIL,
                message: `Section with id ${sectionId} not found`,
                data: null
            }
            const error: AppError = new AppError(errorResponse, 404);
            return next(error);
        }

        const connectedUser = JSON.parse(JSON.stringify(req.connectedUser));
        if (connectedUser.id !== savedSection.course.instructorId) {
            const errorResponse: ErrorResponse = {
                status: HttpStatus.FAIL,
                message: "You are not authorized to perform this operation",
                data: null
            };
            const error: AppError = new AppError(errorResponse, 403);
            return next(error);
        }

        const deletedSection = await sectionRepository.deleteSection(sectionId);

        const apiResponse: ApiResponse<{ section: SectionResponse }> = {
            status: HttpStatus.SUCCESS,
            data: {
                section: {
                    sectionName: deletedSection.name,
                    orderIndex: deletedSection.orderIndex
                }
            }
        };
        return res.status(200).json(apiResponse);
    }
);