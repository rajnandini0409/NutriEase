import 'dotenv/config';
import mongoose from 'mongoose';
import Meal from './models/Meal.js';

const meals = [
  { name: 'Moong Dal Chilla', description: 'Protein-rich savory pancakes with chutney.', estimatedCost: 35, preparationTime: 15, dietaryTags: ['vegetarian', 'high-protein'], ingredients: ['moong dal', 'ginger', 'spices', 'curd'], nutrition: { calories: 280, protein: 15 } },
  { name: 'Vegetable Poha', description: 'Quick breakfast with vegetables and peanuts.', estimatedCost: 25, preparationTime: 12, dietaryTags: ['vegetarian', 'vegan'], ingredients: ['poha', 'peas', 'onion', 'peanuts', 'lemon'], nutrition: { calories: 300, protein: 7 } },
  { name: 'Chickpea Salad Bowl', description: 'Chickpeas, cucumber, tomato and lemon dressing.', estimatedCost: 45, preparationTime: 10, dietaryTags: ['vegetarian', 'vegan', 'high-fiber'], ingredients: ['chickpeas', 'cucumber', 'tomato', 'lemon'], nutrition: { calories: 320, protein: 13 } },
  { name: 'Paneer Bhurji Wrap', description: 'Paneer and vegetables in a whole-wheat roti.', estimatedCost: 55, preparationTime: 15, dietaryTags: ['vegetarian', 'high-protein'], ingredients: ['paneer', 'roti', 'capsicum', 'onion'], nutrition: { calories: 390, protein: 20 } },
  { name: 'Curd Rice with Cucumber', description: 'A simple rice and curd meal.', estimatedCost: 30, preparationTime: 10, dietaryTags: ['vegetarian'], ingredients: ['rice', 'curd', 'cucumber', 'curry leaves'], nutrition: { calories: 310, protein: 9 } },
  { name: 'Egg Bhurji Toast', description: 'Eggs with vegetables and whole-grain toast.', estimatedCost: 40, preparationTime: 10, dietaryTags: ['eggetarian', 'high-protein'], ingredients: ['eggs', 'tomato', 'onion', 'whole-grain bread'], nutrition: { calories: 340, protein: 18 } }
];

try {
  if (!process.env.MONGODB_URI) throw new Error('Set MONGODB_URI in server/.env first.');
  await mongoose.connect(process.env.MONGODB_URI);
  await Meal.deleteMany({});
  await Meal.insertMany(meals);
  console.log(`Seeded ${meals.length} demo meals.`);
} catch (error) {
  console.error('Seed failed:', error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect().catch(() => {});
}
