import bcrypt from "bcryptjs";
import {UserRepository} from "../repositories/user.repository.ts";
import {generateJwt} from "../utils/generateJwt.ts";
import {asyncWrapper} from "../middlwares/asyncWrapper.ts";
import {LoginResponse} from "../dto/login.response.ts";
import {HttpStatus} from "../utils/httpStatusText.ts";
import {ErrorResponse} from "../dto/error.response.ts";
import {AppError} from "../utils/appError.ts";
import {RegisterResponse} from "../dto/register.response.ts";
import {validationResult} from "express-validator";
import {RoleRepository} from "../repositories/role.repository.ts";
import type {NextFunction, Request, Response as ExpressResponse} from 'express';
import {ApiResponse} from "../dto/api.response.ts";
import {prisma} from "../config/dbConnection.ts";
import {handleValidationErrors} from "../utils/handleValidationErrors.ts";

const userRepository = new UserRepository(prisma);
const roleRepository = new RoleRepository(prisma);

export const register = asyncWrapper(
    async (req: Request, res: ExpressResponse, next: NextFunction) => {
        const errors: false | AppError = handleValidationErrors(req);
        if (errors) {
            return next(errors);
        }

        const user = req.body;
        if (await userRepository.findUserByEmail(user.email)) {
            const errorResponse: ErrorResponse = {
                status: HttpStatus.FAIL,
                message: "Email already exists, please try another email",
                data: null
            };
            const error: AppError = new AppError(errorResponse, 400);
            return next(error);
        }

        user.password = await bcrypt.hash(user.password, 10);
        const requestedUser = await userRepository.createUser(user);

        const apiResponse: ApiResponse<{ user: RegisterResponse }> = {
            status: HttpStatus.SUCCESS,
            data: {user: {email: requestedUser.email}}
        };
        return res.status(201).json(apiResponse);
    }
);

export const login = asyncWrapper(
    async (req: Request, res: ExpressResponse, next: NextFunction) => {
        const errors: false | AppError = handleValidationErrors(req);
        if (errors) {
            return next(errors);
        }

        const savedUser = await userRepository.findUserByEmail(req.body.email);
        if (!savedUser) {
            const errorResponse: ErrorResponse = {
                status: HttpStatus.FAIL,
                message: "The email that you've entered is incorrect",
                data: null
            };
            const error: AppError = new AppError(errorResponse, 404);
            return next(error);
        }

        const matchedPassword = await bcrypt.compare(req.body.password, savedUser.password);
        if (!matchedPassword) {
            const errorResponse: ErrorResponse = {
                status: HttpStatus.FAIL,
                message: "The password that you've entered is incorrect",
                data: null
            };
            const error: AppError = new AppError(errorResponse, 400);
            return next(error);
        }

        if (!savedUser.isActive) {
            const errorResponse: ErrorResponse = {
                status: HttpStatus.ERROR,
                message: "Your account is inactive. Please contact support",
                data: null
            };
            const error: AppError = new AppError(errorResponse, 403);
            return next(error);
        }

        const role = await roleRepository.findRoleById(savedUser.roleId);
        const token = await generateJwt({id: savedUser.id, email: savedUser.email, role: role?.name});
        const apiResponse: ApiResponse<LoginResponse> = {
            status: HttpStatus.SUCCESS,
            data: {token}
        };
        return res.status(200).json(apiResponse);
    }
);