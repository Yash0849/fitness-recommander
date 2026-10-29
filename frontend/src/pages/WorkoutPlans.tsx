import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { profileAPI } from '../lib/api';
import { useWorkoutPlan } from '../hooks/useWorkoutPlan';
import WorkoutLoader from '../components/workouts/WorkoutLoader';
import WorkoutSummary from '../components/workouts/WorkoutSummary';
import WeeklySchedule from '../components/workouts/WeeklySchedule';
import { formatGoalLabel, orderedDays } from '../utils/workoutPlan';
import { BrainCircuit, MoonStar, RefreshCcw, Sparkles, Trash2 } from 'lucide-react';
import Modal from '../components/Modal';
import { fitnessProfileService, type FitnessProfile } from '../services/fitnessProfileService';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

export default function WorkoutPlans() {
  const { user } = useAuth();
  const { plans, loading, generating, error, generatePlan, deletePlan } = useWorkoutPlan({ userId: user?.id });
  const [selectedDay, setSelectedDay] = useState<string>(orderedDays[0]);
  const [sleepHoursInput, setSleepHoursInput] = useState('8');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<string | null>(null);
  const [fitnessProfile, setFitnessProfile] = useState<FitnessProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState('');

  const profile = user ? profileAPI.get(user.id) : null;
  const latestPlan = useMemo(() => plans[0] || null, [plans]);
  const profileReady = Boolean(
    fitnessProfile &&
      fitnessProfile.age &&
      fitnessProfile.height &&
      fitnessProfile.weight &&
      fitnessProfile.fitnessGoal &&
      fitnessProfile.experienceLevel
  );

  useEffect(() => {
    const loadFitnessProfile = async () => {
      if (!user) {
        setFitnessProfile(null);
        setProfileLoading(false);
        return;
      }

      try {
        setProfileLoading(true);
        setProfileError('');
        const response = await fitnessProfileService.getMyProfile();
        setFitnessProfile(response);
      } catch (loadError) {
        const message = loadError instanceof Error ? loadError.message : 'Unable to load your fitness profile';
        setProfileError(message);
      } finally {
        setProfileLoading(false);
      }
    };

    loadFitnessProfile();
  }, [user]);

  const handleGenerate = async () => {
    if (!profileReady) {
      return;
    }

    const parsed = Number(sleepHoursInput);
    await generatePlan(Number.isFinite(parsed) ? parsed : undefined);
  };

  const confirmDelete = async () => {
    if (!planToDelete) return;
    await deletePlan(planToDelete);
    setPlanToDelete(null);
    setShowDeleteModal(false);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <WorkoutLoader />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="space-y-8">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.24),_transparent_35%),linear-gradient(135deg,_rgba(15,23,42,1),_rgba(30,41,59,0.96),_rgba(49,46,129,0.95))] p-8 shadow-2xl shadow-slate-950/40"
        >
          <div className="grid gap-8 xl:grid-cols-[1.4fr_0.8fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-100">
                <BrainCircuit className="h-4 w-4" />
                AI Workout Plan Generator
              </div>
              <h1 className="mt-5 text-4xl font-semibold text-white">Adaptive weekly training built from your FitTrack profile</h1>
              <p className="mt-4 max-w-2xl text-slate-300">
                The generator reads your goal, BMI, age, sleep quality, injury history, and experience level to produce a safer, more personalized weekly schedule.
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Goal</p>
                  <p className="mt-2 text-lg font-medium text-white">
                    {profile?.goal ? formatGoalLabel(profile.goal) : 'Complete profile first'}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">BMI Snapshot</p>
                  <p className="mt-2 text-lg font-medium text-white">
                    {profile?.height && profile?.weight ? (profile.weight / ((profile.height / 100) ** 2)).toFixed(1) : 'Waiting for profile'}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Experience</p>
                  <p className="mt-2 text-lg font-medium text-white">
                    {latestPlan?.experienceLevel ? formatGoalLabel(latestPlan.experienceLevel) : 'Profile driven'}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/35 p-6 backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-cyan-500/15 p-3 text-cyan-100">
                  <MoonStar className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Generate New Weekly Plan</h2>
                  <p className="text-sm text-slate-400">You can override today’s sleep hours before generating.</p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">Sleep Hours</label>
                  <input
                    type="number"
                    min="0"
                    max="24"
                    step="0.5"
                    value={sleepHoursInput}
                    onChange={(event) => setSleepHoursInput(event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none ring-0 transition focus:border-cyan-400"
                  />
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={generating || profileLoading || !profileReady}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-500 px-5 py-3 font-medium text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {generating ? <RefreshCcw className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
                  {generating ? 'Generating plan...' : 'Generate AI Workout Plan'}
                </button>

                {profileLoading ? (
                  <div className="rounded-2xl border border-slate-400/15 bg-slate-500/10 p-4 text-sm text-slate-200">
                    Checking your saved fitness profile...
                  </div>
                ) : profileReady ? (
                  <div className="rounded-2xl border border-emerald-400/15 bg-emerald-500/10 p-4 text-sm text-emerald-100">
                    Your backend fitness profile is ready. The generator can use your goal, BMI, sleep, injuries, and experience level.
                  </div>
                ) : (
                  <div className="rounded-2xl border border-amber-400/15 bg-amber-500/10 p-4 text-sm text-amber-100">
                    <p>
                      The AI generator needs a saved backend fitness profile before it can build a plan.
                    </p>
                    <p className="mt-2">
                      Missing or unavailable profile data: age, height, weight, fitness goal, sleep hours, injury history, or experience level.
                    </p>
                    {profileError ? <p className="mt-2 text-rose-200">{profileError}</p> : null}
                    <Link
                      to="/profile"
                      className="mt-4 inline-flex rounded-xl bg-white px-4 py-2 font-medium text-slate-900 transition hover:bg-slate-100"
                    >
                      Complete Profile
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.section>

        {error ? (
          <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            {error}
          </div>
        ) : null}

        {!latestPlan ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[2rem] border border-dashed border-cyan-400/20 bg-slate-900/70 p-12 text-center"
          >
            <div className="mx-auto inline-flex rounded-3xl bg-cyan-500/15 p-5 text-cyan-100">
              <BrainCircuit className="h-8 w-8" />
            </div>
            <h2 className="mt-5 text-2xl font-semibold text-white">No AI workout plan yet</h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-400">
              Generate your first personalized weekly schedule to see workout cards, recovery guidance, injury-aware substitutions, and AI reasoning.
            </p>
          </motion.div>
        ) : (
          <>
            <WorkoutSummary plan={latestPlan} />

            <div className="grid gap-8 xl:grid-cols-[1.4fr_1fr]">
              <WeeklySchedule
                plan={latestPlan}
                selectedDay={selectedDay}
                onSelectDay={setSelectedDay}
              />

              <div className="space-y-6">
                <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/30">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">Plan history</h3>
                      <p className="text-sm text-slate-400">Your most recent AI workout plans.</p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    <AnimatePresence>
                      {plans.map((plan) => (
                        <motion.div
                          key={plan._id}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -12 }}
                          className={`rounded-2xl border p-4 ${
                            plan._id === latestPlan._id
                              ? 'border-cyan-400/25 bg-cyan-500/10'
                              : 'border-white/10 bg-white/5'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-sm font-medium text-white">{formatGoalLabel(plan.goal)}</p>
                              <p className="mt-1 text-xs text-slate-400">
                                {new Date(plan.createdAt).toLocaleString()}
                              </p>
                              <p className="mt-2 text-xs text-slate-300">
                                Sleep: {plan.sleepQuality} · Experience: {formatGoalLabel(plan.experienceLevel)}
                              </p>
                            </div>
                            <button
                              onClick={() => {
                                setPlanToDelete(plan._id);
                                setShowDeleteModal(true);
                              }}
                              className="rounded-full p-2 text-slate-400 transition hover:bg-rose-500/10 hover:text-rose-200"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setPlanToDelete(null);
        }}
        title="Delete Workout Plan"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            This will remove the generated weekly plan from your workout history.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setShowDeleteModal(false);
                setPlanToDelete(null);
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
