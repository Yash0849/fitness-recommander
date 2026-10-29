const NutritionAnalysis = require('../models/NutritionAnalysis');
const DietLog = require('../models/DietLog');
const { lookupNutrition } = require('../utils/nutritionMapping');

const buildNutritionItems = (detectedFoods) =>
  detectedFoods
    .map((item) => {
      const nutrition = lookupNutrition(item.foodName);
      if (!nutrition) {
        return null;
      }

      return {
        foodName: item.foodName,
        confidence: item.confidence,
        servingEstimate: nutrition.servingEstimate,
        estimationSource: 'direct-match',
        notes: '',
        calories: nutrition.calories,
        protein: nutrition.protein,
        carbs: nutrition.carbs,
        fats: nutrition.fats,
      };
    })
    .filter(Boolean);

const calculateTotals = (items) =>
  items.reduce(
    (totals, item) => ({
      calories: totals.calories + item.calories,
      protein: totals.protein + item.protein,
      carbs: totals.carbs + item.carbs,
      fats: totals.fats + item.fats,
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

const createDietLogFromAnalysis = async ({ userId, mealType, items, totals }) => {
  const meals = items.map((item) => ({
    name: item.foodName,
    calories: item.calories,
    protein: item.protein,
    carbs: item.carbs,
    fat: item.fats,
  }));

  const dietLog = await DietLog.create({
    user: userId,
    meals,
    totalCalories: totals.calories,
    date: new Date(),
    mealType,
  });

  return dietLog;
};

const createNutritionAnalysis = async ({ userId, recognitionId, mealType, items, totals, dietLog }) => {
  return NutritionAnalysis.create({
    user: userId,
    recognition: recognitionId,
    detectedItems: items,
    totals,
    mealType,
    dietLogId: dietLog?._id || null,
    autoAddedToDiet: Boolean(dietLog),
  });
};

module.exports = {
  buildNutritionItems,
  calculateTotals,
  createDietLogFromAnalysis,
  createNutritionAnalysis,
};
