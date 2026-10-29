const API_BASE_URL = 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('auth_token');

const request = async <T>(endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Posture request failed');
  }

  return data as T;
};

export interface PoseLandmarkPoint {
  x: number;
  y: number;
  z?: number;
  visibility?: number;
}

export interface FeedbackMessage {
  message: string;
  severity: 'success' | 'info' | 'warning' | 'error';
  postureScore?: number;
  repCount?: number;
  angles?: Record<string, number>;
}

export interface PostureAnalysisResponse {
  success: boolean;
  analysis: {
    angles: Record<string, number>;
    postureScore: number;
    feedback: FeedbackMessage[];
    repDelta: number;
    phase: string;
  };
}

export const postureApiService = {
  analyze: async (payload: { exercise: string; landmarks: PoseLandmarkPoint[]; previousState: { phase: string } }) => {
    return request<PostureAnalysisResponse>('/posture/analyze', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  saveSession: async (payload: {
    exercise: string;
    reps: number;
    averageScore: number;
    durationSeconds: number;
    startedAt: string;
    endedAt: string;
    framesAnalyzed: number;
    feedback: FeedbackMessage[];
  }) => {
    return request<{ success: boolean; sessionId: string }>('/posture/session', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  getHistory: async (userId: string) => {
    return request<{ success: boolean; sessions: any[] }>(`/posture/history/${userId}`);
  },
};
