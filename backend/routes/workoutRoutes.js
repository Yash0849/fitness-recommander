const express = require('express');
const router = express.Router();
const authMiddleware = require('../utils/authMiddleware');
const workoutController = require('../controllers/workoutController');
const workoutPlanController = require('../controllers/workoutPlanController');
const {
  validateGenerateWorkoutPlan,
  validateUpdateWorkoutPlan,
} = require('../middleware/validateWorkoutPlanRequest');

// Create a workout
router.post('/', authMiddleware, workoutController.createWorkout);
router.post('/generate', authMiddleware, validateGenerateWorkoutPlan, workoutPlanController.generatePlan);
// Get all workouts for a user
router.get('/', authMiddleware, workoutController.getWorkouts);
// Get a specific workout by ID
router.get('/single/:workoutId', authMiddleware, workoutController.getWorkoutById);
router.get('/plans/:userId', authMiddleware, workoutPlanController.getWorkoutPlanByUserId);
// Update a workout
router.put('/:workoutId', authMiddleware, workoutController.updateWorkout);
router.put('/plans/:id', authMiddleware, validateUpdateWorkoutPlan, workoutPlanController.updateWorkoutPlan);
// Delete a workout
router.delete('/:workoutId', authMiddleware, workoutController.deleteWorkout);
router.delete('/plans/:id', authMiddleware, workoutPlanController.deleteWorkoutPlan);

module.exports = router;
