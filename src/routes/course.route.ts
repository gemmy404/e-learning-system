import express from 'express';
import * as courseController from '../controllers/course.controller';
import {enrollCourseValidations, paginateValidations} from '../middlwares/validationSchema';
import {verifyToken} from "../middlwares/verifyToken.ts";

export const router = express.Router();

router.route('/')
    .get(paginateValidations, courseController.getAllCourses);

router.route('/search')
    .get(paginateValidations, courseController.searchCourseByTitle);

router.route('/category')
    .get(paginateValidations, courseController.filterCourseByCategory);

router.route('/:id')
    .get(courseController.getCourseById);

router.route('/:id/enroll')
    .post(verifyToken, enrollCourseValidations, courseController.enrollCourse);
