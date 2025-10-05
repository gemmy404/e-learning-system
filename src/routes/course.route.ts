import express from 'express';
import * as courseController from '../controllers/course.controller';
import {enrollCourseValidations, paginateValidations} from '../middlwares/validationSchema';
import {verifyToken} from "../middlwares/verifyToken.ts";
import {addPageInfo} from "../middlwares/addPageInfo.ts";
import {checkValidationErrors} from "../middlwares/checkValidationErrors.ts";

export const router = express.Router();

router.route('/')
    .get(paginateValidations, checkValidationErrors, addPageInfo, courseController.getAllCourses);

router.route('/search')
    .get(paginateValidations, checkValidationErrors, addPageInfo, courseController.searchCourseByTitle);

router.route('/category')
    .get(paginateValidations, checkValidationErrors, addPageInfo, courseController.filterCourseByCategory);

router.route('/:id')
    .get(courseController.getCourseById);

router.route('/:id/enroll')
    .post(verifyToken, enrollCourseValidations, checkValidationErrors,courseController.enrollCourse);
