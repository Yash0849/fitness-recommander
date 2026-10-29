const express = require('express');
const authMiddleware = require('../utils/authMiddleware');
const visionController = require('../controllers/visionController');
const { validateFoodDetectRequest } = require('../middleware/validateVisionRequest');

const router = express.Router();

router.post('/food-detect', authMiddleware, validateFoodDetectRequest, visionController.detectFood);
router.get('/nutrition/:id', authMiddleware, visionController.getNutritionResult);

module.exports = router;
