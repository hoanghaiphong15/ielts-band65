import React from 'react';
import { NavLink } from 'react-router-dom';
import { useUserStore } from '../stores/userStore';
import { LayoutDashboard, BookOpen, FileCheck2, BarChart3, Menu } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { language } = useUserStore();

  const tabs = [
    {
      to: '/',
      icon: LayoutDashboard,
      labelEn: 'Home',
      labelVi: 'Trang chủ',
    },
    {
      to: '/practice',
      icon: BookOpen,
      labelEn: 'Practice',
      labelVi: 'Luyện tập',
    },
    {
      to: '/mock-test',
      icon: FileCheck2,
      labelEn: 'Mock',
      labelVi: 'Thi thử',
    },
    {
      to: '/analytics',
      icon: BarChart3,
      labelEn: 'Progress',
      labelVi: 'Tiến độ',
    },
    {
      to: '/settings',
      icon: Menu,
      labelEn: 'More',
      labelVi: 'Thêm',
    },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 pb-safe">
      <div className="flex items-center justify-around h-16 px-1">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 h-full min-h-touch text-[11px] font-medium transition-colors ${
                isActive
                  ? 'text-brand-600 dark:text-brand-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`
            }
          >
            <tab.icon className="w-5 h-5 mb-0.5" />
            <span>{language === 'vi' ? tab.labelVi : tab.labelEn}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
