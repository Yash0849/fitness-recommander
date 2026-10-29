const createExercise = (name, options = {}) => ({
  name,
  sets: options.sets || 0,
  reps: options.reps || 0,
  duration: options.duration || 0,
  notes: options.notes || '',
  substitutedFrom: options.substitutedFrom || '',
});

const createDayPlan = (overrides = {}) => ({
  workoutType: overrides.workoutType || 'Recovery',
  exercises: overrides.exercises || [],
  duration: overrides.duration || 30,
  intensity: overrides.intensity || 'low',
  focus: overrides.focus || 'Mobility and readiness',
  recoveryNotes: overrides.recoveryNotes || 'Stay hydrated and keep the session easy.',
  warnings: overrides.warnings || [],
});

const getSleepQuality = (sleepHours) => {
  if (sleepHours < 6) {
    return 'poor';
  }

  if (sleepHours < 8) {
    return 'average';
  }

  return 'good';
};

const getGoalTemplate = (goal, experienceLevel) => {
  const templates = {
    'weight-loss': {
      beginner: [
        { type: 'Cardio Foundation', focus: 'Walking and low-impact conditioning' },
        { type: 'Core and Mobility', focus: 'Core stability and posture' },
        { type: 'Recovery Cardio', focus: 'Easy movement and circulation' },
        { type: 'Light HIIT', focus: 'Short intervals with longer rest' },
        { type: 'Strength Circuit', focus: 'Full body calorie burn' },
        { type: 'Active Recovery', focus: 'Yoga and mobility reset' },
        { type: 'Rest', focus: 'Rest and hydration' },
      ],
      intermediate: [
        { type: 'HIIT Cardio', focus: 'Intervals and fat loss' },
        { type: 'Upper Body Strength', focus: 'Strength and conditioning' },
        { type: 'Low-Impact Cardio', focus: 'Steady-state calorie burn' },
        { type: 'Lower Body Strength', focus: 'Glutes and posterior chain' },
        { type: 'Metabolic Circuit', focus: 'Full body work capacity' },
        { type: 'Recovery Session', focus: 'Mobility and breathing' },
        { type: 'Rest', focus: 'Rest and hydration' },
      ],
      advanced: [
        { type: 'Sprint Intervals', focus: 'Explosive cardio output' },
        { type: 'Push Strength', focus: 'Pressing power and accessory work' },
        { type: 'Pull Strength', focus: 'Back strength and conditioning' },
        { type: 'Leg Conditioning', focus: 'High-output lower body work' },
        { type: 'HIIT Finisher', focus: 'Full body metabolic demand' },
        { type: 'Recovery Session', focus: 'Mobility and tissue reset' },
        { type: 'Rest', focus: 'Rest and hydration' },
      ],
    },
    'muscle-gain': {
      beginner: [
        { type: 'Upper Body Basics', focus: 'Push and pull fundamentals' },
        { type: 'Lower Body Basics', focus: 'Leg strength and control' },
        { type: 'Mobility Recovery', focus: 'Joint prep and stretching' },
        { type: 'Full Body Strength', focus: 'Compound lifting practice' },
        { type: 'Arms and Core', focus: 'Accessory muscle work' },
        { type: 'Recovery Session', focus: 'Walk and light mobility' },
        { type: 'Rest', focus: 'Rest and recovery' },
      ],
      intermediate: [
        { type: 'Push Day', focus: 'Chest, shoulders, triceps' },
        { type: 'Pull Day', focus: 'Back and biceps' },
        { type: 'Leg Day', focus: 'Quads, glutes, hamstrings' },
        { type: 'Active Recovery', focus: 'Mobility and circulation' },
        { type: 'Upper Hypertrophy', focus: 'Volume-based growth' },
        { type: 'Lower Hypertrophy', focus: 'Posterior chain and legs' },
        { type: 'Rest', focus: 'Rest and recovery' },
      ],
      advanced: [
        { type: 'Push Power', focus: 'Heavy pressing and overload' },
        { type: 'Pull Power', focus: 'Back density and strength' },
        { type: 'Leg Power', focus: 'Heavy lower-body output' },
        { type: 'Upper Hypertrophy', focus: 'Volume and muscle fullness' },
        { type: 'Lower Hypertrophy', focus: 'Volume and posterior chain' },
        { type: 'Arms and Delts', focus: 'Accessories and weak points' },
        { type: 'Rest', focus: 'Rest and recovery' },
      ],
    },
    maintenance: {
      beginner: [
        { type: 'Full Body Strength', focus: 'Balanced movement patterns' },
        { type: 'Cardio Base', focus: 'Easy endurance' },
        { type: 'Mobility Recovery', focus: 'Recovery and flexibility' },
        { type: 'Full Body Strength', focus: 'Strength retention' },
        { type: 'Core and Conditioning', focus: 'Stability and cardio' },
        { type: 'Active Recovery', focus: 'Walk and stretch' },
        { type: 'Rest', focus: 'Rest and recovery' },
      ],
      intermediate: [
        { type: 'Upper Strength', focus: 'Maintenance lifting' },
        { type: 'Cardio Conditioning', focus: 'Aerobic health' },
        { type: 'Lower Strength', focus: 'Strength retention' },
        { type: 'Mobility Recovery', focus: 'Tissue quality' },
        { type: 'Full Body Circuit', focus: 'General fitness' },
        { type: 'Active Recovery', focus: 'Walk and stretch' },
        { type: 'Rest', focus: 'Rest and recovery' },
      ],
      advanced: [
        { type: 'Push/Pull Blend', focus: 'Upper body maintenance' },
        { type: 'Leg Strength', focus: 'Lower body maintenance' },
        { type: 'Conditioning', focus: 'Engine and work capacity' },
        { type: 'Mobility Recovery', focus: 'Tissue quality' },
        { type: 'Full Body Power', focus: 'Strength retention' },
        { type: 'Active Recovery', focus: 'Walk and stretch' },
        { type: 'Rest', focus: 'Rest and recovery' },
      ],
    },
    endurance: {
      beginner: [
        { type: 'Walk-Jog Intervals', focus: 'Aerobic base' },
        { type: 'Core Stability', focus: 'Running posture' },
        { type: 'Bike Recovery', focus: 'Low-impact endurance' },
        { type: 'Tempo Cardio', focus: 'Steady-state stamina' },
        { type: 'Strength Support', focus: 'Injury prevention' },
        { type: 'Stretch Recovery', focus: 'Range of motion' },
        { type: 'Rest', focus: 'Rest and recovery' },
      ],
      intermediate: [
        { type: 'Tempo Run', focus: 'Threshold endurance' },
        { type: 'Strength Support', focus: 'Durability training' },
        { type: 'Intervals', focus: 'Speed endurance' },
        { type: 'Bike Recovery', focus: 'Easy aerobic work' },
        { type: 'Long Cardio', focus: 'Steady-state stamina' },
        { type: 'Mobility Recovery', focus: 'Flexibility and breathing' },
        { type: 'Rest', focus: 'Rest and recovery' },
      ],
      advanced: [
        { type: 'Interval Session', focus: 'VO2 max and pace' },
        { type: 'Strength Support', focus: 'Posterior chain support' },
        { type: 'Tempo Session', focus: 'Threshold endurance' },
        { type: 'Recovery Ride', focus: 'Circulation and reload' },
        { type: 'Long Endurance', focus: 'Extended aerobic output' },
        { type: 'Mobility Recovery', focus: 'Flexibility and breathing' },
        { type: 'Rest', focus: 'Rest and recovery' },
      ],
    },
    'general-fitness': {
      beginner: [
        { type: 'Full Body Strength', focus: 'Balanced fundamentals' },
        { type: 'Cardio Conditioning', focus: 'Heart health' },
        { type: 'Mobility Recovery', focus: 'Flexibility' },
        { type: 'Full Body Strength', focus: 'Confidence and form' },
        { type: 'Core and Cardio', focus: 'Stability and energy' },
        { type: 'Active Recovery', focus: 'Walk and stretch' },
        { type: 'Rest', focus: 'Rest and recovery' },
      ],
      intermediate: [
        { type: 'Upper Strength', focus: 'Push and pull balance' },
        { type: 'Cardio Conditioning', focus: 'Cardiovascular health' },
        { type: 'Lower Strength', focus: 'Leg and glute strength' },
        { type: 'Mobility Recovery', focus: 'Range of motion' },
        { type: 'Full Body Circuit', focus: 'Athletic conditioning' },
        { type: 'Active Recovery', focus: 'Walk and stretch' },
        { type: 'Rest', focus: 'Rest and recovery' },
      ],
      advanced: [
        { type: 'Push Strength', focus: 'Upper body force output' },
        { type: 'Pull Strength', focus: 'Back and posterior chain' },
        { type: 'Leg Strength', focus: 'Lower body power' },
        { type: 'Conditioning', focus: 'Work capacity' },
        { type: 'Full Body Athletic', focus: 'Explosive balance' },
        { type: 'Mobility Recovery', focus: 'Mobility and readiness' },
        { type: 'Rest', focus: 'Rest and recovery' },
      ],
    },
  };

  return templates[goal]?.[experienceLevel] || templates['general-fitness'][experienceLevel];
};

const getExercisesForType = (type, experienceLevel) => {
  const exerciseMap = {
    'Cardio Foundation': [
      createExercise('Brisk Walking', { duration: 20, notes: 'Keep a conversation pace.' }),
      createExercise('Bike Erg', { duration: 12, notes: 'Low resistance.' }),
      createExercise('Dead Bug', { sets: 3, reps: 10, notes: 'Control each rep.' }),
    ],
    'Core and Mobility': [
      createExercise('Bird Dog', { sets: 3, reps: 10 }),
      createExercise('Front Plank', { sets: 3, reps: 30, notes: 'Seconds per set.' }),
      createExercise('Hip Flexor Stretch', { sets: 2, reps: 45, notes: 'Seconds per side.' }),
    ],
    'Recovery Cardio': [
      createExercise('Incline Walk', { duration: 20 }),
      createExercise('Box Breathing', { sets: 3, reps: 5, notes: 'Five breaths per set.' }),
      createExercise('Thoracic Rotation', { sets: 2, reps: 10 }),
    ],
    'Light HIIT': [
      createExercise('Bike Sprint', { sets: 6, reps: 30, notes: '30 seconds on, 60 seconds off.' }),
      createExercise('Bodyweight Sit to Stand', { sets: 3, reps: 12 }),
      createExercise('Mountain Climber', { sets: 3, reps: 20 }),
    ],
    'Strength Circuit': [
      createExercise('Goblet Squat', { sets: 3, reps: 12 }),
      createExercise('Incline Push-Up', { sets: 3, reps: 10 }),
      createExercise('Dumbbell Row', { sets: 3, reps: 12 }),
    ],
    'HIIT Cardio': [
      createExercise('Row Erg Intervals', { sets: 8, reps: 40, notes: '40 seconds hard, 40 easy.' }),
      createExercise('Jump Rope', { sets: 4, reps: 60, notes: 'Seconds per set.' }),
      createExercise('Reverse Crunch', { sets: 3, reps: 15 }),
    ],
    'Upper Body Strength': [
      createExercise('Dumbbell Bench Press', { sets: 4, reps: 8 }),
      createExercise('Seated Row', { sets: 4, reps: 10 }),
      createExercise('Shoulder Press', { sets: 3, reps: 10 }),
    ],
    'Low-Impact Cardio': [
      createExercise('Elliptical', { duration: 30 }),
      createExercise('Incline Walk', { duration: 15 }),
      createExercise('Pallof Press', { sets: 3, reps: 12 }),
    ],
    'Lower Body Strength': [
      createExercise('Romanian Deadlift', { sets: 4, reps: 8 }),
      createExercise('Split Squat', { sets: 3, reps: 10 }),
      createExercise('Leg Curl', { sets: 3, reps: 12 }),
    ],
    'Metabolic Circuit': [
      createExercise('Kettlebell Swing', { sets: 4, reps: 15 }),
      createExercise('Push-Up', { sets: 4, reps: 12 }),
      createExercise('Farmer Carry', { sets: 4, reps: 30, notes: 'Meters or seconds.' }),
    ],
    'Sprint Intervals': [
      createExercise('Treadmill Sprint', { sets: 10, reps: 20, notes: '20 seconds sprint, 70 seconds walk.' }),
      createExercise('Battle Ropes', { sets: 5, reps: 30 }),
      createExercise('Hollow Hold', { sets: 3, reps: 30 }),
    ],
    'Push Strength': [
      createExercise('Barbell Bench Press', { sets: 5, reps: 5 }),
      createExercise('Incline Dumbbell Press', { sets: 4, reps: 8 }),
      createExercise('Cable Fly', { sets: 3, reps: 12 }),
    ],
    'Pull Strength': [
      createExercise('Weighted Pull-Up', { sets: 5, reps: 5 }),
      createExercise('Barbell Row', { sets: 4, reps: 8 }),
      createExercise('Face Pull', { sets: 3, reps: 15 }),
    ],
    'Leg Conditioning': [
      createExercise('Front Squat', { sets: 5, reps: 5 }),
      createExercise('Walking Lunge', { sets: 4, reps: 12 }),
      createExercise('Sled Push', { sets: 6, reps: 20, notes: 'Meters or seconds.' }),
    ],
    'HIIT Finisher': [
      createExercise('Assault Bike', { sets: 8, reps: 20, notes: 'Max effort, 70 seconds easy.' }),
      createExercise('Burpee', { sets: 4, reps: 12 }),
      createExercise('V-Up', { sets: 3, reps: 15 }),
    ],
    'Upper Body Basics': [
      createExercise('Machine Chest Press', { sets: 3, reps: 10 }),
      createExercise('Lat Pulldown', { sets: 3, reps: 10 }),
      createExercise('Seated Shoulder Press', { sets: 3, reps: 10 }),
    ],
    'Lower Body Basics': [
      createExercise('Leg Press', { sets: 3, reps: 10 }),
      createExercise('Glute Bridge', { sets: 3, reps: 12 }),
      createExercise('Hamstring Curl', { sets: 3, reps: 10 }),
    ],
    'Mobility Recovery': [
      createExercise('Yoga Flow', { duration: 20 }),
      createExercise('90/90 Hip Stretch', { sets: 2, reps: 45 }),
      createExercise('Cat-Cow', { sets: 2, reps: 10 }),
    ],
    'Full Body Strength': [
      createExercise('Goblet Squat', { sets: 3, reps: 10 }),
      createExercise('Dumbbell Romanian Deadlift', { sets: 3, reps: 10 }),
      createExercise('Push-Up', { sets: 3, reps: 8 }),
      createExercise('Dumbbell Row', { sets: 3, reps: 10 }),
    ],
    'Arms and Core': [
      createExercise('Bicep Curl', { sets: 3, reps: 12 }),
      createExercise('Cable Tricep Pressdown', { sets: 3, reps: 12 }),
      createExercise('Dead Bug', { sets: 3, reps: 10 }),
    ],
    'Push Day': [
      createExercise('Bench Press', { sets: 4, reps: 6 }),
      createExercise('Incline Dumbbell Press', { sets: 4, reps: 8 }),
      createExercise('Lateral Raise', { sets: 3, reps: 15 }),
      createExercise('Tricep Dip', { sets: 3, reps: 10 }),
    ],
    'Pull Day': [
      createExercise('Pull-Up', { sets: 4, reps: 6 }),
      createExercise('Chest Supported Row', { sets: 4, reps: 8 }),
      createExercise('Cable Row', { sets: 3, reps: 12 }),
      createExercise('Hammer Curl', { sets: 3, reps: 12 }),
    ],
    'Leg Day': [
      createExercise('Back Squat', { sets: 4, reps: 6 }),
      createExercise('Romanian Deadlift', { sets: 4, reps: 8 }),
      createExercise('Walking Lunge', { sets: 3, reps: 12 }),
      createExercise('Standing Calf Raise', { sets: 4, reps: 12 }),
    ],
    'Active Recovery': [
      createExercise('Easy Walk', { duration: 25 }),
      createExercise('Mobility Flow', { duration: 15 }),
      createExercise('Breathing Reset', { sets: 3, reps: 5 }),
    ],
    'Upper Hypertrophy': [
      createExercise('Machine Chest Press', { sets: 4, reps: 10 }),
      createExercise('Cable Fly', { sets: 3, reps: 15 }),
      createExercise('Lat Pulldown', { sets: 4, reps: 10 }),
      createExercise('Lateral Raise', { sets: 4, reps: 15 }),
    ],
    'Lower Hypertrophy': [
      createExercise('Hack Squat', { sets: 4, reps: 10 }),
      createExercise('Leg Press', { sets: 4, reps: 12 }),
      createExercise('Seated Hamstring Curl', { sets: 4, reps: 12 }),
      createExercise('Leg Extension', { sets: 3, reps: 15 }),
    ],
    'Push Power': [
      createExercise('Barbell Bench Press', { sets: 5, reps: 4 }),
      createExercise('Overhead Press', { sets: 5, reps: 4 }),
      createExercise('Weighted Dip', { sets: 4, reps: 6 }),
    ],
    'Pull Power': [
      createExercise('Weighted Pull-Up', { sets: 5, reps: 4 }),
      createExercise('Pendlay Row', { sets: 5, reps: 5 }),
      createExercise('Chest Supported Rear Delt Fly', { sets: 3, reps: 15 }),
    ],
    'Leg Power': [
      createExercise('Back Squat', { sets: 5, reps: 4 }),
      createExercise('Deadlift', { sets: 4, reps: 4 }),
      createExercise('Bulgarian Split Squat', { sets: 3, reps: 8 }),
    ],
    'Arms and Delts': [
      createExercise('EZ Bar Curl', { sets: 4, reps: 10 }),
      createExercise('Skull Crusher', { sets: 4, reps: 10 }),
      createExercise('Cable Lateral Raise', { sets: 4, reps: 15 }),
    ],
    'Cardio Base': [
      createExercise('Brisk Walk', { duration: 25 }),
      createExercise('Bike Erg', { duration: 15 }),
      createExercise('Farmer Carry', { sets: 3, reps: 30 }),
    ],
    'Core and Conditioning': [
      createExercise('Plank', { sets: 3, reps: 40 }),
      createExercise('Medicine Ball Slam', { sets: 4, reps: 12 }),
      createExercise('Jump Rope', { sets: 3, reps: 45 }),
    ],
    'Upper Strength': [
      createExercise('Incline Bench Press', { sets: 4, reps: 6 }),
      createExercise('Seated Cable Row', { sets: 4, reps: 8 }),
      createExercise('Dumbbell Shoulder Press', { sets: 3, reps: 10 }),
    ],
    'Cardio Conditioning': [
      createExercise('Elliptical', { duration: 25 }),
      createExercise('Rower', { duration: 12 }),
      createExercise('Pallof Press', { sets: 3, reps: 12 }),
    ],
    'Conditioning': [
      createExercise('Sled Push', { sets: 6, reps: 20 }),
      createExercise('Rower Sprint', { sets: 6, reps: 30 }),
      createExercise('Battle Rope', { sets: 5, reps: 30 }),
    ],
    'Full Body Circuit': [
      createExercise('Kettlebell Deadlift', { sets: 3, reps: 12 }),
      createExercise('Push-Up', { sets: 3, reps: 12 }),
      createExercise('TRX Row', { sets: 3, reps: 12 }),
      createExercise('Step-Up', { sets: 3, reps: 10 }),
    ],
    'Push/Pull Blend': [
      createExercise('Incline Bench Press', { sets: 4, reps: 6 }),
      createExercise('Chest Supported Row', { sets: 4, reps: 8 }),
      createExercise('Cable Face Pull', { sets: 3, reps: 15 }),
    ],
    'Full Body Power': [
      createExercise('Trap Bar Deadlift', { sets: 4, reps: 5 }),
      createExercise('Push Press', { sets: 4, reps: 5 }),
      createExercise('Box Step-Up', { sets: 3, reps: 8 }),
    ],
    'Walk-Jog Intervals': [
      createExercise('Walk-Jog Intervals', { duration: 25, notes: 'Alternate 2 min walk, 1 min jog.' }),
      createExercise('Calf Raise', { sets: 3, reps: 15 }),
      createExercise('Side Plank', { sets: 3, reps: 20 }),
    ],
    'Core Stability': [
      createExercise('Dead Bug', { sets: 3, reps: 10 }),
      createExercise('Glute Bridge March', { sets: 3, reps: 12 }),
      createExercise('Pallof Press', { sets: 3, reps: 10 }),
    ],
    'Bike Recovery': [
      createExercise('Easy Cycling', { duration: 30 }),
      createExercise('Hamstring Stretch', { sets: 2, reps: 45 }),
      createExercise('Box Breathing', { sets: 3, reps: 5 }),
    ],
    'Tempo Cardio': [
      createExercise('Steady Jog', { duration: 30 }),
      createExercise('Rower', { duration: 10 }),
      createExercise('Plank', { sets: 3, reps: 30 }),
    ],
    'Strength Support': [
      createExercise('Romanian Deadlift', { sets: 3, reps: 8 }),
      createExercise('Split Squat', { sets: 3, reps: 10 }),
      createExercise('Seated Row', { sets: 3, reps: 10 }),
    ],
    'Stretch Recovery': [
      createExercise('Mobility Flow', { duration: 25 }),
      createExercise('Hamstring Stretch', { sets: 2, reps: 45 }),
      createExercise('Thoracic Rotation', { sets: 2, reps: 10 }),
    ],
    'Tempo Run': [
      createExercise('Tempo Run', { duration: 35 }),
      createExercise('Walking Lunge', { sets: 3, reps: 10 }),
      createExercise('Plank', { sets: 3, reps: 45 }),
    ],
    Intervals: [
      createExercise('400m Intervals', { sets: 6, reps: 1, notes: 'Run 400m hard, recover 90 seconds.' }),
      createExercise('Skater Hop', { sets: 3, reps: 12 }),
      createExercise('Dead Bug', { sets: 3, reps: 10 }),
    ],
    'Long Cardio': [
      createExercise('Long Run', { duration: 50 }),
      createExercise('Bike Flush', { duration: 10 }),
    ],
    'Interval Session': [
      createExercise('Track Intervals', { sets: 8, reps: 1, notes: 'Hard repeat with full recovery.' }),
      createExercise('Calf Raise', { sets: 4, reps: 15 }),
      createExercise('Weighted Plank', { sets: 3, reps: 45 }),
    ],
    'Tempo Session': [
      createExercise('Tempo Run', { duration: 40 }),
      createExercise('Single-Leg RDL', { sets: 3, reps: 10 }),
      createExercise('Cable Chop', { sets: 3, reps: 12 }),
    ],
    'Recovery Ride': [
      createExercise('Easy Spin', { duration: 35 }),
      createExercise('Hip Mobility Flow', { duration: 15 }),
    ],
    'Long Endurance': [
      createExercise('Long Run', { duration: 60 }),
      createExercise('Walking Cooldown', { duration: 10 }),
    ],
    'Leg Strength': [
      createExercise('Back Squat', { sets: 4, reps: 5 }),
      createExercise('Romanian Deadlift', { sets: 4, reps: 6 }),
      createExercise('Reverse Lunge', { sets: 3, reps: 8 }),
    ],
    'Core and Cardio': [
      createExercise('Marching Plank', { sets: 3, reps: 12 }),
      createExercise('Brisk Walk', { duration: 20 }),
      createExercise('Step-Up', { sets: 3, reps: 12 }),
    ],
    'Full Body Athletic': [
      createExercise('Trap Bar Deadlift', { sets: 4, reps: 5 }),
      createExercise('Push Press', { sets: 3, reps: 6 }),
      createExercise('Medicine Ball Slam', { sets: 3, reps: 10 }),
    ],
    Rest: [],
    'Recovery Session': [],
  };

  const selectedExercises = exerciseMap[type] || [];

  if (type === 'Rest') {
    return [];
  }

  if (type === 'Recovery Session') {
    return [
      createExercise('Walking', { duration: 20, notes: 'Easy pace only.' }),
      createExercise('Mobility Flow', { duration: 15 }),
      createExercise('Diaphragmatic Breathing', { sets: 3, reps: 5 }),
    ];
  }

  if (experienceLevel === 'beginner') {
    return selectedExercises.map((exercise) => ({
      ...exercise,
      sets: exercise.sets ? Math.max(2, exercise.sets - 1) : exercise.sets,
      reps: exercise.reps && exercise.reps > 8 ? exercise.reps - 2 : exercise.reps,
    }));
  }

  if (experienceLevel === 'advanced') {
    return selectedExercises.map((exercise) => ({
      ...exercise,
      sets: exercise.sets ? exercise.sets + 1 : exercise.sets,
      reps: exercise.reps && exercise.reps < 15 ? exercise.reps + 1 : exercise.reps,
    }));
  }

  return selectedExercises;
};

const applyInjuryAdjustments = (dayPlan, injuryHistory) => {
  const normalizedInjuries = injuryHistory.map((injury) => injury.toLowerCase());
  const warnings = [...dayPlan.warnings];

  const adjustedExercises = dayPlan.exercises.map((exercise) => {
    const lowerName = exercise.name.toLowerCase();

    if (normalizedInjuries.some((injury) => injury.includes('knee')) && (lowerName.includes('squat') || lowerName.includes('lunge'))) {
      warnings.push('Knee history detected: high-flexion movements were replaced with joint-friendly alternatives.');
      return {
        ...createExercise('Leg Press', {
          sets: exercise.sets || 3,
          reps: exercise.reps || 10,
          notes: 'Use a controlled range and stop short of discomfort.',
          substitutedFrom: exercise.name,
        }),
      };
    }

    if (normalizedInjuries.some((injury) => injury.includes('shoulder')) && (lowerName.includes('press') || lowerName.includes('dip'))) {
      warnings.push('Shoulder history detected: pressing volume was reduced and joint-friendly movements were preferred.');
      return {
        ...createExercise('Landmine Press', {
          sets: exercise.sets || 3,
          reps: exercise.reps || 10,
          notes: 'Neutral pressing angle for shoulder comfort.',
          substitutedFrom: exercise.name,
        }),
      };
    }

    if (normalizedInjuries.some((injury) => injury.includes('back')) && lowerName.includes('deadlift')) {
      warnings.push('Back history detected: hinge loading was softened.');
      return {
        ...createExercise('Glute Bridge', {
          sets: exercise.sets || 3,
          reps: 12,
          notes: 'Focus on controlled hip extension.',
          substitutedFrom: exercise.name,
        }),
      };
    }

    return exercise;
  });

  return {
    ...dayPlan,
    exercises: adjustedExercises,
    warnings: Array.from(new Set(warnings)),
  };
};

const applySleepAdjustments = (dayPlan, sleepQuality) => {
  if (sleepQuality !== 'poor') {
    return dayPlan;
  }

  if (dayPlan.intensity === 'high') {
    return createDayPlan({
      workoutType: 'Recovery Reset',
      intensity: 'low',
      duration: 30,
      focus: 'Nervous system recovery and light movement',
      recoveryNotes: 'Low sleep quality detected. Swap the hard session for easier recovery work.',
      warnings: ['Low sleep quality: intense training reduced for recovery.'],
      exercises: [
        createExercise('Walking', { duration: 20, notes: 'Easy conversational pace.' }),
        createExercise('Mobility Flow', { duration: 10 }),
        createExercise('Breathing Reset', { sets: 3, reps: 5 }),
      ],
    });
  }

  return {
    ...dayPlan,
    duration: Math.max(20, dayPlan.duration - 10),
    recoveryNotes: `${dayPlan.recoveryNotes} Sleep quality was low, so keep effort conservative.`,
    warnings: Array.from(new Set([...dayPlan.warnings, 'Low sleep quality: keep this session lighter than planned.'])),
  };
};

module.exports = {
  createDayPlan,
  getSleepQuality,
  getGoalTemplate,
  getExercisesForType,
  applyInjuryAdjustments,
  applySleepAdjustments,
};
