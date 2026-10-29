const Profile = require('../models/Profile');
const User = require('../models/User');
const WorkoutPlan = require('../models/WorkoutPlan');
const { generateWorkoutPlan } = require('../services/workoutRecommendationService');

const normalizeInjuryHistory = (value) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => `${item}`.trim()).filter(Boolean);
};

exports.generatePlan = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const profile = await Profile.findOne({ user: userId }).lean();

    if (!profile) {
      return res.status(400).json({
        success: false,
        message: 'Complete your fitness profile before generating an AI workout plan',
      });
    }

    const payload = {
      goal: profile.fitnessGoal,
      bmi: profile.bmi,
      age: profile.age,
      sleepHours: req.body.sleepHours !== undefined ? req.body.sleepHours : profile.sleepHours,
      injuryHistory: normalizeInjuryHistory(profile.injuryHistory),
      experienceLevel: profile.experienceLevel,
    };

    const generatedPlan = generateWorkoutPlan(payload);

    const workoutPlan = await WorkoutPlan.create({
      userId,
      ...generatedPlan,
    });

    return res.status(201).json({
      success: true,
      message: 'AI workout plan generated successfully',
      workoutPlan,
    });
  } catch (error) {
    console.error('Error generating workout plan:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate workout plan',
    });
  }
};

exports.getWorkoutPlanByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.user.id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only access your own workout plans',
      });
    }

    const workoutPlans = await WorkoutPlan.find({ userId }).sort({ createdAt: -1 }).lean();

    return res.status(200).json({
      success: true,
      workoutPlans,
    });
  } catch (error) {
    console.error('Error fetching workout plans:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch workout plans',
    });
  }
};

exports.updateWorkoutPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const workoutPlan = await WorkoutPlan.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    ).lean();

    if (!workoutPlan) {
      return res.status(404).json({
        success: false,
        message: 'Workout plan not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Workout plan updated successfully',
      workoutPlan,
    });
  } catch (error) {
    console.error('Error updating workout plan:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update workout plan',
    });
  }
};

exports.deleteWorkoutPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const workoutPlan = await WorkoutPlan.findOneAndDelete({
      _id: id,
      userId: req.user.id,
    }).lean();

    if (!workoutPlan) {
      return res.status(404).json({
        success: false,
        message: 'Workout plan not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Workout plan deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting workout plan:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete workout plan',
    });
  }
};
