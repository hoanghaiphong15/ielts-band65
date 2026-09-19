import React, { useEffect, useState } from 'react';
import { useUserStore } from '../../stores/userStore';
import { api } from '../../services/api';
import { Question } from '@ielts/shared';
import { AudioPlayer } from '../../components/AudioPlayer';
import {
  Headphones,
  CheckCircle2,
  XCircle,
  Sparkles,
  HelpCircle,
  FileText,
  Repeat,
  Volume2,
  ChevronRight,
  PenTool,
} from 'lucide-react';

export const ListeningPage: React.FC = () => {
  const { language } = useUserStore();
  const [selectedSection, setSelectedSection] = useState<number>(1);
  const [mode, setMode] = useState<'standard' | 'dictation' | 'shadowing'>('standard');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [activeQuestionIdx, setActiveQuestionIdx] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Record<string, any>>({});
  const [showTranscript, setShowTranscript] = useState(false);
  const [loading, setLoading] = useState(true);

  // Dictation mode state
  const [dictationInput, setDictationInput] = useState('');
  const [dictationSubmitted, setDictationSubmitted] = useState(false);

  useEffect(() => {
    async function loadSectionQuestions() {
      setLoading(true);
      try {
        const data = await api.getQuestions({ skill: 'LISTENING', section: selectedSection });
        setQuestions(data);
        setActiveQuestionIdx(0);
        setUserAnswers({});
        setResults({});
        setShowTranscript(false);
        setDictationInput('');
        setDictationSubmitted(false);
      } catch (err) {
        console.error('Failed to load listening questions:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSectionQuestions();
  }, [selectedSection]);

  const currentQ = questions[activeQuestionIdx];

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
    } catch (err) {
      console.error('Failed to submit answer:', err);
    }
  };

  // Dictation diff checker
  const renderDictationDiff = () => {
    if (!currentQ || !currentQ.evidenceQuote) return null;
    const expectedWords = currentQ.evidenceQuote.trim().split(/\s+/);
    const userWords = dictationInput.trim().split(/\s+/);

    return (
      <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          {language === 'vi' ? 'So sánh kết quả chép chính tả:' : 'Dictation Comparison:'}
        </div>
        <div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {language === 'vi' ? 'Câu gốc chuẩn:' : 'Expected:'}
          </span>
          <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
            {currentQ.evidenceQuote}
          </p>
        </div>
        <div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {language === 'vi' ? 'Bạn đã gõ:' : 'Your input:'}
          </span>
          <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mt-0.5">
            {userWords.map((w, idx) => {
              const matches =
                expectedWords[idx] &&
                w.toLowerCase().replace(/[^a-z0-9]/g, '') ===
                  expectedWords[idx].toLowerCase().replace(/[^a-z0-9]/g, '');
              return (
                <span
                  key={idx}
                  className={`inline-block mr-1.5 px-1 py-0.5 rounded ${
                    matches
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-bold underline'
                  }`}
                >
                  {w}
                </span>
              );
            })}
          </p>
        </div>
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
      {/* Top Section Tabs & Modes */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
        {/* Section Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[1, 2, 3, 4].map((sec) => (
            <button
              key={sec}
              onClick={() => setSelectedSection(sec)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 min-h-touch ${
                selectedSection === sec
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              Section {sec}
            </button>
          ))}
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {[
            { id: 'standard', labelEn: 'Standard', labelVi: 'Tiêu chuẩn' },
            { id: 'dictation', labelEn: 'Dictation', labelVi: 'Chép chính tả' },
            { id: 'shadowing', labelEn: 'Shadowing', labelVi: 'Shadowing' },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id as any)}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold transition-colors min-h-touch ${
                mode === m.id
                  ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                  : 'border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
              }`}
            >
              {language === 'vi' ? m.labelVi : m.labelEn}
            </button>
          ))}
        </div>
      </div>

      {currentQ && (
        <div className="space-y-6">
          {/* Audio Player Card */}
          <AudioPlayer
            transcript={currentQ.transcript}
            audioUrl={currentQ.audioUrl}
          />

          {/* Standard Practice Mode */}
          {mode === 'standard' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xs space-y-6">
              {/* Question Header & Navigation */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
                    {language === 'vi' ? currentQ.instructionVi : currentQ.instruction}
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-1">
                    Question {activeQuestionIdx + 1} of {questions.length}: {currentQ.topic}
                  </h3>
                </div>

                <div className="flex items-center gap-1.5">
                  {questions.map((q, idx) => (
                    <button
                      key={q.id}
                      onClick={() => setActiveQuestionIdx(idx)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                        activeQuestionIdx === idx
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

              {/* Question Text */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
                  {currentQ.questionText}
                </p>
                {language === 'vi' && currentQ.questionTextVi && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {currentQ.questionTextVi}
                  </p>
                )}
              </div>

              {/* Options or Text Input */}
              {currentQ.options && currentQ.options.length > 0 ? (
                <div className="space-y-2.5">
                  {currentQ.options.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => handleAnswerChange(currentQ.id, opt.id)}
                      className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all flex items-start gap-3 min-h-touch ${
                        userAnswers[currentQ.id] === opt.id
                          ? 'border-brand-600 bg-brand-50 dark:bg-brand-950 text-brand-900 dark:text-brand-200 font-bold ring-2 ring-brand-500/20'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        {opt.id}
                      </span>
                      <div>
                        <div>{opt.text}</div>
                        {language === 'vi' && opt.textVi && (
                          <div className="text-xs text-slate-500 mt-0.5">{opt.textVi}</div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    {language === 'vi' ? 'Nhập câu trả lời của bạn:' : 'Type your answer:'}
                  </label>
                  <input
                    type="text"
                    value={userAnswers[currentQ.id] || ''}
                    onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                    placeholder="e.g. Mitchell, single, 650"
                    className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-semibold text-slate-900 dark:text-white min-h-touch"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  onClick={() => setShowTranscript(!showTranscript)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 min-h-touch"
                >
                  <FileText className="w-4 h-4 text-brand-600" />
                  <span>
                    {showTranscript
                      ? language === 'vi'
                        ? 'Ẩn lời thoại'
                        : 'Hide Transcript'
                      : language === 'vi'
                      ? 'Xem lời thoại'
                      : 'Show Transcript'}
                  </span>
                </button>

                <button
                  onClick={() => handleCheckAnswer(currentQ)}
                  disabled={!userAnswers[currentQ.id]}
                  className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-transform active:scale-95 min-h-touch"
                >
                  {language === 'vi' ? 'Kiểm tra đáp án' : 'Check Answer'}
                </button>
              </div>

              {/* Feedback & Explanations Card */}
              {results[currentQ.id] && (
                <div
                  className={`p-5 rounded-2xl border space-y-3 ${
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
                    <span className="font-extrabold text-sm">
                      {results[currentQ.id].isCorrect
                        ? language === 'vi'
                          ? 'Chính xác! Làm rất tốt.'
                          : 'Correct! Well done.'
                        : language === 'vi'
                        ? `Chưa chính xác. Đáp án đúng: "${results[currentQ.id].correctAnswer}" (Đã lưu vào Sổ tay lỗi sai)`
                        : `Incorrect. Correct answer: "${results[currentQ.id].correctAnswer}" (Saved to Mistake Book)`}
                    </span>
                  </div>

                  {results[currentQ.id].evidenceQuote && (
                    <div className="text-xs p-3 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800">
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        {language === 'vi' ? 'Dẫn chứng từ bài nghe:' : 'Evidence from Audio:'}
                      </span>
                      <p className="italic text-slate-800 dark:text-slate-200 mt-0.5">
                        "{results[currentQ.id].evidenceQuote}"
                      </p>
                    </div>
                  )}

                  <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    <span className="font-bold">
                      {language === 'vi' ? 'Giải thích chi tiết:' : 'Explanation:'}
                    </span>{' '}
                    {language === 'vi'
                      ? results[currentQ.id].explanationVi
                      : results[currentQ.id].explanationEn}
                  </div>
                </div>
              )}

              {/* Transcript Drawer */}
              {showTranscript && (
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3">
                  <h4 className="font-bold text-xs uppercase text-slate-500 tracking-wider">
                    {language === 'vi' ? 'Lời thoại đầy đủ (Transcript)' : 'Full Transcript'}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed">
                    {currentQ.transcript}
                  </p>
                  {language === 'vi' && currentQ.transcriptVi && (
                    <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
                      <span className="text-xs font-bold text-brand-600">Bản dịch tiếng Việt:</span>
                      <p className="text-xs text-slate-600 dark:text-slate-400 whitespace-pre-line mt-1">
                        {currentQ.transcriptVi}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Dictation Mode */}
          {mode === 'dictation' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xs space-y-6">
              <div>
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                  {language === 'vi' ? 'Chế độ luyện nghe chép chính tả' : 'Dictation Mode'}
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-1">
                  {language === 'vi'
                    ? 'Nghe đoạn audio và gõ lại từng từ bạn nghe được'
                    : 'Listen to the audio segment and type what you hear'}
                </h3>
              </div>

              <textarea
                rows={4}
                value={dictationInput}
                onChange={(e) => setDictationInput(e.target.value)}
                placeholder="Type the exact sentence here..."
                className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-medium"
              />

              <div className="flex justify-end">
                <button
                  onClick={() => setDictationSubmitted(true)}
                  disabled={!dictationInput.trim()}
                  className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold text-xs shadow-md min-h-touch"
                >
                  {language === 'vi' ? 'So sánh kết quả' : 'Compare Dictation'}
                </button>
              </div>

              {dictationSubmitted && renderDictationDiff()}
            </div>
          )}

          {/* Shadowing Mode */}
          {mode === 'shadowing' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xs space-y-6">
              <div>
                <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
                  {language === 'vi' ? 'Chế độ Shadowing (Nói đuổi)' : 'Shadowing Mode'}
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-1">
                  {language === 'vi'
                    ? 'Nghe từng câu mẫu, nhẩm theo và phát âm chuẩn xác ngữ điệu'
                    : 'Listen to each sentence, shadow simultaneously, and mimic intonation'}
                </h3>
              </div>

              <div className="p-5 rounded-2xl bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-900/50 space-y-3">
                <span className="text-xs font-bold text-brand-700 dark:text-brand-300">
                  {language === 'vi' ? 'Câu mẫu để nhại giọng (Shadowing sentence):' : 'Model Sentence:'}
                </span>
                <p className="text-base font-bold text-slate-900 dark:text-white">
                  "{currentQ.evidenceQuote || currentQ.questionText}"
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <Repeat className="w-4 h-4 text-brand-600" />
                  <span>
                    {language === 'vi'
                      ? 'Khuyên dùng: Phát lại ở tốc độ 0.75x trước, sau đó tăng lên 1.0x khi đã quen khẩu hình.'
                      : 'Recommendation: Replay at 0.75x first, then increase to 1.0x once comfortable.'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
