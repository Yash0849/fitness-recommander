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
    throw new Error(data.message || 'Vision request failed');
  }

  return data as T;
};

export interface DetectedNutritionItem {
  foodName: string;
  confidence: number;
  servingEstimate: string;
  estimationSource?: string;
  notes?: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface FoodDetectionResponse {
  success: boolean;
  recognitionId: string;
  nutritionAnalysisId: string;
  detectedItems: DetectedNutritionItem[];
  totals: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  autoAddedToDiet: boolean;
  dietLogId: string;
  predictions?: { label: string; confidence: number }[];
}

export const visionApiService = {
  detectFood: async (payload: {
    imageData: string;
    fileName?: string;
    mealType: string;
    source: 'upload' | 'camera';
    predictions: { label: string; confidence: number }[];
  }) => {
    return request<FoodDetectionResponse>('/vision/food-detect', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  getNutritionResult: async (id: string) => {
    return request<{ success: boolean; analysis: unknown }>(`/vision/nutrition/${id}`);
  },
};
