import express from 'express';
import {router as authRouter} from './auth.route';
import {router as courseRouter} from './course.route';
import {router as categoryRouter} from './category.route';
import {router as adminRouter} from './admin.route';
import {router as instructorRouter} from './instructor.route';
import {router as userRouter} from './user.route';
import {verifyToken} from "../middlwares/verifyToken.ts";
import {allowTo} from "../middlwares/allowTo.ts";
import {UserRole} from "@prisma/client";

export const router = express.Router();

router.use('/auth', authRouter);
router.use('/courses', courseRouter);
router.use('/categories', categoryRouter)
router.use('/users', verifyToken, userRouter);
router.use('/admin', verifyToken, allowTo(UserRole.ADMIN), adminRouter);
router.use('/instructor', verifyToken, allowTo(UserRole.INSTRUCTOR), instructorRouter);
