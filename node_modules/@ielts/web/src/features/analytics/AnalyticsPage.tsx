import React, { useEffect, useState } from 'react';
import { useUserStore } from '../../stores/userStore';
import { api } from '../../services/api';
import {
  BarChart3,
  TrendingUp,
  Award,
  BookMarked,
  AlertTriangle,
  Flame,
  Clock,
  Target,
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const { profile, language } = useUserStore();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const res = await api.getAnalytics();
        setData(res);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 text-xs font-bold">
          <BarChart3 className="w-4 h-4" />
          <span>{language === 'vi' ? 'Phân tích tiến độ học tập' : 'Progress Analytics'}</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          {language === 'vi' ? 'Hiệu suất & Thống kê chi tiết' : 'Performance & Diagnostic Stats'}
        </h2>

        <p className="text-sm text-slate-600 dark:text-slate-400">
          {language === 'vi'
            ? 'Theo dõi sự cải thiện của từng dạng câu hỏi và kỹ năng để tối ưu hóa thời gian ôn luyện.'
            : 'Track accuracy by question type and skill to eliminate weak spots on your journey to Band 6.5+.'}
        </p>
      </div>

      {/* Top Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-bold">Current Est. Band</span>
          <p className="text-3xl font-black text-brand-600">
            {profile?.currentBand.toFixed(1) || '5.0'}
          </p>
          <span className="text-[11px] text-slate-400">Target: Band 6.5</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-bold">Study Streak</span>
          <p className="text-3xl font-black text-amber-500 flex items-center gap-1">
            <Flame className="w-7 h-7 fill-amber-500" />
            <span>{profile?.streakDays || 1}</span>
          </p>
          <span className="text-[11px] text-slate-400">Consecutive days</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-bold">Vocabulary Mastered</span>
          <p className="text-3xl font-black text-emerald-600">
            {data?.vocabulary?.mastered || 0}
          </p>
          <span className="text-[11px] text-slate-400">
            Out of {data?.vocabulary?.total || 100} words
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-bold">Unresolved Mistakes</span>
          <p className="text-3xl font-black text-rose-500">
            {data?.mistakes?.unresolved || 0}
          </p>
          <span className="text-[11px] text-slate-400">In Mistake Book</span>
        </div>
      </div>

      {/* Accuracy by Question Type */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
        <h3 className="text-lg font-black text-slate-900 dark:text-white">
          {language === 'vi' ? 'Độ chính xác theo dạng câu hỏi' : 'Accuracy by Question Type'}
        </h3>

        <div className="space-y-4">
          {[
            { type: 'True / False / Not Given', pct: 65, count: 18 },
            { type: 'Multiple Choice (MCQ)', pct: 80, count: 22 },
            { type: 'Matching Headings', pct: 55, count: 12 },
            { type: 'Summary Completion', pct: 72, count: 15 },
            { type: 'Form / Note Completion', pct: 85, count: 20 },
          ].map((item) => (
            <div key={item.type} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-800 dark:text-slate-200">{item.type}</span>
                <span
                  className={
                    item.pct >= 75
                      ? 'text-emerald-600'
                      : item.pct >= 60
                      ? 'text-brand-600'
                      : 'text-rose-600'
                  }
                >
                  {item.pct}% ({item.count} questions)
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    item.pct >= 75
                      ? 'bg-emerald-500'
                      : item.pct >= 60
                      ? 'bg-brand-600'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${item.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
