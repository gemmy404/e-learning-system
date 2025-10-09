import bcrypt from "bcryptjs";
import {generateJwt} from "../utils/generateJwt.ts";
import {asyncWrapper} from "../middlwares/asyncWrapper.ts";
import {LoginResponse} from "../dto/login.response.ts";
import {HttpStatus} from "../utils/httpStatusText.ts";
import {AppError} from "../utils/appError.ts";
import {RegisterResponse} from "../dto/register.response.ts";
import type {NextFunction, Request, Response as ExpressResponse} from 'express';
import {ApiResponse} from "../dto/api.response.ts";
import {generateResetPasswordCode} from "../utils/generateCodes.ts";
import {resetPasswordCodeRepository, roleRepository, userRepository} from "../repositories/index.repositories.ts";
import jwt, {JwtPayload} from "jsonwebtoken";
import {emailSender} from "../utils/emailSender.ts";

export const register = asyncWrapper(
    async (req: Request, res: ExpressResponse, next: NextFunction) => {
        const user = req.body;
        if (await userRepository.findUserByEmail(user.email)) {
            const errorResponse: ApiResponse<null> = {
                status: HttpStatus.FAIL,
                message: "Email already exists, please try another email",
                data: null
            };
            const error: AppError = new AppError(errorResponse, 400);
            return next(error);
        }

        user.password = await bcrypt.hash(user.password, 10);
        const requestedUser = await userRepository.createUser(user);

        const apiResponse: ApiResponse<RegisterResponse> = {
            status: HttpStatus.SUCCESS,
            data: {
                email: requestedUser.email
            },
        };
        return res.status(201).json(apiResponse);
    }
);

export const login = asyncWrapper(
    async (req: Request, res: ExpressResponse, next: NextFunction) => {
        const savedUser = await userRepository.findUserByEmail(req.body.email);
        if (!savedUser) {
            const errorResponse: ApiResponse<null> = {
                status: HttpStatus.FAIL,
                message: "The email that you've entered is incorrect",
                data: null
            };
            const error: AppError = new AppError(errorResponse, 404);
            return next(error);
        }

        const matchedPassword = await bcrypt.compare(req.body.password, savedUser.password);
        if (!matchedPassword) {
            const errorResponse: ApiResponse<null> = {
                status: HttpStatus.FAIL,
                message: "The password that you've entered is incorrect",
                data: null
            };
            const error: AppError = new AppError(errorResponse, 400);
            return next(error);
        }

        if (!savedUser.isActive) {
            const errorResponse: ApiResponse<null> = {
                status: HttpStatus.ERROR,
                message: "Your account is inactive. Please contact support",
                data: null
            };
            const error: AppError = new AppError(errorResponse, 403);
            return next(error);
        }

        const role = await roleRepository.findRoleById(savedUser.roleId);
        const token = generateJwt({id: savedUser.id, email: savedUser.email, role: role?.name}, '30m');
        const apiResponse: ApiResponse<LoginResponse> = {
            status: HttpStatus.SUCCESS,
            data: {token}
        };
        return res.status(200).json(apiResponse);
    }
);

export const forgotPassword = asyncWrapper(
    async (req: Request, res: ExpressResponse, next: NextFunction) => {
        const email = req.body.email;

        const savedUser = await userRepository.findUserByEmail(email);
        if (!savedUser) {
            const errorResponse: ApiResponse<null> = {
                status: HttpStatus.FAIL,
                message: "User not found",
                data: null
            };
            const error: AppError = new AppError(errorResponse, 404);
            return next(error);
        }

        const codeRequest = generateCodeRequest(savedUser.id, 6);
        await resetPasswordCodeRepository.InvalidateCodes(savedUser.id)
        await resetPasswordCodeRepository.createResetCode(codeRequest);

        await emailSender(savedUser.email, savedUser.name, codeRequest.code);

        const apiResponse: ApiResponse<{ email: string }> = {
            status: HttpStatus.SUCCESS,
            data: {
                email: savedUser.email
            }
        };
        return res.status(200).json(apiResponse);
    }
);

export const verifyResetCode = asyncWrapper(
    async (req: Request, res: ExpressResponse, next: NextFunction) => {
        const {email, code} = req.body;

        const savedCode = await resetPasswordCodeRepository.findByCode(code);
        if (!savedCode) {
            const errorResponse: ApiResponse<null> = {
                status: HttpStatus.FAIL,
                message: `The code ${code} that you've entered is incorrect`,
                data: null
            };
            const error: AppError = new AppError(errorResponse, 404);
            return next(error);
        }

        if (email !== savedCode.user.email) {
            const errorResponse: ApiResponse<null> = {
                status: HttpStatus.FAIL,
                message: "Invalid reset code for this email",
                data: null
            };
            const error: AppError = new AppError(errorResponse, 400);
            return next(error);
        }

        if (savedCode.expireAt.getTime() < Date.now() || !savedCode.isValid) {
            await resetPasswordCodeRepository.InvalidateCodes(savedCode.user.id);
            const errorResponse: ApiResponse<null> = {
                status: HttpStatus.FAIL,
                message: "The code is expired, a new code has been sent to your email",
                data: null
            };
            const error: AppError = new AppError(errorResponse, 400);
            const codeRequest = generateCodeRequest(savedCode.user.id, 6);
            await resetPasswordCodeRepository.createResetCode(codeRequest);
            await emailSender(savedCode.user.email, savedCode.user.name, codeRequest.code);

            return next(error);
        }

        await resetPasswordCodeRepository.InvalidateCodes(savedCode.user.id);
        const token = generateJwt({id: savedCode.user.id, email}, '5m');

        const apiResponse: ApiResponse<{ token: string }> = {
            status: HttpStatus.SUCCESS,
            data: {token}
        };
        return res.status(200).json(apiResponse);
    }
);

export const resetPassword = asyncWrapper(
    async (req: Request, res: ExpressResponse, next: NextFunction) => {
        const {token, newPassword, confirmNewPassword} = req.body;

        if (newPassword !== confirmNewPassword) {
            const errorResponse: ApiResponse<null> = {
                status: HttpStatus.FAIL,
                message: "Passwords do not match",
                data: null
            };
            const error: AppError = new AppError(errorResponse, 400);
            return next(error);
        }

        const user: string | JwtPayload = jwt.verify(token, process.env.JWT_SECRET_KEY!);
        const userId: string = JSON.parse(JSON.stringify(user)).id;

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await userRepository.changeUserPassword(userId, hashedPassword);

        const apiResponse: ApiResponse<{ id: string }> = {
            status: HttpStatus.SUCCESS,
            data: {
                id: userId
            }
        };
        return res.status(200).json(apiResponse);
    }
);

const generateCodeRequest = (userId: string, length: number) => {
    const code = generateResetPasswordCode(length);

    const expireAt = new Date();
    const currentMinutes = expireAt.getMinutes();
    expireAt.setMinutes(currentMinutes + 5);

    return {code, userId, expireAt};
}