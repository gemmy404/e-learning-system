import express, {Router} from 'express';
import * as authController from '../controllers/auth.controller.ts';
import {loginValidations, registerValidations} from "../middlwares/validationSchema.ts";

export const router: Router = express.Router();

router.route("/register")
    .post(registerValidations, authController.register);

router.route("/login")
    .post(loginValidations, authController.login);