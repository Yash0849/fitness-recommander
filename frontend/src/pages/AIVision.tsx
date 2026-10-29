import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useFoodVision } from '../hooks/useFoodVision';
import { usePostureCoach } from '../hooks/usePostureCoach';
import FoodUploadCard from '../components/vision/FoodUploadCard';
import NutritionResultCard from '../components/vision/NutritionResultCard';
import PoseDetectionCanvas from '../components/vision/PoseDetectionCanvas';
import ExerciseFeedbackCard from '../components/vision/ExerciseFeedbackCard';
import RepCounter from '../components/vision/RepCounter';
import AIStatusIndicator from '../components/vision/AIStatusIndicator';
import { ActivitySquare, BrainCircuit, Salad, Save, Play, Square } from 'lucide-react';

export default function AIVision() {
  const { user } = useAuth();
  const [tab, setTab] = useState<'food' | 'posture'>('food');
  const foodVision = useFoodVision({ userId: user?.id });
  const postureCoach = usePostureCoach(user?.id);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="space-y-8">
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.2),_transparent_30%),linear-gradient(135deg,_rgba(15,23,42,1),_rgba(30,41,59,0.96),_rgba(49,46,129,0.92))] p-8 shadow-2xl shadow-slate-950/35"
        >
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-100">
                <BrainCircuit className="h-4 w-4" />
                AI Vision Lab
              </div>
              <h1 className="mt-5 text-4xl font-semibold text-white">Food recognition and live posture coaching in one vision workspace</h1>
              <p className="mt-4 text-slate-300">
                Scan meals with TensorFlow.js, estimate nutrition, auto-sync to diet tracking, and switch to MediaPipe-powered posture analysis for live form correction and rep counting.
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/30 p-5 backdrop-blur">
              <div className="flex gap-3">
                <button
                  onClick={() => setTab('food')}
                  className={`rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    tab === 'food' ? 'bg-cyan-500 text-white' : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  Food Vision
                </button>
                <button
                  onClick={() => setTab('posture')}
                  className={`rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    tab === 'posture' ? 'bg-cyan-500 text-white' : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  Posture Coach
                </button>
              </div>
            </div>
          </div>
        </motion.section>

        {tab === 'food' ? (
          <div className="space-y-6">
            <FoodUploadCard
              loading={foodVision.loading}
              onAnalyzeFile={async (file, mealType) => {
                await foodVision.analyze({ file, mealType, source: 'upload' });
              }}
              onAnalyzeCapture={async (imageData, mealType) => {
                await foodVision.analyze({ imageData, mealType, source: 'camera', fileName: 'captured-meal.jpg' });
              }}
            />

            {foodVision.error ? (
              <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                {foodVision.error}
              </div>
            ) : null}

            {foodVision.result ? (
              <NutritionResultCard result={foodVision.result} previewImage={foodVision.previewImage} />
            ) : (
              <div className="rounded-[1.75rem] border border-dashed border-cyan-400/15 bg-slate-900/70 p-8 text-center">
                <div className="mx-auto inline-flex rounded-3xl bg-cyan-500/15 p-4 text-cyan-100">
                  <Salad className="h-8 w-8" />
                </div>
                <h2 className="mt-4 text-2xl font-semibold text-white">No meal scanned yet</h2>
                <p className="mt-2 text-slate-400">
                  Once you scan a meal, FitTrack will estimate nutrition and add it directly to your diet tracking data.
                </p>
                <Link to="/diet-tracking" className="mt-5 inline-flex rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-100">
                  Open Diet Tracking
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
            <div className="space-y-6">
              <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/30">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-white">Live Posture Detection</h3>
                    <p className="mt-2 text-sm text-slate-400">
                      MediaPipe tracks body landmarks live. Backend angle analysis turns that into exercise feedback and rep counting.
                    </p>
                  </div>
                  <AIStatusIndicator
                    label={postureCoach.status === 'analyzing' ? 'Analyzing live' : postureCoach.status}
                    tone={
                      postureCoach.status === 'analyzing'
                        ? 'loading'
                        : postureCoach.status === 'error'
                          ? 'error'
                          : 'idle'
                    }
                  />
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto_auto]">
                  <select
                    value={postureCoach.exercise}
                    onChange={(event) => postureCoach.setExercise(event.target.value as any)}
                    className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                  >
                    <option value="squat">Squat</option>
                    <option value="pushup">Pushup</option>
                    <option value="deadlift">Deadlift</option>
                    <option value="plank">Plank</option>
                  </select>
                  {!postureCoach.isActive ? (
                    <button
                      onClick={postureCoach.start}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-medium text-white hover:bg-cyan-400"
                    >
                      <Play className="h-4 w-4" />
                      Start
                    </button>
                  ) : (
                    <button
                      onClick={postureCoach.stop}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-rose-500 px-4 py-3 text-sm font-medium text-white hover:bg-rose-400"
                    >
                      <Square className="h-4 w-4" />
                      Stop
                    </button>
                  )}
                  <button
                    onClick={postureCoach.saveSession}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-sm font-medium text-slate-100 hover:bg-white/15"
                  >
                    <Save className="h-4 w-4" />
                    Save Session
                  </button>
                </div>

                {postureCoach.error ? (
                  <div className="mt-4 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                    {postureCoach.error}
                  </div>
                ) : null}

                <div className="mt-6">
                  <PoseDetectionCanvas videoRef={postureCoach.videoRef} canvasRef={postureCoach.canvasRef} />
                </div>
              </div>

              <RepCounter reps={postureCoach.repCount} score={postureCoach.postureScore} />
            </div>

            <div className="space-y-6">
              <ExerciseFeedbackCard feedback={postureCoach.feedback} />

              <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/30">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-cyan-500/15 p-3 text-cyan-100">
                    <ActivitySquare className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Session History</h3>
                    <p className="text-sm text-slate-400">Saved posture sessions and their scores.</p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {postureCoach.history.length === 0 ? (
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                      No posture sessions saved yet.
                    </div>
                  ) : (
                    postureCoach.history.slice(0, 5).map((session) => (
                      <div key={session._id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="font-medium text-white">{session.exercise}</p>
                            <p className="mt-1 text-xs text-slate-400">{new Date(session.createdAt).toLocaleString()}</p>
                          </div>
                          <span className="rounded-full bg-cyan-500/15 px-3 py-1 text-xs text-cyan-100">
                            {session.averageScore}/100
                          </span>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-300">
                          <span>{session.reps} reps</span>
                          <span>{session.durationSeconds}s</span>
                          <span>{session.framesAnalyzed} frames</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
