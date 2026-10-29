import type { WorkoutIntensity, WorkoutPlanDay, WorkoutPlanRecord } from '../services/aiWorkoutPlanService';

export const orderedDays = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

export const formatDayLabel = (day: string) => day.charAt(0).toUpperCase() + day.slice(1);

export const formatGoalLabel = (goal: string) =>
  goal
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

export const intensityClasses: Record<WorkoutIntensity, string> = {
  low: 'bg-emerald-500/15 text-emerald-300 border border-emerald-400/20',
  moderate: 'bg-amber-500/15 text-amber-200 border border-amber-400/20',
  high: 'bg-rose-500/15 text-rose-200 border border-rose-400/20',
};

export const getPlanSummary = (plan: WorkoutPlanRecord) => {
  const days = Object.values(plan.weeklyPlan);
  const totalDuration = days.reduce((sum, day) => sum + day.duration, 0);
  const totalExercises = days.reduce((sum, day) => sum + day.exercises.length, 0);
  const intenseDays = days.filter((day) => day.intensity === 'high').length;
  const recoveryDays = days.filter((day) => day.workoutType.toLowerCase().includes('recovery') || day.workoutType === 'Rest').length;

  return {
    totalDuration,
    totalExercises,
    intenseDays,
    recoveryDays,
  };
};

export const getDayWarnings = (day: WorkoutPlanDay, planWarnings: string[]) => {
  return Array.from(new Set([...day.warnings, ...planWarnings]));
};
