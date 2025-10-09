import {UserRole} from "@prisma/client";
import {asyncWrapper} from "../middlwares/asyncWrapper.ts";
import {NextFunction, Request, Response as ExpressResponse} from "express";
import {HttpStatus} from "../utils/httpStatusText.ts";
import {AppError} from "../utils/appError.ts";
import {ApiResponse} from "../dto/api.response.ts";
import {UserResponse} from "../dto/user.response.ts";
import {toUserResponse} from "../mapper/user.mapper.ts";
import {roleRepository, userRepository} from "../repositories/index.repositories.ts";
import {toPageResponse} from "../mapper/pagination.mapper.ts";

export const getUsersByRole = asyncWrapper(
    async (req: Request, res: ExpressResponse, next: NextFunction) => {
        const userRole = String(req.query.role).toUpperCase();
        if (!Object.values(UserRole).includes(userRole as UserRole)) {
            const errorResponse: ApiResponse<null> = {
                status: HttpStatus.FAIL,
                message: "User role not found",
                data: null
            };
            const error: AppError = new AppError(errorResponse, 404);
            return next(error);
        }

        const {size, page} = req.pageInfo || {size: 8, page: 1};
        const skip: number = (page - 1) * size;

        const {users, counts} = await userRepository.findUsersByRole(userRole as UserRole, size, skip);

        const apiResponse: ApiResponse<UserResponse[]> = {
            status: HttpStatus.SUCCESS,
            data: users.map(toUserResponse),
            pageInfo: toPageResponse(size, page, counts),
        };
        return res.status(200).json(apiResponse);
    }
);

export const getUserByEmail = asyncWrapper(
    async (req: Request, res: ExpressResponse, next: NextFunction) => {
        const savedUser = await userRepository.findUserByEmail(String(req.query.email));
        if (!savedUser) {
            const errorResponse: ApiResponse<null> = {
                status: HttpStatus.FAIL,
                message: "User not found",
                data: null
            };
            const error: AppError = new AppError(errorResponse, 404);
            return next(error);
        }

        const apiResponse: ApiResponse<UserResponse> = {
            status: HttpStatus.SUCCESS,
            data: toUserResponse(savedUser)

        };
        return res.status(200).json(apiResponse);
    }
);

export const changeUserRole = asyncWrapper(
    async (req: Request, res: ExpressResponse, next: NextFunction) => {
        const newRole = String(req.body.role).toUpperCase();

        if (!Object.values(UserRole).includes(newRole as UserRole)) {
            const errorResponse: ApiResponse<null> = {
                status: HttpStatus.FAIL,
                message: "User role not found",
                data: null
            };
            const error: AppError = new AppError(errorResponse, 404);
            return next(error);
        }
        const roleId = (await roleRepository.findRoleByName(newRole as UserRole))?.id || '';

        const user = await userRepository.findUserById(String(req.params.id));

        if (!user) {
            const errorResponse: ApiResponse<null> = {
                status: HttpStatus.FAIL,
                message: "User not found",
                data: null
            };
            const error: AppError = new AppError(errorResponse, 404);
            return next(error);
        }

        const connectedUser = JSON.parse(JSON.stringify(req.connectedUser));
        if (connectedUser.id === user.id) {
            const errorResponse: ApiResponse<null> = {
                status: HttpStatus.FAIL,
                message: "You cannot change role your own account"
            };
            const error: AppError = new AppError(errorResponse, 403);
            return next(error);
        }

        const updatedUser = await userRepository.changeUserRole(user.id, roleId);

        const apiResponse: ApiResponse<UserResponse> = {
            status: HttpStatus.SUCCESS,
            data: toUserResponse(updatedUser)

        };
        return res.status(200).json(apiResponse);
    }
);

export const toggleUserActivation = asyncWrapper(
    async (req: Request, res: ExpressResponse, next: NextFunction) => {
        const userId = req.params.id;

        const savedUser = await userRepository.findUserById(userId);
        if (!savedUser) {
            const errorResponse: ApiResponse<null> = {
                status: HttpStatus.FAIL,
                message: "User not found",
                data: null
            };
            const error: AppError = new AppError(errorResponse, 404);
            return next(error);
        }

        const connectedUser = JSON.parse(JSON.stringify(req.connectedUser));
        if (connectedUser.id === userId) {
            const errorResponse: ApiResponse<null> = {
                status: HttpStatus.ERROR,
                message: "You cannot deactivate your own account",
                data: null
            };
            const error: AppError = new AppError(errorResponse, 403);
            return next(error);
        }

        const updatedUser = await userRepository.updateUserProfile(userId, {isActive: !savedUser.isActive});

        const apiResponse: ApiResponse<UserResponse> = {
            status: HttpStatus.SUCCESS,
            data: toUserResponse(updatedUser)

        };
        return res.status(200).json(apiResponse);
    }
);