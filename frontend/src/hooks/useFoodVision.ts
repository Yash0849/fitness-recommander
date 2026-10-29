import { useState } from 'react';
import { storage } from '../lib/localStorage';
import { foodRecognitionService, readFileAsDataUrl } from '../services/foodRecognitionService';
import { visionApiService, type FoodDetectionResponse } from '../services/visionApiService';

interface UseFoodVisionOptions {
  userId?: string;
}

export function useFoodVision({ userId }: UseFoodVisionOptions) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FoodDetectionResponse | null>(null);
  const [previewImage, setPreviewImage] = useState('');
  const [error, setError] = useState('');

  const syncDietTracking = (mealType: string, detection: FoodDetectionResponse) => {
    if (!userId) {
      return;
    }

    for (const item of detection.detectedItems) {
      storage.saveDietLog({
        id: crypto.randomUUID(),
        userId,
        foodName: item.foodName,
        calories: item.calories,
        protein: item.protein,
        carbs: item.carbs,
        fats: item.fats,
        mealType,
        loggedAt: new Date().toISOString(),
      });
    }
  };

  const analyze = async (params: {
    file?: File;
    imageData?: string;
    fileName?: string;
    mealType: string;
    source: 'upload' | 'camera';
  }) => {
    try {
      setLoading(true);
      setError('');

      const imageData = params.imageData || (params.file ? await readFileAsDataUrl(params.file) : '');
      const predictions = await foodRecognitionService.classifyImageData(imageData);
      const detection = await visionApiService.detectFood({
        imageData,
        fileName: params.fileName || params.file?.name || 'captured-food.jpg',
        mealType: params.mealType,
        source: params.source,
        predictions,
      });

      setPreviewImage(imageData);
      setResult(detection);
      syncDietTracking(params.mealType, detection);
      return detection;
    } catch (analysisError) {
      const message = analysisError instanceof Error ? analysisError.message : 'Food analysis failed';
      setError(message);
      throw analysisError;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    result,
    previewImage,
    error,
    analyze,
    reset: () => {
      setResult(null);
      setPreviewImage('');
      setError('');
    },
  };
}
