// Exercise recommendation system based on user profile
import { UserProfile } from './localStorage';

export interface ExerciseRecommendation {
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  description: string;
  muscleGroups: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface WorkoutPlanRecommendation {
  name: string;
  description: string;
  exercises: ExerciseRecommendation[];
  duration: number; // in minutes
  frequency: string; // e.g., "3 times per week"
}

// Exercise database
const exercises: ExerciseRecommendation[] = [
  // Cardio exercises
  {
    name: 'Running',
    sets: 1,
    reps: 20, // minutes
    description: 'Moderate pace running for cardiovascular health',
    muscleGroups: ['Legs', 'Cardio'],
    difficulty: 'beginner'
  },
  {
    name: 'Cycling',
    sets: 1,
    reps: 30,
    description: 'Stationary or outdoor cycling',
    muscleGroups: ['Legs', 'Cardio'],
    difficulty: 'beginner'
  },
  {
    name: 'Jump Rope',
    sets: 3,
    reps: 60, // seconds
    description: 'High-intensity cardio exercise',
    muscleGroups: ['Full Body', 'Cardio'],
    difficulty: 'intermediate'
  },
  
  // Strength exercises - Upper Body
  {
    name: 'Push-ups',
    sets: 3,
    reps: 10,
    description: 'Classic bodyweight exercise for chest, shoulders, and triceps',
    muscleGroups: ['Chest', 'Shoulders', 'Triceps'],
    difficulty: 'beginner'
  },
  {
    name: 'Pull-ups',
    sets: 3,
    reps: 8,
    description: 'Upper body strength builder',
    muscleGroups: ['Back', 'Biceps'],
    difficulty: 'intermediate'
  },
  {
    name: 'Dumbbell Bench Press',
    sets: 4,
    reps: 8,
    weight: 10, // kg
    description: 'Chest and triceps strength exercise',
    muscleGroups: ['Chest', 'Triceps'],
    difficulty: 'intermediate'
  },
  {
    name: 'Bicep Curls',
    sets: 3,
    reps: 12,
    weight: 5,
    description: 'Isolated bicep exercise',
    muscleGroups: ['Biceps'],
    difficulty: 'beginner'
  },
  {
    name: 'Shoulder Press',
    sets: 3,
    reps: 10,
    weight: 8,
    description: 'Shoulder strength and stability',
    muscleGroups: ['Shoulders', 'Triceps'],
    difficulty: 'intermediate'
  },
  
  // Strength exercises - Lower Body
  {
    name: 'Squats',
    sets: 4,
    reps: 12,
    description: 'Fundamental lower body exercise',
    muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings'],
    difficulty: 'beginner'
  },
  {
    name: 'Lunges',
    sets: 3,
    reps: 12,
    description: 'Unilateral leg exercise',
    muscleGroups: ['Quadriceps', 'Glutes'],
    difficulty: 'beginner'
  },
  {
    name: 'Deadlifts',
    sets: 4,
    reps: 8,
    weight: 20,
    description: 'Full body compound movement',
    muscleGroups: ['Back', 'Hamstrings', 'Glutes'],
    difficulty: 'advanced'
  },
  {
    name: 'Leg Press',
    sets: 4,
    reps: 12,
    weight: 30,
    description: 'Machine-based leg exercise',
    muscleGroups: ['Quadriceps', 'Glutes'],
    difficulty: 'intermediate'
  },
  
  // Core exercises
  {
    name: 'Plank',
    sets: 3,
    reps: 60, // seconds
    description: 'Core stability exercise',
    muscleGroups: ['Core', 'Abs'],
    difficulty: 'beginner'
  },
  {
    name: 'Crunches',
    sets: 3,
    reps: 15,
    description: 'Abdominal strengthening',
    muscleGroups: ['Abs'],
    difficulty: 'beginner'
  },
  {
    name: 'Russian Twists',
    sets: 3,
    reps: 20,
    description: 'Rotational core exercise',
    muscleGroups: ['Core', 'Obliques'],
    difficulty: 'intermediate'
  },
  
  // Flexibility & Mobility
  {
    name: 'Yoga Stretches',
    sets: 1,
    reps: 20, // minutes
    description: 'Full body flexibility and mobility',
    muscleGroups: ['Full Body', 'Flexibility'],
    difficulty: 'beginner'
  },
  {
    name: 'Hamstring Stretch',
    sets: 3,
    reps: 30, // seconds
    description: 'Improve hamstring flexibility',
    muscleGroups: ['Hamstrings', 'Flexibility'],
    difficulty: 'beginner'
  }
];

/**
 * Get personalized exercise recommendations based on user profile
 */
export function getPersonalizedRecommendations(profile: UserProfile | undefined): WorkoutPlanRecommendation[] {
  if (!profile) {
    return getDefaultRecommendations();
  }

  const goal = profile.goal?.toLowerCase() || '';
  const activityLevel = profile.activityLevel?.toLowerCase() || 'moderate';
  const weight = profile.weight || 70;
  const height = profile.height || 170;
  const bmi = weight / ((height / 100) ** 2);

  let recommendedExercises: ExerciseRecommendation[] = [];
  let difficulty: 'beginner' | 'intermediate' | 'advanced' = 'beginner';
  let planName = '';
  let planDescription = '';

  // Determine difficulty based on activity level
  if (activityLevel.includes('high') || activityLevel.includes('active')) {
    difficulty = 'advanced';
  } else if (activityLevel.includes('moderate') || activityLevel.includes('regular')) {
    difficulty = 'intermediate';
  } else {
    difficulty = 'beginner';
  }

  // Goal-based recommendations
  if (goal.includes('weight loss') || goal.includes('lose weight') || goal.includes('fat loss')) {
    planName = 'Weight Loss Program';
    planDescription = 'High-intensity cardio and strength training to burn calories and build muscle';
    
    recommendedExercises = [
      { ...exercises.find(e => e.name === 'Running')!, sets: 1, reps: 30 },
      { ...exercises.find(e => e.name === 'Squats')!, sets: 4, reps: 15 },
      { ...exercises.find(e => e.name === 'Push-ups')!, sets: 3, reps: 12 },
      { ...exercises.find(e => e.name === 'Plank')!, sets: 3, reps: 45 },
      { ...exercises.find(e => e.name === 'Jump Rope')!, sets: 3, reps: 60 }
    ].filter(e => e !== undefined) as ExerciseRecommendation[];

  } else if (goal.includes('muscle') || goal.includes('gain') || goal.includes('strength') || goal.includes('bulk')) {
    planName = 'Muscle Building Program';
    planDescription = 'Progressive strength training to build muscle mass';
    
    recommendedExercises = [
      { ...exercises.find(e => e.name === 'Squats')!, sets: 4, reps: 10, weight: weight * 0.5 },
      { ...exercises.find(e => e.name === 'Deadlifts')!, sets: 4, reps: 8, weight: weight * 0.6 },
      { ...exercises.find(e => e.name === 'Dumbbell Bench Press')!, sets: 4, reps: 8, weight: weight * 0.3 },
      { ...exercises.find(e => e.name === 'Pull-ups')!, sets: 4, reps: 8 },
      { ...exercises.find(e => e.name === 'Shoulder Press')!, sets: 3, reps: 10, weight: weight * 0.2 },
      { ...exercises.find(e => e.name === 'Bicep Curls')!, sets: 3, reps: 12, weight: weight * 0.15 }
    ].filter(e => e !== undefined) as ExerciseRecommendation[];

  } else if (goal.includes('endurance') || goal.includes('stamina') || goal.includes('cardio')) {
    planName = 'Endurance Training Program';
    planDescription = 'Cardiovascular exercises to improve stamina and endurance';
    
    recommendedExercises = [
      { ...exercises.find(e => e.name === 'Running')!, sets: 1, reps: 45 },
      { ...exercises.find(e => e.name === 'Cycling')!, sets: 1, reps: 40 },
      { ...exercises.find(e => e.name === 'Jump Rope')!, sets: 4, reps: 90 },
      { ...exercises.find(e => e.name === 'Plank')!, sets: 3, reps: 60 }
    ].filter(e => e !== undefined) as ExerciseRecommendation[];

  } else if (goal.includes('flexibility') || goal.includes('mobility') || goal.includes('stretch')) {
    planName = 'Flexibility & Mobility Program';
    planDescription = 'Stretching and mobility exercises for improved flexibility';
    
    recommendedExercises = [
      { ...exercises.find(e => e.name === 'Yoga Stretches')!, sets: 1, reps: 30 },
      { ...exercises.find(e => e.name === 'Hamstring Stretch')!, sets: 3, reps: 45 },
      { ...exercises.find(e => e.name === 'Plank')!, sets: 2, reps: 30 }
    ].filter(e => e !== undefined) as ExerciseRecommendation[];

  } else if (goal.includes('maintain') || goal.includes('general') || goal.includes('health')) {
    planName = 'General Fitness Program';
    planDescription = 'Balanced workout for overall health and fitness';
    
    recommendedExercises = [
      { ...exercises.find(e => e.name === 'Squats')!, sets: 3, reps: 12 },
      { ...exercises.find(e => e.name === 'Push-ups')!, sets: 3, reps: 10 },
      { ...exercises.find(e => e.name === 'Plank')!, sets: 3, reps: 45 },
      { ...exercises.find(e => e.name === 'Lunges')!, sets: 3, reps: 12 },
      { ...exercises.find(e => e.name === 'Crunches')!, sets: 3, reps: 15 }
    ].filter(e => e !== undefined) as ExerciseRecommendation[];

  } else {
    // Default balanced program
    return getDefaultRecommendations();
  }

  // Adjust difficulty based on user's activity level
  recommendedExercises = recommendedExercises.map(ex => {
    if (difficulty === 'beginner' && ex.difficulty === 'advanced') {
      // Reduce intensity for beginners
      return {
        ...ex,
        sets: Math.max(2, ex.sets - 1),
        reps: Math.max(8, ex.reps - 2),
        weight: ex.weight ? ex.weight * 0.7 : undefined
      };
    } else if (difficulty === 'advanced' && ex.difficulty === 'beginner') {
      // Increase intensity for advanced
      return {
        ...ex,
        sets: ex.sets + 1,
        reps: ex.reps + 3,
        weight: ex.weight ? ex.weight * 1.3 : undefined
      };
    }
    return ex;
  });

  // Calculate total duration (estimate)
  const totalDuration = recommendedExercises.reduce((total, ex) => {
    if (ex.name.includes('Running') || ex.name.includes('Cycling') || ex.name.includes('Yoga')) {
      return total + ex.reps; // minutes
    }
    return total + (ex.sets * 2); // 2 minutes per set
  }, 0);

  return [{
    name: planName,
    description: planDescription,
    exercises: recommendedExercises,
    duration: totalDuration,
    frequency: difficulty === 'beginner' ? '3 times per week' : 
                difficulty === 'intermediate' ? '4-5 times per week' : 
                '5-6 times per week'
  }];
}

/**
 * Get default recommendations when no profile data is available
 */
function getDefaultRecommendations(): WorkoutPlanRecommendation[] {
  return [{
    name: 'Beginner Full Body Workout',
    description: 'A balanced workout for beginners to improve overall fitness',
    exercises: [
      { ...exercises.find(e => e.name === 'Squats')!, sets: 3, reps: 10 },
      { ...exercises.find(e => e.name === 'Push-ups')!, sets: 3, reps: 8 },
      { ...exercises.find(e => e.name === 'Plank')!, sets: 3, reps: 30 },
      { ...exercises.find(e => e.name === 'Lunges')!, sets: 3, reps: 10 },
      { ...exercises.find(e => e.name === 'Crunches')!, sets: 3, reps: 12 }
    ].filter(e => e !== undefined) as ExerciseRecommendation[],
    duration: 30,
    frequency: '3 times per week'
  }];
}

/**
 * Get all available exercises
 */
export function getAllExercises(): ExerciseRecommendation[] {
  return exercises;
}

