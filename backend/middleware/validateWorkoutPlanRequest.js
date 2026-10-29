const allowedGoals = ['weight-loss', 'muscle-gain', 'maintenance', 'endurance', 'general-fitness'];
const allowedExperienceLevels = ['beginner', 'intermediate', 'advanced'];

const validateGenerateWorkoutPlan = (req, res, next) => {
  const { sleepHours } = req.body;

  if (sleepHours !== undefined) {
    const parsedSleepHours = Number(sleepHours);

    if (!Number.isFinite(parsedSleepHours) || parsedSleepHours < 0 || parsedSleepHours > 24) {
      return res.status(400).json({
        success: false,
        message: 'Sleep hours must be between 0 and 24',
      });
    }

    req.body.sleepHours = parsedSleepHours;
  }

  next();
};

const validateUpdateWorkoutPlan = (req, res, next) => {
  const { goal, bmi, age, sleepQuality, injuryHistory, experienceLevel, weeklyPlan } = req.body;
  const errors = {};

  if (goal && !allowedGoals.includes(goal)) {
    errors.goal = 'Invalid goal';
  }

  if (bmi !== undefined && (!Number.isFinite(Number(bmi)) || Number(bmi) <= 0)) {
    errors.bmi = 'BMI must be a positive number';
  }

  if (age !== undefined && (!Number.isFinite(Number(age)) || Number(age) < 10 || Number(age) > 100)) {
    errors.age = 'Age must be between 10 and 100';
  }

  if (sleepQuality && !['poor', 'average', 'good'].includes(sleepQuality)) {
    errors.sleepQuality = 'Sleep quality must be poor, average, or good';
  }

  if (experienceLevel && !allowedExperienceLevels.includes(experienceLevel)) {
    errors.experienceLevel = 'Invalid experience level';
  }

  if (injuryHistory && !Array.isArray(injuryHistory)) {
    errors.injuryHistory = 'Injury history must be an array';
  }

  if (weeklyPlan && typeof weeklyPlan !== 'object') {
    errors.weeklyPlan = 'Weekly plan must be an object';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  next();
};

module.exports = {
  validateGenerateWorkoutPlan,
  validateUpdateWorkoutPlan,
};
