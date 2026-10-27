import { Router } from 'express';
import { recommendMeals } from '../controllers/aiController.js';

const router = Router();
router.post('/recommendations', recommendMeals);
export default router;
