import { motion } from 'framer-motion';

interface CircularMeterProps {
  label: string;
  value: number;
  target: number;
  unit: string;
  color: string;
  trailColor: string;
  size?: number;
}

export default function CircularMeter({
  label,
  value,
  target,
  unit,
  color,
  trailColor,
  size = 150,
}: CircularMeterProps) {
  const strokeWidth = 12;
  const radius = size / 2 - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(value / target, 1);

  return (
    <div className="relative flex flex-col items-center justify-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={trailColor}
            strokeWidth={strokeWidth}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference * (1 - progress) }}
            transition={{ duration: 1.3, ease: 'easeOut' }}
            strokeDasharray={circumference}
            style={{
              filter: `drop-shadow(0 0 16px ${color})`,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[11px] uppercase tracking-[0.24em] text-dim">{label}</span>
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.45 }}
            className="font-display text-3xl font-semibold"
          >
            {Math.round(value)}
          </motion.span>
          <span className="text-xs text-dim">{unit}</span>
        </div>
      </div>
    </div>
  );
}
