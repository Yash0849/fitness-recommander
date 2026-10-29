import type { DietLog, HealthMetrics, ProgressLog, UserProfile, WorkoutPlan } from '../lib/localStorage';

export type TrendFilter = 'weekly' | 'monthly';

export interface MetricTarget {
  key: string;
  label: string;
  value: number;
  unit: string;
  target: number;
  color: string;
  trailColor: string;
  accent: string;
  subtitle: string;
}

export interface ActivityRingData {
  key: string;
  label: string;
  value: number;
  target: number;
  color: string;
}

export interface TrendPoint {
  label: string;
  calories: number;
  weight: number;
  hydration: number;
  workouts: number;
  sleep: number;
}

export interface BodyRegion {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  score: number;
  side: 'front' | 'back';
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_SLOTS = ['W1', 'W2', 'W3', 'W4'];

export function buildHealthTargets(profile: UserProfile | null, metrics: HealthMetrics): MetricTarget[] {
  const weight = profile?.weight ?? 72;
  const hydrationTarget = Math.max(2200, Math.round(weight * 33));

  return [
    {
      key: 'heart',
      label: 'Heart Rate',
      value: metrics.heartRate,
      unit: 'BPM',
      target: 180,
      color: '#fb7185',
      trailColor: 'rgba(251, 113, 133, 0.12)',
      accent: 'from-rose-400/70 via-red-400/50 to-pink-400/60',
      subtitle: 'Resting trend stable',
    },
    {
      key: 'oxygen',
      label: 'Oxygen',
      value: metrics.oxygenLevel,
      unit: '%',
      target: 100,
      color: '#60a5fa',
      trailColor: 'rgba(96, 165, 250, 0.12)',
      accent: 'from-sky-400/70 via-cyan-400/40 to-blue-400/60',
      subtitle: 'Recovery saturation',
    },
    {
      key: 'hydration',
      label: 'Hydration',
      value: metrics.waterIntake,
      unit: 'ml',
      target: hydrationTarget,
      color: '#5eead4',
      trailColor: 'rgba(94, 234, 212, 0.12)',
      accent: 'from-cyan-300/70 via-teal-400/45 to-emerald-400/55',
      subtitle: 'Daily fluid intake',
    },
    {
      key: 'calories',
      label: 'Calories',
      value: Math.round(metrics.steps * 0.045 + metrics.heartRate * 3.2),
      unit: 'kcal',
      target: 800,
      color: '#fbbf24',
      trailColor: 'rgba(251, 191, 36, 0.12)',
      accent: 'from-amber-300/70 via-orange-400/50 to-yellow-300/50',
      subtitle: 'Burn estimate today',
    },
    {
      key: 'sleep',
      label: 'Sleep',
      value: Math.min(100, 62 + Math.round(metrics.oxygenLevel / 3) + Math.round(metrics.waterIntake / 250)),
      unit: '%',
      target: 100,
      color: '#a78bfa',
      trailColor: 'rgba(167, 139, 250, 0.12)',
      accent: 'from-violet-300/65 via-indigo-400/45 to-blue-400/55',
      subtitle: 'Recovery readiness',
    },
  ];
}

export function buildActivityRings(targets: MetricTarget[], workoutPlans: WorkoutPlan[], todos: Todo[]): ActivityRingData[] {
  const completedTasks = todos.filter((todo) => todo.completed).length;

  return [
    {
      key: 'burn',
      label: 'Calorie Burn',
      value: targets.find((target) => target.key === 'calories')?.value ?? 0,
      target: 800,
      color: '#fb7185',
    },
    {
      key: 'workout',
      label: 'Workout Completion',
      value: Math.min(workoutPlans.length * 25, 100),
      target: 100,
      color: '#60a5fa',
    },
    {
      key: 'hydration',
      label: 'Hydration Goal',
      value: targets.find((target) => target.key === 'hydration')?.value ?? 0,
      target: targets.find((target) => target.key === 'hydration')?.target ?? 2500,
      color: '#5eead4',
    },
    {
      key: 'activity',
      label: 'Daily Activity',
      value: Math.min(completedTasks * 20 + workoutPlans.length * 12, 100),
      target: 100,
      color: '#fbbf24',
    },
  ];
}

export function buildTrendData(
  filter: TrendFilter,
  metrics: HealthMetrics,
  dietLogs: DietLog[],
  progressLogs: ProgressLog[],
  workoutPlans: WorkoutPlan[]
): TrendPoint[] {
  const length = filter === 'weekly' ? 7 : 4;

  return Array.from({ length }).map((_, index) => {
    const calorieBase = dietLogs[index]?.calories ?? 1750 + index * 55;
    const protein = dietLogs[index]?.protein ?? 110 + index * 3;
    const weight = progressLogs[index]?.weight ?? 72 - index * 0.3;
    const hydration = Math.min(metrics.waterIntake + index * 120, 3200);
    const workouts = Math.min(workoutPlans.length + index, 7);
    const sleep = Math.min(78 + index * 3 + Math.round(protein / 30), 96);

    return {
      label: filter === 'weekly' ? DAYS[(new Date().getDay() + index) % DAYS.length] : MONTH_SLOTS[index],
      calories: calorieBase,
      weight,
      hydration,
      workouts,
      sleep,
    };
  });
}

export function buildBodyRegions(workoutPlans: WorkoutPlan[]): BodyRegion[] {
  const joinedExercises = workoutPlans
    .flatMap((plan) => plan.exercises ?? [])
    .map((exercise) => exercise.name.toLowerCase())
    .join(' ');

  const scoreFor = (keywords: string[], fallback: number) =>
    keywords.some((keyword) => joinedExercises.includes(keyword)) ? 88 : fallback;

  return [
    { id: 'shoulders', name: 'Shoulders', x: 36, y: 18, width: 28, height: 10, score: scoreFor(['shoulder', 'press'], 42), side: 'front' },
    { id: 'chest', name: 'Chest', x: 35, y: 30, width: 30, height: 12, score: scoreFor(['bench', 'chest', 'push'], 64), side: 'front' },
    { id: 'core', name: 'Core', x: 39, y: 43, width: 22, height: 14, score: scoreFor(['core', 'abs', 'plank'], 58), side: 'front' },
    { id: 'arms', name: 'Arms', x: 22, y: 28, width: 13, height: 28, score: scoreFor(['curl', 'tricep', 'arm'], 67), side: 'front' },
    { id: 'quads', name: 'Quads', x: 40, y: 59, width: 20, height: 24, score: scoreFor(['squat', 'lunge', 'leg'], 74), side: 'front' },
    { id: 'back', name: 'Back', x: 35, y: 27, width: 30, height: 24, score: scoreFor(['row', 'deadlift', 'back'], 79), side: 'back' },
    { id: 'glutes', name: 'Glutes', x: 39, y: 55, width: 22, height: 15, score: scoreFor(['glute', 'hip'], 61), side: 'back' },
    { id: 'hamstrings', name: 'Hamstrings', x: 40, y: 70, width: 20, height: 18, score: scoreFor(['deadlift', 'hamstring'], 54), side: 'back' },
  ];
}

export function createTodayMetrics(userId: string): HealthMetrics {
  return {
    id: crypto.randomUUID(),
    userId,
    heartRate: 75,
    bloodPressure: {
      systolic: 120,
      diastolic: 80,
    },
    oxygenLevel: 98,
    steps: 0,
    waterIntake: 0,
    date: new Date().toISOString(),
  };
}
