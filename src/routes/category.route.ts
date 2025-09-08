import express from 'express';
import * as categoryController from '../controllers/category.controller';
import {paginateValidations} from "../middlwares/validationSchema.ts";

export const router = express.Router();

router.route('/')
    .get(paginateValidations, categoryController.getAllCategories);