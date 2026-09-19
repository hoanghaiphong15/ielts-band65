import React, { useEffect, useState } from 'react';
import { useUserStore } from '../../stores/userStore';
import { api } from '../../services/api';
import { DailyStudyPlan, StudyPlanItem } from '@ielts/shared';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  ArrowRight,
  Sparkles,
  Sliders,
} from 'lucide-react';

export const StudyPlanPage: React.FC = () => {
  const { profile, language, updateProfile } = useUserStore();
  const [plan, setPlan] = useState<DailyStudyPlan | null>(null);
  const [selectedMinutes, setSelectedMinutes] = useState<number>(45);
  const [completedTaskIds, setCompletedTaskIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadPlan() {
      setLoading(true);
      try {
        const data = await api.getDailyStudyPlan();
        setPlan(data);
        if (profile) setSelectedMinutes(profile.dailyGoalMinutes);
      } catch (err) {
        console.error('Failed to load study plan:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPlan();
  }, [profile]);

  const handleGenerateCustomPlan = async (mins: number) => {
    setSelectedMinutes(mins);
    setLoading(true);
    try {
      const data = await api.generateStudyPlan(mins);
      setPlan(data);
      if (profile) {
        await updateProfile({ dailyGoalMinutes: mins });
      }
    } catch (err) {
      console.error('Failed to generate custom plan:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskCompleted = (id: string) => {
    setCompletedTaskIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 text-xs font-bold">
          <Calendar className="w-4 h-4" />
          <span>{language === 'vi' ? 'Kế hoạch học tập hàng ngày' : 'Adaptive Daily Study Plan'}</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          {language === 'vi' ? 'Lộ trình luyện tập thích ứng hôm nay' : 'Today’s Adaptive Practice Plan'}
        </h2>

        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
          {language === 'vi'
            ? 'Hệ thống tự động phân bổ thời gian học tập vào các kỹ năng yếu nhất của bạn và nhắc nhở ôn từ vựng theo chu kỳ SM-2.'
            : 'The engine automatically proportions your available study time into your weakest areas and schedules due spaced-repetition flashcards.'}
        </p>

        {/* Time Selector Chips */}
        <div className="pt-2 space-y-2">
          <span className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5" />
            {language === 'vi' ? 'Bạn có bao nhiêu phút hôm nay?' : 'How much time do you have today?'}
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { mins: 15, label: '15m (Rapid Drill)' },
              { mins: 30, label: '30m (Balanced)' },
              { mins: 45, label: '45m (Standard)' },
              { mins: 60, label: '60m (Intensive)' },
            ].map((opt) => (
              <button
                key={opt.mins}
                onClick={() => handleGenerateCustomPlan(opt.mins)}
                className={`p-3 rounded-2xl border text-xs font-bold transition-all min-h-touch ${
                  selectedMinutes === opt.mins
                    ? 'bg-brand-600 text-white shadow-xs border-brand-600'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Daily Tasks List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full" />
        </div>
      ) : plan ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <Clock className="w-4 h-4 text-brand-600" />
              <span>
                Total: {plan.totalPlannedMinutes} minutes • {plan.items.length} tasks
              </span>
            </div>

            <span className="text-xs font-bold text-emerald-600">
              {completedTaskIds.size} / {plan.items.length} completed
            </span>
          </div>

          <div className="space-y-3">
            {plan.items.map((item) => {
              const isCompleted = completedTaskIds.has(item.id);
              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                    isCompleted
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/60'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-brand-300'
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <button
                      onClick={() => toggleTaskCompleted(item.id)}
                      className="mt-0.5 sm:mt-0 p-1 rounded-lg text-slate-400 hover:text-emerald-600 transition-colors min-h-touch min-w-touch flex items-center justify-center"
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                      ) : (
                        <Circle className="w-6 h-6 text-slate-400" />
                      )}
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black px-2 py-0.5 rounded-md bg-brand-100 text-brand-800">
                          {item.skill}
                        </span>
                        <h4
                          className={`text-sm font-bold ${
                            isCompleted
                              ? 'line-through text-slate-400 dark:text-slate-500'
                              : 'text-slate-900 dark:text-white'
                          }`}
                        >
                          {language === 'vi' ? item.titleVi : item.title}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {language === 'vi' ? item.descriptionVi : item.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3 shrink-0">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                      {item.durationMinutes} mins
                    </span>
                    <Link
                      to={item.actionUrl}
                      className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-transform active:scale-95 min-h-touch"
                    >
                      <span>{language === 'vi' ? 'Bắt đầu' : 'Start'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
};
