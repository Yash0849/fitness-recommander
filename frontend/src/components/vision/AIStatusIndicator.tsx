interface AIStatusIndicatorProps {
  label: string;
  tone?: 'idle' | 'loading' | 'success' | 'warning' | 'error';
}

const toneClasses = {
  idle: 'bg-slate-500/15 text-slate-200 border-slate-400/20',
  loading: 'bg-cyan-500/15 text-cyan-100 border-cyan-400/20',
  success: 'bg-emerald-500/15 text-emerald-100 border-emerald-400/20',
  warning: 'bg-amber-500/15 text-amber-100 border-amber-400/20',
  error: 'bg-rose-500/15 text-rose-100 border-rose-400/20',
};

export default function AIStatusIndicator({ label, tone = 'idle' }: AIStatusIndicatorProps) {
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${toneClasses[tone]}`}>
      {label}
    </span>
  );
}
