import React, { useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { LanguageToggle } from './LanguageToggle';
import { ThemeToggle } from './ThemeToggle';
import { BandBadge } from './BandBadge';
import { useUserStore } from '../stores/userStore';
import { Flame } from 'lucide-react';

export const Layout: React.FC = () => {
  const { profile, fetchProfile, language } = useUserStore();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block shrink-0">
        <Sidebar />
      </div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-6">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-2.5 sm:px-6 flex items-center justify-between gap-2">
          {/* Left Brand on Mobile */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-sm shadow-xs">
                6.5
              </div>
              <span className="font-bold text-sm text-slate-900 dark:text-white">IELTS 6.5+</span>
            </Link>
          </div>

          {/* Center / Desktop Info */}
          <div className="hidden lg:flex items-center gap-3">
            {profile && (
              <>
                <BandBadge band={profile.currentBand} label={language === 'vi' ? 'Hiện tại' : 'Current'} variant="current" size="sm" />
                <span className="text-slate-300 dark:text-slate-700">→</span>
                <BandBadge band={profile.targetBand} label={language === 'vi' ? 'Mục tiêu' : 'Target'} variant="target" size="sm" />
              </>
            )}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {profile && (
              <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 rounded-lg text-xs font-bold text-amber-700 dark:text-amber-400">
                <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span>{profile.streakDays}</span>
              </div>
            )}
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </header>

        {/* Dynamic Route Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
};
