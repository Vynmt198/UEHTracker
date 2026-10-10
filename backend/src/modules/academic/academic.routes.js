import { Router } from 'express';
import academicController from './academic.controller.js';
import { authMiddleware } from '../../common/middlewares/auth.middleware.js';

const router = Router();
router.use(authMiddleware);

// Summary
router.get('/summary', academicController.getSummary);

// Semesters
router.get('/semesters', academicController.getSemesters);
router.post('/semesters', academicController.createSemester);
router.delete('/semesters/:id', academicController.deleteSemester);

// Courses
router.get('/courses', academicController.getCourses);
router.post('/courses', academicController.createCourse);
router.put('/courses/:id/grades', academicController.updateCourseGrades);
router.delete('/courses/:id', academicController.deleteCourse);

export default router;
