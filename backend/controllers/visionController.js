const NutritionAnalysis = require('../models/NutritionAnalysis');
const {
  resolveDetectedFoods,
  createRecognitionRecord,
} = require('../services/foodRecognitionService');
const {
  buildNutritionItems,
  calculateTotals,
  createDietLogFromAnalysis,
  createNutritionAnalysis,
} = require('../services/nutritionAnalysisService');
const { estimateNutritionFromPredictions } = require('../utils/nutritionMapping');

exports.detectFood = async (req, res) => {
  try {
    const { fileName = '', imageData = '', predictions = [], source = 'upload', mealType = 'lunch' } = req.body;
    const userId = req.user.id;

    const detectedFoods = resolveDetectedFoods(predictions, fileName);
    const recognition = await createRecognitionRecord({
      userId,
      source,
      fileName,
      imageData,
      predictions,
      detectedFoods,
    });

    let nutritionItems = buildNutritionItems(detectedFoods);

    if (!nutritionItems.length) {
      nutritionItems = estimateNutritionFromPredictions(predictions, fileName);
    }

    if (!nutritionItems.length) {
      return res.status(422).json({
        success: false,
        message: 'No supported food items were recognized from the image',
        recognitionId: recognition._id,
        predictions,
      });
    }

    const totals = calculateTotals(nutritionItems);
    const dietLog = await createDietLogFromAnalysis({
      userId,
      mealType,
      items: nutritionItems,
      totals,
    });

    const nutritionAnalysis = await createNutritionAnalysis({
      userId,
      recognitionId: recognition._id,
      mealType,
      items: nutritionItems,
      totals,
      dietLog,
    });

    return res.status(201).json({
      success: true,
      recognitionId: recognition._id,
      nutritionAnalysisId: nutritionAnalysis._id,
      detectedItems: nutritionItems,
      totals,
      autoAddedToDiet: true,
      dietLogId: dietLog._id,
      predictions,
    });
  } catch (error) {
    console.error('Food detection error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to detect food from image',
    });
  }
};

exports.getNutritionResult = async (req, res) => {
  try {
    const analysis = await NutritionAnalysis.findOne({
      _id: req.params.id,
      user: req.user.id,
    }).lean();

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Nutrition analysis not found',
      });
    }

    return res.status(200).json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error('Nutrition lookup error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch nutrition analysis',
    });
  }
};
