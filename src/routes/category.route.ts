import express from 'express';
import * as categoryController from '../controllers/category.controller';
import {paginateValidations} from "../middlwares/validationSchema.ts";
import {addPageInfo} from "../middlwares/addPageInfo.ts";
import {checkValidationErrors} from "../middlwares/checkValidationErrors.ts";

export const router = express.Router();

router.route('/')
    .get(paginateValidations, checkValidationErrors, addPageInfo, categoryController.getAllCategories);