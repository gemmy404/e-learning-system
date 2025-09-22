import express from 'express';
import * as userController from '../controllers/user.controller'
import {upload} from "../utils/uploadFile.ts";
import {changePasswordValidations, paginateValidations} from "../middlwares/validationSchema.ts";
import {checkValidationErrors} from "../middlwares/checkValidationErrors.ts";
import {addPageInfo} from "../middlwares/addPageInfo.ts";

export const router = express.Router();

router.route('/profile')
    .get(userController.getUserProfile)
    .patch(upload('profile-user').single('profilePictureUrl'), userController.updateUserProfile);

router.route('/change-password')
    .patch(changePasswordValidations, checkValidationErrors, userController.changePassword);

router.route('/me/enrollments')
    .get(paginateValidations, checkValidationErrors, addPageInfo, userController.getMyEnrollmentCourses);