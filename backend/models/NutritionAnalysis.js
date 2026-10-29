const mongoose = require('mongoose');

const detectedItemSchema = new mongoose.Schema(
  {
    foodName: { type: String, required: true },
    confidence: { type: Number, default: 0 },
    servingEstimate: { type: String, default: '1 serving' },
    estimationSource: { type: String, default: 'direct-match' },
    notes: { type: String, default: '' },
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fats: { type: Number, default: 0 },
  },
  { _id: false }
);

const totalsSchema = new mongoose.Schema(
  {
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fats: { type: Number, default: 0 },
  },
  { _id: false }
);

const nutritionAnalysisSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    recognition: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodRecognition', required: true },
    detectedItems: { type: [detectedItemSchema], default: [] },
    totals: { type: totalsSchema, default: () => ({}) },
    mealType: { type: String, default: 'lunch' },
    dietLogId: { type: mongoose.Schema.Types.ObjectId, ref: 'DietLog', default: null },
    autoAddedToDiet: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('NutritionAnalysis', nutritionAnalysisSchema);
