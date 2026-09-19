import React, { useEffect, useState } from 'react';
import { useUserStore } from '../../stores/userStore';
import { api } from '../../services/api';
import { GrammarLesson } from '@ielts/shared';
import {
  GraduationCap,
  CheckCircle2,
  XCircle,
  BookOpen,
  ChevronRight,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';

export const GrammarPage: React.FC = () => {
  const { language } = useUserStore();
  const [lessons, setLessons] = useState<any[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState<string>('tenses');
  const [currentLesson, setCurrentLesson] = useState<GrammarLesson | null>(null);
  const [exerciseAnswers, setExerciseAnswers] = useState<Record<string, string>>({});
  const [exerciseResults, setExerciseResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadLessonList() {
      try {
        const list = await api.getGrammarLessons();
        setLessons(list);
        if (list.length > 0) {
          setSelectedTopicId(list[0].topicId);
        }
      } catch (err) {
        console.error('Failed to load grammar lessons:', err);
      }
    }
    loadLessonList();
  }, []);

  useEffect(() => {
    async function loadSingleLesson() {
      if (!selectedTopicId) return;
      setLoading(true);
      try {
        const lesson = await api.getGrammarLesson(selectedTopicId);
        setCurrentLesson(lesson);
        setExerciseAnswers({});
        setExerciseResults({});
      } catch (err) {
        console.error('Failed to load lesson detail:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSingleLesson();
  }, [selectedTopicId]);

  const handleCheckExercise = async (exId: string) => {
    const ans = exerciseAnswers[exId];
    if (!ans) return;

    try {
      const res = await api.checkGrammarExercise(exId, ans);
      setExerciseResults((prev) => ({ ...prev, [exId]: res }));
    } catch (err) {
      console.error('Failed to check grammar exercise:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Lessons Selector Tabs */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {lessons.map((les) => (
            <button
              key={les.topicId}
              onClick={() => setSelectedTopicId(les.topicId)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 min-h-touch ${
                selectedTopicId === les.topicId
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {language === 'vi' ? les.titleVi.split(':')[0] : les.title.split(':')[0]}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full" />
        </div>
      ) : currentLesson ? (
        <div className="space-y-6">
          {/* Lesson Header Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-brand-600 tracking-wider">
                IELTS Grammar Band {currentLesson.bandTarget.toFixed(1)}+
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-brand-100 text-brand-800 font-bold">
                {currentLesson.exercises?.length || 0} {language === 'vi' ? 'bài tập' : 'exercises'}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {language === 'vi' ? currentLesson.titleVi : currentLesson.title}
            </h2>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
              <p>{language === 'vi' ? currentLesson.explanationVi : currentLesson.explanationEn}</p>
            </div>

            {/* Key Rules */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                {language === 'vi' ? 'Quy tắc ngữ pháp trọng tâm:' : 'Core Grammar Rules:'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentLesson.keyRules?.map((rule, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-brand-50/50 dark:bg-brand-950/30 border border-brand-100 dark:border-brand-900/60 space-y-2 text-xs"
                  >
                    <span className="font-bold text-brand-900 dark:text-brand-200">
                      {language === 'vi' ? rule.ruleVi : rule.ruleEn}
                    </span>
                    <p className="italic text-slate-700 dark:text-slate-300">
                      "{rule.example}"
                    </p>
                    {language === 'vi' && rule.exampleVi && (
                      <p className="text-slate-500 text-[11px]">{rule.exampleVi}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Common Traps for Vietnamese Learners */}
            {currentLesson.commonMistakes && currentLesson.commonMistakes.length > 0 && (
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold uppercase text-rose-600 tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  {language === 'vi' ? 'Lỗi sai phổ biến của thí sinh Việt Nam:' : 'Common Vietnamese Learner Pitfalls:'}
                </h3>
                <div className="space-y-2">
                  {currentLesson.commonMistakes.map((mistake, mIdx) => (
                    <div
                      key={mIdx}
                      className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-xs space-y-1.5"
                    >
                      <div className="text-rose-700 dark:text-rose-300 font-semibold line-through">
                        ✗ {mistake.incorrect}
                      </div>
                      <div className="text-emerald-700 dark:text-emerald-300 font-bold">
                        ✓ {mistake.correct}
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                        {language === 'vi' ? mistake.explanationVi : mistake.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Interactive Exercises */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <span>{language === 'vi' ? 'Bài tập thực hành tương tác' : 'Interactive Practice Exercises'}</span>
            </h3>

            <div className="space-y-5">
              {currentLesson.exercises?.map((ex, exIdx) => (
                <div
                  key={ex.id}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-brand-600 uppercase">
                      Exercise {exIdx + 1}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {language === 'vi' ? ex.instructionVi : ex.instruction}
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {ex.prompt}
                  </p>
                  {language === 'vi' && ex.promptVi && (
                    <p className="text-xs text-slate-500">{ex.promptVi}</p>
                  )}

                  {/* Options */}
                  {ex.options && ex.options.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {ex.options.map((opt, oIdx) => (
                        <button
                          key={oIdx}
                          onClick={() => setExerciseAnswers((prev) => ({ ...prev, [ex.id]: opt }))}
                          className={`p-3 rounded-xl border text-left text-xs font-bold transition-all min-h-touch ${
                            exerciseAnswers[ex.id] === opt
                              ? 'border-brand-600 bg-brand-50 text-brand-900 ring-2 ring-brand-500/20'
                              : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => handleCheckExercise(ex.id)}
                      disabled={!exerciseAnswers[ex.id]}
                      className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold text-xs shadow-xs min-h-touch"
                    >
                      {language === 'vi' ? 'Kiểm tra' : 'Check'}
                    </button>
                  </div>

                  {/* Exercise Feedback */}
                  {exerciseResults[ex.id] && (
                    <div
                      className={`p-4 rounded-xl border space-y-1.5 text-xs ${
                        exerciseResults[ex.id].isCorrect
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900'
                          : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {exerciseResults[ex.id].isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-600" />
                        )}
                        <span className="font-bold">
                          {exerciseResults[ex.id].isCorrect
                            ? language === 'vi'
                              ? 'Chính xác!'
                              : 'Correct!'
                            : language === 'vi'
                            ? `Chưa đúng. Đáp án chuẩn: "${exerciseResults[ex.id].correctAnswer}"`
                            : `Incorrect. Correct answer: "${exerciseResults[ex.id].correctAnswer}"`}
                        </span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300">
                        {language === 'vi'
                          ? exerciseResults[ex.id].explanationVi
                          : exerciseResults[ex.id].explanationEn}
                      </p>
                      {exerciseResults[ex.id].bandTrapNotes && (
                        <p className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold italic">
                          💡 Lưu ý Band 6.5+: {exerciseResults[ex.id].bandTrapNotes}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
