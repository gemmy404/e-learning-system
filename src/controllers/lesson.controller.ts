import {LessonRepository} from "../repositories/lesson.repository.ts";
import {prisma} from "../config/dbConnection.ts";
import {asyncWrapper} from "../middlwares/asyncWrapper.ts";
import {NextFunction, Request, Response as ExpressResponse} from "express";
import {AppError} from "../utils/appError.ts";
import {SectionRepository} from "../repositories/section.repository.ts";
import {ErrorResponse} from "../dto/error.response.ts";
import {HttpStatus} from "../utils/httpStatusText.ts";
import {ApiResponse} from "../dto/api.response.ts";
import {ContentType} from "@prisma/client";
import {toLesson, toLessonResponse} from "../mapper/lesson.mapper.ts";
import {LessonResponse} from "../dto/lesson.response.ts";

const lessonRepository = new LessonRepository(prisma);
const sectionRepository = new SectionRepository(prisma);

export const createLesson = asyncWrapper(
    async (req: Request, res: ExpressResponse, next: NextFunction) => {
        const sectionId = req.params.id;
        const section = await sectionRepository.findSectionById(sectionId);
        if (!section) {
            const errorResponse: ErrorResponse = {
                status: HttpStatus.FAIL,
                message: `Section with id ${sectionId} not found`,
                data: null
            };
            const error: AppError = new AppError(errorResponse, 404);
            return next(error);
        }

        const connectedUser = JSON.parse(JSON.stringify(req.connectedUser));
        if (connectedUser.id !== section.course.instructorId) {
            const errorResponse: ErrorResponse = {
                status: HttpStatus.FAIL,
                message: "You are not authorized to perform this operation",
                data: null
            };
            const error: AppError = new AppError(errorResponse, 403);
            return next(error);
        }

        const {name, contentType, orderIndex} = req.body;

        if (!Object.values(ContentType).includes(contentType)) {
            const errorResponse: ErrorResponse = {
                status: HttpStatus.FAIL,
                message: "Content type not found",
                data: null
            };
            const error: AppError = new AppError(errorResponse, 404);
            return next(error);
        }

        const lesson = {
            sectionId: sectionId,
            name: name,
            contentType: contentType,
            orderIndex: +orderIndex,
            contentUrl: req.file?.path
        };

        const createdLesson = await lessonRepository.createLesson(lesson);

        const apiResponse: ApiResponse<{ lesson: LessonResponse }> = {
            status: HttpStatus.SUCCESS,
            data: {
                lesson: toLessonResponse(createdLesson)
            }
        };
        return res.status(201).json(apiResponse);
    }
);

export const getAllLessons = asyncWrapper(
    async (req: Request, res: ExpressResponse, next: NextFunction) => {
        const sectionId = req.params.id;
        const section = await sectionRepository.findSectionById(sectionId);
        if (!section) {
            const errorResponse: ErrorResponse = {
                status: HttpStatus.FAIL,
                message: `Section with id ${sectionId} not found`,
                data: null
            };
            const error: AppError = new AppError(errorResponse, 404);
            return next(error);
        }

        const connectedUser = JSON.parse(JSON.stringify(req.connectedUser));
        if (connectedUser.id !== section.course.instructorId) {
            const errorResponse: ErrorResponse = {
                status: HttpStatus.FAIL,
                message: "You are not authorized to perform this operation",
                data: null
            };
            const error: AppError = new AppError(errorResponse, 403);
            return next(error);
        }

        const {size, page} = req.pageInfo || {size: 8, page: 1};
        const skip: number = (page - 1) * size;

        const lessons = await lessonRepository.findAllLessonsBySectionId(size, skip, sectionId);

        const apiResponse: ApiResponse<{ lessons: LessonResponse[] }> = {
            status: HttpStatus.SUCCESS,
            data: {
                lessons: lessons.map(toLessonResponse),
            }
        };
        return res.status(200).json(apiResponse);
    }
);

export const updateLesson = asyncWrapper(
    async (req: Request, res: ExpressResponse, next: NextFunction) => {
        const lessonId = req.params.id;

        const savedLesson = await lessonRepository.findLessonById(lessonId);
        if (!savedLesson) {
            const errorResponse: ErrorResponse = {
                status: HttpStatus.FAIL,
                message: `Lesson with id ${lessonId} not found`,
                data: null
            };
            const error: AppError = new AppError(errorResponse, 404);
            return next(error);
        }

        const connectedUserId: string = JSON.parse((JSON.stringify(req.connectedUser))).id
        if (connectedUserId !== savedLesson.section.course.instructorId) {
            const errorResponse: ErrorResponse = {
                status: HttpStatus.FAIL,
                message: "You are not authorized to perform this operation",
                data: null
            };
            const error: AppError = new AppError(errorResponse, 403);
            return next(error);
        }

        const lessonRequest = toLesson(lessonId, req.body, req.file?.path);

        const updatedLesson = await lessonRepository.updateLesson(lessonRequest);

        const apiResponse: ApiResponse<{ lesson: LessonResponse }> = {
            status: HttpStatus.SUCCESS,
            data: {
                lesson: toLessonResponse(updatedLesson)
            }
        };
        return res.status(200).json(apiResponse);
    }
);

export const deleteLesson = asyncWrapper(
    async (req: Request, res: ExpressResponse, next: NextFunction) => {
        const lessonId = req.params.id;

        const savedLesson = await lessonRepository.findLessonById(lessonId);
        if (!savedLesson) {
            const errorResponse: ErrorResponse = {
                status: HttpStatus.FAIL,
                message: `Lesson with id ${lessonId} not found`,
                data: null
            };
            const error: AppError = new AppError(errorResponse, 404);
            return next(error);
        }

        const connectedUserId: string = JSON.parse((JSON.stringify(req.connectedUser))).id
        if (connectedUserId !== savedLesson.section.course.instructorId) {
            const errorResponse: ErrorResponse = {
                status: HttpStatus.FAIL,
                message: "You are not authorized to perform this operation",
                data: null
            };
            const error: AppError = new AppError(errorResponse, 403);
            return next(error);
        }

        const deletedLesson = await lessonRepository.deleteLesson(lessonId);
        const apiResponse: ApiResponse<{ lesson: LessonResponse }> = {
            status: HttpStatus.SUCCESS,
            data: {
                lesson: toLessonResponse(deletedLesson)
            }
        };
        return res.status(200).json(apiResponse);
    }
);