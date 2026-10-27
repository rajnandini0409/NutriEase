import { Router } from 'express';
import { listMeals, createMeal } from '../controllers/mealController.js';

const router = Router();
router.get('/', listMeals);
// For an MVP only. Before public deployment, protect POST with admin authentication.
router.post('/', createMeal);

export default router;
