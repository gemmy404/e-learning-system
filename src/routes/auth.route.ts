import express, {Router} from 'express';
import * as authController from '../controllers/auth.controller.ts';
import {
    forgotPasswordValidations,
    loginValidations,
    registerValidations, resetPasswordValidations,
    verifyCodeValidations
} from "../middlwares/validationSchema.ts";
import {checkValidationErrors} from "../middlwares/checkValidationErrors.ts";

export const router: Router = express.Router();

router.route("/register")
    .post(registerValidations, checkValidationErrors, authController.register);

router.route("/login")
    .post(loginValidations, checkValidationErrors, authController.login);

router.route('/forgot-password')
    .post(forgotPasswordValidations, checkValidationErrors, authController.forgotPassword);

router.route('/verify-code')
    .post(verifyCodeValidations, checkValidationErrors, authController.verifyResetCode);

router.route('/reset-password')
    .patch(resetPasswordValidations, checkValidationErrors, authController.resetPassword);