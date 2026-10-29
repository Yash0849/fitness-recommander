import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Apple,
  Calendar,
  CheckSquare,
  Droplets,
  Footprints,
  Heart,
  MoonStar,
  Plus,
  Sparkles,
  Target,
  TrendingUp,
  Waves,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { profileAPI } from '../lib/api';
import { storage, type HealthMetrics, type Todo as StorageTodo } from '../lib/localStorage';
import { fadeUp, scaleIn, staggerContainer } from '../animations/dashboardMotion';
import {
  buildActivityRings,
  buildBodyRegions,
  buildHealthTargets,
  buildTrendData,
  createTodayMetrics,
  type TrendFilter,
} from '../utils/dashboard';
import HealthCard from '../components/dashboard/HealthCard';
import ActivityRing from '../components/dashboard/ActivityRing';
import TrendChart from '../components/dashboard/TrendChart';
import BodyVisualization from '../components/dashboard/BodyVisualization';
import DashboardGrid from '../components/dashboard/DashboardGrid';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';

type Todo = StorageTodo;

const quickActions = [
  {
    title: 'Workout Planner',
    description: 'Build strength blocks and adaptive schedules.',
    to: '/workout-plans',
    icon: Activity,
    accent: 'from-cyan-300/30 to-blue-400/30',
  },
  {
    title: 'Diet Tracking',
    description: 'Log meals, macros, and hydration trends.',
    to: '/diet-tracking',
    icon: Apple,
    accent: 'from-emerald-300/30 to-cyan-300/30',
  },
  {
    title: 'Progress Tracking',
    description: 'Review body metrics and streak analytics.',
    to: '/progress',
    icon: TrendingUp,
    accent: 'from-amber-300/30 to-rose-300/30',
  },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [newTodoDueDate, setNewTodoDueDate] = useState('');
  const [trendFilter, setTrendFilter] = useState<TrendFilter>('weekly');
  const [healthMetrics, setHealthMetrics] = useState<HealthMetrics | null>(null);

  useEffect(() => {
    if (!user) return;

    const timeout = window.setTimeout(() => {
      const userTodos = storage.getTodos(user.id);
      const userMetrics = storage.getHealthMetrics(user.id);
      const today = new Date().toDateString();
      const todayMetrics =
        userMetrics.find((metric) => new Date(metric.date).toDateString() === today) ||
        createTodayMetrics(user.id);

      if (!userMetrics.some((metric) => metric.id === todayMetrics.id)) {
        storage.saveHealthMetrics(todayMetrics);
      }

      setTodos(userTodos);
      setHealthMetrics(todayMetrics);
      setLoading(false);
    }, 850);

    return () => window.clearTimeout(timeout);
  }, [user]);

  const profile = useMemo(() => (user ? profileAPI.get(user.id) : null), [user]);
  const workoutPlans = useMemo(() => (user ? storage.getWorkoutPlans(user.id) : []), [user]);
  const dietLogs = useMemo(() => (user ? storage.getDietLogs(user.id) : []), [user]);
  const progressLogs = useMemo(() => (user ? storage.getProgressLogs(user.id) : []), [user]);

  const metrics = healthMetrics ?? (user ? createTodayMetrics(user.id) : null);
  const healthTargets = metrics ? buildHealthTargets(profile ?? null, metrics) : [];
  const rings = buildActivityRings(healthTargets, workoutPlans, todos);
  const trendData = metrics ? buildTrendData(trendFilter, metrics, dietLogs, progressLogs, workoutPlans) : [];
  const bodyRegions = buildBodyRegions(workoutPlans);

  const updateHealthMetric = (key: keyof HealthMetrics, value: HealthMetrics[keyof HealthMetrics]) => {
    if (!metrics || !user) return;

    const updatedMetrics = { ...metrics, [key]: value };
    setHealthMetrics(updatedMetrics);
    storage.saveHealthMetrics(updatedMetrics);
  };

  const addWater = (amount: number) => {
    if (!metrics) return;
    const newAmount = Math.max(0, metrics.waterIntake + amount);
    updateHealthMetric('waterIntake', newAmount);
  };

  const handleAddTodo = (event: React.FormEvent) => {
    event.preventDefault();
    if (!newTodo.trim() || !user) return;

    const todo: Todo = {
      id: crypto.randomUUID(),
      userId: user.id,
      text: newTodo,
      completed: false,
      dueDate: newTodoDueDate || undefined,
    };

    storage.saveTodo(todo);
    setTodos((current) => [...current, todo]);
    setNewTodo('');
    setNewTodoDueDate('');
  };

  const toggleTodo = (id: string) => {
    if (!user) return;

    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    const updatedTodo = updatedTodos.find((todo) => todo.id === id);

    if (updatedTodo) {
      storage.saveTodo(updatedTodo);
    }

    setTodos(updatedTodos);
  };

  const deleteTodo = (id: string) => {
    if (!user) return;

    const storageTodos = JSON.parse(localStorage.getItem('fitness_tracker_todos') || '[]') as Todo[];
    const updatedStorageTodos = storageTodos.filter((todo) => todo.id !== id);
    localStorage.setItem('fitness_tracker_todos', JSON.stringify(updatedStorageTodos));
    setTodos((current) => current.filter((todo) => todo.id !== id));
  };

  if (!user) return null;

  if (loading || !metrics) {
    return (
      <div className="space-y-6 pt-6">
        <div className="grid gap-6 xl:grid-cols-4">
          <LoadingSkeleton className="xl:col-span-2" />
          <LoadingSkeleton />
          <LoadingSkeleton />
        </div>
        <div className="grid gap-6 xl:grid-cols-3">
          <LoadingSkeleton className="xl:col-span-2" />
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="space-y-6 pb-10 pt-6"
    >
      <motion.section
        variants={scaleIn}
        className="glass-panel glow-border relative overflow-hidden rounded-[36px] px-6 py-7 sm:px-8"
      >
        <div className="absolute inset-0 bg-mesh-radial opacity-90" />
        <div className="absolute -right-12 top-0 h-48 w-48 rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-blue-500/15 blur-3xl" />
        <div className="relative flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.26em] text-cyan-100/90">
              <Sparkles className="h-3.5 w-3.5" />
              AI-Powered Health Command
            </div>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-tight sm:text-5xl">
              Futuristic fitness intelligence, tuned to your body in real time.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
              Today&apos;s dashboard blends recovery, activity, and nutrition signals into a single premium control surface while keeping your existing FitTrack routines untouched.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:w-[480px]">
            <div className="neuro-panel rounded-[24px] border border-white/10 p-4">
              <div className="flex items-center gap-3">
                <Heart className="h-5 w-5 text-rose-300" />
                <span className="text-sm text-dim">Heart Rate</span>
              </div>
              <p className="mt-3 font-display text-3xl font-semibold">{metrics.heartRate}</p>
              <p className="text-sm text-dim">BPM live</p>
            </div>
            <div className="neuro-panel rounded-[24px] border border-white/10 p-4">
              <div className="flex items-center gap-3">
                <Droplets className="h-5 w-5 text-cyan-300" />
                <span className="text-sm text-dim">Hydration</span>
              </div>
              <p className="mt-3 font-display text-3xl font-semibold">{metrics.waterIntake}</p>
              <p className="text-sm text-dim">ml today</p>
            </div>
            <div className="neuro-panel rounded-[24px] border border-white/10 p-4">
              <div className="flex items-center gap-3">
                <Footprints className="h-5 w-5 text-amber-300" />
                <span className="text-sm text-dim">Steps</span>
              </div>
              <p className="mt-3 font-display text-3xl font-semibold">{metrics.steps}</p>
              <p className="text-sm text-dim">movement count</p>
            </div>
          </div>
        </div>
      </motion.section>

      <DashboardGrid>
        <motion.section variants={fadeUp} className="col-span-12">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            {healthTargets.map((target, index) => {
              const icons = [Heart, Waves, Droplets, Target, MoonStar];
              const Icon = icons[index];

              return (
                <HealthCard
                  key={target.key}
                  label={target.label}
                  value={target.value}
                  target={target.target}
                  unit={target.unit}
                  subtitle={target.subtitle}
                  color={target.color}
                  trailColor={target.trailColor}
                  accent={target.accent}
                  icon={Icon}
                />
              );
            })}
          </div>
        </motion.section>

        <motion.section variants={fadeUp} className="col-span-12 2xl:col-span-8">
          <ActivityRing rings={rings} />
        </motion.section>

        <motion.section variants={fadeUp} className="col-span-12">
          <TrendChart data={trendData} filter={trendFilter} onFilterChange={setTrendFilter} />
        </motion.section>

        <motion.section variants={fadeUp} className="col-span-12 xl:col-span-7">
          <BodyVisualization regions={bodyRegions} />
        </motion.section>

        <motion.section variants={fadeUp} className="col-span-12 xl:col-span-5">
          <div className="glass-panel glow-border rounded-[32px] p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-dim">Hydration Console</p>
                <h3 className="mt-2 font-display text-2xl font-semibold">Water Intake Control</h3>
                <p className="mt-2 text-sm text-dim">{metrics.waterIntake}ml of {healthTargets.find((item) => item.key === 'hydration')?.target}ml target</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => addWater(-250)}
                  className="rounded-2xl border border-white/10 bg-white/10 px-4 py-2 text-sm transition hover:bg-white/15"
                >
                  -250ml
                </button>
                <button
                  type="button"
                  onClick={() => addWater(250)}
                  className="rounded-2xl bg-white px-4 py-2 text-sm font-medium text-slate-950 transition hover:opacity-90"
                >
                  +250ml
                </button>
              </div>
            </div>
            <div className="mt-6 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-4 rounded-full bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500"
                initial={{ width: 0 }}
                animate={{
                  width: `${Math.min(
                    (metrics.waterIntake / (healthTargets.find((item) => item.key === 'hydration')?.target ?? 1)) * 100,
                    100
                  )}%`,
                }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.title}
                    to={action.to}
                    className="group relative overflow-hidden rounded-[24px] border border-white/10 bg-white/5 p-4 transition hover:-translate-y-1 hover:bg-white/10"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${action.accent} opacity-0 transition duration-300 group-hover:opacity-100`} />
                    <div className="relative">
                      <Icon className="h-5 w-5 text-cyan-100" />
                      <h4 className="mt-4 font-display text-lg font-semibold">{action.title}</h4>
                      <p className="mt-2 text-sm leading-6 text-dim">{action.description}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </motion.section>

        <motion.section variants={fadeUp} className="col-span-12">
          <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
            <div className="glass-panel glow-border rounded-[32px] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-dim">Task Matrix</p>
                  <h3 className="mt-2 font-display text-2xl font-semibold">Today&apos;s Missions</h3>
                </div>
                <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-dim">
                  {todos.filter((todo) => todo.completed).length}/{todos.length} complete
                </div>
              </div>

              <form onSubmit={handleAddTodo} className="mt-6 grid gap-3 lg:grid-cols-[1fr_160px_auto]">
                <input
                  type="text"
                  value={newTodo}
                  onChange={(event) => setNewTodo(event.target.value)}
                  placeholder="Add a new task..."
                  className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 outline-none transition focus:border-cyan-300/30 focus:bg-white/15"
                />
                <input
                  type="date"
                  value={newTodoDueDate}
                  onChange={(event) => setNewTodoDueDate(event.target.value)}
                  className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 outline-none transition focus:border-cyan-300/30 focus:bg-white/15"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-2xl bg-white px-4 py-3 text-slate-950 transition hover:opacity-90"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </form>

              <div className="mt-6 space-y-3">
                {todos.length === 0 && (
                  <div className="rounded-[24px] border border-dashed border-white/10 bg-white/5 p-6 text-center text-dim">
                    No missions logged yet. Add one above to start your day.
                  </div>
                )}
                {todos.map((todo) => (
                  <div
                    key={todo.id}
                    className={`rounded-[24px] border p-4 transition ${
                      todo.completed ? 'border-emerald-300/20 bg-emerald-300/10' : 'border-white/10 bg-white/5'
                    }`}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={todo.completed}
                          onChange={() => toggleTodo(todo.id)}
                          className="h-5 w-5 rounded border-white/20 bg-transparent text-cyan-300 focus:ring-cyan-300"
                        />
                        <span className={todo.completed ? 'text-dim line-through' : 'text-white'}>{todo.text}</span>
                      </label>
                      <div className="flex items-center gap-3">
                        {todo.dueDate && (
                          <span className="inline-flex items-center gap-2 text-sm text-dim">
                            <Calendar className="h-4 w-4" />
                            {new Date(todo.dueDate).toLocaleDateString()}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => deleteTodo(todo.id)}
                          className="rounded-full border border-white/10 p-2 text-dim transition hover:border-rose-300/30 hover:text-rose-200"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel glow-border rounded-[32px] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-dim">Vitals Stream</p>
                  <h3 className="mt-2 font-display text-2xl font-semibold">Live Status</h3>
                </div>
                <CheckSquare className="h-5 w-5 text-cyan-200" />
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="neuro-panel rounded-[24px] border border-white/10 p-4">
                  <p className="text-sm text-dim">Blood Pressure</p>
                  <p className="mt-2 font-display text-3xl font-semibold">
                    {metrics.bloodPressure.systolic}/{metrics.bloodPressure.diastolic}
                  </p>
                  <p className="mt-2 text-sm text-dim">mmHg calibrated</p>
                </div>
                <div className="neuro-panel rounded-[24px] border border-white/10 p-4">
                  <p className="text-sm text-dim">Oxygen Level</p>
                  <p className="mt-2 font-display text-3xl font-semibold">{metrics.oxygenLevel}%</p>
                  <p className="mt-2 text-sm text-dim">respiratory efficiency</p>
                </div>
                <div className="neuro-panel rounded-[24px] border border-white/10 p-4">
                  <p className="text-sm text-dim">Workout Plans</p>
                  <p className="mt-2 font-display text-3xl font-semibold">{workoutPlans.length}</p>
                  <p className="mt-2 text-sm text-dim">active routines</p>
                </div>
                <div className="neuro-panel rounded-[24px] border border-white/10 p-4">
                  <p className="text-sm text-dim">Progress Logs</p>
                  <p className="mt-2 font-display text-3xl font-semibold">{progressLogs.length}</p>
                  <p className="mt-2 text-sm text-dim">historical check-ins</p>
                </div>
              </div>

              <div className="mt-6 rounded-[28px] border border-cyan-300/20 bg-gradient-to-br from-cyan-300/10 via-white/5 to-blue-400/10 p-5">
                <div className="flex items-center gap-3">
                  <Target className="h-5 w-5 text-cyan-200" />
                  <p className="text-sm text-cyan-50/90">Smart Statistics</p>
                </div>
                <p className="mt-3 font-display text-2xl font-semibold">
                  {Math.round((rings.reduce((sum, ring) => sum + Math.min(ring.value / ring.target, 1), 0) / rings.length) * 100)}% daily system alignment
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  The AI recommendation widgets are favoring hydration support and moderate intensity based on your current oxygen, sleep, and movement signals.
                </p>
              </div>
            </div>
          </div>
        </motion.section>
      </DashboardGrid>
    </motion.div>
  );
}
