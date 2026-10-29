const FoodRecognition = require('../models/FoodRecognition');
const { mapPredictionToFood } = require('../utils/nutritionMapping');

const resolveDetectedFoods = (predictions = [], fileName = '') => {
  const matches = [];

  for (const prediction of predictions) {
    const mapped = mapPredictionToFood(prediction.label);
    if (mapped && !matches.find((item) => item.foodName === mapped)) {
      matches.push({
        foodName: mapped,
        confidence: Math.round((prediction.confidence || 0) * 100) / 100,
      });
    }
  }

  if (!matches.length && fileName) {
    const mappedFromFileName = mapPredictionToFood(fileName);
    if (mappedFromFileName) {
      matches.push({
        foodName: mappedFromFileName,
        confidence: 0.45,
      });
    }
  }

  return matches;
};

const createRecognitionRecord = async ({ userId, source, fileName, imageData, predictions, detectedFoods }) => {
  return FoodRecognition.create({
    user: userId,
    source,
    fileName,
    imageData,
    labels: predictions,
    detectedFoods: detectedFoods.map((item) => item.foodName),
    status: detectedFoods.length ? 'processed' : 'failed',
  });
};

module.exports = {
  resolveDetectedFoods,
  createRecognitionRecord,
};
