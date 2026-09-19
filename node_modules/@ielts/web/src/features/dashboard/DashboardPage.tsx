import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUserStore } from '../../stores/userStore';
import { api } from '../../services/api';
import { DailyStudyPlan } from '@ielts/shared';
import {
  Flame,
  Clock,
  Target,
  ArrowUpRight,
  Headphones,
  BookOpen,
  PenTool,
  Mic,
  BookMarked,
  AlertTriangle,
  CheckCircle2,
  Circle,
  Play,
  Sparkles,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { profile, language } = useUserStore();
  const [studyPlan, setStudyPlan] = useState<DailyStudyPlan | null>(null);
  const [vocabStats, setVocabStats] = useState<any>(null);
  const [recentMistakesCount, setRecentMistakesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [plan, vStats, mistakes] = await Promise.all([
          api.getDailyStudyPlan(),
          api.getVocabStats(),
          api.getMistakes({ isResolved: false, limit: 10 }),
        ]);
        setStudyPlan(plan);
        setVocabStats(vStats);
        setRecentMistakesCount(mistakes.length);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  if (!profile) return null;

  // Calculate progress percentage from 5.0 baseline to 6.5 target
  const current = profile.currentBand;
  const target = profile.targetBand;
  const progressPct = Math.min(100, Math.max(10, Math.round(((current - 4.5) / (target - 4.5)) * 100)));

  // Identify weakest skill
  const skillScores = [
    { name: 'Listening', nameVi: 'Nghe', band: profile.listeningBand, icon: Headphones, path: '/listening' },
    { name: 'Reading', nameVi: 'Đọc', band: profile.readingBand, icon: BookOpen, path: '/reading' },
    { name: 'Writing', nameVi: 'Viết', band: profile.writingBand, icon: PenTool, path: '/writing' },
    { name: 'Speaking', nameVi: 'Nói', band: profile.speakingBand, icon: Mic, path: '/speaking' },
  ];
  skillScores.sort((a, b) => a.band - b.band);
  const weakestSkill = skillScores[0];

  return (
    <div className="space-y-6">
      {/* Welcome & Goal Banner */}
      <div className="bg-gradient-to-br from-brand-600 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>
              {language === 'vi' ? 'Hành trình chinh phục IELTS Band 6.5+' : 'Road to IELTS Band 6.5+'}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            {language === 'vi'
              ? `Chào mừng trở lại! Mục tiêu hôm nay là ${profile.dailyGoalMinutes} phút`
              : `Welcome back! Today's goal is ${profile.dailyGoalMinutes} minutes`}
          </h2>

          <p className="text-brand-100 text-sm sm:text-base mb-6">
            {language === 'vi'
              ? `Band ước tính hiện tại: ${current.toFixed(1)} / Mục tiêu: ${target.toFixed(1)}. Tập trung vào ${weakestSkill.nameVi} để bứt phá!`
              : `Current estimated level: ${current.toFixed(1)} / Target: ${target.toFixed(1)}. Focus on ${weakestSkill.name} to accelerate progress!`}
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              to={weakestSkill.path}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-brand-700 hover:bg-brand-50 font-bold text-sm shadow-md transition-all active:scale-95 min-h-touch"
            >
              <Play className="w-4 h-4 fill-brand-700" />
              <span>
                {language === 'vi'
                  ? `Luyện tập kỹ năng yếu nhất (${weakestSkill.nameVi})`
                  : `Drill Weakest Skill (${weakestSkill.name})`}
              </span>
            </Link>

            <Link
              to="/mock-test"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-all min-h-touch"
            >
              <span>{language === 'vi' ? 'Làm bài thi thử' : 'Take Mock Test'}</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Big Circular Progress Indicator on the right */}
        <div className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 flex-col items-center justify-center">
          <div className="relative w-36 h-36">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                className="text-white/15 stroke-current"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                className="text-amber-400 stroke-current transition-all duration-1000 ease-out"
                strokeWidth="10"
                strokeDasharray={251.2}
                strokeDashoffset={251.2 - (251.2 * progressPct) / 100}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-black">{progressPct}%</span>
              <span className="text-[10px] uppercase font-bold text-brand-200">
                {language === 'vi' ? 'Tiến độ' : 'Progress'}
              </span>
            </div>
          </div>
          <span className="text-xs font-semibold text-brand-200 mt-2">
            Band {current.toFixed(1)} → {target.toFixed(1)}
          </span>
        </div>
      </div>

      {/* 4 Skill Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {skillScores.map((skill) => {
          const isWeakest = skill.name === weakestSkill.name;
          return (
            <Link
              key={skill.name}
              to={skill.path}
              className={`p-4 rounded-2xl border transition-all bg-white dark:bg-slate-900 shadow-xs hover:shadow-md ${
                isWeakest
                  ? 'border-amber-400 dark:border-amber-600/60 ring-2 ring-amber-400/20'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400">
                  <skill.icon className="w-5 h-5" />
                </div>
                <span className="text-lg font-black text-slate-900 dark:text-white">
                  {skill.band.toFixed(1)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {language === 'vi' ? skill.nameVi : skill.name}
                </span>
                {isWeakest && (
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                    {language === 'vi' ? 'Cần cải thiện' : 'Priority'}
                  </span>
                )}
              </div>

              {/* Progress toward 6.5 */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                <div
                  className={`h-full rounded-full ${isWeakest ? 'bg-amber-500' : 'bg-brand-600'}`}
                  style={{ width: `${Math.min(100, (skill.band / 6.5) * 100)}%` }}
                />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Main Grid: Today's Study Plan + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Today's Plan */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-brand-600" />
                <span>{language === 'vi' ? "Kế hoạch học hôm nay" : "Today's Study Plan"}</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {language === 'vi'
                  ? `Thời lượng: ${studyPlan?.totalPlannedMinutes || 45} phút thích ứng theo điểm yếu`
                  : `Duration: ${studyPlan?.totalPlannedMinutes || 45} min adaptive to your weaknesses`}
              </p>
            </div>

            <Link
              to="/study-plan"
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
            >
              {language === 'vi' ? 'Tùy chỉnh' : 'Customize'}
            </Link>
          </div>

          <div className="space-y-2.5">
            {studyPlan?.items.map((item) => (
              <Link
                key={item.id}
                to={item.actionUrl}
                className="flex items-center justify-between p-3 sm:p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors min-h-touch"
              >
                <div className="flex items-center gap-3">
                  {item.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                      {language === 'vi' ? item.titleVi : item.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {language === 'vi' ? item.descriptionVi : item.description}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {item.durationMinutes}m
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Quick Status Cards */}
        <div className="space-y-4">
          {/* Vocabulary SRS Box */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <BookMarked className="w-5 h-5 text-brand-600" />
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  {language === 'vi' ? 'Từ vựng (SRS)' : 'Vocabulary (SRS)'}
                </h4>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-bold">
                {vocabStats?.dueCount || 0} {language === 'vi' ? 'đến hạn' : 'due'}
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
              {language === 'vi'
                ? `Đã học ${vocabStats?.learningCount || 0} từ. Còn ${vocabStats?.dueCount || 0} từ cần ôn tập theo thuật toán lặp lại ngắt quãng hôm nay.`
                : `Learning ${vocabStats?.learningCount || 0} words. ${vocabStats?.dueCount || 0} words due for spaced repetition today.`}
            </p>

            <Link
              to="/vocabulary?mode=review"
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-xs min-h-touch"
            >
              <span>{language === 'vi' ? 'Ôn từ vựng ngay' : 'Review Due Words'}</span>
            </Link>
          </div>

          {/* Mistake Notebook Box */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  {language === 'vi' ? 'Sổ tay lỗi sai' : 'Mistake Book'}
                </h4>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold">
                {recentMistakesCount} {language === 'vi' ? 'lỗi chưa sửa' : 'unresolved'}
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
              {language === 'vi'
                ? 'Tất cả câu trả lời sai tự động được lưu tại đây để bạn làm lại cho tới khi thành thạo.'
                : 'All incorrect answers are automatically saved here so you can practice them until mastered.'}
            </p>

            <Link
              to="/mistakes"
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs min-h-touch"
            >
              <span>{language === 'vi' ? 'Xem lại các lỗi sai' : 'Review Mistakes'}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
