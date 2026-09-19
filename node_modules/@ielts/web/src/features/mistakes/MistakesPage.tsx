import React, { useEffect, useState } from 'react';
import { useUserStore } from '../../stores/userStore';
import { api } from '../../services/api';
import { Mistake } from '@ielts/shared';
import {
  AlertCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Filter,
  Eye,
  Search,
} from 'lucide-react';

export const MistakesPage: React.FC = () => {
  const { language } = useUserStore();
  const [mistakes, setMistakes] = useState<Mistake[]>([]);
  const [filterSkill, setFilterSkill] = useState<string>('ALL');
  const [showOnlyUnresolved, setShowOnlyUnresolved] = useState<boolean>(true);
  const [activePracticeMistake, setActivePracticeMistake] = useState<Mistake | null>(null);
  const [practiceInput, setPracticeInput] = useState<string>('');
  const [practiceResult, setPracticeResult] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadMistakes = async () => {
    setLoading(true);
    try {
      const data = await api.getMistakes({
        skill: filterSkill === 'ALL' ? undefined : filterSkill,
        isResolved: showOnlyUnresolved ? false : undefined,
      });
      setMistakes(data);
    } catch (err) {
      console.error('Failed to load mistakes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMistakes();
  }, [filterSkill, showOnlyUnresolved]);

  const handleRePracticeSubmit = async () => {
    if (!activePracticeMistake || !practiceInput.trim()) return;

    try {
      const res = await api.rePracticeMistake(activePracticeMistake.id, practiceInput);
      setPracticeResult(res);
      if (res.isCorrect) {
        // Refresh list
        loadMistakes();
      }
    } catch (err) {
      console.error('Failed to submit re-practice:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-amber-500" />
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {language === 'vi' ? 'Sổ tay lỗi sai (Mistake Book)' : 'Mistake Book'}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {language === 'vi'
                ? 'Tất cả các câu trả lời sai tự động được ghi nhận tại đây để bạn luyện tập lại cho đến khi đạt Band 6.5+.'
                : 'Every missed question is systematically recorded here so you can practice again until mastered.'}
            </p>
          </div>

          {/* Toggle Resolved */}
          <button
            onClick={() => setShowOnlyUnresolved(!showOnlyUnresolved)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors min-h-touch ${
              showOnlyUnresolved
                ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            {showOnlyUnresolved
              ? language === 'vi'
                ? 'Chỉ hiện lỗi chưa sửa'
                : 'Showing Unresolved'
              : language === 'vi'
              ? 'Hiện tất cả lỗi'
              : 'Showing All'}
          </button>
        </div>

        {/* Skill Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {['ALL', 'READING', 'LISTENING', 'GRAMMAR', 'WRITING', 'SPEAKING'].map((sk) => (
            <button
              key={sk}
              onClick={() => setFilterSkill(sk)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 min-h-touch ${
                filterSkill === sk
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {sk}
            </button>
          ))}
        </div>
      </div>

      {/* Mistake Cards List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full" />
        </div>
      ) : mistakes.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
          <h3 className="text-lg font-black text-slate-900 dark:text-white">
            {language === 'vi' ? 'Không có lỗi sai nào!' : 'No Mistakes Found!'}
          </h3>
          <p className="text-xs text-slate-500">
            {language === 'vi'
              ? 'Tuyệt vời! Hãy tiếp tục luyện tập thêm các kỹ năng khác.'
              : 'Great job! Continue practicing reading, listening, and grammar modules.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {mistakes.map((m) => (
            <div
              key={m.id}
              className={`p-5 rounded-3xl bg-white dark:bg-slate-900 border shadow-xs space-y-3 transition-all ${
                m.isResolved
                  ? 'border-emerald-200 dark:border-emerald-900/60 opacity-80'
                  : 'border-slate-200 dark:border-slate-800 hover:border-amber-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-md bg-brand-100 text-brand-800">
                    {m.skill}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">{m.topic}</span>
                </div>

                <div className="flex items-center gap-2">
                  {m.isResolved ? (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      {language === 'vi' ? 'Đã khắc phục' : 'Resolved'}
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {language === 'vi' ? 'Cần làm lại' : 'Needs Practice'}
                    </span>
                  )}
                </div>
              </div>

              {/* Question Text */}
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {m.questionText}
              </p>

              {/* Comparison Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50">
                  <span className="font-bold text-rose-700 dark:text-rose-300">
                    {language === 'vi' ? 'Câu trả lời của bạn:' : 'Your Answer:'}
                  </span>
                  <p className="font-semibold text-rose-900 dark:text-rose-200 mt-0.5">
                    {m.userAnswer}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50">
                  <span className="font-bold text-emerald-700 dark:text-emerald-300">
                    {language === 'vi' ? 'Đáp án đúng chuẩn:' : 'Correct Answer:'}
                  </span>
                  <p className="font-bold text-emerald-900 dark:text-emerald-200 mt-0.5">
                    {m.correctAnswer}
                  </p>
                </div>
              </div>

              {/* Evidence Quote if available */}
              {m.evidenceQuote && (
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs">
                  <span className="font-bold text-slate-600 dark:text-slate-400">
                    {language === 'vi' ? 'Dẫn chứng:' : 'Evidence:'}
                  </span>{' '}
                  <span className="italic text-slate-800 dark:text-slate-200">
                    "{m.evidenceQuote}"
                  </span>
                </div>
              )}

              {/* Explanation */}
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {language === 'vi' ? 'Giải thích lý do:' : 'Why:'}
                </span>{' '}
                {language === 'vi' ? m.explanationVi : m.explanationEn}
              </p>

              {/* Action Button: Practice this mistake again */}
              <div className="flex justify-end pt-1">
                <button
                  onClick={() => {
                    setActivePracticeMistake(m);
                    setPracticeInput('');
                    setPracticeResult(null);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-xs transition-transform active:scale-95 min-h-touch"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{language === 'vi' ? 'Làm lại câu này' : 'Practice Again'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Re-practice Modal */}
      {activePracticeMistake && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase text-brand-600">
                {language === 'vi' ? 'Luyện lại câu sai' : 'Re-Practice Mistake'}
              </span>
              <button
                onClick={() => setActivePracticeMistake(null)}
                className="text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕ Close
              </button>
            </div>

            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {activePracticeMistake.questionText}
            </p>

            <input
              type="text"
              value={practiceInput}
              onChange={(e) => setPracticeInput(e.target.value)}
              placeholder="Type your new answer here..."
              className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-semibold min-h-touch"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setActivePracticeMistake(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold min-h-touch"
              >
                Cancel
              </button>
              <button
                onClick={handleRePracticeSubmit}
                disabled={!practiceInput.trim()}
                className="px-6 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold text-xs shadow-md min-h-touch"
              >
                {language === 'vi' ? 'Kiểm tra lại' : 'Submit Retry'}
              </button>
            </div>

            {practiceResult && (
              <div
                className={`p-4 rounded-xl border text-xs space-y-1 ${
                  practiceResult.isCorrect
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-100'
                    : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-100'
                }`}
              >
                <div className="font-bold">
                  {practiceResult.isCorrect
                    ? language === 'vi'
                      ? '✓ Chính xác! Câu này đã được đánh dấu là đã khắc phục.'
                      : '✓ Correct! This mistake is now marked as resolved.'
                    : language === 'vi'
                    ? `✗ Vẫn chưa đúng. Đáp án chuẩn: "${practiceResult.correctAnswer}"`
                    : `✗ Still incorrect. Correct answer: "${practiceResult.correctAnswer}"`}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
