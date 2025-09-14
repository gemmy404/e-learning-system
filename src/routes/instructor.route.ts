import express from 'express';
import {verifyToken} from "../middlwares/verifyToken.ts";
import {allowTo} from "../middlwares/allowTo.ts";
import {upload} from "../utils/uploadFile.ts";
import * as instructorController from '../controllers/instructor.controller';
import * as sectionController from '../controllers/section.controller';
import * as lessonController from '../controllers/lesson.controller';
import {
    createCourseValidations,
    createLessonValidations,
    createSectionValidations,
    enrollmentCodeGenerationValidations,
    paginateValidations,
    updateCourseValidations,
    updateLessonValidations,
    updateSectionValidations
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
    .post(verifyToken, allowTo(UserRole.INSTRUCTOR), enrollmentCodeGenerationValidations, instructorController.generateEnrollmentCodes)
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

// Sections
router.route('/courses/:id/sections')
    .get(verifyToken, allowTo(UserRole.INSTRUCTOR), paginateValidations, sectionController.getAllSections)
    .post(
        verifyToken,
        allowTo(UserRole.INSTRUCTOR),
        createSectionValidations,
        sectionController.createSection
    );

router.route('/sections/:id')
    .patch(
        verifyToken,
        allowTo(UserRole.INSTRUCTOR),
        updateSectionValidations,
        sectionController.updateSection
    )
    .delete(verifyToken, allowTo(UserRole.INSTRUCTOR), sectionController.deleteSection);

// Lessons
router.route('/sections/:id/lessons')
    .get(verifyToken, allowTo(UserRole.INSTRUCTOR), paginateValidations, lessonController.getAllLessons)
    .post(
        verifyToken,
        allowTo(UserRole.INSTRUCTOR),
        upload('course/content').single('content'),
        createLessonValidations,
        lessonController.createLesson
    );

router.route('/lessons/:id')
    .patch(
        verifyToken,
        allowTo(UserRole.INSTRUCTOR),
        upload('course/content').single('content'),
        updateLessonValidations,
        lessonController.updateLesson
    )
    .delete(verifyToken, allowTo(UserRole.INSTRUCTOR), lessonController.deleteLesson);