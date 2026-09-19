import React from 'react';
import { NavLink } from 'react-router-dom';
import { useUserStore } from '../stores/userStore';
import {
  LayoutDashboard,
  Headphones,
  BookOpen,
  PenTool,
  Mic,
  BookMarked,
  GraduationCap,
  AlertCircle,
  Calendar,
  Milestone,
  FileCheck2,
  BarChart3,
  Settings,
  Flame,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { profile, language } = useUserStore();

  const navItems = [
    {
      to: '/',
      icon: LayoutDashboard,
      labelEn: 'Dashboard',
      labelVi: 'Bảng điều khiển',
    },
    {
      to: '/listening',
      icon: Headphones,
      labelEn: 'Listening',
      labelVi: 'Luyện Nghe',
    },
    {
      to: '/reading',
      icon: BookOpen,
      labelEn: 'Reading',
      labelVi: 'Luyện Đọc',
    },
    {
      to: '/writing',
      icon: PenTool,
      labelEn: 'Writing',
      labelVi: 'Luyện Viết',
    },
    {
      to: '/speaking',
      icon: Mic,
      labelEn: 'Speaking',
      labelVi: 'Luyện Nói',
    },
    {
      to: '/vocabulary',
      icon: BookMarked,
      labelEn: 'Vocabulary (SRS)',
      labelVi: 'Từ vựng (SRS)',
    },
    {
      to: '/grammar',
      icon: GraduationCap,
      labelEn: 'Grammar',
      labelVi: 'Ngữ pháp',
    },
    {
      to: '/mistakes',
      icon: AlertCircle,
      labelEn: 'Mistake Book',
      labelVi: 'Sổ tay lỗi sai',
    },
    {
      to: '/study-plan',
      icon: Calendar,
      labelEn: 'Daily Study Plan',
      labelVi: 'Kế hoạch ngày',
    },
    {
      to: '/roadmap',
      icon: Milestone,
      labelEn: 'Road to Band 6.5',
      labelVi: 'Lộ trình Band 6.5',
    },
    {
      to: '/mock-test',
      icon: FileCheck2,
      labelEn: 'Mock Test',
      labelVi: 'Thi thử IELTS',
    },
    {
      to: '/analytics',
      icon: BarChart3,
      labelEn: 'Progress Analytics',
      labelVi: 'Phân tích tiến độ',
    },
    {
      to: '/settings',
      icon: Settings,
      labelEn: 'Settings & Backup',
      labelVi: 'Cài đặt & Sao lưu',
    },
  ];

  return (
    <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col h-screen sticky top-0">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
            6.5
          </div>
          <div>
            <h1 className="font-bold text-sm leading-tight text-slate-900 dark:text-white">
              IELTS Band 6.5+
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === 'vi' ? 'Huấn luyện viên cá nhân' : 'Personal Coach'}
            </p>
          </div>
        </div>
      </div>

      {/* User Progress Mini Card */}
      {profile && (
        <div className="p-3 mx-3 mt-3 rounded-xl bg-brand-50 dark:bg-brand-950/40 border border-brand-100 dark:border-brand-900/60">
          <div className="flex items-center justify-between text-xs font-semibold mb-1">
            <span className="text-slate-600 dark:text-slate-300">
              {language === 'vi' ? 'Mục tiêu:' : 'Target:'} Band {profile.targetBand.toFixed(1)}
            </span>
            <span className="text-brand-600 dark:text-brand-400">
              {language === 'vi' ? 'Ước tính:' : 'Est:'} {profile.currentBand.toFixed(1)}
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-brand-600 h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, Math.max(10, ((profile.currentBand - 4.0) / (profile.targetBand - 4.0)) * 100))}%`,
              }}
            />
          </div>
          <div className="flex items-center gap-1 mt-2 text-xs font-medium text-amber-600 dark:text-amber-400">
            <Flame className="w-3.5 h-3.5 fill-amber-500" />
            <span>
              {profile.streakDays} {language === 'vi' ? 'ngày liên tiếp' : 'day streak'}
            </span>
          </div>
        </div>
      )}

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-brand-600 text-white shadow-xs font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`
            }
          >
            <item.icon className="w-4 h-4 shrink-0" />
            <span className="truncate">{language === 'vi' ? item.labelVi : item.labelEn}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
