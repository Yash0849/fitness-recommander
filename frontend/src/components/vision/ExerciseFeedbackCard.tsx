import type { FeedbackMessage } from '../../services/postureApiService';

interface ExerciseFeedbackCardProps {
  feedback: FeedbackMessage[];
}

const severityTone = {
  success: 'border-emerald-400/20 bg-emerald-500/10 text-emerald-100',
  info: 'border-cyan-400/20 bg-cyan-500/10 text-cyan-100',
  warning: 'border-amber-400/20 bg-amber-500/10 text-amber-100',
  error: 'border-rose-400/20 bg-rose-500/10 text-rose-100',
};

export default function ExerciseFeedbackCard({ feedback }: ExerciseFeedbackCardProps) {
  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/30">
      <h3 className="text-lg font-semibold text-white">Live Correction Feedback</h3>
      <div className="mt-4 space-y-3">
        {feedback.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
            Start the posture coach to receive live movement feedback.
          </div>
        ) : (
          feedback.map((item, index) => (
            <div key={`${item.message}-${index}`} className={`rounded-2xl border p-4 text-sm ${severityTone[item.severity]}`}>
              {item.message}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
