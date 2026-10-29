import { motion } from 'framer-motion';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { TrendFilter, TrendPoint } from '../../utils/dashboard';

interface TrendChartProps {
  data: TrendPoint[];
  filter: TrendFilter;
  onFilterChange: (filter: TrendFilter) => void;
}

export default function TrendChart({ data, filter, onFilterChange }: TrendChartProps) {
  return (
    <div className="glass-panel glow-border rounded-[32px] p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-dim">Trend Graphs</p>
          <h3 className="mt-2 font-display text-2xl font-semibold">Weekly Performance</h3>
        </div>
        <div className="inline-flex rounded-full border border-white/10 bg-white/5 p-1">
          {(['weekly', 'monthly'] as TrendFilter[]).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => onFilterChange(value)}
              className={`rounded-full px-4 py-2 text-sm transition ${
                filter === value ? 'bg-white text-slate-950' : 'text-dim hover:text-white'
              }`}
            >
              {value === 'weekly' ? 'Weekly' : 'Monthly'}
            </button>
          ))}
        </div>
      </div>

      <motion.div
        key={filter}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]"
      >
        <div className="neuro-panel rounded-[28px] border border-white/10 p-4">
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="caloriesFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="hydrationFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5eead4" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#5eead4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(2, 8, 23, 0.9)',
                    border: '1px solid rgba(148,163,184,0.15)',
                    borderRadius: '16px',
                  }}
                />
                <Legend />
                <Area type="monotone" dataKey="calories" stroke="#60a5fa" fill="url(#caloriesFill)" strokeWidth={2.5} />
                <Area type="monotone" dataKey="hydration" stroke="#5eead4" fill="url(#hydrationFill)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="neuro-panel rounded-[28px] border border-white/10 p-4">
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(2, 8, 23, 0.9)',
                    border: '1px solid rgba(148,163,184,0.15)',
                    borderRadius: '16px',
                  }}
                />
                <Line type="monotone" dataKey="weight" stroke="#fb7185" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="workouts" stroke="#fbbf24" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="sleep" stroke="#a78bfa" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
