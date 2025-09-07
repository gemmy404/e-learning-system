import express from 'express';
import {verifyToken} from "../middlwares/verifyToken.ts";
import {allowTo} from "../middlwares/allowTo.ts";
import {UserRole} from "@prisma/client";
import * as adminController from "../controllers/admin.controller.ts";
import * as roleController from '../controllers/role.controller';
import {paginateValidations, userRoleValidations} from "../middlwares/validationSchema.ts";

export const router = express.Router();

router.route('/roles')
    .get(verifyToken, allowTo(UserRole.ADMIN), paginateValidations, roleController.getAllRoles)
    .post(verifyToken, allowTo(UserRole.ADMIN), userRoleValidations, roleController.createRole);

router.route('/users')
    .get(verifyToken, allowTo(UserRole.ADMIN), paginateValidations, adminController.getUsersByRole);

router.route('/users/search')
    .get(verifyToken, allowTo(UserRole.ADMIN), adminController.getUserByEmail);

router.route('/users/:id/toggle-activation')
    .patch(verifyToken, allowTo(UserRole.ADMIN), adminController.toggleUserActivation);

router.route('/users/:id/role')
    .patch(verifyToken, allowTo(UserRole.ADMIN), userRoleValidations, adminController.changeUserRole);