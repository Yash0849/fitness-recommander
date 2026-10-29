import { motion } from 'framer-motion';
import { AlertTriangle, Clock3, Repeat2 } from 'lucide-react';
import type { WorkoutPlanDay } from '../../services/aiWorkoutPlanService';
import { getDayWarnings, intensityClasses } from '../../utils/workoutPlan';

interface WorkoutCardProps {
  dayLabel: string;
  day: WorkoutPlanDay;
  planWarnings: string[];
}

export default function WorkoutCard({ dayLabel, day, planWarnings }: WorkoutCardProps) {
  const warnings = getDayWarnings(day, planWarnings);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-900/80 shadow-xl shadow-slate-950/30 backdrop-blur"
    >
      <div className="bg-gradient-to-r from-cyan-500/20 via-indigo-500/15 to-fuchsia-500/20 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-400">{dayLabel}</p>
            <h3 className="mt-2 text-xl font-semibold text-white">{day.workoutType}</h3>
            <p className="mt-2 text-sm text-slate-300">{day.focus}</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${intensityClasses[day.intensity]}`}>
            {day.intensity}
          </span>
        </div>
      </div>

      <div className="space-y-5 p-5">
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
          <span className="flex items-center gap-2">
            <Clock3 className="h-4 w-4 text-cyan-300" />
            {day.duration} min
          </span>
          <span className="flex items-center gap-2">
            <Repeat2 className="h-4 w-4 text-fuchsia-300" />
            {day.exercises.length} exercises
          </span>
        </div>

        <div className="space-y-3">
          {day.exercises.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
              Full recovery day. Walk, stretch, and let your body reload.
            </div>
          ) : (
            day.exercises.map((exercise) => (
              <div key={`${dayLabel}-${exercise.name}`} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-medium text-white">{exercise.name}</h4>
                    <p className="mt-1 text-sm text-slate-400">{exercise.notes || 'Controlled reps and strong form.'}</p>
                  </div>
                  {exercise.substitutedFrom ? (
                    <span className="rounded-full bg-amber-500/15 px-3 py-1 text-xs text-amber-200">
                      Replaced {exercise.substitutedFrom}
                    </span>
                  ) : null}
                </div>
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-300">
                  {exercise.sets ? <span className="rounded-full bg-slate-800 px-3 py-1">{exercise.sets} sets</span> : null}
                  {exercise.reps ? <span className="rounded-full bg-slate-800 px-3 py-1">{exercise.reps} reps</span> : null}
                  {exercise.duration ? <span className="rounded-full bg-slate-800 px-3 py-1">{exercise.duration} sec/min</span> : null}
                </div>
              </div>
            ))
          )}
        </div>

        {warnings.length > 0 ? (
          <div className="rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4 text-sm text-amber-100">
            <div className="flex items-center gap-2 font-medium">
              <AlertTriangle className="h-4 w-4" />
              Injury-safe and recovery notes
            </div>
            <ul className="mt-2 space-y-2 pl-1">
              {warnings.map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="rounded-2xl bg-cyan-500/10 p-4 text-sm text-cyan-100">
          {day.recoveryNotes}
        </div>
      </div>
    </motion.div>
  );
}
