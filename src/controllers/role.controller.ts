import {asyncWrapper} from "../middlwares/asyncWrapper.ts";
import {NextFunction, Request, Response as ExpressResponse} from "express";
import {roleRepository} from "../repositories/index.repositories.ts";
import {HttpStatus} from "../utils/httpStatusText.ts";
import {AppError} from "../utils/appError.ts";
import {ApiResponse} from "../dto/api.response.ts";
import {UserRole} from "@prisma/client";
import {RoleResponse} from "../dto/role.response.ts";
import {toRoleResponse} from "../mapper/role.mapper.ts";
import {toPageResponse} from "../mapper/pagination.mapper.ts";

export const createRole = asyncWrapper(
    async (req: Request, res: ExpressResponse, next: NextFunction) => {
        const roleName = String(req.body.role).toUpperCase();

        if (!Object.values(UserRole).includes(roleName as UserRole)) {
            const errorResponse: ApiResponse<null> = {
                status: HttpStatus.FAIL,
                message: "User role does not exist in the collection",
                data: null
            };
            const error: AppError = new AppError(errorResponse, 404);
            return next(error);
        }

        if ((await roleRepository.findRoleByName(roleName as UserRole))) {
            const errorResponse: ApiResponse<null> = {
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
        const {size, page} = req.pageInfo || {size: 8, page: 1};
        const skip: number = (page - 1) * size;

        const {roles, counts} = await roleRepository.findAllRoles(size, skip);

        const apiResponse: ApiResponse<RoleResponse[]> = {
            status: HttpStatus.SUCCESS,
            data: roles.map(toRoleResponse),
            pageInfo: toPageResponse(size, page, counts)
        };
        return res.status(200).send(apiResponse);
    }
);