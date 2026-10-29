const express = require('express');
const authMiddleware = require('../utils/authMiddleware');
const profileController = require('../controllers/profileController');
const validateFitnessProfile = require('../middleware/validateFitnessProfile');

const router = express.Router();

router.get('/me', authMiddleware, profileController.getMyProfile);
router.put('/me', authMiddleware, validateFitnessProfile, profileController.upsertMyProfile);

module.exports = router;
