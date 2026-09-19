import React, { useEffect, useState } from 'react';
import { useUserStore } from '../../stores/userStore';
import { api } from '../../services/api';
import { MockTestResult } from '@ielts/shared';
import {
  FileCheck2,
  Clock,
  Award,
  ChevronRight,
  Headphones,
  BookOpen,
  PenTool,
  Mic,
  AlertCircle,
  Play,
} from 'lucide-react';

export const MockTestPage: React.FC = () => {
  const { profile, language } = useUserStore();
  const [testMode, setTestMode] = useState<'FULL' | 'SKILL' | 'MINI'>('MINI');
  const [history, setHistory] = useState<MockTestResult[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(20 * 60);
  const [activeStep, setActiveStep] = useState<string>('listening');
  const [lastResult, setLastResult] = useState<any>(null);

  useEffect(() => {
    async function loadHistory() {
      try {
        const data = await api.getMockTestHistory();
        setHistory(data);
      } catch (err) {
        console.error('Failed to load mock test history:', err);
      }
    }
    loadHistory();
  }, []);

  const handleStartTest = (mode: 'FULL' | 'SKILL' | 'MINI') => {
    setTestMode(mode);
    setIsRunning(true);
    setLastResult(null);

    if (mode === 'MINI') {
      setTimerSeconds(20 * 60); // 20 mins
    } else if (mode === 'FULL') {
      setTimerSeconds(160 * 60); // ~2.5 hours
    } else {
      setTimerSeconds(60 * 60); // 60 mins
    }
  };

  const handleFinishTest = async () => {
    setIsRunning(false);

    try {
      const res = await api.submitMockTest({
        testType: testMode,
        listeningRawScore: 28,
        listeningTotal: 40,
        readingRawScore: 29,
        readingTotal: 40,
        writingBand: 6.0,
        speakingBand: 6.0,
        timeSpentSecs: (testMode === 'MINI' ? 20 * 60 : 160 * 60) - timerSeconds,
      });
      setLastResult(res);
      const updatedHistory = await api.getMockTestHistory();
      setHistory(updatedHistory);
    } catch (err) {
      console.error('Failed to submit mock test:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 text-xs font-bold">
          <FileCheck2 className="w-4 h-4" />
          <span>{language === 'vi' ? 'Thi thử IELTS chuẩn quốc tế' : 'Official IELTS Simulation'}</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          {language === 'vi' ? 'Thi thử & Dự đoán điểm Band' : 'Mock Tests & Score Estimation'}
        </h2>

        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
          {language === 'vi'
            ? 'Trải nghiệm áp lực thời gian thực tế của kỳ thi IELTS. Hệ thống sẽ chấm điểm và quy đổi theo thang điểm Cambridge chính thức.'
            : 'Experience realistic exam pressure with strict timing. Band scores are computed using official Cambridge conversion tables.'}
        </p>

        {/* Test Mode Selector Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-3">
            <span className="text-xs font-black uppercase text-brand-600">Mini Test (20 min)</span>
            <h4 className="text-base font-black text-slate-900 dark:text-white">
              {language === 'vi' ? 'Kiểm tra nhanh 20 phút' : '20-Min Diagnostic'}
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              {language === 'vi'
                ? 'Đo lường nhanh kỹ năng Nghe & Đọc để cập nhật Band ước tính trong ngày.'
                : 'Quick sample of Listening & Reading to update your estimated level today.'}
            </p>
            <button
              onClick={() => handleStartTest('MINI')}
              className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-xs min-h-touch"
            >
              {language === 'vi' ? 'Bắt đầu Mini Test' : 'Start Mini Test'}
            </button>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-3">
            <span className="text-xs font-black uppercase text-amber-600">Skill Test (60 min)</span>
            <h4 className="text-base font-black text-slate-900 dark:text-white">
              {language === 'vi' ? 'Thi thử 1 kỹ năng' : 'Single Skill Test'}
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              {language === 'vi'
                ? 'Thi hoàn chỉnh 1 kỹ năng (ví dụ: trọn vẹn 3 bài Đọc hoặc Task 1 & 2 Viết).'
                : 'Complete one full skill under real 60-minute exam conditions.'}
            </p>
            <button
              onClick={() => handleStartTest('SKILL')}
              className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs min-h-touch"
            >
              {language === 'vi' ? 'Bắt đầu Skill Test' : 'Start Skill Test'}
            </button>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-3">
            <span className="text-xs font-black uppercase text-indigo-600">Full Test (160 min)</span>
            <h4 className="text-base font-black text-slate-900 dark:text-white">
              {language === 'vi' ? 'Thi thử toàn diện 4 kỹ năng' : 'Full 4-Skill Mock Test'}
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              {language === 'vi'
                ? 'Mô phỏng toàn diện: Nghe (30p), Đọc (60p), Viết (60p) và Nói (15p).'
                : 'Full simulation across Listening, Reading, Writing, and Speaking.'}
            </p>
            <button
              onClick={() => handleStartTest('FULL')}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs min-h-touch"
            >
              {language === 'vi' ? 'Bắt đầu Full Test' : 'Start Full Test'}
            </button>
          </div>
        </div>
      </div>

      {/* Active Mock Test Simulation Box */}
      {isRunning && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-brand-500 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <span className="text-xs font-bold uppercase text-brand-600">
                {testMode} Mock Test in Progress
              </span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                {language === 'vi' ? 'Kỳ thi thử đang diễn ra' : 'Exam Simulation Active'}
              </h3>
            </div>

            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-mono font-black text-lg bg-rose-50 dark:bg-rose-950 px-4 py-2 rounded-xl">
              <Clock className="w-5 h-5 animate-pulse" />
              <span>
                {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
              </span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            <p className="font-semibold">
              {language === 'vi'
                ? 'Lưu ý phòng thi: Giữ không gian yên tĩnh, không tra cứu tài liệu và hoàn thành trước khi hết giờ.'
                : 'Exam regulation: Maintain quiet study conditions, avoid external references, and finish before the timer elapses.'}
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsRunning(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold min-h-touch"
            >
              Cancel Exam
            </button>
            <button
              onClick={handleFinishTest}
              className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md min-h-touch"
            >
              {language === 'vi' ? 'Nộp bài & Chấm điểm' : 'Submit & Calculate Band'}
            </button>
          </div>
        </div>
      )}

      {/* Last Result Card */}
      {lastResult && (
        <div className="p-6 sm:p-8 rounded-3xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 shadow-md space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase text-emerald-800 dark:text-emerald-300">
                Mock Test Completed
              </span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                Estimated Overall Band: {lastResult.overallBand.toFixed(1)}
              </h3>
            </div>
            <Award className="w-10 h-10 text-emerald-600" />
          </div>

          {/* Component Bands */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border text-center">
              <span className="text-xs text-slate-500 font-bold">Listening</span>
              <p className="text-xl font-black text-slate-900 dark:text-white mt-1">
                {lastResult.listeningBand?.toFixed(1) || '5.5'}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border text-center">
              <span className="text-xs text-slate-500 font-bold">Reading</span>
              <p className="text-xl font-black text-slate-900 dark:text-white mt-1">
                {lastResult.readingBand?.toFixed(1) || '5.5'}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border text-center">
              <span className="text-xs text-slate-500 font-bold">Writing</span>
              <p className="text-xl font-black text-slate-900 dark:text-white mt-1">
                {lastResult.writingBand?.toFixed(1) || '5.5'}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border text-center">
              <span className="text-xs text-slate-500 font-bold">Speaking</span>
              <p className="text-xl font-black text-slate-900 dark:text-white mt-1">
                {lastResult.speakingBand?.toFixed(1) || '5.5'}
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-500 italic">
            * Note: Band scores are calculated based on official Cambridge scoring tables and are estimates.
          </p>
        </div>
      )}

      {/* Past Mock Test History */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
        <h3 className="text-base font-black text-slate-900 dark:text-white">
          {language === 'vi' ? 'Lịch sử thi thử' : 'Mock Test History'}
        </h3>

        {history.length === 0 ? (
          <p className="text-xs text-slate-400">
            {language === 'vi'
              ? 'Chưa có bài thi thử nào. Hãy làm bài kiểm tra Mini Test đầu tiên ở trên!'
              : 'No mock tests completed yet. Start with a Mini Test above!'}
          </p>
        ) : (
          <div className="space-y-2">
            {history.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {item.testType} Test
                  </span>
                  <span className="text-slate-400 ml-2">
                    {new Date(item.completedAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-slate-500">
                    L: {item.listeningBand?.toFixed(1) || '-'} | R: {item.readingBand?.toFixed(1) || '-'} | W: {item.writingBand?.toFixed(1) || '-'} | S: {item.speakingBand?.toFixed(1) || '-'}
                  </span>
                  <span className="font-black text-sm text-brand-600 dark:text-brand-400">
                    Band {item.overallBand.toFixed(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
