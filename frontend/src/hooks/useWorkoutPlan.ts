import { useCallback, useEffect, useState } from 'react';
import { aiWorkoutPlanService, type WorkoutPlanRecord } from '../services/aiWorkoutPlanService';

interface UseWorkoutPlanOptions {
  userId?: string;
}

export function useWorkoutPlan({ userId }: UseWorkoutPlanOptions) {
  const [plans, setPlans] = useState<WorkoutPlanRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  const loadPlans = useCallback(async () => {
    if (!userId) {
      setPlans([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await aiWorkoutPlanService.getByUserId(userId);
      setPlans(response.workoutPlans || []);
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : 'Failed to load workout plans';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  const generatePlan = useCallback(async (sleepHours?: number) => {
    try {
      setGenerating(true);
      setError('');
      const response = await aiWorkoutPlanService.generate(sleepHours);
      setPlans((currentPlans) => [response.workoutPlan, ...currentPlans]);
      return response.workoutPlan;
    } catch (generateError) {
      const message = generateError instanceof Error ? generateError.message : 'Failed to generate workout plan';
      setError(message);
      throw generateError;
    } finally {
      setGenerating(false);
    }
  }, []);

  const deletePlan = useCallback(async (id: string) => {
    await aiWorkoutPlanService.remove(id);
    setPlans((currentPlans) => currentPlans.filter((plan) => plan._id !== id));
  }, []);

  const updatePlan = useCallback(async (id: string, payload: Partial<WorkoutPlanRecord>) => {
    const response = await aiWorkoutPlanService.update(id, payload);
    setPlans((currentPlans) =>
      currentPlans.map((plan) => (plan._id === id ? response.workoutPlan : plan))
    );
    return response.workoutPlan;
  }, []);

  return {
    plans,
    loading,
    generating,
    error,
    loadPlans,
    generatePlan,
    deletePlan,
    updatePlan,
  };
}
