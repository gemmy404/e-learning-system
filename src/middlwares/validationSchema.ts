import {body, query, ValidationChain} from 'express-validator';

export const registerValidations: ValidationChain[] = [
    body('name')
        .notEmpty()
        .withMessage('Name is required')
        .isLength({min: 8, max: 25})
        .withMessage('Name must be between 8 and 25 characters'),
    body('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Field must be a valid email address'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({min: 8})
        .withMessage('Password must be at least 8 characters')
        .isLength({max: 25})
        .withMessage('Password must not exceed 25 characters')
    // .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])$/)
    // .withMessage('Password must include uppercase, lowercase, number, and special character')
];

export const loginValidations: ValidationChain[] = [
    body('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Field must be a valid email address'),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
];

export const forgotPasswordValidations: ValidationChain[] = [
    body('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Field must be a valid email address'),
];

export const verifyCodeValidations: ValidationChain[] = [
    body('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Field must be a valid email address'),
    body('code')
        .notEmpty()
        .withMessage('Code is required'),
];

export const resetPasswordValidations: ValidationChain[] = [
    body('token')
        .notEmpty()
        .withMessage('Token is required'),
    body('newPassword')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({min: 8})
        .withMessage('Password must be at least 8 characters')
        .isLength({max: 25})
        .withMessage('Password must not exceed 25 characters'),
    // .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])$/)
    // .withMessage('Password must include uppercase, lowercase, number, and special character')
    body('confirmNewPassword')
        .notEmpty()
        .withMessage('Confirm Password is required')
        .isLength({min: 8, max: 25})
        .withMessage('Password must be match password'),
    // .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])$/)
    // .withMessage('Password must include uppercase, lowercase, number, and special character')
]

export const changePasswordValidations: ValidationChain[] = [
    body('oldPassword')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({min: 8})
        .withMessage('Password must be at least 8 characters')
        .isLength({max: 25})
        .withMessage('Password must not exceed 25 characters'),
    body('newPassword')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({min: 8})
        .withMessage('Password must be at least 8 characters')
        .isLength({max: 25})
        .withMessage('Password must not exceed 25 characters'),
    // .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])$/)
    // .withMessage('Password must include uppercase, lowercase, number, and special character')
];

export const updateUserProfileValidations: ValidationChain[] = [
    body('email')
        .optional()
    .notEmpty()
        .withMessage('Email is required'),
    body('name')
        .optional()
        .notEmpty()
        .withMessage('Name is required'),
];

export const userRoleValidations: ValidationChain[] = [
    body('role')
        .notEmpty()
        .withMessage('Role is required')
];

export const createCourseValidations: ValidationChain[] = [
    body('title')
        .notEmpty()
        .withMessage('Title is required')
        .isLength({min: 8, max: 25})
        .withMessage('Title must be between 8 and 25 characters'),
    body('description')
        .notEmpty()
        .withMessage('Description is required'),
    body('price')
        .notEmpty()
        .withMessage('Price is required')
        .isFloat({min: 0.01})
        .withMessage('Price must be a positive number'),
    body('category')
        .notEmpty()
        .withMessage('Category is required'),
];

export const updateCourseValidations: ValidationChain[] = [
    body('title')
        .optional()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({min: 8, max: 25})
        .withMessage('Name must be between 8 and 25 characters'),
    body('description')
        .optional()
        .notEmpty()
        .withMessage('Description is required'),
    body('price')
        .optional()
        .notEmpty()
        .withMessage('Price is required')
        .isFloat({min: 0.01})
        .withMessage('Price must be a positive number'),
    body('category')
        .optional()
        .notEmpty()
        .withMessage('Category is required'),
];

export const paginateValidations: ValidationChain[] = [
    query('size')
        .optional().isInt({min: 1})
        .withMessage('Size must be >= 1'),
    query('page')
        .optional().isInt({min: 1})
        .withMessage('Page must be >= 1')
];

export const enrollmentCodeGenerationValidations: ValidationChain[] = [
    body('count')
        .notEmpty()
        .withMessage('Count is required')
        .isInt({min: 1})
        .withMessage('Count must be >= 1'),
    body('expireAt')
        .notEmpty()
        .withMessage('Expires is required')
        .isAfter(new Date().toISOString())
        .withMessage('Expired date must be after now'),
];

export const enrollCourseValidations: ValidationChain[] = [
    body('enrollCode')
        .notEmpty()
        .withMessage('Enroll Code is required'),
];

export const createSectionValidations: ValidationChain[] = [
    body('sectionName')
        .notEmpty()
        .withMessage('Section Name is required'),
    body('orderIndex')
        .notEmpty()
        .withMessage('Order Index is required')
        .isInt({min: 1})
        .withMessage('Order Index must be >= 1'),
];

export const updateSectionValidations: ValidationChain[] = [
    body('sectionName')
        .optional()
        .notEmpty()
        .withMessage('Section Name is required'),
    body('orderIndex')
        .optional()
        .notEmpty()
        .withMessage('Order Index is required')
        .isInt({min: 1})
        .withMessage('Order Index must be >= 1'),
];

export const createLessonValidations: ValidationChain[] = [
    body('name')
        .notEmpty()
        .withMessage('Name is required'),
    body('contentType')
        .notEmpty()
        .withMessage('Content type is required'),
    body('orderIndex')
        .notEmpty()
        .withMessage('Order Index is required')
        .isInt({min: 1})
        .withMessage('Order Index must be >= 1'),
];

export const updateLessonValidations: ValidationChain[] = [
    body('name')
        .optional()
        .notEmpty()
        .withMessage('Name is required'),
    body('contentType')
        .optional()
        .notEmpty()
        .withMessage('ContentType is required'),
    body('orderIndex')
        .optional()
        .notEmpty()
        .withMessage('OrderIndex is required')
        .isInt({min: 1})
        .withMessage('OrderIndex must be >= 1'),
];