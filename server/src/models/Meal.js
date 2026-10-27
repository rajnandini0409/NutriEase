import mongoose from 'mongoose';

const mealSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  ingredients: [{ type: String }],
  estimatedCost: { type: Number, required: true, min: 0 },
  preparationTime: { type: Number, required: true, min: 1 },
  dietaryTags: [{ type: String, lowercase: true }],
  nutrition: {
    calories: { type: Number, min: 0 },
    protein: { type: Number, min: 0 },
    carbohydrates: { type: Number, min: 0 },
    fat: { type: Number, min: 0 }
  }
}, { timestamps: true });

mealSchema.index({ name: 'text', description: 'text', ingredients: 'text' });
export default mongoose.model('Meal', mealSchema);
