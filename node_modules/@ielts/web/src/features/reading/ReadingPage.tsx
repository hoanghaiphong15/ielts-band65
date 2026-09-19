import React, { useEffect, useState, useRef } from 'react';
import { useUserStore } from '../../stores/userStore';
import { api } from '../../services/api';
import { Question } from '@ielts/shared';
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  Highlighter,
  ZoomIn,
  ZoomOut,
  Bookmark,
  Eye,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';

export const ReadingPage: React.FC = () => {
  const { language } = useUserStore();
  const [selectedPassage, setSelectedPassage] = useState<number>(1);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [activeQIdx, setActiveQIdx] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Record<string, any>>({});
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [highlightedEvidence, setHighlightedEvidence] = useState<string | null>(null);
  const [bookmarkedParagraphs, setBookmarkedParagraphs] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const passageContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function loadReadingData() {
      setLoading(true);
      try {
        const data = await api.getQuestions({ skill: 'READING', section: selectedPassage });
        setQuestions(data);
        setActiveQIdx(0);
        setUserAnswers({});
        setResults({});
        setHighlightedEvidence(null);
      } catch (err) {
        console.error('Failed to load reading questions:', err);
      } finally {
        setLoading(false);
      }
    }
    loadReadingData();
  }, [selectedPassage]);

  const currentQ = questions[activeQIdx];

  const handleAnswerChange = (qId: string, val: string) => {
    setUserAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  const handleCheckAnswer = async (q: Question) => {
    const userVal = userAnswers[q.id] || '';
    if (!userVal) return;

    try {
      const res = await api.submitAttempt({
        questionId: q.id,
        userResponse: userVal,
      });
      setResults((prev) => ({ ...prev, [q.id]: res }));
      if (res.evidenceQuote) {
        setHighlightedEvidence(res.evidenceQuote);
      }
    } catch (err) {
      console.error('Failed to submit reading answer:', err);
    }
  };

  const toggleBookmark = (para: string) => {
    setBookmarkedParagraphs((prev) => {
      const next = new Set(prev);
      if (next.has(para)) next.delete(para);
      else next.add(para);
      return next;
    });
  };

  const cycleFontSize = () => {
    if (fontSize === 'normal') setFontSize('large');
    else if (fontSize === 'large') setFontSize('xlarge');
    else setFontSize('normal');
  };

  const fontSizeClass = {
    normal: 'text-sm leading-relaxed',
    large: 'text-base leading-relaxed',
    xlarge: 'text-lg leading-loose',
  }[fontSize];

  // Render passage with paragraph bookmarking & evidence highlighting
  const renderPassage = () => {
    if (!currentQ || !currentQ.passageContent) return null;

    const paragraphs = currentQ.passageContent.split('\n\n');

    return (
      <div className="space-y-4">
        {paragraphs.map((para, idx) => {
          const match = para.match(/\[Paragraph ([A-Z])\]/);
          const paraLetter = match ? match[1] : `${idx + 1}`;
          const isBookmarked = bookmarkedParagraphs.has(paraLetter);

          // Check if this paragraph contains the highlighted evidence
          const hasEvidence =
            highlightedEvidence &&
            para.toLowerCase().includes(highlightedEvidence.toLowerCase().slice(0, 30));

          return (
            <div
              key={idx}
              className={`p-4 rounded-2xl transition-all relative group ${
                hasEvidence
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-400 dark:border-amber-600'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black px-2 py-0.5 rounded-md bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300">
                  Paragraph {paraLetter}
                </span>

                <button
                  onClick={() => toggleBookmark(paraLetter)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    isBookmarked
                      ? 'text-amber-500 bg-amber-50 dark:bg-amber-950'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                  title="Bookmark paragraph"
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
                </button>
              </div>

              <p className={`${fontSizeClass} text-slate-800 dark:text-slate-200`}>
                {para}
              </p>
            </div>
          );
        })}
      </div>
    );
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
      {/* Top Passage Selector & Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
        {/* Passage 1, 2, 3 Selector */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {[
            { id: 1, title: 'Passage 1: Vertical Farming' },
            { id: 2, title: 'Passage 2: AI in Education' },
            { id: 3, title: 'Passage 3: Biomimicry Architecture' },
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPassage(p.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 min-h-touch ${
                selectedPassage === p.id
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {p.title}
            </button>
          ))}
        </div>

        {/* Text Zoom & Tools */}
        <div className="flex items-center gap-2">
          <button
            onClick={cycleFontSize}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold hover:bg-slate-100 min-h-touch"
            title="Adjust font size"
          >
            <ZoomIn className="w-3.5 h-3.5 text-brand-600" />
            <span className="capitalize">{fontSize} text</span>
          </button>
        </div>
      </div>

      {/* Main Split Layout on Desktop / Stacked on Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT: Passage Panel (7 Cols) */}
        <div
          ref={passageContainerRef}
          className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xs lg:max-h-[calc(100vh-180px)] lg:overflow-y-auto"
        >
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
            <span className="text-xs font-extrabold text-brand-600 uppercase tracking-wider">
              {language === 'vi' ? 'Đoạn văn học thuật (Academic Reading)' : 'Academic Reading Passage'}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
              {currentQ?.passageTitle}
            </h2>
          </div>

          {renderPassage()}
        </div>

        {/* RIGHT: Questions Panel (5 Cols) */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-20">
          {currentQ && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-5">
              {/* Question Navigation Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
                  Question {activeQIdx + 1} of {questions.length}
                </span>

                <div className="flex items-center gap-1 overflow-x-auto max-w-[200px]">
                  {questions.map((q, idx) => (
                    <button
                      key={q.id}
                      onClick={() => {
                        setActiveQIdx(idx);
                        setHighlightedEvidence(results[q.id]?.evidenceQuote || null);
                      }}
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition-all shrink-0 ${
                        activeQIdx === idx
                          ? 'bg-brand-600 text-white'
                          : results[q.id]?.isCorrect
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : results[q.id]?.isCorrect === false
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question Instructions */}
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {language === 'vi' ? currentQ.instructionVi : currentQ.instruction}
              </div>

              {/* Question Text */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {currentQ.questionText}
                </p>
                {language === 'vi' && currentQ.questionTextVi && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {currentQ.questionTextVi}
                  </p>
                )}
              </div>

              {/* Answer Input Options */}
              {currentQ.questionType === 'true_false_not_given' ? (
                <div className="grid grid-cols-3 gap-2">
                  {['TRUE', 'FALSE', 'NOT GIVEN'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleAnswerChange(currentQ.id, opt)}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all min-h-touch ${
                        userAnswers[currentQ.id] === opt
                          ? 'border-brand-600 bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 ring-2 ring-brand-500/20'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              ) : currentQ.questionType === 'yes_no_not_given' ? (
                <div className="grid grid-cols-3 gap-2">
                  {['YES', 'NO', 'NOT GIVEN'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleAnswerChange(currentQ.id, opt)}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all min-h-touch ${
                        userAnswers[currentQ.id] === opt
                          ? 'border-brand-600 bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 ring-2 ring-brand-500/20'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              ) : currentQ.options && currentQ.options.length > 0 ? (
                <div className="space-y-2">
                  {currentQ.options.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => handleAnswerChange(currentQ.id, opt.id)}
                      className={`w-full p-3 rounded-xl border text-left text-xs font-medium transition-all flex items-start gap-2.5 min-h-touch ${
                        userAnswers[currentQ.id] === opt.id
                          ? 'border-brand-600 bg-brand-50 dark:bg-brand-950 text-brand-900 dark:text-brand-200 font-bold ring-2 ring-brand-500/20'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      <span className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                        {opt.id}
                      </span>
                      <span>{opt.text}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div>
                  <input
                    type="text"
                    value={userAnswers[currentQ.id] || ''}
                    onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                    placeholder="Type word(s) from passage..."
                    className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-semibold text-slate-900 dark:text-white min-h-touch"
                  />
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={() => handleCheckAnswer(currentQ)}
                disabled={!userAnswers[currentQ.id]}
                className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-transform active:scale-95 min-h-touch"
              >
                {language === 'vi' ? 'Kiểm tra đáp án & Dẫn chứng' : 'Check Answer & View Evidence'}
              </button>

              {/* Results & Explanations Card */}
              {results[currentQ.id] && (
                <div
                  className={`p-4 rounded-2xl border space-y-3 ${
                    results[currentQ.id].isCorrect
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/50'
                      : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {results[currentQ.id].isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                    )}
                    <span className="font-black text-xs sm:text-sm">
                      {results[currentQ.id].isCorrect
                        ? language === 'vi'
                          ? 'Chính xác! Làm rất tốt.'
                          : 'Correct answer!'
                        : language === 'vi'
                        ? `Chưa đúng. Đáp án chuẩn: "${results[currentQ.id].correctAnswer}"`
                        : `Incorrect. Correct: "${results[currentQ.id].correctAnswer}"`}
                    </span>
                  </div>

                  {/* Evidence Highlighter Trigger */}
                  {results[currentQ.id].evidenceQuote && (
                    <div className="p-2.5 rounded-xl bg-amber-100/60 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-xs">
                      <span className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5 mb-1">
                        <Eye className="w-3.5 h-3.5" />
                        {language === 'vi' ? 'Dẫn chứng trong bài đọc:' : 'Evidence from passage:'}
                      </span>
                      <p className="italic text-slate-800 dark:text-slate-200">
                        "{results[currentQ.id].evidenceQuote}"
                      </p>
                    </div>
                  )}

                  {/* Bilingual Explanation */}
                  <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed space-y-1">
                    <span className="font-bold">
                      {language === 'vi' ? 'Giải thích lý do:' : 'Why this answer is correct:'}
                    </span>
                    <p>
                      {language === 'vi'
                        ? results[currentQ.id].explanationVi
                        : results[currentQ.id].explanationEn}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
