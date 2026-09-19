import React from 'react';
import { useUserStore } from '../stores/userStore';
import { Sun, Moon, Laptop } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useUserStore();

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  return (
    <button
      onClick={cycleTheme}
      className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors min-h-touch min-w-touch flex items-center justify-center"
      title={`Theme: ${theme}`}
      aria-label="Toggle theme"
    >
      {theme === 'light' && <Sun className="w-4 h-4 text-amber-500" />}
      {theme === 'dark' && <Moon className="w-4 h-4 text-brand-400" />}
      {theme === 'system' && <Laptop className="w-4 h-4 text-slate-500" />}
    </button>
  );
};
