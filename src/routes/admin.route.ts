import express from 'express';
import * as adminController from "../controllers/admin.controller.ts";
import * as roleController from '../controllers/role.controller';
import {paginateValidations, userRoleValidations} from "../middlwares/validationSchema.ts";
import {addPageInfo} from "../middlwares/addPageInfo.ts";
import {checkValidationErrors} from "../middlwares/checkValidationErrors.ts";

export const router = express.Router();

router.route('/roles')
    .get(paginateValidations, checkValidationErrors, addPageInfo, roleController.getAllRoles)
    .post(userRoleValidations, checkValidationErrors, roleController.createRole);

router.route('/users')
    .get(paginateValidations, checkValidationErrors, addPageInfo, adminController.getUsersByRole);

router.route('/users/search')
    .get(adminController.getUserByEmail);

router.route('/users/:id/toggle-activation')
    .patch(adminController.toggleUserActivation);

router.route('/users/:id/role')
    .patch(userRoleValidations, checkValidationErrors, adminController.changeUserRole);