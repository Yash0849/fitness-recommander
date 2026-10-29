const {
  createDayPlan,
  getSleepQuality,
  getGoalTemplate,
  getExercisesForType,
  applyInjuryAdjustments,
  applySleepAdjustments,
} = require('../utils/workoutPlanRules');

const buildIntensity = (experienceLevel, workoutType, sleepQuality) => {
  if (workoutType === 'Rest' || workoutType.toLowerCase().includes('recovery')) {
    return 'low';
  }

  if (sleepQuality === 'poor') {
    return 'low';
  }

  if (experienceLevel === 'advanced') {
    return 'high';
  }

  if (experienceLevel === 'intermediate') {
    return 'moderate';
  }

  return 'low';
};

const buildDuration = (workoutType, experienceLevel) => {
  if (workoutType === 'Rest') {
    return 0;
  }

  if (workoutType.toLowerCase().includes('recovery')) {
    return 25;
  }

  const base = {
    beginner: 35,
    intermediate: 50,
    advanced: 65,
  };

  return base[experienceLevel] || 40;
};

const buildRecoveryNotes = (goal, sleepQuality) => {
  const common = {
    'weight-loss': 'Keep protein intake steady and use walking for extra recovery volume.',
    'muscle-gain': 'Prioritize protein, hydration, and sleep to support recovery and growth.',
    maintenance: 'Stay consistent and keep sessions sustainable.',
    endurance: 'Hydrate early and include easy cooldown work after every harder session.',
    'general-fitness': 'Keep recovery simple: water, food, and a short walk later in the day.',
  };

  if (sleepQuality === 'poor') {
    return 'Sleep quality is low today. Lower effort, extend warm-up time, and stop the session early if form drops.';
  }

  return common[goal] || common['general-fitness'];
};

const buildWeeklyPlan = ({ goal, experienceLevel, injuryHistory, sleepQuality }) => {
  const template = getGoalTemplate(goal, experienceLevel);
  const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return dayKeys.reduce((accumulator, key, index) => {
    const entry = template[index];
    const workoutType = entry.type;
    const exercises = getExercisesForType(workoutType, experienceLevel);
    const intensity = buildIntensity(experienceLevel, workoutType, sleepQuality);
    const duration = buildDuration(workoutType, experienceLevel);

    let dayPlan = createDayPlan({
      workoutType,
      exercises,
      duration,
      intensity,
      focus: entry.focus,
      recoveryNotes: buildRecoveryNotes(goal, sleepQuality),
      warnings: [],
    });

    dayPlan = applyInjuryAdjustments(dayPlan, injuryHistory);
    dayPlan = applySleepAdjustments(dayPlan, sleepQuality);

    accumulator[key] = dayPlan;
    return accumulator;
  }, {});
};

const buildRecommendations = ({ goal, bmi, sleepQuality, injuryHistory, experienceLevel }) => {
  const recommendations = [];
  const warnings = [];

  if (goal === 'weight-loss') {
    recommendations.push('Prioritize cardio intervals and steady-state work to increase weekly calorie burn.');
  }

  if (goal === 'muscle-gain') {
    recommendations.push('Focus on progressive overload and recovery between heavy split days.');
  }

  if (goal === 'endurance') {
    recommendations.push('Use easy recovery days to protect quality on interval and tempo sessions.');
  }

  if (bmi >= 30) {
    recommendations.push('Favor low-impact cardio options to reduce joint stress while building consistency.');
  }

  if (sleepQuality === 'poor') {
    warnings.push('Low sleep quality detected: hard sessions were downgraded to recovery-focused work.');
  }

  if (injuryHistory.length > 0) {
    warnings.push('Injury-aware substitutions were applied to avoid high-risk movement patterns.');
  }

  if (experienceLevel === 'beginner') {
    recommendations.push('Beginner pacing applied: simplified exercise selection and lower training volume.');
  }

  if (experienceLevel === 'advanced') {
    recommendations.push('Advanced split applied: higher training frequency and denser workload.');
  }

  return {
    recommendations,
    warnings,
  };
};

const generateWorkoutPlan = ({ goal, bmi, age, sleepHours, injuryHistory, experienceLevel }) => {
  const sleepQuality = getSleepQuality(sleepHours);
  const weeklyPlan = buildWeeklyPlan({
    goal,
    experienceLevel,
    injuryHistory,
    sleepQuality,
  });

  const meta = buildRecommendations({
    goal,
    bmi,
    sleepQuality,
    injuryHistory,
    experienceLevel,
  });

  return {
    goal,
    bmi,
    age,
    sleepQuality,
    injuryHistory,
    experienceLevel,
    weeklyPlan,
    recommendations: meta.recommendations,
    warnings: meta.warnings,
  };
};

module.exports = {
  generateWorkoutPlan,
};
