import type { FoodDetectionResponse } from '../../services/visionApiService';

interface NutritionResultCardProps {
  result: FoodDetectionResponse;
  previewImage?: string;
}

export default function NutritionResultCard({ result, previewImage }: NutritionResultCardProps) {
  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/30">
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="lg:w-56">
          {previewImage ? (
            <img src={previewImage} alt="Recognized food" className="h-48 w-full rounded-2xl object-cover" />
          ) : (
            <div className="flex h-48 items-center justify-center rounded-2xl bg-white/5 text-slate-400">
              No preview
            </div>
          )}
        </div>

        <div className="flex-1 space-y-5">
          <div>
            <h3 className="text-xl font-semibold text-white">Nutrition Result</h3>
            <p className="mt-2 text-sm text-emerald-200">
              AI recognition complete. The detected foods were automatically added to diet tracking.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {result.detectedItems.map((item) => (
              <div key={item.foodName} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-white">{item.foodName}</p>
                  <span className="rounded-full bg-cyan-500/15 px-3 py-1 text-xs text-cyan-100">
                    {Math.round(item.confidence * 100)}%
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-400">{item.servingEstimate}</p>
                {item.estimationSource === 'fallback-estimate' ? (
                  <p className="mt-1 text-xs text-amber-200">{item.notes || 'Estimated from broad visual cues.'}</p>
                ) : null}
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-slate-200">
                  <span>{item.calories} kcal</span>
                  <span>{item.protein}g protein</span>
                  <span>{item.carbs}g carbs</span>
                  <span>{item.fats}g fats</span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-4">
            <div className="rounded-2xl bg-cyan-500/10 p-4 text-cyan-100">
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-200">Calories</p>
              <p className="mt-2 text-2xl font-semibold">{result.totals.calories}</p>
            </div>
            <div className="rounded-2xl bg-emerald-500/10 p-4 text-emerald-100">
              <p className="text-xs uppercase tracking-[0.24em] text-emerald-200">Protein</p>
              <p className="mt-2 text-2xl font-semibold">{result.totals.protein}g</p>
            </div>
            <div className="rounded-2xl bg-amber-500/10 p-4 text-amber-100">
              <p className="text-xs uppercase tracking-[0.24em] text-amber-200">Carbs</p>
              <p className="mt-2 text-2xl font-semibold">{result.totals.carbs}g</p>
            </div>
            <div className="rounded-2xl bg-fuchsia-500/10 p-4 text-fuchsia-100">
              <p className="text-xs uppercase tracking-[0.24em] text-fuchsia-200">Fats</p>
              <p className="mt-2 text-2xl font-semibold">{result.totals.fats}g</p>
            </div>
          </div>

          {result.predictions?.length ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-medium text-white">Model predictions</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {result.predictions.slice(0, 5).map((prediction) => (
                  <span key={prediction.label} className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-200">
                    {prediction.label} ({Math.round(prediction.confidence * 100)}%)
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
