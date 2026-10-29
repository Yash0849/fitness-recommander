export default function RepCounter({ reps, score }: { reps: number; score: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/80 p-5 shadow-xl shadow-slate-950/25">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Rep Counter</p>
        <p className="mt-3 text-4xl font-semibold text-white">{reps}</p>
      </div>
      <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/80 p-5 shadow-xl shadow-slate-950/25">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Posture Score</p>
        <p className="mt-3 text-4xl font-semibold text-cyan-100">{score}</p>
      </div>
    </div>
  );
}
