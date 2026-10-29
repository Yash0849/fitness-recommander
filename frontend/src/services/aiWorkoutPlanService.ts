import { getStoredToken, invalidateStoredAuth } from '../utils/authStorage';

const API_BASE_URL = 'http://localhost:5000/api';

export type WorkoutIntensity = 'low' | 'moderate' | 'high';
export type SleepQuality = 'poor' | 'average' | 'good';

export interface WorkoutPlanExercise {
  name: string;
  sets: number;
  reps: number;
  duration: number;
  notes: string;
  substitutedFrom?: string;
}

export interface WorkoutPlanDay {
  workoutType: string;
  exercises: WorkoutPlanExercise[];
  duration: number;
  intensity: WorkoutIntensity;
  focus: string;
  recoveryNotes: string;
  warnings: string[];
}

export interface WorkoutPlanRecord {
  _id: string;
  userId: string;
  goal: string;
  bmi: number;
  age: number;
  sleepQuality: SleepQuality;
  injuryHistory: string[];
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  weeklyPlan: Record<string, WorkoutPlanDay>;
  recommendations: string[];
  warnings: string[];
  createdAt: string;
  updatedAt: string;
}

const request = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(getStoredToken() ? { Authorization: `Bearer ${getStoredToken()}` } : {}),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401 || (response.status === 400 && data.message === 'Invalid token')) {
      invalidateStoredAuth();
    }

    throw new Error(data.message || 'Request failed');
  }

  return data as T;
};

export const aiWorkoutPlanService = {
  generate: async (sleepHours?: number) => {
    return request<{ success: boolean; workoutPlan: WorkoutPlanRecord; message: string }>('/workouts/generate', {
      method: 'POST',
      body: JSON.stringify(sleepHours !== undefined ? { sleepHours } : {}),
    });
  },

  getByUserId: async (userId: string) => {
    return request<{ success: boolean; workoutPlans: WorkoutPlanRecord[] }>(`/workouts/plans/${userId}`);
  },

  update: async (id: string, payload: Partial<WorkoutPlanRecord>) => {
    return request<{ success: boolean; workoutPlan: WorkoutPlanRecord; message: string }>(`/workouts/plans/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  remove: async (id: string) => {
    return request<{ success: boolean; message: string }>(`/workouts/plans/${id}`, {
      method: 'DELETE',
    });
  },
};
