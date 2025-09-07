import {asyncWrapper} from "../middlwares/asyncWrapper.ts";
import {NextFunction, Request, Response as ExpressResponse} from "express";
import {RoleRepository} from "../repositories/role.repository.ts";
import {ErrorResponse} from "../dto/error.response.ts";
import {HttpStatus} from "../utils/httpStatusText.ts";
import {AppError} from "../utils/appError.ts";
import {ApiResponse} from "../dto/api.response.ts";
import {prisma} from "../config/dbConnection.ts";
import {UserRole} from "@prisma/client";
import {handleValidationErrors} from "../utils/handleValidationErrors.ts";
import {RoleResponse} from "../dto/role.response.ts";
import {toRoleResponse} from "../mapper/role.mapper.ts";

const roleRepository: RoleRepository = new RoleRepository(prisma);

export const createRole = asyncWrapper(
    async (req: Request, res: ExpressResponse, next: NextFunction) => {
        const errors: false | AppError = handleValidationErrors(req);
        if (errors) {
            return next(errors);
        }

        const roleName = String(req.body.role).toUpperCase();

        if (!Object.values(UserRole).includes(roleName as UserRole)) {
            const errorResponse: ErrorResponse = {
                status: HttpStatus.FAIL,
                message: "User role does not exist in the collection",
                data: null
            };
            const error: AppError = new AppError(errorResponse, 404);
            return next(error);
        }

        if ((await roleRepository.findRoleByName(roleName as UserRole))) {
            const errorResponse: ErrorResponse = {
                status: HttpStatus.FAIL,
                message: `Role ${roleName} already exists`,
                data: null
            };
            const error: AppError = new AppError(errorResponse, 400);
            return next(error);
        }

        const createdRole = await roleRepository.createRole({name: roleName});

        const apiResponse: ApiResponse<{ role: string }> = {
            status: HttpStatus.SUCCESS,
            data: {
                role: createdRole.name,
            }
        };
        return res.status(201).send(apiResponse);
    }
);

export const getAllRoles = asyncWrapper(
    async (req: Request, res: ExpressResponse, next: NextFunction) => {
        const errors: false | AppError = handleValidationErrors(req);
        if (errors) {
            return next(errors);
        }

        const queryParams = req.query;

        const size = Number(req.query.size) || 8;
        const page = Number(req.query.page) || 1;
        const skip = (page - 1) * size;

        const roles = await roleRepository.findAllRoles(size, skip);

        const apiResponse: ApiResponse<{ roles: RoleResponse[] }> = {
            status: HttpStatus.SUCCESS,
            data: {
                roles: roles.map(toRoleResponse)
            }
        };
        return res.status(200).send(apiResponse);
    }
);