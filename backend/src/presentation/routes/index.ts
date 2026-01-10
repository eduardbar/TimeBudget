// ===========================================
// TimeBudget - API Routes
// ===========================================

import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { authController } from '../controllers/auth.controller.js';
import { timeBudgetController } from '../controllers/time-budget.controller.js';
import { activityController } from '../controllers/activity.controller.js';
import { priorityController } from '../controllers/priority.controller.js';
import { calendarBlockController } from '../controllers/calendar-block.controller.js';
import { eliminationController } from '../controllers/elimination.controller.js';
import { weeklyReviewController } from '../controllers/weekly-review.controller.js';
import { analyticsController } from '../controllers/analytics.controller.js';
import { categoryController } from '../controllers/category.controller.js';

const router = Router();

// ===========================================
// Auth Routes (públicas)
// ===========================================
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/me', authMiddleware, authController.me);

// ===========================================
// Categories (públicas - solo lectura)
// ===========================================
router.get('/categories', categoryController.getAll);

// ===========================================
// Rutas protegidas (requieren autenticación)
// ===========================================
router.use(authMiddleware);

// TimeBudget
router.post('/time-budget', timeBudgetController.create);
router.get('/time-budget/current', timeBudgetController.getCurrent);
router.patch('/time-budget/:id', timeBudgetController.update);

// Activities
router.post('/activities', activityController.create);
router.get('/activities', activityController.getAll);
router.patch('/activities/:id', activityController.update);
router.delete('/activities/:id', activityController.delete);

// Priorities
router.post('/priorities', priorityController.create);
router.get('/priorities', priorityController.getAll);
router.patch('/priorities/:id', priorityController.update);
router.post('/priorities/reorder', priorityController.reorder);
router.delete('/priorities/:id', priorityController.delete);

// Calendar Blocks
router.post('/calendar-blocks', calendarBlockController.create);
router.get('/calendar-blocks', calendarBlockController.getAll);
router.delete('/calendar-blocks/:id', calendarBlockController.delete);

// Eliminations
router.post('/eliminations', eliminationController.create);
router.get('/eliminations', eliminationController.getAll);

// Weekly Reviews
router.get('/weekly-reviews/current', weeklyReviewController.getCurrent);
router.post('/weekly-reviews/:id/complete', weeklyReviewController.complete);
router.get('/weekly-reviews/history', weeklyReviewController.getHistory);

// Analytics
router.get('/analytics/weekly', analyticsController.getWeekly);
router.get('/analytics/trends', analyticsController.getTrends);

export default router;
