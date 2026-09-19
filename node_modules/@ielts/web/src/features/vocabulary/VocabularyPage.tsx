import React, { useEffect, useState } from 'react';
import { useUserStore } from '../../stores/userStore';
import { api } from '../../services/api';
import { VocabularyItem } from '@ielts/shared';
import {
  BookMarked,
  Search,
  Volume2,
  RotateCw,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  ChevronRight,
  Filter,
} from 'lucide-react';

const TOPICS = [
  'All Topics',
  'Education',
  'Technology',
  'Environment',
  'Health',
  'Work',
  'Business',
  'Society',
  'Crime',
  'Government',
  'Globalization',
  'Transportation',
  'Culture',
  'Media',
  'Science',
];

export const VocabularyPage: React.FC = () => {
  const { language } = useUserStore();
  const [activeTab, setActiveTab] = useState<'browse' | 'review'>('browse');
  const [selectedTopic, setSelectedTopic] = useState<string>('All Topics');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);
  const [reviewQueue, setReviewQueue] = useState<any[]>([]);
  const [currentReviewIdx, setCurrentReviewIdx] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [vocabData, queueData, statsData] = await Promise.all([
          api.getVocabulary({
            topic: selectedTopic === 'All Topics' ? undefined : selectedTopic,
            search: searchQuery || undefined,
          }),
          api.getVocabReviewQueue(),
          api.getVocabStats(),
        ]);
        setVocabulary(vocabData);
        setReviewQueue(queueData);
        setStats(statsData);
      } catch (err) {
        console.error('Failed to load vocabulary data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [selectedTopic, searchQuery]);

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleReviewRating = async (quality: number) => {
    if (reviewQueue.length === 0) return;
    const currentItem = reviewQueue[currentReviewIdx];

    try {
      await api.submitVocabReview(currentItem.id, quality);
      setIsFlipped(false);

      if (currentReviewIdx < reviewQueue.length - 1) {
        setCurrentReviewIdx((prev) => prev + 1);
      } else {
        // Refresh review queue
        const refreshedQueue = await api.getVocabReviewQueue();
        const refreshedStats = await api.getVocabStats();
        setReviewQueue(refreshedQueue);
        setStats(refreshedStats);
        setCurrentReviewIdx(0);
      }
    } catch (err) {
      console.error('Failed to submit review:', err);
    }
  };

  const currentReviewItem = reviewQueue[currentReviewIdx];

  return (
    <div className="space-y-6">
      {/* Top Header & Mode Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all min-h-touch ${
              activeTab === 'browse'
                ? 'bg-brand-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            {language === 'vi' ? 'Khám phá từ vựng theo chủ đề' : 'Browse 14 Topics'}
          </button>
          <button
            onClick={() => {
              setActiveTab('review');
              setIsFlipped(false);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 min-h-touch ${
              activeTab === 'review'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>
              {language === 'vi' ? 'Ôn tập ngắt quãng (SRS)' : 'SRS Review Queue'}
            </span>
            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-white/20 text-[10px]">
              {reviewQueue.length}
            </span>
          </button>
        </div>

        {/* Stats Pills */}
        {stats && (
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
              {stats.masteredCount} {language === 'vi' ? 'Thành thạo' : 'Mastered'}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-900">
              {stats.learningCount} {language === 'vi' ? 'Đang học' : 'Learning'}
            </span>
          </div>
        )}
      </div>

      {/* Mode 1: Browse by 14 Topics */}
      {activeTab === 'browse' && (
        <div className="space-y-5">
          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search word, meaning, or definition..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium text-slate-900 dark:text-white min-h-touch"
              />
            </div>

            {/* Topics Bar */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {TOPICS.slice(0, 8).map((topic) => (
                <button
                  key={topic}
                  onClick={() => setSelectedTopic(topic)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 min-h-touch ${
                    selectedTopic === topic
                      ? 'bg-brand-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          {/* Word Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vocabulary.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-black text-slate-900 dark:text-white">
                        {item.word}
                      </h3>
                      <button
                        onClick={() => handleSpeak(item.word)}
                        className="p-1 text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950 rounded-md"
                        title="Pronounce"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-xs text-slate-500 font-mono">{item.ipa}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {item.pos}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                      Band {item.targetBand.toFixed(1)}
                    </span>
                  </div>
                </div>

                {/* Vietnamese Meaning */}
                <div className="p-2.5 rounded-xl bg-brand-50/60 dark:bg-brand-950/40 border border-brand-100 dark:border-brand-900/60 text-xs font-bold text-brand-900 dark:text-brand-200">
                  {item.meaningVi}
                </div>

                {/* English Definition */}
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.definitionEn}
                </p>

                {/* Example */}
                <div className="text-xs border-t border-slate-100 dark:border-slate-800 pt-2 space-y-1">
                  <p className="font-semibold text-slate-800 dark:text-slate-200 italic">
                    "{item.exampleSentence}"
                  </p>
                  {item.exampleSentenceVi && (
                    <p className="text-slate-500 text-[11px]">{item.exampleSentenceVi}</p>
                  )}
                </div>

                {/* Collocations */}
                {item.collocations && item.collocations.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {item.collocations.map((col, cIdx) => (
                      <span
                        key={cIdx}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                      >
                        {col}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mode 2: Interactive Flashcard SRS Review */}
      {activeTab === 'review' && (
        <div className="max-w-xl mx-auto space-y-6">
          {reviewQueue.length > 0 && currentReviewItem ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span>
                  {language === 'vi' ? 'Thẻ' : 'Card'} {currentReviewIdx + 1} / {reviewQueue.length}
                </span>
                <span>Topic: {currentReviewItem.topic}</span>
              </div>

              {/* Flashcard with Flip Animation */}
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="cursor-pointer min-h-[320px] rounded-3xl p-7 flex flex-col justify-between transition-all bg-white dark:bg-slate-900 border-2 border-brand-200 dark:border-brand-900 shadow-lg text-center"
              >
                {!isFlipped ? (
                  // Front of Flashcard
                  <div className="my-auto space-y-4">
                    <span className="text-xs font-bold uppercase text-brand-600 tracking-wider">
                      {currentReviewItem.pos} • Band {currentReviewItem.targetBand.toFixed(1)}
                    </span>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white">
                      {currentReviewItem.word}
                    </h2>
                    <p className="text-sm font-mono text-slate-500">{currentReviewItem.ipa}</p>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSpeak(currentReviewItem.word);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-50 text-brand-700 text-xs font-bold mx-auto"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>{language === 'vi' ? 'Nghe phát âm' : 'Listen'}</span>
                    </button>

                    <p className="text-xs text-slate-400 mt-6">
                      {language === 'vi'
                        ? '👉 Chạm vào thẻ để xem nghĩa tiếng Việt & ví dụ'
                        : '👉 Tap card to reveal Vietnamese meaning & examples'}
                    </p>
                  </div>
                ) : (
                  // Back of Flashcard
                  <div className="my-auto space-y-4 text-left">
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900">
                      <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                        Ý nghĩa tiếng Việt:
                      </span>
                      <p className="text-base font-extrabold text-emerald-900 dark:text-emerald-100 mt-0.5">
                        {currentReviewItem.meaningVi}
                      </p>
                    </div>

                    <div>
                      <span className="text-xs font-bold text-slate-500">Definition:</span>
                      <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5">
                        {currentReviewItem.definitionEn}
                      </p>
                    </div>

                    <div>
                      <span className="text-xs font-bold text-slate-500">Example:</span>
                      <p className="text-xs italic text-slate-800 dark:text-slate-200 mt-0.5">
                        "{currentReviewItem.exampleSentence}"
                      </p>
                    </div>

                    {currentReviewItem.collocations && currentReviewItem.collocations.length > 0 && (
                      <div>
                        <span className="text-xs font-bold text-slate-500">Collocations:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {currentReviewItem.collocations.map((c: string, idx: number) => (
                            <span
                              key={idx}
                              className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-semibold"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* SM-2 Recall Quality Buttons */}
              <div className="grid grid-cols-4 gap-2 pt-2">
                <button
                  onClick={() => handleReviewRating(0)}
                  className="p-3 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 font-bold text-xs min-h-touch"
                >
                  {language === 'vi' ? 'Quên (0)' : 'Again (0)'}
                </button>
                <button
                  onClick={() => handleReviewRating(3)}
                  className="p-3 rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold text-xs min-h-touch"
                >
                  {language === 'vi' ? 'Khó (3)' : 'Hard (3)'}
                </button>
                <button
                  onClick={() => handleReviewRating(4)}
                  className="p-3 rounded-xl border border-brand-200 dark:border-brand-900 bg-brand-50 dark:bg-brand-950/60 text-brand-800 dark:text-brand-300 font-bold text-xs min-h-touch"
                >
                  {language === 'vi' ? 'Nhớ (4)' : 'Good (4)'}
                </button>
                <button
                  onClick={() => handleReviewRating(5)}
                  className="p-3 rounded-xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold text-xs min-h-touch"
                >
                  {language === 'vi' ? 'Dễ (5)' : 'Easy (5)'}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {language === 'vi'
                  ? 'Tuyệt vời! Bạn đã hoàn thành hết từ vựng cần ôn hôm nay.'
                  : 'All caught up! No more words due for review today.'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'vi'
                  ? 'Hệ thống sẽ nhắc nhở bạn vào ngày mai theo chu kỳ lặp lại ngắt quãng SM-2.'
                  : 'The system will schedule future reviews based on the SuperMemo SM-2 algorithm.'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
