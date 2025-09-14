import express, {Router} from 'express';
import * as authController from '../controllers/auth.controller.ts';
import {
    forgotPasswordValidations,
    loginValidations,
    registerValidations, resetPasswordValidations,
    verifyCodeValidations
} from "../middlwares/validationSchema.ts";

export const router: Router = express.Router();

router.route("/register")
    .post(registerValidations, authController.register);

router.route("/login")
    .post(loginValidations, authController.login);

router.route('/forgot-password')
    .post(forgotPasswordValidations, authController.forgotPassword);

router.route('/verify-code')
    .post(verifyCodeValidations, authController.verifyResetCode);

router.route('/reset-password')
    .patch(resetPasswordValidations, authController.resetPassword);