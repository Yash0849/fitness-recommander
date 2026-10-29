interface FitnessProfileStatsProps {
  bmi: number;
  fitnessGoal: string;
  sleepHours: string;
  experienceLevel: string;
}

const formatLabel = (value: string) =>
  value
    .split('-')
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
    .join(' ');

export default function FitnessProfileStats({
  bmi,
  fitnessGoal,
  sleepHours,
  experienceLevel,
}: FitnessProfileStatsProps) {
  const cards = [
    {
      label: 'BMI',
      value: bmi ? bmi.toFixed(1) : '--',
      tone: 'from-cyan-500 to-blue-500',
    },
    {
      label: 'Goal',
      value: fitnessGoal ? formatLabel(fitnessGoal) : 'Not set',
      tone: 'from-emerald-500 to-teal-500',
    },
    {
      label: 'Sleep',
      value: sleepHours ? `${sleepHours} hrs` : '--',
      tone: 'from-amber-500 to-orange-500',
    },
    {
      label: 'Experience',
      value: experienceLevel ? formatLabel(experienceLevel) : 'Not set',
      tone: 'from-fuchsia-500 to-pink-500',
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-3xl border border-white/40 bg-white/80 p-5 shadow-lg shadow-slate-200/40 backdrop-blur"
        >
          <div className={`mb-4 h-2 rounded-full bg-gradient-to-r ${card.tone}`} />
          <p className="text-sm font-medium text-slate-500">{card.label}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
