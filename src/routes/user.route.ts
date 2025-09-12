import express from 'express';
import {verifyToken} from "../middlwares/verifyToken";
import * as userController from '../controllers/user.controller'
import {upload} from "../utils/uploadFile.ts";
import {changePasswordValidations, paginateValidations} from "../middlwares/validationSchema.ts";

export const router = express.Router();

router.route('/profile')
    .get(verifyToken, userController.getUserProfile)
    .patch(verifyToken, upload('profile-user').single('profilePictureUrl'), userController.updateUserProfile);

router.route('/change-password')
    .patch(verifyToken, changePasswordValidations, userController.changePassword);

router.route('/me/enrollments')
    .get(verifyToken, paginateValidations, userController.getMyEnrollmentCourses);