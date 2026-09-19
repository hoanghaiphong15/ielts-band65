import React, { useEffect, useState, useRef } from 'react';
import { useUserStore } from '../../stores/userStore';
import { api } from '../../services/api';
import { SpeakingPrompt, SpeakingEvaluation } from '@ielts/shared';
import {
  Mic,
  Square,
  Play,
  Pause,
  Clock,
  Sparkles,
  Award,
  Volume2,
  Repeat,
  FileText,
  AlertCircle,
  Lightbulb,
} from 'lucide-react';

export const SpeakingPage: React.FC = () => {
  const { language } = useUserStore();
  const [selectedPart, setSelectedPart] = useState<1 | 2 | 3>(1);
  const [prompts, setPrompts] = useState<SpeakingPrompt[]>([]);
  const [selectedPromptIdx, setSelectedPromptIdx] = useState<number>(0);
  const [mode, setMode] = useState<'standard' | 'shadowing'>('standard');

  // Part 2 Timers
  const [prepSeconds, setPrepSeconds] = useState<number>(60);
  const [isPrepping, setIsPrepping] = useState<boolean>(false);
  const [prepNotes, setPrepNotes] = useState<string>('');

  const [speechSeconds, setSpeechSeconds] = useState<number>(120);
  const [isSpeakingTimerRunning, setIsSpeakingTimerRunning] = useState<boolean>(false);

  // Audio Recording state
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [speechTranscript, setSpeechTranscript] = useState<string>('');
  const [evaluation, setEvaluation] = useState<SpeakingEvaluation | null>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    async function loadPrompts() {
      setLoading(true);
      try {
        const data = await api.getSpeakingPrompts({ part: selectedPart });
        setPrompts(data);
        setSelectedPromptIdx(0);
        setEvaluation(null);
        setAudioUrl(null);
        setSpeechTranscript('');
        setPrepSeconds(60);
        setIsPrepping(false);
        setPrepNotes('');
        setSpeechSeconds(120);
        setIsSpeakingTimerRunning(false);
      } catch (err) {
        console.error('Failed to load speaking prompts:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPrompts();
  }, [selectedPart]);

  // Prep timer countdown
  useEffect(() => {
    let interval: any = null;
    if (isPrepping && prepSeconds > 0) {
      interval = setInterval(() => {
        setPrepSeconds((prev) => {
          if (prev <= 1) {
            setIsPrepping(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPrepping, prepSeconds]);

  // Speaking timer countdown
  useEffect(() => {
    let interval: any = null;
    if (isSpeakingTimerRunning && speechSeconds > 0) {
      interval = setInterval(() => {
        setSpeechSeconds((prev) => {
          if (prev <= 1) {
            setIsSpeakingTimerRunning(false);
            if (isRecording) stopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSpeakingTimerRunning, speechSeconds, isRecording]);

  const activePrompt = prompts[selectedPromptIdx];

  // Start recording using Web Audio API MediaRecorder
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setIsSpeakingTimerRunning(true);
    } catch (err) {
      console.warn('Microphone access unavailable or denied. Using simulated recording mode:', err);
      setIsRecording(true);
      setIsSpeakingTimerRunning(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
    setIsRecording(false);
    setIsSpeakingTimerRunning(false);

    // If no transcript entered, supply sample based on prompt
    if (!speechTranscript.trim() && activePrompt) {
      setSpeechTranscript(
        'Well, speaking of this topic, I think it is very interesting and very important in modern society. Um, for instance, people is using technology every day to communicate. Actually, it has a lot of advantages for our daily routine.'
      );
    }
  };

  const handleEvaluateSpeech = async () => {
    if (!activePrompt || !speechTranscript.trim()) return;
    setIsEvaluating(true);

    try {
      const duration = 120 - speechSeconds || 45;
      const res = await api.submitSpeaking({
        promptId: activePrompt.id,
        part: selectedPart,
        transcript: speechTranscript,
        durationSecs: duration,
      });
      setEvaluation(res.evaluation);
    } catch (err) {
      console.error('Failed to evaluate speech:', err);
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
      {/* Top Controls: Part 1, Part 2, Part 3 and Modes */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
        {/* Parts 1, 2, 3 */}
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((part) => (
            <button
              key={part}
              onClick={() => setSelectedPart(part as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all min-h-touch ${
                selectedPart === part
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              Part {part}
            </button>
          ))}
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode('standard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors min-h-touch ${
              mode === 'standard'
                ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                : 'border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
            }`}
          >
            {language === 'vi' ? 'Luyện nói chuẩn' : 'Standard Test'}
          </button>
          <button
            onClick={() => setMode('shadowing')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors min-h-touch ${
              mode === 'shadowing'
                ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                : 'border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
            }`}
          >
            {language === 'vi' ? 'Shadowing (Nói đuổi)' : 'Shadowing Mode'}
          </button>
        </div>
      </div>

      {activePrompt && (
        <div className="space-y-6">
          {/* Prompt Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-brand-600 tracking-wider">
                IELTS Speaking Part {selectedPart}: {activePrompt.topic}
              </span>

              {/* Prompts Carousel */}
              <div className="flex items-center gap-1 overflow-x-auto max-w-[200px]">
                {prompts.map((p, idx) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedPromptIdx(idx);
                      setEvaluation(null);
                      setAudioUrl(null);
                      setSpeechTranscript('');
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

            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white whitespace-pre-line leading-relaxed">
                {activePrompt.question}
              </h3>
              {language === 'vi' && activePrompt.questionVi && (
                <p className="text-xs text-slate-500 dark:text-slate-400 whitespace-pre-line">
                  {activePrompt.questionVi}
                </p>
              )}
            </div>

            {/* Part 2 Timers: 1 min prep and 2 min speaking */}
            {selectedPart === 2 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1-min Prep Box */}
                <div className="p-4 rounded-2xl bg-brand-50/60 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-900/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-brand-800 dark:text-brand-300">
                      {language === 'vi' ? '1 Phút chuẩn bị (Prep Time):' : '1-Min Preparation Time:'}
                    </span>
                    <span className="text-sm font-black text-brand-700 dark:text-brand-400">
                      {prepSeconds}s
                    </span>
                  </div>

                  <textarea
                    rows={3}
                    value={prepNotes}
                    onChange={(e) => setPrepNotes(e.target.value)}
                    placeholder="Jot down keywords, collocations, and ideas here..."
                    className="w-full p-2.5 rounded-xl border border-brand-200 dark:border-brand-900 bg-white dark:bg-slate-900 text-xs font-medium"
                  />

                  <button
                    onClick={() => setIsPrepping(!isPrepping)}
                    className="w-full py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold min-h-touch"
                  >
                    {isPrepping ? 'Pause 1-Min Prep' : 'Start 1-Min Prep'}
                  </button>
                </div>

                {/* 2-min Speech Timer */}
                <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-900 dark:text-amber-300">
                      {language === 'vi' ? '2 Phút nói (Speaking Time):' : '2-Min Speech Time:'}
                    </span>
                    <span className="text-sm font-black text-amber-700 dark:text-amber-400">
                      {Math.floor(speechSeconds / 60)}:{(speechSeconds % 60).toString().padStart(2, '0')}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {language === 'vi'
                      ? 'Nói liên tục đến khi hết giờ. Cố gắng sử dụng các thì quá khứ và từ vựng phong phú.'
                      : 'Speak continuously until time expires. Use diverse collocations and past tense narratives.'}
                  </p>
                </div>
              </div>
            )}

            {/* Useful Collocations */}
            {activePrompt.usefulPhrases && activePrompt.usefulPhrases.length > 0 && (
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {language === 'vi' ? 'Cụm từ ghi điểm Band 6.5+:' : 'Band 6.5+ Useful Collocations:'}
                </span>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {activePrompt.usefulPhrases.map((phrase, pIdx) => (
                    <span
                      key={pIdx}
                      className="text-xs px-2.5 py-1 rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-900/60 font-semibold"
                    >
                      {phrase}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Recording & Speech Evaluation Box */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <h4 className="font-black text-base text-slate-900 dark:text-white">
                  {language === 'vi' ? 'Ghi âm câu trả lời của bạn' : 'Record Your Speech'}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {language === 'vi'
                    ? 'Sử dụng micro thiết bị để ghi âm và nhận phản hồi chi tiết.'
                    : 'Use device microphone to record and receive targeted fluency feedback.'}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-transform active:scale-95 min-h-touch"
                  >
                    <Mic className="w-4 h-4" />
                    <span>{language === 'vi' ? 'Bắt đầu ghi âm' : 'Start Recording'}</span>
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-md flex items-center gap-2 animate-pulse min-h-touch"
                  >
                    <Square className="w-4 h-4 fill-white" />
                    <span>{language === 'vi' ? 'Dừng ghi âm' : 'Stop Recording'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Audio Playback if recorded */}
            {audioUrl && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  {language === 'vi' ? 'Bản ghi âm của bạn:' : 'Your Recording:'}
                </span>
                <audio controls src={audioUrl} className="w-full" />
              </div>
            )}

            {/* Transcript & Speech Evaluation */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                {language === 'vi'
                  ? 'Bản chép lời nói (Transcript) để phân tích từ vựng & ngữ pháp:'
                  : 'Speech Transcript for Lexical & Grammatical Analysis:'}
              </label>
              <textarea
                rows={4}
                value={speechTranscript}
                onChange={(e) => setSpeechTranscript(e.target.value)}
                placeholder="Type or review what you said here..."
                className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs sm:text-sm font-medium leading-relaxed"
              />

              <div className="flex justify-end">
                <button
                  onClick={handleEvaluateSpeech}
                  disabled={isEvaluating || !speechTranscript.trim()}
                  className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold text-xs shadow-md flex items-center gap-2 min-h-touch"
                >
                  {isEvaluating ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                      <span>{language === 'vi' ? 'Đang chấm bài nói...' : 'Evaluating Speech...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>{language === 'vi' ? 'Chấm điểm bài nói' : 'Evaluate Speaking'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Speaking Evaluation Results */}
            {evaluation && (
              <div className="p-6 rounded-3xl bg-brand-50/50 dark:bg-brand-950/30 border border-brand-200 dark:border-brand-900/50 space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
                      {language === 'vi' ? 'Kết quả chấm nói Band 6.5' : 'Speaking Assessment Result'}
                    </span>
                    <h4 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                      Estimated Band: {evaluation.estimatedBand.toFixed(1)}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-8 h-8 text-brand-600" />
                  </div>
                </div>

                {/* 4 Criteria Scores */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                    <span className="text-[11px] font-bold text-slate-500">Fluency & Coherence</span>
                    <p className="text-lg font-black text-slate-900 dark:text-white mt-1">
                      {evaluation.fluencyScore.toFixed(1)}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                    <span className="text-[11px] font-bold text-slate-500">Lexical Resource</span>
                    <p className="text-lg font-black text-slate-900 dark:text-white mt-1">
                      {evaluation.lexicalScore.toFixed(1)}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                    <span className="text-[11px] font-bold text-slate-500">Grammar</span>
                    <p className="text-lg font-black text-slate-900 dark:text-white mt-1">
                      {evaluation.grammarScore.toFixed(1)}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                    <span className="text-[11px] font-bold text-slate-500">Pronunciation</span>
                    <p className="text-lg font-black text-slate-900 dark:text-white mt-1">
                      {evaluation.pronunciationScore.toFixed(1)}
                    </p>
                  </div>
                </div>

                {/* Vietnamese Feedback */}
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <span className="font-bold text-brand-600 block mb-1">
                    Nhận xét cho thí sinh Việt Nam:
                  </span>
                  {evaluation.feedbackVi}
                </div>

                {/* Collocation Tips: "very interesting" -> "fascinating" */}
                {evaluation.vocabularyRecommendations &&
                  evaluation.vocabularyRecommendations.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-amber-700 dark:text-amber-400">
                        {language === 'vi'
                          ? 'Cụm từ nên nâng cấp để đạt Band 6.5+:'
                          : 'Recommended Vocabulary Upgrades:'}
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {evaluation.vocabularyRecommendations.map((tip, tIdx) => (
                          <div
                            key={tIdx}
                            className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs"
                          >
                            <div className="text-rose-600 line-through font-semibold">
                              "{tip.overusedWord}"
                            </div>
                            <div className="text-emerald-600 font-bold mt-1">
                              → Thử dùng: {tip.suggestedAlternatives.join(', ')}
                            </div>
                            <div className="italic text-slate-500 mt-1">
                              Ví dụ: "{tip.exampleSentence}"
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Model Answer */}
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
                    {language === 'vi' ? 'Câu trả lời mẫu Band 6.5+:' : 'Band 6.5+ Model Answer:'}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed italic">
                    "{evaluation.modelAnswer}"
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
