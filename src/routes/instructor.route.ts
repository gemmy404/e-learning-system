import express from 'express';
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
import {checkValidationErrors} from "../middlwares/checkValidationErrors.ts";
import {addPageInfo} from "../middlwares/addPageInfo.ts";

export const router = express.Router();

// Courses
router.route('/courses')
    .post(
        upload('course/cover').single('thumbnail'),
        createCourseValidations,
        checkValidationErrors,
        instructorController.createCourse
    );

router.route('/courses/my')
    .get(paginateValidations, checkValidationErrors, addPageInfo, instructorController.getMyCreatedCourses);

router.route('/courses/enrollment-codes')
    .get(paginateValidations, checkValidationErrors, addPageInfo, instructorController.getAllCodes)
    .post(
        enrollmentCodeGenerationValidations,
        checkValidationErrors,
        instructorController.generateEnrollmentCodes
    )
    .patch(instructorController.deactivateExpiredCodes);

router.route('/courses/:id')
    .patch(
        upload('course/cover').single('thumbnail'),
        updateCourseValidations,
        checkValidationErrors,
        instructorController.updateCourse
    )
    .delete(instructorController.deleteCourse);

// Sections
router.route('/courses/:id/sections')
    .get(paginateValidations, checkValidationErrors, addPageInfo, sectionController.getAllSections)
    .post(createSectionValidations, checkValidationErrors, sectionController.createSection);

router.route('/sections/:id')
    .patch(updateSectionValidations, checkValidationErrors, sectionController.updateSection)
    .delete(sectionController.deleteSection);

// Lessons
router.route('/sections/:id/lessons')
    .get(paginateValidations, checkValidationErrors, addPageInfo, lessonController.getAllLessons)
    .post(
        upload('course/content').single('content'),
        createLessonValidations,
        checkValidationErrors,
        lessonController.createLesson
    );

router.route('/lessons/:id')
    .patch(
        upload('course/content').single('content'),
        updateLessonValidations,
        checkValidationErrors,
        lessonController.updateLesson
    )
    .delete(lessonController.deleteLesson);