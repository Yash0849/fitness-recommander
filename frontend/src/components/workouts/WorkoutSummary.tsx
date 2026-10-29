import { motion } from 'framer-motion';
import { Activity, CalendarRange, Flame, Shield } from 'lucide-react';
import type { WorkoutPlanRecord } from '../../services/aiWorkoutPlanService';
import { formatGoalLabel, getPlanSummary } from '../../utils/workoutPlan';

interface WorkoutSummaryProps {
  plan: WorkoutPlanRecord;
}

export default function WorkoutSummary({ plan }: WorkoutSummaryProps) {
  const summary = getPlanSummary(plan);

  const cards = [
    {
      label: 'Goal',
      value: formatGoalLabel(plan.goal),
      icon: Flame,
      tone: 'text-rose-200 bg-rose-500/15',
    },
    {
      label: 'Total Volume',
      value: `${summary.totalDuration} min`,
      icon: CalendarRange,
      tone: 'text-cyan-200 bg-cyan-500/15',
    },
    {
      label: 'High Days',
      value: `${summary.intenseDays}`,
      icon: Activity,
      tone: 'text-amber-200 bg-amber-500/15',
    },
    {
      label: 'Recovery Days',
      value: `${summary.recoveryDays}`,
      icon: Shield,
      tone: 'text-emerald-200 bg-emerald-500/15',
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.06 }}
          className="rounded-[1.5rem] border border-white/10 bg-slate-900/75 p-5 shadow-xl shadow-slate-950/25"
        >
          <div className={`inline-flex rounded-2xl p-3 ${card.tone}`}>
            <card.icon className="h-5 w-5" />
          </div>
          <p className="mt-4 text-sm text-slate-400">{card.label}</p>
          <p className="mt-2 text-2xl font-semibold text-white">{card.value}</p>
        </motion.div>
      ))}
    </div>
  );
}
