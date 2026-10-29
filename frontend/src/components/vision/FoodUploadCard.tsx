import { useState } from 'react';
import { Camera, UploadCloud } from 'lucide-react';
import ImageUpload from '../ImageUpload';
import CameraCapture from './CameraCapture';
import AIStatusIndicator from './AIStatusIndicator';
import LoadingAnimation from './LoadingAnimation';

interface FoodUploadCardProps {
  loading: boolean;
  onAnalyzeFile: (file: File, mealType: string) => Promise<void>;
  onAnalyzeCapture: (imageData: string, mealType: string) => Promise<void>;
}

export default function FoodUploadCard({ loading, onAnalyzeFile, onAnalyzeCapture }: FoodUploadCardProps) {
  const [mealType, setMealType] = useState('lunch');
  const [showCamera, setShowCamera] = useState(false);

  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/30">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-white">Food Recognition</h3>
          <p className="mt-2 text-sm text-slate-400">
            Upload a food image or capture it live. TensorFlow.js classifies the meal, then FitTrack maps it to nutrition and adds it to diet tracking.
          </p>
        </div>
        <AIStatusIndicator label={loading ? 'Analyzing' : 'Ready'} tone={loading ? 'loading' : 'success'} />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_auto]">
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Meal Type</label>
            <select
              value={mealType}
              onChange={(event) => setMealType(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
          </div>

          {showCamera ? (
            <CameraCapture
              onClose={() => setShowCamera(false)}
              onCapture={async (imageData) => {
                await onAnalyzeCapture(imageData, mealType);
              }}
            />
          ) : (
            <ImageUpload
              onImageSelect={async (file) => {
                await onAnalyzeFile(file, mealType);
              }}
              className="block"
            />
          )}
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => setShowCamera(false)}
            className={`inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium transition ${
              !showCamera ? 'bg-cyan-500 text-white' : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            <UploadCloud className="h-4 w-4" />
            Upload
          </button>
          <button
            onClick={() => setShowCamera(true)}
            className={`inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium transition ${
              showCamera ? 'bg-cyan-500 text-white' : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            <Camera className="h-4 w-4" />
            Camera
          </button>
        </div>
      </div>

      {loading ? <LoadingAnimation label="Classifying meal and estimating nutrition..." /> : null}
    </div>
  );
}
