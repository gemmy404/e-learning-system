import express from 'express';
import * as adminController from "../controllers/admin.controller.ts";
import * as roleController from '../controllers/role.controller';
import {paginateValidations, userRoleValidations} from "../middlwares/validationSchema.ts";

export const router = express.Router();

router.route('/roles')
    .get(paginateValidations, roleController.getAllRoles)
    .post(userRoleValidations, roleController.createRole);

router.route('/users')
    .get(paginateValidations, adminController.getUsersByRole);

router.route('/users/search')
    .get(adminController.getUserByEmail);

router.route('/users/:id/toggle-activation')
    .patch(adminController.toggleUserActivation);

router.route('/users/:id/role')
    .patch(userRoleValidations, adminController.changeUserRole);