import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import CircularMeter from './CircularMeter';

interface HealthCardProps {
  label: string;
  value: number;
  target: number;
  unit: string;
  subtitle: string;
  color: string;
  trailColor: string;
  accent: string;
  icon: LucideIcon;
}

export default function HealthCard({
  label,
  value,
  target,
  unit,
  subtitle,
  color,
  trailColor,
  accent,
  icon: Icon,
}: HealthCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6, rotateX: 4, rotateY: -4 }}
      transition={{ type: 'spring', stiffness: 180, damping: 18 }}
      className="glass-panel glow-border group relative overflow-hidden rounded-[30px] p-5 [transform-style:preserve-3d]"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-35 transition-opacity duration-300 group-hover:opacity-50`} />
      <div className="absolute -right-8 top-4 h-24 w-24 rounded-full bg-white/10 blur-3xl" />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-dim">{label}</p>
          <h3 className="mt-1 font-display text-2xl font-semibold">
            {Math.round(value)} <span className="text-sm font-medium text-dim">{unit}</span>
          </h3>
          <p className="mt-1 text-sm text-dim">{subtitle}</p>
        </div>
        <div
          className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10"
          style={{ boxShadow: `0 0 24px ${color}30` }}
        >
          <Icon className="h-5 w-5" style={{ color }} />
        </div>
      </div>
      <div className="mt-4 flex justify-center">
        <CircularMeter
          label={label}
          value={value}
          target={target}
          unit={unit}
          color={color}
          trailColor={trailColor}
          size={136}
        />
      </div>
    </motion.div>
  );
}
