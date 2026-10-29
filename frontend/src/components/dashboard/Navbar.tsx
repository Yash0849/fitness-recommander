import { Menu, Moon, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NotificationBell } from '../NotificationSystem';
import type { UserProfile } from '../../lib/localStorage';

interface NavbarProps {
  onToggleTheme: () => void;
  isDark: boolean;
  onSignOut: () => Promise<void>;
  userLabel: string;
  userProfile: UserProfile | null;
}

export default function Navbar({ onToggleTheme, isDark, onSignOut, userLabel, userProfile }: NavbarProps) {
  return (
    <header className="glass-panel sticky top-4 z-20 mx-auto flex w-full max-w-[1680px] items-center justify-between gap-4 rounded-[28px] px-4 py-3 shadow-glass">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10 xl:hidden">
          <Menu className="h-5 w-5" />
        </div>
        <Link to="/" className="xl:hidden">
          <span className="font-display text-xl font-semibold">FitTrack</span>
        </Link>
        <div className="hidden sm:block">
          <p className="text-xs uppercase tracking-[0.28em] text-dim">AI Dashboard</p>
          <h1 className="font-display text-xl font-semibold">Performance Control Center</h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleTheme}
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10 transition hover:bg-white/20"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
        <NotificationBell />
        <Link
          to="/profile"
          className="hidden items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-2.5 sm:flex"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300/50 to-blue-400/40 text-sm font-semibold text-white">
            {(userProfile?.fullName || userProfile?.username || userLabel).slice(0, 1).toUpperCase()}
          </div>
          <div className="max-w-[180px]">
            <p className="truncate text-sm font-medium">{userProfile?.fullName || userProfile?.username || userLabel}</p>
            <p className="truncate text-xs text-dim">{userLabel}</p>
          </div>
        </Link>
        <button
          type="button"
          onClick={onSignOut}
          className="rounded-2xl border border-white/10 bg-white px-4 py-2.5 text-sm font-medium text-slate-950 transition hover:opacity-90"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}
