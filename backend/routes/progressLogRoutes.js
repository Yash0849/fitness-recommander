const express = require('express');
const router = express.Router();
const authMiddleware = require('../utils/authMiddleware');
const progressLogController = require('../controllers/progressLogController');

router.post('/', authMiddleware, progressLogController.createProgressLog);
router.get('/', authMiddleware, progressLogController.getProgressLogs);
router.put('/:id', authMiddleware, progressLogController.updateProgressLog);
router.delete('/:id', authMiddleware, progressLogController.deleteProgressLog);

module.exports = router; 