import { useEffect, useState } from 'react';

const THEME_KEY = 'fittrack_theme';

export type ThemeMode = 'dark' | 'light';

export function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_KEY) as ThemeMode | null;
    const nextTheme =
      savedTheme ||
      (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');

    setTheme(nextTheme);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.body.classList.toggle('light', theme === 'light');
    document.body.classList.toggle('dark', theme === 'dark');
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  return {
    theme,
    isDark: theme === 'dark',
    toggleTheme: () => setTheme((current) => (current === 'dark' ? 'light' : 'dark')),
    setTheme,
  };
}
