import { motion } from 'framer-motion';
import type { ActivityRingData } from '../../utils/dashboard';

interface ActivityRingProps {
  rings: ActivityRingData[];
}

export default function ActivityRing({ rings }: ActivityRingProps) {
  const size = 250;
  const center = size / 2;

  return (
    <div className="glass-panel glow-border rounded-[32px] p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-dim">Calorie Rings</p>
          <h3 className="mt-2 font-display text-2xl font-semibold">Daily Movement</h3>
        </div>
        <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-dim">Live</div>
      </div>

      <div className="mt-6 flex flex-col items-center gap-6 lg:flex-row lg:justify-between">
        <div className="relative flex items-center justify-center">
          <svg width={size} height={size}>
            {rings.map((ring, index) => {
              const radius = 92 - index * 18;
              const circumference = 2 * Math.PI * radius;
              const progress = Math.min(ring.value / ring.target, 1);

              return (
                <g key={ring.key}>
                  <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="transparent"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="12"
                  />
                  <motion.circle
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="transparent"
                    stroke={ring.color}
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: circumference * (1 - progress) }}
                    transition={{ duration: 1.2, delay: index * 0.12, ease: 'easeOut' }}
                    style={{
                      transformOrigin: '50% 50%',
                      transform: 'rotate(-90deg)',
                      filter: `drop-shadow(0 0 14px ${ring.color})`,
                    }}
                  />
                </g>
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs uppercase tracking-[0.24em] text-dim">Momentum</span>
            <span className="font-display text-4xl font-semibold">
              {Math.round(rings.reduce((sum, ring) => sum + Math.min(ring.value / ring.target, 1), 0) / rings.length * 100)}%
            </span>
          </div>
        </div>

        <div className="grid w-full gap-3 sm:grid-cols-2">
          {rings.map((ring) => {
            const progress = Math.min((ring.value / ring.target) * 100, 100);

            return (
              <div key={ring.key} className="neuro-panel rounded-[24px] border border-white/10 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-dim">{ring.label}</p>
                    <p className="mt-1 font-display text-xl font-semibold">{Math.round(progress)}%</p>
                  </div>
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: ring.color, boxShadow: `0 0 16px ${ring.color}` }} />
                </div>
                <div className="mt-4 h-2 rounded-full bg-white/10">
                  <motion.div
                    className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1.1, ease: 'easeOut' }}
                    style={{ backgroundColor: ring.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
