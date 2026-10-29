import { motion } from 'framer-motion';
import type { WorkoutPlanRecord } from '../../services/aiWorkoutPlanService';
import WorkoutCard from './WorkoutCard';
import { formatDayLabel, orderedDays } from '../../utils/workoutPlan';

interface WeeklyScheduleProps {
  plan: WorkoutPlanRecord;
  selectedDay: string;
  onSelectDay: (day: string) => void;
}

export default function WeeklySchedule({ plan, selectedDay, onSelectDay }: WeeklyScheduleProps) {
  return (
    <div className="space-y-6">
      <div className="flex gap-3 overflow-x-auto pb-1">
        {orderedDays.map((day) => (
          <button
            key={day}
            onClick={() => onSelectDay(day)}
            className={`min-w-[120px] rounded-2xl px-4 py-3 text-left transition ${
              selectedDay === day
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-500 text-white shadow-lg shadow-cyan-500/20'
                : 'bg-slate-900/70 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div className="text-xs uppercase tracking-[0.24em] opacity-80">{formatDayLabel(day)}</div>
            <div className="mt-2 text-sm font-medium">{plan.weeklyPlan[day].workoutType}</div>
          </button>
        ))}
      </div>

      <motion.div key={selectedDay} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }}>
        <WorkoutCard
          dayLabel={formatDayLabel(selectedDay)}
          day={plan.weeklyPlan[selectedDay]}
          planWarnings={plan.warnings}
        />
      </motion.div>
    </div>
  );
}
