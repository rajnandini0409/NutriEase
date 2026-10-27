import Meal from '../models/Meal.js';
import { explainRecommendations } from '../services/aiService.js';

const demoMeals = [
  { _id: 'demo-1', name: 'Moong Dal Chilla', description: 'Savory lentil pancakes with chutney.', estimatedCost: 35, preparationTime: 15, dietaryTags: ['vegetarian', 'high-protein'], ingredients: ['moong dal', 'spices', 'curd'] },
  { _id: 'demo-2', name: 'Vegetable Poha', description: 'Quick poha with vegetables and peanuts.', estimatedCost: 25, preparationTime: 12, dietaryTags: ['vegetarian'], ingredients: ['poha', 'peas', 'onion', 'peanuts'] },
  { _id: 'demo-3', name: 'Chickpea Salad Bowl', description: 'Chickpeas with fresh vegetables and lemon.', estimatedCost: 45, preparationTime: 10, dietaryTags: ['vegetarian', 'vegan'], ingredients: ['chickpeas', 'cucumber', 'tomato', 'lemon'] },
  { _id: 'demo-4', name: 'Paneer Bhurji Wrap', description: 'Paneer and vegetables in a whole-wheat wrap.', estimatedCost: 55, preparationTime: 15, dietaryTags: ['vegetarian', 'high-protein'], ingredients: ['paneer', 'roti', 'capsicum'] },
  { _id: 'demo-5', name: 'Egg Bhurji Toast', description: 'Eggs with vegetables and whole-grain toast.', estimatedCost: 40, preparationTime: 10, dietaryTags: ['eggetarian'], ingredients: ['eggs', 'tomato', 'bread'] }
];

function safeFallbackMeals(prefs) {
  const preference = String(prefs.foodPreference || 'vegetarian').toLowerCase();
  const allergies = String(prefs.allergies || '').toLowerCase().split(',').map(s => s.trim()).filter(Boolean);
  return demoMeals.filter(meal => {
    const fitsPreference = preference === 'non-vegetarian' || preference === 'eggetarian'
      ? true
      : preference === 'vegan'
        ? meal.dietaryTags.includes('vegan')
        : !meal.dietaryTags.includes('eggetarian') && meal.dietaryTags.includes('vegetarian');
    const allergySafe = !allergies.some(allergen => meal.ingredients.some(ingredient => ingredient.toLowerCase().includes(allergen)));
    return fitsPreference && allergySafe && meal.estimatedCost <= Number(prefs.budget || 150) && meal.preparationTime <= Number(prefs.availableCookingTime || 30);
  }).slice(0, 3);
}

export async function recommendMeals(req, res, next) {
  try {
    const budget = Number(req.body.budget ?? 150);
    const availableCookingTime = Number(req.body.availableCookingTime ?? 15);
    const foodPreference = String(req.body.foodPreference || 'vegetarian').toLowerCase();
    const allergies = String(req.body.allergies || '').slice(0, 300);

    if (!Number.isFinite(budget) || budget <= 0 || budget > 100000) return res.status(400).json({ message: 'Enter a valid budget.' });
    if (!Number.isFinite(availableCookingTime) || availableCookingTime < 1 || availableCookingTime > 240) return res.status(400).json({ message: 'Enter a valid preparation time.' });
    if (!['vegetarian', 'vegan', 'eggetarian', 'non-vegetarian'].includes(foodPreference)) return res.status(400).json({ message: 'Choose a valid food preference.' });

    const preferences = { budget, availableCookingTime, foodPreference, allergies };
    let meals = [];
    try {
      const filter = { estimatedCost: { $lte: budget }, preparationTime: { $lte: availableCookingTime } };
      if (foodPreference === 'vegetarian') filter.dietaryTags = 'vegetarian';
      if (foodPreference === 'vegan') filter.dietaryTags = 'vegan';
      if (foodPreference === 'eggetarian') filter.dietaryTags = { $in: ['vegetarian', 'eggetarian'] };
      meals = await Meal.find(filter).limit(30).lean();
    } catch (dbError) {
      console.warn('Could not query meal database:', dbError.message);
    }

    // If database has no matches, use clearly marked illustrative sample data.
    console.log("Preferences received:", preferences);
console.log("Meals found in database:", meals.length);

if (!meals.length) {
  console.log("Using demo fallback meals");
  meals = safeFallbackMeals(preferences);
}

console.log(
  "Final candidate meals:",
  meals.map((meal) => meal.name)
);
    const allergyTerms = allergies.toLowerCase().split(',').map(s => s.trim()).filter(Boolean);
    meals = meals.filter(meal => !allergyTerms.some(term => (meal.ingredients || []).some(i => i.toLowerCase().includes(term))));

    if (!meals.length) return res.json({ recommendations: [], explanation: 'No matching meals were found. Try adjusting your budget, preparation time or preferences.', notes: 'Always verify ingredient labels and cross-contamination risks for serious allergies.' });

    let aiResult = null;
    try {
  aiResult = await explainRecommendations(preferences, meals);
} catch (error) {
  console.error('OpenAI status:', error.status);
  console.error('OpenAI code:', error.code);
  console.error('OpenAI type:', error.type);
  console.error('OpenAI message:', error.message);
}

  const selectedIds = new Set(
  Array.isArray(aiResult?.selectedIds)
    ? aiResult.selectedIds.map(String)
    : []
);

const selected = meals
  .filter(meal => selectedIds.has(String(meal._id)))
  .slice(0, 3);
   res.json({
  recommendations: selected,
  explanation: aiResult?.explanation ||
    "Meals are selected using your preferences and available meal data.",
  notes: aiResult?.notes ||
    "Prices are estimates. Verify ingredients and allergy risks before eating."
});
  } catch (error) { next(error); }
}
