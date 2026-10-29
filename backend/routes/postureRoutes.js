const express = require('express');
const authMiddleware = require('../utils/authMiddleware');
const postureController = require('../controllers/postureController');
const {
  validatePostureAnalyzeRequest,
  validatePostureSessionRequest,
} = require('../middleware/validateVisionRequest');

const router = express.Router();

router.post('/analyze', authMiddleware, validatePostureAnalyzeRequest, postureController.analyze);
router.post('/session', authMiddleware, validatePostureSessionRequest, postureController.saveSession);
router.get('/history/:userId', authMiddleware, postureController.getHistory);

module.exports = router;
