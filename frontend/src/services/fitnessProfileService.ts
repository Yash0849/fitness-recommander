import { getStoredToken, invalidateStoredAuth } from '../utils/authStorage';

const API_BASE_URL = 'http://localhost:5000/api';

export interface FitnessProfile {
  _id?: string;
  fullName: string;
  username: string;
  profilePhoto?: string;
  age: number;
  gender: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';
  height: number;
  weight: number;
  bmi: number;
  fitnessGoal: 'weight-loss' | 'muscle-gain' | 'maintenance' | 'endurance' | 'general-fitness';
  sleepHours: number;
  injuryHistory: string[];
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  createdAt?: string;
  updatedAt?: string;
}

export type FitnessProfilePayload = Omit<FitnessProfile, '_id' | 'bmi' | 'createdAt' | 'updatedAt'>;

const request = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const token = getStoredToken();

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401 || (response.status === 400 && data.message === 'Invalid token')) {
      invalidateStoredAuth();
    }

    const error = new Error(data.message || 'Request failed') as Error & {
      status?: number;
      details?: Record<string, string>;
    };

    error.status = response.status;
    error.details = data.errors;
    throw error;
  }

  return data as T;
};

export const fitnessProfileService = {
  getMyProfile: async () => {
    const response = await request<{ success: boolean; profile: FitnessProfile | null }>('/profiles/me');
    return response.profile;
  },

  saveMyProfile: async (payload: FitnessProfilePayload) => {
    const response = await request<{ success: boolean; message: string; profile: FitnessProfile }>('/profiles/me', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });

    return response.profile;
  },
};
