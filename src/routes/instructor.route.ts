import express from 'express';
import {verifyToken} from "../middlwares/verifyToken.ts";
import {allowTo} from "../middlwares/allowTo.ts";
import {upload} from "../utils/uploadFile.ts";
import * as instructorController from '../controllers/instructor.controller';
import {
    createCourseValidations,
    enrollmentCodeValidations,
    paginateValidations,
    updateCourseValidations
} from "../middlwares/validationSchema.ts";
import {UserRole} from "@prisma/client";

export const router = express.Router();

// Courses
router.route('/courses')
    .post(
        verifyToken,
        allowTo(UserRole.INSTRUCTOR),
        upload('course/cover').single('thumbnail'),
        createCourseValidations,
        instructorController.createCourse
    );

router.route('/courses/my')
    .get(verifyToken, allowTo(UserRole.INSTRUCTOR), paginateValidations, instructorController.getMyCreatedCourses);

router.route('/courses/enrollment-codes')
    .get(verifyToken, allowTo(UserRole.INSTRUCTOR), paginateValidations, instructorController.getAllCodes)
    .post(verifyToken, allowTo(UserRole.INSTRUCTOR), enrollmentCodeValidations, instructorController.generateEnrollmentCodes)
    .patch(verifyToken, allowTo(UserRole.INSTRUCTOR), instructorController.deactivateExpiredCodes);

router.route('/courses/:id')
    .patch(
        verifyToken,
        allowTo(UserRole.INSTRUCTOR),
        upload('course/cover').single('thumbnail'),
        updateCourseValidations,
        instructorController.updateCourse
    )
    .delete(verifyToken, allowTo(UserRole.INSTRUCTOR), instructorController.deleteCourse);