const express = require('express');
const router = express.Router();
const authMiddleware = require('../utils/authMiddleware');
const goalController = require('../controllers/goalController');

// Create a goal
router.post('/', authMiddleware, goalController.createGoal);
// Get all goals for a user
router.get('/', authMiddleware, goalController.getGoals);
// Update a goal
router.put('/:goalId', authMiddleware, goalController.updateGoal);
// Delete a goal
router.delete('/:goalId', authMiddleware, goalController.deleteGoal);

module.exports = router;
