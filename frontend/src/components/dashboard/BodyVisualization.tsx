import { useState } from 'react';
import { motion } from 'framer-motion';
import type { BodyRegion } from '../../utils/dashboard';

interface BodyVisualizationProps {
  regions: BodyRegion[];
}

export default function BodyVisualization({ regions }: BodyVisualizationProps) {
  const [active, setActive] = useState<BodyRegion | null>(regions[0] ?? null);
  const [side, setSide] = useState<'front' | 'back'>('front');

  const visibleRegions = regions.filter((region) => region.side === side);

  return (
    <div className="glass-panel glow-border rounded-[32px] p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-dim">Body Visualization</p>
          <h3 className="mt-2 font-display text-2xl font-semibold">Muscle Focus Map</h3>
        </div>
        <div className="inline-flex rounded-full border border-white/10 bg-white/5 p-1">
          {(['front', 'back'] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setSide(value)}
              className={`rounded-full px-4 py-2 text-sm capitalize transition ${
                side === value ? 'bg-white text-slate-950' : 'text-dim hover:text-white'
              }`}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="neuro-panel rounded-[28px] border border-white/10 p-4">
          <div className="relative mx-auto aspect-[0.72] max-w-[240px] overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(94,234,212,0.18),transparent_35%)]" />
            <svg viewBox="0 0 100 160" className="absolute inset-0 h-full w-full">
              <motion.ellipse cx="50" cy="16" rx="13" ry="13" fill="rgba(255,255,255,0.08)" />
              <motion.rect x="39" y="28" width="22" height="42" rx="10" fill="rgba(255,255,255,0.08)" />
              <motion.rect x="25" y="32" width="12" height="52" rx="6" fill="rgba(255,255,255,0.08)" />
              <motion.rect x="63" y="32" width="12" height="52" rx="6" fill="rgba(255,255,255,0.08)" />
              <motion.rect x="40" y="72" width="9" height="56" rx="4.5" fill="rgba(255,255,255,0.08)" />
              <motion.rect x="51" y="72" width="9" height="56" rx="4.5" fill="rgba(255,255,255,0.08)" />
              {visibleRegions.map((region) => (
                <motion.rect
                  key={region.id}
                  x={region.x}
                  y={region.y}
                  width={region.width}
                  height={region.height}
                  rx="6"
                  initial={{ opacity: 0.45 }}
                  animate={{ opacity: active?.id === region.id ? 0.95 : 0.65 }}
                  whileHover={{ opacity: 0.98 }}
                  onHoverStart={() => setActive(region)}
                  onClick={() => setActive(region)}
                  fill={`rgba(94, 234, 212, ${region.score / 100})`}
                  stroke="rgba(255,255,255,0.28)"
                  style={{
                    cursor: 'pointer',
                    filter: 'drop-shadow(0 0 10px rgba(94, 234, 212, 0.25))',
                  }}
                />
              ))}
            </svg>
          </div>
        </div>

        <div className="grid gap-3">
          {visibleRegions.map((region) => (
            <button
              key={region.id}
              type="button"
              onMouseEnter={() => setActive(region)}
              onClick={() => setActive(region)}
              className={`rounded-[24px] border p-4 text-left transition ${
                active?.id === region.id
                  ? 'border-cyan-300/40 bg-cyan-300/10 shadow-glow'
                  : 'border-white/10 bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-display text-lg font-semibold">{region.name}</p>
                  <p className="mt-1 text-sm text-dim">Workout focus visualization</p>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-[0.22em] text-dim">Engagement</p>
                  <p className="font-display text-2xl font-semibold">{region.score}%</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
