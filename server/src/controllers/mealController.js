import Meal from '../models/Meal.js';

export async function listMeals(req, res, next) {
  try {
    const filter = {};
    if (req.query.maxCost !== undefined) filter.estimatedCost = { $lte: Math.max(0, Number(req.query.maxCost) || 0) };
    if (req.query.maxTime !== undefined) filter.preparationTime = { $lte: Math.max(1, Number(req.query.maxTime) || 1) };
    if (req.query.preference) filter.dietaryTags = req.query.preference.toLowerCase();
    if (req.query.search) filter.$text = { $search: String(req.query.search).slice(0, 80) };
    const meals = await Meal.find(filter).sort({ estimatedCost: 1 }).limit(100).lean();
    res.json({ count: meals.length, meals });
  } catch (error) { next(error); }
}

export async function createMeal(req, res, next) {
  try {
    const { name, estimatedCost, preparationTime } = req.body;
    if (!name || !Number.isFinite(Number(estimatedCost)) || !Number.isFinite(Number(preparationTime))) {
      return res.status(400).json({ message: 'name, estimatedCost and preparationTime are required.' });
    }
    const meal = await Meal.create({
      name: String(name).slice(0, 120),
      description: String(req.body.description || '').slice(0, 500),
      ingredients: Array.isArray(req.body.ingredients) ? req.body.ingredients.map(x => String(x).slice(0, 80)).slice(0, 40) : [],
      estimatedCost: Number(estimatedCost),
      preparationTime: Number(preparationTime),
      dietaryTags: Array.isArray(req.body.dietaryTags) ? req.body.dietaryTags.map(x => String(x).toLowerCase()).slice(0, 20) : [],
      nutrition: req.body.nutrition || {}
    });
    res.status(201).json({ meal });
  } catch (error) { next(error); }
}
