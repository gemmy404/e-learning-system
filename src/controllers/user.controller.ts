import {NextFunction, Request, Response as ExpressResponse} from "express";
import {asyncWrapper} from "../middlwares/asyncWrapper.ts";
import {UserRepository} from "../repositories/user.repository.ts";
import {ErrorResponse} from "../dto/error.response.ts";
import {HttpStatus} from "../utils/httpStatusText.ts";
import {AppError} from "../utils/appError.ts";
import {ApiResponse} from "../dto/api.response.ts";
import {UserResponse} from "../dto/user.response.ts";
import {toUserResponse} from "../mapper/user.mapper.ts";
import bcrypt from "bcryptjs";
import {prisma} from "../config/dbConnection.ts";
import {CourseResponse} from "../dto/course.response.ts";
import {toCourseResponse} from "../mapper/course.mapper.ts";
import {EnrollmentRepository} from "../repositories/enrollment.repository.ts";

const userRepository: UserRepository = new UserRepository(prisma);
const enrollmentRepository = new EnrollmentRepository(prisma);

export const getUserProfile = asyncWrapper(
    async (req: Request, res: ExpressResponse, next: NextFunction) => {
        const connectedUser = JSON.parse((JSON.stringify(req.connectedUser)));

        const savedUser = await userRepository.findUserByEmail(connectedUser.email);
        if (!savedUser) {
            const errorResponse: ErrorResponse = {
                status: HttpStatus.FAIL,
                message: "User not found",
                data: null
            };
            const error: AppError = new AppError(errorResponse, 404);
            return next(error);
        }

        const apiResponse: ApiResponse<{ user: UserResponse }> = {
            status: HttpStatus.SUCCESS,
            data: {
                user: toUserResponse(savedUser)
            }
        };
        return res.status(200).json(apiResponse);
    }
);

export const updateUserProfile = asyncWrapper( // need to handle request dto, to prevent pass password
    async (req: Request, res: ExpressResponse, next: NextFunction) => {
        const connectedUser = JSON.parse(JSON.stringify(req.connectedUser));

        const profile = {
            ...req.body,
            profilePictureUrl: req.file?.path
        };

        const savedUser = await userRepository.findUserById(connectedUser.id);
        if (!savedUser) {
            const errorResponse: ErrorResponse = {
                status: HttpStatus.FAIL,
                message: "User not found",
                data: null
            };
            const error: AppError = new AppError(errorResponse, 404);
            return next(error);
        }

        const updatedUser = await userRepository.updateUserProfile(connectedUser.id, profile);

        const apiResponse: ApiResponse<{ user: UserResponse }> = {
            status: HttpStatus.SUCCESS,
            data: {
                user: toUserResponse(updatedUser)
            }
        };
        return res.status(200).json(apiResponse);
    }
);

export const changePassword = asyncWrapper(
    async (req: Request, res: ExpressResponse, next: NextFunction) => {
        const connectedUser = JSON.parse(JSON.stringify(req.connectedUser));
        const {oldPassword, newPassword} = req.body;

        const savedUser = await userRepository.findUserByEmail(connectedUser.email);
        if (!savedUser) {
            const errorResponse: ErrorResponse = {
                status: HttpStatus.FAIL,
                message: "User not found",
                data: null
            };
            const error: AppError = new AppError(errorResponse, 404);
            return next(error);
        }

        const matchedPassword = await bcrypt.compare(oldPassword, savedUser.password);
        if (!matchedPassword) {
            const errorResponse: ErrorResponse = {
                status: HttpStatus.FAIL,
                message: "The old password that you've entered is incorrect",
                data: null
            };
            const error: AppError = new AppError(errorResponse, 400);
            return next(error);
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        const updatedUser = await userRepository.changeUserPassword(connectedUser.id, hashedNewPassword);

        const apiResponse: ApiResponse<{ user: UserResponse }> = {
            status: HttpStatus.SUCCESS,
            data: {
                user: toUserResponse(updatedUser)
            }
        };
        return res.status(200).json(apiResponse);
    }
);

export const getMyEnrollmentCourses = asyncWrapper(
    async (req: Request, res: ExpressResponse, next: NextFunction) => {
        const {size, page} = req.pageInfo || {size: 8, page: 1};
        const skip: number = (page - 1) * size;

        const connectedUser = JSON.parse(JSON.stringify(req.connectedUser));

        const courses = (await enrollmentRepository
            .findAllEnrolledCourseByStudentId(size, skip, connectedUser.id))
            .map(enrollments => enrollments.course);

        const apiResponse: ApiResponse<{ courses: CourseResponse[] }> = {
            status: HttpStatus.SUCCESS,
            data: {
                courses: courses.map(toCourseResponse)
            }
        };
        res.status(200).json(apiResponse);
    }
);