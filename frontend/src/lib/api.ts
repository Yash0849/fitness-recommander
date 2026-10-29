import { getStoredToken, invalidateStoredAuth } from '../utils/authStorage';

const API_BASE_URL = 'http://localhost:5000/api';

const notifyProfileListeners = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('profile-updated'));
  }
};

// Helper function to make API requests
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getStoredToken();
  console.log('API Request Debug:', { endpoint, hasToken: !!token, token: token ? token.substring(0, 20) + '...' : 'none' });
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    if (response.status === 401 || (response.status === 400 && error.message === 'Invalid token')) {
      invalidateStoredAuth();
    }
    console.error('API Error:', { status: response.status, error });
    throw new Error(error.message || 'API request failed');
  }

  return response.json();
};

// Authentication API
export const authAPI = {
  register: async (data: { username: string; email: string; password: string }) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  login: async (data: { email: string; password: string }) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// Workout API
export const workoutAPI = {
  create: async (data: { workoutType: string; duration: number; caloriesBurned: number; date?: string }) => {
    return apiRequest('/workouts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getAll: async () => {
    return apiRequest('/workouts');
  },

  getById: async (workoutId: string) => {
    return apiRequest(`/workouts/single/${workoutId}`);
  },

  update: async (workoutId: string, data: any) => {
    return apiRequest(`/workouts/${workoutId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (workoutId: string) => {
    return apiRequest(`/workouts/${workoutId}`, {
      method: 'DELETE',
    });
  },
};

// Goal API
export const goalAPI = {
  create: async (data: { targetCalories?: number; targetSteps?: number; targetMinutes?: number }) => {
    return apiRequest('/goals', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getAll: async () => {
    return apiRequest('/goals');
  },

  update: async (goalId: string, data: any) => {
    return apiRequest(`/goals/${goalId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (goalId: string) => {
    return apiRequest(`/goals/${goalId}`, {
      method: 'DELETE',
    });
  },
};

// Diet Log API
export const dietLogAPI = {
  create: async (data: { date?: string; meals: any[]; totalCalories?: number }) => {
    return apiRequest('/dietlogs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getAll: async () => {
    return apiRequest('/dietlogs');
  },

  update: async (id: string, data: any) => {
    return apiRequest(`/dietlogs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/dietlogs/${id}`, {
      method: 'DELETE',
    });
  },
};

// Progress Log API
export const progressLogAPI = {
  create: async (data: { weight?: number; bodyFat?: number; notes?: string }) => {
    return apiRequest('/progresslogs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getAll: async () => {
    return apiRequest('/progresslogs');
  },

  update: async (id: string, data: any) => {
    return apiRequest(`/progresslogs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/progresslogs/${id}`, {
      method: 'DELETE',
    });
  },
};

// Todo API
export const todoAPI = {
  create: async (data: { text: string }) => {
    return apiRequest('/todos', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getAll: async () => {
    return apiRequest('/todos');
  },

  update: async (id: string, data: any) => {
    return apiRequest(`/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/todos/${id}`, {
      method: 'DELETE',
    });
  },
};

// User Profile API (using localStorage for now since backend doesn't have profile endpoints)
export const profileAPI = {
  get: (userId: string) => {
    const profiles = JSON.parse(localStorage.getItem('fitness_tracker_user_profiles') || '[]');
    return profiles.find((p: any) => p.id === userId)?.profile;
  },

  save: (userId: string, profile: any, email?: string) => {
    const profiles = JSON.parse(localStorage.getItem('fitness_tracker_user_profiles') || '[]');
    const index = profiles.findIndex((p: any) => p.id === userId);
    
    if (index >= 0) {
      profiles[index].profile = profile;
      if (email) {
        profiles[index].email = email;
      }
    } else {
      profiles.push({ id: userId, email: email || '', profile });
    }
    
    localStorage.setItem('fitness_tracker_user_profiles', JSON.stringify(profiles));
    notifyProfileListeners();
  },

  // Ensure user exists in profiles (for login/registration)
  ensureUser: (userId: string, email: string) => {
    const profiles = JSON.parse(localStorage.getItem('fitness_tracker_user_profiles') || '[]');
    const index = profiles.findIndex((p: any) => p.id === userId);
    
    if (index < 0) {
      // User doesn't exist, create entry
      profiles.push({ 
        id: userId, 
        email: email, 
        profile: {
          username: email.split('@')[0],
          fullName: email.split('@')[0]
        }
      });
      localStorage.setItem('fitness_tracker_user_profiles', JSON.stringify(profiles));
      notifyProfileListeners();
    } else if (!profiles[index].email) {
      // User exists but email is missing, update it
      profiles[index].email = email;
      localStorage.setItem('fitness_tracker_user_profiles', JSON.stringify(profiles));
      notifyProfileListeners();
    }
  },
};

// Health Metrics API (using localStorage for now)
export const healthMetricsAPI = {
  get: (userId: string) => {
    const metrics = JSON.parse(localStorage.getItem('fitness_tracker_health_metrics') || '[]');
    return metrics.filter((m: any) => m.userId === userId);
  },

  save: (metrics: any) => {
    const allMetrics = JSON.parse(localStorage.getItem('fitness_tracker_health_metrics') || '[]');
    const index = allMetrics.findIndex((m: any) => m.id === metrics.id);
    
    if (index >= 0) {
      allMetrics[index] = metrics;
    } else {
      allMetrics.push(metrics);
    }
    
    localStorage.setItem('fitness_tracker_health_metrics', JSON.stringify(allMetrics));
  },
};

// Chat API (using localStorage for now)
export const chatAPI = {
  getMessages: (userId: string) => {
    const messages = JSON.parse(localStorage.getItem('fitness_tracker_chat_messages') || '[]');
    return messages.filter((msg: any) => msg.senderId === userId || msg.receiverId === userId);
  },

  saveMessage: (message: any) => {
    const messages = JSON.parse(localStorage.getItem('fitness_tracker_chat_messages') || '[]');
    messages.push(message);
    localStorage.setItem('fitness_tracker_chat_messages', JSON.stringify(messages));
  },

  getAllUsers: () => {
    return JSON.parse(localStorage.getItem('fitness_tracker_user_profiles') || '[]');
  },
};

// Food Nutrition API using Local Database and Edamam Food Database
import { searchLocalFoodDatabase } from './foodDatabase';

export interface FoodNutrition {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export const foodAPI = {
  // Get nutrition data for a food item
  // First checks local database (Indian foods, snacks, fruits, common foods)
  // Then falls back to Edamam Food Database API if not found locally
  // Note: This function only returns nutrition data, it preserves the user's food name
  searchFood: async (foodName: string): Promise<FoodNutrition | null> => {
    // First, try local database (fast and reliable for Indian foods)
    const localFood = searchLocalFoodDatabase(foodName);
    if (localFood) {
      return {
        calories: localFood.calories,
        protein: localFood.protein,
        carbs: localFood.carbs,
        fats: localFood.fats,
      };
    }

    // If not found locally, try external APIs
    try {
      // Using a public demo API key - replace with your own from Edamam
      // For production, store these in environment variables
      const APP_ID = import.meta.env.VITE_EDAMAM_APP_ID || 'demo_app_id';
      const APP_KEY = import.meta.env.VITE_EDAMAM_APP_KEY || 'demo_app_key';
      
      // If using demo keys, use a fallback API (USDA)
      if (APP_ID === 'demo_app_id' || APP_KEY === 'demo_app_key') {
        return foodAPI.searchFoodFallback(foodName);
      }

      const response = await fetch(
        `https://api.edamam.com/api/food-database/v2/parser?ingr=${encodeURIComponent(foodName)}&app_id=${APP_ID}&app_key=${APP_KEY}`
      );

      if (!response.ok) {
        throw new Error('Food API request failed');
      }

      const data = await response.json();
      
      if (data.hints && data.hints.length > 0) {
        const food = data.hints[0].food;
        const nutrients = food.nutrients;
        
        // Only return nutrition data, preserve user's food name
        return {
          calories: Math.round(nutrients.ENERC_KCAL || 0),
          protein: Math.round((nutrients.PROCNT || 0) * 10) / 10, // Round to 1 decimal
          carbs: Math.round((nutrients.CHOCDF || 0) * 10) / 10,
          fats: Math.round((nutrients.FAT || 0) * 10) / 10,
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching food nutrition:', error);
      // Fallback to alternative API
      return foodAPI.searchFoodFallback(foodName);
    }
  },

  // Fallback API using USDA FoodData Central (free, no API key needed)
  searchFoodFallback: async (foodName: string): Promise<FoodNutrition | null> => {
    try {
      const response = await fetch(
        `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=DEMO_KEY&query=${encodeURIComponent(foodName)}&pageSize=1`
      );

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      
      if (data.foods && data.foods.length > 0) {
        const food = data.foods[0];
        const nutrients = food.foodNutrients || [];
        
        const getNutrient = (nutrientId: number) => {
          const nutrient = nutrients.find((n: any) => n.nutrientId === nutrientId);
          return nutrient ? nutrient.value : 0;
        };

        // Only return nutrition data, preserve user's food name
        return {
          calories: Math.round(getNutrient(1008) || 0), // Energy (kcal)
          protein: Math.round((getNutrient(1003) || 0) * 10) / 10, // Protein
          carbs: Math.round((getNutrient(1005) || 0) * 10) / 10, // Carbohydrate
          fats: Math.round((getNutrient(1004) || 0) * 10) / 10, // Total lipid (fat)
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching food nutrition from fallback API:', error);
      return null;
    }
  },
}; 
