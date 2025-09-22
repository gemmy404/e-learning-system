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

export const router = express.Router();

// Courses
router.route('/courses')
    .post(
        upload('course/cover').single('thumbnail'),
        createCourseValidations,
        instructorController.createCourse
    );

router.route('/courses/my')
    .get(paginateValidations, instructorController.getMyCreatedCourses);

router.route('/courses/enrollment-codes')
    .get(paginateValidations, instructorController.getAllCodes)
    .post(enrollmentCodeGenerationValidations, instructorController.generateEnrollmentCodes)
    .patch(instructorController.deactivateExpiredCodes);

router.route('/courses/:id')
    .patch(
        upload('course/cover').single('thumbnail'),
        updateCourseValidations,
        instructorController.updateCourse
    )
    .delete(instructorController.deleteCourse);

// Sections
router.route('/courses/:id/sections')
    .get(paginateValidations, sectionController.getAllSections)
    .post(createSectionValidations, sectionController.createSection);

router.route('/sections/:id')
    .patch(updateSectionValidations, sectionController.updateSection)
    .delete(sectionController.deleteSection);

// Lessons
router.route('/sections/:id/lessons')
    .get(paginateValidations, lessonController.getAllLessons)
    .post(
        upload('course/content').single('content'),
        createLessonValidations,
        lessonController.createLesson
    );

router.route('/lessons/:id')
    .patch(
        upload('course/content').single('content'),
        updateLessonValidations,
        lessonController.updateLesson
    )
    .delete(lessonController.deleteLesson);