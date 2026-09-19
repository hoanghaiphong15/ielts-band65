import React, { useEffect, useState } from 'react';
import { useUserStore } from '../../stores/userStore';
import { api } from '../../services/api';
import { WritingPrompt, WritingEvaluation } from '@ielts/shared';
import {
  PenTool,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Award,
  BookOpen,
  ChevronDown,
  ChevronUp,
  FileText,
  Lightbulb,
} from 'lucide-react';

export const WritingPage: React.FC = () => {
  const { language } = useUserStore();
  const [taskType, setTaskType] = useState<'TASK_1' | 'TASK_2'>('TASK_2');
  const [prompts, setPrompts] = useState<WritingPrompt[]>([]);
  const [selectedPromptIdx, setSelectedPromptIdx] = useState<number>(0);
  const [essayContent, setEssayContent] = useState<string>('');
  const [planNotes, setPlanNotes] = useState<string>('');
  const [showPlanner, setShowPlanner] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'write' | 'plan' | 'sample'>('write');

  // Timer state
  const [timerSeconds, setTimerSeconds] = useState<number>(40 * 60); // 40 mins for Task 2
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Evaluation state
  const [evaluation, setEvaluation] = useState<WritingEvaluation | null>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadPrompts() {
      setLoading(true);
      try {
        const data = await api.getWritingPrompts({ taskType });
        setPrompts(data);
        setSelectedPromptIdx(0);
        setEssayContent('');
        setEvaluation(null);
        setTimerSeconds(taskType === 'TASK_1' ? 20 * 60 : 40 * 60);
        setIsTimerRunning(false);
      } catch (err) {
        console.error('Failed to load writing prompts:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPrompts();
  }, [taskType]);

  // Timer interval
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const activePrompt = prompts[selectedPromptIdx];

  const wordCount = essayContent.trim() ? essayContent.trim().split(/\s+/).length : 0;
  const minWords = taskType === 'TASK_1' ? 150 : 250;

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSubmitEssay = async () => {
    if (!activePrompt || wordCount < 30) return;
    setIsEvaluating(true);
    setIsTimerRunning(false);

    try {
      const res = await api.submitWriting({
        promptId: activePrompt.id,
        taskType,
        content: essayContent,
        planNotes,
        timeSpentSecs: (taskType === 'TASK_1' ? 20 * 60 : 40 * 60) - timerSeconds,
      });
      setEvaluation(res.evaluation);
    } catch (err) {
      console.error('Failed to submit essay:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Controls: Task 1 / Task 2 Selector & Timer */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
        {/* Task 1 / Task 2 Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTaskType('TASK_1')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all min-h-touch ${
              taskType === 'TASK_1'
                ? 'bg-brand-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            IELTS Writing Task 1 (150+ words)
          </button>
          <button
            onClick={() => setTaskType('TASK_2')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all min-h-touch ${
              taskType === 'TASK_2'
                ? 'bg-brand-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            IELTS Writing Task 2 (250+ words)
          </button>
        </div>

        {/* Live Timer and Word Count Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300">
            <Clock className="w-4 h-4 text-brand-600" />
            <span>{formatTimer(timerSeconds)}</span>
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="ml-1 text-[11px] underline text-brand-600 dark:text-brand-400"
            >
              {isTimerRunning ? 'Pause' : 'Start'}
            </button>
          </div>

          <div
            className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
              wordCount >= minWords
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
            }`}
          >
            {wordCount} / {minWords} words
          </div>
        </div>
      </div>

      {activePrompt && (
        <div className="space-y-6">
          {/* Prompt Selector & Details Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-brand-600 tracking-wider">
                {activePrompt.subType.replace('_', ' ')}
              </span>

              {/* Prompt Carousel Dropdown / Buttons */}
              <div className="flex items-center gap-1 overflow-x-auto max-w-[240px]">
                {prompts.map((p, idx) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedPromptIdx(idx);
                      setEvaluation(null);
                    }}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-all shrink-0 ${
                      selectedPromptIdx === idx
                        ? 'bg-brand-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              {activePrompt.title}
            </h3>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
              {activePrompt.prompt}
            </div>

            {/* Task 2 Planning Wizard Button */}
            {taskType === 'TASK_2' && (
              <div>
                <button
                  onClick={() => setShowPlanner(!showPlanner)}
                  className="inline-flex items-center gap-2 text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline min-h-touch"
                >
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <span>
                    {language === 'vi'
                      ? 'Dàn ý 8 bước chinh phục Band 6.5+'
                      : '8-Step Structured Planning Wizard (Band 6.5+)'}
                  </span>
                  {showPlanner ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showPlanner && (
                  <div className="mt-3 p-4 rounded-2xl bg-brand-50/70 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-900/50 space-y-3">
                    <h4 className="font-bold text-xs text-brand-900 dark:text-brand-200 uppercase">
                      {language === 'vi' ? 'Quy trình lập dàn ý chuẩn:' : 'Recommended Essay Structure:'}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {activePrompt.suggestedStructure.map((step, sIdx) => (
                        <div
                          key={sIdx}
                          className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-brand-100 dark:border-brand-900/60"
                        >
                          <span className="font-bold text-brand-700 dark:text-brand-400">
                            {language === 'vi' ? step.stepVi : step.step}:
                          </span>{' '}
                          <span className="text-slate-600 dark:text-slate-300">{step.tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Editor & Plan Tabs */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('write')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors min-h-touch ${
                    activeTab === 'write'
                      ? 'bg-brand-600 text-white'
                      : 'text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {language === 'vi' ? 'Viết bài luận' : 'Essay Draft'}
                </button>
                <button
                  onClick={() => setActiveTab('plan')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors min-h-touch ${
                    activeTab === 'plan'
                      ? 'bg-brand-600 text-white'
                      : 'text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {language === 'vi' ? 'Ghi chú dàn ý' : 'Planning Notes'}
                </button>
                <button
                  onClick={() => setActiveTab('sample')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors min-h-touch ${
                    activeTab === 'sample'
                      ? 'bg-brand-600 text-white'
                      : 'text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {language === 'vi' ? 'Bài mẫu Band 6.5' : 'Band 6.5 Sample'}
                </button>
              </div>
            </div>

            {activeTab === 'write' && (
              <div className="space-y-4">
                <textarea
                  rows={14}
                  value={essayContent}
                  onChange={(e) => setEssayContent(e.target.value)}
                  placeholder="Type your IELTS response here... (Aim for at least 150 words for Task 1 or 250 words for Task 2)"
                  className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-medium leading-relaxed resize-y focus:ring-2 focus:ring-brand-500/20"
                />

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {wordCount < minWords ? (
                      <span className="text-amber-600 dark:text-amber-400 font-semibold">
                        ⚠️ Need {minWords - wordCount} more words to satisfy length criteria.
                      </span>
                    ) : (
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                        ✓ Meets minimum length requirement ({wordCount} words).
                      </span>
                    )}
                  </div>

                  <button
                    onClick={handleSubmitEssay}
                    disabled={isEvaluating || wordCount < 30}
                    className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-transform active:scale-95 flex items-center gap-2 min-h-touch"
                  >
                    {isEvaluating ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                        <span>{language === 'vi' ? 'Đang chấm bài...' : 'Evaluating...'}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>{language === 'vi' ? 'Chấm điểm 4 tiêu chí' : 'Evaluate Band 6.5'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'plan' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {language === 'vi'
                    ? 'Dành 3-5 phút lên dàn ý trước khi viết giúp bài viết mạch lạc và không lạc đề.'
                    : 'Spend 3-5 minutes outlining your ideas, topic sentences, and thesis statement before writing.'}
                </p>
                <textarea
                  rows={10}
                  value={planNotes}
                  onChange={(e) => setPlanNotes(e.target.value)}
                  placeholder="Notes: Topic, Question Type, Thesis, Body 1 Idea, Body 2 Idea, Conclusion..."
                  className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-medium"
                />
              </div>
            )}

            {activeTab === 'sample' && (
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-brand-600 tracking-wider">
                    Band 6.5+ Model Answer
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                    Target Score: 6.5 - 7.0
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed">
                  {activePrompt.band65Sample}
                </p>
                {activePrompt.keyVocabulary && activePrompt.keyVocabulary.length > 0 && (
                  <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                      Key Collocations & Academic Expressions:
                    </span>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {activePrompt.keyVocabulary.map((word, wIdx) => (
                        <span
                          key={wIdx}
                          className="text-xs px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-semibold text-brand-700 dark:text-brand-300"
                        >
                          {word}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Evaluation Results Breakdown */}
          {evaluation && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
                <div>
                  <span className="text-xs font-extrabold uppercase text-brand-600 tracking-wider">
                    {language === 'vi' ? 'Kết quả đánh giá chi tiết' : 'Comprehensive Evaluation'}
                  </span>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                    {language === 'vi' ? 'Đánh giá theo 4 tiêu chí chuẩn IELTS' : 'Official 4-Criteria Rubric Assessment'}
                  </h3>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-900">
                  <Award className="w-8 h-8 text-brand-600" />
                  <div>
                    <span className="text-xs text-slate-500 font-semibold">
                      {language === 'vi' ? 'Band ước tính' : 'Estimated Band'}
                    </span>
                    <p className="text-2xl font-black text-brand-700 dark:text-brand-300">
                      {evaluation.estimatedBand.toFixed(1)}
                    </p>
                  </div>
                </div>
              </div>

              {/* 4 Criteria Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-xs font-bold text-slate-500">Task Response</span>
                  <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                    {evaluation.taskResponseScore.toFixed(1)}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-xs font-bold text-slate-500">Coherence & Cohesion</span>
                  <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                    {evaluation.coherenceScore.toFixed(1)}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-xs font-bold text-slate-500">Lexical Resource</span>
                  <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                    {evaluation.lexicalScore.toFixed(1)}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-xs font-bold text-slate-500">Grammar & Accuracy</span>
                  <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                    {evaluation.grammarScore.toFixed(1)}
                  </p>
                </div>
              </div>

              {/* Strengths and Weaknesses */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 space-y-2">
                  <h4 className="text-xs font-extrabold uppercase text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    {language === 'vi' ? 'Điểm mạnh' : 'Strengths'}
                  </h4>
                  <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1 list-disc list-inside">
                    {evaluation.strengths.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 space-y-2">
                  <h4 className="text-xs font-extrabold uppercase text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" />
                    {language === 'vi' ? 'Điểm cần cải thiện' : 'Main Weaknesses'}
                  </h4>
                  <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1 list-disc list-inside">
                    {evaluation.weaknesses.map((w, idx) => (
                      <li key={idx}>{w}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Sentence-level Corrections with Reasons */}
              {evaluation.sentenceCorrections && evaluation.sentenceCorrections.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {language === 'vi'
                      ? 'Chi tiết sửa lỗi ngữ pháp từng câu & Giải thích:'
                      : 'Sentence-Level Grammatical Corrections & Explanations:'}
                  </h4>
                  <div className="space-y-3">
                    {evaluation.sentenceCorrections.map((corr, cIdx) => (
                      <div
                        key={cIdx}
                        className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2 text-xs"
                      >
                        <div>
                          <span className="font-bold text-rose-600 dark:text-rose-400">
                            {language === 'vi' ? 'Câu gốc của bạn:' : 'Original:'}
                          </span>
                          <p className="line-through text-slate-600 dark:text-slate-400 mt-0.5">
                            {corr.original}
                          </p>
                        </div>
                        <div>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">
                            {language === 'vi' ? 'Sửa lại chính xác:' : 'Correction:'}
                          </span>
                          <p className="font-bold text-slate-900 dark:text-white mt-0.5">
                            {corr.corrected}
                          </p>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                          <span className="font-bold text-brand-600">
                            {language === 'vi' ? 'Lý do ngữ pháp:' : 'Grammar Reason:'}
                          </span>{' '}
                          {language === 'vi' ? corr.reasonVi : corr.reasonEn}
                        </div>
                        <div>
                          <span className="font-bold text-amber-600 dark:text-amber-400">
                            {language === 'vi' ? 'Nâng cấp đạt chuẩn Band 6.5+:' : 'Band 6.5+ Upgrade:'}
                          </span>
                          <p className="font-semibold text-brand-700 dark:text-brand-300 mt-0.5">
                            "{corr.improvedBand65}"
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
