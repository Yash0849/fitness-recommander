import { Activity, Apple, Bot, Home, ScanSearch, Stethoscope, TrendingUp, User, Users } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Dashboard', icon: Home },
  { to: '/workout-plans', label: 'Workouts', icon: Activity },
  { to: '/diet-tracking', label: 'Diet', icon: Apple },
  { to: '/progress', label: 'Progress', icon: TrendingUp },
  { to: '/social', label: 'Social', icon: Users },
  { to: '/virtual-doctor', label: 'Doctor', icon: Stethoscope },
  { to: '/ai-vision', label: 'Vision AI', icon: ScanSearch },
  { to: '/profile', label: 'Profile', icon: User },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="glass-panel fixed inset-y-4 left-4 z-30 hidden w-[260px] flex-col rounded-[32px] border border-white/10 p-5 shadow-glass xl:flex">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300/50 to-blue-500/40 shadow-glow">
          <Bot className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="font-display text-xl font-semibold">FitTrack</p>
          <p className="text-xs uppercase tracking-[0.24em] text-dim">AI Fitness OS</p>
        </div>
      </div>

      <nav className="mt-8 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          const Icon = item.icon;

          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition ${
                isActive
                  ? 'bg-white text-slate-950 shadow-lg'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-[28px] border border-cyan-300/20 bg-cyan-300/10 p-4">
        <p className="text-xs uppercase tracking-[0.24em] text-cyan-100/80">Recovery Score</p>
        <p className="mt-2 font-display text-4xl font-semibold text-white">92%</p>
        <p className="mt-2 text-sm text-cyan-50/80">Adaptive intensity is trending upward this week.</p>
      </div>
    </aside>
  );
}
