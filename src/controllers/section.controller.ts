import {asyncWrapper} from '../middlwares/asyncWrapper';
import {NextFunction, Request, Response as ExpressResponse} from 'express';
import {courseRepository, sectionRepository} from '../repositories/index.repositories.ts';
import {HttpStatus} from "../utils/httpStatusText.ts";
import {AppError} from "../utils/appError.ts";
import {ApiResponse} from "../dto/api.response.ts";
import {SectionResponse} from "../dto/section.response.ts";
import {toSectionResponse} from "../mapper/section.mapper.ts";
import {toPageResponse} from "../mapper/pagination.mapper.ts";

export const createSection = asyncWrapper(
    async (req: Request, res: ExpressResponse, next: NextFunction) => {
        const courseId = req.params.id;
        const {sectionName, orderIndex} = req.body;

        const savedCourse = await courseRepository.findCourseById(courseId);
        if (!savedCourse) {
            const errorResponse: ApiResponse<null> = {
                status: HttpStatus.FAIL,
                message: `Course with id ${courseId} not found`,
                data: null
            };
            const error: AppError = new AppError(errorResponse, 404);
            return next(error);
        }

        const connectedUser = JSON.parse(JSON.stringify(req.connectedUser));
        if (connectedUser.id !== savedCourse.instructorId) {
            const errorResponse: ApiResponse<null> = {
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

        const apiResponse: ApiResponse<SectionResponse> = {
            status: HttpStatus.SUCCESS,
            data: toSectionResponse(createdSection),
        };
        return res.status(201).json(apiResponse);
    }
);

export const getAllSections = asyncWrapper(
    async (req: Request, res: ExpressResponse, next: NextFunction) => {
        const {size, page} = req.pageInfo || {size: 8, page: 1};
        const skip: number = (page - 1) * size;

        const courseId = req.params.id;

        const savedCourse = await courseRepository.findCourseById(courseId);
        if (!savedCourse) {
            const errorResponse: ApiResponse<null> = {
                status: HttpStatus.FAIL,
                message: `Course with id ${courseId} not found`,
                data: null
            };
            const error: AppError = new AppError(errorResponse, 404);
            return next(error);
        }

        const connectedUser = JSON.parse(JSON.stringify(req.connectedUser));
        if (connectedUser.id !== savedCourse.instructorId) {
            const errorResponse: ApiResponse<null> = {
                status: HttpStatus.FAIL,
                message: "You are not authorized to perform this operation",
                data: null
            };
            const error: AppError = new AppError(errorResponse, 403);
            return next(error);
        }

        const {sections, counts} = await sectionRepository.findAllSectionsByCourseId(size, skip, courseId);

        const apiResponse: ApiResponse<SectionResponse[]> = {
            status: HttpStatus.SUCCESS,
            data: sections.map(toSectionResponse),
            pageInfo: toPageResponse(size, page, counts),
        };
        return res.status(200).json(apiResponse);
    }
);

export const updateSection = asyncWrapper(
    async (req: Request, res: ExpressResponse, next: NextFunction) => {
        const sectionId = req.params.id;

        const savedSection = await sectionRepository.findSectionById(sectionId);
        if (!savedSection) {
            const errorResponse: ApiResponse<null> = {
                status: HttpStatus.FAIL,
                message: `Section with id ${sectionId} not found`,
                data: null
            }
            const error: AppError = new AppError(errorResponse, 404);
            return next(error);
        }

        const connectedUser = JSON.parse(JSON.stringify(req.connectedUser));
        if (connectedUser.id !== savedSection.course.instructorId) {
            const errorResponse: ApiResponse<null> = {
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

        const apiResponse: ApiResponse<SectionResponse> = {
            status: HttpStatus.SUCCESS,
            data: toSectionResponse(updatedSection),
        };
        return res.status(200).json(apiResponse);
    }
);

export const deleteSection = asyncWrapper(
    async (req: Request, res: ExpressResponse, next: NextFunction) => {
        const sectionId = req.params.id;

        const savedSection = await sectionRepository.findSectionById(sectionId);
        if (!savedSection) {
            const errorResponse: ApiResponse<null> = {
                status: HttpStatus.FAIL,
                message: `Section with id ${sectionId} not found`,
                data: null
            }
            const error: AppError = new AppError(errorResponse, 404);
            return next(error);
        }

        const connectedUser = JSON.parse(JSON.stringify(req.connectedUser));
        if (connectedUser.id !== savedSection.course.instructorId) {
            const errorResponse: ApiResponse<null> = {
                status: HttpStatus.FAIL,
                message: "You are not authorized to perform this operation",
                data: null
            };
            const error: AppError = new AppError(errorResponse, 403);
            return next(error);
        }

        const deletedSection = await sectionRepository.deleteSection(sectionId);

        const apiResponse: ApiResponse<null> = {
            status: HttpStatus.SUCCESS,
            data: null,
        };
        return res.status(200).json(apiResponse);
    }
);