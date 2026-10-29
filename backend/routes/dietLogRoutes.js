const express = require('express');
const router = express.Router();
const authMiddleware = require('../utils/authMiddleware');
const dietLogController = require('../controllers/dietLogController');

router.post('/', authMiddleware, dietLogController.createDietLog);
router.get('/', authMiddleware, dietLogController.getDietLogs);
router.put('/:id', authMiddleware, dietLogController.updateDietLog);
router.delete('/:id', authMiddleware, dietLogController.deleteDietLog);

module.exports = router; 